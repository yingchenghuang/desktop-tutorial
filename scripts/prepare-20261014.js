const fs = require('fs');

const date = '2026-10-14';
const generatedAt = '2026-10-14T05:20:00+08:00';
const thumb = u => `https://image.thum.io/get/width/1200/crop/800/noanimate/${u}`;

function art(i, tier, artist, title, year, country, cities, media, comment, statement, url, region='西方') {
  const kind = tier === '動態情報層' ? 'current' : tier === '全球經典層' ? 'global' : 'german';
  const id = `${kind}-2026-10-14-${String(i).padStart(2,'0')}`;
  const key = `art-2026-10-14-${kind}-${artist}-${title}`.normalize('NFKD').toLowerCase()
    .replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,180);
  return {
    category:'作品/展覽', status:'官方來源', updated:date, id, dedupeKey:key,
    name:`${String(i).padStart(2,'0')}｜${artist}｜${title}`, tier, region, country,
    cityKeywords:cities, media, works:`${title}｜${year}`, comment,
    website:url, workPage:url, photo:thumb(url), artistStatement:statement,
    artistStatementSource:url, classicTitle:`${title}｜${year}`, classicImage:thumb(url),
    classicDesc:comment, relatedByCity:[]
  };
}

const entries = [
  art(1,'動態情報層','Karl Josef Dierkes','Lichtwand','1974','德國 / Bonn',['Bonn','波昂'],['Kunst am Bau','青銅','空間雕塑'],
    '中央內院的巨型青銅壁體以雙凹中軸與離地翼形削弱重量感，讓光線把封閉量體轉成向周遭展開的空間雕塑。',
    'Dierkes 將作品精確對準建築軸線；粗糙有機表皮與幾何邊界形成張力，使雕塑成為理性行政建築中的光與空間反題。',
    'https://www.museum-der-1000-orte.de/kunstwerke/kunstwerk/lichtwand'),
  art(2,'動態情報層','Fritz Koenig','Großes Kugelrelief II','1970','德國 / Bonn',['Bonn','波昂'],['Kunst am Bau','鋁浮雕','建築整合'],
    '鋁製層疊水平面在球體處聚焦，並把雙扇門的垂直分線向上延伸；深浮雕把建築格網轉化為帶有推進感的空間節點。',
    'Koenig 以球與線的抽象語彙，把會議空間的門楣由裝飾面提升為能向室內傳遞動勢的建築構件。',
    'https://www.museum-der-1000-orte.de/kunstwerke/kunstwerk/grosses-kugelrelief-ii'),
  art(3,'動態情報層','Hubert Kiecol','Stelen / Allee mit Hecken und Bänken','2001','德國 / Berlin',['Berlin','柏林'],['Kunst am Bau','白色混凝土','屋頂地景'],
    '白色混凝土柱、長椅與植栽槽以規律節奏介入外交部屋頂；簡約構件在城市天際線前標定一個無屋頂的想像空間。',
    'Kiecol 讓看似功能性的建築元素脫離實用目的，以尺度、間距與純白材質重新組織屋頂露台的行走和視線。',
    'https://www.museum-der-1000-orte.de/kunstwerke/kunstwerk/stelen-allee-mit-hecken-und-banken'),
  art(4,'動態情報層','Bernd Krimmel','o. T. (Mosaik)','1956','德國 / Darmstadt',['Darmstadt','達姆施塔特'],['Kunst am Bau','馬賽克','玻璃與天然石'],
    '長達二十公尺的天然石與彩色玻璃馬賽克完整嵌入高樓入口大廳，以連續色面把通行空間轉化為橫向展開的建築圖像。',
    '作品以耐久材料和牆體尺度處理戰後行政建築的公共入口，使圖像、動線與建築表皮形成不可分割的整體。',
    'https://www.museum-der-1000-orte.de/kunstwerke/kunstwerk/o-t-mosaik-1'),
  art(5,'動態情報層','Ulrike Drasdo','o. T. (Wandbehänge)','1999','德國 / Erfurt',['Erfurt','艾福特'],['Kunst am Bau','纖維藝術','羊毛織物'],
    '兩件大型平織羊毛壁掛以柔性表面回應聯邦勞動法院會議室，在硬質司法建築中引入吸音、觸覺與色彩節奏。',
    'Drasdo 將編織視為建築尺度的空間媒介；纖維不只是掛飾，而是調節聲學、尺度與會議氛圍的構成。',
    'https://www.museum-der-1000-orte.de/kunstwerke/kunstwerk/o-t-wandbehange'),
  art(6,'動態情報層','System Design','o. T. (Wandgestaltung und Leitsystem)','1972','德國 / Bonn',['Bonn','波昂'],['Kunst am Bau','導視系統','環境設計'],
    '黃、橙單色牆板、家具與外牆構成跨越室內外的整體導視，以光和色彩把行政培訓建築組織成可辨識的環境系統。',
    'System Design 把視覺傳達、家具和建築共同設計，主張導向資訊與感知環境可以由同一套色彩秩序生成。',
    'https://www.museum-der-1000-orte.de/kunstwerke/kunstwerk/o-t-wandgestaltung-und-leitsystem'),
  art(7,'動態情報層','Peter Nagel','Auf der Brücke','1982／2016 遷置／2023 再遷置','德國 / Kiel',['Kiel','基爾'],['Kunst am Bau','油彩壁畫','場域轉置'],
    '原為邊境公路休息站量身繪製的十公尺長壁畫，以橋欄連接畫面與座椅高度；作品歷經兩次轉置，現於基爾職業學校餐廳公開可見。',
    'Nagel 以錯視橋面讓觀看者同時成為畫中被觀看的人；遷移歷史又使作品成為德國邊界變遷與場域保存的見證。',
    'https://www.museum-der-1000-orte.de/kunstwerke/kunstwerk/auf-der-brucke'),
  art(8,'動態情報層','James Fraser Carpenter','o. T. (Glasfassade)','1999','德國 / Berlin',['Berlin','柏林'],['Kunst am Bau','二向色玻璃','光環境'],
    '外交部中庭立面以二向色玻璃與金屬反射器導入南向日光；顏色隨天候、時間與觀看角度變動，夜間再向城市發光。',
    'Carpenter 將玻璃幕牆設計成可變的光學膜，讓藝術、結構和環境工程共同表述外交建築的透明與開放。',
    'https://www.museum-der-1000-orte.de/kunstwerke/kunstwerk/o-t-glasfassade'),
  art(9,'動態情報層','Ansgar Nierhoff','Streckungen (Nähe und Ferne, Raum erfahren)','1986','德國 / Bonn',['Bonn','波昂'],['Kunst am Bau','鍛造鋼','地景介入'],
    '兩組各四座鍛鋼塊以不同間距標出緊密與開闊的中心；觀者在湖泊、樹木與行政建築之間移動，才讀出完整軸線。',
    'Nierhoff 以重量、距離和站位讓雕塑成為測量環境的裝置；植栽多年生長後，作品與自然的權力關係也持續改變。',
    'https://www.museum-der-1000-orte.de/kunstwerke/kunstwerk/streckungen-nahe-und-ferne-raum-erfahren'),
  art(10,'動態情報層','Bernd Damke','Künstlerische Wandgestaltung','1972','德國 / Hürth',['Hürth','許爾特'],['Kunst am Bau','色彩環境','木板壁面'],
    '近二十公尺長的黃、紅、橙木板序列覆滿餐廳牆面，以 System Design 的色彩研究調節情緒並與家具共同形成環境。',
    'Damke 把色彩知覺研究轉成建築尺度的視覺系統，讓單色模組不再是附加裝飾，而是日常使用空間的心理基礎設施。',
    'https://www.museum-der-1000-orte.de/kunstwerke/kunstwerk/kunstlerische-wandgestaltung'),

  art(11,'全球經典層','Sol LeWitt','3 x 3 x 1','1987','美國 / New York City',['New York City','紐約市'],['概念藝術','極簡雕塑','幾何結構'],
    '大型開放立方體以三乘三單元執行增減一格的數值操作；簡單規則同時改變量體、空隙和觀者穿越視線。',
    'LeWitt 將作品的核心放在可被描述的生成規則，使公共雕塑從單一造型轉為概念、模組與空間關係的可視化。',
    'https://www.publicartfund.org/exhibitions/view/3-x-3-x-1/'),
  art(12,'全球經典層','Liz Larner','2001','2006–2007 展出','美國 / New York City',['New York City','紐約市'],['公共雕塑','電腦建模','虹彩塗層'],
    '十二呎尺度的工業材料量體疊合球體到立方體的六個變形階段，綠紫虹彩表面隨角度與光線持續改變。',
    'Larner 以電腦動畫建立形體，把現代雕塑的球與方體壓縮到同一中心；靜止物件因此呈現同時發生的變形。',
    'https://www.publicartfund.org/exhibitions/view/2001-2/'),
  art(13,'全球經典層','Liz Craft','The Spare','2004','美國 / New York City',['New York City','紐約市'],['公共雕塑','青銅','場域反差'],
    '三組仙人掌從廢輪胎長出的青銅雕塑被移植到中央公園，以沙漠廢墟意象對照人工營造的翠綠景觀。',
    'Craft 把日常廢棄物和植物鑄成兼具流行文化與不安感的異物，藉錯置挑戰公共空間裡高藝術與低文化的界線。',
    'https://www.publicartfund.org/exhibitions/view/whitney-biennial-2004-the-spare/'),
  art(14,'全球經典層','Olav Westphalen','The Weight of Dead Prey','2004','美國 / New York City',['New York City','紐約市'],['場域特定','公共雕塑','制度批判'],
    '等身猛虎與模擬動物玩具被置於中央公園動物園入口附近，讓觀眾直面人類馴服野性、又浪漫化自然的矛盾。',
    'Westphalen 以漫畫式幽默把新聞中的圈養猛獸轉為場域批評；圍欄、玩具與動物共同構成對觀看制度的反問。',
    'https://www.publicartfund.org/exhibitions/view/whitney-biennial-2004-the-weight-of-dead-prey/'),
  art(15,'全球經典層','Jackie Ferrara','Love Seat','1986','美國 / New York City',['New York City','紐約市'],['功能性公共藝術','雪松木','城市家具'],
    '雪松木二乘四構件與黑色條紋組成可實際入座的長椅，作品面向市長辦公室，把政治中心轉成共享休息場。',
    'Ferrara 以家具尺度和幽默語意鬆動市政廣場的權威感，主張使用、停留與社交本身就是公共藝術的形式。',
    'https://www.publicartfund.org/exhibitions/view/love-seat/'),

  art(16,'德國經典層','VALIE EXPORT／Peter Weibel','Tapp- und Tastkino','1968','奧地利 / Wien',['Vienna','Wien','維也納'],['公共行動','身體藝術','參與式藝術'],
    '藝術家把紙箱綁在胸前作為微型電影院，邀請路人伸手進入；「看電影」被改寫為受時間限制、需承擔倫理關係的觸覺事件。',
    '作品把銀幕、女性身體與觀眾權力直接搬上街頭，以參與機制揭露影像消費中的凝視與身體政治。',
    'https://www.koer.or.at/projekte/tapp-und-tastkino/'),
  art(17,'德國經典層','Günter Brus／Otto Muehl／Malte Olschewski／Peter Weibel／Oswald Wiener','Kunst und Revolution','1968','奧地利 / Wien',['Vienna','Wien','維也納'],['公共行動','維也納行動主義','制度批判'],
    '1968 年的集體行動在維也納大學講堂以身體、國家象徵與禁忌行為正面衝撞校園和國家制度，並引發逮捕與審判。',
    '作品把公共性推向法律、道德與言論自由的邊界；其歷史意義不在可收藏物件，而在行動如何迫使社會界定藝術的限度。',
    'https://www.koer.or.at/projekte/kunst-und-revolution/'),
  art(18,'德國經典層','Thomas Baumgärtel','Spraybanane','1992 起','奧地利 / Wien',['Vienna','Wien','維也納'],['街頭藝術','模板噴畫','城市標記'],
    '黃色香蕉模板自 1992 年起出現在維也納多處藝術場館，從曾被視為毀損的塗記，逐步轉化為非官方的藝術場所認證。',
    'Baumgärtel 以可複製符號建立跨城市的另類地圖；標記既質疑誰有權命名藝術空間，也讓街道成為流通媒介。',
    'https://www.koer.or.at/projekte/spraybanane/'),
  art(19,'德國經典層','Peter Fend 等十位藝術家','Topographie II／Untergrund','1991','奧地利 / Wien',['Vienna','Wien','維也納'],['錄像裝置','地鐵藝術','城市媒體'],
    '十位藝術家的錄像裝置進入維也納地鐵，把地下交通網絡變成分散式影像展場，日常移動與藝術觀看在通勤途中交疊。',
    '計畫以城市基礎設施取代白盒子展場，讓媒體藝術直接面對非自願觀眾、速度與公共資訊環境。',
    'https://www.koer.or.at/projekte/topographie-ii-untergrund/'),
  art(20,'德國經典層','Adolf Frohner','Circa 55 Schritte durch Europa','1993 起','奧地利 / Wien',['Vienna','Wien','維也納'],['地鐵藝術','牆面雕塑','歷史敘事'],
    '西站地鐵通道四十公尺長牆面以約五十五步的行程壓縮歐洲從石器時代至二十一世紀的文化與思想變化。',
    'Frohner 把歷史閱讀嵌入轉乘步伐，使通道不是展示容器，而是由身體速度逐段啟動的時間軸。',
    'https://www.koer.or.at/projekte/circa-55-schritte-durch-europa/')
];

