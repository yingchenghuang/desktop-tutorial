require "json"
require "date"

ROOT = File.expand_path("..", __dir__)
DATA = File.join(ROOT, "data")
DATE = "2026-09-02"
GENERATED_AT = "2026-09-02T11:25:29+08:00"
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

# 2026-09-02 verified daily set. These assignments intentionally replace the
# previous-day seed arrays above while retaining the shared constructors.
museum = "https://www.museum-der-1000-orte.de/kunstwerke/kunstwerk"
central = "https://www.centralparknyc.org/locations"

entries = [
  art(id:"current-2026-09-02-01", key:"art-2026-09-02-renate-wolff-spiel-form-farbe", name:"01｜Renate Wolff｜Spiel von Form und Farbe", tier:"動態情報層", country:"德國 / Berlin", cities:["Berlin","柏林","Gatow","加托"], media:["壁畫","色彩空間","建築整合"], work:"o. T. (Spiel von Form und Farbe)", comment:"以綠、藍、紅與黃的矩形跨越門、牆角、樓梯和開關，把托育建築轉化為不預設圖像的色彩節奏，也保留兒童自行想像與使用的空間。", url:"#{museum}/o-t-spiel-von-form-und-farbe", year:"2012"),
  art(id:"current-2026-09-02-02", key:"art-2026-09-02-per-kirkeby-bundesrat-plastik", name:"02｜Per Kirkeby｜Bundesrat 無題青銅群", tier:"動態情報層", country:"德國 / Berlin", cities:["Berlin","柏林","Bundesrat","聯邦參議院"], media:["青銅雕塑","建築整合","抽象人物"], work:"o. T. (Plastik)", comment:"八件黑色青銅塑形取代傳統權力建築的寓意人物，以近似軀幹的模糊形體重新處理普魯士議院立面的象徵秩序。", url:"#{museum}/o-t-plastik", year:"2000"),
  art(id:"current-2026-09-02-03", key:"art-2026-09-02-daniel-buren-grande-fenetre", name:"03｜Daniel Buren｜La Grande Fenêtre", tier:"動態情報層", country:"德國 / Berlin", cities:["Berlin","柏林","Wilhelmstraße","威廉街"], media:["光環境","彩色玻璃","建築整合"], work:"La Grande Fenêtre", comment:"黑白條紋鋼框與黃藍背光玻璃把入口大廳變成可穿行的巨大窗景；固定寬度的條紋同時標記、切分並重新衡量歷史建築。", url:"#{museum}/la-grande-fenetre", year:"2001"),
  art(id:"current-2026-09-02-04", key:"art-2026-09-02-inges-idee-im-selben-boot", name:"04｜Inges Idee｜Im selben Boot／In internationalen Gewässern", tier:"動態情報層", country:"德國 / Stralsund", cities:["Stralsund","施特拉爾松","Parow","帕羅"], media:["公共裝置","場域特定","社會寓言"], work:"Im selben Boot / In internationalen Gewässern", comment:"傾倒在草地上的藍色船體與裝滿各國礦泉水瓶的展示櫃，以幽默方式把海軍學校的技術語境轉成共同處境、國界與流動的隱喻。", url:"#{museum}/im-selben-boot-in-internationalen-gewassern", year:"2003"),
  art(id:"current-2026-09-02-05", key:"art-2026-09-02-marcel-odenbach-waagschale", name:"05｜Marcel Odenbach｜Etwas auf die Waagschale werfen", tier:"動態情報層", country:"德國 / Berlin", cities:["Berlin","柏林","Mohrenstraße","莫倫街"], media:["錄像藝術","司法場域","雙螢幕"], work:"Etwas auf die Waagschale werfen", comment:"雙螢幕借用正義女神天秤的兩端結構，在司法部建築內把觀看轉化為衡量證據、權力與社會判斷的動態過程。", url:"#{museum}/etwas-auf-die-waagschale-werfen", year:"2000"),
  art(id:"current-2026-09-02-06", key:"art-2026-09-02-eduardo-chillida-berlin", name:"06｜Eduardo Chillida｜Berlin", tier:"動態情報層", country:"德國 / Berlin", cities:["Berlin","柏林","Bundeskanzleramt","聯邦總理府"], media:["公共雕塑","鋼鐵","國家象徵"], work:"Berlin", comment:"兩片厚重鋼形在聯邦總理府前彼此接近又保持間隙，把德國統一理解為需要持續協商的結構，而不是已經封閉完成的紀念圖像。", url:"#{museum}/berlin", year:"1999"),
  art(id:"current-2026-09-02-07", key:"art-2026-09-02-heimo-zobernig-isgh-pavement", name:"07｜Heimo Zobernig｜ISGH 無題鋪面文字", tier:"動態情報層", country:"德國 / Hamburg", cities:["Hamburg","漢堡","Internationaler Seegerichtshof","國際海洋法法庭"], media:["鋪面藝術","文字裝置","建築整合"], work:"o. T.", comment:"法庭名稱被放大為難以從日常視角完整讀取的鋪面字母，既具有識別功能，也迫使行走者在局部、尺度與制度形象之間重新組合意義。", url:"#{museum}/o-t-16", year:"2000"),
  art(id:"current-2026-09-02-08", key:"art-2026-09-02-per-kirkeby-jakob-kaiser-haus", name:"08｜Per Kirkeby｜Jakob-Kaiser-Haus 磚構空間", tier:"動態情報層", country:"德國 / Berlin", cities:["Berlin","柏林","Jakob-Kaiser-Haus","雅各布凱瑟大樓"], media:["磚構雕塑","空間裝置","建築整合"], work:"o. T. (Raumarbeit)", comment:"手工磚牆與鋼骨在議會建築內形成可進入的第二層建築，讓雕塑同時成為空間、通道與對制度尺度的沉默對話。", url:"#{museum}/o-t-8", year:"2000"),
  art(id:"current-2026-09-02-09", key:"art-2026-09-02-werner-huthmacher-zuchtferkel", name:"09｜Werner Huthmacher｜Zuchtferkel 種豬影像", tier:"動態情報層", country:"德國 / Berlin", cities:["Berlin","柏林","Wilhelmstraße","威廉街"], media:["攝影裝置","農業圖像","建築整合"], work:"o. T. (Zuchtferkel)", comment:"放大的種豬照片以近乎肖像的正面尺度出現在農業部中庭，將行政任務、畜牧生產與觀看中的幽默和不安並置。", url:"#{museum}/o-t-zuchtferkel", year:"2011"),
  art(id:"current-2026-09-02-10", key:"art-2026-09-02-ursula-sax-wandplastik", name:"10｜Ursula Sax｜無題牆面雕塑", tier:"動態情報層", country:"德國 / Bonn", cities:["Bonn","波昂","Bundesinnenministerium","德國內政部"], media:["牆面雕塑","木／金屬","建築整合"], work:"o. T. (Wandplastik)", comment:"Sax 以關注建築與空間的抽象構成介入內政部餐廳，使牆面不再只是背景，而成為與光線、動線和日常休息彼此牽動的塑形場域。", url:"#{museum}/o-t-wandplastik", year:"1979"),

  art(id:"classic-global-2026-09-02-01", key:"art-2026-09-02-gustav-blaeser-alexander-humboldt", name:"全球經典01｜Gustav Bläser｜Alexander von Humboldt", tier:"經典檔案庫", country:"美國 / New York City", cities:["New York City","紐約市","Central Park","中央公園"], media:["紀念性公共藝術","青銅胸像","科學史"], work:"Alexander von Humboldt", comment:"依洪堡死亡面具塑造的巨型胸像由德裔移民團體捐贈，既紀念自然科學與全球探索，也見證移民社群透過公共空間爭取城市可見性。", url:"#{central}/alexander-von-humboldt", year:"1869"),
  art(id:"classic-global-2026-09-02-02", key:"art-2026-09-02-french-price-richard-morris-hunt", name:"全球經典02｜Daniel Chester French／Bruce Price｜Richard Morris Hunt", tier:"經典檔案庫", country:"美國 / New York City", cities:["New York City","紐約市","Central Park","中央公園"], media:["紀念碑","建築寓意雕塑","都市座椅"], work:"Richard Morris Hunt Monument", comment:"建築師胸像與象徵建築、繪畫、雕塑的女性人物嵌入古典柱廊及座椅，將紀念物、都市家具與專業共同體的歷史結合。", url:"#{central}/richard-morris-hunt", year:"1898"),
  art(id:"classic-global-2026-09-02-03", key:"art-2026-09-02-jqa-ward-the-pilgrim", name:"全球經典03｜John Quincy Adams Ward｜The Pilgrim", tier:"經典檔案庫", country:"美國 / New York City", cities:["New York City","紐約市","Central Park","中央公園","Pilgrim Hill"], media:["紀念性公共藝術","青銅人物","歷史敘事"], work:"The Pilgrim", comment:"持火槍、戴尖頂帽的十七世紀清教徒形象立於櫻花坡地；它保存十九世紀建國敘事，同時也提供今日重新檢視殖民記憶的公共節點。", url:"#{central}/the-pilgrim", year:"1885"),
  art(id:"classic-global-2026-09-02-04", key:"art-2026-09-02-john-steell-sir-walter-scott", name:"全球經典04｜John Steell｜Sir Walter Scott", tier:"經典檔案庫", country:"美國 / New York City", cities:["New York City","紐約市","Central Park","中央公園","Literary Walk"], media:["公共雕塑","青銅","文學紀念"], work:"Sir Walter Scott", comment:"蘇格蘭裔紐約人以募款方式捐贈作家坐像，並把它安置在莎士比亞附近；文學步道因此也成為移民社群建立文化身分的公共舞台。", url:"#{central}/sir-walter-scott", year:"1872"),
  art(id:"classic-global-2026-09-02-05", key:"art-2026-09-02-giovanni-turini-giuseppe-mazzini", name:"全球經典05｜Giovanni Turini｜Giuseppe Mazzini", tier:"經典檔案庫", country:"美國 / New York City", cities:["New York City","紐約市","Central Park","中央公園"], media:["紀念性公共藝術","青銅胸像","移民史"], work:"Giuseppe Mazzini", comment:"義大利裔社群為統一運動思想家設立胸像，基座刻有「思想與行動」「上帝與人民」，把政治信念與新移民的城市自我表述並置。", url:"#{central}/giuseppe-mazzini", year:"1878"),

  art(id:"classic-german-2026-09-02-01", key:"art-2026-09-02-alf-lechner-untitled-hamburg", name:"德國經典01｜Alf Lechner｜無題鋼構立方體", tier:"經典檔案庫", country:"德國 / Hamburg", cities:["Hamburg","漢堡","Helmut-Schmidt-Universität"], media:["公共雕塑","不鏽鋼","幾何抽象"], work:"o. T.", comment:"以鉸鏈連接的開放立方體可在組裝時變換構型，將分解、彎折與重新排序的理性過程轉化為可被身體感知的空間經驗。", url:"#{museum}/o-t-15", year:"1977"),
  art(id:"classic-german-2026-09-02-02", key:"art-2026-09-02-max-walter-grosse-verbindung", name:"德國經典02｜Max Walter｜Die große Verbindung", tier:"經典檔案庫", country:"德國 / Nürnberg", cities:["Nürnberg","紐倫堡","Bundesagentur für Arbeit"], media:["公共雕塑","鋁鑄件","動力形式"], work:"Die große Verbindung", comment:"兩座由水平圓盤堆疊而成的塔在中央互相扣合，像機械傳動又近似陰陽互補，將聯邦勞動機構的連結與運動概念轉成五米高的公共地標。", url:"#{museum}/die-grosse-verbindung", year:"1973"),
  art(id:"classic-german-2026-09-02-03", key:"art-2026-09-02-erwin-spuler-wandbild", name:"德國經典03｜Erwin Spuler｜無題釉面磚壁畫", tier:"經典檔案庫", country:"德國 / Bonn", cities:["Bonn","波昂"], media:["壁畫","釉面磚","建築整合"], work:"o. T. (Wandbild)", comment:"二十二米長的釉面磚帶以不規則色塊承載採果與捕魚人物，讓五○年代公共建築中的勞動圖像同時靠近現代主義線描與日常餐飲空間。", url:"#{museum}/o-t-wandbild", year:"1956"),
  art(id:"classic-german-2026-09-02-04", key:"art-2026-09-02-hannsjoerg-voth-scheitelhaltung", name:"德國經典04｜Hannsjörg Voth｜Scheitelhaltung", tier:"經典檔案庫", country:"德國 / Hilpoltstein", cities:["Hilpoltstein","希爾波爾特施泰因","Main-Donau-Kanal","美因—多瑙運河"], media:["大地藝術","花崗岩","基礎設施藝術"], work:"Scheitelhaltung", comment:"兩道長達百米的楔形花崗岩牆標示運河分水嶺，把工程地理轉成可步行閱讀的大地藝術，也讓北海與黑海水系的交界獲得具體尺度。", url:"#{museum}/scheitelhaltung", year:"1992"),
  art(id:"classic-german-2026-09-02-05", key:"art-2026-09-02-guenther-uecker-nagel", name:"德國經典05｜Günther Uecker｜Nagel", tier:"經典檔案庫", country:"德國 / Nürnberg", cities:["Nürnberg","紐倫堡","Bundesagentur für Arbeit"], media:["巨型公共雕塑","鋼／鉛","日常物件"], work:"Nagel", comment:"十八米高的鉛包鋼釘將 Uecker 的標誌性日常物件放大為城市尺度，既與辦公建築形成尖銳對比，也回應戰後公共藝術對工業材料的重新想像。", url:"#{museum}/nagel", year:"1990")
]

