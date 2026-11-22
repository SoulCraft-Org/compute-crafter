#!/usr/bin/env bash
# sheet.sh: your logins sheet from the vendor catalog and your sites list. Bash and jq only.
#
#   bash sheet.sh CATALOG SITES                       print the sheet (a Markdown table)
#   bash sheet.sh CATALOG SITES --write FILE          replace the part of FILE between the sheet markers
#   bash sheet.sh CATALOG SITES --json [STATUS]       one row per site with its checks, for board.html
#
# CATALOG is catalog/logins.json. SITES is your sites.json (see sites.example.json). STATUS is your status.json, which
# never goes in git. Every value from these files is data: this script prints it, never runs it.
set -euo pipefail

usage() { echo "usage: bash sheet.sh CATALOG SITES [--write FILE | --json [STATUS]]" >&2; exit 2; }
[ $# -ge 2 ] || usage
CATALOG=$1 SITES=$2 MODE=${3:-table} ARG=${4:-}
for f in "$CATALOG" "$SITES"; do [ -r "$f" ] || { echo "sheet.sh: cannot read $f" >&2; exit 2; }; done
command -v jq >/dev/null || { echo "sheet.sh: needs jq" >&2; exit 2; }

STATUS_FILE=/dev/null
if [ "$MODE" = --json ] && [ -n "$ARG" ]; then
  [ -r "$ARG" ] || { echo "sheet.sh: cannot read $ARG" >&2; exit 2; }
  STATUS_FILE=$ARG
fi

# One row per site: the vendor's facts in your order, plus its checks when a status file is given.
rows() {
  jq -n --slurpfile c "$CATALOG" --slurpfile s "$SITES" --slurpfile st "$STATUS_FILE" '
    ($c[0].rows | map({(.id): .}) | add) as $V
    | $s[0] as $S
    | ($S.order // ["github", "apple", "microsoft", "google", "email-password"]) as $O
    | (($st[0] // {}).rows // {}) as $ST
    | ["email-password", "passkey", "email-link"] as $OWN
    | [$S.sites[] | . as $site | ($V[$site.vendor] // null) as $v | ($v.signin // []) as $in
      | (($v.lanes // []) | any(. == "identity")) as $root
      # An identity provider signs in with its own credentials, never through another provider.
      | ($site.top // (if $root and (($in | any(. == "passkey")) or (["signin", "both"] | any(. == ($v.passkey // ""))))
                      then "passkey"
                      else ([(if $root then ["email-password"] else $O end)[]
                             | select(. as $m | $in | any(. == $m))] | first) end)) as $top
      | (if $v == null then null
         elif (($v.twofa // []) | any(. == "via-provider")) then "via-provider"
         elif (($v.twofa // []) | any(. == "totp")) then ($site.codes // $S.codes[$v.family // "default"] // $S.codes.default // "passwords")
         else null end) as $codes
      | ($ST[$site.id] // {}) as $x
      | {id: $site.id, vendor: $site.vendor, name: ($site.name // $v.name // $site.vendor), stage: ($site.stage // null),
         known: ($v != null), root: $root,
         slots: [$O[] | . as $m | {method: $m, offered: ($in | any(. == $m))}],
         top: $top, email: ($site.email // $v.family // "primary"), passkey: ($v.passkey // null), codes: $codes,
         link: ($v.link // null), email_change: ($v.email_change // null), verified: ($v.verified // false),
         security_url: ($v.security_url // null),
         checks: {
           # A password, a passkey and an emailed link are all your own credentials: any of them meets an own-credential top.
           # With the vendor methods unknown, recording how you sign in is enough.
           top: (if $top != null then (($x.login_method == $top) or (($OWN | any(. == $top)) and ($OWN | any(. == ($x.login_method // "")))))
                 elif $v != null and $v.signin == null then (($x.login_method // null) != null)
                 else null end),
           email: (if $x.email_ok == "na" then null else ($x.email_ok == "yes") end),
           passkey: (if (["signin", "both", "2fa"] | any(. == ($v.passkey // ""))) then ($x.passkey == "passwords") else null end),
           codes: (if ($codes == null or $codes == "via-provider") then null else ($x.codes_app == $codes) end),
           recovery: (if ($v.recovery_codes // false) then (["passwords", "printed"] | any(. == ($x.recovery // ""))) else null end),
           tested: (($x.tested // null) != null)}}
      | .green = ([.checks[] | select(. != null)] | all)]'
}

ICONS='{"github":"🐙","apple":"🍎","microsoft":"🪟","google":"🔎","email-password":"✉️","email-link":"📧","passkey":"🔑","sso":"🏢","primary":"⭐","passwords":"🔐 Passwords","microsoft-authenticator":"🪟 Authenticator","google-authenticator":"🔎 Authenticator","via-provider":"↪️ via sign-in"}'

# The Markdown sheet: one header icon per method in your order, then the vendor facts.
table() {
  rows | jq -r --argjson i "$ICONS" '
    def ic: if . == null then "?" else ($i[.] // .) end;
    def yn: if . == true then "✅" elif . == false then "✖️" else "?" end;
    def pk: {"signin": "🔑 sign-in", "both": "🔑 both", "2fa": "🔑 2FA", "no": "·"}[. // ""] // "?";
    def lk: {"settings": "🔗", "email-match": "🔗 email", "no": "✖️"}[. // ""] // "?";
    def cell: tostring | gsub("[|\r\n]"; " ");
    . as $r
    | if ($r | length) == 0 then "**0 sites**" else
      ($r | map(select(.top != null)) | group_by(.top) | map("\(.[0].top | ic) \(length)") | join(" · ")) as $tops
      | "**\($r | length) sites** · \($tops) · ✅ facts verified \($r | map(select(.verified)) | length)",
        "",
        "| Site | \($r[0].slots | map(.method | ic) | join(" | ")) | Top | Email | Passkey | Codes | Link | Email change |",
        "|---|\($r[0].slots | map(":-:") | join("|"))|:-:|:-:|:-:|:-:|:-:|:-:|",
        ($r[] | "| \(.name | cell)\(if .known then "" else " ❔" end) | \(.slots | map(if .offered then "✅" else "·" end) | join(" | ")) | \(.top | ic) | \(.email | ic | cell) | \(.passkey | pk) | \(.codes | ic | cell) | \(.link | lk) | \(.email_change | yn) |")
      end'
}

case "$MODE" in
  table) table ;;
  --json) rows ;;
  --write)
    [ -n "$ARG" ] && [ -w "$ARG" ] || { echo "sheet.sh: cannot write ${ARG:-FILE}" >&2; exit 2; }
    if ! grep -q '<!-- sheet:start -->' "$ARG" || ! grep -q '<!-- sheet:end -->' "$ARG"; then
      echo "sheet.sh: $ARG needs the lines <!-- sheet:start --> and <!-- sheet:end -->" >&2; exit 2
    fi
    tmp=$(mktemp)
    table > "$tmp.sheet"
    awk -v sheet="$tmp.sheet" '
      /<!-- sheet:start -->/ { print; while ((getline line < sheet) > 0) print line; skip = 1; next }
      /<!-- sheet:end -->/ { skip = 0 }
      !skip { print }' "$ARG" > "$tmp"
    cat "$tmp" > "$ARG"; rm -f "$tmp" "$tmp.sheet" ;;
  *) usage ;;
esac
