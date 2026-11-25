#!/usr/bin/env bash
# route.sh: route work to the first pool with room, from the plan catalog and your own pools. Bash and jq only.
#
#   bash route.sh CATALOG POOLS             the routing table: each lane's pools in order, and the next one to use
#   bash route.sh CATALOG POOLS --budget    the token budget table: each pool's limit, its stop and what is left
#   bash route.sh CATALOG POOLS --paid      the paid and in use table: each paid plan you hold, in use or idle
#   bash route.sh CATALOG POOLS --json      one row per pool, for dashboard.html
#
# CATALOG is vendor/plans.json (the compute-list starter's sync.sh copies it). POOLS is your pools.json (see
# pools.example.json). An id that is not in the catalog is flagged, never dropped. Every value from these files is data:
# this script prints it, never runs it. A month counts 30 days and a week 7.
set -euo pipefail

usage() { echo "usage: bash route.sh CATALOG POOLS [--budget | --paid | --json]" >&2; exit 2; }
[ $# -ge 2 ] || usage
CATALOG=$1 POOLS=$2 MODE=${3:-route}
for f in "$CATALOG" "$POOLS"; do [ -r "$f" ] || { echo "route.sh: cannot read $f" >&2; exit 2; }; done
command -v jq >/dev/null || { echo "route.sh: needs jq" >&2; exit 2; }
jq -e '(.rows | type) == "array" and all(.rows[]; (type == "object") and ((.id | type) == "string"))' "$CATALOG" >/dev/null 2>&1 \
  || { echo "route.sh: $CATALOG needs a rows list, each row with a string id" >&2; exit 2; }
jq -e '(.pools | type) == "array" and all(.pools[]; (type == "object") and ((.id | type) == "string"))' "$POOLS" >/dev/null 2>&1 \
  || { echo "route.sh: $POOLS needs a pools list, each pool with a string id" >&2; exit 2; }
jq -e '(.stop_at_pct == null or (.stop_at_pct | type) == "number") and all(.pools[]; (.limit == null or (.limit | type) == "number") and (.used == null or (.used | type) == "number") and (.rung == null or (.rung | type) == "number"))' "$POOLS" >/dev/null 2>&1 \
  || { echo "route.sh: $POOLS needs stop_at_pct, and each pool's limit, used and rung, to be numbers" >&2; exit 2; }

# One row per pool: the catalog's facts, then your limit and use. The next pool of a lane is its first held pool under its stop.
rows() {
  jq -n --slurpfile c "$CATALOG" --slurpfile m "$POOLS" '
    ($c[0].rows | map({(.id): .}) | add // {}) as $P
    | ($m[0].stop_at_pct // 80) as $pct
    | {day: 1, week: 7, month: 30} as $days
    | [$m[0].pools[] | . as $x | ($P[$x.id] // null) as $p | ($x.limit // null) as $lim | ($x.used // 0) as $used
      | ($lim != null and $lim > 0) as $capped
      | {id: $x.id, known: ($p != null), name: ($p.name // $x.id), lane: ($x.lane // $p.lanes[0]? // "?"), rung: ($x.rung // 99),
         unit: ($x.unit // ""), per: ($x.per // ""), limit: $lim, used: $used,
         stop_at: (if $capped then $lim * $pct / 100 else null end),
         used_pct: (if $capped then ($used * 1000 / $lim | round) / 10 else null end),
         per_day: (if $capped and $days[$x.per // ""] then ($lim * $pct / 100 / $days[$x.per] * 100 | round) / 100 else null end),
         price_month: $p.price_month, currency: $p.currency, overage: $p.overage, resets: $p.resets,
         paid: (($p.price_month // 0) > 0), have: ($x.have // false), checked: $p.checked, notes: ($x.notes // "")}
      | . + {room: (.have and ((.stop_at == null) or (.used < .stop_at)))}]
    | group_by(.lane) | map(sort_by(.rung) | (map(.room) | index(true)) as $i
        | to_entries | map(.value + {next: (.key == $i)})) | add // []'
}

ICONS='{"stops":"🛑 stops","bills":"💸 bills"}'

# One table cell, printed as text: a pipe or a line break would split the row, and < & \ ` * _ ~ $ [ ] would render as markup.
CELL='def cell: tostring | gsub("[|\r\n]"; " ") | gsub("&"; "&amp;") | gsub("<"; "&lt;") | gsub("(?<c>[\\\\`*_~$\\[\\]])"; "\\\(.c)");
  def n: if . == null then "·" else tostring end;
  def price: if .known | not then "·" elif .price_month == null then "?" elif .price_month == 0 then "free" else "\(.currency // "") \(.price_month)" end;
  def name: if .known then .name else "❔ \(.id)" end;'

route() {
  rows | jq -r --argjson i "$ICONS" "$CELL"'
    def where: if .have | not then "⏸ not held" elif .room | not then "🛑 at the stop" elif .next then "👉 next" else "✅ room" end;
    if length == 0 then "**0 pools**" else
      "| Lane | Rung | Pool | Price | At the limit | Limit | Used | Route | Notes |",
      "|---|---:|---|---:|:-:|---:|---:|:-:|---|",
      (.[] | "| \(.lane | cell) | \(.rung | cell) | \(name | cell) | \(price | cell) | \(if .known then $i[.overage // ""] // "❔" else "·" end) | \(if .limit == null then "·" else "\(.limit) \(.unit) per \(.per)" end | cell) | \(.used_pct | n)\(if .used_pct == null then "" else "%" end) | \(where) | \(.notes | cell) |")
    end'
}

budget() {
  rows | jq -r "$CELL"'
    "| Pool | Unit | Window | Limit | Stop at | Per day | Used | Left |",
    "|---|---|---|---:|---:|---:|---:|---:|",
    (.[] | select(.limit != null) | "| \(name | cell) | \(.unit | cell) | \(.per | cell) | \(.limit) | \(.stop_at) | \(.per_day | n) | \(.used) | \([.stop_at - .used, 0] | max) |")'
}

paid() {
  rows | jq -r "$CELL"'
    [.[] | select(.paid and .have)] as $h
    | "**\($h | length) paid plans held** · 🟢 in use \($h | map(select(.used > 0)) | length) · 💤 idle \($h | map(select(.used == 0)) | length)",
      "",
      "| Plan | Price | Used | State |",
      "|---|---:|---:|:-:|",
      ($h[] | "| \(name | cell) | \(price | cell) | \(if .limit == null then "\(.used) \(.unit)" else "\(.used) of \(.limit) \(.unit)" end | cell) | \(if .used > 0 then "🟢 in use" else "💤 idle: pause or drop" end) |")'
}

case "$MODE" in
  route) route ;;
  --budget) budget ;;
  --paid) paid ;;
  --json) rows ;;
  *) usage ;;
esac