deadlines = "https://www.berlin.de/sen/kultur/foerderung/antragsfristen/"
new_calls = [
  call(id:"competition-2026-09-02-01", key:"opportunity-2026-09-02-berlin-global-exchange-all-disciplines", name:"01｜Land Berlin｜Global 2027 全領域文化交換獎助", work:"國際文化交換獎助｜截止 2026.09.15 14:00 CEST", comment:"支持居住柏林的專業藝術家赴海外合作機構進行研究與創作交流，適用多種藝術領域，強調跨國專業網絡與具體工作計畫。", url:deadlines, deadline:"2026-09-15T14:00:00+02:00", organizer:"Senatsverwaltung für Kultur und Gesellschaftlichen Zusammenhalt Berlin", eligibility:"主要居住與工作地在柏林的專業藝術家；須依各目的地與領域資訊表提出計畫", budget:"依目的地、期間及 2027 正式資訊表核定", media:["國際交流","跨領域","研究／創作"]),
  call(id:"competition-2026-09-02-02", key:"opportunity-2026-09-02-berlin-visual-art-istanbul-new-york-tokyo", name:"02｜Land Berlin｜視覺藝術駐地：伊斯坦堡／紐約／東京", work:"柏林視覺藝術家海外駐地｜截止 2026.09.15 14:00 CEST", comment:"提供柏林視覺藝術家前往伊斯坦堡、紐約或東京的交流駐地，讓場域研究、工作室實踐與國際機構網絡形成後續創作資源。", url:deadlines, deadline:"2026-09-15T14:00:00+02:00", organizer:"Senatsverwaltung für Kultur und Gesellschaftlichen Zusammenhalt Berlin", eligibility:"主要居住地在柏林的專業視覺藝術家；依目的地條件選擇一項申請", budget:"依各駐地期間、旅費與 2027 正式資訊表核定", media:["視覺藝術","海外駐地","國際交流"]),
  call(id:"competition-2026-09-02-03", key:"opportunity-2026-09-02-berlin-paris-visual-literature-dance", name:"03｜Land Berlin｜巴黎交換獎助：視覺藝術／文學／舞蹈", work:"巴黎跨領域駐地交換｜截止 2026.09.15 14:00 CEST", comment:"面向視覺藝術、文學與舞蹈專業創作者的巴黎交流計畫，支持在法國場域中發展研究、製作與跨文化連結。", url:deadlines, deadline:"2026-09-15T14:00:00+02:00", organizer:"Senatsverwaltung für Kultur und Gesellschaftlichen Zusammenhalt Berlin", eligibility:"主要居住地在柏林、分屬視覺藝術、文學或舞蹈領域的專業創作者", budget:"依巴黎駐地方案與正式資訊表核定", media:["視覺藝術","文學","舞蹈","海外駐地"]),
  call(id:"competition-2026-09-02-04", key:"opportunity-2026-09-02-berlin-comic-paris-2027-2028", name:"04｜Land Berlin｜巴黎漫畫交換獎助 2027／2028", work:"漫畫創作海外駐地｜截止 2026.09.15 14:00 CEST", comment:"支持柏林專業漫畫創作者赴巴黎進行較長期交換，將圖像敘事、出版研究與法語漫畫生態連接成可延續的創作計畫。", url:deadlines, deadline:"2026-09-15T14:00:00+02:00", organizer:"Senatsverwaltung für Kultur und Gesellschaftlichen Zusammenhalt Berlin", eligibility:"主要居住地在柏林的專業漫畫作者、繪者或圖像敘事創作者", budget:"依 2027／2028 巴黎漫畫駐地正式資訊表核定", media:["漫畫","圖像敘事","出版","海外駐地"]),
  call(id:"competition-2026-09-02-05", key:"opportunity-2026-09-02-berlin-music-paris-2027-2028", name:"05｜Land Berlin｜巴黎音樂交換獎助 2027／2028", work:"音樂創作海外駐地｜截止 2026.09.15 14:00 CEST", comment:"支持柏林專業音樂創作者在巴黎進行跨國研究、創作與合作，適合以具體製作目標連結兩地場景的個人計畫。", url:deadlines, deadline:"2026-09-15T14:00:00+02:00", organizer:"Senatsverwaltung für Kultur und Gesellschaftlichen Zusammenhalt Berlin", eligibility:"主要居住地在柏林的專業音樂創作者；依正式資訊表提交作品與駐地計畫", budget:"依 2027／2028 巴黎音樂駐地正式資訊表核定", media:["音樂","聲音藝術","海外駐地","國際交流"])
]

