#!/usr/bin/env bash
# sync.sh: write catalog/plans.json from the pinned Colorado-Compute/compute-credits commit, checked against its hash.
#
#   bash catalog/sync.sh               fetch plans.json at the SHA in catalog/PIN and check its sha256 against PIN
#   bash catalog/sync.sh --update SHA  move the pin to SHA, a full 40-character commit SHA: fetch, hash, write both
#
# catalog/PIN has two lines: OWNER/NAME@SHA (the full commit), then the sha256 of that commit's catalog/plans.json.
# A branch name, a tag, a short SHA or a hash that differs from PIN is refused, and nothing is written.
# Needs gh, signed in with gh auth login. No key goes in a command.
set -euo pipefail

usage() { echo "usage: bash catalog/sync.sh [--update FULL_COMMIT_SHA]" >&2; exit 2; }
die() { echo "sync.sh: $*" >&2; exit "${2:-1}"; }

is_sha() { [ ${#1} -eq 40 ] && case "$1" in *[!0-9a-f]*) return 1 ;; *) return 0 ;; esac; }
is_hash() { [ ${#1} -eq 64 ] && case "$1" in *[!0-9a-f]*) return 1 ;; *) return 0 ;; esac; }
sha256_of() {
  if command -v sha256sum >/dev/null; then sha256sum "$1" | cut -d' ' -f1; else shasum -a 256 "$1" | cut -d' ' -f1; fi
}

mode=pin new_sha=""
case $# in
  0) ;;
  2) [ "$1" = "--update" ] || usage; mode=update; new_sha=$2 ;;
  *) usage ;;
esac
if [ "$mode" = update ]; then
  is_sha "$new_sha" || die "--update takes a full 40-character lowercase commit SHA, not $new_sha (a branch name or a short SHA moves the pin unseen)" 2
fi

dir=$(cd "$(dirname "$0")" && pwd)
pin_line=$(sed -n 1p "$dir/PIN" 2>/dev/null || true)
pin_hash=$(sed -n 2p "$dir/PIN" 2>/dev/null || true)
repo=${pin_line%@*} pin_sha=${pin_line#*@}
case "$repo" in
  *..* | .* | */.* | */*/* | */ | /* | *[!A-Za-z0-9._/-]*) die "catalog/PIN line 1 must be owner/name@SHA" 2 ;;
  */*) ;;
  *) die "catalog/PIN line 1 must be owner/name@SHA" 2 ;;
esac
is_sha "$pin_sha" || die "catalog/PIN line 1 must end in a full 40-character commit SHA, not $pin_sha" 2
is_hash "$pin_hash" || die "catalog/PIN line 2 must be a 64-character sha256" 2
command -v gh >/dev/null || die "needs gh" 2

want=$pin_sha
[ "$mode" = update ] && want=$new_sha
tmp="" new_plans="" new_pin=""
trap 'rm -f "$tmp" "$new_plans" "$new_pin"' EXIT
tmp=$(mktemp)

got_sha=$(gh api "repos/$repo/commits/$want" -q .sha)
[ "$got_sha" = "$want" ] || die "$repo has no commit $want (it gave '$got_sha')"
gh api "repos/$repo/contents/catalog/plans.json?ref=$want" -H 'Accept: application/vnd.github.raw' > "$tmp"
got_hash=$(sha256_of "$tmp")

if [ "$mode" = pin ]; then
  [ "$got_hash" = "$pin_hash" ] || die "sha256 of catalog/plans.json at $want is $got_hash, but catalog/PIN says $pin_hash; nothing written"
else
  command -v jq >/dev/null || die "needs jq" 2
  jq -e '(.rows | type) == "array" and (.rows | length) > 0' "$tmp" >/dev/null \
    || die "catalog/plans.json at $want is not a plan catalog"
fi

# Both files are written beside their targets and moved into place, so a stopped run never leaves them disagreeing.
new_plans=$(mktemp "$dir/.plans.XXXXXX")
new_pin=$(mktemp "$dir/.pin.XXXXXX")
cat "$tmp" > "$new_plans"
printf '%s@%s\n%s\n' "$repo" "$want" "$got_hash" > "$new_pin"
chmod 644 "$new_plans" "$new_pin"
mv -f "$new_plans" "$dir/plans.json"
mv -f "$new_pin" "$dir/PIN"
echo "catalog/plans.json: $got_hash from $repo at $want"
