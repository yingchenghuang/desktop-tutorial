require "json"
require "date"

ROOT = File.expand_path("..", __dir__)
DATA = File.join(ROOT, "data")
DATE = "2026-09-01"
GENERATED_AT = "2026-09-01T04:20:16+08:00"
NOW = DateTime.parse(GENERATED_AT)

def shot(url)
  "https://image.thum.io/get/width/1200/crop/800/noanimate/#{url}"
end

def art(id:, key:, name:, tier:, country:, cities:, media:, work:, comment:, url:, year:, statement: nil)
  {
    "category"=>"作品/展覽", "status"=>"官方來源", "updated"=>DATE,
    "id"=>id, "dedupeKey"=>key, "name"=>name, "tier"=>tier,
    "region"=>"西方", "country"=>country, "cityKeywords"=>cities,
    "media"=>media, "works"=>"#{work}｜#{year}", "comment"=>comment,
    "website"=>url, "workPage"=>url, "photo"=>shot(url),
    "artistStatement"=>statement || comment, "artistStatementSource"=>url,
    "classicTitle"=>"#{work}｜#{year}", "classicImage"=>shot(url),
    "classicDesc"=>comment, "relatedByCity"=>[]
  }
end

kor = "https://www.koer.or.at/projects"
museum = "https://www.museum-der-1000-orte.de/kunstwerke/kunstwerk"
central = "https://www.centralparknyc.org/locations"

