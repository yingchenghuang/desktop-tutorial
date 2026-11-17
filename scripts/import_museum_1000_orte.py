#!/usr/bin/env python3
# coding: utf-8
"""Extract Museum der 1000 Orte works; keep full provenance, avoid unlicensed re-publication."""
from __future__ import annotations
from bs4 import BeautifulSoup
from concurrent.futures import ThreadPoolExecutor, as_completed
from urllib.parse import urljoin, urlsplit, unquote
from pathlib import Path
import requests, json, re, unicodedata, time, datetime, threading, os, random, html

BASE="https://www.museum-der-1000-orte.de"
LIST=BASE+"/kunstwerke"
DEST=Path("data/museum-1000-orte-catalog.json")
MANIFEST=Path("data/museum-1000-orte-manifest.json")
AUDIT=Path("review/museum-1000-orte-audit.json")
RULES=BASE+"/nutzungsbedingungen"
TODAY=datetime.datetime.now(datetime.timezone(datetime.timedelta(hours=8))).date().isoformat()
NOW=datetime.datetime.now(datetime.timezone.utc).isoformat()
AGENT="RAUM-PublicArtResearch/1.0 (+https://yingchenghuang.github.io/desktop-tutorial/); research-only metadata links"
HEAD={"User-Agent":AGENT,"Accept-Language":"de-DE,de;q=0.9,en;q=0.6"}
_tls=threading.local()
def sess():
    if not hasattr(_tls,"s"):
        _tls.s=requests.Session();_tls.s.headers.update(HEAD)
    return _tls.s
def fetch(url, attempts=3):
    for n in range(attempts):
        try:
            r=sess().get(url,timeout=25)
            if r.status_code==429:
                time.sleep(4*(n+1)); continue
            r.raise_for_status()
            return r.text
        except Exception as e:
            if n==attempts-1: print("FETCH_ERROR",url,str(e)[:130],flush=True)
            else: time.sleep(1.1*(n+1))
    return ""
def clean(t):
    return re.sub(r"\s+"," ",html.unescape(str(t or ""))).strip()
def norm(t):
    t=unicodedata.normalize("NFKD",str(t or "")).casefold().replace("ß","ss")
    return re.sub("[^a-z0-9]+","",t)
def link_of(u):
    if not u: return ""
    u=urljoin(BASE,u).split("?")[0].split("#")[0].rstrip("/")
    return u if re.match(r"^https://(?:www\.)?museum-der-1000-orte\.de/kunstwerke/kunstwerk/[^/]+$",u) else ""
def find_links(doc):
    return {u for a in doc.select("a[href]") if (u:=link_of(a.get("href")))}
def image_urls(doc):
    items=[];seen=set()
    # Artwork slider/gallery and official OG image, never download media.
    tags=list(doc.select('meta[property="og:image"],meta[name="twitter:image"]'))
    tags+=list(doc.select("img[src],img[data-src],a[href] img,source[srcset]"))
    for tag in tags:
        raw=tag.get("content") or tag.get("data-src") or tag.get("src") or (tag.get("srcset") or "").split(",")[0].strip().split(" ")[0]
        u=urljoin(BASE,raw or "")
        p=urlsplit(u)
        if p.netloc not in {"www.museum-der-1000-orte.de","museum-der-1000-orte.de"}: continue
        if not re.search(r"\.(?:jpg|jpeg|png|webp)(?:$|\?)",p.path,re.I):continue
        if any(x in p.path.lower() for x in ("logo","icon","favicon","placeholder","banner","avatar")):continue
        if u in seen:continue
        seen.add(u);items.append({"url":u,"caption":clean(tag.get("alt"))[:350],"credit":"","kind":"官方圖片引用（待授權，未複製）"})
        if len(items)>=18:break
    return items
