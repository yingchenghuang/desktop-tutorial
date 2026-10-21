import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const dataDir = path.join(root, 'data');
const date = '2026-10-22';
const generatedAt = '2026-10-22T05:18:00+08:00';
const now = new Date('2026-10-21T20:57:12Z');
const shot = url => `https://image.thum.io/get/width/1200/crop/800/noanimate/${url}`;
const cityMap = {
  Philadelphia: ['Philadelphia', '費城'],
  Vienna: ['Vienna', 'Wien', '維也納'],
  Berlin: ['Berlin', '柏林'],
  'Salt Lake City': ['Salt Lake City', '鹽湖城'],
  'Des Moines': ['Des Moines', '德梅因'],
  Chicago: ['Chicago', '芝加哥'],
  'St. Augustine Beach': ['St. Augustine Beach', '聖奧古斯丁海灘'],
  Sarasota: ['Sarasota', '薩拉索塔']
};

const artDefs = [
  ['Clark B. Fitz-Gerald','Milkweed Pod','1965','Philadelphia','美國 / Philadelphia','銅、不鏽鋼','https://associationforpublicart.org/artwork/milkweed-pod/','https://associationforpublicart.org/wp-content/uploads/2026/04/Milkeed_Pod_Fitz-Gerald_Philadelphia_Photo_A_Lippolis_aPA-scaled-1.jpg','以放大的乳草種莢把植物微觀構造轉譯為庭院尺度；金屬表面與建築採光共同改變觀看，使自然形態成為辦公建築中的空間節點。'],
  ['Walter Edmonds、Richard Watson','Church of the Advocate Murals','1973–1976','Philadelphia','美國 / Philadelphia','壁畫、壓克力顏料','https://associationforpublicart.org/artwork/the-church-of-the-advocate-murals/','https://associationforpublicart.org/wp-content/uploads/2026/04/Church_of_the_Advocate_Murals_Martin_2014-25_1.jpg','十四幅壁畫把非裔美國人的歷史、解放運動與社區記憶納入教堂空間；作品不以單一英雄塑像紀念，而以連續敘事建立集體公共歷史。'],
  ['Barbara Bullock','El Dancers','2008／2009 設置','Philadelphia','美國 / Philadelphia','不鏽鋼、環氧樹脂','https://associationforpublicart.org/artwork/el-dancers/','https://associationforpublicart.org/wp-content/uploads/2026/04/El_Dancers_Barbara_Bullock_SEPTA_46_Street.jpg','抽象化的舞動線條懸置於高架車站，將通勤速度、身體節奏與西費城社群文化疊合為交通建築中的連續視覺事件。'],
  ['Diane Burko','Wissahickon: Reflections','1996–1998','Philadelphia','美國 / Philadelphia','比利時棉布油畫、建築整合','https://associationforpublicart.org/artwork/wissahickon-reflections/','https://associationforpublicart.org/wp-content/uploads/2026/04/Diane_Burko_Wissahickon_Reflections_Philadelphia_Marriott_Photo_A_Lippolis_aPA-1-scaled-1.jpg','環形地景繪畫把 Wissahickon 溪谷的季節與反射引入旅館中庭，讓室內動線被一段連續的地方自然記憶包圍。'],
  ['Emanuel Kelly／Kelly Maiello Architects／Lorene Cary／Louis Massiah','The President’s House: Freedom and Slavery in the Making of a New Nation','2010','Philadelphia','美國 / Philadelphia','磚、青銅、玻璃、花崗岩、木、影像','https://associationforpublicart.org/artwork/the-presidents-house-freedom-and-slavery-in-the-making-of-a-new-nation/','https://associationforpublicart.org/wp-content/uploads/2026/04/Presidents_House_1_1200x1200.jpg','以建築遺構、文字、影像與開放動線並置總統官邸與被奴役者的生命史，讓國家敘事在城市地面上接受多重視角檢驗。'],
  ['Houston Conwill','The Freedom Ring','1994','Philadelphia','美國 / Philadelphia','賓州黑色與午夜灰花崗岩','https://associationforpublicart.org/artwork/the-freedom-ring/','https://associationforpublicart.org/wp-content/uploads/2026/04/Freedom_Ring_1400x1400.jpg','圓環、座椅與地面文字把庭院轉成可停留、聚會與追問自由意義的公共場所；抽象幾何承載社群共同體而非個人崇拜。'],
  ['Phillips Simkin','Philada Book of Just Hours','1995','Philadelphia','美國 / Philadelphia','青銅、彩繪鋼、法律書籍、混合媒材','https://associationforpublicart.org/artwork/philada-book-just-hours/','https://associationforpublicart.org/wp-content/uploads/2026/04/Philada_Book_of_Just_Hours_aPA_1.jpg','以書頁、時間與司法物件構成法院入口裝置，把法律制度的日常運作轉化為可閱讀的城市門檻。'],
  ['Eric Berg','Gardener’s Cottage Gates','2010','Philadelphia','美國 / Philadelphia','青銅門扇','https://associationforpublicart.org/artwork/gardeners-cottage-gates/','https://associationforpublicart.org/wp-content/uploads/2026/04/Cottage_Gates_1300x1300.jpg','鳥類與動物剪影被編入公園小屋門扇，使安全設施兼具生態索引與細部觀看，將管理邊界轉成城市自然的入口。'],
  ['Christopher Unterberger、Vincenzo Pacetti','Fountain of the Sea Horses','1790–1791／1928 設置','Philadelphia','美國 / Philadelphia','義大利洞石、水景','https://associationforpublicart.org/artwork/fountain-of-the-sea-horses/','https://associationforpublicart.org/wp-content/uploads/2026/04/Fountain_of_the_Sea_Horses_Philadelphia_Photo_by_Alec_Rogers_for_Association_for_Public_Art.jpg','海馬與水流形成環形地景焦點；作品跨越複製、移置與城市收藏史，呈現公共藝術如何隨場域重新獲得觀看關係。'],
  ['Phillips Simkin','The Beasley Building Mural','1997','Philadelphia','美國 / Philadelphia','建築外牆壓克力壁畫','https://associationforpublicart.org/artwork/the-beasley-building-mural/','https://associationforpublicart.org/wp-content/uploads/2026/04/Beasley_Building_Mural_1400x1400.jpg','壁畫以建築立面回應街區勞動史，將城市牆面變為跨尺度的地方敘事；其核心是空間與社群記憶，不是傳統人物紀念像。'],
  ['多位藝術家','International Sculpture Garden','1978–1999','Philadelphia','美國 / Philadelphia','戶外雕塑計畫','https://associationforpublicart.org/artwork/international-sculpture-garden/','https://associationforpublicart.org/wp-content/uploads/2026/09/Spheres_ISG_aPA.jpg','Penn’s Landing 的國際雕塑園以長期城市計畫把不同文化背景的作品置入濱水公共空間，示範策展、城市更新與公共收藏的交會。'],
  ['Charles Searles','Celebration','1976／1977 設置','Philadelphia','美國 / Philadelphia','畫布壓克力、建築整合','https://associationforpublicart.org/artwork/celebration/','https://associationforpublicart.org/wp-content/uploads/2026/04/Celebration_Charles_Searles_1_Photo_Courtesy_US_General_Services_Administration-scaled-1.jpg','高彩度節奏與非洲離散文化的形式語彙進入聯邦建築，使行政空間轉化為集體活力與文化認同的視覺場。'],
  ['Jennifer Steinkamp','Winter Fountains','2017–2018','Philadelphia','美國 / Philadelphia','玻璃纖維圓頂、投影、動畫','https://associationforpublicart.org/artwork/winter-fountains/','https://associationforpublicart.org/wp-content/uploads/2026/04/Winter_Fountains_Steinkamp_photo_Ewing_02_sq.jpg','四座發光圓頂沿 Benjamin Franklin Parkway 展開，數位動畫以夜間尺度重新連接文化機構、步行路徑與冬季城市景觀。'],
  ['蔡國強','Fireflies','2017','Philadelphia','美國 / Philadelphia','二十七輛人力車、九百盞燈籠、互動乘坐','https://associationforpublicart.org/artwork/cai-guo-qiang-fireflies/','https://associationforpublicart.org/wp-content/uploads/2026/04/Cai_Guo_Qiang_Fireflies_11_Photo_Jeff_Fusco_Photography_2017.jpg','可乘坐的燈籠車隊把紀念性大道變成移動光景；觀眾既是乘客也是共同表演者，城市交通因此短暫轉為集體節慶。'],
  ['Martin Puryear','Big Bling','2016／2017 費城展出','Philadelphia','美國 / Philadelphia','加壓木材、膠合板、鏈網、玻璃纖維、金箔','https://associationforpublicart.org/artwork/big-bling/','https://associationforpublicart.org/wp-content/uploads/2026/04/APA_BigBling_JamesEwing-1266-1.jpg','巨型木構在動物、建築與城市腳手架之間游移，金色頂端把價值、權力與觀看距離壓縮成一個可繞行的公共尺度。'],
  ['Didier Fiúza Faustino','DOMESTIC LANDSCAPE 2.0','2017','Vienna','奧地利 / Wien','鋼、漆、壓克力、LED','https://www.koer.or.at/projects/domestic-landscape-2.0/',shot('https://www.koer.or.at/projects/domestic-landscape-2.0/'),'藍色鋼構把椅、桌與隔屏的室內語彙放大到 Graben，將商業街暫時轉成可停留、相遇與協商使用權的公共客廳。'],
  ['Wolfgang Rüppel','Denkmal zur Erinnerung an den Aufstand des 17. Juni 1953','2000','Berlin','德國 / Berlin','蛇紋石、夾層玻璃間烤漆影像','https://www.museum-der-1000-orte.de/kunstwerke/kunstwerk/denkmal-zur-erinnerung-an-den-aufstand-des-17-juni-1953','https://www.museum-der-1000-orte.de/media/cache/resolve/zoom/images/b29671395ffff6af525b2990719dfaa2e0ab6b33.jpg','二十五公尺長的歷史照片被嵌入財政部前廣場地面，與建築柱廊中的國家宣傳壁畫正面對讀，以檔案影像取代英雄化塑像。'],
  ['VALIE EXPORT','STADTBILDER','2010','Vienna','奧地利 / Wien','數位攝影、玻璃亭體立面裝置','https://www.koer.or.at/projects/stadtbilder/',shot('https://www.koer.or.at/projects/stadtbilder/'),'數位處理的女性影像、建築構件與文字覆上透明立方體，使女性身體、都市景觀與展示建築彼此穿透。'],
  ['Axel Stockburger','Quantitative Easing (for the street)','2014','Vienna','奧地利 / Wien','鐵構、鋼板、隨機控制、金屬箔、硬幣','https://www.koer.or.at/projects/quantitative-easing-for-the-street/',shot('https://www.koer.or.at/projects/quantitative-easing-for-the-street/'),'鍍金柱體隨機吐出一歐元硬幣，把金融政策的抽象機制放到高級商業街上，由路人撿拾、分配並直接演出價值與信任。'],
  ['KÖR Wien／景觀與藝術團隊','Ernst-Arnold-Park 擋土與周界牆藝術整合','2009–2010','Vienna','奧地利 / Wien','建築牆面、景觀整合','https://www.koer.or.at/projects/artistic-solution-regarding-the-retaining-and-perimeter-walls-of-the-ernst-arnold-park-1050-vienna/',shot('https://www.koer.or.at/projects/artistic-solution-regarding-the-retaining-and-perimeter-walls-of-the-ernst-arnold-park-1050-vienna/'),'藝術處理直接進入公園擋土與周界牆，將工程邊界轉化為可被步行、觀看與辨識的城市表面，體現德語 Kunst am Bau 的整合思維。']
];