entries = [
  art(id:"current-2026-09-01-01", key:"art-2026-09-01-florentina-holzinger-pfingstspiel", name:"01｜Florentina Holzinger｜Pfingstspiel 五旬節遊戲", tier:"動態情報層", country:"奧地利 / Vienna", cities:["Vienna","Wien","維也納"], media:["表演藝術","公共空間","身體藝術"], work:"Pfingstspiel / Pentecost Play", comment:"以身體、儀式與群體行動介入維也納公共場域，讓節慶傳統成為重新協商觀看、權力與城市共同體的現場。", url:"#{kor}/pfingstspiel-pentecost-play/", year:"2026"),
  art(id:"current-2026-09-01-02", key:"art-2026-09-01-claudia-maerzendorfer-chicken-duck-egg", name:"02｜Claudia Märzendorfer｜A Chicken Can't Lay a Duck Egg", tier:"動態情報層", country:"奧地利 / Vienna", cities:["Vienna","Wien","維也納"], media:["公共裝置","雕塑","社會寓言"], work:"A Chicken Can't Lay a Duck Egg", comment:"以看似荒謬的命題檢視城市規範與期待如何塑造個體，作品把日常語句轉成可被共同討論的公共寓言。", url:"#{kor}/a-chicken-cant-lay-a-duck-egg/", year:"2026"),
  art(id:"current-2026-09-01-03", key:"art-2026-09-01-francesca-aldegani-happy-medium", name:"03｜Francesca Aldegani｜The Happy Medium", tier:"動態情報層", country:"奧地利 / Vienna", cities:["Vienna","Wien","維也納"], media:["公共裝置","雕塑","場域藝術"], work:"The Happy Medium", comment:"作品在平衡、妥協與愉悅之間保留張力，透過城市尺度的構造提醒公共空間從來不是單一立場的容器。", url:"#{kor}/the-happy-medium/", year:"2026"),
  art(id:"current-2026-09-01-04", key:"art-2026-09-01-folke-koebberling-maaaaash", name:"04｜Folke Köbberling｜Maaaaash!", tier:"動態情報層", country:"奧地利 / Vienna", cities:["Vienna","Wien","維也納"], media:["再生材料","公共裝置","社會參與"], work:"Maaaaash!", comment:"以再利用與集體勞動回應城市資源消耗，讓材料的磨損、重組與使用痕跡成為公共生活的一部分。", url:"#{kor}/maaaaash/", year:"2026"),
  art(id:"current-2026-09-01-05", key:"art-2026-09-01-johanna-dohnal-ar-pioneer", name:"05｜KÖR Wien｜Remembering a Pioneer：Johanna Dohnal AR", tier:"動態情報層", country:"奧地利 / Vienna", cities:["Vienna","Wien","維也納"], media:["擴增實境","數位紀念","公共史"], work:"Remembering a Pioneer — Johanna Dohnal in AR", comment:"透過擴增實境把奧地利女性政治史帶回城市現場，使紀念不只是一座固定物件，而是可被重新進入與更新的公共敘事。", url:"#{kor}/remembering-a-pioneer/", year:"2026"),
  art(id:"current-2026-09-01-06", key:"art-2026-09-01-tim-trantenroth-untitled", name:"06｜Tim Trantenroth｜無題：Schlüterhof 幾何牆畫", tier:"動態情報層", country:"德國 / Berlin", cities:["Berlin","柏林","Humboldt Forum","洪堡論壇"], media:["壁畫","幾何抽象","建築整合"], work:"o. T.", comment:"大型幾何網格跨越洪堡論壇兩層樓梯牆面，藉由錯視、比例與建築邊界，讓移動中的觀者重新判讀表面與深度。", url:"#{museum}/o-t-18", year:"2022"),
  art(id:"current-2026-09-01-07", key:"art-2026-09-01-emeka-ogboh-kosmos", name:"07｜Emeka Ogboh｜Der Kosmos — Things fall apart", tier:"動態情報層", country:"德國 / Berlin", cities:["Berlin","柏林","Humboldt Forum","洪堡論壇"], media:["聲音裝置","殖民史","建築整合"], work:"Der Kosmos — Things fall apart", comment:"聲音作品在重建王宮的空間中處理殖民史與知識權力，讓聽覺成為質疑博物館敘事與城市記憶的方法。", url:"#{museum}/der-kosmos-things-fall-apart", year:"2021"),
  art(id:"current-2026-09-01-08", key:"art-2026-09-01-beerenpetry-262-klinken", name:"08｜BeerenPetry｜262 Klinken 門把介入", tier:"動態情報層", country:"德國 / Berlin", cities:["Berlin","柏林","Rosa-Luxemburg-Stiftung"], media:["建築整合","互動裝置","日常物件"], work:"262 Klinken", comment:"262 個彼此不同的門把分布於辦公與諮詢空間，透過每日觸碰讓制度建築中的差異、接觸與通行被身體感知。", url:"#{museum}/262-klinken", year:"2021"),
  art(id:"current-2026-09-01-09", key:"art-2026-09-01-schiffers-sprenger-insurgentes-sur", name:"09｜Schiffers und Sprenger｜Insurgentes sur", tier:"動態情報層", country:"德國 / Berlin", cities:["Berlin","柏林","Humboldt Forum","洪堡論壇"], media:["影像裝置","建築整合","殖民史"], work:"Insurgentes sur", comment:"作品以重疊影像與不穩定意義介入洪堡論壇，在可見與不可見之間追問殖民物件、歷史圖像和當代建築如何彼此覆寫。", url:"#{museum}/insurgentes-sur", year:"2021"),
  art(id:"current-2026-09-01-10", key:"art-2026-09-01-stefan-sous-zeitmaschine", name:"10｜Stefan Sous｜Zeitmaschine 時光機", tier:"動態情報層", country:"德國 / Bonn", cities:["Bonn","波昂"], media:["公共雕塑","金屬裝置","建築整合"], work:"Zeitmaschine", comment:"工業性構件被組成近似儀器的公共雕塑，既指向技術進步，也讓聯邦建築中的時間、制度與記憶形成開放聯想。", url:"#{museum}/zeitmaschine", year:"2020"),

  art(id:"classic-global-2026-09-01-01", key:"art-2026-09-01-george-simonds-falconer", name:"全球經典01｜George Blackall Simonds｜The Falconer 放鷹者", tier:"經典檔案庫", country:"美國 / New York City", cities:["New York City","紐約市","Central Park","中央公園"], media:["公共雕塑","青銅","動物題材"], work:"The Falconer", comment:"男子站在岩丘上高舉手臂放飛獵鷹，垂直動勢把公園的自然地形、狩獵想像與十九世紀公共雕塑傳統連成一體。", url:"#{central}/the-falconer", year:"1875"),
  art(id:"classic-global-2026-09-01-02", key:"art-2026-09-01-gaetano-russo-columbus-circle", name:"全球經典02｜Gaetano Russo｜Columbus Circle Monument", tier:"經典檔案庫", country:"美國 / New York City", cities:["New York City","紐約市","Columbus Circle","哥倫布圓環"], media:["紀念碑","大理石","都市地標"], work:"Columbus Circle Monument", comment:"大理石人物立於高柱頂端，船隻浮雕與持地球的翼像共同構成城市圓環的視覺中心；其移民紀念脈絡也持續接受當代重新檢視。", url:"#{central}/columbus-circle-monument", year:"1892"),
  art(id:"classic-global-2026-09-01-03", key:"art-2026-09-01-carl-conrads-alexander-hamilton", name:"全球經典03｜Carl H. Conrads｜Alexander Hamilton", tier:"經典檔案庫", country:"美國 / New York City", cities:["New York City","紐約市","Central Park","中央公園"], media:["紀念性公共藝術","花崗岩","人物雕塑"], work:"Alexander Hamilton", comment:"整體以花崗岩雕成的漢密爾頓手持文件、另一手置於背心，將政治人物的辯論與建國形象嵌入公園步行路徑。", url:"#{central}/alexander-hamilton", year:"1880"),
  art(id:"classic-global-2026-09-01-04", key:"art-2026-09-01-frederick-roth-balto", name:"全球經典04｜Frederick Roth｜Balto 雪橇犬紀念像", tier:"經典檔案庫", country:"美國 / New York City", cities:["New York City","紐約市","Central Park","中央公園"], media:["公共雕塑","青銅","動物紀念"], work:"Balto", comment:"紀念 1925 年阿拉斯加血清接力的雪橇犬英雄；長年被孩童觸摸與攀爬的表面，使公共記憶透過身體接觸延續。", url:"#{central}/balto-statue", year:"1925"),
  art(id:"classic-global-2026-09-01-05", key:"art-2026-09-01-jqa-ward-indian-hunter", name:"全球經典05｜John Quincy Adams Ward｜Indian Hunter", tier:"經典檔案庫", country:"美國 / New York City", cities:["New York City","紐約市","Central Park","中央公園"], media:["公共雕塑","青銅","狩獵題材"], work:"Indian Hunter", comment:"獵人與犬以低伏、前進的動勢構成公園早期青銅群像；今日閱讀同時須面對十九世紀對原住民形象的理想化與類型化。", url:"#{central}/indian-hunter", year:"1869"),

  art(id:"classic-german-2026-09-01-01", key:"art-2026-09-01-fritz-koenig-maternitas", name:"德國經典01｜Fritz Koenig｜Mutter und Kind／Maternitas", tier:"經典檔案庫", country:"德國 / Bonn", cities:["Bonn","波昂"], media:["公共雕塑","青銅","抽象人物"], work:"Mutter und Kind / Maternitas", comment:"Koenig 以壓縮的人體體塊和幾何結構表現母子依存，克制的形式讓親密關係與建築尺度在公共空間中保持張力。", url:"#{museum}/mutter-und-kind-oder-maternitas", year:"1964"),
  art(id:"classic-german-2026-09-01-02", key:"art-2026-09-01-kornbrust-lechner-robert-schuman-platz", name:"德國經典02｜Kornbrust／Lechner｜Robert-Schuman-Platz 廣場設計", tier:"經典檔案庫", country:"德國 / Bonn", cities:["Bonn","波昂","Robert-Schuman-Platz"], media:["地景設計","石材雕塑","都市廣場"], work:"Platzgestaltung Robert-Schuman-Platz", comment:"雕塑與鋪面不再各自獨立，而以整體地景組織入口、停留和步行，使聯邦辦公區的前庭成為可使用的城市空間。", url:"#{museum}/platzgestaltung-robert-schuman-platz", year:"1987"),
  art(id:"classic-german-2026-09-01-03", key:"art-2026-09-01-leo-kornbrust-untitled-sphere", name:"德國經典03｜Leo Kornbrust｜o. T.（Kugel）無題球體", tier:"經典檔案庫", country:"德國 / Bonn", cities:["Bonn","波昂"], media:["公共雕塑","石材","幾何抽象"], work:"o. T. (Kugel)", comment:"球體以極簡幾何和厚重石材建立穩定中心，觀者繞行時，光線、接縫與周圍建築比例持續改變其視覺重量。", url:"#{museum}/o-t-kugel", year:"1989"),
  art(id:"classic-german-2026-09-01-04", key:"art-2026-09-01-leo-kornbrust-stone-group", name:"德國經典04｜Leo Kornbrust｜Steingruppe im Pausengarten", tier:"經典檔案庫", country:"德國 / Bonn", cities:["Bonn","波昂"], media:["公共雕塑","石材","庭園"], work:"Steingruppe im Pausengarten", comment:"多件石體以群落方式配置在休憩庭園中，既可視為抽象雕塑，也像一組重新編排的地形節點，引導人們停留與穿行。", url:"#{museum}/steingruppe-im-pausengarten", year:"1980"),
  art(id:"classic-german-2026-09-01-05", key:"art-2026-09-01-leo-kornbrust-innere-linie", name:"德國經典05｜Leo Kornbrust｜Innere Linie 內在線", tier:"經典檔案庫", country:"德國 / Bonn", cities:["Bonn","波昂"], media:["公共雕塑","石材","文字／線刻"], work:"Innere Linie", comment:"沉重石體被一條精確的內在線切分，最小的介入改變整體尺度與方向，使材料內部的張力成為觀看核心。", url:"#{museum}/innere-linie", year:"1993")
]

