#!/usr/bin/env python3
"""Incremental first-party PublicSpace case discovery. Notion sync remains separately verified."""
import concurrent.futures
import datetime as dt
import json
import re
import time
import unicodedata
from pathlib import Path
from urllib.parse import urlsplit
import requests
from bs4 import BeautifulSoup

ROOT = "https://www.publicspace.org"
YEARS = [2026, 2024, 2022, 2018, 2016, 2014, 2012, 2010, 2008, 2006, 2004, 2002, 2000]
FILE = Path("data/publicspace-catalog.json")
MANIFEST = Path("data/publicspace-manifest.json")
AUDIT = Path("review/publicspace-collection-audit.json")
AGENT = {"User-Agent": "PublicArtArchiveResearch/1.0 (non-commercial; case citations; respectful crawl)"}
PATTERN = re.compile(r"/(?:en/)?works/-/project/([a-zA-Z0-9-]+)")
now = dt.datetime.now(dt.timezone(dt.timedelta(hours=8))).isoformat(timespec="seconds")
today = now[:10]
session = requests.Session()
session.headers.update(AGENT)

def unique_url(u):
    m = PATTERN.search(u or "")
    return ROOT + "/en/works/-/project/" + m.group(1) if m else None

def candidate_urls(html):
    doc = BeautifulSoup(html or "", "html.parser")
    result = set()
    for a in doc.select("a[href]"):
        u = unique_url(a.get("href"))
        if u:
            result.add(u)
    for m in PATTERN.finditer(html or ""):
        result.add(ROOT + "/en/works/-/project/" + m.group(1))
    return result

def get(url):
    try:
        r = session.get(url, timeout=24)
        r.raise_for_status()
        return r.text
    except Exception as e:
        print("READ_FAILED", url, str(e)[:180], flush=True)
        return ""

def discover():
    urls = set()
    stats = {}
    index = ROOT + "/en/works"
    body = get(index)
    urls |= candidate_urls(body)
    stats["worksInitial"] = len(urls)
    # PublicSpace is a Liferay site; cards may be rendered asynchronously.
    try:
        from playwright.sync_api import sync_playwright
        with sync_playwright() as p:
            browser = p.chromium.launch(headless=True, args=["--no-sandbox"])
            page = browser.new_page(viewport={"width": 1350, "height": 940})
            page.goto(index, wait_until="domcontentloaded", timeout=55000)
            page.wait_for_timeout(3200)
            unchanged = 0
            for step in range(70):
                for label in ("Load more", "Show more", "See more", "More results", "載入更多"):
                    for button in page.get_by_text(label, exact=True).all()[:2]:
                        try:
                            if button.is_visible():
                                button.click(timeout=1200)
                        except Exception:
                            pass
                page.evaluate("window.scrollTo(0,document.body.scrollHeight)")
                page.wait_for_timeout(850)
                current = candidate_urls(page.content())
                before = len(urls)
                urls.update(current)
                unchanged = unchanged + 1 if len(urls) == before else 0
                if unchanged >= 8:
                    break
            stats["worksBrowser"] = len(urls)
            browser.close()
    except Exception as e:
        stats["browserError"] = str(e)[:240]
    for year in YEARS:
        for section in ("selected-only", "results", "finalists-only"):
            url = ROOT + "/en/the-prize/-/edition/" + str(year) + "/" + section
            html = get(url)
            found = candidate_urls(html)
            urls.update(found)
            stats[str(year) + "-" + section] = len(found)
            time.sleep(0.35)
    return sorted(urls), stats

def line_value(text, key):
    m = re.search(r"(?:^|\n)\s*" + re.escape(key) + r"\s*:\s*([^\n]+)", text, re.I)
    return m.group(1).strip() if m else ""

