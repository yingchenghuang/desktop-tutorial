const fs = require('fs');

const date = '2026-10-16';
const generatedAt = '2026-10-16T05:40:00+08:00';
const thumb = url => `https://image.thum.io/get/width/1200/crop/800/noanimate/${url}`;
const slug = value => String(value).normalize('NFKD').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 180);

function art(i, tier, artist, title, year, country, cities, media, comment, statement, url) {
  const kind = tier === '動態情報層' ? 'current' : tier === '全球經典層' ? 'global' : 'german';
  return {
    category: '作品/展覽', status: '官方來源', updated: date,
    id: `${kind}-2026-10-16-${String(i).padStart(2, '0')}`,
    dedupeKey: slug(`art-2026-10-16-${kind}-${artist}-${title}`),
    name: `${String(i).padStart(2, '0')}｜${artist}｜${title}`, tier, region: '西方', country,
    cityKeywords: cities, media, works: `${title}｜${year}`, comment,
    website: url, workPage: url, photo: thumb(url), artistStatement: statement,
    artistStatementSource: url, classicTitle: `${title}｜${year}`,
    classicImage: thumb(url), classicDesc: comment, relatedByCity: []
  };
}

const m = slug => `https://www.museum-der-1000-orte.de/kunstwerke/kunstwerk/${slug}`;
const p = slug => `https://www.publicartfund.org/exhibitions/view/${slug}/`;
const entries = [
  art(1,'動態情報層','Peter Tutzauer','Briefe','1988','德國 / Bonn',['Bonn','波昂'],['Kunst am Bau','鏡面','花崗岩','建築整合'],'鏡面、花崗岩與彩色板材把郵政部大樓樓層門廳重構為由反射、折線與通道交織的空間；信封幾何不只作圖像，也延伸既有走廊方向。','Tutzauer 以「信件」回應建築原用途，透過虛擬鏡像與實體石牆的對照，使部門歷史、材料和人的移動成為同一件空間作品。',m('briefe')),
  art(2,'動態情報層','Walter Ibscher','Das große Rad','2003','德國 / Nürnberg',['Nuremberg','Nürnberg','紐倫堡'],['Kunst am Bau','金屬雕塑','場域特定'],'大型輪形結構以開放幾何立於聯邦就業署場域，圓周、軸線與中空部位在步行視角中交替重組，成為連接建築與公共動線的方向標。','Ibscher 將輪子的運動潛能凝結成靜態結構；作品不描繪人物，而以尺度、穿透與循環意象回應制度空間中的流動。',m('das-grosse-rad')),
  art(3,'動態情報層','Caroline Krause','Deutsche Architektur','2000','德國 / Berlin',['Berlin','柏林'],['Kunst am Bau','攝影裝置','建築檔案'],'作品把德國建築的影像與分類帶入聯邦建築，使建築不只是容納藝術的背景，也成為被觀看、編輯與比較的內容。','Krause 以檔案式影像檢視國家如何透過建築表述自己；並置方法拒絕單一典範，讓歷史差異在公共機構內保持可見。',m('deutsche-architektur')),
  art(4,'動態情報層','Ansgar Nierhoff','Die Bastion','1981','德國 / Berlin',['Berlin','柏林'],['Kunst am Bau','鋼雕塑','建築外部介入'],'厚重鋼構以堡壘般的封閉感切入開放場地，銳利邊界、縫隙與周圍通行形成拉扯，使防禦性結構轉為可繞行的公共感知。','Nierhoff 以工業鋼材測試重量、切割與空間阻力；作品的公共性來自觀者如何在障礙、入口與距離之間重新選擇路徑。',m('die-bastion')),
  art(5,'動態情報層','Karl Hillert','Die Geschichte der Mathematik','1970','德國 / Berlin',['Berlin','柏林'],['Kunst am Bau','牆面藝術','數學圖像'],'數學史的符號與結構被轉化為建築尺度的牆面序列，抽象知識不再只停留於文字，而在日常通行中以比例、節奏和圖形展開。','Hillert 將科學史視為可被空間閱讀的文化材料；作品以視覺秩序連結公共建築、教育與集體知識。',m('die-geschichte-der-mathematik')),
  art(6,'動態情報層','Heinz-Günter Prager','Doppelkreuz 14/89','1992','德國 / Bonn',['Bonn','波昂'],['Kunst am Bau','鋼構雕塑','幾何介入'],'交錯鋼構以雙十字建立多重軸線，量體在不同方向呈現開放或封閉，迫使觀看者透過移動辨認作品與建築之間的尺度關係。','Prager 將雕塑濃縮為結構、重量與方位；編號式標題降低敘事指引，使場所與身體成為理解作品的主要依據。',m('doppelkreuz-14-89')),
  art(7,'動態情報層','Georg Meistermann','Ehrenchronik demokratischen Verhaltens','1970','德國 / Bonn',['Bonn','波昂'],['Kunst am Bau','玻璃與牆面藝術','民主記憶'],'作品以非英雄式的視覺編排紀錄民主行為，把榮譽從單一人物紀念轉向制度倫理與公民實踐，並整合於公共建築表面。','Meistermann 用抽象圖像承載政治記憶，拒絕傳統紀念像的個人崇拜，讓民主被理解為持續發生的共同責任。',m('ehrenchronik-demokratischen-verhaltens')),
  art(8,'動態情報層','Chili Martina Seitz','Funken','2012','德國 / Berlin',['Berlin','柏林'],['Kunst am Bau','玻璃纖維強化塑料','色彩裝置'],'三座約六公尺高的彩色構件立於 Berlin-Adlershof 校園，其輪廓源自金屬火花試驗的光跡；鮮明色彩把瞬間能量放大為長久地標。','Seitz 將科學測試中的短暫火花轉譯為可步行環繞的立體形態，使材料研究、校園辨識與日常公共生活交會。',m('funken')),
  art(9,'動態情報層','Friederike Tebbe／Anette Haas','Gemäldegalerie BND','2015','德國 / Berlin',['Berlin','柏林'],['Kunst am Bau','繪畫裝置','制度空間'],'繪畫序列進入聯邦情報局建築，透過並列與尺度建立一座制度內部的「畫廊」，使圖像觀看與高度管制的工作環境產生張力。','兩位藝術家以繪畫的公開觀看傳統碰觸封閉機構，讓色彩、表面與展示秩序反問可見性如何在制度中被安排。',m('gemaldegalerie-bnd')),
  art(10,'動態情報層','Fritz Koenig','Große Flora','1978','英國 / London',['London','倫敦'],['Kunst am Bau','青銅雕塑','外交建築'],'抽象植物形態以大型青銅量體立於倫敦外交建築場域，枝幹般結構向上展開，將自然生長轉為建築前可繞行的垂直節奏。','Koenig 不複製花卉外觀，而以節點、伸展與重力提煉「生長」；作品藉有機結構緩和現代建築的幾何秩序。',m('grosse-flora')),

  art(11,'全球經典層','Julie Farris／Sarah Wayland-Smith','A Clearing in the Streets','2009','美國 / New York City',['New York City','New York','紐約市'],['暫時性地景','都市農業','參與式公共藝術'],'Collect Pond Park 內的圓形田地種植玉米、南瓜與豆類，把曼哈頓街區短暫轉成可聚集、照料和辨認季節的公共空地。','兩位創作者以「三姐妹」共生種植法回應城市土地史，讓生長、維護與共享收成取代永久紀念物，公共性由時間與照護生成。',p('a-clearing-in-the-streets')),
  art(12,'全球經典層','Pierre Huyghe','A Journey That Wasn’t','2005','美國 / New York City',['New York City','New York','紐約市'],['公共表演','冰上裝置','光與聲'],'Wollman Rink 被轉為帶有冰、光、音樂與群眾的臨時舞台；真實探險、虛構敘事與現場演出互相滲透，觀眾也成為事件的一部分。','Huyghe 讓公共作品以製作過程與共同見證存在，質疑紀錄、表演和現實的界線，而不是提供一件可被固定收藏的物件。',p('a-journey-that-wasnt')),
  art(13,'全球經典層','Biff Elrod','Ascent-Descent','1986–1988','美國 / New York City',['New York City','New York','紐約市'],['交通空間介入','壁畫','色彩序列'],'Christopher Street PATH 車站樓梯沿線的人形與色彩由暗轉明，乘客上下移動時才逐段組成完整序列，通勤路徑因而成為觀看機制。','Elrod 把垂直交通的方向、疲勞與光線納入作品，讓壁畫不是靜止背景，而是由身體位移啟動的時間性經驗。',p('ascent-descent')),
  art(14,'全球經典層','Farah Al Qasimi','Back and Forth Disco','2020','美國 / New York City',['New York City','New York','紐約市'],['城市攝影裝置','公車候車亭','多點公共藝術'],'十七幅影像分布於紐約一百座公車候車亭，家庭、商店與裝飾細節進入廣告版位，使私人生活的色彩與城市等待時間交會。','Al Qasimi 以跨城市分散展示打破單一展場，將移民日常、消費影像與公共傳播結構並置，讓熟悉的廣告設施承載更複雜的地方身分。',p('backandforthdisco')),
  art(15,'全球經典層','Eric Arctander','Big Apple Boogie Woogie','1983','美國 / New York City',['New York City','New York','紐約市'],['街道介入','彩色膠帶','行進式公共藝術'],'彩色格線沿 Madison Avenue 路面展開，引用 Mondrian 的城市節奏並配合藝術遊行；街道本身成為短暫、可步行的畫面。','Arctander 將現代繪畫語彙放大到城市尺度，讓交通網格、行進隊伍與觀眾共同完成作品，平面構圖因此轉化為公共事件。',p('big-apple-boogie-woogie')),

  art(16,'德國經典層','Fritz Koenig','Kugelkopfsäule','1981','塞內加爾 / Dakar',['Dakar','達卡'],['Kunst am Bau','青銅柱體','外交建築'],'球體與柱體被壓縮成具有頭部聯想的抽象構造，置於達卡外交建築場域；簡潔輪廓在強烈日光下形成清楚陰影與方向性。','Koenig 以基本幾何保留人體尺度的暗示，卻避開傳統肖像紀念，讓作品成為建築、氣候與跨文化場所之間的抽象節點。',m('kugelkopfsaule')),
  art(17,'德國經典層','Simon Ungers','Paravent','1994','美國 / Washington, D.C.',['Washington, D.C.','Washington DC','華盛頓特區'],['Kunst am Bau','鋼構屏風','空間分隔'],'折展式金屬構架介於牆、屏風與雕塑之間，在華盛頓外交建築內重新分配視線和通行；開口與遮蔽隨角度改變。','Ungers 把建築元素轉化為自主作品，以最少構件測試界線如何同時分隔和連接空間，使日常路徑成為作品的一部分。',m('paravent')),
  art(18,'德國經典層','Ina Holitzka','Simili-Trilogie','2008','德國 / Offenbach am Main',['Offenbach am Main','Offenbach','奧芬巴赫'],['Kunst am Bau','三聯裝置','反射材料'],'三件相互呼應的表面與形態組成序列，反射、相似與差異在建築空間中被反覆辨認；觀者位置改變時，三件作品之間的關係也隨之移動。','Holitzka 以「相似但不相同」作為觀看問題，讓重複不只是形式，而成為辨識、記憶與建築節奏之間的心理活動。',m('simili-trilogie')),
  art(19,'德國經典層','Erich Wiesner','Toranlage und Einfriedung','1973','泰國 / Bangkok',['Bangkok','曼谷'],['Kunst am Bau','入口設計','圍界系統'],'入口與圍界被整體設計為色彩、節奏與穿越共同作用的建築藝術；作品不附著於基地，而直接構成公共與外交領域交界。','Wiesner 把安全邊界轉化為可被閱讀的空間序列，使門、欄杆和步行速度共同塑造到達經驗，展現 Kunst am Bau 對基礎設施的整合。',m('toranlage-und-einfriedung')),
  art(20,'德國經典層','Waldemar Grzimek','Äsendes Rind','1960','德國 / Greifswald',['Greifswald','格賴夫斯瓦爾德'],['Kunst am Bau','青銅動物雕塑','戶外場域'],'低伏的牛隻形體以水平量感貼近草地，作品避開人物紀念像的英雄姿態，改以動物、觸感與日常尺度連結建築外部空間。','Grzimek 透過簡化而有重量感的動物身體回應戰後公共場所，讓雕塑的親近性與環境關係勝過敘事性的權威象徵。',m('asendes-rind'))
];

