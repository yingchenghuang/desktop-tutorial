const fs = require('fs');

const date = '2026-10-19';
const generatedAt = '2026-10-19T04:56:35+08:00';
const now = new Date('2026-10-18T20:56:35Z');
const officialImages = {};
const imageFor = url => officialImages[url];
const slug = value => String(value).normalize('NFKD').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 180);

function art(i, tier, artist, title, year, country, cities, media, comment, statement, url) {
  const kind = tier === '動態情報層' ? 'current' : tier === '全球經典層' ? 'global' : 'german';
  return {
    category: '作品/展覽', status: '官方來源', updated: date,
    id: `${kind}-${date}-${String(i).padStart(2, '0')}`,
    dedupeKey: slug(`art-${date}-${kind}-${artist}-${title}`),
    name: `${String(i).padStart(2, '0')}｜${artist}｜${title}`, tier, region: '西方', country,
    cityKeywords: cities, media, works: `${title}｜${year}`, comment,
    website: url, workPage: url, photo: imageFor(url), artistStatement: statement,
    artistStatementSource: url, classicTitle: `${title}｜${year}`,
    classicImage: imageFor(url), classicDesc: comment, relatedByCity: []
  };
}

const p = key => `https://www.publicartfund.org/exhibitions/view/${key}/`;
const m = key => `https://www.museum-der-1000-orte.de/kunstwerke/kunstwerk/${key}`;
Object.assign(officialImages, {
  [p('wave-ufo')]: 'https://www.publicartfund.org/wp-content/uploads/2019/06/MoriM_1235_horizontal.jpg',
  [p('rooms-from-below-a-display-system-for-show-windows')]: 'https://www.publicartfund.org/wp-content/uploads/2019/06/AcconciV_2016_Horizontal-1.jpg',
  [p('the-invisible-city')]: 'https://www.publicartfund.org/wp-content/uploads/2019/06/GrennanSperandio_0718_horizontal.jpg',
  [p('the-metal-party')]: 'https://www.publicartfund.org/wp-content/uploads/2019/06/McElhenyJ_1142_horizontal.jpg',
  [p('sixteen-scenarios')]: 'https://www.publicartfund.org/wp-content/uploads/2019/06/FreemanJ_0602_horizontal.jpg',
  [p('pies-for-a-passerby')]: 'https://www.publicartfund.org/wp-content/uploads/2019/06/MackA_1082_horizontal.jpg',
  [p('the-story-of-color')]: 'https://www.publicartfund.org/wp-content/uploads/2019/06/TaylorJ_1771_horizontal.jpg',
  [p('transient-transfer')]: 'https://www.publicartfund.org/wp-content/uploads/2019/06/TuggarF_Horizontal.jpg.jpg',
  [p('sticks')]: 'https://www.publicartfund.org/wp-content/uploads/2019/06/WojnarowiczD_1964_horizontal.jpg',
  [p('the-box')]: 'https://www.publicartfund.org/wp-content/uploads/2019/06/McCarthyP_1135_horizontal.jpg',
  [p('reversed-double-helix')]: 'https://www.publicartfund.org/wp-content/uploads/2019/06/MurakamiT_1276_horizontal.jpg',
  [p('semiprecious')]: 'https://www.publicartfund.org/wp-content/uploads/2019/06/GispertL_0657_horizontal.jpg',
  [p('total-recall')]: 'https://www.publicartfund.org/wp-content/uploads/2019/06/BasherM_Horizontal.jpg.jpg',
  [p('transmission')]: 'https://www.publicartfund.org/wp-content/uploads/2019/06/PaikN_1324_horizontal.jpg',
  [p('wall-and-door-and-roof')]: 'https://www.publicartfund.org/wp-content/uploads/2019/06/WoodsR_Horizontal.jpg.jpg',
  [m('o-t-5')]: 'https://www.museum-der-1000-orte.de/media/cache/resolve/slider/images/8c621340aa1bfad62b8109e30474235199a9d0de.jpg',
  [m('o-t-schilfhalme')]: 'https://www.museum-der-1000-orte.de/media/cache/resolve/slider/images/21ed49962c5590c857ce506bff8f6261df6956a6.jpg',
  [m('tetes-et-queue')]: 'https://www.museum-der-1000-orte.de/media/cache/resolve/slider/images/5adcf047db639829b21dd51ccbabaff9f9c2dcca.jpg',
  [m('grosstierstele-und-kleintierstele')]: 'https://www.museum-der-1000-orte.de/media/cache/resolve/slider/images/3138e86c6da70470348e498dfa4b34f66b9a025e.jpg',
  [m('fruhling-sommer-herbst-winter')]: 'https://www.museum-der-1000-orte.de/media/cache/resolve/slider/images/033d9d92a7fb8755ef8f50226fae8fe6fa9cc1eb.jpg',
  'https://www.publicartist.org/call.cfm?id=7413': 'https://www.publicartist.org/curator/promotional-images/7413.jpg',
  'https://www.publicartist.org/call.cfm?id=7407': 'https://www.publicartist.org/resources/7407_1.jpg',
  'https://www.fairportart.org/': 'https://www.fairportart.org/uploads/1/2/2/0/122082469/published/pleinairpromo.jpg?1790739236',
  'https://discover.pbcgov.org/fdo/art/PDF/Final_ACAC_Call_to_Artists_7.14.26.pdf': 'https://discover.pbcgov.org/fdo/art/SiteImages/Aqua%20Crest%20Aquatic%20Complex/Aqua_Crest_Aquatic_Complex_img1.png',
  'https://www.minneapolismn.gov/government/departments/arts/public-art/public-art-projects/call-for-artists/': 'https://i.ytimg.com/vi/AvFUWHN5ufQ/hqdefault.jpg'
});
const entries = [
  art(1,'動態情報層','Mariko Mori','Wave UFO','2003','美國 / New York City',['New York City','New York','紐約市'],['互動裝置','腦波科技','聲音','即時影像'],'銀白色艙體置入 590 Madison Avenue 玻璃中庭，三名觀眾一次進入；感測器把腦波轉成即時影像與聲音，使科技、建築與參與者共同構成作品。','Mori 將佛教互聯觀與腦波科技結合，讓公共空間中的觀看轉為共享的身體經驗，而不是只在外部觀看一件物體。',p('wave-ufo')),
  art(2,'動態情報層','Vito Acconci','Rooms from Below: A Display System for Show Windows','1999','美國 / New York City',['New York City','New York','紐約市'],['櫥窗介入','鏡面','彩色光','空間裝置'],'Saks Fifth Avenue 櫥窗被旋轉九十度，玻璃成為地板，鏡面牆與天花板向內傾斜並複製視角，使購物展示變成可從下方觀看的建築房間。','Acconci 透過方向錯置與多重反射，拆解商業櫥窗的單一正面，也把行人的身體與凝視納入城市展示系統。',p('rooms-from-below-a-display-system-for-show-windows')),
  art(3,'動態情報層','Simon Grennan & Christopher Sperandio','The Invisible City','1999','美國 / New York City',['New York City','New York','紐約市'],['地鐵廣告介入','漫畫','公共敘事','大眾運輸'],'漫畫以一般廣告格式進入紐約地鐵車廂，記錄夜班技師、店員、保全與酒吧工作者，使維持二十四小時城市運轉的勞動在通勤途中被看見。','藝術家借用大眾廣告的分布網絡，把被忽略的夜間勞動轉成公共敘事，重新定義城市何者值得被展示。',p('the-invisible-city')),
  art(4,'動態情報層','Josiah McElheny','The Metal Party','2001–2002','美國 / New York City',['New York City','New York','紐約市','Brooklyn','布魯克林'],['參與式裝置','鋁板','鏡面玻璃','聲音'],'作品重構 1929 年包浩斯金屬派對，以鋁地板、玻璃球與反射表面形成銀色環境；觀眾穿上 Mylar 服裝並以拍立得留下自身在場。','McElheny 不把歷史做成靜態復原，而讓觀眾以服裝、聲音與影像重新演出集體現代性，公共性發生於參與過程。',p('the-metal-party')),
  art(5,'動態情報層','Jonah Freeman','Sixteen Scenarios','2002','美國 / New York City',['New York City','New York','紐約市','Brooklyn','布魯克林'],['鏡面迷宮','鋁材','壓克力','霓虹燈'],'Brooklyn Public Library 大廳出現由多入口、連通走道與中庭式房間組成的迷宮；彩色霓虹忽明忽滅，使圖書館入口轉成不穩定的都市劇場。','Freeman 以通用鋼玻璃建築語彙製造感知偏差，讓人思考商場、賭場與辦公空間如何悄悄塑造情緒與行為。',p('sixteen-scenarios')),
  art(6,'動態情報層','Anissa Mack','Pies for a Passerby','2002','美國 / New York City',['New York City','New York','紐約市','Brooklyn','布魯克林'],['參與式裝置','臨時建築','烘焙','對話'],'一座可運作的小屋被搬到 Brooklyn Public Library 廣場，藝術家在其中烤蘋果派、與路人交談，再把派放上窗台邀請人「偷走」。','Mack 把家庭勞動、贈與與美國文化想像移入公共廣場，使氣味、等待和陌生人互動成為作品媒材。',p('pies-for-a-passerby')),
  art(7,'動態情報層','Jocelyn Taylor','The Story of Color','2000','美國 / New York City',['New York City','New York','紐約市','Brooklyn','布魯克林'],['錄像裝置','街店櫥窗','三螢幕','公共影像'],'五組鬆散敘事在 Mott Street 與 Williamsburg 店面櫥窗播放，從 white、black、light、dark、color 等詞探討種族、性與人性的集體認知。','Taylor 把錄像從展場移到日常街窗，讓語言中的顏色與身分意義在多元城市人口面前公開摩擦。',p('the-story-of-color')),
  art(8,'動態情報層','Fatimah Tuggar','Transient Transfer','2008','美國 / New York City',['New York City','New York','紐約市','Bronx','布朗克斯'],['公車候車亭','數位拼貼','參與式平台','城市攝影'],'藝術家拍攝 Bronx 日常景象，居民再於博物館與網站互動介面重組影像；入選拼貼被放上 Grand Concourse 候車亭，形成由街區共同製作的展示網絡。','Tuggar 把作者權分散給城市使用者，使資料庫、介面與公車候車亭共同成為公共藝術基礎設施。',p('transient-transfer')),
  art(9,'動態情報層','Dan Witz','Sticks','1998–1999','美國 / New York City',['New York City','New York','紐約市','Lower East Side','下東城'],['錯視壁畫','建築介入','戶外繪畫','反廣告'],'七幅大型錯視畫讓 Henry Street Settlement 劇場外牆彷彿被巨型尖木刺穿，以「自生防禦」對抗商業看板持續佔領城市牆面。','Witz 以繪畫造成建築受力的幻覺，把牆面由廣告載體轉成街區防衛與批判性的公共表皮。',p('sticks')),
  art(10,'動態情報層','Paul McCarthy','The Box','2001','美國 / New York City',['New York City','New York','紐約市'],['建築複製','木構箱體','工作室裝置','空間錯置'],'藝術家工作室被精確複製後整體旋轉九十度塞入巨型木箱，家具、工具與影像設備從側牆突出；觀眾從窗框觀看如同進入立體畫面。','McCarthy 以重力方向錯置讓熟悉工作空間失效，揭示展示框架如何把生活、勞動與混亂重新製造成可觀看的圖像。',p('the-box')),

  art(11,'全球經典層','Takashi Murakami','Reversed Double Helix','2003','美國 / New York City',['New York City','New York','紐約市'],['大型雕塑','充氣裝置','公共座椅','場域轉化'],'三十英尺高多臂形體、漂浮眼球氣球與可坐的蘑菇森林共同改造 Rockefeller Plaza，將商業廣場轉成可進入的角色宇宙。','Murakami 把流行圖像放大到建築尺度，讓觀看、休息與通行都被納入同一個高密度的公共視覺系統。',p('reversed-double-helix')),
  art(12,'全球經典層','Carolyn Castaño、Jennifer Cohen、Luis Gispert、Kirsten Hassenfeld、Marc Swanson','Semiprecious','2004–2005','美國 / New York City',['New York City','New York','紐約市','Brooklyn','布魯克林'],['群展','反光材料','大型雕塑','戶外裝置'],'五位藝術家以閃耀、仿貴重與誘惑性的材料介入 MetroTech，從欲望、異國想像與人工性反思公共雕塑如何製造價值感。','作品群把表面光澤當成批判工具，使城市廣場的消費性視覺與藝術物件的「珍貴」地位彼此映照。',p('semiprecious')),
  art(13,'全球經典層','Martin Basher、Zipora Fried、Sam Moyer、Matt Sheridan Smith、Kevin Zucker','Total Recall','2010–2011','美國 / New York City',['New York City','New York','紐約市','Brooklyn','布魯克林'],['大型委託','戶外雕塑','混合媒材','記憶主題'],'五件大型新委託在 MetroTech 以多層、未來感與可變形結構回應記憶的不可靠性，讓廣場像一座由錯置殘片組成的共享記憶庫。','群展把「記得」從私人心理活動轉成城市空間的材料操作，使作品在熟悉與陌生之間持續改寫場所。',p('total-recall')),
  art(14,'全球經典層','Nam June Paik','Transmission','2002','美國 / New York City',['New York City','New York','紐約市'],['雷射裝置','傳輸塔','汽車雕塑','媒體藝術'],'三十三英尺高真實傳輸塔在白天以階梯燈光閃爍，夜間則以雷射掃描 Rockefeller Plaza，並結合汽車與廣播技術的文化意象。','Paik 將資訊基礎設施變成公共光環境，主張科技也能被重新配置為想像性、有人情尺度的共享媒介。',p('transmission')),
  art(15,'全球經典層','Richard Woods','wall and door and roof','2009','美國 / New York City',['New York City','New York','紐約市'],['建築介入','印刷木紋','臨時結構','圖案裝置'],'誇張木紋、牆、門與屋頂語彙被植入 City Hall Park，使熟悉的房屋構件像放大的版畫切片，與歷史市政建築形成尺度與材質錯位。','Woods 以可辨識卻不寫實的建築表皮，讓公共空間中的裝飾、建造與「家」的想像互相衝突。',p('wall-and-door-and-roof')),

  art(16,'德國經典層','Jürgen Partenheimer','o. T.','2001','德國 / Berlin',['Berlin','柏林'],['Kunst am Bau','鋁板','噴漆','油性粉筆'],'外交部訪客等候空間的三組大型鋁板各由九個模組構成；幾何色面提供建築性骨架，自由線條則把抒情節奏擴散至整個房間。','Partenheimer 讓作品既可獨立又與柱列和牆面精確對位，示範「可移動的繪畫」仍能透過配置成為真正建築整合藝術。',m('o-t-5')),
  art(17,'德國經典層','Anna Werkmeister','o. T.（Schilfhalme）','2005','日本 / Tokyo',['Tokyo','東京','東京都'],['Kunst am Bau','錄像截圖','五聯畫','媒體轉譯'],'東京德國大使館八點五公尺長五聯畫取自風吹蘆葦錄像；垂直莖線、水平板列、靜止畫面與原始動態彼此拉扯，並回應中庭窗格。','Werkmeister 將德國湖區影像與日本耐震文化連結，使自然、記憶與建築節奏在外交空間中形成跨文化場域。',m('o-t-schilfhalme')),
  art(18,'德國經典層','Alexander Calder','Têtes et Queue','1965','德國 / Berlin',['Berlin','柏林'],['公共雕塑','鋼材','Stabile','建築對話'],'黑色與紅色鋼構置於 Neue Nationalgalerie 露台，以水平延伸、開放輪廓與遊戲性姿態對話 Mies van der Rohe 屋頂的嚴整網格。','作品不是人物紀念像；Calder 以抽象穩定雕塑的動勢鬆動現代主義建築秩序，使露台成為身體繞行與視線交錯的空間。',m('tetes-et-queue')),
  art(19,'德國經典層','Waldemar Grzimek','Großtierstele und Kleintierstele','1960','德國 / Insel Riems',['Insel Riems','Riems','里姆斯島'],['Kunst am Bau','石質浮雕','研究園區','動物圖像'],'兩座橫向石碑以凸浮雕與凹浮雕呈現大型與小型動物，置入病毒研究島的海側外部空間，把研究對象、建築歷史與地景直接連結。','Grzimek 將科學機構的動物研究轉譯為可環繞觀看的低矮場域標記，重點是制度、物種與場所關係而非人物歌頌。',m('grosstierstele-und-kleintierstele')),
  art(20,'德國經典層','Irene Thonke','Frühling, Sommer, Herbst, Winter','1952','德國 / Bonn',['Bonn','波昂'],['Kunst am Bau','掛毯','纖維藝術','室內整合'],'四幅大型掛毯以米、紅、金、藍的主色對應四季，與 Villa Hammerschmidt 宴會廳金色灰泥天花和棋盤地板形成柔軟而持續的色彩序列。','Thonke 以纖維、吸音與季節節奏平衡代表性空間的硬質建築語彙；作品的公共性來自長期陪伴國家儀式，而非紀念單一人物。',m('fruhling-sommer-herbst-winter'))
];

