"""Seeded rows and helpers for `python3 -I tools/catalog.py --self-test`: merge, check and format a catalog made from them."""
import contextlib
import json
import os
import tempfile

from catalog import CATALOG, CannotCheck, check, check_doc, format_catalog, merge, render

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
