#!/usr/bin/env python3
import json
from pathlib import Path
from datetime import datetime

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "data"
REVIEW = ROOT / "review"
DATE = "2026-11-22"
STAMP = "2026-11-26T05:00:00+08:00"
VERSION = "20261122-daily-photos-r152"
BASE = "https://yingchenghuang.github.io/desktop-tutorial/assets/images/daily-20261122"

def dump(path, payload):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

def art(i, title, artist, city, local_city, country, group, year, material, comment, source, image, credit, access="依場域公告參訪；歷史原作年份與本次入庫日期分開記錄。"):
    ident = f"public-art-2026-11-22-{i:02d}"
    cached = f"assets/images/daily-20261122/{ident}.jpg"
    label = {"current":"動態情報層", "globalClassic":"全球經典", "germanClassic":"德語文化脈絡經典"}[group]
    return {
        "name": f"{i:02d}｜{artist}｜{title}", "category":"作品/展覽", "tier":label,
        "region":"西方", "country":country, "cityKeywords":[city, local_city],
        "media":[material], "works":f"{title}｜{year}", "comment":comment,
        "website":source, "workPage":source, "photo":f"{BASE}/{ident}.jpg", "classicImage":f"{BASE}/{ident}.jpg",
        "classicTitle":f"{title}｜{year}", "classicDesc":f"{comment} {access}", "artistStatement":comment,
        "artistStatementSource":source, "status":"官方來源", "updated":DATE, "collectionDate":DATE,
        "researchGroup":group, "material":material, "originalDate":year, "accessNote":access,
        "imageSourceUrl":source, "imageOriginalUrl":image, "imageCredit":credit,
        "imageRights":"原來源保留著作權；未查得開放再利用授權，不宣稱已取得再授權。本站提供等比例JPEG研究預覽，原圖與完整圖說見來源。",
        "imageDisplayPolicy":"display", "imageVerification":"2026-11-26已下載、解碼並轉存等比例JPEG；待部署後瀏覽器naturalWidth回讀",
        "statementType":"第一方資料繁體中文整理，非逐字引言", "sourceCheckedDate":DATE, "reviewedAt":DATE,
        "relatedByCity":[], "workSite":access, "siteTypes":["public-space"], "id":ident,
        "dedupeKey":f"art:daily-20261122:{artist.lower().replace(' ','-')}:{title.lower().replace(' ','-')}",
        "imageCachedPath":cached, "imageFallbacks":[image], "imageCaption":"作品實景照片；等比例JPEG研究預覽，未另裁切",
        "imageProcessing":"等比例縮至最長邊1100px，JPEG壓縮；未另裁切。"
    }

