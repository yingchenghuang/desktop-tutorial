/* Kunst am Bau — independent, source-linked collection view.
   Source artifacts remain independent; this page groups works, never mutates them. */
(() => {
  'use strict';
  const p = '../data/';
  const files = {
    sixty: p + 'kunst-am-bau-60-special-20261118.json',
    seventy: p + 'kunst-am-bau-70-special-20261118.json',
    museumSnapshot: p + 'museum-1000-orte-home-snapshot-20261118.json',
    museumFull: p + 'museum-1000-orte-catalog.json'
  };
  const version = 'kabportal-20261118-v1';
  const $ = id => document.getElementById(id);
  const state = { list: [], visible: [], limit: 32, source: 'all', decade: 'all', medium: 'all', city: 'all', sort: 'year-asc', search: '', photos: false, indexed: false, sourceWarnings: [] };
  const tags = { '2010': '60週年圖錄', '2020': '70週年圖錄', 'museum': 'Museum der 1000 Orte' };
  const byId = new Map(), byUrl = new Map(), byName = new Map();
  const clean = x => String(x ?? '').replace(/\s+/g, ' ').trim();
  const esc = x => clean(x).replace(/[&<>"']/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' })[c]);
  const normalize = x => clean(x).normalize('NFKD').replace(/[\u0300-\u036f]/g, '').replace(/ß/gi,'ss').toLowerCase().replace(/[^a-z0-9\u4e00-\u9fff]+/g, '');
  const validLink = u => {
    try { const z = new URL(u); return z.protocol === 'https:' ? z.href : ''; } catch { return ''; }
  };
  const canonical = u => {
    const s = validLink(u);
    if (!s || !s.includes('museum-der-1000-orte.de/kunstwerke/kunstwerk/')) return '';
    return s.replace(/[?#].*$/, '').replace(/\/$/, '');
  };
  const bookTitle = e => clean(e.workTitle || e.works || e.classicTitle || '').split('｜')[0] || (clean(e.name).includes('｜') ? clean(e.name).split('｜')[1].split('（')[0] : '') || '作品名稱待核';
  const yearLabel = e => clean(e.originalDate || (e.works || '').split('｜').slice(-1)[0] || '') || '年代待核';
  const yearValue = y => {
    const m = clean(y).match(/\b(19\d\d|20\d\d)\b/);
    return m ? Number(m[1]) : 0;
  };
  const cityOf = e => {
    const first = Array.isArray(e.cityKeywords) ? clean(e.cityKeywords[0]) : '';
    const c = clean(e.country || '');
    return first || (c.includes('/') ? clean(c.split('/').slice(1).join('/')) : '') || clean(e.location || '') || '地點待核';
  };
  const unique = a => [...new Set(a.filter(Boolean).map(clean))];
  const imageOf = e => validLink(e.classicImage || e.photo || (e.images || [])[0]?.url || '');
  const fullText = e => [e.title,e.artist,e.year,e.city,e.country,e.workSite,e.description,e.medium,e.category,e.publication,...(e.sources || [])].join(' ').toLowerCase();
  const sourceName = k => tags[k] || k;
  const status = txt => { if ($('loadStatus')) $('loadStatus').textContent = txt; };
  async function readJson(url, optional = false) {
    try {
      const response = await fetch(url + '?v=' + version, { cache: 'no-store' });
      if (!response.ok) throw new Error(String(response.status));
      return await response.json();
    } catch (e) {
      if (!optional) throw new Error('資料讀取失敗：' + url + ' (' + e.message + ')');
      return null;
    }
  }
  function entryFrom(e, group) {
    const id = clean(e.id || e.dedupeKey || ('work-' + group + '-' + Math.random().toString(36).slice(2)));
    const title = bookTitle(e), year = yearLabel(e);
    const origin = canonical(e.workPage) || canonical(e.website) || '';
    const credit = clean(e.imageCredit || (e.images || [])[0]?.credit || '');
    const collection = group === '2010' ? '2010年60週年選集'
      : group === '2020' ? '2020年70週年圖錄' : 'Museum der 1000 Orte';
    return {
      id, key: clean(e.dedupeKey || id), title, artist:clean(e.artist || clean(e.name).split('｜')[0]) || '藝術家待核',
      year, yearNumber:yearValue(year), city:cityOf(e), country:clean(e.country || ''),
      workSite:clean(e.workSite || ''), medium:unique([...(Array.isArray(e.media) ? e.media : []),clean(e.material || e.mediumOriginal || '')]),
      description:clean(e.classicDesc || e.comment || ''), sourceOriginal:clean(e.researchOriginalGermanExcerpt || ''),
      originalUrl:origin, mainUrl:validLink(e.workPage) || validLink(e.website) || '',
      image:imageOf(e), credit, rights:clean(e.imageRights || ''), access:clean(e.accessNote || ''),
      bookPage:clean(e.bookPageRange || ''), publication:clean(e.publication || collection),
      bookDetails:{}, sources:[group], citationURLs: unique([validLink(e.workPage),validLink(e.website),validLink(e.artistStatementSource)]),
      isIncomplete: Boolean(e.workTitleStatus && /待核/.test(e.workTitleStatus)) || /作品名待核|作品名稱待核/.test(title),
      researchStatus:clean(e.reviewStatus || ''), sourceIds:[id]
    };
  }
  function noteIndex(row) {
    byId.set(row.id,row);
    if (row.key) byId.set(row.key,row);
    if (row.originalUrl) byUrl.set(row.originalUrl,row);
    if (row.artist && row.title && !/作品名待核|作品名稱待核/.test(row.title))
      byName.set(normalize(row.artist)+'|'+normalize(row.title),row);
  }
  function findMatch(input) {
    const original = canonical(input.originalUrl);
    if (original && byUrl.has(original)) return byUrl.get(original);
    const nameKey = normalize(input.artist)+'|'+normalize(input.title);
    if (byName.has(nameKey)) return byName.get(nameKey);
    return null;
  }
  function merge(row, add, group) {
    if (!row.sources.includes(group)) row.sources.push(group);
    if (!row.image && add.image) { row.image = add.image; row.credit = add.credit; row.rights = add.rights; }
    if (!row.originalUrl && add.originalUrl) { row.originalUrl = add.originalUrl; byUrl.set(add.originalUrl,row); }
    if (!row.mainUrl && add.mainUrl) row.mainUrl = add.mainUrl;
    if ((!row.description || row.description.length < 90) && add.description.length > row.description.length) row.description = add.description;
    if (row.city === '地點待核' && add.city !== '地點待核') row.city=add.city;
    if (!row.country && add.country) row.country=add.country;
    if (!row.workSite && add.workSite) row.workSite=add.workSite;
    if (!row.yearNumber && add.yearNumber) { row.year=add.year;row.yearNumber=add.yearNumber; }
    if (!row.credit && add.credit) row.credit=add.credit;
    if (!row.rights && add.rights) row.rights=add.rights;
    if (!row.access && add.access) row.access=add.access;
    row.citationURLs = unique([...row.citationURLs,...add.citationURLs]);
    row.medium = unique([...row.medium,...add.medium]);
    row.sourceIds = unique([...row.sourceIds,...add.sourceIds]);
    row.bookDetails = Object.assign({},row.bookDetails,add.bookDetails);
    if (row.isIncomplete && !add.isIncomplete && add.title && add.title !== '作品名稱待核') {
      row.title=add.title; row.isIncomplete=false;
    }
  }
  function insert(e, group) {
    const item=entryFrom(e,group);
    const exists=byId.get(item.id) || byId.get(item.key) || findMatch(item);
    if (exists) { merge(exists,item,group); return exists; }
    if (group === '2010') item.bookDetails['2010']=item.bookPage;
    if (group === '2020') item.bookDetails['2020']=item.bookPage;
    state.list.push(item);noteIndex(item);return item;
  }
  function recordOf(url) {
    const c=canonical(url);
    return c ? byUrl.get(c) : null;
  }
  function claimSource(row, group, page, link, otherId) {
    if (!row) return;
    if (!row.sources.includes(group)) row.sources.push(group);
    if (page) row.bookDetails[group] = clean(page);
    if (link) row.citationURLs=unique([...row.citationURLs,validLink(link)]);
    if (otherId && !row.sourceIds.includes(otherId)) row.sourceIds.push(otherId);
  }
  function addSourceRecord(s) {
    const artist=clean(s.artist), title=clean(s.title);
    if (!artist || !title || !canonical(s.officialUrl)) return;
    const images=(s.imageSources || []).filter(v => {
      const u=validLink(v.url);
      if (!u || !/museum-der-1000-orte\.de\/media\/cache\/resolve\/slider\/images\//i.test(u)) return false;
      const caption=normalize(v.caption || '');
      return !caption || caption.includes(normalize(artist).slice(0,7)) || caption.includes(normalize(title).slice(0,9));
    });
    const photo=images[0] || null;
    const rawCredit=clean(s.imageCredit || photo?.caption || photo?.credit || '');
    const creditMatch=rawCredit.match(/Fotonachweis:\s*(.+)$/i);
    const photoCredit=creditMatch ? creditMatch[1] : rawCredit;
    const input={
      id:'museum1000-official-'+s.officialUrl.split('/').pop(),
      artist,
      name:artist+'｜'+title+'（'+(s.year || '年代待核')+'）',
      works:title+'｜'+(s.year || '年代待核'),
      originalDate:s.year || '年代待核',
      cityKeywords:s.city?[s.city]:[],
      country:s.city?'德國 / '+s.city:'',
      media:s.technique?[s.technique]:['建築/場域'],
      comment:'Museum der 1000 Orte 官方建築藝術典藏作品。'+(s.sourceExcerpt?'館藏原文提供歷史研究，詳見作品獨立頁。':'')+'藝術家：'+artist+'。作品：《'+title+'》。官方紀錄年代：'+(s.year||'未載')+'。',
      website:s.officialUrl,workPage:s.officialUrl,
      photo:photo?.url || '', classicImage:photo?.url || '',
      imageCredit:photoCredit,
      images:photo?[{url:photo.url,caption:photo.caption || title,credit:photoCredit}]:[],
      imageRights:'官方照片及作品著作權歸原始權利人所有，電子出版物使用請依館藏條款取得授權。',
      accessNote:s.accessNote || '', researchOriginalGermanExcerpt:s.sourceExcerpt || '',
      collectionSeries:'Museum der 1000 Orte'
    };
    const existing=recordOf(s.officialUrl) || findMatch({artist,title,originalUrl:s.officialUrl});
    if (existing) {
      const newRow=entryFrom(input,'museum');
      merge(existing,newRow,'museum');
      return;
    }
    insert(input,'museum');
  }
  function classifyGroup(row) {
    const m = row.medium.join(' ').toLowerCase();
    if (/光|燈|licht|video|foto|led|投影/.test(m)) return '光與影像';
    if (/壁畫|馬賽克|mosaik|malerei|wand|relief|浮雕/.test(m)) return '壁面與平面';
    if (/地景|大地|land|廣場|platzgestaltung|水|brunnen/.test(m)) return '地景與水';
    if (/雕塑|skulptur|plastik|bronze|stahl/.test(m)) return '雕塑與構造';
    return '裝置與建築';
  }
  function indexed() {
    state.list.forEach(r => {
      r.group=classifyGroup(r);
      r.searchBlob=fullText(r);
    });
    state.indexed=true;
    $('statTotal').textContent=state.list.length.toLocaleString('en-US');
    $('statOfficial').textContent=state.list.filter(r=>r.sources.includes('museum')).length.toLocaleString('en-US');
    $('statImages').textContent=state.list.filter(r=>r.image).length.toLocaleString('en-US');
    $('statBoth').textContent=state.list.filter(r=>r.sources.includes('2010') && r.sources.includes('2020')).length.toLocaleString('en-US');
    const decades=unique(state.list.filter(r=>r.yearNumber).map(r=>String(Math.floor(r.yearNumber/10)*10))).sort();
    $('decadeFilter').insertAdjacentHTML('beforeend',decades.map(d=>'<option value="'+esc(d)+'">'+d+'年代</option>').join(''));
    const cities=unique(state.list.map(r=>r.city).filter(c=>c && c!=='地點待核')).sort((a,b)=>a.localeCompare(b,'zh-Hant'));
    $('cityFilter').insertAdjacentHTML('beforeend',cities.map(c=>'<option value="'+esc(c)+'">'+esc(c)+'</option>').join(''));
    const mediums=unique(state.list.map(r=>r.group)).sort();
    $('mediumFilter').insertAdjacentHTML('beforeend',mediums.map(c=>'<option value="'+esc(c)+'">'+esc(c)+'</option>').join(''));
    filter();
  }
  async function boot() {
    const pairs=await Promise.allSettled([
      readJson(files.sixty),readJson(files.seventy),readJson(files.museumSnapshot),readJson(files.museumFull,true)
    ]);
    if (pairs.slice(0,3).some(x=>x.status==='rejected')) {
      state.sourceWarnings=pairs.slice(0,3).filter(x=>x.status==='rejected').map(x=>x.reason?.message || '錯誤');
    }
    const sixty=pairs[0].status==='fulfilled'?pairs[0].value:null;
    const seventy=pairs[1].status==='fulfilled'?pairs[1].value:null;
    const snap=pairs[2].status==='fulfilled'?pairs[2].value:null;
    const full=pairs[3].status==='fulfilled'?pairs[3].value:null;
    if (sixty) (sixty.entries||[]).forEach(x=>insert(x,'2010'));
    if (seventy) {
      (seventy.entries||[]).forEach(x=>insert(x,'2020'));
      (seventy.duplicates||[]).forEach(x=>{
        const target=byId.get(x.crossReference?.recordId || '');
        if (target) claimSource(target,'2020',x.bookPageRange,x.sourceUrl,x.id);
      });
    }
    if (snap) {
      (snap.entries||[]).forEach(x=>insert(x,'museum'));
      (snap.matchedExisting||[]).forEach(x=>{
        const target=byId.get(x.id)||recordOf(x.officialUrl);
        if (target) {
          claimSource(target,'museum','',x.officialUrl);
          if (!target.image && x.image) {target.image=validLink(x.image);target.credit=x.credit||'';}
          if (!target.originalUrl && canonical(x.officialUrl)) {target.originalUrl=canonical(x.officialUrl);byUrl.set(target.originalUrl,target);}
        }
      });
    }
    if (full && Array.isArray(full.sourceRecords)) {
      (full.sourceRecords||[]).forEach(addSourceRecord);
      (full.crossReferences||[]).forEach(x => {
        const target=byId.get(x.existingRecordId)||byId.get(x.existingDedupeKey)||recordOf(x.officialUrl);
        if (target) claimSource(target,'museum','',x.officialUrl,x.existingRecordId);
      });
    }
    if (!state.list.length) { status('作品資料尚未載入，請稍後重新開啟此頁。');$('loadStatus').classList.add('fail');return; }
    indexed();
    const total=state.list.length;
    status(total.toLocaleString('en-US')+' 件跨來源作品已歸類'+(full?'，含聯邦官方館藏':'，官方館藏完整索引待同步')+(state.sourceWarnings.length?'；部分來源暫時無法載入':''));
    const requested=decodeURIComponent(location.hash.replace(/^#work=/,''));
    if (location.hash.startsWith('#work=') && byId.has(requested)) showDetail(requested,false);
  }
  function filter() {
    const q=normalize(state.search);
    state.visible=state.list.filter(r=>{
      if (state.source!=='all'&&!r.sources.includes(state.source)) return false;
      if (state.decade!=='all'&&String(Math.floor(r.yearNumber/10)*10)!==state.decade) return false;
      if (state.medium!=='all'&&r.group!==state.medium) return false;
      if (state.city!=='all'&&r.city!==state.city) return false;
      if (state.photos&&!r.image) return false;
      if (q && !normalize(r.searchBlob).includes(q)) return false;
      return true;
    }).sort((a,b)=>{
      if (state.sort==='artist') return a.artist.localeCompare(b.artist,'de');
      const delta=(a.yearNumber||9999)-(b.yearNumber||9999);
      return (state.sort==='year-desc'?-delta:delta) || a.artist.localeCompare(b.artist,'de');
    });
    $('filteredCount').textContent=state.visible.length.toLocaleString('en-US');
    $('activeSummary').textContent=state.source==='all'?'完整典藏索引':sourceName(state.source);
    render();
  }
  function imageHtml(r) {
    if (r.image) return '<img src="'+esc(r.image)+'" alt="'+esc(r.artist+'｜'+r.title)+'" loading="lazy" referrerpolicy="no-referrer" onerror="this.style.display=\'none\';this.nextElementSibling.hidden=false"><div class="missing-photo" hidden><span>ARCHIVAL IMAGE PENDING</span><strong>'+esc(r.artist.slice(0,1))+'</strong><span>'+esc(r.year)+'</span></div>';
    return '<div class="missing-photo"><span>ARCHIVAL IMAGE PENDING</span><strong>'+esc(r.artist.slice(0,1))+'</strong><span>'+esc(r.year)+'</span></div>';
  }
  function card(r) {
    const flag=r.sources.includes('2020')?'70 YEARS':r.sources.includes('2010')?'60 YEARS':'MUSEUM 1000';
    return '<button type="button" class="work-card" data-work="'+esc(r.id)+'" aria-label="查看 '+esc(r.artist+' '+r.title)+' 詳細資料"><div class="work-thumb">'+imageHtml(r)+'<span class="thumb-badge">'+esc(flag)+'</span></div><div class="work-meta"><span>'+esc(r.year)+'</span><span>'+esc(r.group)+'</span></div><h3 class="work-name">'+esc(r.title)+'</h3><p class="work-artist">'+esc(r.artist)+'</p><p class="work-place">'+esc(r.city)+'</p><div class="work-tags">'+r.sources.map(s=>'<span>'+esc(sourceName(s))+'</span>').join('')+'</div></button>';
  }
  function render() {
    const n=Math.min(state.limit,state.visible.length);
    $('worksGrid').innerHTML=state.visible.slice(0,n).map(card).join('');
    $('emptyState').hidden=state.visible.length!==0;
    $('moreButton').hidden=n>=state.visible.length;
    $('moreLabel').textContent=(state.visible.length-n).toLocaleString('en-US')+' 件待顯示';
  }
  function facts(r) {
    const fields=[['創作年代',r.year],['設置城市',r.city],['建築／場址',r.workSite||'待補個別建築資料'],['媒介與類型',r.medium.join('、')||r.group],['來源出版',r.sources.map(sourceName).join('、')],['參訪資訊',r.access||'待核實']];
    return '<dl class="detail-facts">'+fields.map(([k,v])=>'<div><dt>'+esc(k)+'</dt><dd>'+esc(v)+'</dd></div>').join('')+'</dl>';
  }
  function showDetail(id,changeHash=true) {
    const r=byId.get(id);
    if(!r)return;
    const bookNotes=Object.entries(r.bookDetails).filter(([,page])=>page).map(([src,page])=>'<p>'+esc(sourceName(src))+'：圖錄第 '+esc(page)+' 頁。</p>').join('');
    let links=r.citationURLs.map((u,i)=>'<a href="'+esc(u)+'" target="_blank" rel="noopener noreferrer">'+(i?'其他研究來源':'查看原始作品頁')+' ↗</a>').join('');
    if (!links && r.mainUrl) links='<a href="'+esc(r.mainUrl)+'" target="_blank" rel="noopener noreferrer">原始研究來源 ↗</a>';
    const figure=r.image?'<div class="detail-hero"><img src="'+esc(r.image)+'" alt="'+esc(r.artist+'：'+r.title)+'" referrerpolicy="no-referrer" onerror="this.style.display=\'none\';this.parentElement.innerText=\'作品圖片無法載入，請查看原始來源頁。\'"></div>':'<div class="detail-hero"><div class="no-photo">作品圖片待確認與補充</div></div>';
    $('detailBody').innerHTML='<div class="detail-label">KUNST AM BAU / WERK ARCHIVE</div><p class="detail-artist">'+esc(r.artist)+'</p><h2 class="detail-title" id="detailTitle">'+esc(r.title)+'</h2>'+figure+'<div class="photo-credit">'+(r.image?'攝影及影像來源：'+esc(r.credit||'請見原始館藏頁'):'目前尚無已核對的作品圖片')+'</div>'+facts(r)+'<div class="detail-section"><h3>作品研究與場域脈絡</h3><p>'+esc(r.description||'已建立作品索引，作品論述與建築脈絡待擴充。')+'</p></div>'+(r.sourceOriginal?'<div class="detail-section"><h3>官方原始研究摘錄</h3><p>'+esc(r.sourceOriginal)+'</p></div>':'')+'<div class="detail-section"><h3>文獻與交叉收錄</h3><div class="citation-tags">'+r.sources.map(x=>'<span>'+esc(sourceName(x))+'</span>').join('')+'</div>'+bookNotes+'</div><div class="detail-links">'+links+'</div><p class="detail-rights">'+esc(r.rights||'作品影像著作權與授權狀態請依原始來源確認。')+'</p>'+(r.researchStatus?'<p class="detail-rights">資料查核：'+esc(r.researchStatus)+'</p>':'');
    $('detailOverlay').hidden=false;
    document.body.style.overflow='hidden';
    $('detailPanel').scrollTop=0;
    $('detailClose').focus();
    if(changeHash)history.replaceState(null,'','#work='+encodeURIComponent(r.id));
  }
  function closeDetail() {
    $('detailOverlay').hidden=true;
    document.body.style.overflow='';
    if(location.hash.startsWith('#work='))history.replaceState(null,'','#works');
  }
  function reset() {
    state.source='all';state.decade='all';state.medium='all';state.city='all';state.sort='year-asc';state.search='';state.photos=false;state.limit=32;
    for(const id of ['srcFilter','decadeFilter','mediumFilter','cityFilter'])$(id).value='all';
    $('sortFilter').value='year-asc';$('search').value='';$('onlyImage').checked=false;
    filter();
  }
  function bind() {
    const listeners=[['srcFilter','source'],['decadeFilter','decade'],['mediumFilter','medium'],['cityFilter','city'],['sortFilter','sort']];
    listeners.forEach(([id,key])=>$(id).addEventListener('change', e=>{state[key]=e.target.value;state.limit=32;filter()}));
    $('search').addEventListener('input',e=>{state.search=e.target.value;state.limit=32;filter()});
    $('onlyImage').addEventListener('change',e=>{state.photos=e.target.checked;state.limit=32;filter()});
    $('resetFilters').addEventListener('click',reset);
    $('moreButton').addEventListener('click',()=>{state.limit+=32;render()});
    $('worksGrid').addEventListener('click',e=>{const button=e.target.closest('[data-work]');if(button)showDetail(button.dataset.work)});
    $('detailClose').addEventListener('click',closeDetail);
    $('detailShade').addEventListener('click',closeDetail);
    document.addEventListener('keydown',e=>{
      if(e.key==='Escape'&&!$('detailOverlay').hidden)closeDetail();
      if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'){e.preventDefault();$('search').focus();}
    });
    document.querySelectorAll('[data-pick]').forEach(a=>a.addEventListener('click',()=>{
      const source=a.dataset.pick;state.source=source;$('srcFilter').value=source;state.limit=32;filter()
    }));
  }
  bind();
  boot().catch(err=>{console.error('Kunst am Bau catalog failed',err);status('索引暫時無法載入：'+err.message);$('loadStatus').classList.add('fail')});
})();