def official_data(url):
    time.sleep(random.uniform(.1,.35))
    txt=fetch(url)
    if not txt:return {"url":url,"error":"http_fetch_failed"}
    soup=BeautifulSoup(txt,"html.parser")
    title=clean(soup.title.get_text(" ",strip=True) if soup.title else "")
    title=re.sub(r"\s+\|\s+Museum der 1000 Orte.*$","",title).strip()
    m=re.match(r"^(.*?):\s+(.+?),\s*((?:19|20)\d{2}(?:[/-](?:19|20)?\d{2})?)$",title)
    if m:
        artist,work,year=map(clean,m.groups())
    else:
        mm=re.match(r"^(.*?):\s+(.+)$",title)
        artist,work=(mm.group(1),mm.group(2)) if mm else ("",title)
        year=""
    body=soup.select_one("main") or soup.select_one("article") or soup.body or soup
    paras=[]
    for p in body.select("p"):
        t=clean(p.get_text(" ",strip=True))
        if len(t)>90 and t not in paras:paras.append(t)
    if not paras:
        for b in body.select("div"):
            t=clean(b.get_text(" ",strip=True))
            if 110<len(t)<2400 and t not in paras:paras.append(t)
            if len(paras)>8:break
    headings=[clean(x.get_text(" ",strip=True)) for x in body.select("h1,h2,h3,h4")]
    # find categories/metadata in content, without duplicating the essay
    full=body.get_text("\n",strip=True)
    labels=("Bodenarbeit","Brunnen","Deckenarbeit","Digitaldruck","Fassadenarbeit","Fotoarbeit","Freiplastik","Glasarbeit","Installation","Lichtinstallation","Malerei","Mosaik","Platzgestaltung","Raumarbeit","Relief","Soundarbeit","Tafelbild","Textilarbeit","Videoarbeit","Wandarbeit","kinetische Arbeit","Toranlage","Teppich","Pavillon")
    category=next((x for x in labels if re.search(r"(?mi)^\s*"+re.escape(x)+r"\s*$",full)),"")
    city=""
    for h in headings:
        for c in ("Berlin","Bonn","Nürnberg","München","Erfurt","Frankfurt am Main","Hamburg","Leipzig","Dresden","Braunschweig","Ulm","Brasilia","Helsinki","Wiesbaden","Dakar","Tokyo","Budapest","Mexico","Kairo","Bremen","Aachen","Potsdam","Greifswald","Hilpoltstein"):
            if re.search(r"\b"+re.escape(c)+r"\b",h,re.I):city=c;break
        if city:break
    images=image_urls(soup)
    credit=""
    for tag in soup.select("img[alt]"):
        z=clean(tag.get("alt"))
        if "Fotonachweis" in z:
            credit=z[:400];break
    og=soup.find("meta",attrs={"name":"description"})
    description=clean(og.get("content")) if og else ""
    if not description:description=paras[0] if paras else ""
    # Preserve a narrow German research excerpt, not copyrighted full essays.
    excerpt=clean(paras[0])[:200] if paras else description[:200]
    artist_page=""
    for a in soup.select("a[href]"):
        h=a.get("href","")
        if artist and artist.lower() in clean(a.get_text(" ",strip=True)).lower() and re.search(r"/kuenstler",h,re.I):
            artist_page=urljoin(BASE,h);break
    # Visitor access is extracted only from official visible wording, else unknown.
    access=""
    for term in ("nicht öffentlich zugänglich/einsehbar","öffentlich zugänglich/einsehbar","während der Öffnungszeiten zugänglich"):
        if term in full:
            access=term;break
    return {"url":url,"artist":artist,"work":work,"year":year,"title":title,"location":city,"category":category,
            "descriptionExcerpt":excerpt,"descriptionMeta":description[:300],"imageCredit":credit,
            "imageSources":images,"artistPage":artist_page,"headings":headings[:12],"access":access,
            "textIndicators":full[:480],"descriptionParagraphCount":len(paras)}
def existing_index():
    urls={};namekeys={}
    files=[Path("data/artists.json")]+list(Path("data").glob("backfill-*.json"))+list(Path("data").glob("*special*.json"))
    for p in files:
        if p==DEST or not p.exists():continue
        try:
            obj=json.loads(p.read_text(encoding="utf-8"))
        except:continue
        for item in obj.get("entries",[]) if isinstance(obj,dict) else []:
            if not isinstance(item,dict):continue
            ref={"id":item.get("id",""),"dedupeKey":item.get("dedupeKey",""),"file":str(p),"name":item.get("name","")}
            for field in ("website","workPage","artistStatementSource"):
                u=link_of(item.get(field,""))
                if u:urls.setdefault(u,ref)
            a=item.get("artist","")
            w=item.get("works","")
            if not a and "｜" in item.get("name",""):
                a=item["name"].split("｜")[0]
            if w:w=w.split("｜")[0]
            elif "｜" in item.get("name",""):w=item["name"].split("｜")[1].split("（")[0]
            if a and w:namekeys.setdefault(norm(a)+"_"+norm(w),ref)
    return urls,namekeys
