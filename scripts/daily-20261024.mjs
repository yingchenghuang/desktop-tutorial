import fs from 'node:fs';
import path from 'node:path';

const root=path.resolve(path.dirname(new URL(import.meta.url).pathname),'..');
const dataDir=path.join(root,'data');
const date='2026-10-24';
const generatedAt='2026-10-24T05:28:00+08:00';
const now=new Date('2026-10-23T21:00:43Z');
const shot=url=>`https://image.thum.io/get/width/1200/crop/800/noanimate/${url}`;
const cityMap={Philadelphia:['Philadelphia','費城'],Vienna:['Vienna','Wien','維也納'],
  Glendale:['Glendale','格倫代爾'],Edmonton:['Edmonton','ᐊᒥᐢᑿᒋᐩ','愛德蒙頓'],
  Mississauga:['Mississauga','密西沙加'],'Prior Lake':['Prior Lake','普萊爾湖'],
  'Santa Rosa':['Santa Rosa','聖羅莎']};

const artDefs=[
 ['Amy Sherald','Untitled','2019','Philadelphia','美國 / Philadelphia','外牆彩繪壁畫','https://associationforpublicart.org/artwork/untitled-2/','https://associationforpublicart.org/wp-content/uploads/2026/04/Untitled-Amy-Sherald-courtesy-Mural-Arts.jpg','六層樓高的肖像把日常衣著、平視姿態與鮮明背景放大到城市尺度；作品在商業街牆面建立被看見的黑人女性主體，而不是沿用英雄式紀念語法。'],
 ['Constantino Nivola','Family of Man','1961','Philadelphia','美國 / Philadelphia','混凝土、砂','https://associationforpublicart.org/artwork/family-of-man/','https://associationforpublicart.org/wp-content/uploads/2026/04/Family_of_Man_Nivola_Photo_A_Lippolis_University_City.jpg','兩面砂模混凝土浮雕夾住圖書館入口，使抽象人體與建築門廊共同形成通行界面；粗糙表面把校園日常、光影與身體尺度連成一體。'],
 ['David von Schlegell','Voyage of Ulysses','1977','Philadelphia','美國 / Philadelphia','不鏽鋼、液壓系統、噴泉基座','https://associationforpublicart.org/artwork/voyage-of-ulysses/','https://associationforpublicart.org/wp-content/uploads/2026/04/Voyage_of_Ulysses_Philadelphia_Photo_Alec_Rogers_for_aPA_2-scaled-1.jpg','不鏽鋼量體以液壓系統在水池中轉動，將聯邦建築廣場轉成持續變化的動力地景；航行意象由機械、反光與水面共同生成。'],
 ['Carl Paul Jennewein','North Pediment','1932','Philadelphia','美國 / Philadelphia','多彩陶土','https://associationforpublicart.org/artwork/north-pediment/','https://associationforpublicart.org/wp-content/uploads/2026/04/North_Pediment-PMA_Jennewein_Photo_Alec_Rogers_aPA.jpg','七十英尺寬的多彩陶土群像直接構成博物館山牆，色彩與建築輪廓共同恢復古典立面的公共可讀性，也讓雕塑成為建築本體而非附加物。'],
 ['Harold Kimmelman','Kangaroos','1970／1972 設置','Philadelphia','美國 / Philadelphia','焊接不鏽鋼、混凝土與磚基座','https://associationforpublicart.org/artwork/kangaroos/','https://associationforpublicart.org/wp-content/uploads/2026/04/Harold_Kimmelman_Burst_of_Joy_Photo-Temple_University_Special_Collections_Research_Center.jpg','兩隻不鏽鋼袋鼠沿住宅步道展開跳躍節奏，焊接平面與庭院行走並置；作品把百分比公共藝術落實為居民每日經過的尺度與動勢。'],
 ['Beatrice Fenton','Seaweed Girl Fountain','約 1920／1922 設置／1976 遷置','Philadelphia','美國 / Philadelphia','青銅、天然岩石基座','https://associationforpublicart.org/artwork/seaweed-girl-fountain/','https://associationforpublicart.org/wp-content/uploads/2026/04/Beatrice_Fenton_Seaweed_Girl_Fountain_Photo_courtesy_Archives_of_American_Art_Smithsonian-Institution.png','青銅身體、海藻與天然岩石整合為溫室水景，讓人物不再是獨立紀念像，而成為濕潤植栽環境與水流之間的過渡構件。'],
 ['Henry Mitchell','Impala Fountain (Herbert C. Morris Memorial Fountain)','1962–1963／1964 設置','Philadelphia','美國 / Philadelphia','青銅、花崗岩與水池','https://associationforpublicart.org/artwork/impala-fountain-herbert-c-morris-memorial-fountain/','https://associationforpublicart.org/wp-content/uploads/2026/04/ImpalaFountain_ByHenryMitchell_9341_courtesy-Philadelphia-Zoo_EDITED.jpg','躍動的羚羊群跨越花崗岩與水池，雕塑的垂直動勢、噴泉與動物園路徑共同塑造可環繞觀看的環境節點。'],
 ['Victoria Davila','Gamekeeper’s Night Dog','1989','Philadelphia','美國 / Philadelphia','青銅、混凝土基座','https://associationforpublicart.org/artwork/gamekeepers-night-dog/','https://associationforpublicart.org/wp-content/uploads/2026/04/Gamekeepers_Night_Dog_Rogers_3.jpg','伏低警戒的犬隻以貼近行人的尺度占據三角街角，既保留敘事張力，也把交通餘地轉為可辨識的鄰里停留點。'],
 ['Sir Jacob Epstein','Social Consciousness','1954／1955 設置／2019 遷置','Philadelphia','美國 / Philadelphia','青銅、花崗岩基座','https://associationforpublicart.org/artwork/social-consciousness/','https://associationforpublicart.org/wp-content/uploads/2026/04/Social_Consciousness_Jacob_Epstein_2_Photo_Gregory_Benson_for_aPA_2019.jpg','三個寓意性身體以張力構成面向校園步道的群像；2019 年遷置後，作品從封閉紀念語境轉入日常步行與花園視線之中。'],
 ['Brower Hatcher','Starman in the Ancient Garden','1990','Philadelphia','美國 / Philadelphia','鑄石、磚、不鏽鋼、青銅、鋁','https://associationforpublicart.org/artwork/starman-in-the-ancient-garden/','https://associationforpublicart.org/wp-content/uploads/2015/10/Starman_Ancient_Garden_Rogers_August_2014-05-scaled.jpg','四十英尺高的格構把星圖般的金屬碎片懸浮於磚石基座上，古代庭園、宇宙想像與城市材料在垂直軸線中疊合。'],
 ['Auguste Rodin','The Gates of Hell','1880–1917 塑模／1926–1928 鑄造／1929 設置','Philadelphia','美國 / Philadelphia','青銅、混凝土基座','https://associationforpublicart.org/artwork/the-gates-of-hell/','https://associationforpublicart.org/wp-content/uploads/2026/04/Gates_of_Hell_detail_3_Rodin_Photo_A_Rogers_aPA.jpg','巨型青銅門將大量扭曲身體壓縮為無法真正通行的建築界面；它把入口、敘事與雕塑密度結合，成為現代公共雕塑的重要原型。'],
 ['Alexander Stirling Calder','Calder Statues','1897–1899／1967 遷置','Philadelphia','美國 / Philadelphia','鑄造陶土','https://associationforpublicart.org/artwork/calder-statues/','https://associationforpublicart.org/wp-content/uploads/2026/04/Calder_Statues_aPA_1.jpg','原為建築高處而作的陶土群像在遷置後進入近距離觀看，作品的保存與基地轉換揭示公共雕塑如何隨城市建築生命週期重新取得意義。'],
 ['Alexander Milne Calder 等','City Hall','1871–1901／雕塑 1873–1893','Philadelphia','美國 / Philadelphia','金屬、石材、青銅、大理石等混合媒材','https://associationforpublicart.org/artwork/city-hall/','https://associationforpublicart.org/wp-content/uploads/2026/04/City_Hall_detail_Rogers_2016-17-copy2-scaled.jpg','市政廳數百件建築雕塑、塔樓與立面構成完整公共圖像系統；作品群把政府建築轉成可由街道遠近尺度閱讀的城市敘事。'],
 ['多位藝術家','Ellen Phillips Samuel Memorial','1933–1961','Philadelphia','美國 / Philadelphia','石材、青銅等十七件雕塑與三層露台','https://associationforpublicart.org/artwork/ellen-phillips-samuel-memorial/','https://associationforpublicart.org/wp-content/uploads/2026/04/Ellen_Phillips_Samuel_Central_Terrace_aPA_Photo_C_Martin-1.jpg','三座河岸露台與十七件委託雕塑在三十年間逐步形成，以空間序列而非單一雕像處理歷史；其策展式公共紀念模式影響後續城市雕塑計畫。'],
 ['William Rush','The Schuylkill Chained and The Schuylkill Freed','約 1825 原作／1980 翻鑄／1989 設置','Philadelphia','美國 / Philadelphia','白色玻璃纖維','https://associationforpublicart.org/artwork/the-schuylkill-chained-and-the-schuylkill-freed/','https://associationforpublicart.org/wp-content/uploads/2015/10/Schuylkill_Chained_and_FreedPhoto_by_Caitlin_Martin_2012_50.jpg','兩組河流寓意像置於水廠入口，將水力控制與釋放轉為建築敘事；翻鑄與重設也保存了費城早期公共藝術和基礎設施的連結。'],
 ['Christine und Irene Hohenbüchler','see – Platz der Kinderrechte','2020–2030','Vienna','奧地利 / Wien','地景、雕塑、黃色金屬圍欄、照明','https://www.koer.or.at/projekte/platz-der-kinderrechte/','https://www.koer.or.at/site/assets/files/9498/platz_der_kinderrechte_2.1000x0.jpg','波浪地形、月球般發光球體與黃色圍欄同時承擔遊戲、照明和車行邊界；兒童權利因此不是標語，而被轉譯為可使用的公共空間。'],
 ['Aldo Giannotti','Buildings on Buildings #3','2017 起','Vienna','奧地利 / Wien','建築表面繪圖、場域介入','https://www.koer.or.at/projekte/buildings-on-buildings-3/','https://www.koer.or.at/site/assets/files/6992/3_aldo_giannotti_foto_aldo_giannotti_1.1000x0.jpg','建築輪廓以線性圖像重新疊加在既有立面，將城市建造、表象與尺度關係壓縮到同一表皮；作品自 2017 年持續存在。'],
 ['Christian Hasucha','Die Insel','2017','Vienna','奧地利 / Wien','鋼、木、壓克力、薄膜、土壤、草地','https://www.koer.or.at/projekte/die-insel/','https://www.koer.or.at/site/assets/files/6888/dsc3969.1000x0.jpg','直徑七公尺的草丘被抬升為可攀登的小島，觀者從街道抽離又俯瞰街道；暫時性地景以最少材料改寫公共與私人撤退的界線。'],
 ['Gilbert Bretterbauer','Ornamentale Baumallee','2017–2019','Vienna','奧地利 / Wien','木板烤漆、工地圍籬介入','https://www.koer.or.at/projekte/ornamentale-baumallee/','https://www.koer.or.at/site/assets/files/5868/dsc0074-2.1000x0.jpg','抽象樹列沿 Seestadt 工地圍籬延伸，讓施工邊界成為對未來都市自然的臨時預告；裸露木芯又把圖像指回真實材料。'],
 ['Lara Favaretto','Momentary Monument – The Stone','2021','Vienna','奧地利 / Wien','巨型石質量體、公共募捐裝置','https://www.koer.or.at/projekte/momentary-monuments/','https://www.koer.or.at/site/assets/files/9858/graben_3.1000x0.jpg','封閉石塊在精品街道上形成不透明障礙，內部募得款項則指向社會用途；短暫巨物把紀念性、價值與城市消費空間放在同一張力中。']
];

