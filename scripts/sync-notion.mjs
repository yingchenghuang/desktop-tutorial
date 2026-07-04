/* 每日同步 Notion「公共藝術檔案」 → data/artists.json
   必填：NOTION_TOKEN
   選填：NOTION_DATABASE_ID，可填資料庫 ID 或 Notion URL */
import { mkdirSync, writeFileSync } from 'node:fs';

const TOKEN = process.env.NOTION_TOKEN;
const DEFAULT_DATABASE_ID = 'd1232d1e8e284745a0d14cd7d911ec62';
const DATABASE_ID = normalizeDatabaseId(process.env.NOTION_DATABASE_ID || DEFAULT_DATABASE_ID);

if (!TOKEN) {
  console.error('缺少 NOTION_TOKEN。請在 GitHub Actions secrets 設定 NOTION_TOKEN。');
  process.exit(1);
}

const HEADERS = {
  Authorization: `Bearer ${TOKEN}`,
  'Notion-Version': '2022-06-28',
  'Content-Type': 'application/json'
};

const REQUIRED_PROPERTIES = ['名稱', '層級', '類別', '地區', '媒介類型', '資訊更新日期'];
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

function normalizeDatabaseId(input) {
  const raw = String(input || '').trim();
  const compact = raw.replace(/-/g, '');
  const uuid = compact.match(/[0-9a-f]{32}/i);
  if (!uuid) return raw;
  return uuid[0];
}

async function notion(path, opt = {}) {
  const res = await fetch(`https://api.notion.com/v1/${path}`, { headers: HEADERS, ...opt });
  const body = await res.text();
  if (!res.ok) throw new Error(`${path} -> ${res.status} ${body}`);
  return body ? JSON.parse(body) : {};
}

function plainText(prop) {
  if (!prop) return '';
  const items = prop.title || prop.rich_text;
  if (Array.isArray(items)) return items.map(item => item.plain_text || '').join('').trim();
  if (prop.formula) return String(prop.formula.string || prop.formula.number || prop.formula.boolean || '').trim();
  return '';
}

function selectName(prop) {
  return prop?.select?.name || '';
}

function multiNames(prop) {
  return (prop?.multi_select || []).map(item => item.name).filter(Boolean);
}

function urlValue(prop) {
  if (!prop) return '';
  if (prop.url) return prop.url;
  if (Array.isArray(prop.files) && prop.files[0]) return prop.files[0].external?.url || prop.files[0].file?.url || '';
  return plainText(prop);
}

function dateValue(prop) {
  return prop?.date?.start || '';
}

function firstAvailable(props, names, reader) {
  for (const name of names) {
    const value = reader(props[name]);
    if (value) return value;
  }
  return '';
}

async function queryAllPages() {
  const pages = [];
  let cursor;
  do {
    const body = {
      page_size: 100,
      sorts: [{ property: '資訊更新日期', direction: 'descending' }],
      ...(cursor ? { start_cursor: cursor } : {})
    };
    const json = await notion(`databases/${DATABASE_ID}/query`, {
      method: 'POST',
      body: JSON.stringify(body)
    });
    pages.push(...json.results);
    cursor = json.has_more ? json.next_cursor : null;
  } while (cursor);
  return pages;
}

async function firstImage(pageId) {
  try {
    const json = await notion(`blocks/${pageId}/children?page_size=100`);
    for (const block of json.results || []) {
      if (block.type === 'image') return block.image?.external?.url || block.image?.file?.url || '';
    }
  } catch (err) {
    console.warn(`image block 讀取失敗 ${pageId}: ${err.message}`);
  }
  return '';
}

function rankOf(entry) {
  const match = String(entry.name || '').match(/^(\d{1,3})[｜|.．、\-\s]+/);
  if (match) return Number(match[1]);
  return entry.tier === '動態情報層' ? 50 : 120;
}

function updatedTime(entry) {
  const t = Date.parse(entry.updated || '');
  return Number.isFinite(t) ? t : 0;
}

