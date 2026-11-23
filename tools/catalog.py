#!/usr/bin/env python3
"""Build and check catalog/plans.json, the public free-tier and plan catalog.

  python3 -I tools/catalog.py --check                   the committed catalog is valid and canonical (CI runs this)
  python3 -I tools/catalog.py --self-test               seeded samples that must pass and must fail (CI runs this)
  python3 -I tools/catalog.py --format                  sort the rows and rewrite the file canonically, then --check
  python3 -I tools/catalog.py merge DIR [DIR ...]       merge each DIR's free.json, plans.compute.json and
                                                        plans.inference.json into catalog/plans.json

A row reaches the catalog only through PUBLIC_FIELDS, an allowlist: a new private column in a source never leaks by
default. Rows merge by id. The newer `checked` date wins; on a tie the earlier DIR wins. Rows with the same id in two
lanes keep one row with both lanes. The winning row decides status: closed, excluded and DROP rows stay out. Exit 0: clean. Exit 1: a finding.
Exit 2: could not check (a missing or unreadable file: infrastructure, not a finding).
"""
import datetime
import json
import math
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CATALOG = os.path.join("catalog", "plans.json")
SOURCE_FILES = ("free.json", "plans.compute.json", "plans.inference.json")

PUBLIC_FIELDS = ("id", "name", "provider", "provider_hq", "lanes", "price_month", "currency", "price_note", "includes",
                 "resets", "unit_cost_vs_payg", "card", "overage", "trains_on_data", "commercial_use", "limits",
                 "source", "sources_extra", "checked", "verified")
LANES = ("ci", "cpu", "gpu", "inference", "hosting", "tools")
OVERAGE = {"stops", "bills", "unknown", None}
# Each shape is used with fullmatch: a trailing newline never passes.
DATE = re.compile(r"\d{4}-\d{2}-\d{2}")
CURRENCY = re.compile(r"[A-Z]{3}")  # ISO 4217: a price stays in the currency its page states
ID = re.compile(r"[a-z0-9][a-z0-9.-]*")
COUNTRY = re.compile(r"[A-Z]{2}")  # ISO 3166-1 alpha-2
EMAIL = re.compile(r"[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}")
DASHES = ("\u2014", "\u2013")  # em and en dash
# Generic shapes of a private source's name, path or wording. The catalog is facts about vendors only; the private
# names themselves are the org secret PRIVATE_TERMS, which .github/workflows/private-terms.yml scans every file for.
PRIVATE = re.compile(r"soul[\s_-]?craft|/Users/|workspace#\d|\bcs_|\bour\b", re.I)

# Rows a source holds that are not public plan facts, each with its reason (the claims ledger for the merge).
DROP = {
    "claude-subscription-current": "an account's current plan, not a plan",
    "copilot-current": "an account's current plan, not a plan",
    "deepgram-signup": "its only source is a third-party page",
    "nanogpt-sub": "its only source is a third-party page",
    "claude-max-5x": "superseded by claude-max, read on a first-party page later",
    "claude-max-20x": "superseded by claude-max, read on a first-party page later",
    "chatgpt-plus": "not listed: this project lists no OpenAI, xAI or SpaceX (Cursor) products",
    "chatgpt-pro-100": "not listed: this project lists no OpenAI, xAI or SpaceX (Cursor) products",
    "cursor-plus": "not listed: this project lists no OpenAI, xAI or SpaceX (Cursor) products",
}
# Older rows carry no provider; these fill it from the row's own source page.
PROVIDER = {
    "arliai-core": "ArliAI", "aws-free-plan": "Amazon Web Services", "chutes-plus": "Chutes",
    "cirrus-gpu-runner": "Cirrus Labs", "cirrus-runners": "Cirrus Labs", "devpass-lite": "LLM Gateway",
    "gcp-trial": "Google Cloud", "gpumart-a6000": "GPU Mart", "machine-dev": "machine.dev",
    "runcomfy-pro": "RunComfy", "warpbuild": "WarpBuild",
}