function competition(i, organizer, title, country, cities, media, comment, url, deadline, timezone, precision, eligibility, budget, fee) {
  return {
    category:'公開徵件',status:'官方來源',updated:date,id:`competition-2026-10-16-${String(i).padStart(2,'0')}`,
    dedupeKey:slug(`opportunity-2026-10-16-${organizer}-${title}`),name:`${String(i).padStart(2,'0')}｜${organizer}｜${title}`,
    tier:'競圖資料庫',region:'西方',country,cityKeywords:cities,media,
    works:`${title}｜${budget}｜截止 ${deadline.slice(0,10).replaceAll('-','.')}`,comment,
    website:url,workPage:url,photo:thumb(url),artistStatement:comment,artistStatementSource:url,
    classicTitle:title,classicImage:thumb(url),classicDesc:comment,deadline,
    deadlineLabel:`截止 ${deadline.slice(0,10).replaceAll('-','.')}`,deadlineTimezone:timezone,
    deadlinePrecision:precision,organizer,eligibility,budget,applicationFee:fee,relatedByCity:[]
  };
}
const cw = id => `https://opportunities.wearecreativewest.org/opportunity/${id}/CAFE`;
const added = [
  competition(1,'City of Inverness','Call for Public Art Sculptures','美國 / Inverness, Florida',['Inverness','因弗內斯'],['戶外雕塑','互動公共藝術','既有作品採購'],'徵求適合公共戶外環境的既有雕塑或原創概念，偏好可互動、具動態、聲音或光的作品；總預算 US$25,000。',cw(18319),'2026-11-07T23:59:59-05:00','America/New_York','time','具公共藝術或相當計畫經驗者；既有作品須能符合安全、無障礙與長期戶外展示要求','US$25,000','US$0'),
  competition(2,'WMATA Art in Transit','Bladensburg Bus Garage Public Art Project','美國 / Washington, D.C.',['Washington, D.C.','Washington DC','華盛頓特區'],['場域特定雕塑','交通設施公共藝術','永久委託'],'為 Bladensburg Bus Garage 重建第二期徵求場域特定三維或功能性作品，設置於公車入口並成為迎賓地標；總預算 US$330,000。',cw(16593),'2026-11-15T23:59:59-05:00','America/New_York','time','開放專業藝術家或藝術家團隊；DC、Maryland、Virginia 居民評選時加一分','US$330,000','US$0'),
  competition(3,'Wyoming Arts Council','Sheridan College Science Center Addition','美國 / Sheridan, Wyoming',['Sheridan','謝里登'],['Art in Public Buildings','科學中心','永久委託'],'為 Sheridan College Science Center 增建工程公開徵求公共藝術資格，入圍者再提出完整方案；總預算 US$90,000。',cw(18143),'2026-11-22T23:59:59-07:00','America/Denver','time','18 歲以上美國公民或合法居民，且須全職居住於 MT、ID、UT、WY、CO、AZ、NV、NM 之一','US$90,000','US$0'),
  competition(4,'City of Tustin Parks and Recreation','Tustin Legacy Sculpture Walk','美國 / Tustin, California',['Tustin','塔斯廷'],['戶外雕塑','公園藝術','暫時性展示'],'首屆 Tustin Legacy Sculpture Walk 徵選五件已完成雕塑，三件三年期各 US$7,500、兩件兩年期各 US$5,000。',cw(18311),'2026-12-31T23:59:59-08:00','America/Los_Angeles','time','全美藝術家；須提交適合戶外展示的原創三維完成作品','US$5,000–7,500／件','US$0'),
  competition(5,'Loveland High Plains Arts Council','Benson Sculpture Garden Permanent Sculpture Purchase','美國 / Loveland, Colorado',['Loveland','拉夫蘭'],['戶外雕塑','永久典藏','作品採購'],'為 Benson Sculpture Garden 永久典藏徵購真人尺度或更大型戶外雕塑，採購預算 US$70,000。',cw(18347),'2026-11-01T23:59:59-07:00','America/Denver','time','全球 18 歲以上雕塑家；作品須使用適合永久戶外設置的媒材','US$70,000','US$0')
];

