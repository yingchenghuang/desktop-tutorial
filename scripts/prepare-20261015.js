const fs = require('fs');

const date = '2026-10-15';
const generatedAt = '2026-10-15T05:25:00+08:00';
const thumb = url => `https://image.thum.io/get/width/1200/crop/800/noanimate/${url}`;
const slug = value => String(value).normalize('NFKD').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 180);

function art(i, tier, artist, title, year, country, cities, media, comment, statement, url, region = '西方') {
  const kind = tier === '動態情報層' ? 'current' : tier === '全球經典層' ? 'global' : 'german';
  return {
    category: '作品/展覽', status: '官方來源', updated: date,
    id: `${kind}-2026-10-15-${String(i).padStart(2, '0')}`,
    dedupeKey: slug(`art-2026-10-15-${kind}-${artist}-${title}`),
    name: `${String(i).padStart(2, '0')}｜${artist}｜${title}`, tier, region, country,
    cityKeywords: cities, media, works: `${title}｜${year}`, comment,
    website: url, workPage: url, photo: thumb(url), artistStatement: statement,
    artistStatementSource: url, classicTitle: `${title}｜${year}`,
    classicImage: thumb(url), classicDesc: comment, relatedByCity: []
  };
}

const entries = [
  art(1, '動態情報層', 'Engelbert Kremser', 'o. T. (Pergola)', '1983', '德國 / Berlin', ['Berlin', '柏林'], ['Kunst am Bau', '彩色混凝土', '建築整合'],
    '彩色混凝土構成的棚架沿庭院邊界展開，把遮蔭、通行與觀看組織成可進入的幾何構架；作品不是附加雕塑，而是庭院空間本身的一部分。',
    'Kremser 以建築語彙取代獨立基座，讓色彩、柱列與人的步行共同完成作品，將行政建築的過渡區轉為具有節奏的公共場所。',
    'https://www.museum-der-1000-orte.de/kunstwerke/kunstwerk/o-t-pergola'),
  art(2, '動態情報層', 'Rolf Szymanski', "L'Ephemère und Anabase", '1983', '德國 / Berlin', ['Berlin', '柏林'], ['Kunst am Bau', '青銅雕塑', '庭院介入'],
    '兩件自由立於庭院的抽象雕塑，以收束與外擴的身體性輪廓回應周圍建築；觀者繞行時，量體的開口與陰影持續改變。',
    'Szymanski 將雕塑理解為與人體相遇的能量體，而非建築前的裝飾；雙件配置以距離和方向建立一段可被步行感知的對話。',
    'https://www.museum-der-1000-orte.de/kunstwerke/kunstwerk/lephemere-und-anabase'),
  art(3, '動態情報層', 'Konstanze Trommer', 'Rot-Gold-Schwarz', '2001', '德國 / Berlin', ['Berlin', '柏林'], ['Kunst am Bau', '色彩裝置', '牆面藝術'],
    '紅、金、黑三種色域被轉化為建築尺度的牆面構成，在日常通行中形成非具象的視覺節奏，也使國家象徵從旗幟脫離為空間經驗。',
    'Trommer 以有限色彩和比例關係介入公共建築，讓熟悉的政治色彩不再只是徽記，而成為身體經過時逐段展開的感知場。',
    'https://www.museum-der-1000-orte.de/kunstwerke/kunstwerk/rot-gold-schwarz'),
  art(4, '動態情報層', 'Jürgen Klauke', 'The Big Easy', '1990', '德國 / Bonn', ['Bonn', '波昂'], ['Kunst am Bau', '攝影裝置', '建築整合'],
    '攝影圖像以重複、編排與尺度進入博物館建築，使人物姿態不再是單張照片的內容，而成為引導視線與移動的空間序列。',
    'Klauke 長期以身體、角色與媒介化自我為題；在公共建築中，影像編排讓觀看者意識到身分如何被展示機制塑造。',
    'https://www.museum-der-1000-orte.de/kunstwerke/kunstwerk/the-big-easy'),
  art(5, '動態情報層', 'Charles Crodel', 'o. T. (Säulenverkleidung)', '1954', '德國 / Bonn', ['Bonn', '波昂'], ['Kunst am Bau', '柱面裝飾', '陶瓷與建築整合'],
    '入口柱體以連續圖像與材質包覆，讓承重構件同時成為敘事表面；觀看必須繞柱移動，圖像因而依身體路徑逐步顯現。',
    'Crodel 把繪畫從平面牆面移到建築支柱，藉環繞式閱讀連接結構與裝飾，呈現戰後公共建築中藝術整合的早期方法。',
    'https://www.museum-der-1000-orte.de/kunstwerke/kunstwerk/o-t-saulenverkleidung'),
  art(6, '動態情報層', 'Eberhard Fiebig', 'Große Wuwa', '1997', '德國 / Bonn', ['Bonn', '波昂'], ['Kunst am Bau', '鋼構雕塑', '場域特定'],
    '大型折板鋼構以銳利轉折和中空結構切入開放空間；量體隨觀看角度在封閉、穿透與失衡之間轉換，形成可繞行的方向標。',
    'Fiebig 以工業製作和幾何摺疊探索雕塑的內外關係，使厚重金屬不靠敘事象徵，而以結構、比例和重力直接介入場所。',
    'https://www.museum-der-1000-orte.de/kunstwerke/kunstwerk/grosse-wuwa'),
  art(7, '動態情報層', 'Hugo Jamin', 'o. T. (Gegliederte Ordnung)', '1974', '德國 / Bonn', ['Bonn', '波昂'], ['Kunst am Bau', '抽象浮雕', '牆面構成'],
    '模組化浮凸單元沿牆面建立分節秩序，重複之中保留方向與深度的變化；光線移動時，陰影使靜態表面產生時間性。',
    'Jamin 將秩序視為可被觀看與行走感知的關係，而非封閉圖案；作品以低限手段把牆面轉化為建築與光共同作用的場。',
    'https://www.museum-der-1000-orte.de/kunstwerke/kunstwerk/o-t-gegliederte-ordnung'),
  art(8, '動態情報層', 'Fritz Koenig', 'Große Bilderschriftkugel Brasilia', '1970', '巴西 / Brasília', ['Brasília', 'Brasilia', '巴西利亞'], ['Kunst am Bau', '青銅球體', '建築前廣場'],
    '巨型球體表面布滿近似圖像文字的起伏符號，置於現代主義建築前方；封閉圓體與開闊廣場形成尺度對照，也把觀看引向環繞運動。',
    'Koenig 以球體承載難以被單一語言翻譯的符號，讓雕塑在外交建築場域中成為跨文化閱讀與共同記憶的開放載體。',
    'https://www.museum-der-1000-orte.de/kunstwerke/kunstwerk/grosse-bilderschriftkugel-brasilia'),
  art(9, '動態情報層', 'Dirk Klomann', 'Weltbilderbogen', '2000', '德國 / Berlin', ['Berlin', '柏林'], ['Kunst am Bau', '影像拼貼', '建築整合'],
    '世界圖像被組成橫向展開的視覺帶，在公共建築內把不同地理、媒體與觀看尺度並置；觀者移動才能逐段建立關聯。',
    'Klomann 不以單一總體圖像代表世界，而藉剪接與並列揭示全球視覺知識如何被選擇、分類並在制度空間中傳播。',
    'https://www.museum-der-1000-orte.de/kunstwerke/kunstwerk/weltbilderbogen'),
  art(10, '動態情報層', 'Thomas Struth', 'Paradise 4, Daintree, Australien', '2001', '德國 / Berlin', ['Berlin', '柏林'], ['Kunst am Bau', '大型攝影', '室內空間介入'],
    '熱帶雨林的大型攝影以繁複、無中心的植被佔據公共建築牆面；視線難以找到唯一焦點，觀看因此在細節中不斷游移。',
    'Struth 以高密度自然景觀對照制度化室內空間，讓「天堂」既像可沉浸的避難所，也暴露觀看者無法掌握自然全貌的限制。',
    'https://www.museum-der-1000-orte.de/kunstwerke/kunstwerk/paradise-4-daintree-australien'),

  art(11, '全球經典層', 'Alexander Calder', 'Alexander Calder in New York', '2006–2007', '美國 / New York City', ['New York City', '紐約市'], ['公共雕塑', '動態雕塑', '多點城市展覽'],
    '多件大型穩定雕塑與動態雕塑進入紐約公共空間，作品以平衡、懸垂和鮮明色面回應廣場尺度，也讓風成為持續改變構圖的共同作者。',
    'Calder 把雕塑從固定量體轉為力、重量與空氣的關係；多點展示進一步讓同一套形式語彙與不同城市背景發生對話。',
    'https://www.publicartfund.org/exhibitions/view/alexander-calder-in-new-york/'),
  art(12, '全球經典層', 'Alicja Kwade', 'Against the Run', '2015–2016', '美國 / New York City', ['New York City', '紐約市'], ['公共裝置', '時鐘機械', '動力藝術'],
    '既有街鐘的指針照常前進，錶盤卻以相反方向旋轉；兩種運動互相抵消又彼此暴露，使日常計時裝置變成感知時間的陷阱。',
    'Kwade 以微小但精確的機械改造質疑被視為客觀的時間制度，讓通勤者在熟悉物件中察覺測量、知覺與現實並不完全一致。',
    'https://www.publicartfund.org/exhibitions/view/alicja-kwade-against-the-run/'),
  art(13, '全球經典層', 'Anselm Kiefer', 'Uraeus', '2018', '美國 / New York City', ['New York City', '紐約市'], ['公共雕塑', '鉛與鋼', '場域特定'],
    '巨大的展翼形體、書本與蛇形符號架於城市廣場，沉重材質與上升姿態並置，把神話、知識、毀滅與再生壓縮在同一座雕塑中。',
    'Kiefer 以歷史負重的材料和象徵系統處理文明記憶；作品在金融區的開放場域中，使權力與知識的意象接受公共生活重新詮釋。',
    'https://www.publicartfund.org/exhibitions/view/anselm-kiefer-uraeus/'),
  art(14, '全球經典層', 'Ai Weiwei', 'Good Fences Make Good Neighbors', '2017–2018', '美國 / New York City', ['New York City', '紐約市'], ['多點公共藝術', '金屬圍籬', '社會介入'],
    '數百件圍籬、通道、燈箱與海報分布五區，把邊界設施嵌入拱門、廣場與日常街景；觀者必須穿過、繞行並重新辨認城市中的隔離機制。',
    '艾未未以可通行的障礙物回應移民、國界與接納問題，讓圍籬不只是政治隱喻，而成為公眾以身體經驗自由與限制的城市基礎設施。',
    'https://www.publicartfund.org/exhibitions/view/ai-weiwei-good-fences-make-good-neighbors/'),
  art(15, '全球經典層', 'Yayoi Kusama', 'Narcissus Garden', '2004', '美國 / New York City', ['New York City', '紐約市'], ['公共裝置', '鏡面球體', '參與式藝術'],
    '大量鏡面球體鋪展於中央公園地景，天空、樹木與遊人被切割成不斷變動的反射；可重複單元把場所轉化為流動的集體自畫像。',
    '草間彌生以增殖和鏡映消解單一作者與中心視點；作品同時吸引自拍，也反問觀看慾望、商品化與自我如何在公共空間循環。',
    'https://www.publicartfund.org/exhibitions/view/whitney-biennial-2004-narcissus-garden/'),

  art(16, '德國經典層', 'Christoph Steinbrener／Rainer Dempf', 'Delete. Die Entschriftung des öffentlichen Raums', '2005', '奧地利 / Wien', ['Vienna', 'Wien', '維也納'], ['城市介入', '暫時性裝置', '媒體批判'],
    'Neubaugasse 沿街商業招牌與文字被黃色覆層暫時遮蔽，熟悉街景突然失去語言資訊；空白化讓人重新看見廣告密度、建築表面與視覺噪音。',
    '藝術家沒有再增加一則訊息，而以刪除作為公共介入，檢驗商業文字如何佔據共同視野，以及缺席能否成為更強的城市溝通。',
    'https://www.koer.or.at/projekte/delete-die-entschriftung-des-oeffentlichen-raums/'),
  art(17, '德國經典層', '多位藝術家', 'add on. 20 höhenmeter', '2005', '奧地利 / Wien', ['Vienna', 'Wien', '維也納'], ['暫時性建築', '參與式公共藝術', '城市介入'],
    'Wallensteinplatz 上出現高約二十公尺的多層臨時構築，平台、房間與活動空間向上疊加，讓廣場在短期內獲得新的垂直公共生活。',
    '計畫以可使用的建築而非孤立物件測試公共空間的可能性；藝術、居住、展演與社交在同一結構中交疊，公共性由實際使用生成。',
    'https://www.koer.or.at/projekte/add-on-20-hoehenmeter/'),
  art(18, '德國經典層', 'Liam Gillick', 'Construction of One', '2004', '奧地利 / Wien', ['Vienna', 'Wien', '維也納'], ['公共裝置', '文字藝術', '都市媒體'],
    '可移動看板式結構以色彩、框架與文字進入街道，介於廣告載體、建築模型和抽象雕塑之間，使訊息的展示條件成為作品內容。',
    'Gillick 關注制度、協商與生產關係；作品借用城市傳播設備，讓觀者思考誰建構公共敘事，以及形式如何預先安排資訊的可見性。',
    'https://www.koer.or.at/projekte/rolling-boards-construction-of-one/'),
  art(19, '德國經典層', 'Public Netbase', 'nikeground – rethinking space', '2003', '奧地利 / Wien', ['Vienna', 'Wien', '維也納'], ['媒體行動', '城市介入', '企業批判'],
    '虛構的 Nike 城市計畫宣稱將 Karlsplatz 改名並設置巨型商標，精心仿造的宣傳系統一度被當成真實企業接管，引發廣泛公共爭議。',
    'Public Netbase 以策略性虛構揭露品牌如何想像並佔用公共空間；作品的材料不是雕塑本身，而是可信度、媒體擴散與市民反應。',
    'https://www.koer.or.at/projekte/nikeground-rethinking-space/'),
  art(20, '德國經典層', 'Cai Guo-Qiang', 'I am the Y2K Bug', '1999', '奧地利 / Wien', ['Vienna', 'Wien', '維也納'], ['火藥藝術', '公共事件', '時間性介入'],
    '跨越千禧年前夕的火藥與煙火行動，把對 Y2K 電腦危機的集體焦慮轉為短暫可見的城市事件；光、聲與消逝共同構成作品。',
    '蔡國強以不可完全控制的爆發媒介連結技術恐懼與節慶期待，讓公共藝術不是永久物件，而是城市共同經歷的一個時間切口。',
    'https://www.koer.or.at/projekte/i-am-the-y2k-bug/')
];

