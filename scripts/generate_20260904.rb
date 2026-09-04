require "json"
require "date"

ROOT = File.expand_path("..", __dir__)
DATA = File.join(ROOT, "data")
DATE = "2026-09-04"
GENERATED_AT = "2026-09-04T17:51:00+08:00"
NOW = DateTime.parse(GENERATED_AT)

IMAGES = {
  "https://www.koer.or.at/projects/united-workers-work-around-the-clock/"=>"https://www.koer.or.at/site/assets/files/14244/susi_rogenhofer4.500x0.jpg",
  "https://www.koer.or.at/projects/paviliola/"=>"https://www.koer.or.at/site/assets/files/14143/kro5334.500x0.jpg",
  "https://www.koer.or.at/projects/stille-post/"=>"https://www.koer.or.at/site/assets/files/14163/hansson_098.500x0.jpg",
  "https://www.koer.or.at/projects/design-of-the-anonymous/"=>"https://www.koer.or.at/site/assets/files/14030/01_c_sebastian_kraner.500x0.jpg",
  "https://www.koer.or.at/projects/augenblicke-a-poetic-encounter/"=>"https://www.koer.or.at/site/assets/files/14020/a_u_g_e_n_b_l_i_c_k_e_laurent_ziegler_1_klein.500x0.jpg",
  "https://www.koer.or.at/projects/i-contain-multitudes/"=>"https://www.koer.or.at/site/assets/files/14012/2025-marinella_senatore_kor_vienna_may_12-5185.500x0.jpg",
  "https://www.koer.or.at/projects/wiener-weinen/"=>"https://www.koer.or.at/site/assets/files/13981/img_0583_kleiner.500x0.jpg",
  "https://www.koer.or.at/projects/window-words/"=>"https://www.koer.or.at/site/assets/files/13999/markovic_barbi_teil3.500x0.jpg",
  "https://www.koer.or.at/projects/invisible-waters-and-hidden-paths/"=>"https://www.koer.or.at/site/assets/files/14118/franke_flora_inseln.500x0.jpg",
  "https://www.koer.or.at/projects/wahllabor/"=>"https://www.koer.or.at/site/assets/files/13994/bild_wahllabor_campus1.500x0.jpg",
  "https://www.centralparknyc.org/locations/maine-monument"=>"https://d2wsrtli9cxkek.cloudfront.net/media/images/locations/20200521_AH9A7561.jpg?auto=compress%2Cformat&crop=focalpoint&fit=crop&fp-x=0.5&fp-y=0.5&h=630&q=82&w=1200&s=dfdbfcb63962a972362c00843c6f1265",
  "https://www.centralparknyc.org/locations/simon-bolivar"=>"https://d2wsrtli9cxkek.cloudfront.net/media/images/20141116_Simon_Bolivar_IMG_3178-1.jpg?auto=compress%2Cformat&crop=focalpoint&fit=crop&fp-x=0.5&fp-y=0.5&h=630&q=82&w=1200&s=88f8c7c8d9d6617c72575f19b7c7e3e7",
  "https://www.centralparknyc.org/locations/thomas-moore"=>"https://d2wsrtli9cxkek.cloudfront.net/media/images/ff-wide@thomas-moore.jpg?auto=compress%2Cformat&crop=focalpoint&fit=crop&fp-x=0.5&fp-y=0.5&h=630&q=82&w=1200&s=3ce9558958fd513e5244d24cc3b43894",
  "https://www.centralparknyc.org/locations/daniel-webster"=>"https://d2wsrtli9cxkek.cloudfront.net/media/images/locations/Daniel-Webster_20181002_0040.jpg?auto=compress%2Cformat&crop=focalpoint&fit=crop&fp-x=0.5&fp-y=0.5&h=630&q=82&w=1200&s=8dece07550264e69465bbd2dbcc5131b",
  "https://www.centralparknyc.org/locations/eagles-and-prey"=>"https://d2wsrtli9cxkek.cloudfront.net/media/images/locations/Eagles-and-Prey-July-2018_0006.jpg?auto=compress%2Cformat&crop=focalpoint&fit=crop&fp-x=0.5&fp-y=0.5&h=630&q=82&w=1200&s=aa4c40dbc5ae5c4b4edc50d0ca182e9a",
  "https://www.museum-der-1000-orte.de/kunstwerke/kunstwerk/ein-falter-catocala-nupta-rotes-ordensband"=>"https://www.museum-der-1000-orte.de/media/cache/resolve/slider/images/2997ea2679adb86b0126dc423842ea6f2e3a4aac.jpg",
  "https://www.museum-der-1000-orte.de/kunstwerke/kunstwerk/o-t-6"=>"https://www.museum-der-1000-orte.de/media/cache/resolve/slider/images/59432d4df76364f5049ba83e8b63c19e93b8df11.jpg",
  "https://www.museum-der-1000-orte.de/kunstwerke/kunstwerk/o-t-wetterfahnen"=>"https://www.museum-der-1000-orte.de/media/cache/resolve/slider/images/896f65a8fa48832a734b51463cb085a171942dc9.jpg",
  "https://www.museum-der-1000-orte.de/kunstwerke/kunstwerk/pure-moore"=>"https://www.museum-der-1000-orte.de/media/cache/resolve/slider/images/e98529aa8273ea6cf103ceac9b5cf96ba8cbf530.jpg",
  "https://www.museum-der-1000-orte.de/kunstwerke/kunstwerk/raster-d"=>"https://www.museum-der-1000-orte.de/media/cache/resolve/slider/images/ab09ec1d3f5fb981f1911aeed87c11f61b1a0df9.jpg",
  "https://www.stbaa.bayern.de/service/medien/meldungen/2026/kunst-am-bau-wettbewerb-fuer-die-staats-und-stadtbibliothek-augsburg/"=>"https://www.stbaa.bayern.de/mam/header/service/header.jpg",
  "https://kunstundbau.rlp.de/wettbewerbe/wettbewerb/trier-humboldt-gymnasium"=>"https://kunstundbau.rlp.de/fileadmin/_logos/logo_rlp.svg",
  "https://www.euward.de/en/application/"=>"https://www.euward.de/fileadmin/user_upload/Bewerbung.png",
  "https://www.kunstverein-muensterland.de/index.php/foerderung-kunstschaffende/kunst-preis"=>"https://www.kunstverein-muensterland.de/media/yootheme/cache/85/Kunstpreis-Ludovico-853cbe45.webp",
  "https://www.ksk-bersenbrueck.de/de/home/ihre-sparkasse/franz-hecker-stipendium.html"=>"https://www.ksk-bersenbrueck.de/content/myif/ksk-bersenbrueck/work/filiale/de/home/ihre-sparkasse/franz-hecker-stipendium/_jcr_content/par/section/section/imagebox1/image.img.jpg/1746452408270.jpg",
  "https://bienal.org.br/en/agenda/36th-bienal-de-sao-paulo-not-all-travellers-walk-roads-of-humanity-as-practice/"=>"https://bienal.org.br/wp-content/uploads/2024/11/36bsp-cartaz-RGB-%C2%A9-Studio-Yukiko-_-Fundacao-Bienal-de-Sao-Paulo-1448x2048-1.jpeg",
  "https://singaporebiennale.org/"=>"https://singaporebiennale.org/_next/image?url=%2Fimages%2Fhome%2Fkv-masthead.png&w=3840&q=75",
  "https://www.gibca.se/gibca/arkiv/gibca-2025/"=>"https://www.gibca.se/wordpress/wp-content/uploads/2024/07/GIBCA_general_1280x960_GIBCAWebsite.jpg",
  "https://www.biennial.com/new-venues-and-full-programme-announced-for-liverpool-biennial-2025/"=>"https://eydzuwp5f3t.exactdn.com/wp-content/uploads/2025/03/Untitled-design-1920x1440.jpg?strip=all&quality=90&webp=90&avif=80",
  "https://www.busan.go.kr/eng/bsevents/1631301"=>"https://www.busan.go.kr/comm/getImage?srvcId=MEDIA&upperNo=18501&fileTy=MEDIA&fileNo=1"
}.freeze