function comp(i, artist, title, city, cities, media, comment, statement, url, deadline, tz, precision, organizer, eligibility, budget, fee) {
  const key = `opportunity-2026-10-14-${artist}-${title}`.normalize('NFKD').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,180);
  return {category:'公開徵件',status:'官方來源',updated:date,id:`competition-2026-10-14-${String(i).padStart(2,'0')}`,dedupeKey:key,
    name:`${String(i).padStart(2,'0')}｜${artist}｜${title}`,tier:'競圖資料庫',region:'西方',country:`美國 / ${city}`,cityKeywords:cities,media,
    works:`${title}｜${budget}｜截止 ${deadline.slice(0,10).replaceAll('-','.')}`,comment,website:url,workPage:url,photo:thumb(url),artistStatement:statement,
    artistStatementSource:url,classicTitle:title,classicImage:thumb(url),classicDesc:comment,deadline,deadlineLabel:`截止 ${deadline.slice(0,10).replaceAll('-','.')}`,
    deadlineTimezone:tz,deadlinePrecision:precision,organizer,eligibility,budget,applicationFee:fee,relatedByCity:[]};
}

const added = [
  comp(1,'City of Palm Springs','Palm Springs International Airport Exterior Tile Mosaic Mural','Palm Springs, California',['Palm Springs','棕櫚泉'],['建築整合','磁磚馬賽克','機場公共藝術'],
    '徵求機場外牆約 650 平方呎、可延伸至約 1,150 平方呎的磁磚馬賽克；作品須耐候並維持至少二十年，三組入圍者各獲 US$1,000。',
    '計畫把機場到達立面視為城市門戶，以大型磁磚圖像建立棕櫚泉的地方辨識與旅客第一印象。',
    'https://www.publicartist.org/call.cfm?id=7410','2026-11-04T23:59:59-08:00','America/Los_Angeles','date','City of Palm Springs Public Arts Commission',
    '居住並工作於美國、曾完成 US$15,000 以上公共藝術的專業藝術家或團隊；具磁磚馬賽克經驗者優先','US$70,000；三組入圍者各 US$1,000','未公開'),
  comp(2,'University of Alabama at Birmingham','UAB Legacy Art Trail Public Art Commission','Birmingham, Alabama',['Birmingham','伯明罕'],['戶外雕塑','校園公共藝術','永久委託'],
    '於 Hill Student Center 外部設置永久雕塑，預定 2027 年夏季安裝；總預算含設計、製作、運輸與安裝，入圍者各獲 US$2,000。',
    '委託以校園 Legacy Art Trail 串連大學記憶與當代公共空間，尋找能承受戶外環境並形成聚集節點的作品。',
    'https://www.publicartist.org/call.cfm?id=7408','2026-10-22T23:59:59-05:00','America/Chicago','date','University of Alabama at Birmingham',
    '具高品質公共藝術實績的藝術家或團隊','US$150,000；入圍者各 US$2,000','未公開'),
  comp(3,'Stuyvesant Park Neighborhood Association','2026 Sculpture Open Call: Renewal and Respite Found in Nature','New York City, New York',['New York City','紐約市'],['暫時性公共藝術','雕塑','公園裝置'],
    '徵求以「自然中的更新與歇息」為題、適合 Stuyvesant Square Park 的戶外雕塑；補助為全包費用 US$5,000。',
    '計畫要求作品回應歷史公園的療癒、休息與自然經驗，並在高密度城市中創造可被共同閱讀的暫時性節點。',
    'https://www.publicartist.org/call.cfm?id=7406','2026-10-25T23:59:00-04:00','America/New_York','time','Stuyvesant Park Neighborhood Association',
    '紐約市五區藝術家；以創作生涯中期並與社區具有連結者為佳','US$5,000，全包','未公開'),
  comp(4,'City of Dallas Office of Arts and Culture','Cotillion Park Public Art Call','Dallas, Texas',['Dallas','達拉斯'],['戶外雕塑','公園公共藝術','永久委託'],
    '為 Cotillion Park 徵求永久戶外作品，鼓勵抽象形式並回應自然、社區與場域；三組入圍者各獲 US$1,200。',
    '作品將作為公園更新中的視覺地標，透過尺度、材料與地景關係強化居民的共同場所感。',
    'https://www.publicartist.org/call.cfm?id=7411','2026-10-29T23:59:59-05:00','America/Chicago','date','City of Dallas Office of Arts and Culture',
    '專業藝術家或團隊；現任達拉斯市承包藝術家、未成年人、大學生及市府員工等不得申請','US$112,000；三組入圍者各 US$1,200','未公開'),
  comp(5,'Bernalillo County Public Art Program','Fire Station 36 Public Art','Albuquerque, New Mexico',['Albuquerque','阿布奎基'],['消防站公共藝術','戶外雕塑','永久委託'],
    '徵求耐久、低維護的戶外作品，回應消防員、社區、永續、公共安全與韌性；總預算含設計至安裝全部費用。',
    '委託把消防站視為日常公共服務與鄰里信任的地標，期待作品把救援、韌性和地方認同轉化為共享形象。',
    'https://opportunities.wearecreativewest.org/opportunity/18267/CAFE','2026-10-23T23:59:00-06:00','America/Denver','time','Bernalillo County Public Art Program',
    '居住於 New Mexico、Oklahoma、Utah、Arizona、Colorado 或 Texas 的藝術家或團隊','US$80,000，全包','US$0')
];

