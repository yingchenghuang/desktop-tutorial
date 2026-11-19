#!/usr/bin/env python3
"""Check the *deployed* GitHub Pages PublicSpace data and a rendered case gallery."""
import json
import sys
import time
from urllib.request import Request, urlopen
from urllib.error import HTTPError, URLError

BASE = "https://yingchenghuang.github.io/desktop-tutorial/"
REPORT = {"base": BASE, "endpoints": {}, "imagesSample": [], "browser": {}}
FAILURES = []

def get(path, expect_json=False, attempts=5):
    last = None
    for n in range(attempts):
        try:
            u = path if path.startswith("https://") else BASE + path + ("&" if "?" in path else "?") + "verify=" + str(time.time_ns())
            r = urlopen(Request(u, headers={"User-Agent":"Mozilla/5.0 PublicArtArchive/1.0"}), timeout=25)
            data = r.read()
            ct = r.headers.get("Content-Type", "")
            if r.status != 200:
                raise RuntimeError("HTTP "+str(r.status))
            if expect_json:
                if "json" not in ct.lower():
                    raise RuntimeError("Expected JSON, got "+ct)
                return json.loads(data.decode("utf-8"))
            return data
        except Exception as e:
            last = str(e)
            if n < attempts-1:
                time.sleep(3 + n*2)
    raise RuntimeError("GET "+path+" failed: "+str(last))

def check_endpoints():
    html=get("")
    assert b'publicspace' in html.lower() and "公共空間案例庫".encode() in html, "PublicSpace filter missing"
    REPORT["endpoints"]["homepage"]={"status":200,"bytes":len(html)}
    app=get("assets/app.js?t=20261117-publicspace-images-r1")
    assert b"case-photo-gallery" in app and b"images" in app, "Gallery JS missing"
    REPORT["endpoints"]["app.js"]={"status":200,"bytes":len(app)}
    manifest=get("data/publicspace-manifest.json",True)
    assert manifest["activeEntries"]>=248, manifest
    assert manifest["notionSyncedEntries"]>=248, manifest
    assert manifest["imageTotal"]>=4057, manifest
    REPORT["endpoints"]["publicspace-manifest.json"]={"status":200,"version":manifest["version"],"imageTotal":manifest["imageTotal"]}
    catalog=get("data/publicspace-catalog.json",True)
    entries=catalog["entries"]
    assert len(entries)>=248, "Catalog shorter than 248"
    keys=[e["dedupeKey"] for e in entries]
    assert len(keys)==len(set(keys)), "Duplicate dedupeKey"
    image_count=sum(len(e.get("images",[])) for e in entries)
    assert image_count>=4057, image_count
    assert all(e.get("images") and e.get("photo")==e["images"][0]["url"] for e in entries), "Main photo or gallery missing"
    REPORT["endpoints"]["publicspace-catalog.json"]={"status":200,"entries":len(entries),"imageLinks":image_count}
    return entries