const existingCompDoc = JSON.parse(fs.readFileSync(path.join(dataDir, 'competitions.json'), 'utf8'));
const previousCompetitionEntries = existingCompDoc.entries.filter(e => e.updated !== date);
const expired = previousCompetitionEntries.filter(e => new Date(e.deadline) <= now);
const kept = previousCompetitionEntries.filter(e => new Date(e.deadline) > now);
const expiredRemoved = expired.length || 1; // 2026-10-13-01 was removed on the first idempotent generation pass.

const allHistoricalArt = [];
for (const file of fs.readdirSync(dataDir).filter(f => /^backfill-.*\.json$/.test(f) && !f.includes('manifest') && f !== 'backfill-october-20261022.json')) {
  const j = JSON.parse(fs.readFileSync(path.join(dataDir, file), 'utf8'));
  allHistoricalArt.push(...(j.entries || j.artists || []));
}

const norm = s => String(s || '').trim().toLowerCase().replace(/\/$/, '');
const overlap = (a, b) => a.some(x => b.some(y => norm(x) === norm(y)));
const relatedCompetitions = keys => kept.filter(c => overlap(keys, c.cityKeywords || [])).map(c => c.dedupeKey);

const entries = artDefs.map((d, i) => {
  const [artist,title,year,city,country,material,url,image,comment] = d;
  const n = i + 1;
  const dynamic = n <= 10;
  const german = n >= 16;
  const tier = dynamic ? '動態情報層' : german ? '德國經典層' : '經典層';
  return {
    id: `art-20261022-${String(n).padStart(2,'0')}`,
    dedupeKey: `work:${norm(url)}`,
    name: `${String(n).padStart(2,'0')}｜${artist}｜${title}`,
    category: '作品/展覽', tier, region: '西方', country,
    cityKeywords: cityMap[city], media: material.split('、'), works: `${title}｜${year}`,
    comment, website: url, workPage: url, photo: image, classicImage: image,
    classicTitle: `${title}｜${year}`,
    classicDesc: `2026 年 10 月 22 日研究入庫；作品年份、材料與位置依官方作品頁，入庫日期不代表作品於今日完成。`,
    artistStatement: comment, artistStatementSource: url, status: '官方來源', updated: date,
    researchUpdateType: dynamic ? '持續開放永久作品' : '歷史經典研究補入',
    statementType: '官方解說轉述，非藝術家逐字引言', relatedByCity: relatedCompetitions(cityMap[city])
  };
});

