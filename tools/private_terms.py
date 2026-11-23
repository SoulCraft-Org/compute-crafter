#!/usr/bin/env python3
"""The private half of the private-term rule, run by .github/workflows/private-terms.yml.

tools/voice_rules.json keeps only generic shapes, so this public repo never lists the names it must not contain. Those
names are one regex in the org secret PRIVATE_TERMS. This scans every tracked file for it and prints each hit as
path:line only, never the matched text, because a public repo's Actions log is public too. A string listed in
.github/private-terms-allow (public already, on purpose) is removed from each line before the match.

  PRIVATE_TERMS='...' python3 -I tools/private_terms.py

Exit 0 when clean, 1 on a hit, 2 when the secret is missing. A fork's or Dependabot's pull request gets no secrets
by design, so there it only notes the skip; the push to main then runs it in full.
"""
import json
import os
import re
import subprocess
import sys

ALLOW = ".github/private-terms-allow"


def no_secrets_by_design() -> bool:
    """Whether GitHub withholds secrets from this pull request: a fork's head, or Dependabot. Any other PR must have it."""
    if os.environ.get("GITHUB_ACTOR") == "dependabot[bot]":
        return True
    try:
        with open(os.environ["GITHUB_EVENT_PATH"], encoding="utf-8") as fh:
            head = json.load(fh)["pull_request"]["head"]["repo"]["full_name"]
    except (KeyError, OSError, TypeError, ValueError):
        return False
    return head != os.environ.get("GITHUB_REPOSITORY")


def main() -> int:
    os.chdir(os.path.join(os.path.dirname(os.path.abspath(__file__)), ".."))  # paths below are the repo root's
    value = os.environ.get("PRIVATE_TERMS", "").strip()
    if not value:
        if os.environ.get("GITHUB_EVENT_NAME") == "pull_request" and no_secrets_by_design():
            print("::notice::PRIVATE_TERMS is not available to this pull request; the push to main runs the scan")
            return 0
        print("::error::PRIVATE_TERMS is empty; set the org secret for this repo")
        return 2
    try:
        terms = re.compile(re.sub(r"^\(\?i\)", "", value), re.I)
    except re.error:  # its message can quote part of the secret, so the log gets none of it
        print("::error::PRIVATE_TERMS is not a valid regex")
        return 2
    # Strings already public on purpose (a GitHub handle CODEOWNERS needs, a license attribution), one per line.
    allowed = []
    if os.path.isfile(ALLOW):
        with open(ALLOW, encoding="utf-8") as fh:
            allowed = [re.compile(re.escape(s.strip()), re.I) for s in fh if s.strip() and not s.lstrip().startswith("#")]
    files = subprocess.run(["git", "ls-files", "-z"], capture_output=True, check=True).stdout.split(b"\0")
    hits = 0
    for name in filter(None, (f.decode("utf-8", "replace") for f in files)):
        try:
            with open(name, "rb") as fh:
                data = fh.read()
        except OSError:
            continue
        if b"\0" in data[:8192]:
            continue
        for line_no, line in enumerate(data.decode("utf-8", "replace").splitlines(), 1):
            for literal in allowed:
                line = literal.sub(" ", line)
            if terms.search(line):
                print(f"::error file={name},line={line_no}::a private term; name SoulCraft-Org or a public source only")
                hits += 1
    print(f"private terms: {hits} hit(s)")
    return 1 if hits else 0


if __name__ == "__main__":
    sys.exit(main())