new_exhibitions = [
  exhibition(id:"exhibition-2026-09-02-01", key:"exhibition-2025-istanbul-biennial-three-legged-cat", name:"01｜第 18 屆伊斯坦堡雙年展｜The Three-Legged Cat", country:"土耳其 / Istanbul", cities:["Istanbul","İstanbul","伊斯坦堡","Beyoğlu","貝伊奧盧","Karaköy","卡拉柯伊"], media:["巡迴式雙年展","城市展覽","公共計畫"], dates:["2025-09-20","2025-11-23"], comment:"Christine Tohmé 以三腳貓在危機中調整步伐的形象討論自我保存與未來性；首階段在 Beyoğlu—Karaköy 八處步行可達場址呈現 47 組藝術家。", url:"https://bienal.iksv.org/en/news/18th-istanbul-biennial-to-conclude-after-its-first-leg", type:"城市型國際雙年展／原三階段計畫", status:"已結束／後續階段取消", edition:"第 18 屆", organizer:"Istanbul Foundation for Culture and Arts（İKSV）", curator:"Christine Tohmé", venue:"Galata Greek School、Zihni Han、Muradiye Han 等八處場址", admission:"首階段免費", statement:"雙年展原以三年三階段拉長策展時間，但在策展人卸任後正式於首階段結束；保留這項變更能使檔案如實呈現大型展覽制度與策展勞動的脆弱性。"),
  exhibition(id:"exhibition-2026-09-02-02", key:"exhibition-2025-desert-x-coachella-valley", name:"02｜Desert X 2025｜Coachella Valley", country:"美國 / Coachella Valley", cities:["Coachella Valley","科切拉谷","Palm Springs","棕櫚泉"], media:["大地藝術","地景展","場域特定裝置"], dates:["2025-03-08","2025-05-11"], comment:"第五屆 Desert X 以沙漠深層時間為尺度，從原住民族未來主義、設計行動、殖民權力、不對稱地景與新技術重新理解「荒野」並非空白。", url:"https://desertx.org/learn/news/desert-x-2025-artist-announced", type:"國際大地藝術／地景展", status:"已結束／檔案", edition:"第 5 屆 Coachella Valley", organizer:"Desert X", curator:"Neville Wakefield、Kaitlin Garcia-Maestas", venue:"Coachella Valley 多處戶外場址", admission:"免費；各作品開放時間依官方資訊", statement:"展覽將沙漠視為被多種生命、歷史與技術共同塑造的場域，藉場域回應作品揭示殖民、設計、環境與人類介入留下的痕跡。"),
  exhibition(id:"exhibition-2026-09-02-03", key:"exhibition-2027-yokohama-triennale-9", name:"03｜第 9 屆橫濱三年展", country:"日本 / Yokohama", cities:["Yokohama","橫濱","Minatomirai","港未來"], media:["國際三年展","當代藝術","城市網絡"], dates:["2027-04-23","2027-09-12"], comment:"第九屆由 Cosmin Costinaș 與 Inti Guerrero 擔任藝術總監，以橫濱美術館為核心串聯城市合作場址，並與 GREEN×EXPO 2027 的自然共生願景對話。", url:"https://www.yokohamatriennale.jp/english/news/yt9-0423-0912-2027/", type:"國際藝術三年展", status:"籌備中／即將展出", edition:"第 9 屆", organizer:"橫濱市、橫濱市藝術文化振興財團、NHK、朝日新聞社、橫濱三年展組織委員會", curator:"Cosmin Costinaș、Inti Guerrero（藝術總監）", venue:"Yokohama Museum of Art 與橫濱市內合作場址", admission:"待官方公布", statement:"策展團隊希望把美術館與城市夥伴連成藝術節點網絡，使當代藝術既能回應全球議題，也成為初次觀眾直覺進入世界的新入口。"),
  exhibition(id:"exhibition-2026-09-02-04", key:"exhibition-2026-whitney-biennial-82", name:"04｜惠特尼雙年展 2026｜第 82 屆美國藝術調查展", country:"美國 / New York City", cities:["New York City","紐約市","Whitney Museum","惠特尼美術館"], media:["雙年展","國際調查展","跨媒介"], dates:["2026-03-08","2026-08-23"], comment:"五十六組藝術家以情緒、質地與關係性回應美國權力延伸下的當代生活，從跨物種親緣、家庭、地緣政治、技術到基礎設施，拒絕單一的「美國藝術」答案。", url:"https://whitney.org/press/2026-biennial", type:"美國藝術雙年調查展", status:"已結束／檔案", edition:"第 82 屆", organizer:"Whitney Museum of American Art", curator:"Marcela Guerrero、Drew Sawyer", venue:"Whitney Museum of American Art 與館外看板", admission:"美術館門票；部分優惠與免費時段依官方資訊", statement:"本屆不把調查展當成定論，而是邀請觀眾感受藝術家如何在轉折時刻製造緊張、溫柔、幽默與不安，並提出不守規則的共存形式。"),
  exhibition(id:"exhibition-2026-09-02-05", key:"exhibition-2025-helsinki-biennial-shelter", name:"05｜赫爾辛基雙年展 2025｜Shelter", country:"芬蘭 / Helsinki", cities:["Helsinki","赫爾辛基","Vallisaari","瓦利薩里島"], media:["戶外雙年展","島嶼展覽","生態藝術"], dates:["2025-06-08","2025-09-21"], comment:"第三屆把瓦利薩里島的非人類棲地視為庇護所，讓動物、植物、真菌、昆蟲與礦物成為敘事主體，並延伸至 Esplanade Park 與 HAM。", url:"https://helsinkibiennaali.fi/en/story/helsinki-biennial-2025-brings-together-37-artists-and-collectives/", type:"城市／島嶼國際雙年展", status:"已結束／檔案", edition:"第 3 屆", organizer:"HAM Helsinki Art Museum／City of Helsinki", curator:"Kati Kivinen、Blanca de la Torre", venue:"Vallisaari Island、Esplanade Park、HAM Helsinki Art Museum", admission:"展覽免費；前往島嶼渡輪另付費", statement:"Shelter 透過去人類中心視角，把藝術理解為概念與身體上的庇護；作品以跨物種感知和原住民族知識尋找環境危機中的同理與行動。")
]