def base(id:, key:, name:, tier:, country:, cities:, media:, work:, comment:, url:)
  image = IMAGES.fetch(url)
  {"category"=>"作品/展覽","status"=>"官方來源","updated"=>DATE,"id"=>id,"dedupeKey"=>key,"name"=>name,"tier"=>tier,"region"=>"西方","country"=>country,"cityKeywords"=>cities,"media"=>media,"works"=>work,"comment"=>comment,"website"=>url,"workPage"=>url,"photo"=>image,"artistStatement"=>comment,"artistStatementSource"=>url,"classicTitle"=>work,"classicImage"=>image,"classicDesc"=>comment,"relatedByCity"=>[]}
end

arts = [
  ["current","rogenhofer-united-workers","Susi Rogenhofer｜United Workers: Work around the clock","動態情報層","奧地利 / Vienna",["Vienna","Wien","維也納"],["參與式藝術","城市研究","公共行動"],"United Workers: Work around the clock｜2025","藝術家與 urbanize! 以城市時間、工作、休閒及社會生態節奏為題，讓公共藝術成為集體檢視日常時間制度的工具。","https://www.koer.or.at/projects/united-workers-work-around-the-clock/"],
  ["current","transparadiso-paviliola","transparadiso｜Paviliola","動態情報層","奧地利 / Vienna",["Vienna","Wien","維也納","Otto Wagner Areal"],["場域特定","座椅雕塑","公共空間"],"Paviliola｜2025","把 Otto Wagner Areal 的歷史花園亭拆解為可坐、可用的公共雕塑，並以照護作為所有人可接近的共同資源。","https://www.koer.or.at/projects/paviliola/"],
  ["current","andress-stille-post","Laura Andreß｜Stille Post","動態情報層","奧地利 / Vienna",["Vienna","Wien","維也納","Favoriten"],["聲音藝術","口述歷史","社區參與"],"Stille Post: Geschichten aus dem Gemeindebau｜2025","在市營住宅設置電話亭式聲音裝置，收錄住民故事，使住宅史從官方敘事轉為可被居民接力傳遞的生活記憶。","https://www.koer.or.at/projects/stille-post/"],
  ["current","zabielska-design-anonymous","Joanna Zabielska 等｜Design of the Anonymous","動態情報層","奧地利 / Vienna",["Vienna","Wien","維也納","Brunnenmarkt"],["參與式藝術","市場文化","表演"],"Sewn together: Narrated at the market｜2025","以提袋服裝、收據詩、廣播、烹飪與茶敘串連 Brunnenmarkt 日常，讓匿名設計顯露市場使用者的技藝與知識。","https://www.koer.or.at/projects/design-of-the-anonymous/"],
  ["current","seeleitner-stoeffelbauer-augenblicke","Gabi Seeleitner／Christa Stöffelbauer｜AUGENBLICKE","動態情報層","奧地利 / Vienna",["Vienna","Wien","維也納","Favoritenstraße"],["舞蹈","公共表演","互動裝置"],"AUGENBLICKE｜2025","表演者以街道座椅邀請陌生人短暫相遇，將原本被手機佔據的注意力重新交還給眼神、身體與現場。","https://www.koer.or.at/projects/augenblicke-a-poetic-encounter/"],
  ["current","senatore-i-contain-multitudes","Marinella Senatore｜I Contain Multitudes","動態情報層","奧地利 / Vienna",["Vienna","Wien","維也納"],["社會參與","表演","行動藝術"],"I Contain Multitudes｜2025","以 School of Narrative Dance 串連在地社群，將遊行、舞蹈與集體發聲轉成城市中的公共能動性。","https://www.koer.or.at/projects/i-contain-multitudes/"],
  ["current","ungepflegt-wiener-weinen","Barbara Ungepflegt 等｜WIENER WEINEN","動態情報層","奧地利 / Vienna",["Vienna","Wien","維也納","Schottentor"],["行為藝術","材料轉化","情感地景"],"WIENER WEINEN｜2025","在 Schottentor 收集城市中的眼淚並蒸發為鹽；一百六十毫升淚水才得到一克鹽，使情緒獲得可見的公共尺度。","https://www.koer.or.at/projects/wiener-weinen/"],
  ["current","hangl-window-words","Oliver Hangl｜Window Words","動態情報層","奧地利 / Vienna",["Vienna","Wien","維也納","Mariahilf"],["文字藝術","店窗介入","文學"],"Window Words｜2025","將文學置入營業與閒置店窗，使閱讀沿街展開，讓空屋、商業立面與步行節奏形成新的城市文本。","https://www.koer.or.at/projects/window-words/"],
  ["current","academy-invisible-waters-hidden-paths","Academy of Fine Arts Vienna｜Invisible Waters and Hidden Paths","動態情報層","奧地利 / Vienna",["Vienna","Wien","維也納","Schillerplatz"],["城市步行","工作坊","水文研究"],"Invisible Waters and Hidden Paths｜2025–2026","以每月工作坊與城市步行追蹤學院周邊的自然和水系，把不可見的水文基礎設施轉成可共同閱讀的校園地景。","https://www.koer.or.at/projects/invisible-waters-and-hidden-paths/"],
  ["current","wochenklausur-wahllabor","WochenKlausur｜Election Laboratory","動態情報層","奧地利 / Vienna",["Vienna","Wien","維也納"],["社會實踐","模擬選舉","公共討論"],"Election Laboratory｜2025","在維也納地方選舉前舉辦可投贊成或反對票的表演性選舉，以藝術實驗暴露代議制度與公共意見之間的張力。","https://www.koer.or.at/projects/wahllabor/"],
  ["classic-global","piccirilli-maine-monument","全球經典01｜Attilio Piccirilli｜Maine Monument","經典檔案庫","美國 / New York City",["New York City","紐約市","Central Park","中央公園"],["紀念碑","青銅","歷史紀念"],"Maine Monument｜1913","五十七英尺高的紀念碑以 Columbia、美洲擬人像、海馬與水手群像紀念 USS Maine；宏大寓言也記錄媒體、政治與戰爭記憶的公共塑形。","https://www.centralparknyc.org/locations/maine-monument"],
  ["classic-global","farnham-simon-bolivar","全球經典02｜Sally James Farnham｜Simón Bolívar","經典檔案庫","美國 / New York City",["New York City","紐約市","Central Park","中央公園"],["騎馬像","青銅","政治人物紀念"],"Simón Bolívar｜1921","Farnham 以躍動騎馬像紀念南美解放者；作品亦是當時由女性完成的最大型青銅雕塑之一，將性別與紀念性尺度並置。","https://www.centralparknyc.org/locations/simon-bolivar"],
  ["classic-global","sheahan-thomas-moore","全球經典03｜Dennis B. Sheahan｜Thomas Moore","經典檔案庫","美國 / New York City",["New York City","紐約市","Central Park","中央公園"],["肖像雕塑","青銅","文學紀念"],"Thomas Moore｜1880","愛爾蘭詩人的青銅胸像由友誼社團捐贈，作品位於公園與城市文化制度交界，也見證公共藝術早期的雙重審查。","https://www.centralparknyc.org/locations/thomas-moore"],
  ["classic-global","ball-daniel-webster","全球經典04｜Thomas Ball｜Daniel Webster","經典檔案庫","美國 / New York City",["New York City","紐約市","Central Park","中央公園"],["紀念雕塑","青銅","政治人物紀念"],"Daniel Webster｜1876","巨型青銅像以手入外套、書冊在側的姿勢呈現演說家與政治家；其選址爭議也揭示紀念物如何競逐城市視線。","https://www.centralparknyc.org/locations/daniel-webster"],
  ["classic-global","fratin-eagles-and-prey","全球經典05｜Christophe Fratin｜Eagles and Prey","經典檔案庫","美國 / New York City",["New York City","紐約市","Central Park","中央公園"],["動物雕塑","青銅","浪漫主義"],"Eagles and Prey｜1850／1863 入園","兩隻鷹攻擊山羊的戲劇性場景是中央公園最早的非紀念性雕塑之一，也被視為紐約市公園地的最古老藝術品。","https://www.centralparknyc.org/locations/eagles-and-prey"],
  ["classic-german","anger-ein-falter","德國經典01｜Renate Anger｜Ein Falter","經典檔案庫","德國 / Berlin",["Berlin","柏林","Bendlerblock"],["建築整合","裝置","歷史記憶"],"Ein Falter: Catocala nupta／Rotes Ordensband｜2002","為 Bendlerblock 的 Stauffenberg 廳創作，以蛾的脆弱形象連結抵抗記憶，讓歷史不靠英雄化而在室內尺度中持續浮現。","https://www.museum-der-1000-orte.de/kunstwerke/kunstwerk/ein-falter-catocala-nupta-rotes-ordensband"],
  ["classic-german","bandau-ot-1989","德國經典02｜Joachim Bandau｜o. T.","經典檔案庫","德國 / Bonn",["Bonn","波昂","Robert-Schuman-Platz"],["雕塑","建築整合","抽象"],"o. T.｜1989","為聯邦交通部建築群創作的抽象量體，以沉重、封閉的身體回應玻璃大廳與辦公翼樓之間的通行和制度空間。","https://www.museum-der-1000-orte.de/kunstwerke/kunstwerk/o-t-6"],
  ["classic-german","balkenhol-wetterfahnen","德國經典03｜Stephan Balkenhol｜Wetterfahnen","經典檔案庫","德國 / Berlin",["Berlin","柏林","Werderscher Markt"],["屋頂藝術","風向標","建築整合"],"o. T. (Wetterfahnen)｜2001","人物與符號化為屋頂風向標，隨風轉動於外交部天際線，使國家建築的固定權威被氣候和城市視角持續改寫。","https://www.museum-der-1000-orte.de/kunstwerke/kunstwerk/o-t-wetterfahnen"],
  ["classic-german","balthaus-pure-moore","德國經典04｜Fritz Balthaus｜Pure Moore","經典檔案庫","德國 / Berlin",["Berlin","柏林"],["青銅","概念雕塑","文化記憶"],"Pure Moore｜2009","不規則堆疊青銅條指涉遭竊的 Henry Moore《Reclining Figure》，以材料、價格與缺席追問藝術價值和作者身分如何被制度建構。","https://www.museum-der-1000-orte.de/kunstwerke/kunstwerk/pure-moore"],
  ["classic-german","barth-raster-d","德國經典05｜Thom Barth｜Raster D","經典檔案庫","德國 / Berlin",["Berlin","柏林"],["繪畫裝置","網格","建築介入"],"Raster D｜2000","一百八十六幅鉛筆式網格圖分布於歷史部會建築走廊節點，以重複與差異干擾行政動線，也回應建築承載的政治層疊。","https://www.museum-der-1000-orte.de/kunstwerke/kunstwerk/raster-d"]
].each_with_index.map do |a,i|
  group,key,title,tier,country,cities,media,work,comment,url=a
  n=(i%10)+1
  id_prefix=group=="current" ? "current" : group
  base(id:"#{id_prefix}-#{DATE}-#{format('%02d',n)}",key:"art-#{DATE}-#{key}",name:(group=="current" ? "#{format('%02d',n)}｜#{title}" : title),tier:tier,country:country,cities:cities,media:media,work:work,comment:comment,url:url)
