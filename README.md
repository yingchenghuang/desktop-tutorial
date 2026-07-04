# 公共藝術檔案 Public Art Archive

以 Notion「公共藝術檔案」資料庫為資料源、GitHub Pages 為前台的全球公共藝術索引。網站是純靜態架構，`data/artists.json` 由 GitHub Actions 每天自動同步。

## 網站結構

- `index.html`：首頁與檢索介面
- `assets/style.css`：視覺系統與響應式排版
- `assets/app.js`：資料載入、搜尋、篩選、詳細面板
- `data/artists.json`：網站使用的公開資料
- `scripts/sync-notion.mjs`：Notion API 同步腳本
- `.github/workflows/sync-notion.yml`：每日同步排程

## GitHub Pages 發布

1. 在 GitHub 建立或開啟網站 repo。
2. 上傳本資料夾全部內容到 repo 根目錄。
3. 到 repo 的 **Settings → Pages**。
4. Source 選 **Deploy from a branch**。
5. Branch 選 `main`，資料夾選 `/root`，儲存。

## 每日自動更新

1. 到 <https://www.notion.so/my-integrations> 建立 Internal Integration。
2. 複製 integration token。
3. 回到 Notion「公共藝術檔案」資料庫，右上角 **Connections** 加入該 integration。
4. 到 GitHub repo 的 **Settings → Secrets and variables → Actions**。
5. 在 **Secrets** 新增 `NOTION_TOKEN`，貼上 token。
6. 若資料庫未來換 ID，可在 **Variables** 新增 `NOTION_DATABASE_ID`；不新增也會使用目前資料庫：
   `d1232d1e8e284745a0d14cd7d911ec62`

排程會在台北時間每日 06:00 同步 Notion，並提交更新後的 `data/artists.json`。需要立即更新時，到 GitHub **Actions → 每日同步 Notion → Run workflow** 手動執行。

## 本地預覽

在資料夾內啟動靜態伺服器後，開啟本機網址預覽。

```bash
python3 -m http.server 8000
```

## Notion 欄位

同步腳本會讀取這些欄位：`名稱`、`類別`、`層級`、`地區`、`國家地區`、`媒介類型`、`代表作`、`重點短評`、`官網連結`、`圖片/作品頁`、`個人照片`、`經典作品名稱`、`經典作品圖`、`經典作品詳介`、`來源狀態`、`資訊更新日期`、`去重Key`。

非必要欄位缺漏時，腳本會繼續同步並在 `meta.qualityIssues` 裡留下警示；網站仍會顯示可用資料。
