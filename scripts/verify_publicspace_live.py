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
            u = path if path.startswith("https://") else BASE + path
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

def main():
    try:
        entries=check_endpoints()
        check_photo_samples(entries)
        check_rendered_gallery()
    except Exception as e:
        FAILURES.append("Live endpoint: "+str(e))
    REPORT["failures"]=FAILURES
    print(json.dumps(REPORT,ensure_ascii=False,indent=2))
    return 1 if FAILURES else 0

if __name__=="__main__":
    sys.exit(main())