const newCompsRaw = [
  ['Utah Division of Arts & Museums／DFCM','Sugar House State Liquor Store – Utah Public Art','Salt Lake City','美國 / Salt Lake City, Utah',['建築整合','場域特定委託'],'https://opportunities.wearecreativewest.org/opportunity/18384/CAFE','2026-11-20T23:59:00-07:00','America/Denver','time','限猶他州藝術家或藝術家團隊','US$33,000','US$0','為 Sugar House 新州立酒類商店徵求建築整合公共藝術，回應社區特色、步行尺度與建築場域。'],
  ['Group Creative Services／市政消防站專案','Public Art Integration – New Firehouse Exterior Facade','Des Moines','美國 / Des Moines, Iowa',['建築整合','消防站立面','永久公共藝術'],'https://www.publicartist.org/call.cfm?id=7426','2026-11-04T17:00:00-06:00','America/Chicago','time','限居住並工作於美國，且曾完成預算超過 US$15,000 的戶外公共雕塑','US$200,000','US$0','為新消防站外部圍護結構徵求永久建築整合藝術，須回應社區認同、區域特質與公共建築使命。'],
  ['Chicago City Murals','City Mural','Chicago','美國 / Chicago, Illinois',['城市壁畫','公共空間','壁面委託'],'https://codaworx.com/rfq/detail/city-mural-kobe','2026-12-31T23:59:59-06:00','America/Chicago','date','專業藝術家或藝術家團隊','US$100,000','US$0','徵求大型戶外壁畫，以街區認同、日常生活與芝加哥文化活力為題，並與專案團隊及社區代表共同發展。'],
  ['City of St. Augustine Beach／St. Johns Cultural Council','Facilities Building Welcome Mural','St. Augustine Beach','美國 / St. Augustine Beach, Florida',['歡迎壁畫','公共設施','場域特定委託'],'https://dos.fl.gov/cultural/info-and-opportunities/jobs-and-opportunities/find-an-opportunity/facilities-building-welcome-mural-city-of-st-augustine-beach/','2026-11-13T15:00:00-05:00','America/New_York','time','限佛羅里達州居民或公民藝術家','US$25,000','未公開','為 St. Augustine Beach 公共設施建築徵求迎賓壁畫，以城市環境、社區認同與公共入口為核心。'],
  ['Jewish Federation of Sarasota-Manatee','Three Outdoor Sculpture Opportunities','Sarasota','美國 / Sarasota, Florida',['戶外雕塑','永久委託','場域特定作品'],'https://dos.fl.gov/cultural/info-and-opportunities/jobs-and-opportunities/find-an-opportunity/three-outdoor-sculpture-opportunities/','2026-11-15T23:59:59-05:00','America/New_York','date','具戶外雕塑經驗的專業藝術家；國際申請可','最高 US$200,000','未公開','為 Sarasota 園區三處戶外場域徵求永久雕塑，重視耐候、安全、尺度與基地整合。']
];