KORO = "https://koro.no/selected-artworks-from-the-government-quarter/"
arts = [
art(1,"Grass Root Square","Do Ho Suh","Oslo","奧斯陸","挪威 / Oslo","current","2012（2024遷設）","青銅、混凝土與活樹","約五萬個微型人物密集鋪展於橡樹周圍，將日常市民而非權力人物置於政府區公共空間中心；作品於2024年遷至新政府區。",KORO,"https://koro.no/content/uploads/2025/09/KORO.006222-05.jpg","KORO典藏影像；原頁未於此圖說列攝影者"),
art(2,"Nunatak Argent","Anna-Eva Bergman","Oslo","奧斯陸","挪威 / Oslo","current","1982（2026重新展示）","壓克力、銀箔、畫布","銀箔山形如冰川上突出的孤峰，以金屬反光建立深度；作品原於1987年購入政府辦公空間，2011年後保存，2026年在新政府區重新展示，保留1982原作年。","https://koro.no/kunstverk/nunatak-argent/","https://koro.no/content/uploads/2025/01/Anna-Eva-Bergman_KORO.002015-scaled.jpg","攝影 Fredrik Qvale／KORO；另一官方紀錄署名 Torbjørn Kjosvold／Forsvaret"),
art(3,"The Birds Take off in Flocks","Synnøve Anker Aurdal","Oslo","奧斯陸","挪威 / Oslo","current","1985（新政府區重新展示）","織毯、羊毛與纖維","以鳥群起飛的節奏把抽象構成轉為建築內的空間事件；歷史作品在新政府區重新納入公共典藏脈絡，保留1985原作年。",KORO,"https://koro.no/content/uploads/2025/09/irma-kopi.jpg","KORO典藏影像；原頁未於此圖說列攝影者"),
art(4,"The Fishermen","Pablo Picasso／Carl Nesjar","Oslo","奧斯陸","挪威 / Oslo","current","1969（2024重裝）","噴砂混凝土浮雕","Picasso構圖由Carl Nesjar以噴砂混凝土完成；原嵌於Y-block，拆樓前連同牆體保存，2024年重裝於Einar Gerhardsens plass。",KORO,"https://koro.no/content/uploads/2026/11/KORO_2026_Web_Picasso_FiskerneFoto_Niklas_Hart_02.jpg","攝影 Niklas Hart／KORO"),
art(5,"The Seagull","Pablo Picasso／Carl Nesjar","Oslo","奧斯陸","挪威 / Oslo","current","1969（2024重裝）","噴砂混凝土浮雕","海鳥圖像由Picasso設計、Carl Nesjar執行，原作牆面於Y-block拆除前切割保存，2024年在新位置重新安裝。",KORO,"https://koro.no/content/uploads/2026/11/KORO2026_Web_Maaken_Foto_NiklasHart_01-scaled.jpg","攝影 Niklas Hart／KORO"),
art(6,"Light Disappears As Soon As We Close Our Eyes","Vanessa Baird","Oslo","奧斯陸","挪威 / Oslo","current","2012（2026遷設）","矽酸鹽顏料、纖維水泥板","將夢境般人物、動植物與不安的日常場景展開成建築尺度繪畫；原設於R6，2026年遷入A-block。",KORO,"https://koro.no/content/uploads/2026/05/KORO_2_1.jpg","KORO典藏影像；原頁未於此圖說列攝影者"),
art(7,"For A Long Time I Went Early To Bed","Vanessa Baird","Oslo","奧斯陸","挪威 / Oslo","current","2013（2026遷設）","矽酸鹽顏料、纖維水泥板","以密集敘事與身體、家庭及制度感受形成長幅畫面；原於R6展示，2026年與同系列作品在新政府區重聚。",KORO,"https://koro.no/content/uploads/2025/09/KORO.006591_sRGB-kopi.jpg","KORO典藏影像；原頁未於此圖說列攝影者"),
art(8,"To Everything There Is A Season","Vanessa Baird","Oslo","奧斯陸","挪威 / Oslo","current","2014（2026遷設）","矽酸鹽顏料、纖維水泥板","延續Baird對照護、生命循環與官僚空間的尖銳敘事；作品曾在文化機構展示，2026年移入A-block。",KORO,"https://koro.no/content/uploads/2019/05/kunstverk-012uMXWV15QE.jpg","KORO典藏影像；原頁未於此圖說列攝影者"),
art(9,"Wo Die Wilden Tiere Wohnen","Stef Heidhues","Berlin","柏林","德國 / Berlin","current","2025","鋁鑄造、城市家具組合","四件近實尺寸鋁鑄野生動物與路牌、電箱、垃圾桶及室內構件融合，讓校園使用者重新察覺城市擴張與動物棲地的關係。","https://www.kunst-im-stadtraum.berlin/de/post/grundschule-adalbertstrasse","https://cms.kunst-im-stadtraum.berlin/app/uploads/2026/05/HH70890-scaled.jpg","攝影 Kultur Mitte／Holger Herschel，2025"),
art(10,"Für Galina und uns","Stephanie Imbeau","Berlin","柏林","德國 / Berlin","current","2025","Corten鋼、拋光不鏽鋼","兩片無法重新合攏的巨型破碗在草地相向，既是可坐可停留的空間，也是對遭納粹處決的Galina Romanowa及破碎生命的公共記憶。","https://www.berlin.de/ba-charlottenburg-wilmersdorf/verwaltung/aemter/strassen-und-gruenflaechen/oeffentlicher-raum/artikel.1623221.php","https://www.berlin.de/ba-charlottenburg-wilmersdorf/verwaltung/aemter/strassen-und-gruenflaechen/oeffentlicher-raum/2025-10-16-kunst-am-bau-galina-und-uns-bacw_von-kentzinsky-_34_.jpeg","攝影 BACW／von Kentzinsky；柏林市政府"),
art(11,"We Are Living on a Star","Hannah Ryggen","Oslo","奧斯陸","挪威 / Oslo","globalClassic","1958","羊毛、亞麻織毯","以愛與宇宙作為政治、社會批判的核心；2011年恐攻造成的撕裂在修復後仍可見，使作品同時承載創作與歷史創傷。",KORO,"https://koro.no/content/uploads/2025/11/Hannah_Ryggen_Vi_lever_pa_en_stjerne_Foto_Thor_Nielsen-1.jpeg","攝影 Thor Nielsen；KORO"),
art(12,"Trojan Horse / Picasso Tapestry","Hannah Ryggen","Oslo","奧斯陸","挪威 / Oslo","globalClassic","1949／1956","羊毛、亞麻織毯","兩件織毯被藝術家併為一體，透過神話、戰爭與Picasso形象向政府決策空間提出持續的歷史警醒。",KORO,"https://koro.no/content/uploads/2026/04/Hannah-Ryggen-Trjanks-hest-Picassoteppet.-foto-SMK.jpg","攝影 SMK；KORO"),
art(13,"Year 3","Steve McQueen／Artangel","London","倫敦","英國 / London","globalClassic","2018–2021","攝影、城市廣告看板與公共展示","以倫敦小學三年級班級合照建立一幅城市世代肖像，透過看板、車站與展覽空間把教育、可見性與共同未來帶入公共領域。","https://www.artangel.org.uk/project/year-3/","https://media.artangel.org.uk/images/2018y3_camden_lead.width-1200.jpg","Artangel／Year 3計畫影像；完整攝影署名見原頁"),
art(14,"A Room for London","Fiona Banner／David Kohn Architects／Artangel","London","倫敦","英國 / London","globalClassic","2012","木造船形建築、聲音與駐地計畫","擱置在Southbank屋頂上的船形房間既是可居住雕塑，也是藝術家駐地與城市觀察器，將建築、文學與泰晤士河景觀疊合。","https://www.artangel.org.uk/project/a-room-for-london/","https://media.artangel.org.uk/images/2012arfl_01.width-1200.jpg","Artangel計畫影像；完整攝影署名見原頁"),
art(15,"The Ethics of Dust","Jorge Otero-Pailos／Artangel","London","倫敦","英國 / London","globalClassic","2016","乳膠、建築表面塵垢、背光場域裝置","長逾50公尺的半透明乳膠鑄片從西敏廳東牆揭取數百年的表面塵垢，再平行懸掛於歷史牆面，使清潔、保存與時間痕跡成為公共空間中的可見材料。","https://www.artangel.org.uk/project/the-ethics-of-dust/","https://media.artangel.org.uk/images/2016teod_08.width-1200.jpg","攝影 Marcus J Leith；Artangel"),
art(16,"Memoria Urbana Berlin","Juan Garaizabal","Berlin","柏林","德國 / Berlin","germanClassic","2012（2013轉永久）","方形鋼管、LED燈","以30公尺高鋼管輪廓重建已消失的波希米亞伯利恆教堂體量，夜間由LED光線標示城市缺席；原為臨時裝置，2013年決議永久保留。","https://bildhauerei-in-berlin.de/bildwerk/memoria-urbana-berlin-9798/","https://bildhauerei-in-berlin.de/wp-content/uploads/MIT_171_1_Pauline_Ahrens_2020-scaled.jpg","攝影 Pauline Ahrens，2020，CC BY 4.0"),
art(17,"Waterfall","Tatiana Trouvé","Munich","München／慕尼黑","德國 / München","germanClassic","2013","青銅、混凝土、公共空間裝置","一張看似被水勢壓彎的青銅床墊伏在混凝土上，透過日常物件與噴泉場域的錯位，讓身體、休息與公共城市表面產生超現實張力。","https://www.publicartmuenchen.de/projekte/waterfall/","https://www.publicartmuenchen.de/wp-content/uploads/2024/06/Ch-Knoch_Waterfall-Brunnen6-901x601.jpg","攝影 Ch. Knoch；Public Art München"),
art(18,"Berlin Junction","Richard Serra","Berlin","柏林","德國 / Berlin","germanClassic","1987（1988現址）","COR-TEN鋼板","兩片微傾的弧形耐候鋼形成可穿越的峽谷；觀者的身體、速度與不安感成為作品尺度的一部分，1988年依藝術家意見設於愛樂廳旁。","https://bildhauerei-in-berlin.de/bildwerk/berlin-junction-6427/","https://bildhauerei-in-berlin.de/wp-content/uploads/TIE_088_Serra_Berlin-Junction_NVoesgen_20200901_02_min.jpg","攝影 Nicola Vösgen，2020，CC BY 4.0"),
art(19,"Houseball","Claes Oldenburg／Coosje van Bruggen","Berlin","柏林","德國 / Berlin","germanClassic","1995–1997","纖維強化塑膠、黃麻、不鏽鋼、泡棉與塗料","把家中財物捆成可滾動的巨球，將遷徙、流離與家作為隨身容器的概念轉為大型公共雕塑；1997年設於Bethlehemkirchplatz。","https://bildhauerei-in-berlin.de/bildwerk/houseball-5076/","https://bildhauerei-in-berlin.de/wp-content/uploads/MIT_163_1_Pauline_Ahrens_2020-scaled.jpg","攝影 Pauline Ahrens，2020，CC BY 4.0"),
art(20,"Lichtblick","Helge Warme","Berlin","柏林","德國 / Berlin","germanClassic","1993／1997設置","石、混凝土與彩繪","兩塊覆水泥層的巨石形成面向日出的門洞，東西兩面以不同色彩、符號與抽象形體繪製，將道路中央綠帶轉成城市中的光線框景。","https://bildhauerei-in-berlin.de/bildwerk/lichtblick-7136/","https://bildhauerei-in-berlin.de/wp-content/uploads/0df0a95a-f780-4868-b24f-ff124923e343-scaled.jpg","攝影 Susanne Kähler，2010，CC BY 4.0"),
]