function qualityIssues(entry) {
  const issues = [];
  if (!entry.comment) issues.push('missing_comment');
  if (!entry.website && !entry.workPage && !entry.photo) issues.push('missing_source_link');
  if (!entry.media.length) issues.push('missing_media');
  if (!entry.updated) issues.push('missing_updated_date');
  if (entry.status === '追蹤') issues.push('tracking_source');
  return issues;
}

function countBy(entries, key) {
  return entries.reduce((acc, entry) => {
    const values = Array.isArray(entry[key]) ? entry[key] : [entry[key]];
    for (const value of values) {
      if (!value) continue;
      acc[value] = (acc[value] || 0) + 1;
    }
    return acc;
  }, {});
}

function validateSchema(database) {
  const missing = REQUIRED_PROPERTIES.filter(name => !database.properties?.[name]);
  if (missing.length) {
    console.warn(`Notion schema 缺少欄位：${missing.join(', ')}`);
  }
}

function toEntry(page, fallbackImage) {
  const props = page.properties || {};
  const website = firstAvailable(props, ['官網連結', '官方網站', 'Website'], urlValue);
  const workPage = firstAvailable(props, ['圖片/作品頁', '作品頁面', 'Work Page'], urlValue);
  const photo = firstAvailable(props, ['個人照片', '介紹頁面', 'Photo'], urlValue);
  const media = multiNames(props['媒介類型']);
  const status = selectName(props['來源狀態']) || (website || workPage || photo ? '可信二手來源' : '追蹤');

  return {
    id: plainText(props['去重Key']) || page.id,
    name: plainText(props['名稱']) || '未命名條目',
    category: selectName(props['類別']) || '未分類',
    tier: selectName(props['層級']) || '經典檔案庫',
    region: selectName(props['地區']) || '全球',
    country: plainText(props['國家地區']) || '',
    media,
    works: plainText(props['代表作']),
    comment: plainText(props['重點短評']),
    website,
    workPage,
    photo,
    classicTitle: plainText(props['經典作品名稱']),
    classicImage: urlValue(props['經典作品圖']) || fallbackImage,
    classicDesc: plainText(props['經典作品詳介']),
    status,
    updated: dateValue(props['資訊更新日期']) || page.last_edited_time?.slice(0, 10) || ''
  };
}

const database = await notion(`databases/${DATABASE_ID}`);
validateSchema(database);

const pages = await queryAllPages();
const entries = [];

for (const page of pages) {
  const props = page.properties || {};
  let fallbackImage = '';
  if (!urlValue(props['經典作品圖'])) {
    fallbackImage = await firstImage(page.id);
    await sleep(180);
  }
  const entry = toEntry(page, fallbackImage);
  if (entry.name && entry.name !== '未命名條目') entries.push(entry);
}

entries.sort((a, b) => {
  const rankDelta = rankOf(a) - rankOf(b);
  if (rankDelta) return rankDelta;
  const dateDelta = updatedTime(b) - updatedTime(a);
  if (dateDelta) return dateDelta;
  return a.name.localeCompare(b.name, 'zh-Hant');
});

const issues = entries.flatMap(entry => qualityIssues(entry).map(issue => ({ id: entry.id, name: entry.name, issue })));
const latestUpdated = entries.reduce((latest, entry) => {
  return updatedTime(entry) > updatedTime({ updated: latest }) ? entry.updated : latest;
}, '');

const output = {
  meta: {
    title: '公共藝術檔案',
    generatedAt: new Date().toISOString(),
    timezone: 'Asia/Taipei',
    source: 'notion-sync',
    databaseId: DATABASE_ID,
    total: entries.length,
    latestUpdated,
    counts: {
      tier: countBy(entries, 'tier'),
      region: countBy(entries, 'region'),
      category: countBy(entries, 'category'),
      media: countBy(entries, 'media'),
      status: countBy(entries, 'status')
    },
    qualityIssueCount: issues.length,
    qualityIssues: issues.slice(0, 40)
  },
  entries
};

mkdirSync('data', { recursive: true });
writeFileSync('data/artists.json', `${JSON.stringify(output, null, 2)}\n`);

console.log(`同步完成：${entries.length} 筆`);
console.log(`最新資料日期：${latestUpdated || '未標記'}`);
console.log(`品質警示：${issues.length} 筆`);