class CannotCheck(Exception):
    """Infrastructure, not a finding."""


def no_constant(name):
    """NaN, Infinity and -Infinity are not JSON: Python reads them, a standard parser does not."""
    raise ValueError(f"{name} is not JSON")


def real_date(s):
    """A YYYY-MM-DD string that is a calendar date, and not later than tomorrow (UTC)."""
    if not isinstance(s, str) or not DATE.fullmatch(s):
        return False
    try:
        d = datetime.date.fromisoformat(s)
    except ValueError:
        return False
    return d <= datetime.datetime.now(datetime.timezone.utc).date() + datetime.timedelta(days=1)


def load(path):
    try:
        with open(path, encoding="utf-8") as f:
            return json.load(f, parse_constant=no_constant)
    except FileNotFoundError as e:
        raise CannotCheck(f"{path} is missing") from e
    except (OSError, ValueError) as e:
        raise CannotCheck(f"{path} cannot be read ({e})") from e


def strings(v):
    if isinstance(v, str):
        yield v
    elif isinstance(v, dict):
        for x in v.values():
            yield from strings(x)
    elif isinstance(v, list):
        for x in v:
            yield from strings(x)


def public_row(row, lanes):
    """The allowlist: only PUBLIC_FIELDS, from either source shape."""
    out = {k: row.get(k) for k in PUBLIC_FIELDS}
    # A lane the catalog does not know (or none) sorts last and stays in the row, so check_doc reports it.
    out["lanes"] = sorted(lanes, key=lambda x: (LANES.index(x) if x in LANES else len(LANES), str(x)))
    out["provider"] = row.get("provider") or PROVIDER.get(row.get("id"))
    out["currency"] = row.get("currency") or "USD"
    out["verified"] = row.get("verified_here") is True
    out["sources_extra"] = list(row.get("sources_extra") or [])
    return out


def merge(dirs):
    """(catalog document, ledger lines). Deterministic: same input, same bytes."""
    best, lanes, ledger = {}, {}, []
    for rank, d in enumerate(dirs):
        for name in SOURCE_FILES:
            path = os.path.join(d, name)
            if not os.path.exists(path):
                continue
            doc = load(path)
            for row in doc.get("rows", []):
                rid = row.get("id")
                if rid in DROP:
                    ledger.append(f"drop {rid}: {DROP[rid]}")
                    continue
                lanes.setdefault(rid, set()).add(row.get("lane"))
                checked = row.get("checked")
                key = (checked if isinstance(checked, str) else "", -rank)
                if rid not in best or key > best[rid][0]:
                    best[rid] = (key, row)
    rows = []
    for rid, (_, row) in best.items():  # the newest row decides: a plan closed since stays out
        if row.get("status", "live") != "live" or row.get("exclude"):
            ledger.append(f"drop {rid}: status {row.get('status')}, exclude {row.get('exclude')}")
            continue
        rows.append(public_row(row, lanes[rid]))
    rows.sort(key=sort_key)
    doc = {
        "version": 1,
        "about": "Free tiers and plans for compute, CI and AI inference, public fields only. Built by tools/catalog.py; "
                 "every row names the vendor page it was read on and the date. verified: true means every figure was "
                 "read on that first-party page on that date; false means it was not re-read since.",
        "checked": newest(rows),
        "lanes": list(LANES),
        "rows": rows,
    }
    return doc, sorted(set(ledger))


def newest(rows):
    """The newest well-formed checked date. A row with none is left for check_doc to report."""
    return max((r["checked"] for r in rows if isinstance(r.get("checked"), str) and DATE.fullmatch(r["checked"])),
               default=None)


def sort_key(r):
    lanes = r.get("lanes") or ["~"]
    return (LANES.index(lanes[0]) if lanes[0] in LANES else len(LANES), str(r.get("provider")).lower(),
            str(r.get("name")).lower(), str(r.get("id")))