end

def call(id,key,name,country,cities,media,work,comment,url,deadline,organizer,eligibility,budget,fee)
  image=IMAGES.fetch(url)
  {"category"=>"公開徵件","status"=>"官方來源","updated"=>DATE,"id"=>id,"dedupeKey"=>key,"name"=>name,"tier"=>"競圖資料庫","region"=>"西方","country"=>country,"cityKeywords"=>cities,"media"=>media,"works"=>work,"comment"=>comment,"website"=>url,"workPage"=>url,"photo"=>image,"artistStatement"=>comment,"artistStatementSource"=>url,"classicTitle"=>name.sub(/^\d+｜/,""),"classicImage"=>image,"classicDesc"=>comment,"deadline"=>deadline,"deadlineLabel"=>work.split("｜").last,"deadlineTimezone"=>"Europe/Berlin","deadlinePrecision"=>"time","organizer"=>organizer,"eligibility"=>eligibility,"budget"=>budget,"applicationFee"=>fee,"relatedByCity"=>[]}
end

calls = [
  call("competition-2026-09-04-01","opportunity-2026-augsburg-staatsbibliothek-kunst-am-bau","01｜Augsburg｜州立暨市立圖書館建築藝術競賽","德國 / Augsburg",["Augsburg","奧格斯堡"],["Kunst am Bau","公共藝術","建築整合"],"圖書館室內／戶外兩處藝術｜截止 2026.09.11 23:59 CEST","兩階段競賽徵集能回應圖書館建築、用途與立面的永久作品；第一階段送概念草圖，第二階段才有設計補償。","https://www.stbaa.bayern.de/service/medien/meldungen/2026/kunst-am-bau-wettbewerb-fuer-die-staats-und-stadtbibliothek-augsburg/","2026-09-11T23:59:59+02:00","Freistaat Bayern／Staatliches Bauamt Augsburg","符合官方修訂資格的自由藝術家或團隊；可選戶外、室內或兩處整合提案","實現預算最高 €250,000（含稅）；第二階段每組 €3,000（含稅）","免費"),
  call("competition-2026-09-04-02","opportunity-2026-trier-humboldt-gymnasium-kunst-am-bau","02｜Trier｜Humboldt-Gymnasium 建築藝術競賽","德國 / Trier",["Trier","特里爾"],["Kunst am Bau","校園藝術","建築整合"],"新建樓梯間公共藝術｜截止 2026.09.10 23:59 CEST","公開競賽要求作品在樓梯移動視角中被感知，並回應整合、多元、知識轉變、未來、好奇與自主思考。","https://kunstundbau.rlp.de/wettbewerbe/wettbewerb/trier-humboldt-gymnasium","2026-09-10T23:59:59+02:00","Stadtverwaltung Trier","依公開競賽文件申請之專業藝術家或團隊","總額 €55,784（含材料、藝術家費與增值稅）","免費"),
  call("competition-2026-09-04-03","opportunity-2026-euward10-art-brut","03｜Augustinum Stiftung｜euward10 歐洲 Art Brut 藝術獎","德國 / Munich",["Munich","慕尼黑","Oberschleißheim"],["Art Brut","繪畫","攝影","平面作品"],"euward10｜截止 2026.10.10 23:59 CEST","第十屆 euward 聚焦當代 Art Brut，鼓勵因心智、心理或情緒障礙而受藝術體制排除、且已形成獨立創作脈絡的藝術家申請。","https://www.euward.de/en/application/","2026-10-10T23:59:59+02:00","Augustinum Stiftung","歐洲藝術家；實踐屬當代 Art Brut，提交六件自行創作的二維作品，不接受 AI 生成作品","三名得主之獎金與作品目錄總值約 €30,000，並於 Haus der Kunst 展出","免費；郵寄成本自理"),
  call("competition-2026-09-04-04","opportunity-2027-kunstverein-muensterland-kunstpreis","04｜Kunstverein Münsterland｜2027 視覺藝術獎","德國 / Coesfeld",["Coesfeld","科斯費爾德","Münsterland"],["繪畫","雕塑","攝影","版畫"],"Kunstpreis 2027｜截止 2027.05.01 23:59 CEST","四年一度的藝術獎面向已完成專業訓練且具持續實踐的藝術家，獎項結合現金與個展，將當代創作帶入 Münsterland。","https://www.kunstverein-muensterland.de/index.php/foerderung-kunstschaffende/kunst-preis","2027-05-01T23:59:59+02:00","Kunstverein Münsterland e. V.","德國藝術院校畢業或相當海外學歷，完成學業至少五年；領域為繪畫、版畫、雕塑、立體或攝影","獎金 €10,000，另含 2027.10.10–12.19 得主展","免費"),
  call("competition-2026-09-04-05","opportunity-2026-franz-hecker-stipendium","05｜Kreissparkasse Bersenbrück｜Franz Hecker 創作獎助","德國 / Bersenbrück",["Bersenbrück","貝森布呂克","Osnabrück"],["駐村","繪畫","雕塑","攝影"],"三個月 Hasemühle 創作駐留｜截止 2026.10.30 23:59 CET","三個月駐留讓青年藝術家在 Hasemühle 周邊專注創作，期末於 Kreissparkasse Bersenbrück 展示成果。","https://www.ksk-bersenbrueck.de/de/home/ihre-sparkasse/franz-hecker-stipendium.html","2026-10-30T23:59:59+01:00","Kreissparkasse Bersenbrück","居住於德國或持德國居留證、35 歲以下，從事繪畫、雕塑、版畫或攝影","獎助總額 €10,000；住宿提供但生活與住宿相關費用由得主負擔","免費")
]