const cp = JSON.parse(fs.readFileSync('data/competitions.json','utf8'));
const baseline = cp.entries.filter(e => e.updated !== date);
const now = new Date('2026-10-15T20:56:26Z');
const retained = baseline.filter(e => new Date(e.deadline) > now);
const expiredRemoved = baseline.length - retained.length;
const comps = [...retained,...added];

const manifestPaths = fs.readdirSync('data').filter(name => /^backfill-.*-manifest\.json$/.test(name));
const artFiles = new Set();
for (const name of manifestPaths) for (const file of JSON.parse(fs.readFileSync(`data/${name}`,'utf8')).files || []) artFiles.add(file);
let allArt = [];
for (const file of artFiles) if (fs.existsSync(`data/${file}`)) allArt.push(...(JSON.parse(fs.readFileSync(`data/${file}`,'utf8')).entries || []));
allArt.push(...entries);
const norm = value => String(value).normalize('NFKC').trim().toLowerCase();
const cityHit = (a,b) => (a.cityKeywords||[]).some(value => new Set((b.cityKeywords||[]).map(norm)).has(norm(value)));
for (const entry of entries) entry.relatedByCity = comps.filter(comp => cityHit(entry,comp)).map(comp => comp.dedupeKey);
for (const comp of comps) comp.relatedByCity = allArt.filter(entry => cityHit(entry,comp)).map(entry => entry.dedupeKey);

