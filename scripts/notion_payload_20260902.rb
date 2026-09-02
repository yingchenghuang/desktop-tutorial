require "json"

root = File.expand_path("..", __dir__)
art = JSON.parse(File.read(File.join(root, "data/backfill-september-20260902.json"))).fetch("entries")
calls = JSON.parse(File.read(File.join(root, "data/competitions.json"))).fetch("entries").select { |e| e["updated"] == "2026-09-02" }
exhibitions = JSON.parse(File.read(File.join(root, "data/exhibitions.json"))).fetch("entries").select { |e| e["updated"] == "2026-09-02" }

def notion_media(values)
  text = values.join(" ").downcase
  out = []
  out << "地景/大地藝術" if text.match?(/地景|land|戶外/)
  out << "雕塑" if text.match?(/雕塑|sculpt|青銅|石材|紅木|瓷器/)
  out << "裝置" if text.match?(/裝置|install|圖騰|球桌/)
  out << "建築/場域" if text.match?(/建築|場域|公共空間|公園|街道|城市|教堂|庭院/)
  out << "光/影像/投影" if text.match?(/光|影像|投影|錄像|攝影|媒體/)
  out << "社會參與" if text.match?(/社會|社區|參與|共同|互動|遊行|合作/)
  out << "壁畫/街頭" if text.match?(/壁畫|街頭|urban art/)
  out << "聲音/霧/水" if text.match?(/聲音|水|海洋|瀑布/)
  out << "數位/互動" if text.match?(/數位|互動|interactive/)
  out << "紀念性公共藝術" if text.match?(/紀念/)
  out << "平台/策展" if text.match?(/展覽|策展|雙年展|文件展|藝術展|調查展|獎助|基金/)
  out = ["建築/場域"] if out.empty?
  out.uniq
end

def source_body(e, image, extra = [])
  lines = [
    "![#{e["name"]}｜圖片](#{image})",
    "<callout icon=\"🔵\" color=\"blue_bg\">",
    "\t#{e["comment"]}",
    "</callout>",
    "## 基本資料",
    "- **代表作／項目：** #{e["works"]}",
    "- **城市關鍵字：** #{e.fetch("cityKeywords", []).join("、")}",
    "- **媒介：** #{e.fetch("media", []).join("、")}",
    *extra,
    "## 第一方論述",
    e["artistStatement"] || e["curatorStatement"] || e["comment"],
    "## 官方來源",
    "- [官方頁面](#{e["website"]})",
    "- [圖片／作品頁](#{e["workPage"] || e["website"]})"
  ]
  lines.join("\n")
end

def common_props(e, image)
  {
    "名稱" => e["name"],
    "類別" => e["category"],
    "來源狀態" => "官方來源",
    "層級" => e["tier"],
    "地區" => e["region"],
    "國家地區" => e["country"],
    "城市關鍵字" => e.fetch("cityKeywords", []).join("、"),
    "媒介類型" => notion_media(e.fetch("media", [])),
    "代表作" => e["works"],
    "重點短評" => e["comment"],
    "官網連結" => e["website"],
    "圖片/作品頁" => e["workPage"] || e["website"],
    "個人照片" => image,
    "創作者創作論述" => e["artistStatement"] || e["curatorStatement"] || e["comment"],
    "創作論述來源" => e["artistStatementSource"] || e["curatorStatementSource"] || e["website"],
    "去重Key" => e["dedupeKey"],
    "同城關聯" => e.fetch("relatedByCity", []).join("、"),
    "經典作品名稱" => e["classicTitle"],
    "經典作品圖" => e["classicImage"] || image,
    "經典作品詳介" => e["classicDesc"] || e["comment"],
    "date:資訊更新日期:start" => "2026-09-02",
    "date:資訊更新日期:is_datetime" => 0
  }
end

def standard_page(e)
  image = e["classicImage"] || e["photo"]
  is_call = e["category"] == "公開徵件"
  extra = []
  if is_call
    extra = [
      "- **截止：** #{e["deadlineLabel"]}（#{e["deadlineTimezone"]}）",
      "- **主辦單位：** #{e["organizer"]}",
      "- **參與資格：** #{e["eligibility"]}",
      "- **預算：** #{e["budget"]}",
      "- **申請費：** #{e["applicationFee"]}"
    ]
  end
  props = common_props(e, image)
  if is_call
    props.merge!({
      "主辦單位" => e["organizer"],
      "參與資格" => e["eligibility"],
      "預算" => e["budget"],
      "申請費" => e["applicationFee"],
      "截止時區" => e["deadlineTimezone"],
      "截止精度" => e["deadlinePrecision"],
      "date:截止日期:start" => e["deadline"],
      "date:截止日期:is_datetime" => 1
    })
  end
  { "properties" => props, "content" => source_body(e, image, extra), "icon" => (is_call ? "📣" : "🔵") }
end

def exhibition_page(e)
  image = e["classicImage"] || e["photo"]
  props = common_props(e, image).merge({
    "主辦單位" => e["organizer"],
    "展覽類型" => e["exhibitionType"],
    "展覽狀態" => e["exhibitionStatus"],
    "date:展覽開始:start" => e["startDate"],
    "date:展覽開始:is_datetime" => 0,
    "date:展覽結束:start" => e["endDate"],
    "date:展覽結束:is_datetime" => 0,
    "屆次" => e["edition"],
    "策展人" => e["curator"],
    "展覽場地" => e["venue"],
    "入場資訊" => e["admission"],
    "策展論述" => e["curatorStatement"],
    "策展論述來源" => e["curatorStatementSource"]
  })
  extra = [
    "- **展覽類型：** #{e["exhibitionType"]}",
    "- **展期：** #{e["startDate"]}–#{e["endDate"]}",
    "- **屆次：** #{e["edition"]}",
    "- **策展人：** #{e["curator"]}",
    "- **場地：** #{e["venue"]}",
    "- **入場：** #{e["admission"]}"
  ]
  { "properties" => props, "content" => source_body(e, image, extra), "icon" => "🌐" }
end

pages = art.map { |e| standard_page(e) } + calls.map { |e| standard_page(e) } + exhibitions.map { |e| exhibition_page(e) }
puts JSON.generate({
  "parent" => { "data_source_id" => "18356b95-d3f2-4d4a-a4da-8dabcd6c7056" },
  "pages" => pages
})