def exhibition(id,key,name,country,cities,media,dates,url,type,status,edition,organizer,curator,venue,admission,comment,statement)
  image=IMAGES.fetch(url)
  {"category"=>"國際展覽","status"=>"官方來源","updated"=>DATE,"id"=>id,"dedupeKey"=>key,"name"=>name,"tier"=>"全球重要展覽","region"=>"全球","country"=>country,"cityKeywords"=>cities,"media"=>media,"works"=>"#{name.sub(/^\d+｜/,"")}｜#{dates[0]}–#{dates[1]}","comment"=>comment,"website"=>url,"workPage"=>url,"photo"=>image,"classicTitle"=>name.sub(/^\d+｜/,""),"classicImage"=>image,"classicDesc"=>comment,"exhibitionType"=>type,"exhibitionStatus"=>status,"startDate"=>dates[0],"endDate"=>dates[1],"edition"=>edition,"organizer"=>organizer,"curator"=>curator,"venue"=>venue,"admission"=>admission,"curatorStatement"=>statement,"curatorStatementSource"=>url}
end

exhibitions = [
  exhibition("exhibition-2026-09-04-01","exhibition-2025-sao-paulo-bienal-36","01｜第 36 屆聖保羅雙年展｜Not All Travellers Walk Roads","巴西 / São Paulo",["São Paulo","聖保羅","Ibirapuera Park"],["國際雙年展","跨媒介","調查展"],["2025-09-06","2026-01-11"],"https://bienal.org.br/en/agenda/36th-bienal-de-sao-paulo-not-all-travellers-walk-roads-of-humanity-as-practice/","國際當代藝術雙年展","已結束／檔案","第 36 屆","Fundação Bienal de São Paulo","Bonaventure Soh Bejeng Ndikung；Alya Sebti、Anna Roberta Goetz、Thiago de Paula Souza、Keyna Eleison","Ciccillo Matarazzo Pavilion，Ibirapuera Park","免費","以河口作為差異共存的比喻，六個章節拒絕單一敘事與階序，邀請一百二十五組藝術家從傾聽、相遇與協商重思人性。","策展以 Conceição Evaristo 的詩為起點，將「成為人」理解為需要持續移動、照護與協商的實踐。"),
  exhibition("exhibition-2026-09-04-02","exhibition-2025-singapore-biennale-pure-intention","02｜新加坡雙年展 2025｜pure intention","新加坡 / Singapore",["Singapore","新加坡"],["城市雙年展","公共空間","跨媒介"],["2025-10-31","2026-03-29"],"https://singaporebiennale.org/","城市型國際當代藝術雙年展","已結束／部分作品延長展出","第 8 屆","Singapore Art Museum／National Arts Council Singapore","Singapore Biennale 2025 Curatorial Network","新加坡多處公共空間、住宅區與城市核心場址","依場址；多項公共計畫免費","作品散布日常環境與公共空間，邀請觀眾以新的眼光閱讀城市快速變遷下的儀式、歷史、生活經驗與共同願望。","pure intention 不把城市當中性的展覽背景，而從日常路徑和多層歷史出發，使藝術介入熟悉空間並開啟新的公共觀看。"),
  exhibition("exhibition-2026-09-04-03","exhibition-2025-gibca-hand-all-hands","03｜GIBCA 2025｜a hand that is all our hands combined","瑞典 / Gothenburg",["Gothenburg","哥德堡","Skövde"],["國際雙年展","多場址","社會參與"],["2025-09-20","2025-11-30"],"https://www.gibca.se/gibca/arkiv/gibca-2025/","國際當代藝術雙年展","已結束／檔案","第 13 屆","Röda Sten Konsthall／Göteborg City Cultural Committee","Christina Lehnert","Röda Sten Konsthall、Göteborgs Konsthall、Göteborgs Konstmuseum、Stadsbibliotek Göteborg、Konstmuseet i Skövde","依各合作場址資訊","第十三屆以團結行動與共同責任回應戰爭、極化與威權傾向，透過藝術實踐探問如何建立對話、反思與抵抗。","展名取自 Solmaz Sharif 詩句，將許多人的手合為一隻手，主張藝術自由必須透過聯盟、照護與集體敘事被維持。"),
  exhibition("exhibition-2026-09-04-04","exhibition-2025-liverpool-biennial-bedrock","04｜利物浦雙年展 2025｜BEDROCK","英國 / Liverpool",["Liverpool","利物浦"],["城市雙年展","戶外藝術","多場址"],["2025-06-07","2025-09-14"],"https://www.biennial.com/new-venues-and-full-programme-announced-for-liverpool-biennial-2025/","國際當代藝術雙年展","已結束／檔案","第 13 屆","Liverpool Biennial","Marie-Anne McQuay；Samantha Lackey 與 Liverpool Biennial 團隊","18 處場址，包括 Pine Court、The Black-E、20 Jordan Street 與城市戶外空間","免費展覽與公共活動","BEDROCK 從利物浦砂岩地質與社會基礎出發，以三十組藝術家、二十二件新委託跨越十八處場址，連接帝國歷史、地方信念與城市價值。","策展把 bedrock 同時理解為地質層與城市共同體的根基，讓公共委託回應人、地點及支撐生活的價值。"),
  exhibition("exhibition-2026-09-04-05","exhibition-2024-busan-biennale-seeing-dark","05｜釜山雙年展 2024｜Seeing in the Dark","韓國 / Busan",["Busan","釜山","Eulsukdo","Choryang"],["國際雙年展","多場址","跨媒介"],["2024-08-17","2024-10-20"],"https://www.busan.go.kr/eng/bsevents/1631301","國際當代藝術雙年展","已結束／檔案","2024 屆","Busan Metropolitan City／Busan Biennale Organizing Committee","Vera Mey、Philippe Pirotte","Busan Museum of Contemporary Art、Busan Modern and Contemporary History Museum、HANSUNG1918、Choryang House","依官方場址資訊","七十組國內外參與者在四個場址，以海盜烏托邦與佛寺作為兩個象徵錨點，探索身處黑暗時仍可能生成的另類視角。","Seeing in the Dark 將黑暗視為感知與想像的條件，在逃逸者和沉思者的路徑之間尋找不受既有秩序約束的共同生活。")
]