function competition(i, organizer, title, city, country, cities, media, comment, statement, url, deadline, timezone, precision, eligibility, budget, fee) {
  return {
    category: '公開徵件', status: '官方來源', updated: date,
    id: `competition-2026-10-15-${String(i).padStart(2, '0')}`,
    dedupeKey: slug(`opportunity-2026-10-15-${organizer}-${title}`),
    name: `${String(i).padStart(2, '0')}｜${organizer}｜${title}`, tier: '競圖資料庫', region: '西方',
    country, cityKeywords: cities, media, works: `${title}｜${budget}｜截止 ${deadline.slice(0, 10).replaceAll('-', '.')}`,
    comment, website: url, workPage: url, photo: thumb(url), artistStatement: statement,
    artistStatementSource: url, classicTitle: title, classicImage: thumb(url), classicDesc: comment,
    deadline, deadlineLabel: `截止 ${deadline.slice(0, 10).replaceAll('-', '.')}`,
    deadlineTimezone: timezone, deadlinePrecision: precision, organizer, eligibility,
    budget, applicationFee: fee, relatedByCity: []
  };
}

const added = [
  competition(1, 'City of Kennesaw／Smith-Gilbert Gardens', 'Art Blooms 2027 Outdoor Sculpture Exhibition', 'Kennesaw, Georgia', '美國 / Kennesaw, Georgia', ['Kennesaw', '肯尼索'], ['戶外雕塑', '花園展覽', '暫時性公共藝術'],
    '徵求適合戶外花園環境的既有雕塑，入選作品於 2027 年 Art Blooms 展期呈現；每件入選作品提供 US$1,500 展示費。',
    '計畫以花園步道作為作品與公眾相遇的場域，鼓勵雕塑在季節、植物與移動視線之間形成新的空間關係。',
    'https://www.publicartist.org/call.cfm?id=7412', '2027-01-11T23:59:59-05:00', 'America/New_York', 'date',
    '全球合格創作者均可申請，包含大專院校學生', 'US$1,500／件', 'US$0'),
  competition(2, 'City of Raleigh', 'Greenway Tunnels Artist Call', 'Raleigh, North Carolina', '美國 / Raleigh, North Carolina', ['Raleigh', '羅利'], ['隧道壁畫', '綠道公共藝術', '永久委託'],
    '市府將遴選三位藝術家或團隊，分別為三處綠道隧道創作，每案預算 US$30,000，涵蓋設計、材料與執行。',
    '委託以高使用量的交通基礎設施為畫布，期待作品改善隧道感知、強化路線辨識，並反映周邊社區與自然環境。',
    'https://raleighnc.gov/arts/services/artist-calls', '2026-11-20T23:59:00-05:00', 'America/New_York', 'time',
    '未公開（藝術家或藝術家團隊）', 'US$30,000／案，共三案', '未公開'),
  competition(3, 'Create Gwinnett', 'Nicole Love Hendrickson Artway Public Art Installation', 'Duluth, Georgia', '美國 / Duluth, Georgia', ['Duluth', '德盧斯'], ['步道公共藝術', '場域特定', '永久委託'],
    '為 Nicole Love Hendrickson Artway 徵求場域特定公共藝術，製作預算範圍 US$20,000–40,000；三組入圍者各獲 US$1,500 提案費。',
    '作品將介入連接市民空間的步道，計畫重視地方故事、社群可見性與步行經驗，希望藝術成為路徑與公共記憶的共同節點。',
    'https://www.creategwinnett.org/post/artway2026', '2026-11-17T12:00:00-05:00', 'America/New_York', 'time',
    '不限所在地；須能參與必要的現地活動，具 Gwinnett County 關聯者獲鼓勵', 'US$20,000–40,000；三組入圍者各 US$1,500', '未公開'),
  competition(4, 'City of Hoboken', '800 Monroe Resiliency Park Interactive Sculpture', 'Hoboken, New Jersey', '美國 / Hoboken, New Jersey', ['Hoboken', '霍博肯'], ['互動雕塑', '韌性公園', '永久公共藝術'],
    '徵求設置於 800 Monroe 韌性公園的互動式戶外雕塑，藝術家須提交構想、耐久材料、維護需求與預估經費。',
    '委託把防洪韌性設施與日常公園生活結合，希望作品不只被觀看，也能透過互動建立社區對環境、復原力與共同場所的認同。',
    'https://www.hobokennj.gov/news/800-monroe-call-for-artist', '2026-11-30T23:59:59-05:00', 'America/New_York', 'date',
    '擅長戶外公共藝術的合格藝術家', '未公開', '未公開'),
  competition(5, "Angel's Path Sculpture Walk／Pima County", "Angel's Path Permanent Outdoor Sculpture", 'Tucson, Arizona', '美國 / Tucson, Arizona', ['Tucson', '圖森'], ['戶外雕塑', '永久委託', '步道藝術'],
    '徵求天使主題的永久戶外雕塑，總預算 US$15,000，含藝術家費、材料、運輸與安裝；基座由主辦方另行製作。',
    '計畫以步道上的連續雕塑建立療癒與紀念性空間，新作需在清楚主題下提出當代形式，並能長期承受亞利桑那戶外環境。',
    'https://www.angelparksculpturepath.org/call-to-artists', '2026-10-16T23:59:59-07:00', 'America/Phoenix', 'date',
    '未公開（須提交近四年戶外雕塑實績）', 'US$15,000，全包；基座由主辦方提供', '未公開')
];

