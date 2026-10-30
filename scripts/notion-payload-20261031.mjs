import fs from 'node:fs';
const a=JSON.parse(fs.readFileSync('data/backfill-october-20261031.json')); const c=JSON.parse(fs.readFileSync('data/competitions.json')).entries.filter(x=>x.updated==='2026-10-31');
const common=e=>({'名稱':e.name,'類別':e.category,'層級':e.tier,'地區':e.region,'國家地區':e.country,'媒介類型':e.media.filter(x=>['地景/大地藝術','雕塑','裝置','建築/場域','光/影像/投影','社會參與','壁畫/街頭','聲音/霧/水','數位/互動','紀念性公共藝術','平台/策展'].includes(x)),'代表作':e.works,'重點短評':e.comment,'官網連結':e.website,'圖片/作品頁':e.photo,'個人照片':e.photo,'經典作品名稱':e.classicTitle,'經典作品圖':e.classicImage,'經典作品詳介':e.classicDesc,'創作者創作論述':e.artistStatement,'創作論述來源':e.artistStatementSource,'來源狀態':'官方來源','date:資訊更新日期:start':'2026-10-31','date:資訊更新日期:is_datetime':0,'去重Key':e.dedupeKey,'城市關鍵字':e.cityKeywords.join('｜'),'同城關聯':(e.relatedByCity||[]).join('｜')||'無同城市跨庫項目'});
const pages=a.entries.map(e=>({properties:{...common(e),'入場資訊':e.accessNote}}));
for(const e of c) pages.push({properties:{...common(e),'主辦單位':e.organizer,'參與資格':e.eligibility,'預算':e.budget,'申請費':e.applicationFee,'截止時區':e.deadlineTimezone,'截止精度':e.deadlinePrecision,'date:截止日期:start':e.deadline,'date:截止日期:is_datetime':1}});
process.stdout.write(JSON.stringify(pages));