def competition(i, title, city, local, country, source, image, credit, comment, deadline, tz, precision, organizer, eligibility, budget, fee, caption):
    ident=f"competition-2026-11-22-{i:02d}"; cached=f"assets/images/daily-20261122/{ident}.jpg"
    return {"name":f"{i:02d}｜{organizer}｜{title}","category":"公開徵件","tier":"競圖資料庫","region":"西方","country":country,
      "cityKeywords":[city,local],"media":["公共藝術公開徵件"],"works":f"{title}｜未定","comment":comment,"website":source,"workPage":source,
      "photo":f"{BASE}/{ident}.jpg","classicImage":f"{BASE}/{ident}.jpg","classicTitle":f"{title}｜未定","classicDesc":comment,
      "artistStatement":comment,"artistStatementSource":source,"status":"官方來源","updated":DATE,"collectionDate":DATE,"material":"依正式簡章與最終設計",
      "accessNote":"申請以官方簡章、附件及後續更正為準。","imageSourceUrl":source,"imageOriginalUrl":image,"imageCredit":credit,
      "imageRights":"原來源保留著作權；未查得開放再利用授權。本站為研究索引提供等比例JPEG預覽。","imageDisplayPolicy":"display",
      "imageVerification":"2026-11-26已下載、解碼並轉存等比例JPEG；待部署後瀏覽器naturalWidth回讀","statementType":"第一方資料繁體中文整理，非逐字引言","sourceCheckedDate":DATE,"reviewedAt":DATE,
      "relatedByCity":[],"id":ident,"dedupeKey":f"opportunity:{title.lower().replace(' ','-')}","deadline":deadline,"deadlineTimezone":tz,
      "deadlinePrecision":precision,"deadlineLabel":deadline,"organizer":organizer,"eligibility":eligibility,"budget":budget,"applicationFee":fee,
      "opportunityType":"公共藝術委託公開徵件","imageCaption":caption,"imageCachedPath":cached,"imageFallbacks":[image],"imageProcessing":"等比例縮至最長邊1100px，JPEG壓縮；未另裁切。"}

