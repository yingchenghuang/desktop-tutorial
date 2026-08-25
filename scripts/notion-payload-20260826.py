#!/usr/bin/env python3
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
daily = json.loads((ROOT / "data/backfill-august-20260826.json").read_text())["entries"]
comps = [e for e in json.loads((ROOT / "data/competitions.json").read_text())["entries"] if e["updated"] == "2026-08-26"]

def medium(e):
    s = " ".join(e.get("media", []))
    if any(x in s for x in ("LED", "燈光", "光/", "電影", "影像")): return ["光/影像/投影"]
    if any(x in s for x in ("雕塑", "青銅", "鋼", "金屬", "花崗岩")): return ["雕塑"]
    if any(x in s for x in ("教育", "參與")): return ["社會參與"]
    if any(x in s for x in ("策展", "展覽", "文化計畫")): return ["平台/策展"]
    if any(x in s for x in ("建築", "立面", "地景", "玻璃碑")): return ["建築/場域"]
    return ["裝置"]

pages = []
for e in daily + comps:
    p = {
        "名稱": e["name"], "類別": e["category"], "來源狀態": e["status"],
        "去重Key": e["dedupeKey"], "地區": e["region"], "國家地區": e["country"],
        "城市關鍵字": "、".join(e["cityKeywords"]), "媒介類型": medium(e),
        "代表作": e["works"], "重點短評": e["comment"], "官網連結": e["website"],
        "圖片/作品頁": e["workPage"], "個人照片": e["photo"], "層級": e["tier"],
        "創作者創作論述": e["artistStatement"], "創作論述來源": e["artistStatementSource"],
        "經典作品名稱": e["classicTitle"], "經典作品圖": e["classicImage"],
        "經典作品詳介": e["classicDesc"], "同城關聯": "、".join(e.get("relatedByCity", [])),
        "date:資訊更新日期:start": "2026-08-26", "date:資訊更新日期:is_datetime": 0,
    }
    if e["category"] == "公開徵件":
        p.update({
            "主辦單位": e["organizer"], "參與資格": e["eligibility"], "預算": e["budget"],
            "申請費": e["applicationFee"], "截止時區": e["deadlineTimezone"],
            "截止精度": e["deadlinePrecision"], "date:截止日期:start": e["deadline"],
            "date:截止日期:is_datetime": 1,
        })
    content = ("## 資料摘要\n" + e["comment"] + "\n\n"
               "- 官方來源：[開啟原始頁面](" + e["website"] + ")\n"
               "- 城市關鍵字：" + "、".join(e["cityKeywords"]) + "\n"
               "- 去重 Key：`" + e["dedupeKey"] + "`")
    pages.append({"properties": p, "content": content})

print(json.dumps({"parent": {"data_source_id": "18356b95-d3f2-4d4a-a4da-8dabcd6c7056"}, "pages": pages}, ensure_ascii=False))
