require "json"

root = File.expand_path("..", __dir__)
daily = JSON.parse(File.read(File.join(root, "data/backfill-august-20260830.json")))["entries"]
calls = JSON.parse(File.read(File.join(root, "data/competitions.json")))["entries"].select { |e| e["updated"] == "2026-08-30" }

def notion_media(values)
  text = values.join(" ").downcase
  out = []
  out << "地景/大地藝術" if text.match?(/地景|landscape/)
  out << "雕塑" if text.match?(/雕塑|sculpt|鋼構/)
  out << "裝置" if text.match?(/裝置|install|駐村/)
  out << "建築/場域" if text.match?(/建築|場域|交通|公共空間|公園|車站|街道|使館|階梯/)
  out << "光/影像/投影" if text.match?(/光|影像|投影|攝影/)
  out << "社會參與" if text.match?(/社區|青年|參與|公共節目|共同體/)
  out << "壁畫/街頭" if text.match?(/壁畫|街頭|彩繪/)
  out << "聲音/霧/水" if text.match?(/聲音|水景/)
  out << "紀念性公共藝術" if text.match?(/紀念/)
  out << "平台/策展" if text.match?(/策展|展覽|駐地/)
  out = ["建築/場域"] if out.empty?
  out.uniq
end

def page(e)
  is_call = e["category"] == "公開徵件"
  image = e["photo"]
  body = ["![作品／徵選圖片](#{image})", "", e["comment"], "", "## 基本資料", "",
          "- 代表作／項目：#{e["works"]}", "- 城市關鍵字：#{e["cityKeywords"].join("、")}",
          "- 媒介：#{e["media"].join("、")}"]
  if is_call
    body += ["- 截止：#{e["deadlineLabel"]}（#{e["deadlineTimezone"]}）", "- 主辦單位：#{e["organizer"]}",
             "- 參與資格：#{e["eligibility"]}", "- 預算：#{e["budget"]}", "- 申請費：#{e["applicationFee"]}"]
  end
  body += ["", "## 來源", "", "- [官方頁面](#{e["website"]})", "- [作品／徵選圖片頁](#{e["workPage"]})"]

  props = {
    "名稱"=>e["name"], "類別"=>e["category"], "來源狀態"=>"官方來源", "層級"=>e["tier"],
    "地區"=>e["region"], "國家地區"=>e["country"], "城市關鍵字"=>e["cityKeywords"].join("、"),
    "媒介類型"=>notion_media(e["media"]), "代表作"=>e["works"], "重點短評"=>e["comment"],
    "官網連結"=>e["website"], "圖片/作品頁"=>e["workPage"], "個人照片"=>image,
    "創作者創作論述"=>e["artistStatement"], "創作論述來源"=>e["artistStatementSource"],
    "去重Key"=>e["dedupeKey"], "同城關聯"=>e.fetch("relatedByCity", []).join("、"),
    "經典作品名稱"=>e["classicTitle"], "經典作品圖"=>e["classicImage"], "經典作品詳介"=>e["classicDesc"],
    "date:資訊更新日期:start"=>"2026-08-30", "date:資訊更新日期:is_datetime"=>0
  }
  if is_call
    props.merge!({"主辦單位"=>e["organizer"], "參與資格"=>e["eligibility"], "預算"=>e["budget"],
      "申請費"=>e["applicationFee"], "截止時區"=>e["deadlineTimezone"], "截止精度"=>e["deadlinePrecision"],
      "date:截止日期:start"=>(e["deadlinePrecision"] == "date" ? e["deadline"][0,10] : e["deadline"]),
      "date:截止日期:is_datetime"=>(e["deadlinePrecision"] == "date" ? 0 : 1)})
  end
  {"properties"=>props, "content"=>body.join("\n"), "cover"=>"none"}
end

puts JSON.generate({"parent"=>{"data_source_id"=>"18356b95-d3f2-4d4a-a4da-8dabcd6c7056"}, "pages"=>(daily + calls).map { |e| page(e) }})