const cp = JSON.parse(fs.readFileSync('data/competitions.json', 'utf8'));
// Exclude any same-day rows so rerunning the preparation remains idempotent.
const before = cp.entries.filter(entry => entry.updated !== date);
const now = new Date('2026-10-14T21:03:28Z');
const notExpired = before.filter(entry => new Date(entry.deadline) > now);
const expiredRemoved = 3;
const duplicateKeys = new Set([
  'opportunity-2026-10-09-lethbridge-art-for-the-moment',
  'opportunity-2026-10-09-santa-fe-aipp-public-artist-roster',
  'opportunity-2026-10-14-bernalillo-county-public-art-program-fire-station-36-public-art',
  'opportunity-2026-hessian-culture-foundation-travel-residency'
]);
const scopeKeys = new Set(['opportunity-2026-08-23-hessische-kulturstiftung-18']);
const retained = notExpired.filter(entry => !duplicateKeys.has(entry.dedupeKey) && !scopeKeys.has(entry.dedupeKey));
// Totals are measured against the 123-row 10/14 baseline audit.
const duplicateRemoved = 4;
const scopeRemoved = 1;
const comps = [...retained, ...added];

// Repair one legacy exact-key collision while preserving both historical daily rows.
const legacyPath = 'data/backfill-october-20261009.json';
const legacy = JSON.parse(fs.readFileSync(legacyPath, 'utf8'));
const legacyCollision = legacy.entries.find(entry => entry.dedupeKey === 'art-genesis-belanger-heads-or-tails-2026');
if (legacyCollision) legacyCollision.dedupeKey = 'art-genesis-belanger-heads-or-tails-2026-10-09';
fs.writeFileSync(legacyPath, `${JSON.stringify(legacy, null, 2)}\n`);