def make_entry(s):
    u=s["url"];slug=u.rsplit("/",1)[-1];artist=s.get("artist","");title=s.get("work","")
    city=s.get("location","")
    med=s.get("category","") or "建築藝術"
    # Conservative classification; traditional figurative monuments are screened later.
    if re.search(r"wand|mosaik|relief",med,re.I):media=["壁畫/街頭","建築/場域"]
    elif re.search(r"licht|video|foto",med,re.I):media=["光/影像/投影","裝置"]
    elif re.search(r"brunnen|wasser",med,re.I):media=["聲音/霧/水","建築/場域"]
    elif re.search(r"skulptur|plastik",med,re.I):media=["雕塑","建築/場域"]
    else:media=["裝置","建築/場域"]
    # Distinguish official history from editorial commentary rather than inventing an artist statement.
    comment=("德國聯邦建築藝術典藏「Museum der 1000 Orte」收錄作品。"
             +("創作者："+artist+"；" if artist else "")
             +("作品：《"+title+"》；" if title else "")
             +"官方標示年代："+s.get("year","未載")+"；"
             +("城市："+city+"；" if city else "")
             +"媒材類型："+med+"。詳細創作脈絡及建築背景請參照此件作品的官方獨立介紹頁。")
    image_sources=s.get("imageSources",[])
    warning="照片與圖文著作權歸權利人所有，官方條款要求事前書面授權；本檔保留原始攝影連結與署名，不下載或公開重製。"
    return {"id":"museum-1000-orte-"+slug,"dedupeKey":"art:museum1000:"+slug,"name":artist+"｜"+title+"（"+s.get("year","未載")+"）",
            "artist":artist,"category":"作品/展覽","tier":"經典檔案庫","region":"西方",
            "country":"德國"+(" / "+city if city else ""),"cityKeywords":[city] if city else [],
            "media":media,"works":title+"｜"+s.get("year","未載"),"comment":comment,
            "classicTitle":title+"｜"+s.get("year","未載"),"classicDesc":comment,
            "artistStatement":"","artistStatementSource":u,"website":u,"workPage":u,
            "photo":"","classicImage":"","images":[],"imageSources":image_sources,
            "imageCredit":s.get("imageCredit",""),"imageRights":warning,
            "imageStatus":"來源已保留，未取得公開展示或重製授權","status":"官方來源",
            "updated":TODAY,"researchGroup":"museum1000orteSpecial","collectionSeries":"Museum der 1000 Orte",
            "originalDate":s.get("year",""),"mediumOriginal":med,"accessNote":s.get("access","未查證"),
            "researchOriginalGermanExcerpt":s.get("descriptionExcerpt",""),
            "reviewStatus":"官方作品頁已抓取；授權與進一步中文藝術評論待審核",
            "relatedByCity":[],"sourceCheckedDate":TODAY}