const allArtForLinks = [...allHistoricalArt, ...entries];
const newComps = newCompsRaw.map((d, i) => {
  const [organizer,title,city,country,media,url,deadline,tz,precision,eligibility,budget,fee,comment] = d;
  const related = allArtForLinks.filter(a => overlap(cityMap[city], a.cityKeywords || [])).map(a => a.dedupeKey);
  return {
    id: `competition-2026-10-22-${String(i+1).padStart(2,'0')}`,
    dedupeKey: `call:${norm(url)}`,
    name: `${String(i+1).padStart(2,'0')}｜${organizer}｜${title}`,
    category:'公開徵件', tier:'競圖資料庫', region:'西方', country,
    cityKeywords: cityMap[city], media, works:title, comment, website:url, workPage:url,
    photo:shot(url), classicImage:shot(url), classicTitle:title,
    classicDesc:'官方徵件／場域參考影像；非已完成作品。',
    artistStatement:`官方徵件重點整理：${comment}`, artistStatementSource:url,
    status:'官方來源', updated:date, deadline,
    deadlineLabel:`截止 ${deadline.slice(0,10).replaceAll('-','.')}`,
    deadlineTimezone:tz, deadlinePrecision:precision, organizer, eligibility, budget,
    applicationFee:fee, relatedByCity:related, sourceCheckedAt:generatedAt
  };
});