comps=[
competition(1,"Solstice Canyon Restroom Mural Project","Malibu","馬里布／Solstice Canyon","美國 / Malibu, California","https://www.nps.gov/samo/planyourvisit/solstice-canyon-restroom-mural-project.htm","https://www.nps.gov/samo/planyourvisit/images/SOLST-CYN-MURAL-RESTROOM-HEADER-IMG.jpg","U.S. National Park Service官方場址照片；Solstice Canyon洗手間現況，非完成壁畫","在Solstice Canyon四座洗手間內牆各完成一件壁畫，以山脈地景、生態、野生動物與地方材料為靈感，並藉藝術減少塗鴉、改善遊客體驗。","2026-12-31T23:59:59-08:00","America/Los_Angeles","date","Santa Monica Mountains National Recreation Area／Western National Parks／SAMO Fund","徵求在地藝術家、青年或新銳藝術家，以及具壁畫或戶外公共藝術經驗者；須能於2027年2月連續3至5日現場作畫並自行到場。","每位入選藝術家US$750；顏料與必要材料由園方及合作單位另行提供","未公開","NPS官方Solstice Canyon洗手間場址現況，非完成藝術品"),
competition(2,"Light and Water Works District Plaza Screening Wall","Georgetown","喬治城","美國 / Georgetown, Texas","https://artsgeorgetown.submittable.com/Submit","https://images.submittable.com/s3/publisher-files.submittable.com/14337/submit-header.png?width=982&height=220&mode=crop&anchor=middlecenter&v=1753893897&signature=09hnLHlG9mw29RldP3Svnqs83TyCMAYpvxB4Nw%2bBAk0%3d","City of Georgetown Arts & Culture官方申請平台頁首；非完成作品","為廣場公用設備設計兼具功能與藝術性的遮蔽牆，需考量鄰近永久雕塑的材料與色彩，並提交結構與安裝策略。","2026-12-31T23:59:59-06:00","America/Chicago","date","City of Georgetown Arts and Culture Board","18歲以上專業藝術家，地區不限。","US$50,000，含材料、設備、旅運、住宿與個人責任保險","無","官方申請平台頁首，非場址或完成藝術品"),
competition(3,"Parachute Veterinary Clinic Mural","Parachute","帕拉舒特","美國 / Parachute, Colorado","https://www.parachute.gov/article/3260174","https://core-docs.s3.amazonaws.com/town_of_parachute_ar/article/image/large_9da9c58c-8521-4174-89fe-cb24c677ca2c.jpeg","Town of Parachute官方徵件主圖；徵件視覺，非完成壁畫","於120 W. 1st Street獸醫診所外牆創作約12×30英尺壁畫，回應地方地景、歷史、戶外活動、河流與『洛磯山脈西部門戶』認同。","2027-01-20T12:00:00-07:00","America/Denver","minute","Parachute Renewal Partnership／Town of Parachute","具經驗的壁畫藝術家或藝術團隊；科羅拉多州及其他地區均可申請。","未公開","未公開","官方徵件主圖，屬計畫宣傳視覺，非完成壁畫"),
competition(4,"RNO New Gen A&B Concourses 2D Digital Restroom Artwork RFP #26/27-11","Reno","雷諾","美國 / Reno, Nevada","https://www.renoairport.com/doing-business/solicitation-opportunities/","https://www.renoairport.com/wp-content/uploads/2022/08/og-image.jpg","Reno-Tahoe International Airport官方網站影像；機場識別／場域圖，非本案完成作品","為New Gen A&B航廈洗手間徵求永久二維數位藝術；正式規格與申請須下載官方附件並留意後續addenda。","2027-01-14T23:59:00-08:00","America/Los_Angeles","minute","Reno-Tahoe Airport Authority","官方公開頁未列完整資格；以RFP #26/27-11附件與NGEM登錄要求為準。","未公開","未公開","官方機場網站場域／識別影像，非本案完成藝術品"),
competition(5,"RNO New Gen A&B Concourses Ceiling-Based Artwork RFQ #26/27-12","Reno","雷諾","美國 / Reno, Nevada","https://www.renoairport.com/doing-business/solicitation-opportunities/","https://www.renoairport.com/wp-content/uploads/2022/08/og-image.jpg","Reno-Tahoe International Airport官方網站影像；機場識別／場域圖，非本案完成作品","為New Gen A&B航廈徵求天花懸吊型永久公共藝術資格；須依官方RFQ與Addendum提交，不能以另一個洗手間案規格代填。","2027-01-14T23:59:00-08:00","America/Los_Angeles","minute","Reno-Tahoe Airport Authority","官方公開頁未列完整資格；以RFQ #26/27-12與Addendum 1、NGEM登錄要求為準。","未公開","未公開","官方機場網站場域／識別影像，非本案完成藝術品"),
]

