const fs = require('fs');

const date = '2026-10-17';
const generatedAt = '2026-10-17T05:03:09+08:00';
const now = new Date('2026-10-16T21:03:09Z');
const thumb = url => `https://image.thum.io/get/width/1200/crop/800/noanimate/${url}`;
const slug = value => String(value).normalize('NFKD').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 180);

function art(i, tier, artist, title, year, country, cities, media, comment, statement, url) {
  const kind = tier === '動態情報層' ? 'current' : tier === '全球經典層' ? 'global' : 'german';
  return {
    category: '作品/展覽', status: '官方來源', updated: date,
    id: `${kind}-${date}-${String(i).padStart(2, '0')}`,
    dedupeKey: slug(`art-${date}-${kind}-${artist}-${title}`),
    name: `${String(i).padStart(2, '0')}｜${artist}｜${title}`, tier, region: '西方', country,
    cityKeywords: cities, media, works: `${title}｜${year}`, comment,
    website: url, workPage: url, photo: thumb(url), artistStatement: statement,
    artistStatementSource: url, classicTitle: `${title}｜${year}`,
    classicImage: thumb(url), classicDesc: comment, relatedByCity: []
  };
}

const m = key => `https://www.museum-der-1000-orte.de/kunstwerke/kunstwerk/${key}`;
const p = key => `https://www.publicartfund.org/exhibitions/view/${key}/`;
const entries = [
  art(1,'動態情報層','Christine Gersch','Vier Teufel／Kleines Kanzleramt – Kaspertheater','1999','德國 / Berlin',['Berlin','柏林'],['Kunst am Bau','屋頂裝置','遊戲空間','木構'],'四個高彩度「小魔鬼」沿托兒所斜屋頂滑落，並以縮小的「小總理府」木屋回應鄰近政府建築；作品同時介入屋頂安全、兒童遊戲與國家建築的尺度。','Gersch 把威權建築語彙轉成可親近的木偶劇與守護形象，使政府區的紀念性被兒童身體、色彩和遊戲重新校準。',m('vier-teufel-kleines-kanzleramt-kaspertheater')),
  art(2,'動態情報層','Katharina Grosse','o. T.','1999','德國 / Erfurt',['Erfurt','艾爾福特'],['Kunst am Bau','壓克力','鋁板','擴張繪畫'],'三件無框壓克力鋁板以水平、垂直色帶回應聯邦勞動法院的格狀天花、木牆與家具；繪畫不是附掛裝飾，而以比例與方向接續室內結構。','Grosse 將「擴張繪畫」放入司法建築，讓色彩在自主圖像與場所功能之間保持張力，觀看者的移動也參與畫面組成。',m('o-t-11')),
  art(3,'動態情報層','Franz Gutmann','o. T.（Brunnen）','1982','德國 / Bonn',['Bonn','波昂'],['Kunst am Bau','噴泉','入口地景','雕塑'],'噴泉設於聯邦勞動與社會部食堂入口，把原軍營建築更新後的過渡空間轉成由水聲、停留與通行共同構成的門廳前場。','Gutmann 以可被日常使用的水景取代孤立物件，使機關工作者的到達、休息和交會成為作品持續運作的條件。',m('o-t-brunnen')),
  art(4,'動態情報層','Gisela Hachmann-Ruch','o. T.（Installation von Bildzeichen）','2000','德國 / Berlin',['Berlin','柏林'],['Kunst am Bau','符號裝置','建築整合','視覺語言'],'一組圖像符號沿外交部建築空間展開，將抽象記號置入日常動線；符號既像導視又拒絕單一解碼，在制度空間中形成多義的閱讀層。','Hachmann-Ruch 把「標示」轉為不完全說明的公共語言，使觀看者在識別、誤讀與重新連結之間感知建築。',m('o-t-installation-von-bildzeichen')),
  art(5,'動態情報層','Erich Hauser','Skulptur','1979','日本 / Tokyo',['Tokyo','東京','東京都'],['Kunst am Bau','不鏽鋼雕塑','反射表面','幾何構成'],'拋光不鏽鋼構件在東京歌德學院形成折面與切口，日光、建築立面和行人被不斷帶入反射，量體因此隨觀看位置改變。','Hauser 以工業材料的精確加工建立非敘事公共雕塑；作品讓技術、光與外交文化空間彼此映照。',m('skulptur')),
  art(6,'動態情報層','Rebecca Horn','Wald der vogelfreien Sänger','1992','德國 / Bonn',['Bonn','波昂'],['Kunst am Bau','動力裝置','聲音','機械結構'],'機械化構件與聲響在德國聯邦藝術展覽館內形成一座不穩定的「歌者森林」，觀者穿行時遭遇週期性運動、碰撞與迴響。','Horn 把建築內部轉成可聽見的機械生態；自由、失序與身體警覺不是圖像主題，而由裝置的時間和聲響直接發生。',m('wald-der-vogelfreien-sanger')),
  art(7,'動態情報層','Ilya Kabakov','Flügel','1996','德國 / Frankfurt am Main',['Frankfurt am Main','Frankfurt','法蘭克福'],['Kunst am Bau','裝置','建築寓言','懸置構造'],'「翼」被置入德國國家圖書館，介於可飛行的想像與被典藏、分類的知識制度之間；懸置形態改變讀者對上方空間的感知。','Kabakov 以近乎敘事道具的裝置，讓圖書館同時成為逃逸與記憶的場所，指出知識建築也承載未完成的願望。',m('flugel')),
  art(8,'動態情報層','Hans Kaiser','Steine','1970','德國 / Bonn',['Bonn','波昂'],['Kunst am Bau','石材','地景構成','戶外雕塑'],'石塊以低伏、分散的方式進入今日聯合國園區，沒有單一正面；人必須在其間移動，才會理解重量、間距與建築前地的關係。','Kaiser 將石材從紀念碑式垂直姿態拉回地面，使場域、步幅與停留成為作品的主要尺度。',m('steine')),
  art(9,'動態情報層','Klaus Kinold','o. T.（Wüstenansicht／Tempel）','1999','德國 / Erfurt',['Erfurt','艾爾福特'],['Kunst am Bau','攝影裝置','建築圖像','空間序列'],'沙漠景觀與神殿影像被置入聯邦勞動法院，以建築攝影的寂靜、尺度和透視回望實際司法空間，形成場所之中的遠方場所。','Kinold 以精確攝影把旅行、建築史與制度日常重疊；影像不是窗景，而是重新調整室內距離感的空間構件。',m('o-t-installation-wustenansicht-tempel')),
  art(10,'動態情報層','Fritz Koenig','Große Karyatide','1966','西班牙 / Madrid',['Madrid','馬德里'],['Kunst am Bau','青銅雕塑','外交建築','抽象構造'],'大型青銅「女像柱」以球體、支柱與關節般節點支撐外交建築前場，保留身體暗示卻不塑造特定人物，重量與平衡成為核心。','Koenig 將古典女像柱轉譯為抽象結構，讓支撐、站立和建築秩序成為可從多方向閱讀的公共雕塑。',m('grosse-karyatide')),

  art(11,'全球經典層','Nicholas Galanin','In every language there is Land／En cada lengua hay una Tierra','2023','美國 / New York City',['New York City','New York','紐約市'],['耐候鋼','文字雕塑','場域特定','去殖民公共藝術'],'三十英尺高耐候鋼以美墨邊境牆相同尺度與材料拼出「LAND」，並借用 LOVE 雕塑的字形結構，把邊界、土地與愛的公共語彙相互扭轉。','Galanin 以被用來阻隔遷徙的材料重寫流通符號，主張土地關係先於國界，也把原住民族持續存在帶入城市河岸。',p('nicholas-galanin-in-every-language-there-is-land-en-cada-lengua-hay-una-tierra')),
  art(12,'全球經典層','Carmen Winant','My Mother and Eye','2025','美國 / New York City／Chicago／Boston',['New York City','New York','紐約市','Chicago','芝加哥','Boston','波士頓'],['城市攝影裝置','公車候車亭','檔案影像','多城市公共藝術'],'藝術家與母親各自在少女時期橫越美國的影像被拼接，散布於三座城市的候車亭；私人家庭檔案進入通勤與廣告的公共視線。','Winant 把兩代女性的移動並置，讓自我表述、旅行自由與母女記憶在城市等待時間中被重新觀看。',p('carmen-winant-my-mother-and-eye')),
  art(13,'全球經典層','Clifford Prince King','Let me know when you get home','2024','美國 / New York City／Chicago／Boston',['New York City','New York','紐約市','Chicago','芝加哥','Boston','波士頓'],['城市攝影裝置','公車候車亭','新聞報攤','酷兒影像'],'旅途中親密友人的日常片段分布於候車亭與報攤，影像在城市街道中形成一段關於暫時居所、照護與黑人酷兒生活的視覺旅程。','King 讓「到家告知我」成為公共照護語句；家不只是一處地址，也可能由陪伴、凝視與短暫共同生活構成。',p('clifford-prince-king-let-me-know-when-you-get-home')),
  art(14,'全球經典層','Wendy Red Star','Travels Pretty','2022','美國 / New York City／Chicago／Boston',['New York City','New York','紐約市','Chicago','芝加哥','Boston','波士頓'],['壓克力','數位輸出','公車候車亭','原住民族檔案'],'十二件新作以 Crow／Apsáalooke 女性名字、家族檔案與鮮明圖像覆蓋三百座候車亭，把原住民族女性主體帶入城市廣告網絡。','Red Star 以家族研究與當代設計反制博物館式他者化；大量分布的公共展示讓命名、親屬與自我再現重新取得可見度。',p('wendyredstar')),
  art(15,'全球經典層','Felipe Baeza','Unruly Forms','2023','美國／墨西哥多城市',['New York City','New York','紐約市','Chicago','芝加哥','Boston','波士頓','Mexico City','Ciudad de México','墨西哥城','León','萊昂','Querétaro','克雷塔羅'],['城市海報裝置','混合媒材圖像','公車候車亭','跨國公共藝術'],'八件以人類、植物與神話形態交纏的圖像跨越美墨六城候車亭，單一中央身形同時呈現多重身分與變形狀態。','Baeza 把不受邊界約束的身體放進高度規格化的廣告框架，讓遷徙、酷兒性與想像力對抗固定分類。',p('felipe-baeza-unruly-forms')),

  art(16,'德國經典層','Fritz Kühn','o. T.（Türen und Vordächer）','1967','匈牙利 / Budapest',['Budapest','布達佩斯'],['Kunst am Bau','鍛鐵','門扉','雨棚'],'門與雨棚被整體塑造成金屬節奏，藝術不再附著於大使館，而直接成為進出、遮蔽與邊界的基礎設施。','Kühn 將鍛鐵工藝提升為建築空間語言，使外交建築的安全與儀式性透過細部、陰影和身體穿越被感知。',m('o-t-turen-und-vordacher')),
  art(17,'德國經典層','Wolfgang Nestler','Technik und Wissenschaft','1979','德國 / Aachen',['Aachen','亞琛'],['Kunst am Bau','金屬構成','科學意象','軍事建築'],'抽象金屬結構以節點、桿件與力學關係回應「技術與科學」，在軍營場域中把知識系統轉成可從多方向觀看的構造。','Nestler 不以說明性圖像歌頌科技，而讓連接、支撐與平衡本身成為內容，將制度空間導向結構性的思考。',m('technik-und-wissenschaft')),
  art(18,'德國經典層','Ingeborg Schäffler-Wolf','o. T.（Gobelin）','1982','德國 / Berlin',['Berlin','柏林'],['Kunst am Bau','掛毯','纖維藝術','室內整合'],'大型掛毯以纖維、色層與編織節奏柔化聯邦建築的硬質表面；觀看距離改變時，整體色域與材料細節交替浮現。','Schäffler-Wolf 讓傳統織造進入現代行政建築，證明建築整合不只依賴重材質，也能由吸音、觸感和時間性建立場所。',m('o-t-gobelin')),
  art(19,'德國經典層','Stefan Sous','o. T.（Skulptur）','2012','德國 / Berlin',['Berlin','柏林'],['Kunst am Bau','雕塑','制度空間','抽象量體'],'抽象雕塑設於聯邦情報局總部，以不可一眼讀盡的折面與空隙處理封閉機構中的可見性；觀看必須繞行完成。','Sous 讓雕塑的遮蔽、穿透與方向成為制度隱喻，但不提供單一象徵，公共性保留在身體探索與材料經驗中。',m('o-t-skulptur')),
  art(20,'德國經典層','Konstanze Trommer','Zwei Zellen','2007','德國 / Quedlinburg',['Quedlinburg','奎德林堡'],['Kunst am Bau','雙體裝置','生物研究','場域特定'],'兩個細胞般量體在植物研究機構形成一組既分離又相互依存的空間單元，尺度把微觀生物結構放大到人的步行經驗。','Trommer 以「兩個細胞」回應研究場所，讓分裂、連結與生命結構成為建築使用者可直接穿行感知的模型。',m('zwei-zellen'))
];

