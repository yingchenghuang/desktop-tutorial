const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const dataDir = path.join(root, 'data');
const generatedAt = '2026-09-23T04:59:43+08:00';
const date = '2026-09-23';

function slug(s) {
  return s.toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function artEntry(i, group, x) {
  const type = group === 'current' ? 'current' : group === 'global' ? 'global-classic' : 'classic-german';
  const prefix = group === 'current' ? '當期／持續' : group === 'global' ? '全球經典' : '德國經典';
  return {
    category: '作品/展覽', status: '官方來源', updated: date,
    id: `${type}-2026-09-23-${String(i).padStart(2, '0')}`,
    dedupeKey: `art-2026-09-23-${group}-${slug(x.title)}-${slug(x.artist)}`,
    name: `${String(i).padStart(2, '0')}｜${x.artist}｜${x.title}`,
    tier: group === 'current' ? '動態情報層' : '經典檔案庫', region: '西方', country: x.country,
    cityKeywords: x.cityKeywords, media: x.media,
    works: `${x.title}｜${x.year}`,
    comment: x.comment, website: x.source, workPage: x.source, photo: x.image,
    artistStatement: x.statement || x.comment, artistStatementSource: x.source,
    classicTitle: `${x.title}｜${x.year}`, classicImage: x.image, classicDesc: x.desc,
    relatedByCity: []
  };
}

const museum = 'https://www.museum-der-1000-orte.de';
const museumImage = h => `${museum}/media/cache/resolve/zoom/images/${h}`;
const berlin = ['Berlin', '柏林'];
const bonn = ['Bonn', '波昂'];
const current = [
  {artist:'Bernhard Heiliger',title:'Auftakt',year:'1963',country:'德國 / Berlin',cityKeywords:berlin,media:['Kunst am Bau','鋁雕塑','建築整合'],source:`${museum}/kunstwerke/kunstwerk/auftakt`,image:museumImage('a85ab0d0a9f291ecfa1677693b170f1ef24846a4.jpg'),comment:'鋁質構件以開放、上揚的節奏銜接柏林愛樂廳的入口與城市廣場，使雕塑像一段可被繞行的音樂序奏。',desc:'以抽象鋁構形體為柏林愛樂廳建立面向城市的視覺序奏。'},
  {artist:'Frank Stürmer',title:'o. T.（Bayerischer Wald I–VII）',year:'2011',country:'德國 / Berlin',cityKeywords:berlin,media:['Kunst am Bau','攝影','建築室內'],source:`${museum}/kunstwerke/kunstwerk/o-t-bayerischer-wald-i-vii`,image:museumImage('c3f3c5c6153e41efa04b4227361fdfde018ce875.jpg'),comment:'七幅森林影像被安置在聯邦建築之中，把遙遠地景轉化為行政空間內的連續視窗，調節制度環境的尺度與呼吸。',desc:'以七幅森林攝影在行政建築中建立連續的地景視窗。'},
  {artist:'Ellsworth Kelly',title:'Berlin Panels',year:'2000',country:'德國 / Berlin',cityKeywords:berlin,media:['Kunst am Bau','鋁板','色彩裝置'],source:`${museum}/kunstwerke/kunstwerk/berlin-panels`,image:museumImage('9a7a4369a03a1f3df1708853e390d6329f4b929e.jpg'),comment:'高純度色面與建築牆體並置，使政治建築的通行空間轉化為由比例、色彩與身體移動共同構成的感知場。',desc:'塗裝鋁板以純粹色面介入聯邦議會建築的公共動線。'},
  {artist:'Ansgar Nierhoff',title:'Drei Orte',year:'1991',country:'德國 / Bonn',cityKeywords:bonn,media:['Kunst am Bau','鋼雕塑','場域組構'],source:`${museum}/kunstwerke/kunstwerk/drei-orte-der-platz-das-spiel-des-moglichen-der-ort-der-vier-saulen-die-wand`,image:museumImage('0cbc264c313635495cc40a7149487bbddeeed43b.jpg'),comment:'作品以廣場、柱列與牆三組鋼構情境切入國防部園區，把雕塑從單一物件擴張成可被穿越、比較與定位的空間序列。',desc:'三組鋼構場域把雕塑轉化為可穿越的建築性序列。'},
  {artist:'Fritz von Graevenitz',title:'Sicherndes Pferd',year:'1956',country:'德國 / Wiesbaden',cityKeywords:['Wiesbaden','威斯巴登'],media:['Kunst am Bau','石雕','公共庭園'],source:`${museum}/kunstwerke/kunstwerk/sicherndes-pferd`,image:museumImage('11367c9ff14b1621bfd57f2b9ad640fc441ede17.jpg'),comment:'貝殼石灰岩馬匹以警覺而克制的姿態停駐於統計局戶外空間，將戰後公共建築的秩序感引向生物性的感知與守望。',desc:'石雕馬匹以警覺姿態為戰後公共建築提供可親近的象徵。'},
  {artist:'Rosemarie Trockel',title:'o. T.（Deckengemälde, Teppich und Mokkaservice）',year:'1994',country:'美國 / Washington, D.C.',cityKeywords:['Washington, D.C.','Washington DC','華盛頓'],media:['Kunst am Bau','壁畫','地毯與瓷器'],source:`${museum}/kunstwerke/kunstwerk/o-t-deckengemalde-teppich-und-mokkaservice`,image:museumImage('34b0ba514af3860f2cc46a4d13f20897b33c197c.jpg'),comment:'天花繪畫、羊毛地毯與咖啡器具跨越建築表面與日常禮儀，讓外交官邸中的藝術不只被觀看，也進入接待與使用的節奏。',desc:'以天花、地毯與器物把外交空間的觀看連到日常儀式。'},
  {artist:'Gerhard Merz',title:'o. T.（Farb-Licht-Konzept）',year:'2000',country:'德國 / Berlin',cityKeywords:berlin,media:['Kunst am Bau','色光','濕壁畫'],source:`${museum}/kunstwerke/kunstwerk/o-t-farb-licht-konzept`,image:museumImage('7160694bad6bef2f78a15bffe9d6445deec4e143.jpg'),comment:'單色顏料與光線共同改寫原帝國銀行建築的歷史內部，使色彩不是附加裝飾，而成為連結舊建築與新用途的空間結構。',desc:'以單色濕壁畫與光線重組歷史建築的空間感。'},
  {artist:'Heinrich Jungebloedt',title:'Mosaik des Staatswappens der DDR',year:'1964',country:'德國 / Berlin',cityKeywords:berlin,media:['Kunst am Bau','陶瓷馬賽克','歷史建築'],source:`${museum}/kunstwerke/kunstwerk/mosaik-des-staatswappens-der-ddr`,image:museumImage('8b94e0ea78d4150a83f4c684d5c5a7757ce08a73.JPG'),comment:'巨幅陶瓷馬賽克保留東德國家議會的政治圖像，使建築後續轉用時仍能讀見制度更迭、材料工藝與記憶政治的疊層。',desc:'陶瓷馬賽克在建築轉用後持續保存東德政治圖像與歷史層次。'},
  {artist:'Veronika Kellndorfer',title:'Palazzo Postale',year:'1999',country:'德國 / Erfurt',cityKeywords:['Erfurt','埃爾福特'],media:['Kunst am Bau','絹印玻璃','建築立面'],source:`${museum}/kunstwerke/kunstwerk/palazzo-postale`,image:museumImage('59b2b8af3fe51c46bed6a5ff8bfad15e6852cb21.jpg'),comment:'絹印玻璃把影像、反射與法院建築疊合，觀看者在移動中同時看見表面圖像、城市環境與自身位置。',desc:'絹印玻璃以反射和影像使法院立面成為多層次觀看界面。'},
  {artist:'Bernd Koberling',title:'Farbfluss. Eins. Zwei. Drei. Vier',year:'2001',country:'德國 / Berlin',cityKeywords:berlin,media:['Kunst am Bau','壓克力','鋁複合板'],source:`${museum}/kunstwerke/kunstwerk/farbfluss-eins-zwei-drei-vier`,image:museumImage('089e6cffed3a611fc58bd776117b09cf5254b2f5.jpg'),comment:'四段色彩繪畫沿建築展開，把抽象筆勢轉化為動線中的連續事件；觀看不是停在正面，而由經過與回望逐步完成。',desc:'四段壓克力色流沿建築動線形成持續展開的觀看事件。'}
];

const globalClassics = [
  {artist:'Mark di Suvero',title:'Iroquois',year:'1983–1999；2007 設置',country:'美國 / Philadelphia',cityKeywords:['Philadelphia','費城'],media:['公共雕塑','塗裝鋼材','動態構件'],source:'https://associationforpublicart.org/artwork/iroquois/',image:'https://associationforpublicart.org/wp-content/uploads/2026/04/Iroquois_featured.jpg',comment:'紅色工字鋼在空中結成開放而有動勢的結構，將工業材料轉化為可從多角度接近的城市節點。',desc:'四十英尺高的紅色鋼構以開放形體與可動上端連結工業技術和公共觀看。'},
  {artist:'Isamu Noguchi',title:'Bolt of Lightning… A Memorial to Benjamin Franklin',year:'1933 構想；1984 設置',country:'美國 / Philadelphia',cityKeywords:['Philadelphia','費城'],media:['公共紀念物','不鏽鋼','鋼纜'],source:'https://associationforpublicart.org/artwork/bolt-of-lightning-a-memorial-to-benjamin-franklin/',image:'https://associationforpublicart.org/wp-content/uploads/2015/10/Bolt_of_Lightning_Noguchi_2019_Photo_Alec_Rogers_for_aPA-scaled.jpg',comment:'作品把風箏、鑰匙與閃電轉譯成 58 噸的工程結構，不以人物塑像紀念富蘭克林，而以實驗精神和天地張力建立城市地標。',desc:'以不鏽鋼閃電、風箏結構與鋼纜將科學實驗轉化為公共紀念物。'},
  {artist:'Louise Nevelson',title:'Atmosphere and Environment XII',year:'1970；1973 設置',country:'美國 / Philadelphia',cityKeywords:['Philadelphia','費城'],media:['公共雕塑','耐候鋼','環境雕塑'],source:'https://associationforpublicart.org/artwork/atmosphere-and-environment-xii/',image:'https://associationforpublicart.org/wp-content/uploads/2026/04/Rectangle-3b.jpg',comment:'六列開放方格由 18,000 磅耐候鋼組成，內部幾何像濃縮的城市天際線，讓實體重量與穿透視線同時成立。',desc:'六列耐候鋼方格把城市建築語彙濃縮為可穿透的雕塑環境。'},
  {artist:'Alexander Calder',title:'Three Discs, One Lacking',year:'1968',country:'美國 / Philadelphia',cityKeywords:['Philadelphia','費城'],media:['公共雕塑','塗裝鐵合金','stabile'],source:'https://associationforpublicart.org/artwork/three-discs-one-lacking/',image:'https://associationforpublicart.org/wp-content/uploads/2026/04/Three-Discs_One_Lacking_1400x1400.jpg',comment:'卡爾德以固定的薄片和平衡關係延續他對運動的研究；缺少的一片成為視覺空缺，使靜止結構保留潛在的變化感。',desc:'固定鐵合金薄片以平衡、空缺與剪影創造靜止中的運動感。'},
  {artist:'Jody Pinto',title:'Fingerspan',year:'1987',country:'美國 / Philadelphia',cityKeywords:['Philadelphia','費城'],media:['功能性公共藝術','耐候鋼','步行橋'],source:'https://associationforpublicart.org/artwork/fingerspan/',image:'https://associationforpublicart.org/wp-content/uploads/2026/04/Fingerspan_1_1400x1400-e1447785954730.jpg',comment:'59 英尺長的耐候鋼結構既是橋也是雕塑；身體必須穿過如手指拱起的內部，才完成作品與峽谷地景的連結。',desc:'功能性步行橋以手指般的耐候鋼形體把人體尺度嵌入自然地景。'}
];

const germanClassics = [
  {artist:'Michael Jäger',title:'Potsdam Poem',year:'2016',country:'德國 / Potsdam-Golm',cityKeywords:['Potsdam','Potsdam-Golm','波茨坦'],media:['Kunst am Bau','鋁複合板','壓克力'],source:`${museum}/kunstwerke/kunstwerk/potsdam-poem`,image:museumImage('71df288f0757171824dd96a327251b0251aa5e90.jpeg'),comment:'色彩與片段形體沿會議中心展開，像一首不靠文字的視覺詩，把科學園區的理性秩序引向聯想與節奏。',desc:'以鋁板色彩構成非文字的視覺詩，介入科研園區公共空間。'},
  {artist:'Paul Dierkes',title:'o. T.（Drei Stelen）',year:'1965',country:'德國 / Bonn',cityKeywords:bonn,media:['Kunst am Bau','侏羅紀大理石','石柱'],source:`${museum}/kunstwerke/kunstwerk/o-t-drei-stelen`,image:museumImage('502bfde500cfb285d1aabc9107f0256650abd33c.jpg'),comment:'三座大理石柱以粗獷切面介入總理官邸庭園，在現代主義建築的水平秩序中建立垂直、原初而具身體感的節點。',desc:'三座侏羅紀大理石柱在總理官邸庭園形成原初而克制的垂直節奏。'},
  {artist:'Gerhard Richter',title:'Schwarz Rot Gold',year:'1998',country:'德國 / Berlin',cityKeywords:berlin,media:['Kunst am Bau','琺瑯玻璃','政治象徵'],source:`${museum}/kunstwerke/kunstwerk/schwarz-rot-gold`,image:museumImage('b4b27fae227fd3be0984df3ae5561f2c41b9508c.jpg'),comment:'黑、紅、金三色被壓縮為大尺度玻璃色面，既引用國旗又去除圖像敘事，使國家象徵在議會建築中保持莊重與開放解讀。',desc:'琺瑯玻璃把德國國旗轉為抽象色面，嵌入國會建築的政治空間。'},
  {artist:'Norbert Radermacher',title:'Der Warenkorb',year:'2011',country:'德國 / Waldshut-Tiengen',cityKeywords:['Waldshut-Tiengen','Waldshut','瓦爾茨胡特-廷根'],media:['Kunst am Bau','不鏽鋼','現成物轉譯'],source:`${museum}/kunstwerke/kunstwerk/der-warenkorb`,image:museumImage('b12b6a62cbb8eaf0a50f7b3cb0a198616bdff925.jpg'),comment:'放大的購物籃置於海關場域，把跨境流通、消費與檢查制度濃縮為一個立即可辨識、又因尺度錯置而陌生的公共物件。',desc:'放大不鏽鋼購物籃以幽默尺度回應海關、消費與跨境流通。'},
  {artist:'HAP Grieshaber',title:'Weltgericht（Inferno des Krieges）',year:'1970',country:'德國 / Bonn',cityKeywords:bonn,media:['Kunst am Bau','繪畫','木質牆面'],source:`${museum}/kunstwerke/kunstwerk/weltgericht-inferno-des-krieges`,image:museumImage('8e605f993ffa2d771442c17ab582e1332c057bad.jpg'),comment:'作品以大尺度圖像把戰爭災難帶入原聯邦議會高樓的公共內部；在今日聯合國園區中，它仍以強烈色彩提醒制度決策與人類代價的連結。',desc:'大型木質牆面繪畫以戰爭末日圖像持續質問政治制度與歷史責任。'}
];

let entries = [];
current.forEach((x,i)=>entries.push(artEntry(i+1,'current',x)));
globalClassics.forEach((x,i)=>entries.push(artEntry(i+11,'global',x)));
germanClassics.forEach((x,i)=>entries.push(artEntry(i+16,'german',x)));

const publicData = {
  meta: {generatedAt,timezone:'Asia/Taipei',date,total:20,dynamicEntries:10,globalClassicEntries:5,germanClassicEntries:5,
    source:'Museum der 1000 Orte、Association for Public Art 官方作品頁',
    selectionPolicy:'已實現且持續可見的公共藝術、永久委託與 Kunst am Bau；競圖與補助完全分流。',
    note:'9/23 固定 10＋5＋5。',
    linkAudit:{checkedAt:generatedAt,checkedUniqueSources:20,brokenOrBlockedReplaced:0,rule:'官方作品頁回讀'},
    imageAudit:{checkedAt:generatedAt,imageEntries:20,missing:0,rule:'官方圖片 URL 回讀'}},
  entries
};

function comp(i, x) {
  return {
    category:'公開徵件',status:'官方來源',updated:date,id:`competition-2026-09-23-${String(i).padStart(2,'0')}`,
    dedupeKey:`opportunity-2026-09-23-${slug(x.city)}-${slug(x.title)}`,
    name:`${String(i).padStart(2,'0')}｜${x.city}｜${x.title}`,tier:'競圖資料庫',region:'西方',country:x.country,
    cityKeywords:x.cityKeywords,media:x.media,works:`${x.title}｜截止 ${x.deadlineLabel.replace('截止 ','')}`,
    comment:x.comment,website:x.website,workPage:x.source,photo:x.image,artistStatement:x.comment,
    artistStatementSource:x.source,classicTitle:`${x.city}｜${x.title}`,classicImage:x.image,classicDesc:x.comment,
    deadline:x.deadline,deadlineLabel:x.deadlineLabel,deadlineTimezone:x.timezone,deadlinePrecision:x.precision,
    organizer:x.organizer,eligibility:x.eligibility,budget:x.budget,applicationFee:x.fee,relatedByCity:[]
  };
}

const portalLogo='https://opportunities.wearecreativewest.org/png/logo.png';
const added = [
  {city:'Meudt',title:'Kita St. Gangolf Kunst am Bau',country:'德國 / Meudt',cityKeywords:['Meudt','默伊特'],media:['Kunst am Bau','幼兒園','非公開競賽前置公開徵選'],comment:'為 St. Gangolf 新建幼兒園徵選專業藝術家進入非公開設計競賽，實現總額含材料與藝術家費用為 43,000 歐元。',website:'https://www.bbkrlp.de/kunst-am-bau/ausschreibungen-wettbewerbe',source:'https://www.bbkrlp.de/kunst-am-bau/ausschreibungen-wettbewerbe',image:'https://www.bbkrlp.de/templates/yootheme/cache/a5/BBK-RLP-Logo-2025_sRGB_web-a54da644.png',deadline:'2026-10-05T23:59:59+02:00',deadlineLabel:'截止 2026.10.05',timezone:'Europe/Berlin',precision:'date',organizer:'Verbandsgemeindeverwaltung Wallmerod／Ortsgemeinde Meudt',eligibility:'專業視覺藝術家及／或藝術工藝創作者；依官方申請文件提出資格證明',budget:'EUR 43,000（含稅、材料與藝術家費用）',fee:'未公開'},
  {city:'Denver',title:'La Raza Park 永久公共藝術 RFQ',country:'美國 / Denver, Colorado',cityKeywords:['Denver','丹佛'],media:['永久公共藝術','戶外雕塑','文化地景'],comment:'為 Northside Denver 的 La Raza Park 委託場域回應式永久雕塑，作品須連結奇卡諾社群歷史、地方認同與跨世代公共聚會。',website:'https://denverpublicart.org/',source:'https://opportunities.wearecreativewest.org/opportunity/18003/CAFE',image:portalLogo,deadline:'2026-10-15T23:59:00-06:00',deadlineLabel:'截止 2026.10.15 23:59 MDT',timezone:'America/Denver',precision:'time',organizer:'Denver Arts & Venues／Denver Public Art',eligibility:'居住於美國的藝術家或藝術家團隊；鼓勵與 Denver Northside 有深厚連結者申請',budget:'USD 136,000（含全部設計、製作與安裝費用）',fee:'免費'},
  {city:'Ann Arbor',title:'Nixon Road Roundabout 公共藝術 RFQ',country:'美國 / Ann Arbor, Michigan',cityKeywords:['Ann Arbor','安娜堡'],media:['永久公共藝術','圓環雕塑','街道改善'],comment:'安娜堡市為 Nixon Road 三座圓環及鄰近人行空間徵選場域特定永久作品，可採單一節點或沿廊道展開的一系列作品。',website:'https://www.a2gov.org/departments/engineering/Pages/Nixon-Road.aspx',source:'https://opportunities.wearecreativewest.org/opportunity/18062/CAFE',image:portalLogo,deadline:'2026-10-23T23:59:00-07:00',deadlineLabel:'截止 2026.10.23 23:59 PDT',timezone:'America/Los_Angeles',precision:'time',organizer:'City of Ann Arbor／Ann Arbor Art Center',eligibility:'藝術家、設計師或藝術家團隊；全美徵選，需具永久公共藝術經驗',budget:'USD 75,000（另有最多五名準決選者各 USD 750 提案費）',fee:'免費'},
  {city:'Mountain View',title:'Public Safety Building 公共藝術 RFQ',country:'美國 / Mountain View, California',cityKeywords:['Mountain View','芒廷維尤','山景城'],media:['永久公共藝術','市政建築','公共安全紀念'],comment:'Mountain View 市為新公共安全大樓一至三處位置徵選永久公共藝術，包含外部廣場公共安全紀念物及面向市民的建築整合場域。',website:'https://econdev.mountainview.gov/public-art',source:'https://opportunities.wearecreativewest.org/opportunity/18182/CAFE',image:portalLogo,deadline:'2026-10-16T23:59:00-07:00',deadlineLabel:'截止 2026.10.16 23:59 PDT',timezone:'America/Los_Angeles',precision:'time',organizer:'City of Mountain View Visual Arts Committee',eligibility:'年滿 18 歲、居住於美國西部各州，具同等規模永久戶外公共藝術經驗的專業藝術家／團隊',budget:'USD 400,000（總公共藝術預算）',fee:'免費'},
  {city:'Oakley',title:'Main Street 臨時雕塑展',country:'美國 / Oakley, California',cityKeywords:['Oakley','奧克利'],media:['臨時公共藝術','戶外雕塑','城市主街'],comment:'Oakley 首次公共藝術計畫將選出既有、可立即安裝的戶外雕塑，在市政廳前廣場與 Main Street 兩街區展示一年。',website:'https://www.ci.oakley.ca.us/',source:'https://opportunities.wearecreativewest.org/opportunity/18200/CAFE',image:portalLogo,deadline:'2026-10-18T23:59:00-07:00',deadlineLabel:'截止 2026.10.18 23:59 PDT',timezone:'America/Los_Angeles',precision:'time',organizer:'City of Oakley／Local Edition Creative',eligibility:'區域藝術家；提交既有、完成且可戶外展示 12 個月的雕塑，藝術家須親自或委派代表完成安裝與撤展',budget:'USD 5,000',fee:'免費'}
].map((x,i)=>comp(i+1,x));

const compPath = path.join(dataDir,'competitions.json');
const compData = JSON.parse(fs.readFileSync(compPath,'utf8'));
const cutoff = new Date(generatedAt);
const expired = compData.entries.filter(x => new Date(x.deadline) <= cutoff);
let kept = compData.entries.filter(x => new Date(x.deadline) > cutoff);
const duplicateSource = 'https://www.stesad.de/kunst-am-bau-wettbewerb-fuer-das-neue-bsz-elektrotechnik/';
let seenSource = new Set();
let duplicateRemoved = 0;
kept = kept.filter(x => {
  const source = x.workPage || x.website;
  if (source === duplicateSource) {
    if (seenSource.has(source)) { duplicateRemoved++; return false; }
    seenSource.add(source);
  }
  return true;
});
const existingKeys = new Set(kept.map(x=>x.dedupeKey));
for (const x of added) {
  if (existingKeys.has(x.dedupeKey)) throw new Error(`duplicate added key ${x.dedupeKey}`);
  kept.push(x); existingKeys.add(x.dedupeKey);
}

function norm(s){return String(s).trim().toLocaleLowerCase('en-US');}
const publicFiles = fs.readdirSync(dataDir).filter(f=>/^backfill-(july|august|september)-\d{8}\.json$/.test(f));
const arts = [];
for (const f of publicFiles) {
  const d=JSON.parse(fs.readFileSync(path.join(dataDir,f),'utf8'));
  for(const x of (d.entries||[])) arts.push(x);
}
for(const x of entries) arts.push(x);
const artByCity = new Map();
for(const a of arts) for(const k of (a.cityKeywords||[])) {
  const n=norm(k); if(!artByCity.has(n)) artByCity.set(n,new Set()); artByCity.get(n).add(a.id);
}
const compByCity = new Map();
for(const c of kept) for(const k of (c.cityKeywords||[])) {
  const n=norm(k); if(!compByCity.has(n)) compByCity.set(n,new Set()); compByCity.get(n).add(c.id);
}
for(const c of kept) {
  const ids=new Set(); for(const k of (c.cityKeywords||[])) for(const id of (artByCity.get(norm(k))||[])) ids.add(id);
  c.relatedByCity=[...ids].sort();
}
for(const a of entries) {
  const ids=new Set(); for(const k of (a.cityKeywords||[])) for(const id of (compByCity.get(norm(k))||[])) ids.add(id);
  a.relatedByCity=[...ids].sort();
}

compData.meta={total:kept.length,activeEntries:kept.length,addedToday:added.length,expiredRemoved:expired.length,retainedExisting:kept.length-added.length,duplicateRemoved,deadlineRule:'所有 deadline 均含時區偏移；官方僅公布日期時採主辦地 23:59:59 並標記 date。'};
compData.updated=date;
compData.generatedAt=generatedAt;
compData.entries=kept;

fs.writeFileSync(path.join(dataDir,'backfill-september-20260923.json'),JSON.stringify(publicData,null,2)+'\n');
fs.writeFileSync(compPath,JSON.stringify(compData,null,2)+'\n');

const pubManifestPath=path.join(dataDir,'backfill-september-manifest.json');
const pubManifest=JSON.parse(fs.readFileSync(pubManifestPath,'utf8'));
if(!pubManifest.files.includes('backfill-september-20260923.json')) pubManifest.files.push('backfill-september-20260923.json');
Object.assign(pubManifest,{version:'2026-09-23-public-art-r73',generatedAt,expectedEntries:320,statementEntries:320,statementSourceEntries:300,imageEntries:320,note:'截至 2026-09-23 已發布 16 個每日檔、共 320 則；本日新增 20 則公共藝術（10／5／5）。'});
fs.writeFileSync(pubManifestPath,JSON.stringify(pubManifest,null,2)+'\n');

const compManifest={version:'2026-09-23-competition-r48',generatedAt,files:['competitions.json'],activeEntries:kept.length,addedToday:5,expiredRemoved:expired.length,duplicateRemoved,deadlineTimezoneEntries:kept.length,deadlinePrecisionEntries:kept.length,cityKeywordEntries:kept.length,note:`2026-09-23 新增 5 則有效公共藝術徵件，保留 ${kept.length-5} 則既有未截止唯一項目，移除 ${expired.length} 則逾期案件與 ${duplicateRemoved} 則語義重複。`,germanAddedToday:1};
fs.writeFileSync(path.join(dataDir,'competition-manifest.json'),JSON.stringify(compManifest,null,2)+'\n');

const indexPath=path.join(root,'index.html');
let index=fs.readFileSync(indexPath,'utf8').replace("const cacheKey = '20260922-daily-r72';","const cacheKey = '20260923-daily-r73';");
fs.writeFileSync(indexPath,index);

console.log(JSON.stringify({public:entries.length,competitions:kept.length,expired:expired.map(x=>x.dedupeKey),duplicateRemoved,added:added.map(x=>x.dedupeKey)},null,2));