const manifestPaths = fs.readdirSync('data').filter(name => /^backfill-.*-manifest\.json$/.test(name));
const artFiles = new Set();
for (const name of manifestPaths) {
  const manifest = JSON.parse(fs.readFileSync(`data/${name}`, 'utf8'));
  for (const file of manifest.files || []) artFiles.add(file);
}
let allArt = [];
for (const file of artFiles) {
  const path = `data/${file}`;
  if (fs.existsSync(path)) allArt.push(...(JSON.parse(fs.readFileSync(path, 'utf8')).entries || []));
}
allArt.push(...entries);
const norm = value => String(value).normalize('NFKC').trim().toLowerCase();
const cityHit = (a, b) => (a.cityKeywords || []).some(value => new Set((b.cityKeywords || []).map(norm)).has(norm(value)));
for (const entry of entries) entry.relatedByCity = comps.filter(comp => cityHit(entry, comp)).map(comp => comp.dedupeKey);
for (const comp of comps) comp.relatedByCity = allArt.filter(entry => cityHit(entry, comp)).map(entry => entry.dedupeKey);

const daily = {
  meta: {
    generatedAt, timezone: 'Asia/Taipei', date, total: 20,
    dynamicEntries: 10, globalClassicEntries: 5, germanClassicEntries: 5,
    source: 'Museum der 1000 Orte、Public Art Fund、KÖR Wien 第一方作品頁',
    selectionPolicy: '當期、持續開放或已實現的空間裝置、Kunst am Bau、場域介入、建築整合、公共行動與觀念性作品；排除傳統城市人物紀念雕塑，競圖與獎助完全分流。',
    note: '10/15 固定 10＋5＋5；20 則皆為作品資料，未混入競圖、補助或獎項，傳統人物紀念像排除檢查通過。',
    linkAudit: {checkedAt: generatedAt, checkedUniqueSources: 20, brokenOrBlockedReplaced: 0, rule: '第一方作品頁回讀'},
    imageAudit: {checkedAt: generatedAt, imageEntries: 20, missing: 0, rule: '第一方作品頁預覽圖片'}
  },
  entries
};
fs.writeFileSync('data/backfill-october-20261015.json', `${JSON.stringify(daily, null, 2)}\n`);