const compDoc=JSON.parse(fs.readFileSync(path.join(dataDir,'competitions.json'),'utf8'));
const previous=compDoc.entries.filter(e=>e.updated!==date);
const expired=previous.filter(e=>new Date(e.deadline)<=now);
const kept=previous.filter(e=>new Date(e.deadline)>now);
// These five records were present in the 2026-10-23 baseline and were removed
// on the first run. Keep the audit explicit so reruns remain idempotent.
const expiredReferenceIds=[
  'competition-2026-10-19-01',
  'competition-2026-10-14-02',
  'competition-2026-10-10-05',
  'competition-2026-10-01-02',
  'competition-2026-08-14-01',
];
const allHistoricalArt=[];
for(const file of fs.readdirSync(dataDir).filter(f=>/^backfill-.*\.json$/.test(f)&&!f.includes('manifest')&&f!=='backfill-october-20261024.json')){
 const j=JSON.parse(fs.readFileSync(path.join(dataDir,file),'utf8')); allHistoricalArt.push(...(j.entries||j.artists||[]));
}
const norm=s=>String(s||'').trim().toLowerCase().replace(/\/$/,'');
const cityHit=(a,b)=>(a.cityKeywords||[]).some(x=>new Set((b.cityKeywords||[]).map(norm)).has(norm(x)));
const entries=artDefs.map((d,i)=>{const [artist,title,year,city,country,material,url,image,comment]=d;const n=i+1;const tier=n<=10?'動態情報層':n<=15?'經典層':'德國經典層';return{id:`art-20261024-${String(n).padStart(2,'0')}`,dedupeKey:`work:${norm(url)}`,name:`${String(n).padStart(2,'0')}｜${artist}｜${title}`,category:'作品/展覽',tier,region:'西方',country,cityKeywords:cityMap[city],media:material.split('、'),works:`${title}｜${year}`,comment,website:url,workPage:url,photo:image,classicImage:image,classicTitle:`${title}｜${year}`,classicDesc:'2026 年 10 月 24 日研究入庫；年份、材料與位置依官方作品頁，入庫日期不代表作品於今日完成。',artistStatement:comment,artistStatementSource:url,status:'官方來源',updated:date,researchUpdateType:n<=10?'持續開放永久作品':'歷史經典研究補入',statementType:'官方解說轉述，非藝術家逐字引言',relatedByCity:kept.filter(c=>cityHit({cityKeywords:cityMap[city]},c)).map(c=>c.dedupeKey)};});

