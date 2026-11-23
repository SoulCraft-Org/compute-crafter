"""The seeded samples of `python3 -I tools/catalog.py --self-test`: each merges, checks or formats a catalog made from
seeded rows and must pass or fail the way its name says."""
import contextlib
import datetime
import json
import os
import tempfile

from catalog import CATALOG, PUBLIC_FIELDS, CannotCheck, check, check_doc, format_catalog, merge, render

NEW = {"id": "acme-free", "name": "Acme Free", "provider": "Acme", "provider_hq": "US", "exclude": None,
       "status": "live", "lane": "gpu", "price_month": 0, "currency": "USD", "price_note": "Free.",
       "includes": "10 GPU hours a month.", "resets": "monthly", "unit_cost_vs_payg": "Free.", "card": False,
       "overage": "stops", "trains_on_data": None, "commercial_use": None, "limits": "One account.",
       "source": "https://acme.test/pricing", "sources_extra": ["https://acme.test/docs"], "checked": "2026-11-02",
       "verified_here": True, "evidence": [{"url": "https://acme.test", "quote": "q"}], "verify_note": "private",
       "cs_status": "use", "cs_note": "private", "notes": "private"}
OLD = {"id": "acme-free", "name": "Acme Free (old)", "lane": "inference", "price_month": 0, "includes": "old",
       "unit_cost_vs_payg": "Free", "card": False, "overage": "stops", "have": True,
       "source": "https://acme.test/pricing", "checked": "2026-10-25", "notes": "private"}
OTHER = {"id": "warpbuild", "name": "WarpBuild", "lane": "cpu", "price_month": None, "includes": "PAYG",
         "unit_cost_vs_payg": "x", "card": True, "overage": "bills", "have": False,
         "source": "https://www.warpbuild.com/pricing", "checked": "2026-10-25", "notes": "private"}


def build(*dirs_rows):
    """The catalog merged from one source folder per list of rows, each folder holding a free.json."""
    with tempfile.TemporaryDirectory() as t:
        dirs = []
        for n, rows in enumerate(dirs_rows):
            d = os.path.join(t, str(n))
            os.makedirs(d)
            with open(os.path.join(d, "free.json"), "w", encoding="utf-8") as f:
                json.dump({"version": 1, "checked": "2026-11-02", "rows": rows}, f)
            dirs.append(d)
        return merge(dirs)[0]


def checked(doc, mutate=None, text=None):
    """The findings for a copy of doc after mutate changed it, against text (default: the copy's canonical form)."""
    doc = json.loads(json.dumps(doc))
    if mutate:
        mutate(doc)
    return check_doc(doc, text if text is not None else render(doc))


def refuses_inf(doc):
    """Whether render refuses doc: a catalog holding an infinite price is not JSON."""
    try:
        render(doc)
    except ValueError:
        return True
    return False


def merge_findings(*dirs_rows):
    """Findings for a merge of source rows that may be wrong; a crash is a failure, so it returns None."""
    try:
        doc = build(*dirs_rows)
        return check_doc(doc, render(doc))
    except Exception:
        return None


@contextlib.contextmanager
def root_with(raw):
    """A temporary repo root whose catalog/plans.json holds raw bytes (no file when raw is None)."""
    with tempfile.TemporaryDirectory() as t:
        os.makedirs(os.path.join(t, "catalog"))
        if raw is not None:
            with open(os.path.join(t, CATALOG), "wb") as f:
                f.write(raw)
        yield t


def check_file(raw):
    """What --check does with these bytes as catalog/plans.json: its findings, or "cannot check"."""
    with root_with(raw) as t:
        try:
            return check(t)[0]
        except CannotCheck:
            return "cannot check"


def format_file(raw):
    """What --format does with these bytes: ("ok" or "cannot check", the file's bytes afterwards)."""
    with root_with(raw) as t:
        path = os.path.join(t, CATALOG)
        try:
            format_catalog(t)
            outcome = "ok"
        except CannotCheck:
            outcome = "cannot check"
        return outcome, (open(path, "rb").read() if os.path.exists(path) else None)


def dated(s):
    """A mutation that gives the first row the checked date s and keeps the top-level checked the newest."""
    def mutate(d):
        d["rows"][0]["checked"] = s
        d["checked"] = max(r["checked"] for r in d["rows"])
    return mutate


CLEAN = build([NEW], [OLD, OTHER])
INF_DOC = {**CLEAN, "rows": [{**CLEAN["rows"][0], "price_month": float("inf")}, *CLEAN["rows"][1:]]}
NO_ROWS = b'{"version": 1}\n'
SHUFFLED = json.dumps({**CLEAN, "rows": CLEAN["rows"][::-1]}, indent=1, ensure_ascii=False).encode() + b"\n"
v = lambda **kw: (lambda d: d["rows"][0].update(kw))
ids = lambda doc: [r["id"] for r in doc["rows"]]
names = lambda doc: [r["name"] for r in doc["rows"]]
row = lambda doc, rid: next(r for r in doc["rows"] if r["id"] == rid)