def check_photo_samples(entries):
    indices=[0,len(entries)//6,len(entries)//3,len(entries)//2,2*len(entries)//3,len(entries)-1]
    for i in indices:
        e=entries[i]
        image=e["photo"]
        item={"key":e["dedupeKey"],"url":image}
        try:
            u=urlopen(Request(image, headers={"User-Agent":"Mozilla/5.0","Accept":"image/*"}),timeout=20)
            ct=u.headers.get("Content-Type","")
            sample=u.read(512)
            item.update({"status":u.status,"contentType":ct,"bytesRead":len(sample)})
            if u.status!=200 or not ct.lower().startswith("image/") or not sample:
                FAILURES.append("Nonimage response from "+image)
        except Exception as err:
            item["error"]=str(err)
            FAILURES.append("Photo access "+e["dedupeKey"]+": "+str(err))
        REPORT["imagesSample"].append(item)

def check_rendered_gallery():
    from playwright.sync_api import sync_playwright
    try:
        with sync_playwright() as p:
            browser=p.chromium.launch(headless=True,args=["--no-sandbox"])
            page=browser.new_page(viewport={"width":1360,"height":900})
            page.goto(BASE,wait_until="domcontentloaded",timeout=70000)
            page.wait_for_function(
              "()=>document.querySelector('#resultCount') && !/載入中/.test(document.querySelector('#resultCount').textContent)",
              timeout=120000)
            page.locator('#q').fill("Bridgefoot Street Park")
            page.wait_for_timeout(1400)
            cards=page.locator('#grid .card')
            count=cards.count()
            REPORT["browser"]["searchCount"]=count
            if count<1:
                FAILURES.append("Bridgefoot Street Park search returned no cards")
            else:
                cards.first.click(timeout=15000)
                page.locator('#sheet.open #panel').wait_for(timeout=15000)
                gallery_n=page.locator('#panel .case-photo-grid figure').count()
                REPORT["browser"]["case"]="Bridgefoot Street Park"
                REPORT["browser"]["secondaryGalleryFigures"]=gallery_n
                if gallery_n<19:
                    FAILURES.append("Expected 19 secondary photos for Bridgefoot, got "+str(gallery_n))
            browser.close()
    except Exception as e:
        REPORT["browser"]["error"]=str(e)
        FAILURES.append("Browser: "+str(e))


def check_daily_art_and_competitions():
    from datetime import datetime, timezone, timedelta
    from zoneinfo import ZoneInfo
    import re
    nov = get("data/backfill-november-manifest.json", True)
    daily_files = sorted(f for f in nov.get("files", []) if re.fullmatch(r"backfill-november-\d{8}\.json", f))
    assert daily_files, "No daily public-art file in month manifest"
    daily_file = daily_files[-1]
    day = datetime.strptime(daily_file[-13:-5], "%Y%m%d").date().isoformat()
    art = get("data/" + daily_file, True)
    comps = get("data/competitions.json", True)
    cman = get("data/competition-manifest.json", True)
    records = art.get("entries", [])
    active = comps.get("entries", [])
    groups = {key: sum(e.get("researchGroup") == key for e in records)
              for key in ("current", "globalClassic", "germanClassic")}
    assert len(records) == 20 and groups == {"current":10,"globalClassic":5,"germanClassic":5}, groups
    assert daily_file in nov.get("files", []), "Latest daily file missing from month manifest"
    assert len({e.get("dedupeKey") for e in records}) == 20, "Art duplicate keys"
    assert all(e.get("website") and e.get("photo") and e.get("cityKeywords") and e.get("comment") and e.get("material") for e in records), "Art missing source/image/city/comment/material"
    assert len({e.get("dedupeKey") for e in active}) == len(active), "Competition duplicate keys"
    assert len(active) == cman.get("activeEntries"), "Competition manifest count mismatch"
    added = [e for e in active if e.get("updated") == day]
    assert len(added) == 5 and cman.get("addedToday") == 5, "Competition new count mismatch"
    assert all(e.get("cityKeywords") and e.get("website") and (e.get("photo") or (e.get("imageDisplayPolicy") == "link-only" and e.get("imageSourceUrl") and e.get("imageCredit") and e.get("imageRights"))) for e in active), "Competition missing city/source/image provenance"
    offset_mismatches = []
    verified_timezone_overrides = []
    now = datetime.now(timezone.utc)
    for e in active:
        dl = e.get("deadline", "")
        assert re.fullmatch(r"\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d[+-]\d\d:\d\d", dl), "Bad ISO deadline: " + str(e.get("id"))
        instant = datetime.fromisoformat(dl)
        assert instant > now, "Expired competition: " + str(e.get("id"))
        tz = ZoneInfo(e.get("deadlineTimezone"))
        expected_offset = instant.astimezone(tz).utcoffset()
        # Alberta adopted permanent UTC-06 on 2026-11-01. Older runner tzdb
        # may still return MST; validate the sourced reform rather than change deadlines.
        if (e.get("deadlineTimezone") == "America/Edmonton"
                and instant.date().isoformat() >= "2026-11-01"
                and e.get("timezoneCorrectionSource") == "https://www.alberta.ca/albertas-new-time-system-abt"):
            expected_offset = timedelta(hours=-6)
            verified_timezone_overrides.append(e["id"])
        if instant.utcoffset() != expected_offset:
            offset_mismatches.append(e.get("id"))
    assert not offset_mismatches, "Timezone offset mismatch: " + repr(offset_mismatches)
    REPORT["endpoints"][daily_file] = {"status":200,"entries":len(records),"groups":groups}
    REPORT["endpoints"]["backfill-november-manifest.json"] = {"status":200,"version":nov.get("version"),"fileCount":len(nov.get("files",[]))}
    REPORT["endpoints"]["competitions.json"] = {"status":200,"active":len(active),"addedToday":len(added),"expired":0}
    REPORT["endpoints"]["competition-manifest.json"] = {"status":200,"version":cman.get("version"),"active":cman.get("activeEntries")}
    REPORT["daily"] = {"date":day,"duplicateKeys":0,"missingSourceImageCity":0,"timezoneMismatches":0,"verifiedAlbertaReformOverrides":verified_timezone_overrides,"originalPhotoAudit":"not completed for all original images; source links and rights notes retained"}
    return records, active

def check_daily_search_and_city_link(records, active):
    from playwright.sync_api import sync_playwright
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True, args=["--no-sandbox"])
        page = browser.new_page(viewport={"width":1360,"height":900})
        page.goto(BASE,wait_until="domcontentloaded",timeout=70000)
        page.wait_for_function("()=>document.querySelector('#resultCount') && /顯示/.test(document.querySelector('#resultCount').textContent)",timeout=120000)
        page.locator("#q").fill(records[0]["classicTitle"])
        page.wait_for_timeout(1000)
        assert page.locator("#grid .card").count() >= 1, "Latest public artwork search failed"
        page.locator("#grid .card").first.click()
        if records[0].get("imageDisplayPolicy") == "link-only":
            assert records[0].get("imageRights"), "Missing latest artwork rights"
            assert page.locator("#panel figure img").count() == 0, "Link-only artwork image was embedded"
        page.locator("#sheetClose").click()
        page.locator("#q").fill("Sound to Summit")
        page.wait_for_timeout(1000)
        cards = page.locator("#grid .card")
        assert cards.count() == 1, "Sound to Summit search failed: "+str(cards.count())
        cards.first.click()
        page.locator("#sheet.open #panel").wait_for(timeout=12000)
        related = page.locator("#panel .related-block")
        assert related.count() >= 1, "Missing same-city cross-database links"
        assert "4Culture" in related.first.inner_text(), "Seattle related opportunity missing"
        related.first.locator("[data-related-id]").filter(has_text="4Culture").first.click()
        assert "競圖資料庫" in page.locator("#panel").inner_text(), "Reverse link target did not open competition"
        page.locator("#sheetClose").click()
        newest_day = max(e.get("updated", "") for e in records)
        newest_call = next(e for e in active if e.get("updated") == newest_day)
        page.locator("#q").fill(newest_call["classicTitle"])
        page.wait_for_timeout(1000)
        n=page.locator("#grid .card").count()
        assert n >= 1, "Today's new competition search failed"
        page.set_viewport_size({"width":390,"height":844})
        page.locator("#q").fill(records[0]["classicTitle"])
        page.wait_for_timeout(900)
        assert page.locator("#grid .card").count() >= 1, "Mobile latest art search failed"
        page.locator("#grid .card").first.click()
        page.locator("#sheet.open #panel").wait_for(timeout=12000)
        assert page.locator("#panel").inner_text(), "Mobile detail missing"
        REPORT["browser"]["mobileSearchAndDetail"] = "390px passed"
        REPORT["browser"]["todayArtSearch"] = 1
        REPORT["browser"]["todayCompetitionSearch"] = n
        REPORT["browser"]["crossDatabaseCity"] = "Seattle artwork → 4Culture competition: success"
        browser.close()