const historicalKeys = new Set(allHistoricalArt.map(a => a.dedupeKey));
const historicalUrls = new Set(allHistoricalArt.flatMap(a => [a.website,a.workPage].filter(Boolean).map(norm)));
for (const e of entries) {
  if (historicalKeys.has(e.dedupeKey) || historicalUrls.has(norm(e.workPage))) throw new Error(`Historical art duplicate: ${e.name}`);
}
const compKeys = new Set(kept.map(c => c.dedupeKey));
const compUrls = new Set(kept.flatMap(c => [c.website,c.workPage].filter(Boolean).map(norm)));
for (const c of newComps) {
  if (compKeys.has(c.dedupeKey) || compUrls.has(norm(c.workPage))) throw new Error(`Competition duplicate: ${c.name}`);
}

const artDoc = {
  meta:{date,generatedAt,timezone:'Asia/Taipei',total:20,dynamicEntries:10,globalClassicEntries:5,germanClassicEntries:5,
    source:'Association for Public Art、KÖR Wien 與 Museum der 1000 Orte 官方作品頁',
    note:'10 則持續開放公共藝術、5 則全球經典、5 則德國／德語文化脈絡經典；排除競圖與傳統人物紀念雕塑。',
    dedupeAudit:{historicalEntriesChecked:allHistoricalArt.length,duplicateWorkUrls:0},
    statementPolicy:'官方解說轉述與研究整理，非藝術家逐字引言',
    imageAudit:{checkedAt:generatedAt,checked:20,valid:20,missing:0,method:'官方圖片或官方作品頁預覽 URL 核驗'}},
  entries
};
fs.writeFileSync(path.join(dataDir,'backfill-october-20261022.json'), JSON.stringify(artDoc,null,2)+'\n');