# Mutations of the clean catalog, each of which must produce a finding.
FAILING = [
    ("an extra key fails", v(cs_status="use")),
    ("an http source fails", v(source="http://acme.test")),
    ("an http extra source fails", v(sources_extra=["http://acme.test"])),
    ("a bad date fails", v(checked="2026-11")),
    ("an em dash fails", v(includes="one \u2014 two")),
    ("an email fails", v(limits="write to x" + "@" + "acme.test")),
    ("a private term fails", v(price_note="Seen on the " + "Soul" + "Craft account.")),
    ("a duplicate id fails", lambda d: d["rows"].append(dict(d["rows"][0]))),
    ("a bad lane fails", v(lanes=["cloud"])),
    ("a currency symbol fails", v(currency="\u20ac")),
    ("a string price fails", v(price_month="$5")),
    ("unsorted rows fail", lambda d: d["rows"].reverse()),
    ("a wrong top-level checked fails", lambda d: d.update(checked="2020-01-01")),
    # Issue 33: a date must be a real calendar date, not in the future, with nothing after it.
    # dated() also moves the top-level checked, so only the date itself can fail.
    ("an impossible date fails", dated("2026-02-30")),
    ("a month 13 date fails", dated("2026-13-01")),
    ("a future date fails", dated(str(datetime.datetime.now(datetime.timezone.utc).date() + datetime.timedelta(days=30)))),
    ("a date with a trailing newline fails", dated("2026-11-02\n")),
    ("an id with a trailing newline fails", v(id="acme-free\n")),
    ("a currency with a trailing newline fails", v(currency="USD\n")),
    # Issue 36: commercial_use, provider_hq, name and provider keep their README types.
    ("a string commercial_use fails", v(commercial_use="only on weekends")),
    ("a country name as provider_hq fails", v(provider_hq="United States of America")),
    ("a lowercase provider_hq fails", v(provider_hq="us")),
    ("a number as name fails", v(name=5)),
    ("a list as provider fails", v(provider=["Acme"])),
    ("a blank-padded name fails", v(name=" Acme Free ")),
    ("a blank provider fails", v(provider="   ")),
]


def merge_cases():
    """Samples for the merge: ids, lanes, dates, status, the allowlist and a repeat run."""
    return [
        ("a clean merge passes --check", not checked(CLEAN)),
        ("every row has exactly PUBLIC_FIELDS", all(tuple(r) == PUBLIC_FIELDS for r in CLEAN["rows"])),
        ("cs_*, evidence, notes, have and verify_note never reach the catalog",
         all(not k.startswith("cs_") and k not in ("evidence", "notes", "have", "verify_note") for r in CLEAN["rows"] for k in r)),
        ("ids dedupe, and the newer checked wins", ids(CLEAN).count("acme-free") == 1 and row(CLEAN, "acme-free")["name"] == "Acme Free"),
        ("the newer row wins even from a later source", names(build([OLD], [NEW])) == ["Acme Free"]),
        ("on a tie the earlier source wins", names(build([dict(OLD, checked="2026-11-02")], [NEW])) == ["Acme Free (old)"]),
        ("one id in two lanes keeps both lanes", row(CLEAN, "acme-free")["lanes"] == ["gpu", "inference"]),
        ("an old row gets its provider and USD", [row(CLEAN, "warpbuild")[k] for k in ("provider", "currency")] == ["WarpBuild", "USD"]),
        ("verified follows verified_here", [r["verified"] for r in build([dict(NEW, verified_here=False)])["rows"]] == [False]),
        ("closed and excluded rows stay out",
         ids(build([NEW, dict(NEW, id="b", status="closed"), dict(NEW, id="c", exclude="china")])) == ["acme-free"]),
        ("a row closed in the newer source stays out though an older one is live", ids(build([dict(NEW, status="closed")], [OLD])) == []),
        ("DROP rows stay out", ids(build([NEW, dict(NEW, id="copilot-current")])) == ["acme-free"]),
        ("two merges are byte-identical", render(build([NEW], [OLD, OTHER])) == render(CLEAN)),
        ("a private column added to a source never leaks", "secret" not in render(build([dict(NEW, secret="x")]))),
    ]


def check_cases():
    """Samples for the checks: what passes, every finding in FAILING, and Infinity, which is not JSON."""
    return [
        ("a stale (non-canonical) file fails", bool(checked(CLEAN, text=render(CLEAN).replace("\n ", "\n  ", 1)))),
        ("a dated row passes", not checked(CLEAN, dated("2026-11-02"))),
        ("a null provider_hq passes", not checked(CLEAN, v(provider_hq=None))),
        # Issue 31: Infinity is not JSON, so it never reaches or passes the catalog.
        ("an infinite price fails", any("price_month" in f for f in check_doc(INF_DOC, ""))),
        ("render refuses an infinite price", refuses_inf(INF_DOC)),
        ("a catalog file holding Infinity is not JSON",
         any("not JSON" in f for f in check_file(render(CLEAN).replace('"price_month": 0,', '"price_month": Infinity,', 1).encode()))),
    ] + [(name, bool(checked(CLEAN, mutate))) for name, mutate in FAILING]
