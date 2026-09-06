#!/usr/bin/env ruby
# frozen_string_literal: true

require 'json'
require 'time'
require 'uri'

ROOT = File.expand_path('..', __dir__)
DATA_DIR = File.join(ROOT, 'data')
DATE = '2026-09-06'
TIER = '全球指標藝術節展'

def event(slug:, zh:, original:, country:, cities:, region:, media:, works:, comment:, source:, image:,
          exhibition_type:, founded:, frequency:, organizer:, venue:, focus:, importance:, local_image: nil)
  extension = File.extname(URI.parse(image).path).downcase
  extension = '.jpg' if extension == '.jpeg' || extension.empty?
  card_image = local_image || "assets/landmark-events/#{slug}#{extension}"
  {
    'id' => "landmark-event-#{slug}",
    'dedupeKey' => "landmark-series-#{slug}",
    'name' => "#{zh}｜#{original}",
    'classicTitle' => "#{zh}｜#{original}",
    'category' => '藝術節',
    'tier' => TIER,
    'region' => region,
    'country' => country,
    'cityKeywords' => cities,
    'media' => media,
    'works' => works,
    'comment' => comment,
    'website' => source,
    'workPage' => source,
    'photo' => card_image,
    'classicImage' => card_image,
    'sourceImage' => image,
    'classicDesc' => importance,
    'status' => '官方來源',
    'updated' => DATE,
    'exhibitionType' => exhibition_type,
    'exhibitionStatus' => '持續舉辦',
    'edition' => '系列檔案',
    'organizer' => organizer,
    'curator' => '各屆由主辦機構委任藝術總監／策展團隊',
    'venue' => venue,
    'admission' => '依各屆官方公告',
    'curatorStatement' => comment,
    'curatorStatementSource' => source,
    'founded' => founded,
    'frequency' => frequency,
    'focusAreas' => focus,
    'importance' => importance
  }
end