def render(doc):
    return json.dumps(doc, indent=1, ensure_ascii=False, allow_nan=False) + "\n"


def failed(where, rules):
    """The where-led message of each (broken, message) rule whose condition holds, in order."""
    return [f"{where}: {message}" for broken, message in rules if broken]


def check_identity(where, row, seen):
    """Findings for a row's keys, id, name and provider; the row's id joins seen."""
    extra = sorted(set(row) - set(PUBLIC_FIELDS))
    found = failed(where, [
        (tuple(row) != PUBLIC_FIELDS, "keys are not PUBLIC_FIELDS in order" + (f" (not allowed: {extra})" if extra else "")),
        (not ID.fullmatch(str(row.get("id", ""))), "id is not lowercase letters, digits, dots and hyphens"),
        (row.get("id") in seen, "duplicate id"),
        (any(not isinstance(row.get(k), str) or not row[k].strip() or row[k] != row[k].strip() for k in ("name", "provider")),
         "name and provider are required, as text with no outer spaces"),
    ])
    seen.add(row.get("id"))
    return found


def check_values(where, row):
    """Findings for a row's country, lanes and price."""
    hq, lanes, pm = row.get("provider_hq"), row.get("lanes"), row.get("price_month")
    return failed(where, [
        (not (hq is None or (isinstance(hq, str) and COUNTRY.fullmatch(hq))), f"provider_hq {hq!r} is not an ISO 3166-1 alpha-2 code or null"),
        (not isinstance(lanes, list) or not lanes or any(x not in LANES for x in lanes),
         f"lanes {lanes!r} is not a non-empty list from {list(LANES)}"),
        (not (pm is None or (isinstance(pm, (int, float)) and not isinstance(pm, bool) and math.isfinite(pm) and pm >= 0)),
         "price_month is not a finite number or null"),
    ])


def check_flags(where, row):
    """Findings for a row's currency, overage, flags, sources and checked date."""
    extra = row.get("sources_extra")
    return failed(where, [
        (not CURRENCY.fullmatch(str(row.get("currency", ""))), f"currency {row.get('currency')!r} is not an ISO 4217 code"),
        (row.get("overage") not in OVERAGE, f"overage {row.get('overage')!r} is not stops, bills, unknown or null"),
        *[(row.get(k) not in (True, False, None), f"{k} is not true, false or null") for k in ("card", "trains_on_data", "commercial_use")],
        (not isinstance(row.get("verified"), bool), "verified is not true or false"),
        (not str(row.get("source", "")).startswith("https://"), "source is not an https URL"),
        (not isinstance(extra, list) or any(not str(u).startswith("https://") for u in strings(extra)),
         "sources_extra is not a list of https URLs"),
        (not real_date(row.get("checked")), "checked is not a real YYYY-MM-DD date, no later than tomorrow"),
    ])


def check_text(where, row):
    """Findings for each string of a row: an em or en dash, an email address, a private term."""
    out = []
    for s in strings(row):
        m = PRIVATE.search(s)
        out += failed(where, [
            (any(d in s for d in DASHES), "an em or en dash (use a comma, colon or parentheses)"),
            (EMAIL.search(s), "an email address"),
            (m, f"a private term {(m and m.group(0))!r}"),
        ])
    return out


def check_row(i, row, seen):
    """Findings for one catalog row."""
    where = f"row {i} ({row.get('id', '?') if isinstance(row, dict) else '?'})"
    if not isinstance(row, dict):
        return [f"{where}: not an object"]
    return check_identity(where, row, seen) + check_values(where, row) + check_flags(where, row) + check_text(where, row)


def check_order(doc, text):
    """Findings for the order, newest date and bytes of a catalog that is otherwise valid."""
    rows = doc["rows"]
    return [message for broken, message in [
        (rows != sorted(rows, key=sort_key), "catalog: rows are not sorted by first lane, provider, name and id"),
        (doc.get("checked") != max((r["checked"] for r in rows), default=None), "catalog: top-level checked is not the newest row's checked"),
        (text != render(doc), "catalog: not in canonical form; run python3 -I tools/catalog.py --format"),
    ] if broken]


