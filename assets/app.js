/* 公共藝術檔案 — 檢索與每日情報 */
(function () {
  'use strict';

  var REGION_ORDER = ['全球', '西方', '東亞', '南亞/中東', '非洲', '拉丁美洲', '大洋洲'];
  var CAT_ORDER = ['公開徵件', '藝術家', '作品/展覽', '藝術節', '機構', '平台', '媒體/資料庫'];
  var MEDIA_ORDER = ['雕塑', '裝置', '地景/大地藝術', '光/影像/投影', '數位/互動', '聲音/霧/水', '壁畫/街頭', '社會參與', '建築/場域', '紀念性公共藝術', '平台/策展'];
  var STATUS_ORDER = ['官方來源', '可信二手來源', '追蹤'];

  var DATA = [];
  var META = {};
  var state = {
    q: '',
    tier: '全部',
    region: '全部',
    cat: '全部',
    media: '全部',
    status: '全部',
    sort: 'default'
  };
  var lastFocus = null;

  function $(s) { return document.querySelector(s); }

  function esc(value) {
    return String(value == null ? '' : value).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function toArray(value) {
    if (Array.isArray(value)) return value.filter(Boolean);
    if (!value) return [];
    return String(value).split(/[、,，]/).map(function (v) { return v.trim(); }).filter(Boolean);
  }

  function text(value, fallback) {
    var s = String(value == null ? '' : value).trim();
    return s || fallback || '';
  }

  function parseDate(value) {
    if (!value) return 0;
    var t = new Date(value).getTime();
    return Number.isFinite(t) ? t : 0;
  }

  function displayDate(value) {
    if (!value) return '未標記';
    return String(value).slice(0, 10);
  }

  function versionDate(value) {
    var match = String(value || '').match(/\d{4}-\d{2}-\d{2}/);
    return match ? match[0] : '';
  }

  function cityKeywords(raw) {
    var source = [raw.country, raw.name, raw.works].join(' ');
    var known = [
      'Berlin','Nürnberg','Augsburg','Trier','Wittenberg','Oberpfaffenhofen','Görlitz',
      'Klagenfurt','Tirol','San Francisco','Solana Beach','Fairfax','New York','Brooklyn',
      'Los Angeles','London','Vancouver','Toronto','Copenhagen','Minneapolis','Seattle',
      'San Sebastián','Capalbio','Münster','Taiwan','台灣','台中','臺中'
    ];
    var found = known.filter(function (city) { return source.toLowerCase().indexOf(city.toLowerCase()) >= 0; });
    String(raw.country || '').split('/').slice(1).forEach(function (part) {
      part.split(/[、,，]/).forEach(function (place) {
        var clean = place.trim();
        if (clean && clean.length <= 32) found.push(clean);
      });
    });
    var aliases = {'柏林':'Berlin','紐約':'New York','纽约':'New York','倫敦':'London','伦敦':'London','溫哥華':'Vancouver','多倫多':'Toronto','哥本哈根':'Copenhagen','明尼亞波利斯':'Minneapolis','西雅圖':'Seattle','舊金山':'San Francisco','洛杉磯':'Los Angeles'};
    Object.keys(aliases).forEach(function (alias) {
      if (source.indexOf(alias) >= 0) found.push(aliases[alias]);
    });
    if (/JFK|LaGuardia/.test(source) && found.indexOf('New York') < 0) found.push('New York');
    if (/KÖR Tirol|Kunst am Bau/.test(source)) found.push('德語區公共藝術');
    return Array.from(new Set(found));
  }

  function isExpired(raw) {
    if (!raw.deadline) return false;
    var deadline = new Date(raw.deadline).getTime();
    return Number.isFinite(deadline) && deadline <= Date.now();
  }

  function deadlineText(value) {
    if (!value) return '';
    var date = String(value).slice(0, 10).replace(/-/g, '.');
    return date ? '截止 ' + date : '';
  }

  function parseName(e) {
    var name = text(e.name);
    var m = name.match(/^(\d{1,3})[｜|.．、\-\s]+([^｜|]+)(?:[｜|](.+))?$/);
    if (m) return { rank: m[1].padStart(2, '0'), main: m[2].trim(), sub: text(m[3]) };
    return { rank: '', main: name, sub: '' };
  }

  function glyphChar(name) {
    var t = text(name, '檔');
    for (var i = 0; i < t.length; i++) {
      if (/[\u3400-\u9FFF]/.test(t[i])) return t[i];
    }
    return t[0].toUpperCase();
  }

  function normalizeEntry(raw, index) {
    var media = toArray(raw.media);
    var parsed = parseName(raw);
    var website = text(raw.website) || text(raw.officialUrl) || text(raw.source);
    var workPage = text(raw.workPage) || text(raw.imagePage);
    var photo = text(raw.photo) || text(raw.image);
    var comment = text(raw.comment) || text(raw.summary) || text(raw.shortReview) || text(raw.description);
    var artistStatement = text(raw.artistStatement) || text(raw.creatorStatement);
    var artistStatementSource = text(raw.artistStatementSource) || text(raw.creatorStatementSource);
    var classicImage = text(raw.classicImage) || text(raw.image);
    var links = [website, workPage, photo].filter(Boolean);
    var updated = text(raw.updated) || text(raw.lastEdited) || text(raw.createdTime);
    var entry = {
      id: text(raw.id, 'entry-' + index),
      name: text(raw.name, '未命名條目'),
      category: text(raw.category, '未分類'),
      tier: text(raw.tier, '經典檔案庫'),
      region: text(raw.region, '全球'),
      country: text(raw.country, '未標記地點'),
      media: media.length ? media : ['未標記媒介'],
      works: text(raw.works),
      comment: text(comment, '尚未寫入重點短評。'),
      artistStatement: artistStatement,
      artistStatementSource: artistStatementSource,
      website: website,
      workPage: workPage,
      photo: photo,
      classicTitle: text(raw.classicTitle),
      classicImage: classicImage,
      classicDesc: text(raw.classicDesc),
      status: text(raw.status, links.length ? '可信二手來源' : '追蹤'),
      updated: updated,
      deadline: text(raw.deadline),
      deadlineLabel: text(raw.deadlineLabel) || deadlineText(raw.deadline),
      cityKeywords: toArray(raw.cityKeywords).concat(cityKeywords(raw)).filter(function (v, i, a) { return a.indexOf(v) === i; }),
      rank: parsed.rank,
      displayName: parsed.main,
      subName: parsed.sub
    };
    entry.searchText = [
      entry.name, entry.displayName, entry.subName, entry.country, entry.works, entry.comment,
      entry.artistStatement,
      entry.classicTitle, entry.classicDesc, entry.category, entry.tier, entry.region,
      entry.status, entry.media.join(' '), entry.cityKeywords.join(' '), entry.deadlineLabel
    ].join(' ').toLowerCase();
    return entry;
  }

  function countBy(list, getter) {
    return list.reduce(function (acc, item) {
      var values = getter(item);
      if (!Array.isArray(values)) values = [values];
      values.forEach(function (value) {
        if (!value) return;
        acc[value] = (acc[value] || 0) + 1;
      });
      return acc;
    }, {});
  }

  function orderedValues(counts, preferred) {
    var seen = {};
    var values = preferred.filter(function (v) {
      seen[v] = true;
      return counts[v];
    });
    Object.keys(counts).sort(function (a, b) { return a.localeCompare(b, 'zh-Hant'); }).forEach(function (v) {
      if (!seen[v]) values.push(v);
    });
    return ['全部'].concat(values);
  }

  function rankWeight(e) {
    if (e.rank) return parseInt(e.rank, 10);
    if (e.tier === '動態情報層') return 50;
    return 120;
  }

  function compareDefault(a, b) {
    var wa = rankWeight(a);
    var wb = rankWeight(b);
    if (wa !== wb) return wa - wb;
    var da = parseDate(a.updated);
    var db = parseDate(b.updated);
    if (da !== db) return db - da;
    return a.displayName.localeCompare(b.displayName, 'zh-Hant');
  }

  function sorted(list) {
    var copy = list.slice();
    copy.sort(function (a, b) {
      if (state.sort === 'name') return a.displayName.localeCompare(b.displayName, 'zh-Hant');
      if (state.sort === 'updated') {
        var da = parseDate(a.updated);
        var db = parseDate(b.updated);
        if (da !== db) return db - da;
        return compareDefault(a, b);
      }
      return compareDefault(a, b);
    });
    return copy;
  }

  function filteredList() {
    var q = state.q.trim().toLowerCase();
    return DATA.filter(function (e) {
      if (state.tier !== '全部' && e.tier !== state.tier) return false;
      if (state.region !== '全部' && e.region !== state.region) return false;
      if (state.cat !== '全部' && e.category !== state.cat) return false;
      if (state.media !== '全部' && e.media.indexOf(state.media) < 0) return false;
      if (state.status !== '全部' && e.status !== state.status) return false;
      if (q && e.searchText.indexOf(q) < 0) return false;
      return true;
    });
  }

  function apply() {
    var list = sorted(filteredList());
    renderGrid(list);
    renderLatest();
    var filtered = state.q || state.tier !== '全部' || state.region !== '全部' ||
      state.cat !== '全部' || state.media !== '全部' || state.status !== '全部';
    $('#resultCount').textContent = '顯示 ' + list.length + ' / ' + DATA.length + ' 筆';
    $('#resultMeta').classList.toggle('filtered', !!filtered);
    $('#clearBtn').classList.toggle('show', !!filtered);
  }

  function statusClass(status) {
    if (status === '官方來源') return 'official';
    if (status === '可信二手來源') return 'trusted';
    return 'watch';
  }

  function cardHTML(e, i) {
    var noimg = e.classicImage ? '' : ' noimg';
    var img = e.classicImage
      ? '<img loading="lazy" referrerpolicy="no-referrer" src="' + esc(e.classicImage) + '" alt="' + esc(e.classicTitle || e.displayName) + '" onerror="this.parentElement.classList.add(\'noimg\')">'
      : '';
    var rank = e.rank ? esc(e.rank) : String(i + 1).padStart(2, '0');
    var tier = e.tier === '動態情報層' ? '<em class="tiermark">動態</em>' :
      (e.tier === '競圖資料庫' ? '<em class="tiermark competition">競圖</em>' : '');
    var cities = e.cityKeywords.length ? '<span class="city-tags">' + e.cityKeywords.slice(0, 2).map(function (city) { return '<i>#' + esc(city) + '</i>'; }).join('') + '</span>' : '';

    return '<button class="card enter" style="--i:' + Math.min(i, 14) + '" data-id="' + esc(e.id) + '">' +
      '<span class="card-head">' +
        '<span class="rank">' + rank + '</span>' +
        '<span class="card-meta"><i class="st-dot ' + statusClass(e.status) + '"></i><span>' + esc(e.category) + ' · ' + esc(e.region) + '</span>' + tier + '</span>' +
      '</span>' +
      '<span class="card-media' + noimg + '">' + img +
        '<span class="card-glyph"><span>' + esc(glyphChar(e.displayName)) + '</span></span>' +
      '</span>' +
      '<span class="card-body">' +
        '<h3 class="card-name">' + esc(e.displayName) + '</h3>' +
        (e.subName ? '<p class="card-sub">' + esc(e.subName) + '</p>' : '') +
        '<p class="card-country">' + esc(e.country) + ' · ' + (e.deadlineLabel ? esc(e.deadlineLabel) : displayDate(e.updated)) + '</p>' +
        cities +
        '<p class="card-comment">' + esc(e.comment) + '</p>' +
      '</span>' +
    '</button>';
  }

  function renderGrid(list) {
    var grid = $('#grid');
    if (!list.length) {
      grid.innerHTML = '<div class="empty"><i class="dot"></i><p>沒有符合條件的條目。</p><button id="emptyReset" class="txtlink">重設篩選</button></div>';
      var er = $('#emptyReset');
      if (er) er.addEventListener('click', resetFilters);
      return;
    }
    grid.innerHTML = list.map(cardHTML).join('');
  }

  function renderLatest() {
    var dynamics = sorted(DATA.filter(function (e) { return e.tier === '動態情報層'; })).slice(0, 12);
    var rail = $('#latestRail');
    if (!dynamics.length) {
      rail.innerHTML = '<div class="latest-empty">尚未建立動態情報層。</div>';
      $('#latestMeta').textContent = '目前顯示經典檔案庫。';
      return;
    }
    var latestInfo = dynamics.reduce(function (max, e) {
      return parseDate(e.updated) > parseDate(max) ? e.updated : max;
    }, '');
    var maintenanceDate = versionDate(META.backfillVersion) || displayDate(META.generatedAt);
    $('#latestMeta').textContent = '最新情報日期 ' + displayDate(latestInfo) +
      ' · 最近維護 ' + maintenanceDate + ' · 顯示最新 ' + dynamics.length + ' 筆，點按開啟詳情。';
    var items = dynamics.map(function (e) {
      return '<button class="tk-item" data-id="' + esc(e.id) + '">' +
        '<span class="tk-tag">情報 ' + esc(e.rank || '·') + '</span>' +
        '<strong>' + esc(e.displayName) + '</strong>' +
        '<em>' + esc(e.region) + ' · ' + displayDate(e.updated) + '</em>' +
      '</button>';
    }).join('');
    var clone = items.replace(/<button /g, '<button tabindex="-1" ');
    rail.innerHTML = '<div class="tk-track" style="--tk-dur:' + (dynamics.length * 5) + 's">' +
      '<div class="tk-group">' + items + '</div>' +
      '<div class="tk-group" aria-hidden="true">' + clone + '</div>' +
    '</div>';
  }

  function resetFilters() {
    state.q = '';
    state.tier = '全部';
    state.region = '全部';
    state.cat = '全部';
    state.media = '全部';
    state.status = '全部';
    $('#q').value = '';
    document.querySelectorAll('#segTier button').forEach(function (b) {
      b.classList.toggle('on', b.dataset.tier === '全部');
    });
    buildChips();
    apply();
  }

  function chipRow(el, items, counts, key) {
    el.innerHTML = items.map(function (v) {
      var count = v === '全部' ? DATA.length : (counts[v] || 0);
      return '<button class="chip' + (state[key] === v ? ' on' : '') + '" data-v="' + esc(v) + '">' +
        '<span>' + esc(v) + '</span><b>' + count + '</b></button>';
    }).join('');
    el.onclick = function (ev) {
      var b = ev.target.closest('.chip');
      if (!b) return;
      state[key] = state[key] === b.dataset.v ? '全部' : b.dataset.v;
      chipRow(el, items, counts, key);
      apply();
    };
  }

  function buildChips() {
    var regionCounts = countBy(DATA, function (e) { return e.region; });
    var catCounts = countBy(DATA, function (e) { return e.category; });
    var mediaCounts = countBy(DATA, function (e) { return e.media; });
    var statusCounts = countBy(DATA, function (e) { return e.status; });
    chipRow($('#chipRegion'), orderedValues(regionCounts, REGION_ORDER), regionCounts, 'region');
    chipRow($('#chipCat'), orderedValues(catCounts, CAT_ORDER), catCounts, 'cat');
    chipRow($('#chipMedia'), orderedValues(mediaCounts, MEDIA_ORDER), mediaCounts, 'media');
    chipRow($('#chipStatus'), orderedValues(statusCounts, STATUS_ORDER), statusCounts, 'status');
  }

  function renderStats() {
    var regions = countBy(DATA, function (e) { return e.region; });
    var media = countBy(DATA, function (e) { return e.media; });
    var statuses = countBy(DATA, function (e) { return e.status; });
    var dynamics = DATA.filter(function (e) { return e.tier === '動態情報層'; });
    var latestInfo = dynamics.reduce(function (max, e) {
      return parseDate(e.updated) > parseDate(max) ? e.updated : max;
    }, '');
    var latestInfoDate = displayDate(latestInfo);
    var manifestDate = versionDate(META.backfillVersion);
    var maintenance = parseDate(manifestDate) > parseDate(META.generatedAt) ? manifestDate : META.generatedAt;
    var maintenanceDate = displayDate(maintenance || latestInfo);
    var dynamicCount = dynamics.length;

    $('#stEntries').textContent = DATA.length;
    $('#stRegions').textContent = Object.keys(regions).length;
    $('#stMedia').textContent = Object.keys(media).length;
    $('#stSync').textContent = maintenanceDate;
    $('#syncDate').textContent = '最後資料維護 ' + maintenanceDate + ' · 最新情報 ' + latestInfoDate + ' · Notion → GitHub Pages';
    $('#dailyLead').textContent = dynamicCount
      ? '每日追蹤正在發生的委託、展覽與公共計畫。目前接入 ' + dynamicCount + ' 筆情報，最新情報日期 ' + latestInfoDate + '，最近資料維護 ' + maintenanceDate + '。'
      : '每日追蹤正在發生的委託、展覽與公共計畫，等待動態情報層寫入。';

    $('#sourceItems').innerHTML = STATUS_ORDER.map(function (status) {
      return '<span class="source-chip ' + statusClass(status) + '"><i></i>' + esc(status) + '<b>' + (statuses[status] || 0) + '</b></span>';
    }).join('');
    $('#sourceNote').textContent = META.source === 'notion-sync' ? 'Notion API 每日同步' : 'Notion 初始匯出';
  }

  function openSheet(id) {
    var e = DATA.find(function (x) { return x.id === id; });
    if (!e) return;

    var badges = '<span class="badge ' + (e.tier === '經典檔案庫' ? 'classic' : 'dyn') + '">' + esc(e.tier) + '</span>' +
      '<span class="badge ' + statusClass(e.status) + '">' + esc(e.status) + '</span>' +
      (e.deadlineLabel ? '<span class="badge deadline">' + esc(e.deadlineLabel) + '</span>' : '') +
      (e.rank ? '<span class="badge dyn">關注度 ' + esc(e.rank) + '</span>' : '');

    var fig = e.classicImage
      ? '<figure><img referrerpolicy="no-referrer" src="' + esc(e.classicImage) + '" alt="' + esc(e.classicTitle || e.displayName) + '" onerror="this.closest(\'figure\').style.display=\'none\'">' +
        (e.classicTitle ? '<figcaption>' + esc(e.classicTitle) + '</figcaption>' : '') + '</figure>'
      : '';

    var works = e.works
      ? '<div class="block"><div class="block-label">代表作</div><p class="works-line">' +
        e.works.split('；').map(function (w) { return esc(w.trim()); }).join('<em>·</em>') + '</p></div>'
      : '';

    var mediaTags = '<div class="block"><div class="block-label">媒介類型</div><span class="tags">' +
      e.media.map(function (m) { return '<span class="tag">' + esc(m) + '</span>'; }).join('') + '</span></div>';

    var artistStatement = e.artistStatement
      ? '<div class="block statement-block"><div class="block-label">創作者創作論述</div>' +
        '<p class="artist-statement">' + esc(e.artistStatement) + '</p>' +
        (e.artistStatementSource
          ? '<a class="statement-source" href="' + esc(e.artistStatementSource) + '" target="_blank" rel="noopener">第一方論述來源</a>'
          : '') +
        '</div>'
      : '';

    var seen = {};
    var links = '';
    [[e.website, '官方網站'], [e.workPage, '作品頁面'], [e.photo, '影像/介紹']].forEach(function (pair) {
      var u = pair[0];
      if (u && !seen[u]) {
        seen[u] = 1;
        links += '<a href="' + esc(u) + '" target="_blank" rel="noopener">' + pair[1] + '</a>';
      }
    });
    if (links) links = '<div class="links">' + links + '</div>';

    var related = DATA.filter(function (candidate) {
      if (candidate.id === e.id) return false;
      var crossDatabase = (e.tier === '競圖資料庫') !== (candidate.tier === '競圖資料庫');
      return crossDatabase && candidate.cityKeywords.some(function (city) { return e.cityKeywords.indexOf(city) >= 0; });
    }).slice(0, 6);
    var relatedHtml = related.length
      ? '<div class="block related-block"><div class="block-label">相關城市・跨資料庫</div><div class="related-list">' +
        related.map(function (item) { return '<button data-related-id="' + esc(item.id) + '"><b>' + esc(item.displayName) + '</b><span>' + esc(item.tier) + ' · ' + esc(item.cityKeywords.join(' / ')) + '</span></button>'; }).join('') +
        '</div></div>'
      : '';
    var cityHtml = e.cityKeywords.length
      ? '<div class="block"><div class="block-label">城市關鍵字</div><span class="tags">' + e.cityKeywords.map(function (city) { return '<span class="tag">#' + esc(city) + '</span>'; }).join('') + '</span></div>'
      : '';

    $('#panel').innerHTML =
      '<div class="panel-head"><div class="badges">' + badges + '</div>' +
      '<button class="close" id="sheetClose" aria-label="關閉">×</button></div>' +
      '<h2>' + esc(e.displayName) + '</h2>' +
      (e.subName ? '<p class="sub">' + esc(e.subName) + '</p>' : '') +
      '<p class="loc">' + esc(e.country) + '・' + esc(e.region) + '・' + esc(e.category) + '</p>' +
      fig +
      '<p class="lead">' + esc(e.comment) + '</p>' +
      (e.classicDesc ? '<p class="desc">' + esc(e.classicDesc) + '</p>' : '') +
      artistStatement + works + mediaTags + cityHtml + relatedHtml + links +
      '<div class="panel-meta">更新 ' + displayDate(e.updated) + '・' + esc(e.id) + '</div>';

    lastFocus = document.activeElement;
    var sheet = $('#sheet');
    sheet.classList.add('open');
    requestAnimationFrame(function () { sheet.classList.add('show'); });
    document.documentElement.classList.add('lock');
    $('#sheetClose').addEventListener('click', closeSheet);
    $('#sheetClose').focus();
  }

  function closeSheet() {
    var sheet = $('#sheet');
    sheet.classList.remove('show');
    document.documentElement.classList.remove('lock');
    setTimeout(function () { sheet.classList.remove('open'); }, 360);
    if (lastFocus) lastFocus.focus();
  }

  function bind() {
    var t;
    $('#q').addEventListener('input', function () {
      clearTimeout(t);
      var v = this.value;
      t = setTimeout(function () { state.q = v; apply(); }, 70);
    });

    $('#segTier').addEventListener('click', function (ev) {
      var b = ev.target.closest('button');
      if (!b) return;
      state.tier = b.dataset.tier;
      this.querySelectorAll('button').forEach(function (x) { x.classList.toggle('on', x === b); });
      apply();
    });

    $('#sort').addEventListener('change', function () { state.sort = this.value; apply(); });
    $('#clearBtn').addEventListener('click', resetFilters);

    $('#grid').addEventListener('click', function (ev) {
      var c = ev.target.closest('.card');
      if (c) openSheet(c.dataset.id);
    });

    $('#latestRail').addEventListener('click', function (ev) {
      var c = ev.target.closest('.tk-item');
      if (c) openSheet(c.dataset.id);
    });

    $('#backdrop').addEventListener('click', closeSheet);
    $('#panel').addEventListener('click', function (ev) {
      var relatedButton = ev.target.closest('[data-related-id]');
      if (relatedButton) openSheet(relatedButton.dataset.relatedId);
    });

    document.querySelectorAll('[data-open-tier]').forEach(function (link) {
      link.addEventListener('click', function () {
        var tier = this.dataset.openTier;
        state.tier = tier;
        document.querySelectorAll('#segTier button').forEach(function (button) { button.classList.toggle('on', button.dataset.tier === tier); });
        apply();
      });
    });

    document.addEventListener('keydown', function (ev) {
      if (ev.key === 'Escape' && $('#sheet').classList.contains('open')) closeSheet();
      if (ev.key === '/' && !/INPUT|SELECT|TEXTAREA/.test(document.activeElement.tagName)) {
        ev.preventDefault();
        $('#q').focus();
      }
    });

    $('#brandTop').addEventListener('click', function (ev) {
      ev.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    var topbar = $('#topbar');
    var toTop = $('#toTop');
    window.addEventListener('scroll', function () {
      topbar.classList.toggle('scrolled', window.scrollY > 24);
      if (toTop) toTop.classList.toggle('show', window.scrollY > 620);
    }, { passive: true });
    if (toTop) {
      toTop.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }

    tickClocks();
    setInterval(tickClocks, 30000);
  }

  function clockText(tz) {
    try {
      return new Intl.DateTimeFormat('en-GB', {
        hour: '2-digit', minute: '2-digit', hour12: false, timeZone: tz
      }).format(new Date());
    } catch (err) {
      return '--:--';
    }
  }

  function tickClocks() {
    [['#ckTpe', 'Asia/Taipei'], ['#ckNbg', 'Europe/Berlin'], ['#ckUtc', 'UTC']].forEach(function (pair) {
      var el = $(pair[0]);
      if (el) el.textContent = clockText(pair[1]);
    });
  }

  Promise.all([
    fetch('data/artists.json?t=' + Date.now()).then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); }),
    fetch('data/competitions.json?t=' + Date.now()).then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
  ])
    .then(function (payloads) {
      var json = payloads[0];
      var competitions = payloads[1];
      META = json.meta || {};
      var rawEntries = (Array.isArray(json) ? json : (json.entries || [])).concat((competitions.entries || []).filter(function (entry) { return !isExpired(entry); }));
      DATA = rawEntries.map(normalizeEntry).filter(function (e) { return e.name && e.name !== '未命名條目'; });
      renderStats();
      buildChips();
      bind();
      apply();
    })
    .catch(function (err) {
      $('#grid').innerHTML = '<div class="empty"><i class="dot"></i><p>資料載入失敗，請重新整理頁面。</p><small>' + esc(err.message) + '</small></div>';
      $('#resultCount').textContent = '載入失敗';
      $('#dailyLead').textContent = '資料載入失敗。';
    });
})();
