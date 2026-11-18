#!/usr/bin/env python3
"""Validate November 18, 2026's five public GitHub Pages endpoints and data integrity."""
import json
import time
import sys
import datetime
from urllib.request import Request, urlopen

ROOT="https://yingchenghuang.github.io/desktop-tutorial/"
OUT={"asof":datetime.datetime.now(datetime.timezone.utc).isoformat(), "base":ROOT, "endpoints":{}, "checks":{}, "errors":[]}
SOURCES={
  "homepage":("",False),
  "public_art_day":("data/backfill-november-20261118.json",True),
  "public_art_manifest":("data/backfill-november-manifest.json",True),
  "competitions":("data/competitions.json",True),
  "competition_manifest":("data/competition-manifest.json",True)
}
def fetch(path, is_json):
    error=None
    for i in range(6):
        try:
            with urlopen(Request(ROOT+path,headers={"User-Agent":"Mozilla/5.0 PublicArtDatabaseQA/1.0","Cache-Control":"no-cache"}),timeout=35) as res:
                raw=res.read()
                if res.status!=200:
                    raise RuntimeError("HTTP "+str(res.status))
                return (json.loads(raw.decode("utf-8")) if is_json else raw.decode("utf-8")),len(raw)
        except Exception as exc:
            error=repr(exc)
            print("RETRY",path,i,error,flush=True)
            time.sleep(2+i)
    raise RuntimeError(path+" "+error)

def verify():
    result={}
    for key,(path,is_json) in SOURCES.items():
        result[key],length=fetch(path,is_json)
        OUT["endpoints"][key]={"path":"/"+path,"http":200,"bytes":length}
    # Inspect all November chunks because one broken file can disable the all-or-nothing backfill loader.
    missing=[]
    for f in result["public_art_manifest"].get("files",[]):
        try:
            payload,_=fetch("data/"+f,True)
            if "entries" not in payload:
                missing.append({"file":f,"failure":"no entries property"})
        except Exception as exc:
            missing.append({"file":f,"failure":str(exc)})
    OUT["checks"]["novemberFilesTested"]=len(result["public_art_manifest"].get("files",[]))
    OUT["checks"]["novemberFilesBroken"]=missing
    if missing:
        OUT["errors"].append("Broken November chunks: "+str(missing[:8]))
    day=result["public_art_day"]
    entries=day["entries"]
    group_counts={key:sum(e.get("researchGroup")==key for e in entries) for key in ["current","globalClassic","germanClassic"]}
    art_keys=[e["dedupeKey"] for e in entries]
    assert len(entries)==20 and group_counts=={"current":10,"globalClassic":5,"germanClassic":5},group_counts
    assert len(set(art_keys))==20
    assert all(e.get("photo") and e.get("workPage") and e.get("cityKeywords") and e.get("material") and e.get("comment") for e in entries)
    man=result["public_art_manifest"]
    assert "backfill-november-20261118.json" in man["files"]
    assert man["version"].startswith("20261118")
    assert man["expectedEntries"]>=548
    comps=result["competitions"]["entries"]
    comp_keys=[e["dedupeKey"] for e in comps]
    assert len(comps)==125 and len(set(comp_keys))==len(comps)
    assert not (set(art_keys)&set(comp_keys))
    cutoff=datetime.datetime.now(datetime.timezone.utc).timestamp()
    deadlines=[]
    for e in comps:
        d=datetime.datetime.fromisoformat(e["deadline"])
        assert d.tzinfo is not None, e["dedupeKey"]
        assert d.timestamp()>cutoff,e["dedupeKey"]
        assert e["deadlineTimezone"] and e["cityKeywords"] and e["website"]
        deadlines.append(d)
    new_comp=[e for e in comps if e.get("collectionDate")=="2026-11-18" and e.get("category")=="公開徵件"]
    assert len(new_comp)==5
    cm=result["competition_manifest"]
    assert cm["activeEntries"]==125 and cm["addedToday"]==5
    html=result["homepage"]
    assert "20261118-reviewed-r139" in html and "20261118" in man["version"]
    OUT["checks"].update({
       "dayEntries":len(entries),"distribution":group_counts,"dedupeKeyDuplicates":0,
       "photoFieldsPresent":20,"cityFieldsPresent":20,
       "newCompetitions":len(new_comp),"competitionsActive":len(comps),"competitionsExpired":0,
       "deadlineTimezoneParseable":len(deadlines),
       "monthManifestVersion":man["version"],"competitionManifestVersion":cm["version"],
       "siteCacheKey":"20261118-reviewed-r139",
       "originalPhotosIndividuallyVerified":False,
       "sourceSubstanceIndividuallyVerified":False
    })

def verify_browser_search():
    from playwright.sync_api import sync_playwright
    report=[]
    with sync_playwright() as p:
        browser=p.chromium.launch(headless=True,args=["--no-sandbox"])
        page=browser.new_page(viewport={"width":1350,"height":900})
        page.goto(ROOT,wait_until="domcontentloaded",timeout=85000)
        page.wait_for_function("() => document.querySelector('#resultCount') && !/載入中|載入失敗/.test(document.querySelector('#resultCount').textContent)",timeout=120000)
        diagnostics=page.evaluate("""async () => {
          const r=await fetch('data/artists.json?t='+Date.now());
          const j=await r.json();
          return {meta:j.meta, total:j.entries?.length,
            nov18:j.entries?.filter(x=>x.id?.startsWith('public-art-2026-11-18')).length,
            kaleido:j.entries?.filter(x=>x.name?.includes('Kaleidoburst')).length,
            reallygood:j.entries?.filter(x=>x.name?.includes('Really Good')).length,
            shown:document.querySelector('#resultCount')?.textContent};
        }""")
        OUT["checks"]["browserLoadedArchive"]=diagnostics
        for term,expected in [
          ("Kaleidoburst","Scott Keva James"),
          ("Really Good","David Shrigley"),
          ("City Hall Plaza Exterior Wall Sculpture Acquisition","Gainesville")
        ]:
            page.locator("#q").fill(term)
            page.wait_for_timeout(1700)
            cards=page.locator("#grid .card")
            n=cards.count()
            names=[c.inner_text()[:180] for c in cards.all()[:3]]
            item={"query":term,"cardCount":n,"firstCards":names}
            if n < 1 or not any(expected.lower() in value.lower() for value in names):
                OUT["errors"].append("Missing visible search results for "+term)
            report.append(item)
        browser.close()
    OUT["checks"]["browserSearch"]=report

if __name__=="__main__":
    try:
        verify()
        verify_browser_search()
    except Exception as exc:
        OUT["errors"].append(repr(exc))
    print(json.dumps(OUT,ensure_ascii=False,indent=2),flush=True)
    sys.exit(0 if not OUT["errors"] else 1)