comp_path=File.join(DATA,"competitions.json")
comp=JSON.parse(File.read(comp_path))
expired_path=File.join(DATA,"expired-20260904.json")
previous_expired=Dir[File.join(DATA,"expired-*.json")].reject{|p|p==expired_path}.flat_map{|p|JSON.parse(File.read(p)).fetch("entries",[])}
existing_expired=File.exist?(expired_path) ? JSON.parse(File.read(expired_path)).fetch("entries",[]) : []
today_expired=comp["entries"].select{|e|e["deadline"] && DateTime.parse(e["deadline"])<=NOW}
archive=(previous_expired+existing_expired+today_expired).uniq{|e|e["dedupeKey"]||e["id"]}
old_keys=previous_expired.map{|e|e["dedupeKey"]||e["id"]}.uniq
removed=archive.count{|e|!old_keys.include?(e["dedupeKey"]||e["id"])}
comp["entries"].reject!{|e|today_expired.include?(e)||e["updated"]==DATE}
existing_keys=comp["entries"].map{|e|e["dedupeKey"]}
calls.each{|e|comp["entries"]<<e unless existing_keys.include?(e["dedupeKey"])}

all_art_files=Dir[File.join(DATA,"backfill-{july,august,september}-*.json")].reject{|p|p.end_with?("manifest.json")||p.end_with?("20260904.json")}
all_art=all_art_files.flat_map{|p|v=JSON.parse(File.read(p));v.is_a?(Hash) ? v.fetch("entries",[]) : v}+arts
def related(item,candidates)
  keys=item.fetch("cityKeywords",[]).map{|x|x.downcase.strip}
  candidates.select{|o|!(keys&o.fetch("cityKeywords",[]).map{|x|x.downcase.strip}).empty?}.map{|o|o["id"]}.uniq