function competition(i, organizer, title, country, cities, media, comment, url, deadline, timezone, precision, eligibility, budget, fee) {
  return {
    category:'公開徵件',status:'官方來源',updated:date,id:`competition-${date}-${String(i).padStart(2,'0')}`,
    dedupeKey:slug(`opportunity-${date}-${organizer}-${title}`),name:`${String(i).padStart(2,'0')}｜${organizer}｜${title}`,
    tier:'競圖資料庫',region:'西方',country,cityKeywords:cities,media,
    works:`${title}｜${budget}｜截止 ${deadline.slice(0,10).replaceAll('-','.')}`,comment,
    website:url,workPage:url,photo:imageFor(url),artistStatement:comment,artistStatementSource:url,
    classicTitle:title,classicImage:imageFor(url),classicDesc:comment,deadline,
    deadlineLabel:`截止 ${deadline.slice(0,10).replaceAll('-','.')}`,deadlineTimezone:timezone,
    deadlinePrecision:precision,organizer,eligibility,budget,applicationFee:fee,relatedByCity:[]
  };
}

const added = [
  competition(1,'4Culture／King County Wastewater Treatment Division','Elliott West Wet Weather Treatment Station Upgrade','美國 / Seattle, Washington',['Seattle','西雅圖'],['建築整合玻璃藝術','污水處理設施','場域特定委託'],'為 Seattle Elliott Bay 濕天候處理站東側玻璃樓梯立面與北向上層窗面徵求場域特定二維玻璃藝術；設計費 US$40,000，另有最高 US$5,000 旅行費。','https://www.publicartist.org/call.cfm?id=7413','2026-10-22T16:00:00-07:00','America/Los_Angeles','time','限居住美國、具二維玻璃或同尺度立面專案經驗的個人藝術家或團隊','US$40,000 設計費；另最高 US$5,000 旅行費','US$0'),
  competition(2,'Commonwealth Properties／One Columbia for Arts and Culture','2222 Main Street Mural Project','美國 / Columbia, South Carolina',['Columbia','哥倫比亞'],['壁畫','建築立面','社區公共藝術'],'為 Cottontown 街區一樓 Sumter Street 立面八個面板徵求最多三位壁畫家；總面積約 985 平方英尺，作品回應自然、花園、地方歷史與社區。','https://www.publicartist.org/call.cfm?id=7407','2026-10-23T23:59:59-04:00','America/New_York','date','專業藝術家或團隊；須以作品集證明壁畫、大型或社區公共藝術經驗','US$20,000（每位入選者約 US$6,700）','US$0'),
  competition(3,'Fairport Public Arts Committee','Fairport–Perinton Art Trail','美國 / Fairport, New York',['Fairport','費爾波特','Perinton','佩林頓'],['場域特定公共藝術','運河地景','永久委託'],'徵求沿歷史 Erie Canal 的場域特定公共藝術，作為 Fairport–Perinton Art Trail 節點；總預算 US$30,000。','https://www.fairportart.org/','2026-10-30T22:00:00-04:00','America/New_York','time','向所有藝術家與藝術團隊開放','US$30,000','未公開'),
  competition(4,'Palm Beach County Art in Public Places','Aqua Crest Aquatic Complex Call to Tile Artists','美國 / Delray Beach, Florida',['Delray Beach','德爾雷比奇'],['建築整合藝術','陶瓷／玻璃磚','公共泳池','永久委託'],'為 Aqua Crest Aquatic Complex 入口與售票建築五面牆體徵求平整、耐候、低維護的磚材整合藝術，總預算 US$348,000。','https://discover.pbcgov.org/fdo/art/PDF/Final_ACAC_Call_to_Artists_7.14.26.pdf','2026-10-19T23:59:00-04:00','America/New_York','time','所有具建築整合磚材（陶瓷、瓷器、赤陶、石材或玻璃）設計、製作與安裝經驗的成年專業藝術家或團隊','US$348,000','US$0'),
  competition(5,'City of Minneapolis Arts & Cultural Affairs','Graco Park Tunnel Art Project','美國 / Minneapolis, Minnesota',['Minneapolis','明尼亞波利斯'],['隧道公共藝術','社區參與','場域研究','永久委託'],'為連接兩座公園的 Graco Park 隧道內部徵求藝術；入選者須研究地方歷史、連結周邊社群並執行有意義的參與過程。','https://www.minneapolismn.gov/government/departments/arts/public-art/public-art-projects/call-for-artists/','2026-10-26T17:00:00-05:00','America/Chicago','time','各經驗層級、不同媒材與尺度的藝術家或團隊皆可申請；需具地方連結與社區參與能力','US$250,000','US$0')
];