def exhibition(i,title,artist,city,local,country,start,end,venue,source,official,image,credit,comment):
    ident=f"exhibition-gn-20261122-{i:02d}"; cached=f"assets/images/daily-20261122/{ident}.jpg"
    return {"name":f"{artist}｜{title}","category":"國際展覽","tier":"全球重要展覽","region":"西方","country":country,"cityKeywords":[city,local],
      "media":["當代藝術展覽"],"works":f"{title}｜{start} 至 {end}","comment":comment,"website":source,"workPage":source,
      "photo":f"{BASE}/{ident}.jpg","classicImage":f"{BASE}/{ident}.jpg","classicTitle":f"{title}｜2026","classicDesc":comment,
      "artistStatement":comment,"artistStatementSource":official or source,"status":"官方來源交叉核對" if official else "可信二手來源",
      "updated":DATE,"collectionDate":DATE,"material":"依展覽作品資料","originalDate":"2026","accessNote":"開放時間與入場條件以場館當日公告為準。",
      "imageSourceUrl":source,"imageOriginalUrl":image,"imageCredit":credit,"imageRights":"原來源保留著作權；未查得開放再利用授權。本站為研究索引提供等比例JPEG預覽。",
      "imageDisplayPolicy":"display","imageVerification":"2026-11-26已下載、解碼並轉存等比例JPEG；待部署後瀏覽器naturalWidth回讀","statementType":"展覽資料繁體中文整理，非逐字引言",
      "sourceCheckedDate":DATE,"reviewedAt":DATE,"relatedByCity":[],"id":ident,"dedupeKey":f"exhibition:galleriesnow:{title.lower().replace(' ','-')}",
      "sourceName":"GalleriesNow＋主辦官網" if official else "GalleriesNow／e-flux","startDate":start,"endDate":end,"exhibitionStatus":"展出中" if start<=DATE<=end else "即將開幕",
      "exhibitionType":"國際畫廊／藝術機構展覽","organizer":venue.split('，')[0],"venue":venue,"admission":"未公開；依場館公告","imageCaption":"展出作品或展場影像，非藝術家肖像",
      "researchSources":[{"label":"展覽索引／公告","url":source}]+([{"label":"主辦官網核對","url":official}] if official else []),"imageCachedPath":cached,"imageFallbacks":[image],"imageProcessing":"等比例縮至最長邊1100px，JPEG壓縮；未另裁切。"}

