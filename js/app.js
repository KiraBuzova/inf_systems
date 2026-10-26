/* ==========================================================
   Прототип · Use-case 1 «Створення заявки»
   Чистий JavaScript, без бібліотек і збірки.
   ========================================================== */
(() => {
  'use strict';

  const $  = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const phone = $('#phone');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const DUR = reduce ? 0 : 340;
  const EASE = 'cubic-bezier(.22,.8,.24,1)';
  const kbEnabled = matchMedia('(hover: hover) and (pointer: fine) and (min-width: 900px)').matches;

  /* ---------------- Демо-дані ---------------- */
  const CATS = [
    { id: 'plumbing', name: 'Сантехніка', icon: 'i-plumbing', works: [
      { n: 'Заміна змішувача', min: 400, max: 700 },
      { n: 'Усунення протікання', min: 300, max: 600 },
      { n: 'Встановлення унітаза', min: 800, max: 1500 } ] },
    { id: 'electric', name: 'Електрика', icon: 'i-electric', works: [
      { n: 'Заміна розетки або вимикача', min: 150, max: 300 },
      { n: 'Встановлення люстри', min: 300, max: 600 },
      { n: 'Пошук несправності проводки', min: 400, max: 900 } ] },
    { id: 'appliance', name: 'Ремонт техніки', icon: 'i-appliance', works: [
      { n: 'Ремонт пральної машини', min: 400, max: 1000 },
      { n: 'Ремонт холодильника', min: 500, max: 1200 },
      { n: 'Підключення техніки', min: 300, max: 600 } ] },
    { id: 'handyman', name: 'Дрібні роботи', icon: 'i-handyman', works: [
      { n: 'Збирання меблів', min: 300, max: 800 },
      { n: 'Монтаж полиці чи картини', min: 150, max: 350 },
      { n: 'Ремонт дверного замка', min: 250, max: 600 } ] },
    { id: 'cleaning', name: 'Клінінгові послуги', icon: 'i-cleaning', works: [
      { n: 'Прибирання квартири', min: 800, max: 1800 },
      { n: 'Генеральне прибирання', min: 1500, max: 3500 },
      { n: 'Миття вікон', min: 400, max: 900 } ] },
    { id: 'finishing', name: 'Оздоблювальні роботи', icon: 'i-finishing', works: [
      { n: 'Фарбування стін у кімнаті', min: 1200, max: 3000 },
      { n: 'Поклейка шпалер у кімнаті', min: 1000, max: 2500 },
      { n: 'Укладання плитки (1 м²)', min: 350, max: 600 } ] },
    { id: 'windows', name: 'Вікна та двері', icon: 'i-windows', works: [
      { n: 'Регулювання вікон і дверей', min: 250, max: 500 },
      { n: 'Заміна ущільнювача', min: 400, max: 900 },
      { n: 'Встановлення москітної сітки', min: 200, max: 450 } ] },
    { id: 'climate', name: 'Кондиціонери й опалення', icon: 'i-climate', works: [
      { n: 'Встановлення кондиціонера', min: 2500, max: 4500 },
      { n: 'Чистка кондиціонера', min: 600, max: 1200 },
      { n: 'Заміна радіатора опалення', min: 1500, max: 3000 } ] },
  ];
  // Схематична карта Києва (умовні координати 0–400): Дніпро ділить місто на правий і лівий берег
  const P = { A:[110,40],B:[198,30],C:[204,100],D:[190,128],E:[120,120],F:[95,80],G:[20,70],H:[25,150],I:[60,215],J:[126,185],
    K:[206,168],L:[170,182],S:[190,222],N:[150,238],O:[105,232],P:[210,232],T:[190,256],U:[178,292],V:[112,300],W:[60,270],
    X:[222,300],Y:[236,372],Z:[130,385],AA:[50,340],AB:[340,35],AC:[372,110],AD:[330,150],AE:[236,150],AF:[340,215],
    AG:[270,250],AH:[375,290],AI:[330,365] };
  const DISTRICTS = [
    { n: 'Голосіївський',  s: 'Голосіїв',   m: 8,  c: [130,335], p: 'W V U T P X Y Z AA' },
    { n: 'Дарницький',     s: 'Дарниця',    m: 13, c: [290,310], p: 'P AG AF AH AI Y X' },
    { n: 'Деснянський',    s: 'Деснянка',   m: 9,  c: [285,85],  p: 'B AB AC AD AE C' },
    { n: 'Дніпровський',   s: 'Дніпров.',   m: 12, c: [275,190], p: 'C AE AD AF AG P K' },
    { n: 'Оболонський',    s: 'Оболонь',    m: 14, c: [150,80],  p: 'A B C D E F' },
    { n: 'Печерський',     s: 'Печерськ',   m: 12, c: [192,208], p: 'L K P T S' },
    { n: 'Подільський',    s: 'Поділ',      m: 9,  c: [160,152], p: 'E D K L J' },
    { n: 'Святошинський',  s: 'Святошино',  m: 11, c: [62,140],  p: 'F G H I J E' },
    { n: 'Солом’янський',  s: 'Солом’янка', m: 10, c: [118,268], p: 'I O N S T U V W' },
    { n: 'Шевченківський', s: 'Шевченк.',   m: 16, c: [135,208], p: 'J L S N O I' },
  ].map(d => ({ ...d, ok: true, p: d.p.split(' ').map(k => P[k]) }));
  const OUT = { n: 'Поза межами Києва', s: '', m: 0, ok: false, c: [375, 372], p: [] };
  const ALL = [...DISTRICTS, OUT];
  const DEF_DISTRICT = 'Оболонський';
  const STATUS = {
    new: ['Нова', 'badge--new'], confirmed: ['Підтверджена', 'badge--confirmed'],
    done: ['Виконано', 'badge--done'], paid: ['Оплачено', 'badge--paid'],
    cancelled: ['Скасована', 'badge--cancelled'],
  };

  /* ---------------- Стан ---------------- */
  const state = { cat: null, work: null, desc: '', photos: [], street: '', apt: '', district: DEF_DISTRICT, pin: { x: 150, y: 80 },
                  requests: [], nextId: 1024, tab: 'active', pendingCancel: null, justCreated: false };
  const cat = () => CATS.find(c => c.id === state.cat);
  const fmt = n => n.toLocaleString('uk-UA').replace(/\u00a0/g, ' ');
  const range = w => `${fmt(w.min)}–${fmt(w.max)} грн`;

  /* ---------------- Іконки / розмітка ---------------- */
  const icon = (id, cls = 'item__ico') => `<svg class="${cls}" viewBox="0 0 48 48" aria-hidden="true"><use href="#${id}"/></svg>`;
  const ui = id => `<svg class="ui" aria-hidden="true"><use href="#${id}"/></svg>`;

  /* ---------------- Навігація між екранами ---------------- */
  let current = 's-home';
  let stack = ['s-home'];
  let locked = false;

  function run(el, frames, onDone) {
    if (!DUR) { onDone && onDone(); return; }
    const a = el.animate(frames, { duration: DUR, easing: EASE, fill: 'both' });
    a.onfinish = () => { a.cancel(); onDone && onDone(); };
  }

  function show(id, mode = 'push') {
    if (id === current || locked) return;
    const from = $('#' + current), to = $('#' + id);
    closeOverlays(); hideKb();
    to.classList.add('active');
    (onEnter[id] || (() => {}))();
    const finish = () => { from.classList.remove('active'); from.style.zIndex = to.style.zIndex = ''; locked = false; };
    current = id;

    if (mode === 'instant' || !DUR) { finish(); return; }
    locked = true;
    if (mode === 'push') {                       // виїзд справа
      to.style.zIndex = 3; from.style.zIndex = 2;
      run(to,   [{ transform: 'translateX(100%)' }, { transform: 'none' }]);
      run(from, [{ transform: 'none', opacity: 1 }, { transform: 'translateX(-22%)', opacity: .55 }], finish);
    } else if (mode === 'back') {                // повернення
      to.style.zIndex = 2; from.style.zIndex = 3;
      run(to,   [{ transform: 'translateX(-22%)', opacity: .55 }, { transform: 'none', opacity: 1 }]);
      run(from, [{ transform: 'none' }, { transform: 'translateX(100%)' }], finish);
    } else {                                     // розчинення
      to.style.zIndex = 3; from.style.zIndex = 2;
      run(to,   [{ opacity: 0 }, { opacity: 1 }]);
      run(from, [{ opacity: 1 }, { opacity: 1 }], finish);
    }
  }
  const go = id => { stack.push(id); show(id, 'push'); };
  const back = () => { if (stack.length < 2) return; stack.pop(); show(stack[stack.length - 1], 'back'); };
  const reset = (id, mode = 'fade') => { stack = [id]; show(id, mode); };
  $$('[data-back]').forEach(b => b.addEventListener('click', back));

  /* ---------------- Нижня навігація ---------------- */
  const TABS = [['s-home', 'u-home', 'Головна'], ['s-requests', 'u-list', 'Мої заявки'], ['s-profile', 'u-user', 'Профіль']];
  $$('[data-tabbar]').forEach(nav => {
    const host = nav.closest('.screen').id;
    nav.innerHTML = TABS.map(([id, ic, label]) =>
      `<button data-to="${id}" ${id === host ? 'aria-current="page"' : ''}>${ui(ic)}<span>${label}</span></button>`).join('');
    nav.addEventListener('click', e => { const b = e.target.closest('button'); if (b && b.dataset.to !== host) reset(b.dataset.to); });
  });

  /* ---------------- 1. Головна ---------------- */
  $('#home-cats').innerHTML = CATS.map(c => `<button class="cc" data-cat="${c.id}">${icon(c.icon, '')}<span>${c.name}</span></button>`).join('');
  const POPULAR = [['plumbing', 0], ['electric', 1], ['climate', 1], ['handyman', 0], ['appliance', 0], ['cleaning', 1]];
  $('#home-popular').innerHTML = POPULAR.map(([id, i]) => {
    const c = CATS.find(x => x.id === id), w = c.works[i];
    return `<button class="pc" data-cat="${id}" data-w="${i}">${icon(c.icon, '')}<b>${w.n}</b><small>${c.name}</small><em>${range(w)}</em></button>`;
  }).join('');
  function startFrom(catId, workIdx) {                        // швидкий старт із головної
    resetForm(); state.cat = catId; state.work = workIdx;
    stack = ['s-home', 's-category', 's-prices']; show('s-prices', 'push');
  }
  $('#home-cats').addEventListener('click', e => { const t = e.target.closest('.cc'); if (t) startFrom(t.dataset.cat, null); });
  $('#home-popular').addEventListener('click', e => { const t = e.target.closest('.pc'); if (t) startFrom(t.dataset.cat, +t.dataset.w); });
  $('#home-cta').addEventListener('click', () => { resetForm(); go('s-category'); });
  $('#promo').addEventListener('click', () => {
    try { navigator.clipboard.writeText('MASTER10'); } catch (_) {}
    snack('Промокод MASTER10 скопійовано');
  });

  /* ---------------- 2. Категорія ---------------- */
  $('#cat-list').innerHTML = CATS.map(c => {
    const from = Math.min(...c.works.map(w => w.min));
    return `<li><button class="item" data-cat="${c.id}">${icon(c.icon)}<span class="item__txt"><span class="item__name">${c.name}</span><span class="item__sub">від ${fmt(from)} грн</span></span>${ui('u-right')}</button></li>`;
  }).join('');
  $('#cat-list').addEventListener('click', e => {
    const b = e.target.closest('.item'); if (!b) return;
    if (state.cat !== b.dataset.cat) state.work = null;
    state.cat = b.dataset.cat; go('s-prices');
  });

  /* ---------------- 3. Ціни ---------------- */
  function renderPrices() {
    const c = cat();
    $('#prices-ico').setAttribute('href', '#' + c.icon);
    $('#prices-title').textContent = c.name;
    $('#work-list').innerHTML = c.works.map((w, i) =>
      `<li><button class="item item--work" role="radio" aria-checked="${state.work === i}" data-i="${i}"><span class="radio"></span><span class="item__txt"><span class="item__name">${w.n}</span></span><span class="item__price">${range(w)}</span></button></li>`).join('');
    syncPrices();
  }
  function syncPrices() {
    const w = state.work != null ? cat().works[state.work] : null;
    $('#prices-sum').innerHTML = w ? `Орієнтовно: <b>${range(w)}</b>` : 'Оберіть вид роботи';
    $('#prices-next').disabled = !w;
  }
  $('#work-list').addEventListener('click', e => {
    const b = e.target.closest('.item'); if (!b) return;
    state.work = +b.dataset.i;
    $$('#work-list .item').forEach(x => x.setAttribute('aria-checked', x === b));
    syncPrices();
  });
  $('#prices-next').addEventListener('click', () => go('s-desc'));

  /* ---------------- 4. Опис і фото ---------------- */
  const desc = $('#desc');
  function setDescError(on) {
    $('#f-desc').classList.toggle('has-error', on);
    $('#desc-err').hidden = !on;
    if (on) shake($('#f-desc'));
  }
  desc.addEventListener('input', () => {
    state.desc = desc.value;
    $('#desc-count').textContent = `${desc.value.length}/300`;
    $('#f-desc').classList.toggle('is-filled', !!desc.value.trim());
    if (desc.value.trim()) setDescError(false);
  });
  $('#desc-next').addEventListener('click', () => {
    if (!state.desc.trim()) { setDescError(true); desc.focus(); return; }   // 4а
    go('s-address');
  });

  // Фото: «Камера» додає демо-фото, «Галерея» відкриває вибір справжнього файлу
  const svgPhoto = [
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 120'><rect width='120' height='120' fill='#C9D8EA'/><rect y='84' width='120' height='36' fill='#8FA7C0'/><path d='M22 84V60q0-14 14-14h30q16 0 16 16v8h-12v-8q0-4-4-4H38q-4 0-4 4v24z' fill='#E7EDF5'/><rect x='84' y='38' width='14' height='46' rx='5' fill='#E7EDF5'/><path d='M70 62c-4 6-6 10-6 13a6 6 0 0 0 12 0c0-3-2-7-6-13z' fill='#2F4858' opacity='.8'/></svg>`,
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 120'><rect width='120' height='120' fill='#D6E1EF'/><rect x='10' y='10' width='100' height='60' rx='4' fill='#B0C4DE'/><rect x='46' y='18' width='14' height='62' fill='#E7EDF5'/><rect x='38' y='72' width='30' height='12' rx='3' fill='#D2691E'/><ellipse cx='60' cy='104' rx='34' ry='8' fill='#7F9BBA'/><path d='M53 86c-2 4-3 6-3 8a3 3 0 0 0 6 0c0-2-1-4-3-8z' fill='#2F4858'/></svg>`,
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 120'><rect width='120' height='120' fill='#B0C4DE'/><circle cx='60' cy='60' r='34' fill='#E7EDF5'/><circle cx='60' cy='60' r='20' fill='#2F4858'/><circle cx='60' cy='60' r='9' fill='#D2691E'/><rect x='54' y='6' width='12' height='22' fill='#D2691E'/></svg>`,
  ].map(s => 'data:image/svg+xml;utf8,' + encodeURIComponent(s));
  let demoIdx = 0;

  function renderThumbs() {
    $('#thumbs').innerHTML = state.photos.map((src, i) =>
      `<div class="thumb"><img src="${src}" alt="Фото несправності ${i + 1}"><button aria-label="Видалити фото" data-i="${i}">${ui('u-close')}</button></div>`).join('');
  }
  $('#thumbs').addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b) return;
    state.photos.splice(+b.dataset.i, 1); renderThumbs();
  });
  function addPhoto(src) {
    if (state.photos.length >= 3) { snack('Можна додати до 3 фото'); return; }
    state.photos.push(src); renderThumbs();
  }
  $('#add-photo').addEventListener('click', () => { desc.blur(); openSheet(); });
  $('#sheet-cancel').addEventListener('click', closeOverlays);
  $('#sheet-camera').addEventListener('click', () => { closeOverlays(); addPhoto(svgPhoto[demoIdx++ % svgPhoto.length]); });
  $('#sheet-gallery').addEventListener('click', () => { closeOverlays(); $('#file-input').click(); });
  $('#file-input').addEventListener('change', e => {
    const f = e.target.files[0]; if (f) addPhoto(URL.createObjectURL(f)); e.target.value = '';
  });

  /* ---------------- 5. Адреса (+ екран помилки 6) ---------------- */
  const street = $('#street');
  const dist = n => ALL.find(d => d.n === n) || OUT;
  const inZone = n => dist(n).ok;
  const centerOf = n => ({ x: dist(n).c[0], y: dist(n).c[1] });
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

  function setStreetError(on) {
    $('#f-street').classList.toggle('has-error', on);
    $('#street-err').hidden = !on;
    if (on) shake($('#f-street'));
  }
  function setZoneError(on) {
    $('#f-district').classList.toggle('has-error', on);
    $('#district-err').hidden = !on;
    $('#minimap').classList.toggle('is-error', on);
  }

  /* ---- Карта Києва: SVG ---- */
  const mapSvg = () => `<svg class="kmap kmap--labels" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Карта районів Києва">
    <rect class="kmap__bg" x="-300" y="-300" width="1000" height="1000"/>
    ${DISTRICTS.map(d => `<polygon data-d="${d.n}" points="${d.p.map(q => q.join(',')).join(' ')}"><title>${d.n} район</title></polygon>`).join('')}
    <path class="kmap__river" d="M205 -30 C203 30 200 70 204 100 S208 190 210 232 S230 330 242 430"/>
    <text class="kmap__rl" transform="translate(212 62) rotate(90)">Дніпро</text>
    <g class="kmap__labels">${DISTRICTS.map(d => `<text x="${d.c[0]}" y="${d.c[1]}">${d.s}</text>`).join('')}</g>
    <g class="kmap__pin"><g class="kmap__pinin"><path d="M0 0c-9-11-13-17-13-23a13 13 0 0 1 26 0c0 6-4 12-13 23z"/><circle cy="-23" r="4.5"/></g></g>
  </svg>`;
  function placePin(svg) {
    const g = $('.kmap__pin', svg), vb = svg.viewBox.baseVal;
    const k = (vb.width / Math.max(svg.clientWidth, 1)) * 0.85;
    g.setAttribute('transform', `translate(${g.dataset.x || 0} ${g.dataset.y || 0}) scale(${k})`);
  }
  function setVB(svg, x, y, w, h) { svg.setAttribute('viewBox', `${x} ${y} ${w} ${h}`); placePin(svg); }
  function paint(svg, name, pin, drop) {
    $$('polygon', svg).forEach(p => p.classList.toggle('is-sel', p.dataset.d === name));
    svg.classList.toggle('is-out', !inZone(name));
    const g = $('.kmap__pin', svg); g.dataset.x = pin.x; g.dataset.y = pin.y; placePin(svg);
    if (drop) { const i = $('.kmap__pinin', svg); i.classList.remove('drop'); void i.getBoundingClientRect(); i.classList.add('drop'); }
  }

  /* ---- Міні-карта на кроці «Адреса» ---- */
  const miniCanvas = $('#mini-canvas'); miniCanvas.innerHTML = mapSvg();
  const miniSvg = $('svg', miniCanvas);
  function updateMini(drop) {
    paint(miniSvg, state.district, state.pin, drop);
    const w = 240, h = w * 220 / 350;
    setVB(miniSvg, clamp(state.pin.x - w / 2, -40, 440 - w), clamp(state.pin.y - h / 2, -40, 440 - h), w, h);
    const d = dist(state.district), el = $('#zone-line');
    el.className = 'zone-line ' + (d.ok ? 'ok' : 'bad');
    el.innerHTML = d.ok
      ? `${ui('u-check')}<span>${d.n} район — у зоні обслуговування, ${d.m} майстрів поруч</span>`
      : `${ui('u-info')}<span>${d.n} — тут сервіс поки не працює</span>`;
  }
  const openMap = () => { document.activeElement && document.activeElement.blur(); go('s-map'); };
  $('#minimap').addEventListener('click', openMap);
  $('#minimap').addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openMap(); } });

  street.addEventListener('input', () => {
    state.street = street.value;
    $('#f-street').classList.toggle('is-filled', !!street.value.trim());
    if (street.value.trim()) setStreetError(false);       // тап/ввід у полі знімає помилку
  });
  street.addEventListener('focus', () => setStreetError(false));
  $('#apt').addEventListener('input', e => { state.apt = e.target.value; $('#f-apt').classList.toggle('is-filled', !!state.apt.trim()); });

  // Випадаючий список району
  const dBtn = $('#district-btn'), dList = $('#district-list');
  dList.innerHTML = ALL.map(d => `<li role="option" data-n="${d.n}">${d.n}${d.ok ? '' : ''}</li>`).join('');
  function toggleList(open) {
    dList.hidden = !open; dBtn.setAttribute('aria-expanded', open);
    $$('li', dList).forEach(li => li.setAttribute('aria-selected', li.dataset.n === state.district));
    if (open) { document.activeElement.blur(); hideKb(); }
  }
  dBtn.addEventListener('click', e => { e.stopPropagation(); toggleList(dList.hidden); });
  dList.addEventListener('click', e => {
    const li = e.target.closest('li'); if (!li) return;
    state.district = li.dataset.n; state.pin = centerOf(state.district);
    $('#district-val').textContent = state.district;
    toggleList(false); updateMini(true); setZoneError(!inZone(state.district));   // 4в
  });
  document.addEventListener('click', e => { if (!dList.hidden && !e.target.closest('#f-district')) toggleList(false); });

  $('#create').addEventListener('click', () => {
    const noStreet = !state.street.trim(), outZone = !inZone(state.district);
    setStreetError(noStreet); setZoneError(outZone);
    if (noStreet || outZone) {
      hideKb(); document.activeElement.blur();
      reveal(noStreet ? $('#f-street') : $('#f-district'));
      return;
    }
    submit();
  });

  /* ---- Повноекранна карта: зум, перетягування, вибір району ---- */
  const fullCanvas = $('#full-canvas'); fullCanvas.innerHTML = mapSvg();
  const fsvg = $('svg', fullCanvas);
  const fm = { draft: null, vb: { x: 0, y: 0, w: 260, h: 340 }, ratio: 1.3, raf: 0 };
  $('#map-chips').innerHTML = DISTRICTS.map(d => `<button data-n="${d.n}" aria-pressed="false">${d.n}</button>`).join('');

  const applyVB = () => setVB(fsvg, fm.vb.x, fm.vb.y, fm.vb.w, fm.vb.h);
  function clampVB() {
    const v = fm.vb, cx = clamp(v.x + v.w / 2, 0, 400), cy = clamp(v.y + v.h / 2, 0, 400);
    v.x = cx - v.w / 2; v.y = cy - v.h / 2;
  }
  function flyTo(cx, cy, w, instant) {
    w = clamp(w, 120, 460);
    const s = { cx: fm.vb.x + fm.vb.w / 2, cy: fm.vb.y + fm.vb.h / 2, w: fm.vb.w }, t0 = performance.now(), dur = (reduce || instant) ? 0 : 300;
    cancelAnimationFrame(fm.raf);
    const step = now => {
      const k = dur ? Math.min(1, (now - t0) / dur) : 1, e = 1 - Math.pow(1 - k, 3), W = s.w + (w - s.w) * e;
      fm.vb = { x: s.cx + (cx - s.cx) * e - W / 2, y: s.cy + (cy - s.cy) * e - (W * fm.ratio) / 2, w: W, h: W * fm.ratio };
      clampVB(); applyVB();
      if (k < 1) fm.raf = requestAnimationFrame(step);
    };
    step(t0);
    if (dur) fm.raf = requestAnimationFrame(step);
  }
  const zoomBy = f => flyTo(fm.vb.x + fm.vb.w / 2, fm.vb.y + fm.vb.h / 2, fm.vb.w * f);

  function updateFull(drop) {
    const dr = fm.draft, d = dist(dr.district);
    paint(fsvg, dr.district, dr.pin, drop);
    $$('#map-chips button').forEach(b => b.setAttribute('aria-pressed', b.dataset.n === dr.district));
    $('#mc-name').textContent = d.ok ? `${d.n} район` : d.n;
    const sub = $('#mc-sub');
    sub.className = d.ok ? '' : 'bad';
    sub.textContent = d.ok ? `У зоні обслуговування, ${d.m} майстрів поруч` : 'Сервіс тут не працює. Оберіть місце в межах міста';
    $('#map-ok').disabled = !d.ok;
  }
  function tapAt(cx, cy) {
    const el = document.elementFromPoint(cx, cy), poly = el && el.closest && el.closest('polygon[data-d]');
    const p = fsvg.createSVGPoint(); p.x = cx; p.y = cy;
    const pt = p.matrixTransform(fsvg.getScreenCTM().inverse());
    fm.draft = { district: poly ? poly.dataset.d : OUT.n, pin: { x: pt.x, y: pt.y } };
    updateFull(true);
  }
  let drag = null;
  fullCanvas.addEventListener('pointerdown', e => {
    drag = { x: e.clientX, y: e.clientY, vx: fm.vb.x, vy: fm.vb.y, moved: 0 };
    cancelAnimationFrame(fm.raf); fullCanvas.setPointerCapture(e.pointerId);
  });
  fullCanvas.addEventListener('pointermove', e => {
    if (!drag) return;
    const dx = e.clientX - drag.x, dy = e.clientY - drag.y;
    drag.moved = Math.max(drag.moved, Math.hypot(dx, dy));
    if (drag.moved > 6) {
      const sc = fm.vb.w / fullCanvas.clientWidth;
      fm.vb.x = drag.vx - dx * sc; fm.vb.y = drag.vy - dy * sc; clampVB(); applyVB();
      fullCanvas.classList.add('dragging');
    }
  });
  const endDrag = e => {
    if (drag && e.type === 'pointerup' && drag.moved <= 6) tapAt(e.clientX, e.clientY);
    drag = null; fullCanvas.classList.remove('dragging');
  };
  fullCanvas.addEventListener('pointerup', endDrag);
  fullCanvas.addEventListener('pointercancel', endDrag);
  fullCanvas.addEventListener('wheel', e => { e.preventDefault(); zoomBy(e.deltaY < 0 ? 0.8 : 1.25); }, { passive: false });
  $('#map-zin').addEventListener('click', () => zoomBy(0.7));
  $('#map-zout').addEventListener('click', () => zoomBy(1.45));
  $('#map-chips').addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b) return;
    fm.draft = { district: b.dataset.n, pin: centerOf(b.dataset.n) };
    updateFull(true); flyTo(fm.draft.pin.x, fm.draft.pin.y, 190);
  });
  $('#map-loc').addEventListener('click', () => {                 // демо-геолокація
    fm.draft = { district: 'Шевченківський', pin: { x: 140, y: 206 } };
    updateFull(true); flyTo(140, 206, 170); snack('Знайшли вас: Шевченківський район');
  });
  $('#map-ok').addEventListener('click', () => {
    state.district = fm.draft.district; state.pin = fm.draft.pin;
    setZoneError(false); back();
  });
  function enterMap() {
    fm.draft = { district: state.district, pin: { ...state.pin } };
    setTimeout(() => {
      fm.ratio = (fullCanvas.clientHeight || 1) / (fullCanvas.clientWidth || 1);
      fm.vb = { x: 0, y: 0, w: 400, h: 400 * fm.ratio };
      flyTo(200, 205, 400, true);          // спочатку все місто, мітка видна на своєму районі
      updateFull(true);
    }, 40);
  }

  /* ---------------- 7–8. Відправлення і підтвердження ---------------- */
  let submitTimer;
  function submit() {
    stack = ['s-home']; show('s-sending', 'fade');
    clearTimeout(submitTimer);
    submitTimer = setTimeout(() => { createRequest(); show('s-created', 'fade'); }, 1500);
  }
  function createRequest() {
    const c = cat(), w = c.works[state.work];
    const r = { id: state.nextId++, cat: c.id, work: w, desc: state.desc, street: state.street, apt: state.apt,
                district: state.district, photos: [...state.photos], status: 'new', at: new Date() };
    state.requests.unshift(r); state.justCreated = true;
    return r;
  }
  function renderCreated() {
    const r = state.requests[0], c = CATS.find(x => x.id === r.cat);
    $('#done-id').textContent = r.id;
    $('#done-card').innerHTML = `${icon(c.icon)}<div><b>${c.name} · ${r.district}</b><span>${r.work.n}<br>${range(r.work)}</span></div>`;
  }
  $('#done-next').addEventListener('click', () => { state.tab = 'active'; reset('s-requests'); });

  /* ---------------- 9. Мої заявки ---------------- */
  const dateStr = d => `${d.toLocaleDateString('uk-UA', { day: 'numeric', month: 'long' })}, ${d.toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit' })}`;
  function renderRequests() {
    $$('#req-tabs button').forEach(b => b.setAttribute('aria-selected', b.dataset.tab === state.tab));
    const body = $('#req-body');
    if (state.tab !== 'active') {
      body.innerHTML = `<div class="empty"><h3>Тут поки порожньо</h3><p>${state.tab === 'done' ? 'Виконані замовлення з’являться тут' : 'Оплачені замовлення з’являться тут'}</p></div>`;
      return;
    }
    if (!state.requests.length) {
      body.innerHTML = `<div class="empty"><h3>Заявок ще немає</h3><p>Створіть першу заявку — майстри поруч отримають сповіщення.</p><button class="btn btn--primary" data-new>Створити заявку</button></div>`;
      return;
    }
    body.innerHTML = state.requests.map(r => {
      const c = CATS.find(x => x.id === r.cat), [label, cls] = STATUS[r.status];
      return `<article class="req ${r.status === 'cancelled' ? 'is-cancelled' : ''}">
        <div class="req__top"><span class="req__id">Заявка №${r.id}</span><span class="badge ${cls}">${label}</span></div>
        <div class="req__main">${icon(c.icon)}<div><div class="req__name">${c.name}</div><div class="req__work">${r.work.n} · ${r.district}</div></div></div>
        <div class="req__range">${range(r.work)}</div>
        <div class="req__date">${dateStr(r.at)}</div>
        ${r.status === 'new' ? `<button class="btn btn--secondary btn--small" data-cancel="${r.id}">Скасувати</button>` : ''}
      </article>`;
    }).join('');
  }
  $('#req-tabs').addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b) return;
    state.tab = b.dataset.tab; renderRequests();
  });
  $('#req-body').addEventListener('click', e => {
    if (e.target.closest('[data-new]')) { resetForm(); go('s-category'); return; }
    const b = e.target.closest('[data-cancel]'); if (!b) return;
    state.pendingCancel = +b.dataset.cancel; openModal();
  });
  $('#modal-no').addEventListener('click', closeOverlays);
  $('#modal-yes').addEventListener('click', () => {
    const r = state.requests.find(x => x.id === state.pendingCancel);
    if (r) r.status = 'cancelled';
    closeOverlays(); hidePush(); renderRequests(); snack('Заявку скасовано');
  });

  // Сповіщення «майстер прийняв» (зв'язок з use-case 2)
  let pushTimer;
  function schedulePush() {
    clearTimeout(pushTimer);
    pushTimer = setTimeout(() => {
      const r = state.requests[0];
      if (current === 's-requests' && r && r.status === 'new') { $('#push').hidden = false; $('#push').classList.remove('out'); pushTimer = setTimeout(hidePush, 4500); }
    }, 4000);
  }
  function hidePush() {
    clearTimeout(pushTimer); const p = $('#push');
    if (p.hidden) return; p.classList.add('out'); setTimeout(() => { p.hidden = true; }, 300);
  }
  $('#push').addEventListener('click', hidePush);

  /* ---------------- Хуки входу на екран ---------------- */
  const onEnter = {
    's-category': () => {},
    's-prices': renderPrices,
    's-desc': () => { desc.value = state.desc; $('#desc-count').textContent = `${desc.value.length}/300`; $('#f-desc').classList.toggle('is-filled', !!state.desc.trim()); renderThumbs(); },
    's-address': () => { street.value = state.street; $('#apt').value = state.apt; $('#district-val').textContent = state.district; updateMini(); },
    's-map': enterMap,
    's-created': renderCreated,
    's-requests': () => { renderRequests(); if (state.justCreated) { state.justCreated = false; schedulePush(); } },
    's-home': hidePush,
  };

  /* ---------------- Оверлеї ---------------- */
  const dim = $('#dim'), sheet = $('#sheet'), modal = $('#modal');
  function openSheet() { dim.classList.add('open'); sheet.classList.add('open'); sheet.setAttribute('aria-hidden', 'false'); }
  function openModal() { dim.classList.add('open'); modal.classList.add('open'); modal.setAttribute('aria-hidden', 'false'); }
  function closeOverlays() {
    dim.classList.remove('open');
    [sheet, modal].forEach(el => { el.classList.remove('open'); el.setAttribute('aria-hidden', 'true'); });
    toggleList(false);
  }
  dim.addEventListener('click', closeOverlays);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeOverlays(); });

  let snackTimer;
  function snack(msg) {
    const s = $('#snack'); s.textContent = msg; s.classList.add('show');
    clearTimeout(snackTimer); snackTimer = setTimeout(() => s.classList.remove('show'), 2200);
  }
  // Прокрутка лише всередині .body (scrollIntoView міг би зсунути весь телефон)
  function reveal(el) {
    const body = el.closest('.body'); if (!body) return;
    const r = el.getBoundingClientRect(), b = body.getBoundingClientRect();
    body.scrollBy({ top: (r.top + r.height / 2) - (b.top + b.height / 2), behavior: reduce ? 'auto' : 'smooth' });
  }
  function shake(el) { el.classList.remove('shake'); void el.offsetWidth; el.classList.add('shake'); }

  /* ---------------- Екранна клавіатура (десктоп) ---------------- */
  const kb = $('#kb');
  if (kbEnabled) {
    const rows = ['1234567890'.split(''), 'йцукенгшщзхї'.split(''), 'фівапролджє'.split(''), 'ячсмитьбю'.split('')];
    kb.innerHTML = rows.map((r, i) => `<div class="kb__row">${r.map(k => `<button class="kb__key" data-k="${k}" tabindex="-1">${k}</button>`).join('')}${i === 3 ? '<button class="kb__key kb__key--wide" data-k="⌫" tabindex="-1">⌫</button>' : ''}</div>`).join('')
      + `<div class="kb__row"><button class="kb__key kb__key--wide" data-k="," tabindex="-1">,</button><button class="kb__key kb__key--space" data-k=" " tabindex="-1">пробіл</button><button class="kb__key kb__key--wide" data-k="." tabindex="-1">.</button><button class="kb__key kb__key--done" data-k="done" tabindex="-1">Готово</button></div>`;
    kb.addEventListener('pointerdown', e => {
      const b = e.target.closest('.kb__key'); if (!b) return;
      e.preventDefault();                                     // не втрачати фокус поля
      const el = document.activeElement, k = b.dataset.k;
      if (k === 'done') { el && el.blur(); return; }
      if (!el || !/^(INPUT|TEXTAREA)$/.test(el.tagName)) return;
      if (k === '⌫') {
        if (el.selectionStart === el.selectionEnd && el.selectionStart > 0) el.setSelectionRange(el.selectionStart - 1, el.selectionStart);
        el.setRangeText('', el.selectionStart, el.selectionEnd, 'end');
      } else {
        el.setRangeText(k === ' ' ? ' ' : k, el.selectionStart, el.selectionEnd, 'end');
      }
      el.dispatchEvent(new Event('input', { bubbles: true }));
    });
    phone.addEventListener('focusin', e => {
      if (!/^(INPUT|TEXTAREA)$/.test(e.target.tagName)) return;
      phone.classList.add('kb-open'); kb.setAttribute('aria-hidden', 'false');
      setTimeout(() => reveal(e.target), 280);
    });
    phone.addEventListener('focusout', () => setTimeout(() => {
      if (!/^(INPUT|TEXTAREA)$/.test((document.activeElement || {}).tagName)) hideKb();
    }, 0));
  }
  function hideKb() { phone.classList.remove('kb-open'); kb.setAttribute('aria-hidden', 'true'); }

  /* ---------------- Скидання форми ---------------- */
  function resetForm() {
    Object.assign(state, { cat: null, work: null, desc: '', photos: [], street: '', apt: '', district: DEF_DISTRICT, pin: { x: 150, y: 80 } });
    setDescError(false); setStreetError(false); setZoneError(false);
    $('#f-desc').classList.remove('shake'); $('#f-street').classList.remove('shake');
  }

  /* ---------------- Швидкий перехід (бокова панель) ---------------- */
  const FLOW = ['s-home', 's-category', 's-prices', 's-desc', 's-address'];
  function fillDemo() {
    if (!state.cat) state.cat = 'plumbing';
    if (state.work == null) state.work = 1;
    if (!state.desc.trim()) state.desc = 'Тече змішувач на кухні, вода капає постійно';
    if (!state.street.trim()) state.street = 'вул. Богатирська, 12';
  }
  function jump(k) {
    clearTimeout(submitTimer); hidePush(); closeOverlays();
    const toStep = idx => { stack = FLOW.slice(0, idx + 1); show(FLOW[idx], 'fade'); };
    if (k === 'reset') { state.requests = []; state.nextId = 1024; state.tab = 'active'; resetForm(); stack = ['s-home']; show('s-home', 'fade'); return; }
    if (k === '1') { stack = ['s-home']; show('s-home', 'fade'); return; }
    if (k === '2') { toStep(1); return; }
    if (k === '3') { state.cat = state.cat || 'plumbing'; toStep(2); return; }
    if (k === '4') { state.cat = state.cat || 'plumbing'; if (state.work == null) state.work = 1; toStep(3); return; }
    if (k === '5') { fillDemo(); toStep(4); return; }
    if (k === '6' || k === '6c') {
      state.cat = state.cat || 'plumbing'; if (state.work == null) state.work = 1; if (!state.desc.trim()) state.desc = 'Тече змішувач на кухні';
      if (k === '6') { state.street = ''; state.district = DEF_DISTRICT; state.pin = centerOf(DEF_DISTRICT); } else { if (!state.street.trim()) state.street = 'вул. Соборна, 5'; state.district = OUT.n; state.pin = centerOf(OUT.n); }
      toStep(4); onEnter['s-address']();
      setTimeout(() => { if (k === '6') { setStreetError(true); } else { setZoneError(true); } }, DUR + 40);
      return;
    }
    if (k === 'map') { fillDemo(); stack = [...FLOW, 's-map']; show('s-map', 'fade'); return; }
    if (k === '7') { fillDemo(); stack = ['s-home']; if (current === 's-sending') return; show('s-sending', 'fade'); submitTimer = setTimeout(() => { createRequest(); show('s-created', 'fade'); }, 1500); return; }
    if (k === '8') { if (!state.requests.length) { fillDemo(); createRequest(); } stack = ['s-home']; show('s-created', 'fade'); return; }
    if (k === '9') { if (!state.requests.length) { fillDemo(); createRequest(); } state.justCreated = false; state.tab = 'active'; stack = ['s-home']; show('s-requests', 'fade'); if (current === 's-requests') renderRequests(); }
  }
  $$('[data-jump]').forEach(b => b.addEventListener('click', () => { if (!locked) jump(b.dataset.jump); else setTimeout(() => jump(b.dataset.jump), DUR + 30); }));

  // 6: екран помилки з 4а — стан помилки застосовується після входу на екран адреси
  const _enterAddr = onEnter['s-address'];
  onEnter['s-address'] = () => { _enterAddr(); setStreetError(false); setZoneError(false); };

  /* Початкові дані */
  onEnter['s-home']();
})();
