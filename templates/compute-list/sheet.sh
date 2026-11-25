#!/usr/bin/env bash
# sheet.sh: your compute list from the plan catalog and your own plans. Bash and jq only.
#
#   bash sheet.sh CATALOG MINE                    print the sheet (a Markdown table)
#   bash sheet.sh CATALOG MINE --write FILE       replace the part of FILE between the sheet markers
#   bash sheet.sh CATALOG MINE --json             one row per plan, for board.html
#   bash sheet.sh CATALOG MINE --ladders          the plans that carry a lane and a rung, each lane's rungs in order
#
# CATALOG is vendor/plans.json (bash sync.sh copies it). MINE is your mine.json (see mine.example.json). An id that is
# not in the catalog is flagged, never dropped. Every value from these files is data: this script prints it, never runs it.
set -euo pipefail

usage() { echo "usage: bash sheet.sh CATALOG MINE [--write FILE | --json | --ladders]" >&2; exit 2; }
[ $# -ge 2 ] || usage
CATALOG=$1 MINE=$2 MODE=${3:-table} ARG=${4:-}
for f in "$CATALOG" "$MINE"; do [ -r "$f" ] || { echo "sheet.sh: cannot read $f" >&2; exit 2; }; done
command -v jq >/dev/null || { echo "sheet.sh: needs jq" >&2; exit 2; }
jq -e '(.rows | type) == "array" and all(.rows[]; (type == "object") and ((.id | type) == "string"))' "$CATALOG" >/dev/null 2>&1 \
  || { echo "sheet.sh: $CATALOG needs a rows list, each row with a string id" >&2; exit 2; }
jq -e 'all(.rows[]; (.overage == null or (.overage | type) == "string") and (.lanes == null or (.lanes | type) == "array"))' "$CATALOG" >/dev/null 2>&1 \
  || { echo "sheet.sh: $CATALOG needs each row's overage to be a string and its lanes a list" >&2; exit 2; }
jq -e '(.plans | type) == "array" and all(.plans[]; (type == "object") and ((.id | type) == "string"))' "$MINE" >/dev/null 2>&1 \
  || { echo "sheet.sh: $MINE needs a plans list, each plan with a string id" >&2; exit 2; }
jq -e 'all(.plans[]; .status == null or (.status | type) == "string")' "$MINE" >/dev/null 2>&1 \
  || { echo "sheet.sh: $MINE needs each plan's status to be a string, such as use, idle, want or skip" >&2; exit 2; }
jq -e 'all(.plans[]; (.lane == null or (.lane | type) == "string") and (.rung == null or (.rung | type) == "number"))' "$MINE" >/dev/null 2>&1 \
  || { echo "sheet.sh: $MINE needs each plan's lane to be a string and its rung a number" >&2; exit 2; }

# One row per plan of yours, in your order: the catalog's facts, then what you wrote.
rows() {
  jq -n --slurpfile c "$CATALOG" --slurpfile m "$MINE" '
    ($c[0].rows | map({(.id): .}) | add // {}) as $P
    | [$m[0].plans[] | . as $x | ($P[$x.id] // null) as $p
      | {id: $x.id, known: ($p != null), name: ($p.name // $x.id), provider: $p.provider, lanes: ($p.lanes // []),
         price_month: $p.price_month, currency: $p.currency, resets: $p.resets, card: $p.card, overage: $p.overage,
         checked: $p.checked, verified: ($p.verified // false), source: $p.source,
         have: ($x.have // false), status: ($x.status // null), notes: ($x.notes // ""), lane: ($x.lane // null), rung: ($x.rung // null)}]'
}

ICONS='{"use":"🟢 use","idle":"💤 idle","want":"⭐ want","skip":"⏭️ skip","stops":"🛑 stops","bills":"💸 bills"}'

# The Markdown sheet: a count line, then one table row per plan.
table() {
  rows | jq -r --argjson i "$ICONS" '
    def cell: tostring | gsub("[|\r\n]"; " ") | gsub("<"; "&lt;");
    def price: if .known | not then "·" elif .price_month == null then "?" elif .price_month == 0 then "free"
               else "\(.currency // "") \(.price_month)" end;
    def limit: if .known | not then "·" else ($i[.overage // ""] // "❔") end;
    def card: if .known | not then "·" elif .card == true then "💳" elif .card == false then "·" else "?" end;
    def status: if .status == null then "?" else ($i[.status] // .status) end;
    . as $r
    | if ($r | length) == 0 then "**0 plans**" else
      "**\($r | length) plans** · ✅ have \($r | map(select(.have)) | length) · 🟢 use \($r | map(select(.status == "use")) | length) · 💤 idle \($r | map(select(.status == "idle")) | length) · 🆓 free \($r | map(select(.price_month == 0)) | length) · ❔ not in the catalog \($r | map(select(.known | not)) | length)",
        "",
        "| Plan | Lane | Price | At the limit | Card | Have | Status | Notes | Read |",
        "|---|---|---:|:-:|:-:|:-:|:-:|---|---|",
        ($r[] | "| \(if .known then .name else "❔ \(.id)" end | cell) | \(if .known then (.lanes | join(", ")) else "not in the catalog" end | cell) | \(price | cell) | \(limit) | \(card) | \(if .have then "✅" else "·" end) | \(status | cell) | \(.notes | cell) | \(if .known then "\(.checked // "?")\(if .verified then " ✅" else "" end)" else "·" end | cell) |")
      end'
}

# The ladders: each lane's rungs in order, so you use the first rung that still has room before the next.
ladders() {
  rows | jq -r --argjson i "$ICONS" '
    def cell: tostring | gsub("[|\r\n]"; " ") | gsub("<"; "&lt;");
    def status: if .status == null then "?" else ($i[.status] // .status) end;
    def limit: if .known | not then "·" else ($i[.overage // ""] // "❔") end;
    [.[] | select(.lane != null and .rung != null)] as $l
    | if ($l | length) == 0 then "**0 ladder plans**" else
      "| Lane | Rung | Plan | Have | Status | At the limit | Notes |",
      "|---|---:|---|:-:|:-:|:-:|---|",
      ($l | sort_by(.lane, .rung)[] | "| \(.lane | cell) | \(.rung) | \(if .known then .name else "❔ \(.id)" end | cell) | \(if .have then "✅" else "·" end) | \(status | cell) | \(limit) | \(.notes | cell) |")
      end'
}

case "$MODE" in
  table) table ;;
  --ladders) ladders ;;
  --json) rows ;;
  --write)
    [ -n "$ARG" ] && [ -w "$ARG" ] || { echo "sheet.sh: cannot write ${ARG:-FILE}" >&2; exit 2; }
    # Exactly one start marker, on an earlier line than exactly one end marker: else the rewrite would drop text.
    if ! awk '/<!-- sheet:start -->/ { s++; if (!sl) sl = NR } /<!-- sheet:end -->/ { e++; if (!el) el = NR }
              END { exit !(s == 1 && e == 1 && sl < el) }' "$ARG"; then
      echo "sheet.sh: $ARG needs one <!-- sheet:start --> line before one <!-- sheet:end --> line" >&2; exit 2
    fi
    # Build the result beside FILE and move it over FILE, never write FILE in place: a stopped run leaves it as it was.
    tmp=$(mktemp -d "$(dirname "$ARG")/.sheet.XXXXXX")
    trap 'rm -rf "$tmp"' EXIT
    table > "$tmp/sheet"
    cp -p "$ARG" "$tmp/out"
    awk -v sheet="$tmp/sheet" '
      /<!-- sheet:start -->/ { print; while ((getline line < sheet) > 0) print line; skip = 1; next }
      /<!-- sheet:end -->/ { skip = 0 }
      !skip { print }' "$ARG" > "$tmp/out"
    mv -f "$tmp/out" "$ARG" ;;
  *) usage ;;
esac
