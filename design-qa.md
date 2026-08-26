# Design QA — 2026-08-26 全球經典作品圖片

- Reference: `/Users/huangyingcheng/Desktop/截圖 2026-08-26 清晨5.07.33.png`
- Tested viewport: 2484 × 1038 px
- Scope: 全球經典作品 01–05 的作品圖片，保留既有卡片網格、字體、間距與資訊層級。

## Issue and correction

- P0（原始畫面）：五張卡片皆顯示 NGA 的 Cloudflare/security verification 畫面，未顯示作品。
- Correction: 改用 NGA 官方 IIIF 圖片端點，分別對應 Spider、House I、Moondog、Graft、Stele II。
- Data parity: `photo` 與 `classicImage` 同步使用各作品的官方圖；Notion 的「個人照片」與「經典作品圖」同步更新。

## Visual and functional checks

- 5/5 圖片完成載入，`naturalWidth` / `naturalHeight` 均大於 0。
- 畫面不再出現 security verification、Verifying 或 Cloudflare 圖片。
- 三欄作品卡片的既有裁切比例、標題、地點、關鍵字與短評排版保持不變。
- 2484 × 1038 桌面視口未出現新增的文字重疊或卡片溢位。
- 本機預覽未發現與這次圖片修正相關的 console error。

final result: passed