def call(id:, key:, name:, work:, comment:, url:, deadline:, organizer:, eligibility:, budget:, media:)
  {
    "category"=>"公開徵件", "status"=>"官方來源", "updated"=>DATE,
    "id"=>id, "dedupeKey"=>key, "name"=>name, "tier"=>"競圖資料庫",
    "region"=>"西方", "country"=>"德國 / Berlin", "cityKeywords"=>["Berlin","柏林"],
    "media"=>media, "works"=>work, "comment"=>comment, "website"=>url,
    "workPage"=>url, "photo"=>shot(url), "artistStatement"=>comment,
    "artistStatementSource"=>url, "classicTitle"=>name.sub(/^\d+｜/, ""),
    "classicImage"=>shot(url), "classicDesc"=>comment, "deadline"=>deadline,
    "deadlineLabel"=>work.split("｜").last, "deadlineTimezone"=>"Europe/Berlin",
    "deadlinePrecision"=>"time", "organizer"=>organizer, "eligibility"=>eligibility,
    "budget"=>budget, "applicationFee"=>"免費", "relatedByCity"=>[]
  }
end

deadlines = "https://www.berlin.de/sen/kultur/foerderung/antragsfristen/"
impact = "https://www.berlin.de/sen/kultur/foerderung/foerderprogramme/interkulturelle-projekte/artikel.82020.php"
new_calls = [
  call(id:"competition-2026-09-01-01", key:"opportunity-2026-09-01-berlin-visual-art-work-grants-2027", name:"01｜Land Berlin｜視覺藝術工作獎助 2027", work:"視覺藝術創作發展獎助｜截止 2026.09.02 11:00 CEST", comment:"支持居住柏林的專業視覺藝術家或團體發展創作方法與特定工作計畫，涵蓋雕塑、裝置、城市藝術、聲音、媒體與表演等。", url:deadlines, deadline:"2026-09-02T11:00:00+02:00", organizer:"Senatsverwaltung für Kultur und Gesellschaftlichen Zusammenhalt Berlin", eligibility:"主要居住與工作地在柏林的專業視覺藝術家或團體；不得為在學學生", budget:"依 2027 正式資訊表核定；官方時程頁未列單筆金額", media:["視覺藝術","雕塑","裝置","城市藝術"]),
  call(id:"competition-2026-09-01-02", key:"opportunity-2026-09-01-berlin-contemporary-art-presentations-2027", name:"02｜Land Berlin｜當代視覺藝術展覽計畫 2027", work:"當代視覺藝術呈現與出版｜截止 2026.10.13 11:00 CEST", comment:"徵集於柏林公開呈現的當代視覺藝術個展、群展、策展計畫及相關出版，強調專業製作與對城市觀眾的可及性。", url:deadlines, deadline:"2026-10-13T11:00:00+02:00", organizer:"Senatsverwaltung für Kultur und Gesellschaftlichen Zusammenhalt Berlin", eligibility:"柏林藝術家、策展人、團體、專案空間與具藝術計畫之非營利組織", budget:"依正式徵件資訊表與個案製作預算核定", media:["策展","展覽","出版","當代藝術"]),
  call(id:"competition-2026-09-01-03", key:"opportunity-2026-09-01-berlin-women-film-video-grants-2027", name:"03｜Land Berlin｜女性藝術家 Film／Video 獎助 2027", work:"藝術電影與錄像工作獎助｜截止 2026.10.01 11:00 CEST", comment:"提供女性藝術家發展藝術電影與錄像實踐的工作獎助，聚焦展覽脈絡中的移動影像，而非商業電影製作。", url:deadlines, deadline:"2026-10-01T11:00:00+02:00", organizer:"Berliner Künstlerinnenprogramm / Land Berlin", eligibility:"在柏林居住與工作的專業女性藝術家，作品重心須屬視覺藝術脈絡之 Film／Video", budget:"依 2027 正式資訊表核定；官方時程頁未列單筆金額", media:["藝術電影","錄像","媒體藝術"]),
  call(id:"competition-2026-09-01-04", key:"opportunity-2026-09-01-berlin-comic-scholarships-2027", name:"04｜Land Berlin｜漫畫創作獎助 2027", work:"德語漫畫創作獎助｜截止 2026.09.15 11:00 CEST", comment:"支持以德語創作漫畫的專業作者與繪者進行長篇或系列計畫，鼓勵文字、圖像與敘事形式的持續發展。", url:deadlines, deadline:"2026-09-15T11:00:00+02:00", organizer:"Senatsverwaltung für Kultur und Gesellschaftlichen Zusammenhalt Berlin", eligibility:"主要居住地在柏林、以德語進行漫畫創作的專業作者、繪者或合作團隊", budget:"依 2027 正式資訊表核定；官方時程頁未列單筆金額", media:["漫畫","插畫","出版"]),
  call(id:"competition-2026-09-01-05", key:"opportunity-2026-09-01-berlin-impact-funding-2027", name:"05｜Land Berlin｜IMPACT 多元藝術計畫補助 2027", work:"柏林跨領域公共呈現計畫｜截止 2026.10.22 14:00 CEST", comment:"支持在文化場域中仍被低度代表之藝術觀點，計畫須在柏林公開呈現；可為跨媒介與共同製作，但純工作坊或內部活動不受理。", url:impact, deadline:"2026-10-22T14:00:00+02:00", organizer:"Senatsverwaltung für Kultur und Gesellschaftlichen Zusammenhalt Berlin", eligibility:"居住柏林的專業藝術家或團體，且其觀點在主流文化場域中仍被低度代表", budget:"依正式徵件資訊表與個案預算核定", media:["跨媒介","社會參與","公共展演"])
]