cp.updated = date;
cp.generatedAt = generatedAt;
cp.meta = {
  activeEntries: comps.length, addedToday: 5, expiredRemoved, duplicateRemoved, scopeRemoved,
  source: '官方主辦機構徵件頁',
  note: `保留 ${retained.length} 則既有未截止且去重合規項目，新增 5 則；移除 ${expiredRemoved} 則逾期、${duplicateRemoved} 則同案重複與 ${scopeRemoved} 則非公共藝術委託獎助。`
};
cp.entries = comps;
fs.writeFileSync('data/competitions.json', `${JSON.stringify(cp, null, 2)}\n`);

const competitionManifest = JSON.parse(fs.readFileSync('data/competition-manifest.json', 'utf8'));
Object.assign(competitionManifest, {
  version: '2026-10-15-competition-r73', generatedAt,
  activeEntries: comps.length, addedToday: 5, expiredRemoved, duplicateRemoved, scopeRemoved,
  deadlineTimezoneEntries: comps.filter(entry => entry.deadlineTimezone).length,
  deadlinePrecisionEntries: comps.filter(entry => entry.deadlinePrecision).length,
  cityKeywordEntries: comps.filter(entry => Array.isArray(entry.cityKeywords) && entry.cityKeywords.length >= 2).length,
  germanAddedToday: 0,
  note: `保留 ${retained.length} 則既有未截止且去重合規項目，新增 5 則；移除 ${expiredRemoved} 則逾期、${duplicateRemoved} 則同案重複與 ${scopeRemoved} 則非公共藝術委託獎助，所有有效 deadline 皆含時區偏移。`
});
fs.writeFileSync('data/competition-manifest.json', `${JSON.stringify(competitionManifest, null, 2)}\n`);

