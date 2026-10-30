import fs from 'node:fs'; import path from 'node:path';
const art=JSON.parse(fs.readFileSync('data/backfill-october-20261031.json')); const comp=JSON.parse(fs.readFileSync('data/competitions.json'));
const now=Date.parse('2026-10-31T05:00:00+08:00');
const all=[]; for(const f of fs.readdirSync('data').filter(x=>x.endsWith('.json')&&!x.includes('manifest')&&x!=='competitions.json')){try{const j=JSON.parse(fs.readFileSync(path.join('data',f))); const es=j.entries||j.items||j.artists||[]; for(const e of es) all.push({...e,_file:f});}catch{}}
const norm=s=>(s||'').toLowerCase().normalize('NFKD').replace(/\p{Diacritic}/gu,'').replace(/^\d+｜/,'').replace(/[^\p{L}\p{N}]+/gu,' ' ).trim();
const dup=a=>{const m=new Map; for(const x of a){const k=x.dedupeKey;if(!k)continue;(m.get(k)||m.set(k,[]).get(k)).push(x)} return [...m].filter(([,v])=>v.length>1)};
const localKeys=new Set(all.filter(x=>x._file!=='backfill-october-20261031.json').map(x=>x.dedupeKey));
const titleKeys=new Set(all.filter(x=>x._file!=='backfill-october-20261031.json').map(x=>norm(x.classicTitle||x.title||x.name)));
const titleDup=art.entries.filter(x=>titleKeys.has(norm(x.classicTitle?.split('｜')[0]||x.name)));
const tzBad=comp.entries.filter(x=>!/[+-]\d\d:\d\d$/.test(x.deadline)||!x.deadlineTimezone||Number.isNaN(Date.parse(x.deadline)));
const expired=comp.entries.filter(x=>Date.parse(x.deadline)<now);
const cityMissing=[...art.entries,...comp.entries].filter(x=>!Array.isArray(x.cityKeywords)||x.cityKeywords.length<2);
const fieldsArt=art.entries.filter(x=>['dedupeKey','name','country','works','comment','website','photo','material','accessNote'].some(k=>!x[k]));
const fieldsComp=comp.entries.filter(x=>['dedupeKey','name','country','website','photo','deadline','deadlineTimezone','eligibility','budget','applicationFee'].some(k=>!x[k]));
const groups=Object.fromEntries(['current','global','german'].map(g=>[g,art.entries.filter(x=>x.researchGroup===g).length]));
const report={artTotal:art.entries.length,groups,competitionAddedToday:comp.entries.filter(x=>x.updated==='2026-10-31').length,competitionActive:comp.entries.length,expiredRemoved:comp.meta.expiredRemoved,duplicateDailyKeys:dup(art.entries).length,duplicateCompetitionKeys:dup(comp.entries).length,crossStreamKeyDuplicates:art.entries.filter(a=>comp.entries.some(c=>c.dedupeKey===a.dedupeKey)).length,duplicateAgainstHistory:art.entries.filter(x=>localKeys.has(x.dedupeKey)).length,normalizedTitleDuplicatesAgainstHistory:titleDup.map(x=>x.name),expiredActive:expired.length,deadlineOrTimezoneInvalid:tzBad.length,cityKeywordMissing:cityMissing.length,requiredArtMissing:fieldsArt.length,requiredCompetitionMissing:fieldsComp.length,relatedByCityTypeInvalid:[...art.entries,...comp.entries].filter(x=>!Array.isArray(x.relatedByCity)).length};
const ok=report.artTotal===20&&groups.current===10&&groups.global===5&&groups.german===5&&report.competitionAddedToday===5&&['duplicateDailyKeys','duplicateCompetitionKeys','crossStreamKeyDuplicates','duplicateAgainstHistory','expiredActive','deadlineOrTimezoneInvalid','cityKeywordMissing','requiredArtMissing','requiredCompetitionMissing','relatedByCityTypeInvalid'].every(k=>report[k]===0)&&report.normalizedTitleDuplicatesAgainstHistory.length===0;
console.log(JSON.stringify({ok,...report},null,2)); if(!ok)process.exit(1);