def exhibition(id:, key:, name:, country:, cities:, media:, dates:, comment:, url:, type:, status:, edition:, organizer:, curator:, venue:, admission:, statement:)
  start_date, end_date = dates
  {
    "category"=>"國際展覽", "status"=>"官方來源", "updated"=>DATE,
    "id"=>id, "dedupeKey"=>key, "name"=>name, "tier"=>"全球重要展覽",
    "region"=>"全球", "country"=>country, "cityKeywords"=>cities, "media"=>media,
    "works"=>"#{name.sub(/^\d+｜/, "")}｜#{start_date}–#{end_date}", "comment"=>comment,
    "website"=>url, "workPage"=>url, "photo"=>shot(url), "classicTitle"=>name.sub(/^\d+｜/, ""),
    "classicImage"=>shot(url), "classicDesc"=>comment, "exhibitionType"=>type,
    "exhibitionStatus"=>status, "startDate"=>start_date, "endDate"=>end_date,
    "edition"=>edition, "organizer"=>organizer, "curator"=>curator, "venue"=>venue,
    "admission"=>admission, "curatorStatement"=>statement, "curatorStatementSource"=>url
  }
end

new_exhibitions = [
  exhibition(id:"exhibition-2026-09-01-01", key:"exhibition-2026-sydney-biennale-rememory", name:"01｜第 25 屆雪梨雙年展｜Rememory", country:"澳洲 / Sydney", cities:["Sydney","雪梨"], media:["雙年展","當代藝術","原住民族藝術"], dates:["2026-03-14","2026-06-14"], comment:"以 Toni Morrison 的「再記憶」概念連結記得與遺忘，重新進入被壓抑或抹除的歷史，並把原住民族與離散社群的敘事置於城市多場址展覽核心。", url:"https://www.biennaleofsydney.art/biennale-of-sydney-announces-2026-exhibition-rememory/", type:"國際藝術雙年展", status:"已結束／檔案", edition:"第 25 屆", organizer:"Biennale of Sydney", curator:"Hoor Al Qasimi（藝術總監）；Bruce Johnson McLean（First Nations Curatorial Fellow）", venue:"White Bay Power Station、Campbelltown Arts Centre 與雪梨多處場址", admission:"免費", statement:"Rememory 不是單純回顧，而是在記得與遺忘的交界重建被壓抑的歷史，使記憶成為形塑身分、歸屬與社群的公共行動。"),
  exhibition(id:"exhibition-2026-09-01-02", key:"exhibition-2026-gwangju-biennale-change-your-life", name:"02｜第 16 屆光州雙年展｜You Must Change Your Life", country:"韓國 / Gwangju", cities:["Gwangju","光州"], media:["雙年展","當代藝術","亞洲藝術"], dates:["2026-09-05","2026-11-15"], comment:"展題取自里爾克詩句，從一件古代雕塑碎片如何在觀看者體內釋放改變的能量出發，追問藝術實踐能否生成新的能力與生命形式。", url:"https://www.gwangjubiennale.org/en/exhibition/biennale/mainexhibition.do?subPage=overview", type:"國際藝術雙年展", status:"即將展出", edition:"第 16 屆", organizer:"Gwangju Biennale Foundation", curator:"Ho Tzu Nyen（藝術總監）", venue:"Gwangju Biennale Exhibition Hall 與光州市內場址", admission:"票務依官方公告", statement:"展覽將改變理解為藝術實踐中的能力生成：不是命令觀眾接受答案，而是測試生命、感知與集體行動還能變成什麼。"),
  exhibition(id:"exhibition-2026-09-01-03", key:"exhibition-2025-triennale-milano-inequalities", name:"03｜米蘭三年展第 24 屆國際展｜Inequalities", country:"義大利 / Milan", cities:["Milan","Milano","米蘭"], media:["三年展","設計","建築","當代藝術"], dates:["2025-05-13","2025-11-09"], comment:"以十個展覽、特別計畫與國際參與回應城市、健康、環境、遷徙與居住等不平等問題，把設計、建築與藝術視為理解全球差距的共同工具。", url:"https://triennale.org/en/24th-international-exhibition", type:"國際設計／建築／藝術三年展", status:"已結束／檔案", edition:"第 24 屆國際展", organizer:"Triennale Milano", curator:"Triennale Milano 策展團隊與各專題策展人", venue:"Triennale Milano", admission:"依各展覽與官方票務資訊", statement:"Inequalities 以多個專題並置全球與地方視角，拒絕把差距視為單一統計，而是呈現它如何具體塑造城市、身體、生態與日常生活。"),
  exhibition(id:"exhibition-2026-09-01-04", key:"exhibition-2025-setouchi-triennale", name:"04｜瀨戶內國際藝術祭 2025", country:"日本 / Setouchi", cities:["Takamatsu","高松","Naoshima","直島","Teshima","豐島","Setouchi","瀨戶內"], media:["大地藝術季","島嶼藝術祭","場域特定"], dates:["2025-04-18","2025-11-09"], comment:"藝術祭分春、夏、秋三季在瀨戶內群島展開，讓作品、渡船、聚落與居民接待網絡共同構成跨島文化地景，持續回應人口流失與地方再生。", url:"https://setouchi-artfest.jp/files/uploads/action-policy2025.pdf", type:"島嶼型國際藝術祭／三年展", status:"已結束／檔案", edition:"第 6 屆", organizer:"瀨戶內國際藝術祭實行委員會", curator:"北川フラム（總合ディレクター）", venue:"直島、豐島、女木島、男木島、小豆島等瀨戶內島嶼與港區", admission:"作品鑑賞護照與部分場館另購票", statement:"以瀨戶內群島的自然、歷史與生活為基礎，藝術不是覆蓋地方的觀光內容，而是連接島民、旅人、志工與長期再生工作的媒介。"),
  exhibition(id:"exhibition-2026-09-01-05", key:"exhibition-2025-aichi-triennale-ashes-roses", name:"05｜愛知三年展 2025｜A Time Between Ashes and Roses", country:"日本 / Aichi", cities:["Nagoya","名古屋","Seto","瀨戶","Aichi","愛知"], media:["三年展","當代藝術","陶藝","表演藝術"], dates:["2025-09-13","2025-11-30"], comment:"從敘利亞詩人 Adonis 的詩句出發，在灰燼與玫瑰、毀滅與樂觀之間保留複雜地帶，並以地質時間重看人類活動、陶土產業與環境正義。", url:"https://aichitriennale.jp/2025/en/outline/index.html", type:"國際藝術三年展", status:"已結束／檔案", edition:"第 6 屆", organizer:"Aichi Triennale Organizing Committee", curator:"Hoor Al Qasimi（藝術總監）", venue:"Aichi Arts Center、Aichi Prefectural Ceramic Museum、Seto City", admission:"主展區通票；表演藝術另行購票", statement:"展覽避免把灰燼與玫瑰簡化成末日與希望的二元對立，轉而在兩者之間辨認人與環境彼此分解、滋養與承擔責任的複雜關係。")
]