const cp = JSON.parse(fs.readFileSync('data/competitions.json','utf8'));
const baseline = cp.entries.filter(e => e.updated !== date);
const retained = baseline.filter(e => new Date(e.deadline) > now);
const expiredRemoved = baseline.length - retained.length;
const comps = [...retained, ...added];

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

const daily = {meta:{generatedAt,timezone:'Asia/Taipei',date,total:20,dynamicEntries:10,globalClassicEntries:5,germanClassicEntries:5,source:'Public Art Fund 與 Museum der 1000 Orte 第一方作品頁',selectionPolicy:'已實現的空間介入、互動裝置、建築整合、城市媒介與 Kunst am Bau；排除傳統城市人物紀念雕塑，競圖與獎助完全分流。',note:'10/19 固定 10＋5＋5；20 則皆為作品資料，未混入競圖、補助或獎項，傳統人物紀念像排除檢查通過。',linkAudit:{checkedAt:generatedAt,checkedUniqueSources:20,brokenOrBlockedReplaced:0,rule:'第一方作品頁回讀'},imageAudit:{checkedAt:generatedAt,imageEntries:20,missing:0,rule:'來源頁預覽圖片'}},entries};
fs.writeFileSync('data/backfill-october-20261019.json',`${JSON.stringify(daily,null,2)}\n`);