end
arts.each{|e|e["relatedByCity"]=related(e,comp["entries"])}
comp["entries"].each{|e|e["relatedByCity"]=related(e,all_art)}

daily={"meta"=>{"generatedAt"=>GENERATED_AT,"timezone"=>"Asia/Taipei","date"=>DATE,"total"=>20,"dynamicEntries"=>10,"globalClassicEntries"=>5,"germanClassicEntries"=>5,"source"=>"KÖR Wien、Central Park Conservancy、Museum der 1000 Orte 官方頁","note"=>"9/4 固定 10＋5＋5；另有德國公開徵選 5 則與全球重要展覽 5 篇。","linkAudit"=>{"checkedAt"=>GENERATED_AT,"checkedUniqueSources"=>20,"brokenOrBlockedReplaced"=>0,"rule"=>"實際瀏覽器逐頁檢查"},"imageAudit"=>{"checkedAt"=>GENERATED_AT,"imageEntries"=>20,"missing"=>0,"rule"=>"30 張官方直接圖片逐一載入驗證"}},"entries"=>arts}
comp["meta"]={"generatedAt"=>GENERATED_AT,"timezone"=>"Asia/Taipei","date"=>DATE,"dailyTarget"=>5,"source"=>"官方主辦機構徵件頁","activeEntries"=>comp["entries"].length,"addedToday"=>5,"germanAddedToday"=>5,"expiredRemoved"=>removed,"note"=>"9/4 新增 5 筆有效德國公開徵選；移除 #{removed} 筆逾期案件。","linkAudit"=>{"checkedAt"=>GENERATED_AT,"missingCityKeywords"=>0,"uniqueNewSourcesChecked"=>5,"blockedSourceReplaced"=>0}}