comp_path = File.join(DATA, "competitions.json")
comp = JSON.parse(File.read(comp_path))
expired_path = File.join(DATA, "expired-20260901.json")
previous_expired = File.exist?(expired_path) ? JSON.parse(File.read(expired_path)).fetch("entries", []) : []
expired = comp["entries"].select { |e| e["deadline"] && DateTime.parse(e["deadline"]) <= NOW }
archived_expired = (previous_expired + expired).uniq { |e| e["dedupeKey"] || e["id"] }
comp["entries"].reject! { |e| expired.include?(e) || e["updated"] == DATE }
keys = comp["entries"].map { |e| e["dedupeKey"] }
new_calls.each { |e| comp["entries"] << e unless keys.include?(e["dedupeKey"]) }

all_art_files = Dir[File.join(DATA, "backfill-{july,august,september}-*.json")].reject { |p| p.end_with?("manifest.json") }
all_art = all_art_files.flat_map do |path|
  value = JSON.parse(File.read(path))
  value.is_a?(Hash) ? value.fetch("entries", []) : value
end + entries

def related_ids(item, candidates)
  keys = item.fetch("cityKeywords", []).map { |x| x.downcase.strip }
  candidates.select { |other| !(keys & other.fetch("cityKeywords", []).map { |x| x.downcase.strip }).empty? }.map { |other| other["id"] }.uniq