exhibitions=[
exhibition(1,"I Think. I Don’t. I Do","群展","Amsterdam","阿姆斯特丹","荷蘭 / Amsterdam","2026-11-21","2027-01-16","Woonhuis de Ateliers，Stadhouderskade 86, Amsterdam","https://www.e-flux.com/announcements/6788469/i-think-i-don-t-i-do/","https://woonhuisdeateliers.nl/","https://images-eflux.b-cdn.net/assets/9d7f3d07-86cc-4028-9baf-28d43136cbef.jpg","Woonhuis／e-flux展覽公告影像；完整作品署名見原頁","由De Ateliers二年級參與者策劃，從Sol LeWitt與Eva Hesse書信出發，把猶疑、失敗、摸索與共同工作視為展覽生成條件。"),
exhibition(2,"some ecstasies enthrall","John McAllister","Brussels","Bruxelles／布魯塞爾","比利時 / Brussels","2026-11-19","2026-12-19","Almine Rech，Abdijstraat 20 Rue de l’Abbaye, Brussels","https://www.galleriesnow.net/shows/john-mcallister-some-ecstasies-enthrall/","https://www.alminerech.com/exhibitions/","https://www.galleriesnow.net/wp-content/uploads/2026/11/Almine-Rech-Brussels-John-McAllister-header.webp","John McAllister展覽作品／展場影像；Courtesy Almine Rech；完整攝影署名見原頁","以高飽和色彩與框中框構圖把風景畫轉成感官入口，在野火煙霧、外來植物與人造景觀之間處理美感與氣候焦慮。"),
exhibition(3,"the sky beneath my skin","Janaina Tschäpe","London","倫敦","英國 / London","2026-11-24","2027-01-23","Galerie Max Hetzler，41 Dover Street, London","https://www.galleriesnow.net/exhibitions/london/","https://www.maxhetzler.com/exhibitions/janaina-tschape-sky-beneath-my-skin-2026","https://www.maxhetzler.com/application/files/cache/thumbnails/2767e7e0d77afab35cc226aaa460b919.jpg","Galerie Max Hetzler展覽影像；完整作品與攝影署名見原頁","新作大型繪畫、紙上Self Portrait系列與2000年錄像並置，從筆觸、身體與海景的互滲討論自我與自然之間不穩定的界線。"),
exhibition(4,"They Tried to Count Us","Andrius Arutiunian","London","倫敦","英國 / London","2026-11-24","2027-03-07","Hayward Gallery，Belvedere Road, London","https://www.galleriesnow.net/shows/andrius-arutiunian-they-tried-to-count-us/","https://www.southbankcentre.co.uk/venues/hayward-gallery/","https://www.galleriesnow.net/wp-content/uploads/2026/11/Hayward-Gallery_Andrius-Arutiunian.webp","Hayward Gallery展覽影像；完整作品與攝影署名見原頁","藝術家首場英國個展以聲音、雕塑與訊號系統追問人類如何計數、分類並想像死後世界與地球之外的存在。"),
exhibition(5,"The Big Cover-Up","Connie Brown","New York","紐約","美國 / New York","2026-11-24","2026-12-19","The Painting Center，547 West 27th Street, New York","https://www.galleriesnow.net/shows/connie-brown-the-big-cover-up/","https://www.thepaintingcenter.org/","https://www.galleriesnow.net/wp-content/uploads/2026/11/Connie-Brown-The-Painting-Center.webp","Connie Brown／The Painting Center展覽影像；完整攝影署名見原頁","以繪畫、音樂與記憶為線索，讓被覆蓋的過去在當下表面再次顯形，檢視私人敘事如何進入觀看與構圖。"),
]