def check_doc(doc, text):
    """Findings for the catalog document and its bytes."""
    if not isinstance(doc, dict) or doc.get("version") != 1 or not isinstance(doc.get("rows"), list):
        return ['catalog: wants {"version": 1, "checked": "YYYY-MM-DD", "lanes": [...], "rows": [...]}']
    out = []
    if set(doc) != {"version", "about", "checked", "lanes", "rows"}:
        out.append(f"catalog: top-level keys {sorted(doc)} are not version, about, checked, lanes, rows")
    if doc.get("lanes") != list(LANES):
        out.append(f"catalog: lanes is not {list(LANES)}")
    seen = set()
    for i, row in enumerate(doc["rows"]):
        out += check_row(i, row, seen)
    return out or check_order(doc, text)


def check(root):
    path = os.path.join(root, CATALOG)
    try:
        with open(path, encoding="utf-8") as f:
            text = f.read()
    except FileNotFoundError as e:
        raise CannotCheck(f"{CATALOG} is missing") from e
    except (OSError, UnicodeDecodeError) as e:  # a byte that is not UTF-8, or a path that is not a file
        raise CannotCheck(f"{CATALOG} cannot be read ({e})") from e
    try:
        doc = json.loads(text, parse_constant=no_constant)
    except ValueError as e:
        return [f"{CATALOG}: not JSON ({e})"], None
    findings = check_doc(doc, text)
    return findings, len(doc.get("rows", [])) if isinstance(doc, dict) else None


def format_catalog(root):
    """Sort the rows and rewrite the catalog canonically. A missing or unreadable file is CannotCheck. A catalog of
    the wrong shape is left as it is: --check reports it."""
    path = os.path.join(root, CATALOG)
    doc = load(path)
    if not (isinstance(doc, dict) and isinstance(doc.get("rows"), list)
            and all(isinstance(r, dict) for r in doc["rows"])):
        return
    try:
        doc["rows"].sort(key=sort_key)
    except (TypeError, IndexError, KeyError):  # a row whose lanes are not a list: --check reports it
        return
    try:
        with open(path, "w", encoding="utf-8") as f:
            f.write(render(doc))
    except OSError as e:
        raise CannotCheck(f"{path} cannot be written ({e})") from e


def self_test():
    """--self-test: seeded samples that must pass and must fail. Exit 0 all behave, 1 one does not."""
    sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))  # -I keeps the script's folder off the path
    import catalog_selftest
    return catalog_selftest.run()


def main(argv):
    args = argv[1:]
    if args == ["--self-test"]:
        return self_test()
    if args and args[0] == "merge" and len(args) > 1:
        try:
            doc, ledger = merge(args[1:])
        except CannotCheck as e:
            print(f"catalog: could not merge ({e})")
            return 2
        findings = check_doc(doc, render(doc))
        for line in ledger:
            print(line)
        if findings:
            print("\n".join(findings))
            return 1
        with open(os.path.join(ROOT, CATALOG), "w", encoding="utf-8") as f:
            f.write(render(doc))
        print(f"catalog: wrote {CATALOG}, {len(doc['rows'])} rows, {sum(r['verified'] for r in doc['rows'])} verified")
        return 0
    if args == ["--format"]:
        try:
            format_catalog(ROOT)
        except CannotCheck as e:
            print(f"catalog: could not format ({e}); infrastructure, not a finding")
            return 2
        args = ["--check"]
    if args != ["--check"]:
        print(__doc__)
        return 2
    try:
        findings, n = check(ROOT)
    except CannotCheck as e:
        print(f"catalog: could not check ({e}); infrastructure, not a finding")
        return 2
    for f in findings:
        print(f)
    if findings:
        print(f"catalog: {len(findings)} finding(s)")
        return 1
    print(f"catalog: {CATALOG} is valid, {n} rows")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv))