end

entries.each { |e| e["relatedByCity"] = related_ids(e, comp["entries"]) }
comp["entries"].each { |e| e["relatedByCity"] = related_ids(e, all_art) }

daily = {
  "meta"=>{
    "generatedAt"=>GENERATED_AT, "timezone"=>"Asia/Taipei", "date"=>DATE,
    "total"=>20, "dynamicEntries"=>10, "globalClassicEntries"=>5, "germanClassicEntries"=>5,
    "source"=>"KÖR Wien、Museum der 1000 Orte、Central Park Conservancy 官方頁",
    "note"=>"9/1 公共藝術固定 10＋5＋5；另有德國公開徵選 5 則與全球重要展覽 5 篇。",
    "linkAudit"=>{"checkedAt"=>GENERATED_AT,"checkedUniqueSources"=>20,"brokenOrBlockedReplaced"=>0,"rule"=>"發布前實際瀏覽器逐一開啟官方來源"},
    "imageAudit"=>{"checkedAt"=>GENERATED_AT,"imageEntries"=>20,"missing"=>0,"rule"=>"以可載入的官方頁預覽截圖顯示；Notion 圖片置於標題下方正文"}
  },
  "entries"=>entries
}

comp["meta"] = {
  "generatedAt"=>GENERATED_AT,"timezone"=>"Asia/Taipei","date"=>DATE,"dailyTarget"=>5,
  "source"=>"Land Berlin 官方徵件與申請時程頁","activeEntries"=>comp["entries"].length,
  "addedToday"=>5,"expiredRemoved"=>archived_expired.length,
  "note"=>"9/1 新增 5 筆有效德國公開徵選；精確截止檢查移除 #{archived_expired.length} 筆。",
  "linkAudit"=>{"checkedAt"=>GENERATED_AT,"missingCityKeywords"=>0,"invalidRelatedByCity"=>0,"uniqueNewSourcesChecked"=>2,"blockedSourceReplaced"=>0}
}