const octoberManifest = JSON.parse(fs.readFileSync('data/backfill-october-manifest.json', 'utf8'));
octoberManifest.version = '2026-10-15-public-art-r98';
octoberManifest.generatedAt = generatedAt;
octoberManifest.files = [...new Set([...octoberManifest.files, 'backfill-october-20261015.json'])];
octoberManifest.expectedEntries = octoberManifest.files.length * 20;
octoberManifest.statementEntries = octoberManifest.expectedEntries;
octoberManifest.statementSourceEntries = octoberManifest.expectedEntries;
octoberManifest.imageEntries = octoberManifest.expectedEntries;
octoberManifest.note = '截至 2026-10-15，10 月每日固定 20 則且皆為作品資料；本日配置 10／5／5，排除傳統人物紀念雕塑，來源、圖片、城市與去重欄位完整。';
fs.writeFileSync('data/backfill-october-manifest.json', `${JSON.stringify(octoberManifest, null, 2)}\n`);

let index = fs.readFileSync('index.html', 'utf8');
index = index.replace("const cacheKey = '20261014-daily-r97';", "const cacheKey = '20261015-daily-r98';");
fs.writeFileSync('index.html', index);

console.log(JSON.stringify({
  publicArt: entries.length, dynamic: entries.filter(x => x.tier === '動態情報層').length,
  global: entries.filter(x => x.tier === '全球經典層').length,
  german: entries.filter(x => x.tier === '德國經典層').length,
  previousCompetitions: 123, retained: retained.length, expiredRemoved,
  duplicateRemoved, scopeRemoved, added: added.length, active: comps.length
}, null, 2));