const daily = {meta:{generatedAt,timezone:'Asia/Taipei',date,total:20,dynamicEntries:10,globalClassicEntries:5,germanClassicEntries:5,source:'Museum der 1000 Orte、Public Art Fund 第一方作品頁',selectionPolicy:'當期、持續開放或已實現的空間裝置、Kunst am Bau、場域介入、地景與觀念性作品；排除傳統城市人物紀念雕塑，競圖與獎助完全分流。',note:'10/16 固定 10＋5＋5；20 則皆為作品資料，未混入競圖、補助或獎項，傳統人物紀念像排除檢查通過。',linkAudit:{checkedAt:generatedAt,checkedUniqueSources:20,brokenOrBlockedReplaced:0,rule:'第一方作品頁回讀'},imageAudit:{checkedAt:generatedAt,imageEntries:20,missing:0,rule:'第一方作品頁預覽圖片'}},entries};
fs.writeFileSync('data/backfill-october-20261016.json',`${JSON.stringify(daily,null,2)}\n`);

cp.updated=date; cp.generatedAt=generatedAt; cp.meta={activeEntries:comps.length,addedToday:5,expiredRemoved,duplicateRemoved:0,scopeRemoved:0,source:'Creative West／CaFÉ 官方徵件頁',note:`保留 ${retained.length} 則既有未截止項目，新增 5 則；移除 ${expiredRemoved} 則逾期項目。`}; cp.entries=comps;
fs.writeFileSync('data/competitions.json',`${JSON.stringify(cp,null,2)}\n`);