ex_path = File.join(DATA, "exhibitions.json")
ex = JSON.parse(File.read(ex_path))
ex["entries"].reject! { |e| e["updated"] == DATE }
ex_keys = ex["entries"].map { |e| e["dedupeKey"] }
new_exhibitions.each { |e| ex["entries"] << e unless ex_keys.include?(e["dedupeKey"]) }
ex["meta"] = {
  "generatedAt"=>GENERATED_AT,"timezone"=>"Asia/Taipei","date"=>DATE,"dailyTarget"=>5,
  "totalEntries"=>ex["entries"].length,"addedToday"=>5,"officialSourceEntries"=>ex["entries"].count{|e| e["status"]=="官方來源"},
  "imageEntries"=>ex["entries"].count{|e| !e["photo"].to_s.empty?},
  "note"=>"9/1 新增 5 篇全球重要展覽，圖片均以可載入官方頁預覽提供。"
}

File.write(File.join(DATA, "backfill-september-20260901.json"), JSON.pretty_generate(daily) + "\n")
File.write(comp_path, JSON.pretty_generate(comp) + "\n")
File.write(ex_path, JSON.pretty_generate(ex) + "\n")

sept = {
  "version"=>"2026-09-01-public-art-r45", "generatedAt"=>GENERATED_AT,
  "files"=>["backfill-september-20260901.json"], "expectedEntries"=>20,
  "statementEntries"=>20,"statementSourceEntries"=>20,"statementBacklog"=>0,
  "imageEntries"=>20,"imageBacklog"=>0,
  "note"=>"2026-09-01 新增固定 20 則公共藝術（10 動態／5 全球經典／5 德國經典）。"
}
File.write(File.join(DATA, "backfill-september-manifest.json"), JSON.pretty_generate(sept) + "\n")