def parse_case(url):
    html = get(url)
    if not html:
        return None
    doc = BeautifulSoup(html, "html.parser")
    # Liferay's page masthead often renders a blank h1 before the artwork title.
    titles = [h.get_text(" ", strip=True) for h in doc.find_all("h1")]
    name = next((t for t in titles if len(t)>3 and t.lower() not in ("works", "publicspace", "public space")), "")
    if not name or name.lower() in ("works", "publicspace", "public space"):
        return None
    text = doc.get_text("\n", strip=True)
    h2_values = [h.get_text(" ", strip=True) for h in doc.find_all("h2")]
    label = next((t for t in h2_values if re.search(r"\([^)]+\)\s*,\s*(?:19|20)\d{2}", t)), "")
    m = re.search(r"^(.+?)\s*\(([^)]+)\)\s*,\s*(20\d\d|19\d\d)", label)
    city = m.group(1).strip() if m else line_value(text, "CITY")
    country = m.group(2).strip() if m else line_value(text, "COUNTRY")
    year = m.group(3) if m else line_value(text, "END OF WORK")
    year_match = re.search(r"(19|20)\d{2}", year or "")
    year = year_match.group(0) if year_match else "未公開"
    desc = doc.select_one('meta[name="description"]')
    summary = (desc.get("content") or "").strip() if desc else ""
    if not summary or len(summary) < 35:
        summary = next((p.get_text(" ", strip=True) for p in doc.select("p") if len(p.get_text(" ", strip=True)) >= 80), "")
    summary = summary[:2000]
    og = doc.select_one('meta[property="og:image"]')
    img = (og.get("content") or "") if og else ""
    if img and img.startswith("/"):
        img = ROOT + img
    slug = unique_url(url).rsplit("/", 1)[-1]
    city = city or "未公開"
    if year != "未公開":
        updated = year + "-12-31"
    else:
        updated = "2000-01-01"
    cn = f"「{name}」為{country} {city}的公共空間案例（{year}）。本筆依 PublicSpace 原始頁建檔，涉及城市場域、更新方式與原設計團隊之詳細敘述請見官方全文。"
    return {"id": "publicspace-" + slug, "dedupeKey": "publicspace:" + slug,
       "name": "PublicSpace｜" + name, "category":"作品/展覽", "tier":"公共空間案例庫",
       "region":"西方","country":country + " / " + city,
       "cityKeywords":[city, unicodedata.normalize("NFKC", city)],
       "media":["建築/場域"], "works":name + "｜" + year,
       "comment":cn, "classicTitle":name + "｜" + year,
       "classicDesc":cn + " 英文概要：" + summary[:650], "englishSummary":summary,
       "website":url, "workPage":url, "photo":img,
       "classicImage":img, "imageKind":"第一方頁面影像候選，待人工核對",
       "imageCredit":"請查閱官方案例頁逐圖攝影署名",
       "imageRights":"未公開；禁止視作可再利用授權",
       "imageVerification":"自動擷取候選，待逐圖確認",
       "accessNote":"官方獎項檔案不能證明目前仍開放；待地方管理機關覆核",
       "status":"官方來源", "updated":updated, "originalDate":year,
       "researchGroup":"publicspaceSpecial", "collectionSeries":"PublicSpace / CCCB",
       "sourceCheckedDate":today, "collectionDate":today,
       "relatedByCity":[], "sourceProjectId":slug,
       "reviewStatus":"自動匯入：待人工校正作品屬性、繁中論述、圖片授權及開放狀態",
       "needsChineseReview":True, "needsImageReview":True,
       "statementType":"官方英文來源研究摘要，中文為索引用描述",
       "artistStatementSource":url}

def read_json(path, fallback):
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except Exception:
        return fallback

def main():
    urls, discovery = discover()
    old = read_json(FILE, {"entries":[]})
    known = {e["dedupeKey"]: e for e in old.get("entries",[]) if e.get("dedupeKey")}
    new_urls = [u for u in urls if "publicspace:" + u.rsplit("/",1)[-1] not in known]
    print("DISCOVERY", json.dumps({"uniqueUrls":len(urls),"sources":discovery},ensure_ascii=False),flush=True)
    print("SAMPLE_URLS", new_urls[:10],flush=True)
    # Do not overwhelm the original institution: six concurrent requests maximum.
    with concurrent.futures.ThreadPoolExecutor(max_workers=6) as pool:
        for item in pool.map(parse_case, new_urls):
            if item and item.get("cityKeywords") and item.get("website"):
                known[item["dedupeKey"]] = item
    records = sorted(known.values(), key=lambda e: e["dedupeKey"])
    failures = len(new_urls) - (len(records) - len(old.get("entries",[])))
    report = {"generatedAt":now, "discoveredUniqueUrls":len(urls),
       "newUrlsRequested":len(new_urls), "newRecordsImported":max(0,len(records)-len(old.get("entries",[]))),
       "fetchFailuresOrInvalid":max(0,failures),"discovery":discovery,
       "sourceAdvertisedMoreThan":438,
       "humanReviewRequired":True, "notionBulkSyncPending":True}
    AUDIT.parent.mkdir(parents=True, exist_ok=True)
    AUDIT.write_text(json.dumps(report,ensure_ascii=False,indent=2)+"\n",encoding="utf-8")
    # A blocked or empty crawl must never replace existing case data.
    if not records:
        print("NO_VALID_RECORDS; source blocked, title selectors changed, or index returned empty", flush=True)
        return 2
    FILE.parent.mkdir(parents=True, exist_ok=True)
    FILE.write_text(json.dumps({"meta":{"date":today,"generatedAt":now,
       "kind":"supplement", "collectionSeries":"PublicSpace / CCCB",
       "total":len(records), "completeness":"automatically-collected-unreviewed"},
       "entries":records},ensure_ascii=False,indent=2)+"\n",encoding="utf-8")
    seed = read_json(Path("data/publicspace-special-20261117.json"),{"entries":[]})
    unique = {e["dedupeKey"] for e in records}
    unique.update(e.get("dedupeKey") for e in seed.get("entries",[]))
    manifest = read_json(MANIFEST,{})
    manifest.update({"version":"publicspace-" + today.replace("-","") + "-automated",
       "generatedAt":now,"files":["publicspace-special-20261117.json","publicspace-catalog.json"],
       "activeEntries":len(unique),"autoDiscoveredUrls":len(urls),
       "autoImportedEntries":len(records),"ingestionStatus":"unreviewed-automated",
       "notionSyncedEntries":7,"notionPlatformEntries":1,
       "humanReviewRequired":True,"excludedFromDailyPublicArt":True,
       "excludedFromCompetitions":True,
       "note":"全站候選案例自動採集，未完成全量逐筆人工驗收及Notion同步；不能把此數量當作已核對的公共藝術作品。"})
    MANIFEST.write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+"\n",encoding="utf-8")
    print(json.dumps(report,ensure_ascii=False),flush=True)
    return 0

if __name__ == "__main__":
    raise SystemExit(main())