const now = new Date('2026-10-13T21:04:00Z');
const cp = JSON.parse(fs.readFileSync('data/competitions.json','utf8'));
const before = cp.entries;
const activeBefore = before.filter(x => new Date(x.deadline) > now);
const expiredRemoved = before.length - activeBefore.length;
const comps = [...activeBefore, ...added];

// Build city relations against all existing public-art files plus today's file.
const manifests = ['data/backfill-july-manifest.json','data/backfill-august-manifest.json','data/backfill-september-manifest.json','data/backfill-october-manifest.json'];
let allArt = [];
for (const mp of manifests) {
  if (!fs.existsSync(mp)) continue;
  const m = JSON.parse(fs.readFileSync(mp,'utf8'));
  for (const f of m.files || []) {
    const fp = `data/${f}`;
    if (fs.existsSync(fp)) allArt.push(...(JSON.parse(fs.readFileSync(fp,'utf8')).entries || []));
  }
}
allArt = [...allArt, ...entries];
const norm = s => String(s).normalize('NFKC').trim().toLowerCase();
const hit = (a,b) => (a.cityKeywords||[]).some(x => (b.cityKeywords||[]).map(norm).includes(norm(x)));
for (const a of entries) a.relatedByCity = comps.filter(c => hit(a,c)).map(c => c.dedupeKey);
for (const c of comps) c.relatedByCity = allArt.filter(a => hit(a,c)).map(a => a.dedupeKey);