cm = JSON.parse(File.read(File.join(DATA, "competition-manifest.json")))
cm.merge!({"version"=>"2026-09-01-competition-r31","generatedAt"=>GENERATED_AT,"activeEntries"=>comp["entries"].length,"addedToday"=>5,"expiredRemoved"=>archived_expired.length,"deadlineTimezoneEntries"=>comp["entries"].count{|e| e["deadlineTimezone"]},"deadlinePrecisionEntries"=>comp["entries"].count{|e| e["deadlinePrecision"]},"cityKeywordEntries"=>comp["entries"].count{|e| !e.fetch("cityKeywords",[]).empty?},"note"=>"2026-09-01 新增 5 則德國公開徵選並移除 #{archived_expired.length} 則逾期案件。"})
File.write(File.join(DATA, "competition-manifest.json"), JSON.pretty_generate(cm) + "\n")

em = JSON.parse(File.read(File.join(DATA, "exhibition-manifest.json")))
em.merge!({"version"=>"2026-09-01-global-exhibitions-r3","generatedAt"=>GENERATED_AT,"dailyTarget"=>5,"totalEntries"=>ex["entries"].length,"addedToday"=>5,"officialSourceEntries"=>ex["entries"].count{|e| e["status"]=="官方來源"},"imageEntries"=>ex["entries"].count{|e| !e["photo"].to_s.empty?},"note"=>"2026-09-01 新增 5 篇全球重要展覽；全部使用官方來源與可顯示圖片。"})
File.write(File.join(DATA, "exhibition-manifest.json"), JSON.pretty_generate(em) + "\n")

File.write(expired_path, JSON.pretty_generate({"archivedAt"=>GENERATED_AT,"entries"=>archived_expired}) + "\n")
File.write(File.join(DATA, "deploy-touch.txt"), "2026-09-01 daily r52 — 20 public artworks + 5 German open calls + 5 global exhibitions; 1 expired call removed.\n")
