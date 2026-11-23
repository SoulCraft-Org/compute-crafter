#!/usr/bin/env bash
# sync.sh: copy the logins catalog, sheet.sh and board.html from one Compute Crafter commit into vendor/, and write vendor/PIN.
#
#   bash sync.sh [REF]             REF is a branch, tag or commit name, with no `..`; the default is main
#   REPO=owner/name bash sync.sh   another repo, such as a fork; the default is SoulCraft-Org/compute-crafter
#
# Needs gh, signed in with gh auth login, and jq. No key goes in a command. vendor/PIN holds REPO@SHA, the full
# commit all three files came from, so a copy never moves unseen. vendor/sheet.sh and vendor/board.html are that
# commit's copies: compare them with the ones beside this script, and copy over yours when you want the newer ones.
set -euo pipefail

REPO=${REPO:-SoulCraft-Org/compute-crafter}
REF=${1:-main}
[ $# -le 1 ] || { echo "usage: bash sync.sh [REF]" >&2; exit 2; }
case "$REPO" in
  *..* | .* | */.* | */*/* | */ | /* | *[!A-Za-z0-9._/-]*) echo "sync.sh: REPO must be owner/name, not $REPO" >&2; exit 2 ;;
  */*) ;;
  *) echo "sync.sh: REPO must be owner/name, not $REPO" >&2; exit 2 ;;
esac
case "$REF" in
  "" | -* | *..* | *[!A-Za-z0-9._/-]*) echo "sync.sh: REF is a branch, tag or commit name, not $REF" >&2; exit 2 ;;
esac
command -v gh >/dev/null || { echo "sync.sh: needs gh" >&2; exit 2; }
command -v jq >/dev/null || { echo "sync.sh: needs jq" >&2; exit 2; }

dir=$(cd "$(dirname "$0")" && pwd)/vendor
sha=$(gh api "repos/$REPO/commits/$REF" -q .sha)
case "$sha" in
  *[!0-9a-f]* | "") echo "sync.sh: $REPO at $REF gave no full commit SHA" >&2; exit 1 ;;
esac
[ ${#sha} -eq 40 ] || { echo "sync.sh: $REPO at $REF gave no full commit SHA" >&2; exit 1; }

# The three files, as vendor name and path in the repo. All are read at the one SHA before anything is written.
names="logins.json sheet.sh board.html"
remote() {
  case "$1" in
    logins.json) echo catalog/logins.json ;;
    sheet.sh) echo templates/logins/sheet.sh ;;
    board.html) echo templates/logins/board.html ;;
  esac
}

tmpd=$(mktemp -d)
dir_made=""
trap 'rm -rf "$tmpd"; [ -z "$dir_made" ] || rm -f "$dir"/.new.$$.*' EXIT
for n in $names; do
  gh api "repos/$REPO/contents/$(remote "$n")?ref=$sha" -H 'Accept: application/vnd.github.raw' > "$tmpd/$n" \
    || { echo "sync.sh: cannot read $(remote "$n") at $sha" >&2; exit 1; }
  [ -s "$tmpd/$n" ] || { echo "sync.sh: $(remote "$n") at $sha is empty" >&2; exit 1; }
done
jq -e '(.rows | type) == "array" and (.rows | length) > 0' "$tmpd/logins.json" >/dev/null \
  || { echo "sync.sh: catalog/logins.json at $sha is not a logins catalog" >&2; exit 1; }
head -n 1 "$tmpd/sheet.sh" | grep -q '^#!' || { echo "sync.sh: templates/logins/sheet.sh at $sha is not a script" >&2; exit 1; }
grep -qi '<!doctype html>' "$tmpd/board.html" || { echo "sync.sh: templates/logins/board.html at $sha is not a page" >&2; exit 1; }

# Every file is written beside its target and moved into place, so a stopped run never leaves them disagreeing.
mkdir -p "$dir"
dir_made=1
for n in $names; do cat "$tmpd/$n" > "$dir/.new.$$.$n"; done
printf '%s@%s\n' "$REPO" "$sha" > "$dir/.new.$$.PIN"
for n in $names PIN; do
  chmod 644 "$dir/.new.$$.$n"
  mv -f "$dir/.new.$$.$n" "$dir/$n"
done
echo "vendor/: $names from $REPO at $sha ($(jq '.rows | length' "$dir/logins.json") vendors)"