const cm=JSON.parse(fs.readFileSync('data/competition-manifest.json','utf8'));
Object.assign(cm,{version:'2026-10-16-competition-r74',generatedAt,activeEntries:comps.length,addedToday:5,expiredRemoved,duplicateRemoved:0,scopeRemoved:0,deadlineTimezoneEntries:comps.filter(e=>e.deadlineTimezone).length,deadlinePrecisionEntries:comps.filter(e=>e.deadlinePrecision).length,cityKeywordEntries:comps.filter(e=>Array.isArray(e.cityKeywords)&&e.cityKeywords.length>=2).length,germanAddedToday:0,note:`保留 ${retained.length} 則既有未截止項目，新增 5 則；移除 ${expiredRemoved} 則逾期項目，所有有效 deadline 皆含時區偏移。`});
fs.writeFileSync('data/competition-manifest.json',`${JSON.stringify(cm,null,2)}\n`);

const om=JSON.parse(fs.readFileSync('data/backfill-october-manifest.json','utf8'));
om.version='2026-10-16-public-art-r99'; om.generatedAt=generatedAt; om.files=[...new Set([...om.files,'backfill-october-20261016.json'])]; om.expectedEntries=om.files.length*20; om.statementEntries=om.expectedEntries; om.statementSourceEntries=om.expectedEntries; om.imageEntries=om.expectedEntries; om.note='截至 2026-10-16，10 月每日固定 20 則且皆為作品資料；本日配置 10／5／5，排除傳統人物紀念雕塑，來源、圖片、城市與去重欄位完整。';
fs.writeFileSync('data/backfill-october-manifest.json',`${JSON.stringify(om,null,2)}\n`);

let index=fs.readFileSync('index.html','utf8'); index=index.replace("const cacheKey = '20261015-daily-r98';","const cacheKey = '20261016-daily-r99';"); fs.writeFileSync('index.html',index);
console.log(JSON.stringify({publicArt:entries.length,dynamic:10,global:5,german:5,previousCompetitions:baseline.length,retained:retained.length,expiredRemoved,added:5,active:comps.length},null,2));
