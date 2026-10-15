const fs = require('fs');
const date = '2026-10-15';
const art = JSON.parse(fs.readFileSync('data/backfill-october-20261015.json', 'utf8')).entries;
const competitions = JSON.parse(fs.readFileSync('data/competitions.json', 'utf8')).entries.filter(entry => entry.updated === date);

function media(values) {
  const source = values.join(' ');
  const out = [];
  if (/地景|公園|花園|自然/.test(source)) out.push('地景/大地藝術');
  if (/雕塑|鋼|青銅|混凝土|柱|浮雕|球體/.test(source)) out.push('雕塑');
  if (/裝置|委託|Kunst am Bau|公共事件/.test(source)) out.push('裝置');
  if (/建築|入口|中庭|牆面|立面|隧道|步道|棚架/.test(source)) out.push('建築/場域');
  if (/光|影像|攝影|投影|玻璃|火藥/.test(source)) out.push('光/影像/投影');
  if (/社區|社群|參與|身體|互動/.test(source)) out.push('社會參與');
  if (/壁畫|馬賽克|街頭/.test(source)) out.push('壁畫/街頭');
  if (/動力|機械/.test(source)) out.push('數位/互動');
  return [...new Set(out)].slice(0, 3).length ? [...new Set(out)].slice(0, 3) : ['裝置'];
}

function common(entry) {
  return {
    '名稱': entry.name,
    '類別': entry.category,
    '層級': entry.tier === '動態情報層' ? '動態情報層' : entry.tier === '競圖資料庫' ? '競圖資料庫' : '經典檔案庫',
    '地區': entry.region,
    '媒介類型': media(entry.media),
    '來源狀態': entry.status,
    '國家地區': entry.country,
    '城市關鍵字': entry.cityKeywords.join('｜'),
    '代表作': entry.works,
    '重點短評': entry.comment,
    '官網連結': entry.website,
    '圖片/作品頁': entry.photo,
    '個人照片': entry.photo,
    '創作者創作論述': entry.artistStatement,
    '創作論述來源': entry.artistStatementSource,
    '經典作品名稱': entry.classicTitle,
    '經典作品圖': entry.classicImage,
    '經典作品詳介': entry.classicDesc,
    '去重Key': entry.dedupeKey,
    '同城關聯': (entry.relatedByCity || []).join('｜'),
    'date:資訊更新日期:start': date,
    'date:資訊更新日期:is_datetime': 0
  };
}

const pages = art.map(entry => ({
  properties: common(entry),
  cover: entry.photo,
  content: `官方作品頁：[來源](${entry.workPage})\n\n![作品圖片](${entry.photo})\n\n${entry.comment}`
}));

for (const entry of competitions) {
  pages.push({
    properties: {
      ...common(entry),
      '主辦單位': entry.organizer,
      '參與資格': entry.eligibility,
      '預算': entry.budget,
      '申請費': entry.applicationFee,
      'date:截止日期:start': entry.deadline,
      'date:截止日期:is_datetime': 1,
      '截止時區': entry.deadlineTimezone,
      '截止精度': entry.deadlinePrecision
    },
    cover: entry.photo,
    content: `官方徵件頁：[來源](${entry.workPage})\n\n![徵件圖片](${entry.photo})\n\n${entry.comment}`
  });
}

process.stdout.write(JSON.stringify({
  parent: {type: 'data_source_id', data_source_id: '18356b95-d3f2-4d4a-a4da-8dabcd6c7056'},
  pages
}));
