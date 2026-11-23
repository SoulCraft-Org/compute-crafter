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
import tempfile

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


def check_doc(doc, text):
    """Findings for the catalog document and its bytes."""
    out = []
    if not isinstance(doc, dict) or doc.get("version") != 1 or not isinstance(doc.get("rows"), list):
        return ['catalog: wants {"version": 1, "checked": "YYYY-MM-DD", "lanes": [...], "rows": [...]}']
    if set(doc) != {"version", "about", "checked", "lanes", "rows"}:
        out.append(f"catalog: top-level keys {sorted(doc)} are not version, about, checked, lanes, rows")
    if doc.get("lanes") != list(LANES):
        out.append(f"catalog: lanes is not {list(LANES)}")
    seen = set()
    for i, row in enumerate(doc["rows"]):
        where = f"row {i} ({row.get('id', '?') if isinstance(row, dict) else '?'})"
        if not isinstance(row, dict):
            out.append(f"{where}: not an object")
            continue
        if tuple(row) != PUBLIC_FIELDS:
            extra = sorted(set(row) - set(PUBLIC_FIELDS))
            out.append(f"{where}: keys are not PUBLIC_FIELDS in order" + (f" (not allowed: {extra})" if extra else ""))
        if not ID.fullmatch(str(row.get("id", ""))):
            out.append(f"{where}: id is not lowercase letters, digits, dots and hyphens")
        if row.get("id") in seen:
            out.append(f"{where}: duplicate id")
        seen.add(row.get("id"))
        if any(not isinstance(row.get(k), str) or not row[k].strip() or row[k] != row[k].strip()
               for k in ("name", "provider")):
            out.append(f"{where}: name and provider are required, as text with no outer spaces")
        hq = row.get("provider_hq")
        if not (hq is None or (isinstance(hq, str) and COUNTRY.fullmatch(hq))):
            out.append(f"{where}: provider_hq {hq!r} is not an ISO 3166-1 alpha-2 code or null")
        lanes = row.get("lanes")
        if not isinstance(lanes, list) or not lanes or any(x not in LANES for x in lanes):
            out.append(f"{where}: lanes {lanes!r} is not a non-empty list from {list(LANES)}")
        pm = row.get("price_month")
        if not (pm is None or (isinstance(pm, (int, float)) and not isinstance(pm, bool) and math.isfinite(pm)
                                 and pm >= 0)):
            out.append(f"{where}: price_month is not a finite number or null")
        if not CURRENCY.fullmatch(str(row.get("currency", ""))):
            out.append(f"{where}: currency {row.get('currency')!r} is not an ISO 4217 code")
        if row.get("overage") not in OVERAGE:
            out.append(f"{where}: overage {row.get('overage')!r} is not stops, bills, unknown or null")
        for k in ("card", "trains_on_data", "commercial_use"):
            if row.get(k) not in (True, False, None):
                out.append(f"{where}: {k} is not true, false or null")
        if not isinstance(row.get("verified"), bool):
            out.append(f"{where}: verified is not true or false")
        if not str(row.get("source", "")).startswith("https://"):
            out.append(f"{where}: source is not an https URL")
        extra = row.get("sources_extra")
        if not isinstance(extra, list) or any(not str(u).startswith("https://") for u in strings(extra)):
            out.append(f"{where}: sources_extra is not a list of https URLs")
        if not real_date(row.get("checked")):
            out.append(f"{where}: checked is not a real YYYY-MM-DD date, no later than tomorrow")
        for s in strings(row):
            if any(d in s for d in DASHES):
                out.append(f"{where}: an em or en dash (use a comma, colon or parentheses)")
            if EMAIL.search(s):
                out.append(f"{where}: an email address")
            m = PRIVATE.search(s)
            if m:
                out.append(f"{where}: a private term {m.group(0)!r}")
    if not out:
        rows = doc["rows"]
        if rows != sorted(rows, key=sort_key):
            out.append("catalog: rows are not sorted by first lane, provider, name and id")
        if doc.get("checked") != max((r["checked"] for r in rows), default=None):
            out.append("catalog: top-level checked is not the newest row's checked")
        if text != render(doc):
            out.append("catalog: not in canonical form; run python3 -I tools/catalog.py --format")
    return out


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
    new = {"id": "acme-free", "name": "Acme Free", "provider": "Acme", "provider_hq": "US", "exclude": None,
           "status": "live", "lane": "gpu", "price_month": 0, "currency": "USD", "price_note": "Free.",
           "includes": "10 GPU hours a month.", "resets": "monthly", "unit_cost_vs_payg": "Free.", "card": False,
           "overage": "stops", "trains_on_data": None, "commercial_use": None, "limits": "One account.",
           "source": "https://acme.test/pricing", "sources_extra": ["https://acme.test/docs"], "checked": "2026-11-02",
           "verified_here": True, "evidence": [{"url": "https://acme.test", "quote": "q"}], "verify_note": "private",
           "cs_status": "use", "cs_note": "private", "notes": "private"}
    old = {"id": "acme-free", "name": "Acme Free (old)", "lane": "inference", "price_month": 0, "includes": "old",
           "unit_cost_vs_payg": "Free", "card": False, "overage": "stops", "have": True,
           "source": "https://acme.test/pricing", "checked": "2026-10-25", "notes": "private"}
    other = {"id": "warpbuild", "name": "WarpBuild", "lane": "cpu", "price_month": None, "includes": "PAYG",
             "unit_cost_vs_payg": "x", "card": True, "overage": "bills", "have": False,
             "source": "https://www.warpbuild.com/pricing", "checked": "2026-10-25", "notes": "private"}

    def build(*dirs_rows):
        with tempfile.TemporaryDirectory() as t:
            dirs = []
            for n, rows in enumerate(dirs_rows):
                d = os.path.join(t, str(n))
                os.makedirs(d)
                with open(os.path.join(d, "free.json"), "w", encoding="utf-8") as f:
                    json.dump({"version": 1, "checked": "2026-11-02", "rows": rows}, f)
                dirs.append(d)
            return merge(dirs)[0]

    def ids(doc):
        return [r["id"] for r in doc["rows"]]

    def checked(doc, mutate=None, text=None):
        doc = json.loads(json.dumps(doc))
        if mutate:
            mutate(doc)
        return check_doc(doc, text if text is not None else render(doc))

    clean = build([new], [old, other])
    v = lambda **kw: (lambda d: d["rows"][0].update(kw))

    def dated(s):
        def mutate(d):
            d["rows"][0]["checked"] = s
            d["checked"] = max(r["checked"] for r in d["rows"])
        return mutate

    future = str(datetime.datetime.now(datetime.timezone.utc).date() + datetime.timedelta(days=30))
    inf_doc = json.loads(json.dumps(clean))
    inf_doc["rows"][0]["price_month"] = float("inf")

    def refuses_inf():
        try:
            render(inf_doc)
        except ValueError:
            return True
        return False

    def infinity_file_fails():
        with tempfile.TemporaryDirectory() as t:
            os.makedirs(os.path.join(t, "catalog"))
            with open(os.path.join(t, CATALOG), "w", encoding="utf-8") as f:
                f.write(render(clean).replace('"price_month": 0,', '"price_month": Infinity,', 1))
            findings, _ = check(t)
        return any("not JSON" in f for f in findings)

    def merge_findings(*dirs_rows):
        """Findings for a merge of source rows that may be wrong; a crash is a failure, so it returns None."""
        try:
            doc = build(*dirs_rows)
            return check_doc(doc, render(doc))
        except Exception:
            return None

    def check_file(raw):
        """What --check does with these bytes as catalog/plans.json: its findings, or CannotCheck."""
        with tempfile.TemporaryDirectory() as t:
            os.makedirs(os.path.join(t, "catalog"))
            with open(os.path.join(t, CATALOG), "wb") as f:
                f.write(raw)
            try:
                return check(t)[0]
            except CannotCheck:
                return "cannot check"

    def format_file(raw):
        """What --format does with these bytes: (CannotCheck or 'ok', the file's bytes afterwards)."""
        with tempfile.TemporaryDirectory() as t:
            os.makedirs(os.path.join(t, "catalog"))
            path = os.path.join(t, CATALOG)
            if raw is not None:
                with open(path, "wb") as f:
                    f.write(raw)
            try:
                format_catalog(t)
                outcome = "ok"
            except CannotCheck:
                outcome = "cannot check"
            return outcome, (open(path, "rb").read() if os.path.exists(path) else None)

    shuffled = json.loads(json.dumps(clean))
    shuffled["rows"].reverse()
    shuffled_bytes = json.dumps(shuffled, indent=1, ensure_ascii=False).encode() + b"\n"
    no_rows = b'{"version": 1}\n'
    cases = [
        ("a clean merge passes --check", not checked(clean)),
        ("every row has exactly PUBLIC_FIELDS", all(tuple(r) == PUBLIC_FIELDS for r in clean["rows"])),
        ("cs_*, evidence, notes, have and verify_note never reach the catalog",
         all(not k.startswith("cs_") and k not in ("evidence", "notes", "have", "verify_note")
             for r in clean["rows"] for k in r)),
        ("ids dedupe, and the newer checked wins", ids(clean).count("acme-free") == 1
         and [r for r in clean["rows"] if r["id"] == "acme-free"][0]["name"] == "Acme Free"),
        ("the newer row wins even from a later source", [r["name"] for r in build([old], [new])["rows"]] == ["Acme Free"]),
        ("on a tie the earlier source wins",
         [r["name"] for r in build([dict(old, checked="2026-11-02")], [new])["rows"]] == ["Acme Free (old)"]),
        ("one id in two lanes keeps both lanes", [r for r in clean["rows"] if r["id"] == "acme-free"][0]["lanes"]
         == ["gpu", "inference"]),
        ("an old row gets its provider and USD", [r for r in clean["rows"] if r["id"] == "warpbuild"][0]["provider"]
         == "WarpBuild" and [r for r in clean["rows"] if r["id"] == "warpbuild"][0]["currency"] == "USD"),
        ("verified follows verified_here", [r["verified"] for r in build([dict(new, verified_here=False)])["rows"]]
         == [False]),
        ("closed and excluded rows stay out",
         ids(build([new, dict(new, id="b", status="closed"), dict(new, id="c", exclude="china")])) == ["acme-free"]),
        ("a row closed in the newer source stays out though an older one is live",
         ids(build([dict(new, status="closed")], [old])) == []),
        ("DROP rows stay out", ids(build([new, dict(new, id="copilot-current")])) == ["acme-free"]),
        ("two merges are byte-identical", render(build([new], [old, other])) == render(clean)),
        ("a private column added to a source never leaks", "secret" not in render(build([dict(new, secret="x")]))),
        ("a stale (non-canonical) file fails", bool(checked(clean, text=render(clean).replace("\n ", "\n  ", 1)))),
        ("an extra key fails", bool(checked(clean, v(cs_status="use")))),
        ("an http source fails", bool(checked(clean, v(source="http://acme.test")))),
        ("an http extra source fails", bool(checked(clean, v(sources_extra=["http://acme.test"])))),
        ("a bad date fails", bool(checked(clean, v(checked="2026-11")))),
        ("an em dash fails", bool(checked(clean, v(includes="one \u2014 two")))),
        ("an email fails", bool(checked(clean, v(limits="write to x" + "@" + "acme.test")))),
        ("a private term fails", bool(checked(clean, v(price_note="Seen on the " + "Soul" + "Craft account.")))),
        ("a duplicate id fails", bool(checked(clean, lambda d: d["rows"].append(dict(d["rows"][0]))))),
        ("a bad lane fails", bool(checked(clean, v(lanes=["cloud"])))),
        ("a currency symbol fails", bool(checked(clean, v(currency="\u20ac")))),
        ("a string price fails", bool(checked(clean, v(price_month="$5")))),
        ("unsorted rows fail", bool(checked(clean, lambda d: d["rows"].reverse()))),
        ("a wrong top-level checked fails", bool(checked(clean, lambda d: d.update(checked="2020-01-01")))),
        # Issue 31: Infinity is not JSON, so it never reaches or passes the catalog.
        ("an infinite price fails", any("price_month" in f for f in check_doc(inf_doc, ""))),
        ("render refuses an infinite price", refuses_inf()),
        ("a catalog file holding Infinity is not JSON", infinity_file_fails()),
        # Issue 33: a date must be a real calendar date, not in the future, with nothing after it.
        # dated() also moves the top-level checked, so only the date itself can fail.
        ("a dated row passes", not checked(clean, dated("2026-11-02"))),
        ("an impossible date fails", bool(checked(clean, dated("2026-02-30")))),
        ("a month 13 date fails", bool(checked(clean, dated("2026-13-01")))),
        ("a future date fails", bool(checked(clean, dated(future)))),
        ("a date with a trailing newline fails", bool(checked(clean, dated("2026-11-02\n")))),
        ("an id with a trailing newline fails", bool(checked(clean, v(id="acme-free\n")))),
        ("a currency with a trailing newline fails", bool(checked(clean, v(currency="USD\n")))),
        # Issue 36: commercial_use, provider_hq, name and provider keep their README types.
        ("a string commercial_use fails", bool(checked(clean, v(commercial_use="only on weekends")))),
        ("a country name as provider_hq fails", bool(checked(clean, v(provider_hq="United States of America")))),
        ("a lowercase provider_hq fails", bool(checked(clean, v(provider_hq="us")))),
        ("a null provider_hq passes", not checked(clean, v(provider_hq=None))),
        ("a number as name fails", bool(checked(clean, v(name=5)))),
        ("a list as provider fails", bool(checked(clean, v(provider=["Acme"])))),
        ("a blank-padded name fails", bool(checked(clean, v(name=" Acme Free ")))),
        ("a blank provider fails", bool(checked(clean, v(provider="   ")))),
        # Issue 20: a source row with no lane, or a lane the catalog does not know, is a finding, not a crash.
        ("a source row with an unknown lane is reported, not a crash",
         any("lanes" in f for f in merge_findings([dict(new, lane="storage")]) or [])),
        ("a source row with no lane is reported, not a crash",
         any("lanes" in f for f in merge_findings([{k: x for k, x in new.items() if k != "lane"}]) or [])),
        ("an unknown lane beside a known one keeps the known lane first",
         build([new], [dict(old, lane="storage")])["rows"][0]["lanes"] == ["gpu", "storage"]),
        # Issue 23: a source row with no checked date is a finding, not a crash.
        ("a source row with no checked date is reported, not a crash",
         any("checked" in f for f in merge_findings([new, dict(other, id="beta-free", checked=None)]) or [])),
        ("a source row with no checked key is reported, not a crash",
         any("checked" in f for f in merge_findings([new, {k: x for k, x in other.items() if k != "checked"}]) or [])),
        ("a row with a null checked never beats a dated row",
         [r["name"] for r in build([new], [dict(old, checked=None)])["rows"]] == ["Acme Free"]),
        ("the top-level checked is the newest valid date when another row has none",
         build([new, dict(other, checked=None)])["checked"] == "2026-11-02"),
        # Issue 25: a catalog that is not UTF-8 is infrastructure (exit 2), not a traceback.
        ("a catalog with a byte that is not UTF-8 cannot be checked (exit 2)",
         check_file(render(clean).encode().replace(b"Acme", b"Acm\xe9", 1)) == "cannot check"),
        ("a catalog that is a UTF-8 file still checks", check_file(render(clean).encode()) == []),
        # Issue 21: --format never tracebacks: a bad or missing catalog is exit 2, a wrong shape is left for --check.
        ("--format on a missing catalog cannot check (exit 2)", format_file(None) == ("cannot check", None)),
        ("--format on a catalog that is not JSON cannot check (exit 2)",
         format_file(b"{not json") == ("cannot check", b"{not json")),
        ("--format on a catalog that is not UTF-8 cannot check (exit 2)",
         format_file(b"\xe9") == ("cannot check", b"\xe9")),
        ("--format on a catalog with no rows list leaves it for --check",
         format_file(no_rows) == ("ok", no_rows) and bool(check_file(no_rows))),
        ("--format on a catalog whose rows are not objects leaves it for --check",
         format_file(b'{"version": 1, "rows": [5]}\n') == ("ok", b'{"version": 1, "rows": [5]}\n')),
        ("--format sorts a catalog's rows and writes it canonically",
         format_file(shuffled_bytes) == ("ok", render(clean).encode())),
    ]
    try:  # infrastructure: a missing catalog must say "could not check", never look like a finding
        with tempfile.TemporaryDirectory() as t:
            check(t)
        cases.append(("a missing catalog is infrastructure (exit 2)", False))
    except CannotCheck:
        cases.append(("a missing catalog is infrastructure (exit 2)", True))
    bad = 0
    for name, good in cases:
        bad |= not good
        print(f"self-test: {'ok   ' if good else 'WRONG'} {name}")
    print("self-test passed" if not bad else "self-test FAILED")
    return 1 if bad else 0


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