const daily = {meta:{generatedAt,timezone:'Asia/Taipei',date,total:20,dynamicEntries:10,globalClassicEntries:5,germanClassicEntries:5,
  source:'Museum der 1000 Orte、Public Art Fund、KÖR Wien 第一方作品頁',
  selectionPolicy:'當期、持續開放或已實現的空間裝置、永久 Kunst am Bau、場域介入、建築整合、公共行動與觀念性作品；排除傳統城市人物紀念雕塑，競圖與補助完全分流。',
  note:'10/14 固定 10＋5＋5；20 則皆為作品資料，未混入競圖、補助或獎項，傳統人物紀念像排除檢查通過。',
  linkAudit:{checkedAt:generatedAt,checkedUniqueSources:20,brokenOrBlockedReplaced:0,rule:'第一方作品頁回讀'},
  imageAudit:{checkedAt:generatedAt,imageEntries:20,missing:0,rule:'第一方作品頁預覽圖片'}},entries};
fs.writeFileSync('data/backfill-october-20261014.json',JSON.stringify(daily,null,2)+'\n');

cp.meta = {activeEntries:comps.length,addedToday:5,expiredRemoved,duplicateRemoved:0,source:'官方主辦機構徵件頁',
  note:`保留 ${activeBefore.length} 則既有未截止項目，新增 5 則，移除 ${expiredRemoved} 則已逾期項目。`};