entries = [
  event(
    slug: 'venice-biennale-arte', zh: '威尼斯國際藝術雙年展', original: 'Biennale Arte',
    country: '義大利 / Venice', cities: ['Venice', 'Venezia', '威尼斯'], region: '西方',
    media: ['平台/策展', '建築/場域', '裝置'],
    works: '1895 創辦｜每 2 年｜Giardini、Arsenale 與威尼斯全城',
    comment: '以國家館、主題展與城市展場共同構成全球當代藝術最具制度影響力的雙年展模型；其展覽史也映照國際文化政治與策展觀念的變化。',
    source: 'https://www.labiennale.org/en/history-biennale-arte',
    image: 'https://static.labiennale.org/files/styles/full_screen_slide/public/arte/sTORIA/storia-arte.jpg',
    exhibition_type: '國際當代藝術雙年展', founded: '1895', frequency: '每 2 年',
    organizer: 'La Biennale di Venezia', venue: 'Giardini、Arsenale 與威尼斯多處場址',
    focus: ['藝術', '策展', '建築', '城市場域'],
    importance: '現代國際雙年展制度的原型，也是國家館展示、全球策展與城市文化外交最具代表性的舞台。'
  ),
  event(
    slug: 'documenta', zh: '卡塞爾文件展', original: 'documenta',
    country: '德國 / Kassel', cities: ['Kassel', '卡塞爾'], region: '西方',
    media: ['平台/策展', '建築/場域', '社會參與'],
    works: '1955 創辦｜每 5 年｜卡塞爾全城與 Fridericianum',
    comment: '每五年以長時段研究重寫當代藝術的議題座標；展覽把作品、檔案、公共討論與城市場域組成一套可被辯論的世界觀。',
    source: 'https://documenta.de/en/about/documenta',
    image: 'https://documenta.de/media/site/fc7c44c520-1744816169/ops-documenta-identity-press-1-_seite_4-1408x-1-1200x630-crop.png',
    exhibition_type: '國際當代藝術五年展', founded: '1955', frequency: '每 5 年',
    organizer: 'documenta und Museum Fridericianum gGmbH', venue: 'Fridericianum 與卡塞爾全城',
    focus: ['藝術', '研究', '策展', '社會'],
    importance: '以五年一次的長週期、學術密度與公共辯論，成為檢視當代藝術轉向的全球基準。'
  ),
  event(
    slug: 'site-santa-fe-international', zh: 'SITE SANTA FE 國際雙年展', original: 'SITE SANTA FE International Biennial',
    country: '美國 / Santa Fe', cities: ['Santa Fe', 'New Mexico', '聖塔菲', '新墨西哥'], region: '西方',
    media: ['平台/策展', '地景/大地藝術', '社會參與'],
    works: '1995 創辦｜雙年制／依各屆計畫｜SITE SANTA FE 與聖塔菲城市場址',
    comment: '創辦時是美國少數城市型國際雙年展之一；藝術家與策展人從新墨西哥獨特的地理、歷史與文化出發，發展跨機構與非典型場址的新作。',
    source: 'https://www.sitesantafe.org/en/international/',
    image: 'https://cdn.sanity.io/images/nbx48pes/production/41f68f3f4d875f74cbd1966e7836400e0fa18d0f-3680x2453.jpg',
    exhibition_type: '國際當代藝術雙年展', founded: '1995', frequency: '雙年制／依各屆計畫',
    organizer: 'SITE SANTA FE', venue: 'SITE SANTA FE、合作機構與聖塔菲城市場址',
    focus: ['藝術', '地景', '策展', '城市'],
    importance: '美國早期城市型國際雙年展的重要模型，以藝術家為核心並讓全球實踐回應新墨西哥的地方條件。'
  ),
  event(
    slug: 'gwangju-biennale', zh: '光州雙年展', original: 'Gwangju Biennale',
    country: '韓國 / Gwangju', cities: ['Gwangju', '光州'], region: '東亞',
    media: ['平台/策展', '社會參與', '光/影像/投影'],
    works: '1995 創辦｜每 2 年｜Gwangju Biennale Exhibition Hall 與城市場址',
    comment: '以光州民主運動的歷史記憶為精神背景，把亞洲當代藝術、民主、人權與全球議題放進同一個策展平台。',
    source: 'https://gwangjubiennale.org/en/foundation/organization.do',
    image: 'https://gwangjubiennale.org/resources/img/sns/gb_sns.jpg',
    exhibition_type: '國際當代藝術雙年展', founded: '1995', frequency: '每 2 年',
    organizer: 'Gwangju Biennale Foundation', venue: 'Gwangju Biennale Exhibition Hall 與光州市區',
    focus: ['藝術', '亞洲', '民主', '社會'],
    importance: '亞洲最具歷史份量的雙年展之一，讓城市民主記憶成為國際當代藝術論述的核心。'
  ),
  event(
    slug: 'biennale-of-sydney', zh: '雪梨雙年展', original: 'Biennale of Sydney',
    country: '澳洲 / Sydney', cities: ['Sydney', '雪梨'], region: '大洋洲',
    media: ['平台/策展', '建築/場域', '裝置'],
    works: '1973 創辦｜每 2 年｜雪梨多處文化設施與公共場域',
    comment: '以海港城市的多元場館串聯澳洲、亞太與全球藝術實踐，免費展覽模式讓大尺度當代藝術面向廣泛公眾。',
    source: 'https://www.biennaleofsydney.art/',
    image: 'https://www.biennaleofsydney.art/wp-content/uploads/2025/10/WBPS_Biennale-25-Install_Nikesha-Breeze_Document-Photography_March-26-1.jpg',
    exhibition_type: '國際當代藝術雙年展', founded: '1973', frequency: '每 2 年',
    organizer: 'Biennale of Sydney', venue: '雪梨多處美術館、文化設施與公共空間',
    focus: ['藝術', '亞太', '城市場域', '公共性'],
    importance: '亞太地區歷史悠久的國際雙年展，透過跨場館與免費開放建立高公共性的展覽模型。'
  ),
  event(
    slug: 'istanbul-biennial', zh: '伊斯坦堡雙年展', original: 'Istanbul Biennial',
    country: '土耳其 / Istanbul', cities: ['Istanbul', '伊斯坦堡'], region: '南亞/中東',
    media: ['平台/策展', '建築/場域', '社會參與'],
    works: '1987 創辦｜每 2 年｜伊斯坦堡歷史建築與城市場址',
    comment: '以橫跨歐亞的都市位置，把地緣政治、移動、記憶與城市轉型轉譯為跨場址展覽，是理解區域與全球關係的重要窗口。',
    source: 'https://bienal.iksv.org/en',
    image: 'https://bienal.iksv.org/i/content/33986_2_18ib-rehber-768x626.jpg',
    exhibition_type: '國際當代藝術雙年展', founded: '1987', frequency: '每 2 年',
    organizer: 'Istanbul Foundation for Culture and Arts (İKSV)', venue: '伊斯坦堡歷史建築、文化空間與城市場址',
    focus: ['藝術', '城市', '地緣政治', '建築'],
    importance: '以歐亞交界城市作為展覽方法，持續改寫中心與邊界、在地與國際的關係。'
  ),
  event(
    slug: 'sharjah-biennial', zh: '沙迦雙年展', original: 'Sharjah Biennial',
    country: '阿拉伯聯合大公國 / Sharjah', cities: ['Sharjah', '沙迦'], region: '南亞/中東',
    media: ['平台/策展', '建築/場域', '社會參與'],
    works: '1993 創辦｜每 2 年｜沙迦市區與文化遺產場址',
    comment: '長期從全球南方、後殖民與跨區域視角重構當代藝術敘事，並把歷史建築、社群與城市尺度納入作品生產。',
    source: 'https://www.sharjahart.org/en/press/details/sharjah-art-foundation-announces-details-of-sharjah-biennial-17',
    image: 'https://www.sharjahart.org/images/Thumbnail/SB17__Thumbnail.jpg',
    exhibition_type: '國際當代藝術雙年展', founded: '1993', frequency: '每 2 年',
    organizer: 'Sharjah Art Foundation', venue: '沙迦市區、文化遺產區與周邊場址',
    focus: ['藝術', '全球南方', '建築', '社群'],
    importance: '全球南方策展網絡的關鍵節點，對跨區域研究、委託製作與去中心化敘事影響深遠。'
  ),
  event(
    slug: 'berlin-biennale', zh: '柏林當代藝術雙年展', original: 'Berlin Biennale for Contemporary Art',
    country: '德國 / Berlin', cities: ['Berlin', '柏林'], region: '西方',
    media: ['平台/策展', '社會參與', '建築/場域'],
    works: '1998 創辦｜約每 2 年｜KW Institute 與柏林多處場址',
    comment: '以策展實驗快速回應政治、媒體、都市生活與當代文化，藉由柏林的機構與非典型空間形成高度時事性的展覽。',
    source: 'https://www.berlinbiennale.de/en/',
    image: 'https://www.berlinbiennale.de/images/BB13_Short_square_black.jpg?w=200',
    exhibition_type: '國際當代藝術雙年展', founded: '1998', frequency: '約每 2 年',
    organizer: 'KUNST-WERKE BERLIN e. V.', venue: 'KW Institute for Contemporary Art 與柏林多處場址',
    focus: ['藝術', '策展', '政治', '城市'],
    importance: '以新銳策展與當代政治敏感度著稱，是觀察歐洲藝術論述變化的重要節點。'
  ),
  event(
    slug: 'manifesta', zh: '歐洲游牧雙年展', original: 'Manifesta',
    country: '歐洲 / Nomadic host city', cities: ['Europe', '歐洲', 'Nomadic'], region: '西方',
    media: ['平台/策展', '建築/場域', '社會參與'],
    works: '1996 創辦｜每 2 年移動城市｜歐洲不同主辦城市',
    comment: '每屆遷移至不同歐洲城市，先以城市研究、跨專業團隊與在地合作形成展覽，再將文化基礎設施與社會議題公開化。',
    source: 'https://manifesta16.org/',
    image: 'https://m16-stack.fra1.cdn.digitaloceanspaces.com/20250709_MANIFESTA16_UrbanVisionPresentation__Anton_Vichrov-1-4-2420x1613.jpg',
    exhibition_type: '歐洲游牧當代藝術雙年展', founded: '1996', frequency: '每 2 年、移動城市',
    organizer: 'Manifesta Foundation', venue: '每屆由不同歐洲城市及其社區、建築場址共同承辦',
    focus: ['藝術', '建築', '城市研究', '社會'],
    importance: '以「游牧」制度把展覽轉化為城市研究與文化基礎設施實驗，是跨城市雙年展的代表。'
  ),
  event(
    slug: 'yokohama-triennale', zh: '橫濱三年展', original: 'Yokohama Triennale',
    country: '日本 / Yokohama', cities: ['Yokohama', '橫濱'], region: '東亞',
    media: ['平台/策展', '建築/場域', '裝置'],
    works: '2001 創辦｜每 3 年｜Yokohama Museum of Art 與港區場址',
    comment: '以港口城市的歷史、跨文化流動與大型文化設施為背景，讓國際當代藝術和橫濱都市空間彼此回應。',
    source: 'https://www.yokohamatriennale.jp/english/about/',
    image: 'https://www.yokohamatriennale.jp/english/assets/images/common/pht_yokohama.jpg',
    exhibition_type: '國際當代藝術三年展', founded: '2001', frequency: '每 3 年',
    organizer: 'City of Yokohama、Yokohama Arts Foundation 等', venue: 'Yokohama Museum of Art 與橫濱港區',
    focus: ['藝術', '城市', '港口文化', '建築'],
    importance: '日本代表性的國際三年展，將港口都市史與跨文化交流轉化為策展尺度。'
  ),
  event(
    slug: 'aichi-triennale', zh: '愛知三年展', original: 'Aichi Triennale',
    country: '日本 / Aichi', cities: ['Aichi', 'Nagoya', '愛知', '名古屋'], region: '東亞',
    media: ['平台/策展', '建築/場域', '社會參與'],
    works: '2010 創辦｜每 3 年｜愛知縣文化設施與城市場址',
    comment: '跨越視覺藝術、表演、學習計畫與城市空間，透過愛知的工業、文化與地方網絡建立多中心的三年展。',
    source: 'https://aichitriennale.jp/en/',
    image: 'https://aichitriennale.jp/img/site.png',
    exhibition_type: '國際當代藝術三年展', founded: '2010', frequency: '每 3 年',
    organizer: 'Aichi Triennale Organizing Committee', venue: '愛知藝術文化中心與愛知縣多處場址',
    focus: ['藝術', '表演', '城市', '社會'],
    importance: '日本跨媒介三年展的重要案例，以多城市、多場址和公眾計畫擴張美術館邊界。'
  ),
  event(
    slug: 'kochi-muziris-biennale', zh: '科欽—穆吉里斯雙年展', original: 'Kochi-Muziris Biennale',
    country: '印度 / Kochi', cities: ['Kochi', 'Fort Kochi', 'Mattancherry', '科欽'], region: '南亞/中東',
    media: ['平台/策展', '建築/場域', '社會參與'],
    works: '2012 創辦｜每 2 年｜Fort Kochi、Mattancherry 歷史建築群',
    comment: '由藝術家發起，將港口、殖民建築、倉庫與社區轉化為展場；其場址回應方法讓印度洋歷史與當代藝術並置。',
    source: 'https://www.kochimuzirisbiennale.org/',
    image: 'https://kochimuzirisbiennale.org/kmb-2025-logo.jpg',
    exhibition_type: '國際當代藝術雙年展', founded: '2012', frequency: '每 2 年',
    organizer: 'Kochi Biennale Foundation', venue: 'Fort Kochi、Mattancherry 與 Ernakulam 多處歷史場址',
    focus: ['藝術', '建築', '印度洋', '社群'],
    importance: '印度規模與國際影響力最顯著的當代藝術雙年展，以藝術家主導和歷史建築再利用著稱。'
  ),
  event(
    slug: 'liverpool-biennial', zh: '利物浦雙年展', original: 'Liverpool Biennial',
    country: '英國 / Liverpool', cities: ['Liverpool', '利物浦'], region: '西方',
    media: ['平台/策展', '建築/場域', '社會參與'],
    works: '1998 創辦｜每 2 年｜利物浦美術館、公共空間與城市建築',
    comment: '以免費展覽與新作委託把城市歷史、港口文化、社群和國際藝術連結，作品常直接介入街道與公共建築。',
    source: 'https://www.biennial.com/who-we-are/',
    image: 'https://www.biennial.com/wp-content/uploads/2023/04/Ugo-Rondinone-Liverpool-Mountain-2018.-Photo-Mark-McNulty-3.jpg',
    exhibition_type: '國際當代藝術雙年展', founded: '1998', frequency: '每 2 年',
    organizer: 'Liverpool Biennial', venue: '利物浦文化機構、公共空間與城市場址',
    focus: ['藝術', '城市', '公共藝術', '社群'],
    importance: '英國規模最大的免費當代視覺藝術節之一，建立了委託製作與都市公共空間結合的長期模型。'
  ),
  event(
    slug: 'dakar-biennale', zh: '達卡非洲當代藝術雙年展', original: 'Dak’Art — Biennale de Dakar',
    country: '塞內加爾 / Dakar', cities: ['Dakar', '達卡'], region: '非洲',
    media: ['平台/策展', '社會參與', '建築/場域'],
    works: '1990 創辦｜每 2 年｜達卡文化機構與城市場址',
    comment: '以非洲與非洲離散藝術為主體建立國際平台，官方展與遍布城市的 OFF 計畫共同形成達卡的文化地圖。',
    source: 'https://biennaledakar.org/',
    image: 'https://biennaledakar.org/wp-content/uploads/2022/01/LOGO-BIENNALE-02.jpg',
    exhibition_type: '非洲當代藝術雙年展', founded: '1990', frequency: '每 2 年',
    organizer: 'Ministry of Culture of Senegal / Biennale de Dakar', venue: '達卡文化機構、公共空間與 OFF 衛星場址',
    focus: ['藝術', '非洲', '離散文化', '城市'],
    importance: '非洲大陸最重要的國際當代藝術平台之一，將非洲藝術家、策展人與城市文化網絡置於中心。'
  ),
  event(
    slug: 'setouchi-triennale', zh: '瀨戶內國際藝術祭', original: 'Setouchi Triennale',
    country: '日本 / Setouchi Islands', cities: ['Setouchi', 'Naoshima', 'Teshima', '瀨戶內', '直島', '豐島'], region: '東亞',
    media: ['地景/大地藝術', '建築/場域', '社會參與'],
    works: '2010 創辦｜每 3 年｜瀨戶內海島嶼與沿岸地區',
    comment: '以「海的復權」為核心，把島嶼景觀、人口變遷、建築再生、地方飲食與藝術委託連成跨島航線。',
    source: 'https://setouchi-artfest.jp/en/about/',
    image: 'https://setouchi-artfest.jp/img/ogp.png',
    exhibition_type: '島嶼型國際藝術三年展', founded: '2010', frequency: '每 3 年',
    organizer: 'Setouchi Triennale Executive Committee', venue: '瀨戶內海島嶼與沿岸地區',
    focus: ['藝術', '地景', '建築', '地域再生'],
    importance: '全球最具代表性的島嶼藝術祭，讓大地藝術、交通、聚落與長期地域再生形成一套完整方法。',
    local_image: 'assets/landmark-events/setouchi-triennale.jpg'
  ),
  event(
    slug: 'echigo-tsumari-art-triennale', zh: '越後妻有大地藝術祭', original: 'Echigo-Tsumari Art Triennale',
    country: '日本 / Niigata', cities: ['Echigo-Tsumari', 'Tokamachi', 'Tsunan', '越後妻有', '十日町'], region: '東亞',
    media: ['地景/大地藝術', '建築/場域', '社會參與'],
    works: '2000 創辦｜每 3 年｜新潟縣十日町市與津南町',
    comment: '以「人類屬於自然」為精神，長期在里山、廢校、聚落與農地中生產作品，讓藝術成為閱讀地方、維繫社群的基礎設施。',
    source: 'https://www.echigo-tsumari.jp/en/about/',
    image: 'https://www.echigo-tsumari.jp/assets/img/about/index_pc.jpg',
    exhibition_type: '地域型大地藝術三年展', founded: '2000', frequency: '每 3 年',
    organizer: 'Echigo-Tsumari Art Field Executive Committee', venue: '十日町市、津南町的里山、聚落與廢校',
    focus: ['藝術', '地景', '建築', '地域再生'],
    importance: '地域型大地藝術祭的全球範本，證明藝術可用長期合作重新連結人口流失地區的土地與生活。'
  ),
  event(
    slug: 'desert-x', zh: '沙漠 X', original: 'Desert X',
    country: '美國 / Coachella Valley', cities: ['Coachella Valley', 'Palm Springs', '科切拉谷'], region: '西方',
    media: ['地景/大地藝術', '裝置', '建築/場域'],
    works: '2017 創辦｜每 2 年｜南加州科切拉谷沙漠地景',
    comment: '以沙漠的地質、水、原住民歷史、房地產與氣候條件作為作品尺度，讓觀眾在跨距離移動中閱讀地景。',
    source: 'https://desertx.org/',
    image: 'https://desertx.org/media/site/a6dbdb96be-1751399965/dx25-sanford-biggers-1-lance-gerber-3000px-1200x630.jpg',
    exhibition_type: '沙漠地景藝術雙年展', founded: '2017', frequency: '每 2 年',
    organizer: 'Desert X', venue: 'Coachella Valley 多處戶外場址',
    focus: ['藝術', '地景', '氣候', '建築'],
    importance: '當代沙漠地景展覽的代表，將大型戶外委託與環境、原住民和土地政治並置。'
  ),
  event(
    slug: 'sonsbeek', zh: '松斯貝克藝術展', original: 'Sonsbeek',
    country: '荷蘭 / Arnhem', cities: ['Arnhem', 'Sonsbeek', '阿納姆'], region: '西方',
    media: ['地景/大地藝術', '雕塑', '社會參與'],
    works: '1949 創辦｜不定期長週期｜Sonsbeek Park 與阿納姆城市空間',
    comment: '從戰後戶外雕塑展起步，逐步轉向地景、公共空間、社會關係與時間性的策展實驗；每一屆都重新定義城市與戶外展覽。',
    source: 'https://sonsbeek.org/en/',
    image: 'https://sonsbeek.org/uploads/2026/_desktoplarge/7198/1500px-Website_Sonsbeek2026_V1_NEW.webp',
    exhibition_type: '國際戶外藝術展', founded: '1949', frequency: '不定期、長週期',
    organizer: 'Sonsbeek Foundation', venue: 'Sonsbeek Park 與 Arnhem 城市場址',
    focus: ['藝術', '地景', '公共空間', '社會'],
    importance: '戰後戶外雕塑與公共藝術展覽史的關鍵系列，對場域特定、地景及社會實踐均有深遠影響。'
  ),
  event(
    slug: 'skulptur-projekte-muenster', zh: '明斯特雕塑計畫', original: 'Skulptur Projekte Münster',
    country: '德國 / Münster', cities: ['Münster', '明斯特'], region: '西方',
    media: ['雕塑', '建築/場域', '社會參與'],
    works: '1977 創辦｜每 10 年｜明斯特全城公共空間',
    comment: '十年一次的超長週期讓藝術家深入測試城市、建築、制度與公眾的關係；部分作品永久保留，持續改變明斯特的公共藝術地圖。',
    source: 'https://skulptur-projekte.de/en/about-us/',
    image: 'https://skulptur-projekte.de/files/images/image1.png',
    exhibition_type: '城市公共藝術十年展', founded: '1977', frequency: '每 10 年',
    organizer: 'LWL-Museum für Kunst und Kultur、City of Münster', venue: '明斯特全城公共空間',
    focus: ['藝術', '公共空間', '建築', '城市'],
    importance: '公共藝術與場域特定實踐的世界級基準，以十年一次的研究深度取代事件式堆疊。'
  ),
  event(
    slug: 'bruges-triennial', zh: '布魯日三年展', original: 'Bruges Triennial',
    country: '比利時 / Bruges', cities: ['Bruges', 'Brugge', '布魯日'], region: '西方',
    media: ['建築/場域', '地景/大地藝術', '裝置'],
    works: '1968 創辦、2015 復辦｜每 3 年｜布魯日世界遺產歷史城區',
    comment: '每三年邀請藝術家與建築師在世界遺產城市中製作場域特定裝置，以暫時介入測試水道、街道、公共空間與歷史保存的未來可能。',
    source: 'https://triennalebrugge.be/en/about-us/about-bruges-triennial',
    image: 'https://triennalebrugge.be/volumes/general/Installaties/2024/common-thread-SOIL/_1200x630_crop_center-center_82_none/016-SO-IL-TRIBRU-2024.jpeg?v=1777035173%2C0.5749%2C0.6513',
    exhibition_type: '國際藝術與建築三年展', founded: '1968（2015 復辦）', frequency: '每 3 年',
    organizer: 'City of Bruges / Brugge Plus vzw', venue: '布魯日歷史城區、運河與公共空間',
    focus: ['藝術', '設計', '建築', '地景'],
    importance: '把當代藝術、建築與世界遺產城市的公共空間直接結合，是城市尺度場域特定展覽的鮮明案例。'
  ),
  event(
    slug: 'triennale-milano', zh: '米蘭三年展國際展', original: 'Triennale Milano International Exhibition',
    country: '義大利 / Milan', cities: ['Milan', 'Milano', '米蘭'], region: '西方',
    media: ['建築/場域', '平台/策展', '裝置'],
    works: '1923 起源｜1933 起三年制｜Palazzo dell’Arte',
    comment: '從裝飾藝術展發展為設計、建築、藝術與社會研究交會的國際展，百年歷史映照現代生活形式與產業文化的變遷。',
    source: 'https://triennale.org/en/about/history-and-mission',
    image: 'https://images.prismic.io/triennale/84c65b17819125986bff486055badbd0125b768f_i.jpg',
    exhibition_type: '國際設計、建築與藝術三年展', founded: '1923', frequency: '每 3 年（歷史上曾調整）',
    organizer: 'Fondazione La Triennale di Milano', venue: 'Palazzo dell’Arte, Milan',
    focus: ['設計', '建築', '藝術', '社會'],
    importance: '全球歷史最悠久且跨設計、建築與藝術的重要國際展覽系列之一。'
  ),
  event(
    slug: 'london-design-biennale', zh: '倫敦設計雙年展', original: 'London Design Biennale',
    country: '英國 / London', cities: ['London', 'Somerset House', '倫敦'], region: '西方',
    media: ['平台/策展', '建築/場域', '數位/互動'],
    works: '2016 創辦｜每 2 年｜Somerset House',
    comment: '由不同國家與城市的設計團隊以裝置回應共同主題，將設計研究、科技、材料與社會想像轉化為可進入的空間經驗。',
    source: 'https://londondesignbiennale.com/about',
    image: 'https://a.storyblok.com/f/186937/1200x627/a0dd16142b/og-image-ldb-optimized.png',
    exhibition_type: '國際設計雙年展', founded: '2016', frequency: '每 2 年',
    organizer: 'London Design Biennale', venue: 'Somerset House, London',
    focus: ['設計', '建築', '科技', '社會'],
    importance: '以國際參與者和主題式設計裝置建立文化外交與設計思辨並行的平台。'
  )
]