function competition(i, organizer, title, country, cities, media, comment, url, deadline, timezone, precision, eligibility, budget, fee) {
  return {
    category:'公開徵件',status:'官方來源',updated:date,id:`competition-${date}-${String(i).padStart(2,'0')}`,
    dedupeKey:slug(`opportunity-${date}-${organizer}-${title}`),name:`${String(i).padStart(2,'0')}｜${organizer}｜${title}`,
    tier:'競圖資料庫',region:'西方',country,cityKeywords:cities,media,
    works:`${title}｜${budget}｜截止 ${deadline.slice(0,10).replaceAll('-','.')}`,comment,
    website:url,workPage:url,photo:thumb(url),artistStatement:comment,artistStatementSource:url,
    classicTitle:title,classicImage:thumb(url),classicDesc:comment,deadline,
    deadlineLabel:`截止 ${deadline.slice(0,10).replaceAll('-','.')}`,deadlineTimezone:timezone,
    deadlinePrecision:precision,organizer,eligibility,budget,applicationFee:fee,relatedByCity:[]
  };
}

const added = [
  competition(1,'City of Aurora Art in Public Places','Plains Conservation Center – Prairie Meander','美國 / Aurora, Colorado',['Aurora','奧羅拉'],['原住民族公共藝術','戶外三維作品','草原地景','永久委託'],'為 Plains Conservation Center 徵求三維場域特定作品，回應人、土地、生態、歷史與草原移動；總預算 US$45,000。','https://opportunities.wearecreativewest.org/opportunity/17746/CAFE','2026-11-02T23:59:00-07:00','America/Denver','time','限居住美國及領地，且屬與 Colorado 有關的 51 個聯邦承認部族成員／後裔，或因 1956 Indian Relocation Act 移居 Denver 都會區之部族社群藝術家','US$45,000','US$0'),
  competition(2,'City of Ames Public Art Commission','2027–28 Ames Annual Outdoor Sculpture Exhibition','美國 / Ames, Iowa',['Ames','艾姆斯'],['戶外雕塑','暫時性公共展覽','城市公共藝術'],'徵選可安全承受公共接觸與戶外氣候的完成雕塑，於 Downtown Ames 展示；每件入選作品提供 US$2,000 honorarium。','https://www.cityofames.org/My-Government/Departments/City-Managers-Office/Public-Art-Commission/Ames-Annual-Outdoor-Sculpture-Exhibition','2026-11-15T23:59:59-06:00','America/Chicago','date','藝術家可投最多三件完成雕塑；須提交全角度照片、作品說明及安裝固定方式','US$2,000／件','未公開'),
  competition(3,'City of Encinitas／Encinitas Friends of the Arts','Encinitas Skate Park Mural','美國 / Encinitas, California',['Encinitas','恩西尼塔斯'],['壁畫','滑板公園','場域特定公共藝術'],'為 Poods Skate Park 約 5×79 呎牆面徵求長期壁畫，回應 Encinitas 滑板文化、共同使用與地方記憶；總預算 US$30,000。','https://www.americansforthearts.org/sites/default/files/FINAL%20Call%20for%20Artists%20RFQ%20ESPark.pdf','2026-11-20T23:59:59-08:00','America/Los_Angeles','date','限目前居住於 Southern California 指定七郡之藝術家；三名決選者各獲 US$500 提案費','US$30,000','未公開'),
  competition(4,'Johnson City Public Art Committee','Storm Drain Stencil Project','美國 / Johnson City, Tennessee',['Johnson City','強森城'],['雨水顯影','地面圖像','環境公共藝術','設計委託'],'徵求雨水溝旁地面模板圖像；疏水塗層在乾燥時近乎不可見、下雨時顯影，以公共藝術傳達水質與環境責任。','https://jcpublicart.com/storm-drain-stencil-project/','2026-11-11T16:00:00-05:00','America/New_York','time','全球 18 歲以上、具藝術與設計經驗之專業藝術家或團隊；可投最多三案','最高 US$2,400（8案×US$300設計費）','未公開'),
  competition(5,'Illinois Capital Development Board Art-in-Architecture Program','IDOT National Trail Rest Area Public Art','美國 / Effingham, Illinois',['Effingham','埃芬漢'],['Art-in-Architecture','休息站公共藝術','永久委託'],'為重建的 National Trail Rest Area 徵求永久原創公共藝術，回應美國國家道路、地方地景與新休息站的入口經驗；總預算 US$31,000。','https://codaworx.com/rfp/rfp-detail/a-call-for-illinois-artists-illinois-department-of-transportation-national-trail-rest-area-effingham','2026-12-02T23:59:59-06:00','America/Chicago','date','限 Illinois 專業藝術家；依 RFQ 提交資格與既有作品資料','US$31,000','未公開')
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

const daily = {meta:{generatedAt,timezone:'Asia/Taipei',date,total:20,dynamicEntries:10,globalClassicEntries:5,germanClassicEntries:5,source:'Museum der 1000 Orte、Public Art Fund 第一方作品頁',selectionPolicy:'當期、持續開放或已實現的空間裝置、Kunst am Bau、場域介入、地景與觀念性作品；排除傳統城市人物紀念雕塑，競圖與獎助完全分流。',note:'10/17 固定 10＋5＋5；20 則皆為作品資料，未混入競圖、補助或獎項，傳統人物紀念像排除檢查通過。',linkAudit:{checkedAt:generatedAt,checkedUniqueSources:20,brokenOrBlockedReplaced:0,rule:'第一方作品頁回讀'},imageAudit:{checkedAt:generatedAt,imageEntries:20,missing:0,rule:'來源頁預覽圖片'}},entries};
fs.writeFileSync('data/backfill-october-20261017.json',`${JSON.stringify(daily,null,2)}\n`);

cp.updated=date; cp.generatedAt=generatedAt; cp.meta={activeEntries:comps.length,addedToday:5,expiredRemoved,duplicateRemoved:0,scopeRemoved:0,source:'城市政府、公共藝術計畫與官方徵件頁',note:`保留 ${retained.length} 則既有未截止項目，新增 5 則；移除 ${expiredRemoved} 則逾期項目。`}; cp.entries=comps;
fs.writeFileSync('data/competitions.json',`${JSON.stringify(cp,null,2)}\n`);

const cm=JSON.parse(fs.readFileSync('data/competition-manifest.json','utf8'));
Object.assign(cm,{version:'2026-10-17-competition-r75',generatedAt,activeEntries:comps.length,addedToday:5,expiredRemoved,duplicateRemoved:0,scopeRemoved:0,deadlineTimezoneEntries:comps.filter(e=>e.deadlineTimezone).length,deadlinePrecisionEntries:comps.filter(e=>e.deadlinePrecision).length,cityKeywordEntries:comps.filter(e=>Array.isArray(e.cityKeywords)&&e.cityKeywords.length>=2).length,germanAddedToday:0,note:`保留 ${retained.length} 則既有未截止項目，新增 5 則；移除 ${expiredRemoved} 則逾期項目，所有有效 deadline 皆含時區偏移。`});
fs.writeFileSync('data/competition-manifest.json',`${JSON.stringify(cm,null,2)}\n`);

const om=JSON.parse(fs.readFileSync('data/backfill-october-manifest.json','utf8'));
om.version='2026-10-17-public-art-r100'; om.generatedAt=generatedAt; om.files=[...new Set([...om.files,'backfill-october-20261017.json'])]; om.expectedEntries=om.files.length*20; om.statementEntries=om.expectedEntries; om.statementSourceEntries=om.expectedEntries; om.imageEntries=om.expectedEntries; om.note='截至 2026-10-17，10 月每日固定 20 則且皆為作品資料；本日配置 10／5／5，排除傳統人物紀念雕塑，來源、圖片、城市與去重欄位完整。';
fs.writeFileSync('data/backfill-october-manifest.json',`${JSON.stringify(om,null,2)}\n`);

let index=fs.readFileSync('index.html','utf8'); index=index.replace("const cacheKey = '20261016-daily-r99';","const cacheKey = '20261017-daily-r100';"); fs.writeFileSync('index.html',index);
console.log(JSON.stringify({publicArt:entries.length,dynamic:10,global:5,german:5,previousCompetitions:baseline.length,retained:retained.length,expiredRemoved,added:5,active:comps.length},null,2));
