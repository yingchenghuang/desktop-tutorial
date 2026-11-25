"""Validate the reviewed 2026-11-22 public-art, competition and exhibition batch."""
import json
import pathlib
import re
from datetime import datetime
from PIL import Image

ROOT = pathlib.Path(__file__).resolve().parents[1]
DATA = ROOT / "data"
ART_PATH = DATA / "backfill-november-20261122.json"
EXHIBITION_PATH = DATA / "exhibitions-galleriesnow-20261122.json"


def load(path):
    return json.loads(path.read_text(encoding="utf-8"))


art = load(ART_PATH)["entries"]
exhibitions = load(EXHIBITION_PATH)["entries"]
competitions_all = load(DATA / "competitions.json")["entries"]
competitions = [x for x in competitions_all if x.get("collectionDate") == "2026-11-22"]
new = art + competitions + exhibitions

distribution = {
    "current": sum(x.get("researchGroup") == "current" for x in art),
    "globalClassic": sum(x.get("researchGroup") == "globalClassic" for x in art),
    "germanClassic": sum(x.get("researchGroup") == "germanClassic" for x in art),
}

deadline_errors = []
now = datetime.fromisoformat("2026-11-26T05:00:00+08:00")
for row in competitions_all:
    value = row.get("deadline", "")
    try:
        parsed = datetime.fromisoformat(value)
        if parsed.utcoffset() is None or parsed <= now:
            deadline_errors.append({"id": row.get("id"), "deadline": value, "reason": "missing-offset-or-expired"})
    except Exception:
        deadline_errors.append({"id": row.get("id"), "deadline": value, "reason": "unparseable"})
    if not row.get("deadlineTimezone"):
        deadline_errors.append({"id": row.get("id"), "deadline": value, "reason": "missing-timezone"})

keys = [x.get("dedupeKey") for x in new]
missing = []
required = ["dedupeKey", "cityKeywords", "website", "photo", "classicImage", "imageSourceUrl", "imageCredit", "comment"]
for row in new:
    absent = [field for field in required if not row.get(field)]
    if len(row.get("cityKeywords", [])) < 2:
        absent.append("cityKeywords<2")
    path = ROOT / row.get("imageCachedPath", "")
    try:
        with Image.open(path) as image:
            image.load()
            if image.format != "JPEG" or min(image.size) < 120:
                absent.append("invalid-image")
    except Exception:
        absent.append("invalid-image")
    if row.get("category") == "公開徵件":
        absent += [field for field in ["eligibility", "budget", "applicationFee", "deadlineTimezone", "deadlinePrecision"] if not row.get(field)]
    if absent:
        missing.append({"id": row.get("id"), "fields": sorted(set(absent))})

report = {
    "date": "2026-11-22",
    "validatedAt": "2026-11-26T05:00:00+08:00",
    "publicArt": {"total": len(art), "distribution": distribution},
    "competitions": {"added": len(competitions), "activeTotal": len(competitions_all), "expiredOrInvalid": deadline_errors},
    "exhibitions": {"added": len(exhibitions)},
    "newDedupeKeys": {"total": len(keys), "unique": len(set(keys)), "duplicates": sorted({x for x in keys if keys.count(x) > 1})},
    "requiredFieldOrImageErrors": missing,
    "cityKeywordsMissing": [x.get("id") for x in new if len(x.get("cityKeywords", [])) < 2],
    "crossCityLinks": "前端依 cityKeywords 動態產生；assets/app.js isCrossDatabaseCityMatch 已保留",
    "passed": len(art) == 20 and distribution == {"current": 10, "globalClassic": 5, "germanClassic": 5}
        and len(competitions) == 5 and len(exhibitions) == 5 and not deadline_errors
        and len(keys) == len(set(keys)) and not missing,
}
path = ROOT / "review/20261122-daily-validation.json"
path.write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
print(json.dumps(report, ensure_ascii=False, indent=2))
raise SystemExit(0 if report["passed"] else 1)