def main():
    print("START",NOW,LIST,flush=True)
    txt=fetch(LIST)
    if not txt:raise RuntimeError("Cannot fetch index; no data replaced")
    soup=BeautifulSoup(txt,"html.parser")
    text=soup.get_text(" ",strip=True)
    found=re.search(r"(\d{2,4})\s+Kunstwerke",text)
    expected=int(found.group(1)) if found else None
    page1=find_links(soup)
    print("INDEX",expected,"PAGE1",len(page1),flush=True)
    if len(page1)<3:raise RuntimeError("Missing listing link selectors; no writes")
    pages=max(1,(expected+5)//6) if expected else 58
    pages=min(pages+2,75)
    urls=set(page1);fail_pages=[]
    for n in range(2,pages+1):
        t=fetch(LIST+"/"+str(n))
        if not t:
            fail_pages.append(n);continue
        us=find_links(BeautifulSoup(t,"html.parser"))
        if not us and n<pages-2:fail_pages.append(n)
        urls.update(us)
        if n%10==0:print("PAGE",n,"URLS",len(urls),flush=True)
        time.sleep(.22)
    if expected and len(urls)<expected*.85:
        raise RuntimeError("Only "+str(len(urls))+" of "+str(expected)+" indexed; no destructive update")
    print("DISCOVERED",len(urls),flush=True)
    records=[];errors=[]
    with ThreadPoolExecutor(max_workers=3) as pool:
        futures={pool.submit(official_data,u):u for u in sorted(urls)}
        for fut in as_completed(futures):
            try:
                r=fut.result()
                if r.get("error") or not r.get("artist") or not r.get("work"):errors.append(r)
                else:records.append(r)
            except Exception as ex:errors.append({"url":futures[fut],"error":str(ex)[:150]})
            if (len(records)+len(errors))%50==0:print("DETAIL",len(records)+len(errors),"OK",len(records),flush=True)
    records.sort(key=lambda x:(norm(x["artist"]),norm(x["work"]),x["url"]))
    if len(records)<len(urls)*.84:raise RuntimeError("Too many detail failures: "+str(len(errors)))
    u0,n0=existing_index()
    prior=None
    if DEST.exists():
        try:prior=json.loads(DEST.read_text(encoding="utf-8"))
        except:pass
    existing_urls={e.get("website") for e in prior.get("entries",[])} if prior else set()
    new=[];cross=[];duplicate_new=set()
    for artwork in records:
        key=norm(artwork["artist"])+"_"+norm(artwork["work"])
        match=u0.get(artwork["url"]) or n0.get(key)
        if match:
            cross.append({"officialUrl":artwork["url"],"artist":artwork["artist"],"work":artwork["work"],
                "year":artwork["year"],"location":artwork.get("location",""),
                "imageCredit":artwork.get("imageCredit",""),
                "imageSources":artwork.get("imageSources",[])[:5],
                "officialDescriptionExcerpt":artwork.get("descriptionExcerpt","")[:150],
                "reason":"exact official URL" if artwork["url"] in u0 else "artist and work title",
                "existingRecordId":match.get("id"),"existingDedupeKey":match.get("dedupeKey"),
                "existingDataFile":match.get("file")})
            continue
        if artwork["url"] in duplicate_new:continue
        duplicate_new.add(artwork["url"])
        new.append(make_entry(artwork))
    for e in new:
        e["relatedByCity"]=[x["id"] for x in new if x["id"]!=e["id"] and e["cityKeywords"] and x["cityKeywords"]==e["cityKeywords"]][:18]
    if prior:
        already={e["dedupeKey"] for e in new}
        for e in prior.get("entries",[]):
            if e.get("dedupeKey") not in already and e.get("website") not in u0:
                new.append(e)
    images=sum(bool(x.get("imageSources")) for x in new)
    payload={"meta":{"generatedAt":NOW,"source":LIST,"sourceLegal":RULES,
      "sourceReportedCount":expected,"foundOfficialLinks":len(urls),"detailRecords":len(records),
      "newUniqueArtworkEntries":len(new),"crossReferences":len(cross),
      "worksWithImageSourceLinks":images,"imagesRepublished":0,
      "scope":"Official museum records, excluding duplicates against existing published entries",
      "note":"Independent works have detailed original page URLs and image source references. No copyrighted images have been copied; translations and media rights remain to be reviewed.",
      "status":"source-indexed, license-review-pending"},"entries":new,"crossReferences":cross,
      "sourceRecords":[{"artist":r["artist"],"title":r["work"],"year":r["year"],"city":r.get("location",""),
        "officialUrl":r["url"],"artistPage":r.get("artistPage",""),"technique":r.get("category",""),
        "imageSources":r.get("imageSources",[])[:7],"imageCredit":r.get("imageCredit",""),
        "accessNote":r.get("access",""),"sourceExcerpt":r.get("descriptionExcerpt","")[:120]} for r in records]}
    if len(records)!=(len(new)+len(cross)):
        raise RuntimeError("Total official records not accounted for")
    if not new and not prior:raise RuntimeError("No unique new records; review required")
    DEST.parent.mkdir(exist_ok=True);AUDIT.parent.mkdir(exist_ok=True)
    DEST.write_text(json.dumps(payload,ensure_ascii=False,indent=2)+"\n",encoding="utf-8")
    MANIFEST.write_text(json.dumps({"version":TODAY+"-source-research","generatedAt":NOW,
       "files":[DEST.name],"expectedEntries":len(new),"imageSourceEntries":images,
       "imagesRepublished":0,"duplicatesLinked":len(cross),
       "sourceUrl":LIST,"rights":RULES,"reviewStatus":"著作權與研究查核中"},ensure_ascii=False,indent=2)+"\n",encoding="utf-8")
    AUDIT.write_text(json.dumps({"sourceReportedCount":expected,"sourceLinksFound":len(urls),"parsed":len(records),
      "failedPages":fail_pages,"failedDetails":errors,"duplicates":cross,"existingUrlMatchCount":sum(x["reason"]=="exact official URL" for x in cross),"existingNameMatchCount":sum(x["reason"]=="artist and work title" for x in cross),
      "imageExamples":[{"title":x["name"],"images":x["imageSources"][:1]} for x in new if x.get("imageSources")][:10]},ensure_ascii=False,indent=2)+"\n",encoding="utf-8")
    print("RESULT",json.dumps(payload["meta"],ensure_ascii=False),flush=True)
if __name__=="__main__":main()