dump(DATA/"backfill-november-20261122.json", {"meta":{"date":DATE,"generatedAt":STAMP,"total":20,"distribution":{"current":10,"globalClassic":5,"germanClassic":5},"note":"固定20件公共藝術，與5徵件及5展覽完全分流；原作年份與本次入庫日期分開，20件均指定真實作品影像來源。"},"entries":arts})
dump(DATA/"exhibitions-galleriesnow-20261122.json", {"meta":{"date":DATE,"generatedAt":STAMP,"total":5,"note":"5則獨立國際展覽；展期完整，GalleriesNow／e-flux索引優先交叉主辦官網，圖片為作品或展場影像。"},"entries":exhibitions})

comp_path=DATA/"competitions.json"
existing=json.loads(comp_path.read_text(encoding="utf-8"))
prior_removed_ids = existing.get("meta", {}).get("expiredRemovedIds", []) if existing.get("meta", {}).get("version") == VERSION else []
existing["entries"] = [row for row in existing["entries"] if not str(row.get("id", "")).startswith("competition-2026-11-22-")]
cutoff=datetime.fromisoformat(STAMP)
kept=[]; expired=[]
for row in existing["entries"]:
    try: is_expired=datetime.fromisoformat(row["deadline"]) < cutoff
    except Exception: is_expired=False
    (expired if is_expired else kept).append(row)