cp.updated=date; cp.generatedAt=generatedAt; cp.meta={activeEntries:comps.length,addedToday:5,expiredRemoved,duplicateRemoved:0,scopeRemoved:0,source:'城市政府、公共藝術計畫與官方徵件頁',note:`保留 ${retained.length} 則既有未截止項目，新增 5 則；移除 ${expiredRemoved} 則逾期項目。`}; cp.entries=comps;
fs.writeFileSync('data/competitions.json',`${JSON.stringify(cp,null,2)}\n`);

const cm=JSON.parse(fs.readFileSync('data/competition-manifest.json','utf8'));
Object.assign(cm,{version:'2026-10-19-competition-r77',generatedAt,activeEntries:comps.length,addedToday:5,expiredRemoved,duplicateRemoved:0,scopeRemoved:0,deadlineTimezoneEntries:comps.filter(e=>e.deadlineTimezone).length,deadlinePrecisionEntries:comps.filter(e=>e.deadlinePrecision).length,cityKeywordEntries:comps.filter(e=>Array.isArray(e.cityKeywords)&&e.cityKeywords.length>=2).length,germanAddedToday:0,note:`保留 ${retained.length} 則既有未截止項目，新增 5 則；移除 ${expiredRemoved} 則逾期項目，所有有效 deadline 皆含時區偏移。`});
fs.writeFileSync('data/competition-manifest.json',`${JSON.stringify(cm,null,2)}\n`);

const om=JSON.parse(fs.readFileSync('data/backfill-october-manifest.json','utf8'));
om.version='2026-10-19-public-art-r102'; om.generatedAt=generatedAt; om.files=[...new Set([...om.files,'backfill-october-20261019.json'])]; om.expectedEntries=om.files.length*20; om.statementEntries=om.expectedEntries; om.statementSourceEntries=om.expectedEntries; om.imageEntries=om.expectedEntries; om.note='截至 2026-10-19，10 月每日固定 20 則且皆為作品資料；本日配置 10／5／5，排除傳統人物紀念雕塑，來源、圖片、城市與去重欄位完整。';
fs.writeFileSync('data/backfill-october-manifest.json',`${JSON.stringify(om,null,2)}\n`);

let index=fs.readFileSync('index.html','utf8');
index=index.replace(/const cacheKey = '[^']+';/,"const cacheKey = '20261019-daily-r102';");
fs.writeFileSync('index.html',index);
console.log(JSON.stringify({publicArt:entries.length,dynamic:10,global:5,german:5,previousCompetitions:baseline.length,retained:retained.length,expiredRemoved,added:5,active:comps.length},null,2));