payload = {
  'meta' => {
    'generatedAt' => '2026-09-06T20:00:00+08:00',
    'timezone' => 'Asia/Taipei',
    'date' => DATE,
    'tier' => TIER,
    'totalEntries' => entries.length,
    'officialSourceEntries' => entries.count { |entry| entry['status'] == '官方來源' },
    'imageEntries' => entries.count { |entry| !entry['classicImage'].to_s.empty? },
    'note' => '系列級全球指標藝術節展首批建檔；獨立於每日全球重要展覽。'
  },
  'entries' => entries
}

manifest = {
  'version' => '2026-09-06-landmark-events-r1',
  'generatedAt' => payload['meta']['generatedAt'],
  'timezone' => payload['meta']['timezone'],
  'dataFile' => 'landmark-events.json',
  'totalEntries' => entries.length,
  'officialSourceEntries' => payload['meta']['officialSourceEntries'],
  'imageEntries' => payload['meta']['imageEntries'],
  'coverage' => entries.flat_map { |entry| entry['focusAreas'] }.uniq.sort,
  'note' => payload['meta']['note']
}

File.write(File.join(DATA_DIR, 'landmark-events.json'), JSON.pretty_generate(payload) + "\n")
File.write(File.join(DATA_DIR, 'landmark-event-manifest.json'), JSON.pretty_generate(manifest) + "\n")

warn "generated #{entries.length} landmark events"
