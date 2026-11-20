const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),audit=JSON.parse(fs.readFileSync(path.join(root,'review/20261120-artwork-photo-repair.json')));
assert.equal(audit.entries.length,30);
const entries=[];for(const d of ['18','19','20'])entries.push(...JSON.parse(fs.readFileSync(path.join(root,`data/backfill-november-202611${d}.json`))).entries);
for(const item of audit.entries){const e=entries.find(x=>x.id===item.id);assert(e,item.id);assert.equal(e.classicImage,item.url);assert.equal(e.photo,item.url);assert.equal(e.imageDisplayPolicy,'source-attributed');assert(e.imageCredit&&e.imageSourceUrl&&e.imageCaption,item.id+' attribution');assert(!/thum\.io|screenshot/i.test(e.classicImage));assert.equal(item.width>=120&&item.height>=120,true);assert.notEqual(e.classicImage,e.workPage,'HTML pages must never be used as image URLs');if(item.license)assert(e.imageLicenseUrl,item.id+' license');}
console.log('PASS 30 real-work photos, attribution, image dimensions, source/photograph separation and visible display policy');