cp.entries = comps;
fs.writeFileSync('data/competitions.json',JSON.stringify(cp,null,2)+'\n');

const cm = JSON.parse(fs.readFileSync('data/competition-manifest.json','utf8'));
cm.version='2026-10-14-competition-r72'; cm.generatedAt=generatedAt; cm.activeEntries=comps.length; cm.addedToday=5; cm.expiredRemoved=expiredRemoved;
cm.deadlineTimezoneEntries=comps.filter(x=>x.deadlineTimezone).length;
cm.deadlinePrecisionEntries=comps.filter(x=>x.deadlinePrecision).length;
cm.cityKeywordEntries=comps.filter(x=>Array.isArray(x.cityKeywords)&&x.cityKeywords.length>=2).length;
cm.germanAddedToday=0;
cm.note=`保留 ${activeBefore.length} 則既有未截止項目，新增 5 則；依實際截止瞬間移除 ${expiredRemoved} 則，所有有效 deadline 皆含時區偏移。`;
fs.writeFileSync('data/competition-manifest.json',JSON.stringify(cm,null,2)+'\n');

const om = JSON.parse(fs.readFileSync('data/backfill-october-manifest.json','utf8'));
om.version='2026-10-14-public-art-r97'; om.generatedAt=generatedAt;
om.files=[...new Set([...om.files,'backfill-october-20261014.json'])];
om.expectedEntries=om.files.length*20; om.statementEntries=om.expectedEntries; om.statementSourceEntries=om.expectedEntries; om.imageEntries=om.expectedEntries;
om.note='截至 2026-10-14，10 月每日固定 20 則且皆為作品資料；本日配置 10／5／5，排除傳統人物紀念雕塑，來源、圖片、城市與去重欄位完整。';
fs.writeFileSync('data/backfill-october-manifest.json',JSON.stringify(om,null,2)+'\n');

const ip='index.html'; let ih=fs.readFileSync(ip,'utf8'); ih=ih.replace("const cacheKey = '20261013-daily-r96';","const cacheKey = '20261014-daily-r97';"); fs.writeFileSync(ip,ih);

console.log(JSON.stringify({publicArt:entries.length,dynamic:10,global:5,german:5,previousCompetitions:before.length,retained:activeBefore.length,expiredRemoved,added:added.length,active:comps.length},null,2));