existing["entries"]=kept+comps
removed_ids=list(dict.fromkeys(prior_removed_ids+[x.get("id") for x in expired]))
existing["meta"].update({"activeEntries":len(existing["entries"]),"addedToday":5,"addedThisRun":5,"expiredRemoved":len(removed_ids),"expiredRemovedIds":removed_ids,"generatedAt":STAMP,"version":VERSION,"note":"11月22日新增5則未截止公共藝術徵件；保留全部仍有效舊案，只依含時區截止瞬間移除已逾期項目。兩個Reno案分開建檔，未把未公開預算或資格互相套用。"})
dump(comp_path, existing)

am=json.loads((DATA/"backfill-november-manifest.json").read_text(encoding="utf-8")); am["version"]=VERSION; am["generatedAt"]=STAMP
if "backfill-november-20261122.json" not in am["files"]:
    am["files"].append("backfill-november-20261122.json"); am["expectedEntries"] += 20; am["imageEntries"] += 20
if "11月22日固定新增20件" not in am["note"]: am["note"] += " 11月22日固定新增20件（10／5／5），逐件指定真實作品照片與出處；徵件與展覽未計入。"
dump(DATA/"backfill-november-manifest.json",am)
cm=json.loads((DATA/"competition-manifest.json").read_text(encoding="utf-8")); cm.update({"version":VERSION,"generatedAt":STAMP,"activeEntries":len(existing["entries"]),"addedToday":5,"addedThisRun":5,"expiredRemoved":len(removed_ids),"expiredRemovedIds":removed_ids,"counts":{"total":len(existing["entries"]),"active":len(existing["entries"])},"note":existing["meta"]["note"]}); dump(DATA/"competition-manifest.json",cm)
em=json.loads((DATA/"exhibition-manifest.json").read_text(encoding="utf-8")); already="exhibitions-galleriesnow-20261122.json" in em["files"]; em.update({"version":VERSION,"generatedAt":STAMP,"addedToday":5,"totalEntries":em["totalEntries"]+(0 if already else 5),"sourceCheckedDate":DATE,"note":"11月22日新增5則國際展覽，展期完整且使用作品／展場影像；既有展覽與待核線索保留。"})
if not already: em["files"].append("exhibitions-galleriesnow-20261122.json")
dump(DATA/"exhibition-manifest.json",em)

sources=[]
for row in arts+comps+exhibitions:
    sources.append({"id":row["id"],"url":row["imageOriginalUrl"],"sourceUrl":row["imageSourceUrl"],"credit":row["imageCredit"],"caption":row.get("imageCaption","")})
dump(REVIEW/"20261122-image-sources.json",{"date":DATE,"entries":sources})
dump(REVIEW/"20261122-source-scan.json",{"date":DATE,"fixedSources":{"readable":["KORO","Artangel","Public Art München","GalleriesNow"],"blocked":[],"pending":["Public Art Archive","Institute for Public Art","CODAworx","Americans for the Arts","Museum der 1000 Orte","bbk berlin","Public Art Agency Sweden","MAPS","Swiss Federal Office Kunst am Bau","Public Art Fund","Creative Time","Fourth Plinth London","Forecast Public Art","Art Platform Japan","Echigo-Tsumari","Seoul Public Art Archive","Toronto Public Art","Vancouver Public Art","Melbourne Open Data","文化部公共藝術","Land Art Flevoland","Raumfragen","Public Art Lab Berlin"],"note":"27個固定入口中本批完整讀取4站；其餘23站本次未逐站重讀，列待核，未宣稱已查核或無更新。"},"supportingSources":{"readable":["Kunst im Stadtraum Berlin","Berlin.de","Bildhauerei in Berlin","National Park Service","Georgetown Submittable","Town of Parachute","Reno-Tahoe Airport","e-flux","Galerie Max Hetzler／主辦場館頁"]},"recordsBuilt":{"publicArt":20,"competitions":5,"exhibitions":5}})
print(json.dumps({"art":len(arts),"competitions":len(comps),"exhibitions":len(exhibitions),"expiredRemoved":len(removed_ids),"activeCompetitions":len(existing["entries"])},ensure_ascii=False))