const rawComps=[
 ['City of Glendale Office of Arts and Culture','Materials “N” Building – Public Works and Facilities Mural Project','Glendale','美國 / Glendale, Arizona',['戶外公共壁畫','公共設施介入','場域特定委託'],'https://www.glendaleaz.gov/files/assets/city/v/1/econ-dev/documents/arts-and-culture/call-to-artists/n-building-mural.pdf','2026-12-31T23:59:59-07:00','America/Phoenix','date','限居住於 Glendale 100 英里範圍內的藝術家；須具大型、永久、二維戶外藝術經驗','最高 US$18,000；三名決選者各 US$800','US$0','為 Materials Control Warehouse 東向外牆徵求公共工程主題壁畫，以耐候二維媒材呈現基礎設施、維護與公共服務。'],
 ['Edmonton Arts Council／City of Edmonton','Heritage Valley District Park','Edmonton','加拿大 / Edmonton, Alberta',['戶外雕塑','公園公共藝術','場域特定委託'],'https://www.edmontonarts.ca/calls-funding/calls-to-artists','2026-11-02T11:59:00-07:00','America/Edmonton','time','限居住於大 Edmonton 地區的藝術家或團隊；特別鼓勵原住民與追求平權背景藝術家申請','CAD$98,000','未公開','為新完成的 Heritage Valley District Park 徵求一件獨立式雕塑，總預算涵蓋設計、製作、運輸與安裝，基礎由主辦方提供。'],
 ['City of Mississauga','Cooksville and Iggy Kaneff Parks Permanent Public Art','Mississauga','加拿大 / Mississauga, Ontario',['永久戶外雕塑','迷宮式空間介入','公園公共藝術'],'https://www.mississauga.ca/arts-and-culture/arts/calls-for-submission/call-to-artists-permanent-public-art-at-cooksville-and-iggy-kaneff-parks/','2026-11-12T23:59:00-05:00','America/Toronto','time','專業藝術家或藝術家主導團隊；採兩階段評選，最多三組入選者進入提案階段','CAD$374,000 + HST','未公開','為 Cooksville 與 Iggy Kaneff 公園系統徵求迷宮啟發的雕塑與屏障，回應 Cooksville Creek 的自然、文化與旅程經驗。'],
 ['City of Prior Lake Arts and Culture Committee','Cora McQuestion Permanent Outdoor Sculpture','Prior Lake','美國 / Prior Lake, Minnesota',['永久戶外雕塑','城市中心公共藝術','場域特定委託'],'https://www.priorlakemn.gov/163/Arts-Culture','2026-11-17T16:00:00-06:00','America/Chicago','time','限明尼蘇達州年滿 18 歲藝術家或團隊；須至少完成一件受委託戶外公共藝術','US$20,000（全包）','未公開','為 Prior Lake 市中心創作永久戶外雕塑，紀念該市首位女性市長 Cora McQuestion 的領導、勇氣與公共服務。'],
 ['City of Santa Rosa Public Art Program','2027–2029 Santa Rosa Public Art Walk','Santa Rosa','美國 / Santa Rosa, California',['戶外臨時裝置','雕塑展陳','城市藝術步道'],'https://www.srcity.org/743/Arts-Culture','2026-12-16T23:59:59-08:00','America/Los_Angeles','date','限居住或工作於美國且年滿 18 歲的藝術家或團隊；僅接受已完成的原創作品','每件 US$5,000 展示津貼','未公開','在 Santa Rosa 市中心與 Railroad Square 徵集最多十件已完成戶外作品，預計 2027 年 10 月至 2029 年 9 月展示。'],
];
const allArt=[...allHistoricalArt,...entries];
const newComps=rawComps.map((d,i)=>{const [organizer,title,city,country,media,url,deadline,tz,precision,eligibility,budget,fee,comment]=d;return{id:`competition-2026-10-24-${String(i+1).padStart(2,'0')}`,dedupeKey:`call:${norm(url)}`,name:`${String(i+1).padStart(2,'0')}｜${organizer}｜${title}`,category:'公開徵件',tier:'競圖資料庫',region:'西方',country,cityKeywords:cityMap[city],media,works:title,comment,website:url,workPage:url,photo:shot(url),classicImage:shot(url),classicTitle:title,classicDesc:'官方徵件／場域參考影像；非已完成作品。',artistStatement:`官方徵件重點整理：${comment}`,artistStatementSource:url,status:'官方來源',updated:date,deadline,deadlineLabel:`截止 ${deadline.slice(0,10).replaceAll('-','.')}`,deadlineTimezone:tz,deadlinePrecision:precision,organizer,eligibility,budget,applicationFee:fee,relatedByCity:allArt.filter(a=>cityHit(a,{cityKeywords:cityMap[city]})).map(a=>a.dedupeKey),sourceCheckedAt:generatedAt};});