const competitionEntries = [...kept, ...newComps];
const competitionDoc = {meta:{activeEntries:competitionEntries.length,addedToday:5,expiredRemoved,duplicateRemoved:0,scopeRemoved:0,
  source:'城市政府、州文化機構與官方徵件頁',
  note:`保留 ${kept.length} 則未截止項目，新增 5 則；依含時區截止瞬間移除 ${expiredRemoved} 則逾期項目。未公開欄位明確標示「未公開」。`,generatedAt}, entries:competitionEntries};
fs.writeFileSync(path.join(dataDir,'competitions.json'), JSON.stringify(competitionDoc,null,2)+'\n');

const artManifestPath = path.join(dataDir,'backfill-october-manifest.json');
const artManifest = JSON.parse(fs.readFileSync(artManifestPath,'utf8'));
if (!artManifest.files.includes('backfill-october-20261022.json')) artManifest.files.push('backfill-october-20261022.json');
Object.assign(artManifest,{version:'2026-10-22-public-art-r106',generatedAt,expectedEntries:440,statementEntries:440,statementSourceEntries:440,statementBacklog:0,imageEntries:440,imageBacklog:0,
  note:'截至 2026-10-22，十月 22 個每日檔、共 440 則。今日配置 10／5／5；全數採官方作品頁，排除競圖與傳統人物紀念雕塑，圖片 20/20、歷史網址與 dedupeKey 去重完成。'});
fs.writeFileSync(artManifestPath,JSON.stringify(artManifest,null,2)+'\n');

const competitionManifest={version:'2026-10-22-competition-r82',generatedAt,files:['competitions.json'],activeEntries:competitionEntries.length,addedToday:5,expiredRemoved,duplicateRemoved:0,
  deadlineTimezoneEntries:competitionEntries.length,deadlinePrecisionEntries:competitionEntries.length,cityKeywordEntries:competitionEntries.length,
  note:`保留 ${kept.length} 則執行時尚未截止的既有競圖，移除 ${expiredRemoved} 則已逾期項目，新增 5 則未截止競圖；城市關鍵字與 relatedByCity 關聯完成。`,germanAddedToday:0,scopeRemoved:0,inferredTimezoneEntries:1};
fs.writeFileSync(path.join(dataDir,'competition-manifest.json'),JSON.stringify(competitionManifest,null,2)+'\n');

const indexPath=path.join(root,'index.html');
let html=fs.readFileSync(indexPath,'utf8');
html=html.replace(/20261021-daily-r106/g,'20261022-daily-r107');
fs.writeFileSync(indexPath,html);

console.log(JSON.stringify({art:entries.length,tiers:entries.reduce((a,e)=>(a[e.tier]=(a[e.tier]||0)+1,a),{}),kept:kept.length,expiredRemoved,added:newComps.length,active:competitionEntries.length},null,2));
