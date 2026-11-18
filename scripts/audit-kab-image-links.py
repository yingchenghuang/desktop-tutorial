#!/usr/bin/env python3
"""Kunst am Bau image QA: validate external image links and research exact Commons candidates.
No media is downloaded or copied into the repository; never auto-assign a speculative image.
"""
from __future__ import annotations
import concurrent.futures as futures
import datetime, json, os, re, time, urllib.parse
from pathlib import Path
import requests
SOURCE=Path("data/kunst-am-bau-notion-mirror-20261118.json")
OUT=Path("review/kab-image-audit-20261118.json")
HEADERS={"User-Agent":"RAUM-PublicArt/1.1 (image source checking; https://yingchenghuang.github.io/desktop-tutorial/kunst-am-bau/)"}
entries=json.loads(SOURCE.read_text(encoding="utf-8"))["entries"]
def check(row):
    u=row.get("image") or ""
    if not u:return {"id":row["id"],"artist":row["artist"],"title":row["title"],"image":"","status":"missing","source":row.get("workUrl","")}
    try:
        r=requests.head(u,timeout=14,allow_redirects=True,headers=HEADERS)
        if r.status_code in (403,405,429,500,502,503,504) or "image" not in r.headers.get("content-type","").lower():
            r=requests.get(u,timeout=18,allow_redirects=True,headers={**HEADERS,"Range":"bytes=0-256"},stream=True)
        code=r.status_code
        ctype=r.headers.get("content-type","")
        ok=code in (200,206) and "image" in ctype.lower()
        r.close()
        return {"id":row["id"],"artist":row["artist"],"title":row["title"],"image":u,"status":"valid" if ok else "unavailable","http":code,"contentType":ctype[:75],"source":row.get("workUrl","")}
    except Exception as e:return {"id":row["id"],"artist":row["artist"],"title":row["title"],"image":u,"status":"network_error","reason":str(e)[:140],"source":row.get("workUrl","")}
def norm(s):
    import unicodedata
    return re.sub("[^a-z0-9]","",unicodedata.normalize("NFKD",str(s).lower()).replace("ß","ss"))
def commons_candidate(e):
    q=f'{e["artist"]} {e["title"] if "建築藝術專案" not in e["title"] else e["site"]} Kunst am Bau'
    try:
        params={"action":"query","generator":"search","gsrsearch":q,"gsrnamespace":6,"gsrlimit":6,
                "prop":"imageinfo","iiprop":"url|extmetadata","format":"json","formatversion":2}
        r=requests.get("https://commons.wikimedia.org/w/api.php",params=params,headers=HEADERS,timeout=16)
        r.raise_for_status();data=r.json()
        hits=[]
        for page in data.get("query",{}).get("pages",[]):
            title=page.get("title","").replace("File:","")
            info=(page.get("imageinfo") or [{}])[0]
            ext=info.get("extmetadata") or {}
            licenseName=re.sub("<[^>]+>","",ext.get("LicenseShortName",{}).get("value",""))
            licenses={"CC BY 4.0","CC BY-SA 4.0","CC BY 3.0","CC BY-SA 3.0","CC0","Public domain","CC BY-SA 2.0","CC BY 2.0"}
            term=norm(e["title"] if "建築藝術專案" not in e["title"] else e["site"])
            artist=norm(e["artist"].split(" und ")[0].split(" / ")[0])
            titleNorm=norm(title)
            exact=term and len(term)>6 and term in titleNorm
            artistHit=artist and artist in titleNorm
            if not (exact or (artistHit and ("ohnetitel" not in term and term[:11] in titleNorm))):continue
            u=info.get("url")
            if u and licenseName in licenses:
                hits.append({"title":page.get("title"),"sourcePage":"https://commons.wikimedia.org/wiki/"+urllib.parse.quote(page.get("title","").replace(" ","_")),"image":u,"license":licenseName,"confidence":"strong" if exact and artistHit else "candidate_check","copyrightNotice":"Check metadata, photo subject and attribution before use"})
        return {"id":e["id"],"artist":e["artist"],"title":e["title"],"search":q,"candidates":hits}
    except Exception as err:
        return {"id":e["id"],"artist":e["artist"],"title":e["title"],"search":q,"error":str(err)[:130],"candidates":[]}
def main():
    start=time.time()
    with futures.ThreadPoolExecutor(max_workers=12) as pool:checked=list(pool.map(check,entries))
    missing=[e for e in entries if not e.get("image")]
    print("IMAGE_CHECK",len(checked),"VALID",sum(x["status"]=="valid" for x in checked),"MISSING",len(missing),flush=True)
    with futures.ThreadPoolExecutor(max_workers=4) as pool:candidates=list(pool.map(commons_candidate,missing))
    report={"dateUTC":datetime.datetime.now(datetime.timezone.utc).isoformat(),"source":str(SOURCE),
      "total":len(entries),"byStatus":{key:sum(x["status"]==key for x in checked) for key in ["valid","unavailable","network_error","missing"]},
      "missingAndOtherStatuses":[x for x in checked if x["status"]!="valid"],
      "commonsCandidates":candidates,
      "commonsStrongCandidates":sum(len(z.get("candidates",[])) for z in candidates),
      "runtimeSec":round(time.time()-start,2),
      "warning":"Links not the same as usage permissions; individual artwork/photographer licensing must be checked before reuse."}
    OUT.parent.mkdir(parents=True,exist_ok=True);OUT.write_text(json.dumps(report,ensure_ascii=False,indent=2)+"\n",encoding="utf-8")
    print("DONE",json.dumps(report["byStatus"],ensure_ascii=False),"CANDIDATES",report["commonsStrongCandidates"],flush=True)
if __name__=="__main__":main()