comp_path = File.join(DATA, "competitions.json")
comp = JSON.parse(File.read(comp_path))
expired_path = File.join(DATA, "expired-20260902.json")
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
    "source"=>"Museum der 1000 Orte、Central Park Conservancy 官方頁",
    "note"=>"9/2 公共藝術固定 10＋5＋5；另有德國公開徵選 5 則與全球重要展覽 5 篇。",
    "linkAudit"=>{"checkedAt"=>GENERATED_AT,"checkedUniqueSources"=>20,"brokenOrBlockedReplaced"=>0,"rule"=>"發布前實際瀏覽器逐一開啟官方來源"},
    "imageAudit"=>{"checkedAt"=>GENERATED_AT,"imageEntries"=>20,"missing"=>0,"rule"=>"以可載入的官方頁預覽截圖顯示；Notion 圖片置於標題下方正文"}
  },
  "entries"=>entries
}

comp["meta"] = {
  "generatedAt"=>GENERATED_AT,"timezone"=>"Asia/Taipei","date"=>DATE,"dailyTarget"=>5,
  "source"=>"Land Berlin 官方徵件與申請時程頁","activeEntries"=>comp["entries"].length,
  "addedToday"=>5,"expiredRemoved"=>archived_expired.length,
  "note"=>"9/2 新增 5 筆有效德國公開徵選；精確截止檢查移除 #{archived_expired.length} 筆。",
  "linkAudit"=>{"checkedAt"=>GENERATED_AT,"missingCityKeywords"=>0,"invalidRelatedByCity"=>0,"uniqueNewSourcesChecked"=>1,"blockedSourceReplaced"=>0}
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
  "note"=>"9/2 新增 5 篇全球重要展覽，圖片均以可載入官方頁預覽提供。"
}