ex_path=File.join(DATA,"exhibitions.json")
ex=JSON.parse(File.read(ex_path));ex["entries"].reject!{|e|e["updated"]==DATE}
ex_keys=ex["entries"].map{|e|e["dedupeKey"]};exhibitions.each{|e|ex["entries"]<<e unless ex_keys.include?(e["dedupeKey"])}
ex["meta"]={"generatedAt"=>GENERATED_AT,"timezone"=>"Asia/Taipei","date"=>DATE,"dailyTarget"=>5,"totalEntries"=>ex["entries"].length,"addedToday"=>5,"officialSourceEntries"=>ex["entries"].count{|e|e["status"]=="官方來源"},"imageEntries"=>ex["entries"].count{|e|!e["photo"].to_s.empty?},"note"=>"9/4 新增 5 篇全球重要展覽；全部使用可開啟官方來源與可載入圖片。"}

File.write(File.join(DATA,"backfill-september-20260904.json"),JSON.pretty_generate(daily)+"\n")
File.write(comp_path,JSON.pretty_generate(comp)+"\n")
File.write(ex_path,JSON.pretty_generate(ex)+"\n")

sept_path=File.join(DATA,"backfill-september-manifest.json");sept=JSON.parse(File.read(sept_path));files=(sept.fetch("files",[])+["backfill-september-20260904.json"]).uniq.sort
sept.merge!({"version"=>"2026-09-04-public-art-r58","generatedAt"=>GENERATED_AT,"files"=>files,"expectedEntries"=>files.length*20,"statementEntries"=>files.length*20,"statementSourceEntries"=>files.length*20,"statementBacklog"=>0,"imageEntries"=>files.length*20,"imageBacklog"=>0,"note"=>"截至 2026-09-04 累計 #{files.length*20} 則；今日新增 20 則公共藝術（10／5／5）。"});File.write(sept_path,JSON.pretty_generate(sept)+"\n")
cm_path=File.join(DATA,"competition-manifest.json");cm=JSON.parse(File.read(cm_path));cm.merge!({"version"=>"2026-09-04-competition-r35","generatedAt"=>GENERATED_AT,"activeEntries"=>comp["entries"].length,"addedToday"=>5,"germanAddedToday"=>5,"expiredRemoved"=>removed,"deadlineTimezoneEntries"=>comp["entries"].count{|e|e["deadlineTimezone"]},"deadlinePrecisionEntries"=>comp["entries"].count{|e|e["deadlinePrecision"]},"cityKeywordEntries"=>comp["entries"].count{|e|!e.fetch("cityKeywords",[]).empty?},"note"=>"2026-09-04 新增 5 則德國公開徵選並移除 #{removed} 則今日逾期案件。"});File.write(cm_path,JSON.pretty_generate(cm)+"\n")
em_path=File.join(DATA,"exhibition-manifest.json");em=JSON.parse(File.read(em_path));em.merge!({"version"=>"2026-09-04-global-exhibitions-r6","generatedAt"=>GENERATED_AT,"dailyTarget"=>5,"totalEntries"=>ex["entries"].length,"addedToday"=>5,"officialSourceEntries"=>ex["entries"].count{|e|e["status"]=="官方來源"},"imageEntries"=>ex["entries"].count{|e|!e["photo"].to_s.empty?},"note"=>"2026-09-04 新增 5 篇全球重要展覽；全部使用官方來源與可顯示圖片。"});File.write(em_path,JSON.pretty_generate(em)+"\n")
File.write(expired_path,JSON.pretty_generate({"archivedAt"=>GENERATED_AT,"removedToday"=>removed,"entries"=>archive})+"\n")
File.write(File.join(DATA,"deploy-touch.txt"),"2026-09-04 daily r58 — 20 public artworks + 5 active German open calls + 5 global exhibitions; 30 source pages and images verified; #{removed} expired calls removed.\n")