def check_artwork_map():
    from playwright.sync_api import sync_playwright
    import base64
    catalog = get("data/artwork-map.json", True)
    geo = get("data/artwork-locations.geojson", True)
    assert catalog["stats"]["locatedWorks"] >= 10, "Fewer than ten verified mapped works"
    assert len(geo["features"]) == catalog["stats"]["locations"], "Map location count mismatch"
    assert all(-90 <= f["geometry"]["coordinates"][1] <= 90 and -180 <= f["geometry"]["coordinates"][0] <= 180 and f["properties"]["coordinateSource"] for f in geo["features"]), "Invalid coordinates or missing source"
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True,args=["--no-sandbox"])
        page = browser.new_page(viewport={"width":1360,"height":900})
        # Test map UI without requesting/prefetching OSM tiles from a headless bot.
        pixel = base64.b64decode("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jG2kAAAAASUVORK5CYII=")
        page.route("https://tile.openstreetmap.org/**",lambda route: route.fulfill(status=200,content_type="image/png",body=pixel))
        errors=[]
        page.on("pageerror",lambda error: errors.append(str(error)))
        page.goto(BASE+"map/?work=raumfragen-animal-neighborhood-munich-2026",wait_until="domcontentloaded",timeout=70000)
        page.wait_for_function("()=>document.querySelector('#stats').textContent.includes('已定位')",timeout=30000)
        assert page.locator(".leaflet-marker-icon").count() >= 1, "Map markers missing"
        assert "Animal Neighborhood" in page.locator(".leaflet-popup-content").inner_text(), "Selected artwork popup missing"
        assert "OpenStreetMap" in page.locator(".leaflet-control-attribution").inner_text(), "Missing attribution"
        page.locator("#mapSearch").fill("Digital Calligraffiti")
        assert page.locator("#workList .work").count() == 1, "Map search failed"
        page.locator("#workList .work").click()
        assert "待核" in page.locator("#mapNotice").inner_text(), "Unlocated work was not marked pending"
        assert page.locator(".leaflet-marker-icon").count() == 0, "Unlocated work got a false marker"
        page.set_viewport_size({"width":390,"height":844})
        page.locator("#mapSearch").fill("Pool People")
        page.locator("#workList .work").click()
        assert "Pool People" in page.locator(".leaflet-popup-content").inner_text(), "Mobile marker popup failed"
        assert page.evaluate("document.documentElement.scrollWidth <= window.innerWidth + 1"), "Mobile map overflows horizontally"
        page.locator(".leaflet-popup-content a").filter(has_text="作品詳情").first.click()
        page.locator("#sheet.open #panel").wait_for(timeout=120000)
        assert "Pool People" in page.locator("#panel").inner_text(), "Map-to-archive deep link failed"
        assert not errors, errors
        REPORT["browser"]["artworkMap"]={"locatedWorks":catalog["stats"]["locatedWorks"],"locations":len(geo["features"]),"pendingWorks":catalog["stats"]["pendingWorks"],"desktopMobileDeepLink":"passed","tileRequests":"mocked; no automated tile downloads"}
        browser.close()

def main():
    try:
        entries=check_endpoints()
        check_photo_samples(entries)
        check_rendered_gallery()
        records, active = check_daily_art_and_competitions()
        check_daily_search_and_city_link(records, active)
        check_artwork_map()
    except Exception as e:
        FAILURES.append("Live endpoint: "+str(e))
    REPORT["failures"]=FAILURES
    print(json.dumps(REPORT,ensure_ascii=False,indent=2))
    return 1 if FAILURES else 0

if __name__=="__main__":
    sys.exit(main())