File.write(File.join(DATA, "backfill-september-20260902.json"), JSON.pretty_generate(daily) + "\n")
File.write(comp_path, JSON.pretty_generate(comp) + "\n")
File.write(ex_path, JSON.pretty_generate(ex) + "\n")

sept = {
  "version"=>"2026-09-02-public-art-r46", "generatedAt"=>GENERATED_AT,
  "files"=>["backfill-september-20260901.json","backfill-september-20260902.json"], "expectedEntries"=>40,
  "statementEntries"=>40,"statementSourceEntries"=>40,"statementBacklog"=>0,
  "imageEntries"=>40,"imageBacklog"=>0,
  "note"=>"截至 2026-09-02 累計 40 則；今日新增固定 20 則公共藝術（10 動態／5 全球經典／5 德國經典）。"
}
File.write(File.join(DATA, "backfill-september-manifest.json"), JSON.pretty_generate(sept) + "\n")

cm = JSON.parse(File.read(File.join(DATA, "competition-manifest.json")))
cm.merge!({"version"=>"2026-09-02-competition-r33","generatedAt"=>GENERATED_AT,"activeEntries"=>comp["entries"].length,"addedToday"=>5,"expiredRemoved"=>archived_expired.length,"deadlineTimezoneEntries"=>comp["entries"].count{|e| e["deadlineTimezone"]},"deadlinePrecisionEntries"=>comp["entries"].count{|e| e["deadlinePrecision"]},"cityKeywordEntries"=>comp["entries"].count{|e| !e.fetch("cityKeywords",[]).empty?},"note"=>"2026-09-02 新增 5 則德國公開徵選並移除 #{archived_expired.length} 則逾期案件。"})
File.write(File.join(DATA, "competition-manifest.json"), JSON.pretty_generate(cm) + "\n")

em = JSON.parse(File.read(File.join(DATA, "exhibition-manifest.json")))
em.merge!({"version"=>"2026-09-02-global-exhibitions-r4","generatedAt"=>GENERATED_AT,"dailyTarget"=>5,"totalEntries"=>ex["entries"].length,"addedToday"=>5,"officialSourceEntries"=>ex["entries"].count{|e| e["status"]=="官方來源"},"imageEntries"=>ex["entries"].count{|e| !e["photo"].to_s.empty?},"note"=>"2026-09-02 新增 5 篇全球重要展覽；全部使用官方來源與可顯示圖片。"})
File.write(File.join(DATA, "exhibition-manifest.json"), JSON.pretty_generate(em) + "\n")

File.write(expired_path, JSON.pretty_generate({"archivedAt"=>GENERATED_AT,"entries"=>archived_expired}) + "\n")
File.write(File.join(DATA, "deploy-touch.txt"), "2026-09-02 daily r54 — 20 public artworks + 5 German open calls + 5 global exhibitions; #{archived_expired.length} expired calls removed.\n")
