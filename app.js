/* Olive Tasting: guest scorecards, IOC panel sheets and live results. Everything stays on this device. */
(() => {
'use strict';

// ------------------------------------------------------------------ vocabulary
const LIKE = [[1, 'Not for me'], [2, 'Okay'], [3, 'Good'], [4, 'Really good'], [5, 'Love it']];
const AROMA = [[0, 'None'], [1, 'Light'], [2, 'Medium'], [3, 'Strong']];
const STYLE = [['green', 'Green', 'cut grass, leaf, artichoke'], ['balanced', 'In between', ''], ['ripe', 'Ripe', 'buttery, nutty, banana']];
const BITTER = [[0, 'None'], [1, 'Light'], [2, 'Medium'], [3, 'Strong']];
const PEPPER = [[0, 'None'], [1, 'Tickle'], [2, 'Kick'], [3, 'Made me cough']];
const BODY = [[1, 'Light and silky'], [2, 'Medium'], [3, 'Rich and thick']];
const FINISH = [[1, 'Short'], [2, 'Medium'], [3, 'Lingers']];
const BUY = [['yes', 'Yes'], ['maybe', 'Maybe'], ['no', 'No']];
const FLAVORS = ['Fresh-cut grass', 'Tomato leaf', 'Artichoke', 'Green apple', 'Green almond', 'Herbs', 'Olive leaf', 'Green banana',
  'Ripe banana', 'Ripe apple', 'Almond or nutty', 'Buttery', 'Citrus', 'Black pepper', 'Floral', 'Sweet'];
const OFF = ['Nothing off', 'Crayons or stale nuts', 'Vinegar or wine', 'Damp basement or mushroom', 'Olives left too long or sweaty',
  'Wet wood', 'Metallic or coins', 'Cooked or burnt', 'Thick or greasy in the mouth'];
const PAIR = ['Bread', 'Salad', 'Vegetables', 'Beans and legumes', 'Fish', 'Grilled meat', 'Cheese', 'Finishing drizzle', 'Everyday cooking', 'Dessert'];
const DEFECTS = [['fusty', 'Fusty / muddy sediment'], ['musty', 'Musty / humid / earthy'], ['winey', 'Winey / vinegary'],
  ['acid', 'Acid / sour'], ['frost', 'Frostbitten olives (wet wood)'], ['rancid', 'Rancid']];
const OTHER = ['Heated or burnt', 'Hay-wood (dry hay)', 'Rough', 'Greasy', 'Vegetable water', 'Brine', 'Metallic', 'Esparto', 'Grubby', 'Cucumber'];
const CULTIVARS = ['Koroneiki', 'Manaki', 'Kalamon', 'Konservolia / Amfissis', 'Athinolia', 'Tsounati', 'Megaritiki', 'Adramytiani / Aivalia',
  'Kolovi', 'Mastoidis', 'Lianolia Kerkyras', 'Koutsourelia', 'Chalkidiki', 'Olympia (Choraitiki)', 'Wild olive (Agrielia)', 'Blend', 'Other'];
// Daniel's lineup, mild to bold. Loaded into the first tasting and offered for new ones.
const MY_BOTTLES = [{"slot": "01","name": "GAEA Planet Organic","producer": "GAEA Products S.M.S.A. (GAEA Estate)","region": "Laconia, Peloponnese","cultivar": "Athinolia","stage": "","price": "","size": "500 ml","label": "PDO/PGI: none · USDA/EU organic","lot": "Lot L6092 GP 2848 · harvest Nov 2025 · best before 10/2027","code": "318","notes": "Organic single-estate oil from the indigenous Athinolia olive, farmed regeneratively in Laconia. Producer describes it as mild and elegant, with cut grass, olive leaf and artichoke; label claims acidity below 0.4%. Second bottle from the left in the lineup photo."},{"slot": "02","name": "Creta Verde Extra Virgin (100 ml)","producer": "Cretan Taste (Creta Verde)","region": "Crete","cultivar": "Koroneiki","stage": "","price": "","size": "100 ml","label": "Superior Category, Product of Greece (no PDO seal)","lot": "Lot L24T265350 · exp 31.03.2028","code": "742","notes": "Plain Creta Verde extra virgin: no PDO or organic seal on this bottle. Cultivar assumed Koroneiki like the rest of the Creta Verde range; check the back label to confirm. Sixth in the lineup photo (left of the two small bottles). Pair it with glass 03 to compare plain vs PDO organic from the same brand."},{"slot": "03","name": "Creta Verde Organic PDO Kolymvari (100 ml)","producer": "Cretan Taste (Creta Verde)","region": "Kolymvari, Chania, Crete","cultivar": "Koroneiki","stage": "","price": "","size": "100 ml","label": "PDO Kolymvari Chania Crete · EU organic","lot": "Lot L18A262404 · exp 31.01.2028","code": "265","notes": "EU protected designation of origin: grown, pressed and bottled around Kolymvari, western Crete, mostly Koroneiki. Carries both the EU PDO seal and the EU organic leaf. Last (far right) in the lineup photo."},{"slot": "04","name": "Terra Creta Platinum 0.3","producer": "Melissa Kikizas S.A. (Terra Creta)","region": "Kolymvari, Chania, Crete","cultivar": "Koroneiki","stage": "","price": "","size": "500 ml","label": "PGI Chania Crete","lot": "Harvest 2025/26 · lot printed on the bottle (hard to read in photo)","code": "597","notes": "Low-acidity Koroneiki; the producer says under 0.2-0.3% at bottling. Label: Π.Γ.Ε. Χανιά Κρήτης = PGI Chania Crete (a regional label, looser than PDO). Rich in vitamin E, 25 mg per 100 ml. Fourth in the lineup photo."},{"slot": "05","name": "Terra Creta Grand Cru","producer": "Melissa Kikizas S.A. (Terra Creta)","region": "Kolymvari, Chania, Crete","cultivar": "Koroneiki","stage": "","price": "","size": "500 ml","label": "PGI Chania Crete (ΠΟΓ/28-4779.06, Agrocert)","lot": "Lot not visible in photo","code": "831","notes": "Terra Creta's top Koroneiki. The back label claims No. 1 in the world for the Koroneiki variety in the EVOO World Ranking. PGI Chania Crete, certified by Agrocert. Third in the lineup photo."},{"slot": "06","name": "Agrelos Wild Olive Trees","producer": "Melira Mon. I.K.E. (Agrelos)","region": "Crete (packed in Magoula, Attica)","cultivar": "Wild olive (Agrielia)","stage": "","price": "","size": "250 ml","label": "Label limits: acidity ≤ 0.8%, peroxides ≤ 20 meq/kg","lot": "Best before 28/07/2027 (as read from photo)","code": "406","notes": "Extra virgin oil from hand-harvested wild olive trees (agrielia). Seller describes it as very fruity and slightly pungent. Wild olives are small and usually high in polyphenols, so expect more bitterness and pepper. Fifth in the lineup photo (dark round bottle)."},{"slot": "07","name": "GAEA Fresh","producer": "GAEA Products S.M.S.A.","region": "Ancient Olympia, Peloponnese","cultivar": "Olympia (Choraitiki)","stage": "early","price": "","size": "500 ml","label": "High polyphenol (350+ mg/kg)","lot": "Lot L6202 · bottle 4490/60000 · harvest Nov 2025 · best before 06/2028","code": "159","notes": "Early-harvest oil from the Ancient Olympia (Choraitiki) olive; label claims 350+ mg/kg polyphenols and acidity below 0.4%. Expected to be the boldest: grassy, artichoke, strong peppery finish. Pour it last. First (far left) in the lineup photo."}];
const blankOil = i => ({ slot: pad2(i + 1), name: '', producer: '', region: '', cultivar: '', stage: '', price: '', size: '', label: '', lot: '', code: '', notes: '' });
const STAGES = [['early', 'Early / green'], ['mid', 'Mid-season'], ['late', 'Late / ripe']];
const OFF_CLEAN = 'Nothing off';

// ------------------------------------------------------------------ storage
const KEY = 'olive-tasting-v1';
const uid = () => Math.random().toString(36).slice(2, 8) + Date.now().toString(36).slice(-4);
const today = () => new Date().toISOString().slice(0, 10);
const pad2 = n => String(n).padStart(2, '0');
let db = load();
function load() {
  try { const d = JSON.parse(localStorage.getItem(KEY)); if (d && d.events) return d; } catch (e) { /* fresh */ }
  return { events: [], cards: [], active: null };
}
function save() { try { localStorage.setItem(KEY, JSON.stringify(db)); } catch (e) { toast('Could not save on this device'); } }
function makeEvent(name, n = 10, bottles) {
  const ev = { id: uid(), name: name || 'My tasting', date: today(), reveal: false, remote: false, oils: bottles ? bottles.map(o => ({ ...blankOil(0), ...o })) : [] };
  if (!bottles) setOilCount(ev, n);
  return ev;
}
function setOilCount(ev, n) {
  n = Math.max(1, Math.min(24, n | 0));
  while (ev.oils.length < n) ev.oils.push(blankOil(ev.oils.length));
  ev.oils.length = n;
}
function flightOf(ev, slot) { // flights of at most 4 (IOC: no more than four samples per session)
  const n = ev.oils.length, k = Math.ceil(n / 4), i = parseInt(slot, 10) - 1;
  const base = Math.floor(n / k), extra = n % k; let start = 0;
  for (let f = 0; f < k; f++) { const size = base + (f < extra ? 1 : 0); if (i < start + size) return f + 1; start += size; }
  return k;
}
const ev = () => db.events.find(e => e.id === db.active) || null;
const cardsOf = e => db.cards.filter(c => c.eventId === e.id);
function ensureEvent() {
  if (!ev()) {
    if (db.events.length) db.active = db.events[0].id;
    else { const e = makeEvent('November 2026 Tasting', 0, MY_BOTTLES); db.events.push(e); db.active = e.id; }
    save();
  }
  return ev();
}
function oilName(e, slot, force) {
  const o = e.oils.find(x => x.slot === slot);
  if ((e.reveal || force) && o && o.name.trim()) return o.name.trim();
  return 'Glass ' + slot;
}

// ------------------------------------------------------------------ dom helpers
const $ = s => document.querySelector(s);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const view = $('#view');
let route = { name: 'home' };
function go(name, params = {}) {
  if (name === 'done' && params.card) { const c = db.cards.find(x => x.id === params.card); if (c) { c.finished = true; save(); pushCards(ev(), [c]); } }
  if (name === 'results' && ev() && ev().sheet && !ev().remote) pullSheet(ev(), true);
  route = { name, ...params }; render(); view.focus({ preventScroll: true }); window.scrollTo(0, 0); }
let toastTimer;
function toast(msg) { const t = $('#toast'); t.textContent = msg; t.classList.add('on'); clearTimeout(toastTimer); toastTimer = setTimeout(() => t.classList.remove('on'), 2600); }
function sheet(html, onMount) {
  const s = $('#sheet'); s.innerHTML = `<div class="sheet-back" data-close></div><div class="sheet-body" role="dialog" aria-modal="true">${html}</div>`;
  s.hidden = false; s.querySelectorAll('[data-close]').forEach(b => b.addEventListener('click', closeSheet));
  if (onMount) onMount(s);
}
function closeSheet() { const s = $('#sheet'); s.hidden = true; s.innerHTML = ''; }
function confirmSheet(title, body, okLabel, onOk, danger) {
  sheet(`<h2>${esc(title)}</h2><p>${esc(body)}</p><div class="row end"><button class="btn ghost" data-close>Cancel</button><button class="btn ${danger ? 'danger' : 'primary'}" id="okBtn">${esc(okLabel)}</button></div>`,
    s => s.querySelector('#okBtn').addEventListener('click', () => { closeSheet(); onOk(); }));
}

// ------------------------------------------------------------------ stats + IOC method (COI/T.20/Doc. No 15, Rev. 11, 2024)
const num = v => (v === null || v === undefined || v === '' || isNaN(+v)) ? null : +v;
const mean = a => a.length ? a.reduce((x, y) => x + y, 0) / a.length : null;
function quantile(a, p) { const s = [...a].sort((x, y) => x - y); if (!s.length) return null; const h = (s.length - 1) * p, lo = Math.floor(h), hi = Math.ceil(h); return s[lo] + (s[hi] - s[lo]) * (h - lo); }
const median = a => quantile(a, .5);
function robustCV(a) { const me = median(a); if (!a.length || !me) return null; const iqr = quantile(a, .75) - quantile(a, .25); return (1.25 * iqr / (1.35 * Math.sqrt(a.length))) / me * 100; }
const f1 = v => v === null || v === undefined ? '–' : (Math.round(v * 10) / 10).toFixed(1);
const pct = v => v === null || v === undefined ? '–' : Math.round(v * 100) + '%';
const word = m => m === null ? '' : m <= 3 ? 'Delicate' : m <= 6 ? 'Medium' : 'Robust';
function counts(list, n = 3, exclude = []) { const c = {}; list.filter(x => !exclude.includes(x)).forEach(x => c[x] = (c[x] || 0) + 1); return Object.entries(c).sort((a, b) => b[1] - a[1]).slice(0, n); }
const majority = list => { const t = counts(list, 1); return t.length ? t[0][0] : null; };

function guestRows(e, slot) {
  return cardsOf(e).filter(c => c.type === 'guest').map(c => ({ who: c.taster, ...(c.s[slot] || {}) }))
    .filter(r => ['like', 'fruity', 'bitter', 'pepper', 'body', 'finish', 'style', 'buy'].some(k => r[k] !== undefined && r[k] !== null) || (r.flavors || []).length || (r.off || []).length);
}
function panelRows(e, slot) {
  return cardsOf(e).filter(c => c.type === 'panel').map(c => ({ who: c.taster, ...(c.s[slot] || {}) }))
    .filter(r => ['fruity', 'bitter', 'pungent', 'other_int', ...DEFECTS.map(d => d[0])].some(k => num(r[k]) !== null));
}
function crowd(rows) {
  const v = k => rows.map(r => num(r[k])).filter(x => x !== null);
  const buys = rows.map(r => r.buy).filter(Boolean);
  const flagged = rows.filter(r => (r.off || []).some(o => o !== OFF_CLEAN)).length;
  const sty = rows.map(r => ({ green: -1, balanced: 0, ripe: 1 }[r.style])).filter(x => x !== undefined);
  return {
    n: rows.length, like: mean(v('like')), fruity: mean(v('fruity')), bitter: mean(v('bitter')), pepper: mean(v('pepper')),
    buy: buys.length ? buys.filter(b => b === 'yes').length / buys.length : null, style: majority(rows.map(r => r.style).filter(Boolean)), styleScore: mean(sty),
    flavors: counts(rows.flatMap(r => r.flavors || [])), pair: counts(rows.flatMap(r => r.pair || []), 3),
    offRate: rows.length ? flagged / rows.length : null, offTop: counts(rows.flatMap(r => r.off || []), 2, [OFF_CLEAN]),
    comments: rows.filter(r => r.comment).map(r => ({ who: r.who, text: r.comment }))
  };
}
function ioc(rows) {
  const N = rows.length; if (!N) return null;
  const col = k => rows.map(r => num(r[k]) ?? 0);
  const defs = DEFECTS.map(([k, label]) => ({ label, vals: col(k), med: median(col(k)) }));
  for (const o of [...new Set(rows.map(r => r.other).filter(Boolean))]) { // "others" count when at least 50% of the panel records them
    const vals = rows.map(r => r.other === o ? (num(r.other_int) ?? 0) : 0);
    if (rows.filter(r => r.other === o && (num(r.other_int) ?? 0) > 0).length / N >= .5) defs.push({ label: o, vals, med: median(vals) });
  }
  const worst = defs.reduce((a, b) => b.med > a.med ? b : a, defs[0]);
  const Me = Math.round(worst.med * 10) / 10, fr = col('fruity'), Mf = Math.round(median(fr) * 10) / 10, Mb = median(col('bitter')), Mp = median(col('pungent'));
  let cat, cls;
  if (Me === 0 && Mf > 0) { cat = 'Extra virgin'; cls = 'evoo'; } else if (Me <= 3.5 && Mf > 0) { cat = 'Virgin'; cls = 'voo'; }
  else if (Me <= 6) { cat = 'Ordinary virgin'; cls = 'ovoo'; } else { cat = 'Lampante'; cls = 'lamp'; }
  const ftype = majority(rows.map(r => r.ftype).filter(Boolean));
  const terms = [];
  if (Me <= 3.5 && Mf > 0) {
    terms.push(`${word(Mf)}${ftype ? ' ' + ftype : ''} fruitiness`);
    if (Mb > 0) terms.push(word(Mb).toLowerCase() + ' bitterness'); if (Mp > 0) terms.push(word(Mp).toLowerCase() + ' pungency');
    if (Mb <= Mf + 2 && Mp <= Mf + 2) terms.push('well balanced'); if (Mb <= 2 && Mp <= 2) terms.push('mild');
  }
  const cvF = robustCV(fr), cvD = Me > 0 ? robustCV(worst.vals) : null, warn = [];
  if (N < 8) warn.push(`${N} taster${N === 1 ? '' : 's'}; the IOC asks for 8 to 12`);
  if (cvF !== null && cvF > 20) warn.push(`tasters disagree on fruit (CVr ${f1(cvF)}%), re-taste`);
  if (cvD !== null && cvD > 20) warn.push(`tasters disagree on the defect (CVr ${f1(cvD)}%), re-taste`);
  if (Mf === 0 && Me <= 3.5) warn.push('no fruit found: re-check at room temperature');
  return { N, Me, worst: Me > 0 ? worst.label : '', Mf, Mb, Mp, ftype, cat, cls, terms, warn };
}

// ------------------------------------------------------------------ share codes (links + QR)
const b64u = bytes => btoa(String.fromCharCode(...bytes)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
const unb64u = s => Uint8Array.from(atob(s.replace(/-/g, '+').replace(/_/g, '/')), c => c.charCodeAt(0));
async function pack(obj) {
  const raw = new TextEncoder().encode(JSON.stringify(obj));
  if (window.CompressionStream) {
    try { const buf = await new Response(new Blob([raw]).stream().pipeThrough(new CompressionStream('deflate-raw'))).arrayBuffer(); return 'z' + b64u(new Uint8Array(buf)); } catch (e) { /* fall through */ }
  }
  return 'p' + b64u(raw);
}
async function unpack(code) {
  const bytes = unb64u(code.slice(1));
  if (code[0] === 'z') { const buf = await new Response(new Blob([bytes]).stream().pipeThrough(new DecompressionStream('deflate-raw'))).arrayBuffer(); return JSON.parse(new TextDecoder().decode(buf)); }
  return JSON.parse(new TextDecoder().decode(bytes));
}
const enc = (list, v) => { const i = list.findIndex(x => (Array.isArray(x) ? x[0] : x) === v); return i < 0 ? null : i; };
const dec = (list, i) => i === null || i === undefined ? undefined : (Array.isArray(list[i]) ? list[i][0] : list[i]);
const mask = (list, arr) => (arr || []).reduce((m, x) => { const i = list.indexOf(x); return i < 0 ? m : m | (1 << i); }, 0);
const unmask = (list, m) => list.filter((_, i) => m & (1 << i));
function compactCard(c) {
  const s = {};
  for (const [slot, r] of Object.entries(c.s)) {
    s[slot] = c.type === 'guest'
      ? [r.like ?? null, r.fruity ?? null, enc(STYLE, r.style), r.bitter ?? null, r.pepper ?? null, enc(BUY, r.buy), r.body ?? null, r.finish ?? null, mask(FLAVORS, r.flavors), mask(OFF, r.off), mask(PAIR, r.pair), r.comment || '']
      : [...DEFECTS.map(d => r[d[0]] ?? null), enc(OTHER, r.other), r.other_int ?? null, r.fruity ?? null, r.ftype ? (r.ftype === 'green' ? 0 : 1) : null, r.bitter ?? null, r.pungent ?? null, r.comment || ''];
  }
  return { id: c.id, t: c.type === 'guest' ? 'g' : 'p', n: c.taster, d: c.date, s };
}
function expandCard(k, eventId) {
  const s = {};
  for (const [slot, a] of Object.entries(k.s || {})) {
    const r = {};
    const set = (key, v) => { if (v !== null && v !== undefined && v !== '' && !(Array.isArray(v) && !v.length)) r[key] = v; };
    if (k.t === 'g') {
      set('like', a[0]); set('fruity', a[1]); set('style', dec(STYLE, a[2])); set('bitter', a[3]); set('pepper', a[4]); set('buy', dec(BUY, a[5]));
      set('body', a[6]); set('finish', a[7]); set('flavors', unmask(FLAVORS, a[8])); set('off', unmask(OFF, a[9])); set('pair', unmask(PAIR, a[10])); set('comment', a[11]);
    } else {
      DEFECTS.forEach((d, i) => set(d[0], a[i])); set('other', dec(OTHER, a[6])); set('other_int', a[7]); set('fruity', a[8]);
      set('ftype', a[9] === 0 ? 'green' : a[9] === 1 ? 'ripe' : undefined); set('bitter', a[10]); set('pungent', a[11]); set('comment', a[12]);
    }
    s[slot] = r;
  }
  return { id: k.id, eventId, type: k.t === 'g' ? 'guest' : 'panel', taster: k.n || 'Guest', date: k.d || today(), s };
}
const baseUrl = () => location.href.split('#')[0];
async function joinLink(e) { return baseUrl() + '#join=' + await pack({ v: 1, id: e.id, name: e.name, date: e.date, n: e.oils.length, ...(e.sheet ? { s: e.sheet } : {}) }); }
async function resultLink(e, c) { return baseUrl() + '#r=' + await pack({ v: 1, e: { id: e.id, name: e.name, date: e.date, n: e.oils.length }, c: compactCard(c) }); }
function qrSvg(text) {
  try { const q = qrcode(0, 'L'); q.addData(text); q.make(); return q.createSvgTag({ cellSize: 4, margin: 2, scalable: true }); }
  catch (e) { return '<p class="muted">This is too long for a QR code. Use Share or Copy instead.</p>'; }
}
function findOrAddEvent(meta, remote) {
  let e = db.events.find(x => x.id === meta.id);
  if (!e) { e = makeEvent(meta.name, meta.n || 10); e.id = meta.id; e.date = meta.date || today(); e.remote = !!remote; db.events.push(e); }
  else if ((meta.n || 0) > e.oils.length) setOilCount(e, meta.n);
  if (remote && meta.s && validSheet(meta.s)) e.sheet = meta.s;
  return e;
}
async function handleHash() {
  const h = location.hash;
  if (!h.startsWith('#join=') && !h.startsWith('#r=')) return;
  try {
    if (h.startsWith('#join=')) {
      const m = await unpack(h.slice(6)); const e = findOrAddEvent(m, true); db.active = e.id; save();
      clearHash(); toast(`Joined ${e.name}`); go('start', { type: 'guest' });
    } else {
      const m = await unpack(h.slice(3)); const e = findOrAddEvent(m.e, false); const c = expandCard(m.c, e.id);
      const i = db.cards.findIndex(x => x.id === c.id); if (i >= 0) db.cards[i] = c; else db.cards.push(c);
      db.active = e.id; save(); clearHash(); toast(`Added ${c.taster}'s scores`); go('results');
    }
  } catch (err) { clearHash(); toast('That link could not be read'); render(); }
}
function clearHash() { try { history.replaceState(null, '', location.pathname + location.search); } catch (e) { location.hash = ''; } }


// ------------------------------------------------------------------ Google Sheet sync
// The host's own Apps Script web app (see sheet-script.gs). Cards are sent as text/plain so no CORS preflight is needed.
const validSheet = u => /^https:\/\/script\.google\.com\/macros\/s\/[\w-]+\/exec$/.test(String(u || '').trim()) || /^http:\/\/127\.0\.0\.1:\d+\/exec$/.test(String(u || ''));
const syncState = {}; // card id -> 'sending' | 'ok' | 'fail'
function sheetRows(e, c) {
  const rows = [];
  for (const o of e.oils) {
    const r = c.s[o.slot]; if (!r || !Object.keys(r).length) continue; const g = c.type === 'guest';
    const row = { glass: o.slot, oil: e.remote ? '' : o.name, cup_code: o.code || '', taster_type: c.type, taster: c.taster,
      flavors: (r.flavors || []).join('; '), off: (r.off || []).join('; '), pair: (r.pair || []).join('; '), comment: r.comment || '' };
    if (g) Object.assign(row, { like_1_5: r.like, aroma_0_3: r.fruity, style: r.style, bitter_0_3: r.bitter, pepper_0_3: r.pepper, buy: r.buy, body_1_3: r.body, finish_1_3: r.finish });
    else { Object.assign(row, { fruity_0_10: r.fruity, fruity_type: r.ftype, bitter_0_10: r.bitter, pungent_0_10: r.pungent, other: r.other, other_int: r.other_int }); DEFECTS.forEach(d => { row[d[0]] = r[d[0]]; }); }
    for (const k in row) if (row[k] === undefined || row[k] === null) row[k] = '';
    rows.push(row);
  }
  return rows;
}
async function postSheet(url, payload) {
  const body = JSON.stringify(payload);
  try {
    const res = await fetch(url, { method: 'POST', body, headers: { 'Content-Type': 'text/plain;charset=utf-8' }, redirect: 'follow' });
    const j = await res.json(); if (!j.ok) throw new Error(j.error || 'Sheet said no'); return true;
  } catch (err) {
    if (err instanceof TypeError) { await fetch(url, { method: 'POST', body, mode: 'no-cors', headers: { 'Content-Type': 'text/plain;charset=utf-8' } }); return true; } // response unreadable, request still delivered
    throw err;
  }
}
const evMeta = e => ({ id: e.id, name: e.name, date: e.date });
async function pushCards(e, cards, withOils) {
  if (!e || !e.sheet || !cards.length && !withOils) return null;
  cards.forEach(c => { syncState[c.id] = 'sending'; }); refreshSync();
  const payload = { v: 1, event: evMeta(e), cards: cards.map(c => ({ id: c.id, json: c, rows: sheetRows(e, c) })) };
  if (withOils || !e.remote) payload.oils = e.remote ? undefined : e.oils;
  try {
    await postSheet(e.sheet, payload);
    const t = Date.now(); cards.forEach(c => { c.synced = t; syncState[c.id] = 'ok'; }); save(); refreshSync(); return true;
  } catch (err) { cards.forEach(c => { syncState[c.id] = 'fail'; }); refreshSync(); return false; }
}
function pendingCards(e) { return cardsOf(e).filter(c => c.finished && (!c.synced || (c.updated || 0) > c.synced)); }
async function retryPending() { for (const e of db.events) if (e.sheet) { const p = pendingCards(e); if (p.length) await pushCards(e, p); } }
async function pullSheet(e, quiet) {
  try {
    const res = await fetch(e.sheet + '?event=' + encodeURIComponent(e.id)); const j = await res.json(); if (!j.ok) throw 0;
    let added = 0, changed = 0;
    for (const c of j.cards || []) {
      if (!c || !c.id) continue; c.eventId = e.id; const i = db.cards.findIndex(x => x.id === c.id);
      if (i < 0) { db.cards.push({ ...c, synced: Date.now() }); added++; }
      else if ((c.updated || 0) > (db.cards[i].updated || 0)) { db.cards[i] = { ...c, synced: Date.now() }; changed++; }
    }
    save();
    if (added || changed) { if (route.name === 'results' || route.name === 'home') keepScroll(render); if (!quiet || added) toast(`${added} new card${added === 1 ? '' : 's'} from the sheet`); }
    else if (!quiet) toast('Up to date with the sheet');
    return true;
  } catch (err) { if (!quiet) toast('Could not reach the Google Sheet'); return false; }
}
function syncLine(e, c) {
  if (!e.sheet) return '';
  const st = syncState[c.id] || (c.synced && (c.updated || 0) <= c.synced ? 'ok' : 'fail');
  const msg = st === 'sending' ? 'Saving to the Google Sheet…' : st === 'ok' ? (e.remote ? 'Sent to the host automatically. You can close this page.' : 'Saved to your Google Sheet.') : 'Not saved to the Google Sheet yet. It will try again when you are online.';
  return `<p class="sync ${st}" id="syncLine">${msg}${st === 'fail' ? ' <button class="linkish" id="retrySync">Try now</button>' : ''}</p>`;
}
function refreshSync() {
  const el = $('#syncLine'); if (!el || route.name !== 'done') return; const c = db.cards.find(x => x.id === route.card); if (!c) return;
  el.outerHTML = syncLine(ev(), c); $('#retrySync')?.addEventListener('click', () => pushCards(ev(), [c]));
}
async function fetchScript() { const r = await fetch('sheet-script.gs'); return r.text(); }
function sheetHelp() {
  sheet(`<h2>Connect a Google Sheet</h2>
  <p>Every finished card, from any phone, is added to your own sheet. About five minutes, once.</p>
  <ol class="steps">
    <li>Open <a href="https://sheets.new" target="_blank" rel="noopener">sheets.new</a> to make a blank Google Sheet. Name it <b>Olive Tastings</b>.</li>
    <li>In the sheet, choose <b>Extensions › Apps Script</b>. Delete the sample code, paste the script, and press <b>Save</b>.<br><button class="btn" id="copyScript" type="button">Copy the script</button></li>
    <li>Choose <b>Deploy › New deployment</b>. Click the gear, pick <b>Web app</b>. Set <b>Execute as: Me</b> and <b>Who has access: Anyone</b>. Press <b>Deploy</b>.</li>
    <li>Google asks you to authorize. If it says the app isn't verified, choose <b>Advanced › Go to … (unsafe)</b>. It is your own script, only touching this sheet.</li>
    <li>Copy the <b>Web app URL</b> (it ends in <b>/exec</b>) and paste it into the box on the Oils tab. Press <b>Test</b>.</li>
  </ol>
  <p class="muted">Then make a fresh invite. Phones that join from it send their cards to the sheet on their own. "Anyone" means anyone holding the link can add rows, so share it only through your invites.</p>
  <div class="row end"><a class="btn ghost" href="sheet-script.gs" target="_blank" rel="noopener">View script</a><button class="btn primary" data-close>Done</button></div>`,
  s => s.querySelector('#copyScript').addEventListener('click', async () => { try { await navigator.clipboard.writeText(await fetchScript()); toast('Script copied'); } catch (e) { toast('Use View script, then copy it'); } }));
}
async function testSheet() {
  const e = ev(); if (!e.sheet) return toast('Paste the Web app URL first');
  const b = $('#testSheet'); if (b) { b.disabled = true; b.textContent = 'Testing…'; }
  let ok = false;
  try { const r = await fetch(e.sheet); const j = await r.json(); ok = j.ok && j.app === 'olive-tasting'; } catch (err) { ok = false; }
  if (ok) { await pushCards(e, cardsOf(e).filter(c => c.finished), true); toast('Connected. Oils and finished cards sent.'); e.sheetOk = Date.now(); save(); }
  else toast('No answer. Check the URL ends in /exec and access is set to Anyone.');
  keepScroll(render);
}
window.addEventListener('online', retryPending);

// ------------------------------------------------------------------ exports
function download(name, blob) { const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = name; document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 500); }
const safe = s => String(s || '').replace(/[\\/:*?"<>|#^[\]]/g, '').trim() || 'Untitled';
function csvFor(e) {
  const head = ['event', 'glass', 'oil', 'taster_type', 'taster', 'like_1_5', 'aroma_0_3', 'style', 'bitter_0_3', 'pepper_0_3', 'buy', 'body_1_3', 'finish_1_3', 'fruity_0_10', 'fruity_type', 'bitter_0_10', 'pungent_0_10', ...DEFECTS.map(d => d[0]), 'other', 'other_int', 'flavors', 'off', 'pair', 'comment'];
  const q = v => `"${String(v ?? '').replace(/"/g, '""')}"`; const lines = [head.join(',')];
  for (const c of cardsOf(e)) for (const o of e.oils) {
    const r = c.s[o.slot]; if (!r || !Object.keys(r).length) continue;
    const g = c.type === 'guest';
    lines.push([e.name, o.slot, o.name, c.type, c.taster, g ? r.like : '', g ? r.fruity : '', g ? r.style : '', g ? r.bitter : '', g ? r.pepper : '', g ? r.buy : '', g ? r.body : '', g ? r.finish : '',
      g ? '' : r.fruity, g ? '' : r.ftype, g ? '' : r.bitter, g ? '' : r.pungent, ...DEFECTS.map(d => g ? '' : r[d[0]]), g ? '' : r.other, g ? '' : r.other_int,
      (r.flavors || []).join('; '), (r.off || []).join('; '), (r.pair || []).join('; '), r.comment].map(q).join(','));
  }
  return lines.join('\n');
}
const yq = v => JSON.stringify(String(v));
function obsidianNote(e, c) { // matches the Olive Oil Tastings vault: oNN_<field> properties, linked to Oils/Oil NN
  const L = ['---', `type: ${c.type}-card`, `event: ${yq(e.name)}`, `taster: ${yq(c.taster)}`, `date: ${c.date}`, 'cssclasses:', '  - olive-card', 'source: web-app'];
  for (const o of e.oils) {
    L.push(`o${o.slot}_oil: "[[Oil ${o.slot}]]"`);
    const r = c.s[o.slot] || {};
    for (const [k, v] of Object.entries(r)) {
      if (Array.isArray(v)) { if (v.length) { L.push(`o${o.slot}_${k}:`); v.forEach(x => L.push(`  - ${yq(x)}`)); } }
      else if (typeof v === 'number') L.push(`o${o.slot}_${k}: ${v}`);
      else L.push(`o${o.slot}_${k}: ${yq(v)}`);
    }
  }
  L.push('---', '', `# ${c.taster}`, '', `${c.type === 'guest' ? 'Guest card' : 'Panel sheet'} imported from the Olive Tasting web app.`, '', '```dataviewjs', `await dv.view("_system/views/results", {mode: "${c.type === 'guest' ? 'guestcard' : 'panelcard'}"});`, '```', '');
  return L.join('\n');
}
// Minimal ZIP writer (stored, no compression) so the export works offline without libraries.
const CRC = (() => { const t = new Uint32Array(256); for (let n = 0; n < 256; n++) { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1; t[n] = c >>> 0; } return t; })();
const crc32 = b => { let c = 0xFFFFFFFF; for (let i = 0; i < b.length; i++) c = CRC[(c ^ b[i]) & 255] ^ (c >>> 8); return (c ^ 0xFFFFFFFF) >>> 0; };
function zip(files) {
  const te = new TextEncoder(), parts = [], central = []; let off = 0;
  for (const f of files) {
    const name = te.encode(f.name), data = te.encode(f.text), crc = crc32(data);
    const h = new DataView(new ArrayBuffer(30)); h.setUint32(0, 0x04034b50, true); h.setUint16(4, 20, true); h.setUint16(6, 0x0800, true); h.setUint32(14, crc, true); h.setUint32(18, data.length, true); h.setUint32(22, data.length, true); h.setUint16(26, name.length, true);
    parts.push(new Uint8Array(h.buffer), name, data);
    const c = new DataView(new ArrayBuffer(46)); c.setUint32(0, 0x02014b50, true); c.setUint16(4, 20, true); c.setUint16(6, 20, true); c.setUint16(8, 0x0800, true); c.setUint32(16, crc, true); c.setUint32(20, data.length, true); c.setUint32(24, data.length, true); c.setUint16(28, name.length, true); c.setUint32(42, off, true);
    central.push(new Uint8Array(c.buffer), name); off += 30 + name.length + data.length;
  }
  const size = central.reduce((s, p) => s + p.length, 0), end = new DataView(new ArrayBuffer(22));
  end.setUint32(0, 0x06054b50, true); end.setUint16(8, files.length, true); end.setUint16(10, files.length, true); end.setUint32(12, size, true); end.setUint32(16, off, true);
  return new Blob([...parts, ...central, new Uint8Array(end.buffer)], { type: 'application/zip' });
}

// ------------------------------------------------------------------ UI pieces
function pills(name, opts, val, multi) {
  return `<div class="pills ${multi ? 'chips' : ''}" role="group" data-field="${name}" data-multi="${multi ? 1 : 0}">` + opts.map(o => {
    const v = Array.isArray(o) ? o[0] : o, label = Array.isArray(o) ? o[1] : o, sub = Array.isArray(o) && o[2] ? `<small>${esc(o[2])}</small>` : '';
    const on = multi ? (val || []).includes(v) : val === v;
    return `<button type="button" class="pill ${on ? 'on' : ''}" aria-pressed="${on}" data-v="${esc(JSON.stringify(v))}">${esc(label)}${sub}</button>`;
  }).join('') + '</div>';
}
function bar(v, max, cls = '') { if (v === null || v === undefined) return '<span class="muted">–</span>'; return `<span class="bar ${cls}"><i style="width:${Math.max(2, Math.min(100, v / max * 100))}%"></i></span><span class="val">${f1(v)}</span>`; }
const catTag = r => `<span class="cat ${r.cls}">${r.cat}</span>`;

// ------------------------------------------------------------------ screens
function renderHome() {
  const e = ensureEvent(), cs = cardsOf(e), g = cs.filter(c => c.type === 'guest'), p = cs.filter(c => c.type === 'panel');
  const others = db.events.filter(x => x.id !== e.id);
  return `
  <section class="hero">
    <p class="eyebrow">${esc(e.date)}${e.remote ? ' · joined from the host' : ''}</p>
    <h1>${esc(e.name)}</h1>
    <p class="lead">${e.oils.length} oils, poured in ${Math.ceil(e.oils.length / 4)} flights. ${g.length} guest card${g.length === 1 ? '' : 's'}${p.length ? `, ${p.length} panel sheet${p.length === 1 ? '' : 's'}` : ''} so far.</p>
  </section>
  <div class="actions">
    <button class="big primary" data-go="start" data-type="guest"><strong>Start a guest card</strong><span>Simple buttons for everyone at the table</span></button>
    <button class="big" data-go="start" data-type="panel"><strong>Expert panel sheet</strong><span>IOC method: defects, fruity, bitter, pungent on 0 to 10</span></button>
  </div>
  ${cs.length ? `<h2 class="sec">Cards at this tasting</h2><ul class="list">${cs.slice().reverse().map(c => {
    const done = Object.values(c.s).filter(r => r && Object.keys(r).length).length;
    return `<li><button class="li" data-open="${c.id}"><span><strong>${esc(c.taster)}</strong><small>${c.type === 'guest' ? 'Guest card' : 'Panel sheet'} · ${done} of ${e.oils.length} scored</small></span><span class="chev" aria-hidden="true">›</span></button></li>`;
  }).join('')}</ul>` : ''}
  <div class="row wrap gap">
    ${e.remote ? '' : '<button class="btn" id="inviteBtn">Invite phones</button>'}
    <button class="btn ghost" id="newEventBtn">New tasting</button>
    ${others.length ? '<button class="btn ghost" id="switchBtn">Switch tasting</button>' : ''}
  </div>`;
}
function renderStart() {
  const e = ensureEvent(), t = route.type;
  return `<section class="hero small"><p class="eyebrow">${t === 'guest' ? 'Guest card' : 'Expert panel sheet'}</p><h1>Who's tasting?</h1></section>
  <form id="startForm" class="stack">
    <label class="field"><span>${t === 'guest' ? 'Your name or a nickname' : 'Taster name'}</span><input id="who" autocomplete="off" enterkeyhint="go" maxlength="40" required placeholder="${t === 'guest' ? 'e.g. Eleni' : 'e.g. Panelist A'}"></label>
    <button class="btn primary wide" type="submit">Start tasting ${esc(e.name)}</button>
  </form>
  ${t === 'guest' ? `<div class="howto"><h2>How to taste each glass</h2><ol>
    <li><b>Warm it.</b> Cup the covered glass in your hand for about a minute.</li>
    <li><b>Swirl and sniff.</b> Two short sniffs. Strong or faint? Green or ripe?</li>
    <li><b>Sip and slurp.</b> A small sip, then pull a little air through your teeth.</li>
    <li><b>Notice.</b> Bitterness sits at the back of the tongue. A peppery tickle in the throat is a good sign.</li>
    <li><b>Cleanse.</b> A slice of green apple and some water before the next glass.</li></ol><p class="muted">There are no wrong answers.</p></div>`
    : `<div class="howto"><h2>Panel rules of thumb</h2><ul><li>Smell, then taste. Mark every attribute you perceive; leave 0 if not perceived.</li><li>Oil at 28 C, give or take 2, in covered colored glasses. At most 4 samples per session, 15 minutes between sessions.</li><li>Record anything off the list under "Other negative attribute."</li></ul></div>`}`;
}
function cardNav(e, c, idx) {
  return `<div class="dots" role="tablist" aria-label="Glasses">${e.oils.map((o, i) => {
    const r = c.s[o.slot] || {}, done = c.type === 'guest' ? r.like !== undefined : num(r.fruity) !== null;
    return `<button class="dot ${i === idx ? 'cur' : ''} ${done ? 'done' : ''}" data-jump="${i}" aria-label="Glass ${o.slot}${done ? ', scored' : ''}">${o.slot}</button>`;
  }).join('')}</div>`;
}
function renderCard() {
  const e = ensureEvent(), c = db.cards.find(x => x.id === route.card); if (!c) { route = { name: 'home' }; return renderHome(); }
  const idx = route.idx || 0, o = e.oils[idx], r = c.s[o.slot] || (c.s[o.slot] = {});
  const last = idx === e.oils.length - 1;
  const head = `<div class="card-head"><div><p class="eyebrow">${esc(c.taster)} · Flight ${flightOf(e, o.slot)}</p><h1>Glass ${o.slot}<span class="of"> of ${e.oils.length}</span></h1>${o.code ? `<p class="code">Cup code <strong>${esc(o.code)}</strong></p>` : ''}</div></div>${cardNav(e, c, idx)}`;
  const foot = `<div class="pager"><button class="btn ghost" data-step="-1" ${idx === 0 ? 'disabled' : ''}>Back</button><button class="btn primary" data-step="1">${last ? 'Finish' : 'Next glass'}</button></div>`;
  if (c.type === 'guest') return head + `
    <div class="q"><h3>Overall, how much do you like it?</h3>${pills('like', LIKE, r.like)}</div>
    <div class="q"><h3>Sniff it. How strong is the olive smell?</h3>${pills('fruity', AROMA, r.fruity)}</div>
    <div class="q"><h3>More green or more ripe?</h3>${pills('style', STYLE, r.style)}</div>
    <div class="q"><h3>Bitterness <small>back of the tongue, like arugula or strong coffee</small></h3>${pills('bitter', BITTER, r.bitter)}</div>
    <div class="q"><h3>Peppery kick <small>a tickle or burn in the throat after you swallow</small></h3>${pills('pepper', PEPPER, r.pepper)}</div>
    <div class="q"><h3>Would you buy it?</h3>${pills('buy', BUY, r.buy)}</div>
    <details class="deeper" ${route.deep ? 'open' : ''}><summary>Go deeper <small>optional</small></summary>
      <div class="q"><h3>Body</h3>${pills('body', BODY, r.body)}</div>
      <div class="q"><h3>Finish</h3>${pills('finish', FINISH, r.finish)}</div>
      <div class="q"><h3>Flavors you notice</h3>${pills('flavors', FLAVORS, r.flavors, true)}</div>
      <div class="q warn"><h3>Anything seem off?</h3>${pills('off', OFF, r.off, true)}</div>
      <div class="q"><h3>Best with</h3>${pills('pair', PAIR, r.pair, true)}</div>
      <label class="field"><span>Notes</span><textarea data-text="comment" rows="3" placeholder="Anything you want to remember">${esc(r.comment || '')}</textarea></label>
    </details>` + foot;
  const slider = (k, label) => { const v = num(r[k]) ?? 0; return `<div class="sl"><div class="sl-top"><span>${esc(label)}</span><output>${f1(v)}</output></div><div class="sl-row"><button class="step" data-nudge="${k}" data-d="-0.5" aria-label="Lower ${esc(label)}">−</button><input type="range" min="0" max="10" step="0.5" value="${v}" data-range="${k}" aria-label="${esc(label)}"><button class="step" data-nudge="${k}" data-d="0.5" aria-label="Raise ${esc(label)}">+</button></div></div>`; };
  return head + `
    <h2 class="sec">Negative attributes <small>0 = not perceived</small></h2>
    ${DEFECTS.map(([k, l]) => slider(k, l)).join('')}
    <label class="field"><span>Other negative attribute</span><select data-select="other"><option value="">None</option>${OTHER.map(x => `<option ${r.other === x ? 'selected' : ''}>${esc(x)}</option>`).join('')}</select></label>
    ${r.other ? slider('other_int', r.other + ' intensity') : ''}
    <h2 class="sec">Positive attributes</h2>
    ${slider('fruity', 'Fruity')}
    <div class="q"><h3>Fruity is mainly</h3>${pills('ftype', [['green', 'Green'], ['ripe', 'Ripe']], r.ftype)}</div>
    ${slider('bitter', 'Bitter')}${slider('pungent', 'Pungent')}
    <label class="field"><span>Descriptors and comments</span><textarea data-text="comment" rows="3">${esc(r.comment || '')}</textarea></label>` + foot;
}
function renderDone() {
  const e = ensureEvent(), c = db.cards.find(x => x.id === route.card); if (!c) return renderHome();
  let body = '';
  if (c.type === 'guest') {
    const fav = e.oils.map(o => ({ o, r: c.s[o.slot] || {} })).filter(x => x.r.like !== undefined).sort((a, b) => b.r.like - a.r.like);
    body = fav.length ? `<h2 class="sec">Your favorites</h2><ol class="favs">${fav.slice(0, 3).map(x => `<li><strong>Glass ${x.o.slot}</strong> <span class="muted">${esc(LIKE.find(l => l[0] === x.r.like)[1])}${x.r.style ? ' · ' + x.r.style : ''}</span></li>`).join('')}</ol>` : '<p class="muted">No glasses scored yet.</p>';
  } else {
    body = `<h2 class="sec">Your calls</h2><div class="tbl"><table><thead><tr><th>Sample</th><th>Fruity</th><th>Defect</th><th>Your call</th></tr></thead><tbody>${e.oils.map(o => { const r = ioc(panelRows({ ...e }, o.slot).length ? [{ ...(c.s[o.slot] || {}) }] : []); return r ? `<tr><td>${o.slot}</td><td>${f1(r.Mf)}</td><td>${r.Me ? f1(r.Me) + ' ' + esc(r.worst) : 'none'}</td><td>${catTag(r)}</td></tr>` : ''; }).join('')}</tbody></table></div><p class="muted">Your sheet only. The official call uses the whole panel's medians in Results.</p>`;
  }
  return `<section class="hero small"><p class="eyebrow">Thank you</p><h1>${esc(c.taster)}, you're done</h1>${syncLine(e, c)}</section>${body}
  <div class="stack">
    ${e.remote ? `<button class="btn ${e.sheet ? '' : 'primary '}wide" id="sendBtn">${e.sheet ? 'Show my scores code (backup)' : 'Send my scores to the host'}</button>` : `<button class="btn primary wide" data-go="start" data-type="${c.type}">Next ${c.type === 'guest' ? 'guest' : 'taster'}</button><button class="btn wide" data-go="results">See results</button>`}
    <button class="btn ghost wide" data-open="${c.id}">Change my answers</button>
  </div>`;
}
function renderResults() {
  const e = ensureEvent(), cs = cardsOf(e), tab = route.tab || 'crowd';
  const g = cs.filter(c => c.type === 'guest').length, p = cs.filter(c => c.type === 'panel').length;
  const tabs = [['crowd', 'Crowd'], ['panel', 'Expert panel'], ['map', 'Flavor map'], ['notes', 'Comments']];
  let body = '';
  if (tab === 'crowd') {
    const list = e.oils.map(o => ({ o, c: crowd(guestRows(e, o.slot)) })).filter(x => x.c.n).sort((a, b) => (b.c.like ?? 0) - (a.c.like ?? 0));
    body = !list.length ? empty('No guest scores yet', 'Start a guest card on the Taste tab, or invite phones.') :
      `<ol class="rank">${list.map(({ o, c }, i) => `<li class="r${i < 3 ? ' m' + (i + 1) : ''}"><span class="pos">${i + 1}</span><div class="r-main"><div class="r-top"><strong>${esc(oilName(e, o.slot))}</strong><span class="like">${bar(c.like, 5, 'gold')}</span></div>
        <div class="r-meta"><span>Buy ${pct(c.buy)}</span><span>Aroma ${bar(c.fruity, 3)}</span><span>Bitter ${bar(c.bitter, 3)}</span><span>Pepper ${bar(c.pepper, 3, 'hot')}</span></div>
        <div class="r-words">${c.style ? `<em>${esc(c.style)}</em>` : ''}${c.flavors.map(f => `<span class="tag">${esc(f[0])}</span>`).join('')}${c.offRate >= .25 ? `<span class="tag bad">${pct(c.offRate)} flagged: ${esc(c.offTop.map(x => x[0]).join(', '))}</span>` : ''}</div></div><span class="n">${c.n} card${c.n === 1 ? "" : "s"}</span></li>`).join('')}</ol>
        <p class="muted">Ranked by average liking (1 to 5). Aroma, bitter and pepper are guest averages on 0 to 3. A red tag means a quarter or more of guests said something seemed off.</p>`;
  } else if (tab === 'panel') {
    const list = e.oils.map(o => ({ o, r: ioc(panelRows(e, o.slot)) })).filter(x => x.r);
    body = !list.length ? empty('No panel sheets yet', 'Trained tasters can use the Expert panel sheet on the Taste tab.') :
      `<div class="tbl"><table><thead><tr><th>Oil</th><th>Grade</th><th>Fruity</th><th>Bitter</th><th>Pungent</th><th>Defect</th></tr></thead><tbody>${list.map(({ o, r }) => `<tr><td><strong>${esc(oilName(e, o.slot))}</strong></td><td>${catTag(r)}</td><td>${bar(r.Mf, 10)} <small>${esc(r.ftype || '')}</small></td><td>${bar(r.Mb, 10)}</td><td>${bar(r.Mp, 10, 'hot')}</td><td>${r.Me ? `${f1(r.Me)} <small>${esc(r.worst)}</small>` : '0.0'}</td></tr>
        <tr class="sub"><td colspan="6">${r.terms.length ? esc(r.terms.join(', ')) : ''}${r.warn.length ? ` <span class="bad">${esc(r.warn.join('; '))}</span>` : ` <span class="ok">checks ok, ${r.N} tasters</span>`}</td></tr>`).join('')}</tbody></table></div>
        <p class="muted">Panel medians on the IOC 0 to 10 scale. Extra virgin: no defect and some fruit. Virgin: defect up to 3.5. Ordinary virgin: defect above 3.5 up to 6, or no fruit. Lampante: defect above 6. An informal result, not an official certificate.</p>`;
  } else if (tab === 'map') body = flavorMap(e);
  else {
    const items = e.oils.flatMap(o => [...crowd(guestRows(e, o.slot)).comments, ...panelRows(e, o.slot).filter(r => r.comment).map(r => ({ who: r.who + ' (panel)', text: r.comment }))].map(x => ({ ...x, o })));
    body = !items.length ? empty('No comments yet', 'Guests can add notes under "Go deeper" on each glass.') : `<div class="wall">${items.map(i => `<figure><blockquote>${esc(i.text)}</blockquote><figcaption>${esc(i.who)} on ${esc(oilName(e, i.o.slot))}</figcaption></figure>`).join('')}</div>`;
  }
  return `<section class="hero small"><p class="eyebrow">Results</p><h1>${esc(e.name)}</h1></section>
  <div class="kpis"><div><b>${g}</b><span>guest cards</span></div><div><b>${p}</b><span>panel sheets</span></div><div><b>${e.oils.length}</b><span>oils</span></div></div>
  <label class="switch"><input type="checkbox" id="reveal" ${e.reveal ? 'checked' : ''}><span class="track"></span><span>Reveal oil names</span></label>
  <div class="seg" role="tablist">${tabs.map(([k, l]) => `<button role="tab" aria-selected="${tab === k}" class="${tab === k ? 'on' : ''}" data-rtab="${k}">${l}</button>`).join('')}</div>
  ${body}
  ${e.sheet && !e.remote ? `<h2 class="sec">Google Sheet</h2><div class="row wrap gap"><button class="btn primary" id="pullSheet">Get new cards from the sheet</button><button class="btn" id="pushAll">Send all cards to the sheet</button></div><p class="muted">Cards from guests' phones arrive in the sheet on their own. Opening Results also checks for new ones.</p>` : ''}
  <h2 class="sec">Take it with you</h2>
  <div class="row wrap gap"><button class="btn" id="csvBtn">Spreadsheet (CSV)</button><button class="btn" id="obsBtn">Obsidian cards (.zip)</button><button class="btn ghost" id="backupBtn">Backup</button><button class="btn ghost" id="importBtn">Import</button></div>`;
}
const empty = (t, s) => `<div class="empty"><strong>${esc(t)}</strong><span>${esc(s)}</span></div>`;
function flavorMap(e) {
  const pts = e.oils.map(o => ({ o, c: crowd(guestRows(e, o.slot)), r: ioc(panelRows(e, o.slot)) })).filter(x => x.c.n || x.r);
  if (!pts.length) return empty('Nothing to map yet', 'Scores will place each oil from green to ripe and mild to bold.');
  const W = 640, H = 420, L = 40, R = 20, T = 20, B = 46;
  const raw = pts.map(p => {
    let x = p.c.styleScore; if ((x === null || x === undefined) && p.r && p.r.ftype) x = p.r.ftype === 'green' ? -.6 : .6; if (x === null || x === undefined) x = 0;
    const y = p.r ? (p.r.Mf + p.r.Mb + p.r.Mp) / 30 : ((p.c.fruity ?? 0) + (p.c.bitter ?? 0) + (p.c.pepper ?? 0)) / 9; return { ...p, x, y };
  });
  const maxY = Math.max(.5, ...raw.map(p => p.y)) * 1.12, placed = [];
  let s = `<svg class="map" viewBox="0 0 ${W} ${H}" role="img" aria-label="Flavor map of the oils"><rect x="${L}" y="${T}" width="${W - L - R}" height="${H - T - B}" rx="14" class="map-bg"/>
    <line x1="${(L + W - R) / 2}" y1="${T}" x2="${(L + W - R) / 2}" y2="${H - B}" class="axis"/><line x1="${L}" y1="${(T + H - B) / 2}" x2="${W - R}" y2="${(T + H - B) / 2}" class="axis"/>
    <text x="${L}" y="${H - 18}" class="lbl">Green, grassy</text><text x="${W - R}" y="${H - 18}" text-anchor="end" class="lbl">Ripe, buttery</text>
    <text x="${L - 12}" y="${T + 6}" class="lbl" text-anchor="end" transform="rotate(-90 ${L - 12} ${T + 6})">Bold</text><text x="${L - 12}" y="${H - B}" class="lbl" transform="rotate(-90 ${L - 12} ${H - B})">Mild</text>`;
  for (const p of raw) {
    let px = L + 34 + (p.x + 1) / 2 * (W - L - R - 68), py = (H - B - 22) - p.y / maxY * (H - T - B - 50);
    for (let k = 0; k < 6 && placed.some(([a, b]) => Math.hypot(a - px, b - py) < 46); k++) px += (k % 2 ? -1 : 1) * 48 * (k + 1);
    placed.push([px, py]); const rad = 9 + (p.c.like ? (p.c.like - 1) * 4.5 : 4);
    s += `<g><circle cx="${px}" cy="${py}" r="${rad}" class="dotp ${p.r ? p.r.cls : ''}"/><text x="${px}" y="${py - rad - 5}" text-anchor="middle" class="dlbl">${esc(oilName(e, p.o.slot))}</text></g>`;
  }
  return s + `</svg><p class="muted">Left to right: what guests called green or ripe. Bottom to top: fruit, bitterness and pepper together (panel medians when there is a panel). Bigger dots are better liked. Colors follow the panel grade.</p>`;
}
function renderSetup() {
  const e = ensureEvent(), open = route.open ?? -1;
  return `<section class="hero small"><p class="eyebrow">Oils and tasting</p><h1>Set up</h1></section>
  <div class="stack">
    <label class="field"><span>Tasting name</span><input id="evName" value="${esc(e.name)}" maxlength="60"></label>
    <label class="field"><span>Date</span><input id="evDate" type="date" value="${esc(e.date)}"></label>
    <div class="field"><span>Number of oils</span><div class="stepper"><button class="step" id="minus" aria-label="Fewer oils">−</button><output>${e.oils.length}</output><button class="step" id="plus" aria-label="More oils">+</button></div></div>
  </div>
  <p class="muted">Glass numbers stay on the cards so the tasting is blind. Names show in Results only when you switch on Reveal. Flights are groups of at most four, as the IOC method recommends.</p>
  <ul class="oils">${e.oils.map((o, i) => `<li class="${open === i ? 'open' : ''}">
    <button class="oil-h" data-oil="${i}"><span class="glass">${o.slot}</span><span><strong>${esc(o.name || 'Unnamed oil')}</strong><small>Flight ${flightOf(e, o.slot)}${o.cultivar ? ' · ' + esc(o.cultivar) : ''}${o.region ? ' · ' + esc(o.region) : ''}</small></span><span class="chev" aria-hidden="true">›</span></button>
    ${open === i ? `<div class="oil-b stack" data-oilform="${i}">
      <label class="field"><span>Name</span><input data-k="name" value="${esc(o.name)}" placeholder="e.g. Family grove, early harvest 2026"></label>
      <label class="field"><span>Producer or family</span><input data-k="producer" value="${esc(o.producer)}"></label>
      <label class="field"><span>Region</span><input data-k="region" value="${esc(o.region)}" placeholder="e.g. Messinia, Lesvos, Crete"></label>
      <label class="field"><span>Cultivar</span><select data-k="cultivar"><option value="">Choose</option>${CULTIVARS.map(c => `<option ${o.cultivar === c ? 'selected' : ''}>${esc(c)}</option>`).join('')}</select></label>
      <label class="field"><span>Harvest</span><select data-k="stage"><option value="">Choose</option>${STAGES.map(([v, l]) => `<option value="${v}" ${o.stage === v ? 'selected' : ''}>${l}</option>`).join('')}</select></label>
      <label class="field"><span>Label or certification</span><input data-k="label" value="${esc(o.label)}" placeholder="e.g. PDO Kolymvari, PGI Chania, organic"></label>
      <label class="field"><span>Lot / best-by</span><input data-k="lot" value="${esc(o.lot)}" placeholder="Lot number, harvest, best before"></label>
      <div class="row gap two"><label class="field"><span>Bottle size</span><input data-k="size" value="${esc(o.size)}" placeholder="500 ml"></label><label class="field"><span>Price</span><input data-k="price" value="${esc(o.price)}" placeholder="24 USD"></label></div>
      <label class="field"><span>Blind code <small>shown to guests on their card, so write it on the cup</small></span><input data-k="code" value="${esc(o.code)}" inputmode="numeric" maxlength="6" placeholder="e.g. 318"></label>
      <label class="field"><span>Notes</span><textarea data-k="notes" rows="2">${esc(o.notes)}</textarea></label>
    </div>` : ''}</li>`).join('')}</ul>
  <h2 class="sec">Google Sheet <small>optional</small></h2>
  <div class="stack">
    <p class="muted">Collect every finished card in your own Google Sheet, including cards from guests' phones.</p>
    <label class="field"><span>Web app URL</span><input id="sheetUrl" value="${esc(e.sheet || '')}" placeholder="https://script.google.com/macros/s/…/exec" autocomplete="off" spellcheck="false" inputmode="url"></label>
    ${e.sheet ? (e.sheetOk ? '<p class="sync ok">Connected. New invites will send cards here.</p>' : '<p class="sync">Saved. Press Test to check it.</p>') : ''}
    <div class="row wrap gap"><button class="btn" id="sheetHelp">How to set it up</button>${e.sheet ? '<button class="btn primary" id="testSheet">Test</button>' : ''}</div>
  </div>
  <div class="row wrap gap"><button class="btn danger ghost" id="delEvent">Delete this tasting</button></div>`;
}
function renderHelp() {
  return `<section class="hero small"><p class="eyebrow">How it works</p><h1>Run a tasting</h1></section>
  <div class="prose">
    <h2>One device at the table</h2><p>Set up your oils on the Oils tab, then hand the phone or tablet around. Each guest taps <b>Start a guest card</b>, scores each glass, and taps <b>Next guest</b> when done.</p>
    <h2>Everyone on their own phone</h2><p>On your device, tap <b>Invite phones</b> and let guests scan the code. When they finish, their phone shows <b>Send my scores to the host</b>: you scan their code with your camera, or they text you the link. Opening it adds their card to your results.</p>
    <p class="muted">On iPhone, open these links in Safari on the host phone, the same place you run the app. A home-screen copy of the app keeps its own separate storage.</p>
    <h2>Two kinds of scoring</h2><p><b>Guest cards</b> use plain words: how much you like it, smell strength, green or ripe, bitterness, peppery kick, and whether you'd buy it. <b>Expert panel sheets</b> follow the International Olive Council method: intensity of each defect, fruity, bitter and pungent on a 0 to 10 scale, graded from the panel's medians.</p>
    <h2>With your Obsidian vault</h2><p>In Results, <b>Obsidian cards (.zip)</b> gives you notes in the same format as the Olive Oil Tastings vault. Unzip it into the vault folder and the Tasting Dashboard picks the cards up. Glass 01 links to Oil 01, and so on.</p>
    <h2>Collect cards in a Google Sheet</h2><p>On the Oils tab, connect your own Google Sheet once. Every finished card, including cards from guests' phones, is then added as rows you can sort, chart or share. Results can pull those cards back in, so you see everyone's scores without scanning codes.</p>
    <h2>Your data</h2><p>No account needed. Without a Google Sheet, everything stays in this browser. With one, cards go only to your sheet. Use <b>Backup</b> to move a tasting to another device.</p>
    <p class="muted">Grading follows <a href="https://www.internationaloliveoil.org/wp-content/uploads/2024/07/III-2.2.COI-T20-Doc.-15-REV-11-2024_EN-1.pdf" target="_blank" rel="noopener">COI/T.20/Doc. No 15, Rev. 11 (2024)</a>. Results here are informal, not an official certificate.</p>
  </div>`;
}

// ------------------------------------------------------------------ render + events
function render() {
  const e = ensureEvent();
  $('#brandSub').textContent = e.name;
  const map = { home: renderHome, start: renderStart, card: renderCard, done: renderDone, results: renderResults, setup: renderSetup, help: renderHelp };
  view.innerHTML = (map[route.name] || renderHome)();
  view.dataset.screen = route.name;
  const tab = route.name === 'results' ? 'results' : route.name === 'setup' ? 'setup' : 'home';
  document.querySelectorAll('#tabs button').forEach(b => b.setAttribute('aria-current', b.dataset.tab === tab ? 'page' : 'false'));
  document.body.classList.toggle('in-card', route.name === 'card');
  wire();
}
function currentRec() { const c = db.cards.find(x => x.id === route.card), e = ev(); c.updated = Date.now(); const slot = e.oils[route.idx || 0].slot; return c.s[slot] || (c.s[slot] = {}); }
function wire() {
  view.querySelectorAll('[data-go]').forEach(b => b.addEventListener('click', () => go(b.dataset.go, { type: b.dataset.type })));
  view.querySelectorAll('[data-open]').forEach(b => b.addEventListener('click', () => go('card', { card: b.dataset.open, idx: 0 })));
  const sf = $('#startForm');
  if (sf) { setTimeout(() => $('#who')?.focus(), 50); sf.addEventListener('submit', ev2 => {
    ev2.preventDefault(); const who = $('#who').value.trim(); if (!who) return;
    const c = { id: uid(), eventId: ev().id, type: route.type, taster: who, date: today(), s: {} }; db.cards.push(c); save(); go('card', { card: c.id, idx: 0 });
  }); }
  // scoring
  view.querySelectorAll('.pills').forEach(g => g.addEventListener('click', ev2 => {
    const b = ev2.target.closest('.pill'); if (!b) return; const r = currentRec(), f = g.dataset.field, v = JSON.parse(b.dataset.v);
    if (g.dataset.multi === '1') {
      let arr = r[f] || []; arr = arr.includes(v) ? arr.filter(x => x !== v) : [...arr, v];
      if (f === 'off') { if (v === OFF_CLEAN && arr.includes(OFF_CLEAN)) arr = [OFF_CLEAN]; else arr = arr.filter(x => x !== OFF_CLEAN || v === OFF_CLEAN); }
      if (arr.length) r[f] = arr; else delete r[f];
      g.querySelectorAll('.pill').forEach(p => { const on = arr.includes(JSON.parse(p.dataset.v)); p.classList.toggle('on', on); p.setAttribute('aria-pressed', on); });
    } else {
      if (r[f] === v) delete r[f]; else r[f] = v;
      g.querySelectorAll('.pill').forEach(p => { const on = r[f] === JSON.parse(p.dataset.v); p.classList.toggle('on', on); p.setAttribute('aria-pressed', on); });
    }
    save(); refreshDots();
  }));
  view.querySelectorAll('[data-text]').forEach(t => t.addEventListener('input', () => { const r = currentRec(); if (t.value.trim()) r[t.dataset.text] = t.value; else delete r[t.dataset.text]; save(); }));
  view.querySelectorAll('[data-range]').forEach(inp => inp.addEventListener('input', () => setSlider(inp.dataset.range, +inp.value)));
  view.querySelectorAll('[data-nudge]').forEach(b => b.addEventListener('click', () => { const k = b.dataset.nudge, r = currentRec(); setSlider(k, Math.max(0, Math.min(10, (num(r[k]) ?? 0) + +b.dataset.d))); }));
  view.querySelectorAll('[data-select]').forEach(s => s.addEventListener('change', () => { const r = currentRec(); if (s.value) r[s.dataset.select] = s.value; else { delete r[s.dataset.select]; delete r.other_int; } save(); keepScroll(render); }));
  view.querySelectorAll('[data-step]').forEach(b => b.addEventListener('click', () => {
    const e = ev(), n = (route.idx || 0) + +b.dataset.step; const deep = !!view.querySelector('details.deeper[open]');
    if (n >= e.oils.length) go('done', { card: route.card }); else go('card', { card: route.card, idx: Math.max(0, n), deep });
  }));
  view.querySelectorAll('[data-jump]').forEach(b => b.addEventListener('click', () => go('card', { card: route.card, idx: +b.dataset.jump, deep: !!view.querySelector('details.deeper[open]') })));
  // home
  $('#inviteBtn')?.addEventListener('click', invite);
  $('#newEventBtn')?.addEventListener('click', () => sheet(`<h2>New tasting</h2><form id="nf" class="stack"><label class="field"><span>Name</span><input id="nn" required maxlength="60" placeholder="e.g. Charlotte, November"></label><label class="field"><span>Oils</span><select id="nb"><option value="mine">My 7 bottles (GAEA, Creta Verde, Terra Creta, Agrelos)</option>${ev() ? `<option value="same">Same bottles as ${esc(ev().name)}</option>` : ''}<option value="blank">Start blank</option></select></label><label class="field" id="ncWrap" hidden><span>Number of oils</span><input id="nc" type="number" min="1" max="24" value="7" inputmode="numeric"></label><div class="row end"><button type="button" class="btn ghost" data-close>Cancel</button><button class="btn primary">Create</button></div></form>`,
    s => { s.querySelector('#nn').focus(); const nb = s.querySelector('#nb'); nb.addEventListener('change', () => { s.querySelector('#ncWrap').hidden = nb.value !== 'blank'; }); s.querySelector('#nf').addEventListener('submit', x => { x.preventDefault(); const pick = nb.value, src = pick === 'mine' ? MY_BOTTLES : pick === 'same' ? ev().oils.map(o => ({ ...o })) : null; const e = makeEvent(s.querySelector('#nn').value.trim(), +s.querySelector('#nc').value || 7, src); db.events.push(e); db.active = e.id; save(); closeSheet(); go('setup'); }); }));
  $('#switchBtn')?.addEventListener('click', () => sheet(`<h2>Switch tasting</h2><ul class="list">${db.events.map(x => `<li><button class="li" data-ev="${x.id}"><span><strong>${esc(x.name)}</strong><small>${esc(x.date)} · ${cardsOf(x).length} cards</small></span><span class="chev">›</span></button></li>`).join('')}</ul><div class="row end"><button class="btn ghost" data-close>Close</button></div>`,
    s => s.querySelectorAll('[data-ev]').forEach(b => b.addEventListener('click', () => { db.active = b.dataset.ev; save(); closeSheet(); go('home'); }))));
  $('#sendBtn')?.addEventListener('click', sendScores);
  // results
  view.querySelectorAll('[data-rtab]').forEach(b => b.addEventListener('click', () => { route.tab = b.dataset.rtab; render(); }));
  $('#reveal')?.addEventListener('change', x => { ev().reveal = x.target.checked; save(); keepScroll(render); });
  $('#csvBtn')?.addEventListener('click', () => { const e = ev(); download(`${safe(e.name)}.csv`, new Blob([csvFor(e)], { type: 'text/csv' })); });
  $('#obsBtn')?.addEventListener('click', () => { const e = ev(), cs = cardsOf(e); if (!cs.length) return toast('No cards to export yet');
    download(`${safe(e.name)} Obsidian cards.zip`, zip(cs.map(c => ({ name: `Events/${safe(e.name)}/${c.type === 'guest' ? 'Guests' : 'Panel'}/${safe(c.taster)} (web ${c.id.slice(0, 4)}).md`, text: obsidianNote(e, c) })))); });
  $('#backupBtn')?.addEventListener('click', () => { const e = ev(); download(`${safe(e.name)} backup.json`, new Blob([JSON.stringify({ app: 'olive-tasting', v: 1, event: e, cards: cardsOf(e) }, null, 1)], { type: 'application/json' })); });
  $('#importBtn')?.addEventListener('click', importSheet);
  // setup
  $('#evName')?.addEventListener('input', x => { ev().name = x.target.value || 'My tasting'; save(); $('#brandSub').textContent = ev().name; });
  $('#evDate')?.addEventListener('change', x => { ev().date = x.target.value || today(); save(); });
  $('#minus')?.addEventListener('click', () => changeCount(-1)); $('#plus')?.addEventListener('click', () => changeCount(1));
  view.querySelectorAll('[data-oil]').forEach(b => b.addEventListener('click', () => { const i = +b.dataset.oil; route.open = route.open === i ? -1 : i; keepScroll(render); }));
  view.querySelectorAll('[data-oilform] [data-k]').forEach(inp => inp.addEventListener(inp.tagName === 'SELECT' ? 'change' : 'input', () => {
    const i = +inp.closest('[data-oilform]').dataset.oilform; ev().oils[i][inp.dataset.k] = inp.value; save();
    if (inp.tagName === 'SELECT') keepScroll(render); else { const h = inp.closest('li').querySelector('.oil-h strong'); if (inp.dataset.k === 'name') h.textContent = inp.value || 'Unnamed oil'; }
  }));
  $('#sheetUrl')?.addEventListener('change', x => { const v = x.target.value.trim(), e = ev();
    if (v && !validSheet(v)) { toast('That does not look like an Apps Script web app URL ending in /exec'); return; }
    e.sheet = v || undefined; delete e.sheetOk; save(); keepScroll(render); if (v) toast('Saved. Press Test.'); });
  $('#sheetHelp')?.addEventListener('click', sheetHelp);
  $('#testSheet')?.addEventListener('click', testSheet);
  $('#pullSheet')?.addEventListener('click', () => pullSheet(ev()));
  $('#pushAll')?.addEventListener('click', async () => { const e = ev(), cs = cardsOf(e); const ok = await pushCards(e, cs, true); toast(ok ? `Sent ${cs.length} card${cs.length === 1 ? '' : 's'} and the oil list` : 'Could not reach the Google Sheet'); });
  $('#retrySync')?.addEventListener('click', () => { const c = db.cards.find(x => x.id === route.card); if (c) pushCards(ev(), [c]); });
  $('#delEvent')?.addEventListener('click', () => confirmSheet('Delete this tasting?', `This removes ${ev().name} and its ${cardsOf(ev()).length} cards from this device. Make a backup first if you might need them.`, 'Delete', () => {
    const id = ev().id; db.cards = db.cards.filter(c => c.eventId !== id); db.events = db.events.filter(x => x.id !== id); db.active = null; save(); go('home'); }, true));
}
function keepScroll(fn) { const y = window.scrollY; fn(); window.scrollTo(0, y); }
function setSlider(k, v) {
  const r = currentRec(); r[k] = v; save();
  const inp = view.querySelector(`[data-range="${k}"]`); if (inp) { inp.value = v; inp.closest('.sl').querySelector('output').textContent = f1(v); }
  refreshDots();
}
function refreshDots() { const e = ev(), c = db.cards.find(x => x.id === route.card); if (!c) return; const d = view.querySelector('.dots'); if (d) d.outerHTML = cardNav(e, c, route.idx || 0); view.querySelectorAll('[data-jump]').forEach(b => b.addEventListener('click', () => go('card', { card: route.card, idx: +b.dataset.jump, deep: !!view.querySelector('details.deeper[open]') }))); }
function changeCount(d) {
  const e = ev(), n = e.oils.length + d; if (n < 1 || n > 24) return;
  const used = d < 0 && cardsOf(e).some(c => c.s[e.oils[n].slot] && Object.keys(c.s[e.oils[n].slot]).length);
  const doIt = () => { setOilCount(e, n); save(); keepScroll(render); };
  if (used) confirmSheet(`Remove glass ${e.oils[n].slot}?`, 'Some cards already have scores for this glass. They will be hidden from results.', 'Remove', doIt, true); else doIt();
}
async function shareOrCopy(url, title) {
  if (navigator.share) { try { await navigator.share({ title, url }); return; } catch (e) { if (e && e.name === 'AbortError') return; } }
  try { await navigator.clipboard.writeText(url); toast('Link copied'); } catch (e) { toast('Copy the link from the box'); }
}
async function invite() {
  const e = ev(), url = await joinLink(e);
  sheet(`<h2>Invite phones</h2><p>Guests scan this with their camera to get a blank card for <b>${esc(e.name)}</b>. Oil names are not shared.</p><div class="qr">${qrSvg(url)}</div><input class="linkbox" readonly value="${esc(url)}" aria-label="Invite link"><div class="row end"><button class="btn ghost" data-close>Done</button><button class="btn primary" id="shareInv">Share link</button></div>`,
    s => s.querySelector('#shareInv').addEventListener('click', () => shareOrCopy(url, 'Join ' + e.name)));
}
async function sendScores() {
  const e = ev(), c = db.cards.find(x => x.id === route.card), url = await resultLink(e, c);
  sheet(`<h2>Send to the host</h2><p>Let the host scan this code, or share the link with them by text.</p><div class="qr">${qrSvg(url)}</div><input class="linkbox" readonly value="${esc(url)}" aria-label="Your scores link"><div class="row end"><button class="btn ghost" data-close>Done</button><button class="btn primary" id="shareRes">Share link</button></div>`,
    s => s.querySelector('#shareRes').addEventListener('click', () => shareOrCopy(url, `${c.taster}'s olive oil scores`)));
}
function importSheet() {
  sheet(`<h2>Import</h2><p>Paste a guest's scores link, or choose a backup file.</p><form id="pf" class="stack"><label class="field"><span>Scores link</span><input id="pl" placeholder="https://…#r=…" autocomplete="off"></label><button class="btn primary">Add scores</button></form><div class="or">or</div><label class="btn wide filebtn">Choose a backup file<input type="file" id="pfile" accept=".json,application/json" hidden></label><div class="row end"><button class="btn ghost" data-close>Close</button></div>`, s => {
    s.querySelector('#pf').addEventListener('submit', async x => { x.preventDefault(); const v = s.querySelector('#pl').value.trim(); const i = v.indexOf('#'); if (i < 0) return toast('That is not a scores link'); closeSheet(); location.hash = v.slice(i); await handleHash(); });
    s.querySelector('#pfile').addEventListener('change', async x => {
      try { const d = JSON.parse(await x.target.files[0].text()); if (d.app !== 'olive-tasting') throw 0;
        const i = db.events.findIndex(y => y.id === d.event.id); if (i >= 0) db.events[i] = d.event; else db.events.push(d.event);
        for (const c of d.cards) { const j = db.cards.findIndex(y => y.id === c.id); if (j >= 0) db.cards[j] = c; else db.cards.push(c); }
        db.active = d.event.id; save(); closeSheet(); toast(`Imported ${d.event.name}`); go('results');
      } catch (e) { toast('That file is not an Olive Tasting backup'); }
    });
  });
}
document.querySelectorAll('#tabs button').forEach(b => b.addEventListener('click', () => go(b.dataset.tab)));
$('#homeBtn').addEventListener('click', () => go('home'));
$('#helpBtn').addEventListener('click', () => go('help'));
document.addEventListener('keydown', x => { if (x.key === 'Escape' && !$('#sheet').hidden) closeSheet(); });
window.addEventListener('hashchange', handleHash);
render();
handleHash();
retryPending();
if ('serviceWorker' in navigator && location.protocol === 'https:') navigator.serviceWorker.register('sw.js').catch(() => {});
window.__olive = { db: () => db, ioc, crowd };
})();
