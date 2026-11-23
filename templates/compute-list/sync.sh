#!/usr/bin/env bash
# sync.sh: copy catalog/plans.json from a Compute Crafter commit into vendor/, and write vendor/PIN.
#
#   bash sync.sh [REF]             REF is a branch, tag or commit; the default is main
#   REPO=owner/name bash sync.sh   another repo, such as a fork; the default is SoulCraft-Org/compute-crafter
#
# Needs gh, signed in with gh auth login, and jq. No key goes in a command. vendor/PIN holds REPO@SHA, the full
# commit the copy came from, so a copy never moves unseen.
set -euo pipefail

REPO=${REPO:-SoulCraft-Org/compute-crafter}
REF=${1:-main}
[ $# -le 1 ] || { echo "usage: bash sync.sh [REF]" >&2; exit 2; }
case "$REPO" in
  */*/* | */ | /* | *[!A-Za-z0-9._/-]*) echo "sync.sh: REPO must be owner/name, not $REPO" >&2; exit 2 ;;
  */*) ;;
  *) echo "sync.sh: REPO must be owner/name, not $REPO" >&2; exit 2 ;;
esac
case "$REF" in
  "" | -* | *[!A-Za-z0-9._/-]*) echo "sync.sh: REF is a branch, tag or commit name, not $REF" >&2; exit 2 ;;
esac
command -v gh >/dev/null || { echo "sync.sh: needs gh" >&2; exit 2; }
command -v jq >/dev/null || { echo "sync.sh: needs jq" >&2; exit 2; }

dir=$(cd "$(dirname "$0")" && pwd)/vendor
sha=$(gh api "repos/$REPO/commits/$REF" -q .sha)
case "$sha" in
  *[!0-9a-f]* | "") echo "sync.sh: $REPO at $REF gave no full commit SHA" >&2; exit 1 ;;
esac
[ ${#sha} -eq 40 ] || { echo "sync.sh: $REPO at $REF gave no full commit SHA" >&2; exit 1; }

tmp=$(mktemp)
trap 'rm -f "$tmp"' EXIT
gh api "repos/$REPO/contents/catalog/plans.json?ref=$sha" -H 'Accept: application/vnd.github.raw' > "$tmp"
jq -e '(.rows | type) == "array" and (.rows | length) > 0' "$tmp" >/dev/null \
  || { echo "sync.sh: catalog/plans.json at $sha is not a plan catalog" >&2; exit 1; }

mkdir -p "$dir"
cat "$tmp" > "$dir/plans.json"
printf '%s@%s\n' "$REPO" "$sha" > "$dir/PIN"
echo "vendor/plans.json: $(jq '.rows | length' "$dir/plans.json") plans from $REPO at $sha"