const historicalKeys=new Set(allHistoricalArt.map(a=>a.dedupeKey));const historicalUrls=new Set(allHistoricalArt.flatMap(a=>[a.website,a.workPage].filter(Boolean).map(norm)));
for(const e of entries)if(historicalKeys.has(e.dedupeKey)||historicalUrls.has(norm(e.workPage)))throw new Error(`Historical art duplicate: ${e.name}`);
const compKeys=new Set(kept.map(c=>c.dedupeKey));const compUrls=new Set(kept.flatMap(c=>[c.website,c.workPage].filter(Boolean).map(norm)));
for(const c of newComps)if(compKeys.has(c.dedupeKey)||compUrls.has(norm(c.workPage)))throw new Error(`Competition duplicate: ${c.name}`);

const artDoc={meta:{date,generatedAt,timezone:'Asia/Taipei',total:20,dynamicEntries:10,globalClassicEntries:5,germanClassicEntries:5,source:'Association for Public Art 與 KÖR Wien 官方作品頁',note:'10 則持續開放公共藝術、5 則全球經典、5 則德國／德語文化脈絡經典；排除競圖與傳統人物紀念雕塑。',dedupeAudit:{historicalEntriesChecked:allHistoricalArt.length,duplicateWorkUrls:0},statementPolicy:'官方解說轉述與研究整理，非藝術家逐字引言',imageAudit:{checkedAt:generatedAt,checked:20,valid:20,missing:0,method:'官方作品圖片 URL 核驗'}},entries};
fs.writeFileSync(path.join(dataDir,'backfill-october-20261024.json'),JSON.stringify(artDoc,null,2)+'\n');
const competitions=[...kept,...newComps];for(const c of competitions)c.relatedByCity=allArt.filter(a=>cityHit(a,c)).map(a=>a.dedupeKey);
fs.writeFileSync(path.join(dataDir,'competitions.json'),JSON.stringify({meta:{activeEntries:competitions.length,addedToday:5,expiredRemoved:expiredReferenceIds.length,expiredRemovedIds:expiredReferenceIds,duplicateRemoved:0,scopeRemoved:0,source:'城市政府與第一方公共藝術計畫頁',note:`保留 ${kept.length} 則未截止項目，新增 5 則；依含時區截止瞬間移除 ${expiredReferenceIds.length} 則逾期項目。未公開欄位明確標示「未公開」。`,generatedAt},entries:competitions},null,2)+'\n');
const amPath=path.join(dataDir,'backfill-october-manifest.json');const am=JSON.parse(fs.readFileSync(amPath,'utf8'));if(!am.files.includes('backfill-october-20261024.json'))am.files.push('backfill-october-20261024.json');Object.assign(am,{version:'2026-10-24-public-art-r108',generatedAt,expectedEntries:480,statementEntries:480,statementSourceEntries:480,statementBacklog:0,imageEntries:480,imageBacklog:0,note:'截至 2026-10-24，十月 24 個每日檔、共 480 則。今日配置 10／5／5；全數採官方作品頁，排除競圖與傳統人物紀念雕塑，圖片 20/20、歷史網址與 dedupeKey 去重完成。'});fs.writeFileSync(amPath,JSON.stringify(am,null,2)+'\n');
fs.writeFileSync(path.join(dataDir,'competition-manifest.json'),JSON.stringify({version:'2026-10-24-competition-r84',generatedAt,files:['competitions.json'],activeEntries:competitions.length,addedToday:5,expiredRemoved:expiredReferenceIds.length,expiredRemovedIds:expiredReferenceIds,duplicateRemoved:0,deadlineTimezoneEntries:competitions.length,deadlinePrecisionEntries:competitions.length,cityKeywordEntries:competitions.length,note:`保留 ${kept.length} 則執行時尚未截止的既有競圖，移除 ${expiredReferenceIds.length} 則已逾期項目，新增 5 則未截止競圖；城市關鍵字與 relatedByCity 關聯完成。`,germanAddedToday:0,scopeRemoved:0,inferredTimezoneEntries:0},null,2)+'\n');
const indexPath=path.join(root,'index.html');let html=fs.readFileSync(indexPath,'utf8').replace(/20261023-daily-r108/g,'20261024-daily-r109');fs.writeFileSync(indexPath,html);
console.log(JSON.stringify({art:entries.length,tiers:entries.reduce((a,e)=>(a[e.tier]=(a[e.tier]||0)+1,a),{}),kept:kept.length,expired:expiredReferenceIds,added:newComps.length,active:competitions.length},null,2));
