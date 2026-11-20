/**
 * Olive Tasting -> Google Sheet
 * Paste this into Extensions > Apps Script of your Google Sheet, then
 * Deploy > New deployment > Web app (Execute as: Me, Who has access: Anyone).
 * Copy the Web app URL (it ends in /exec) into the app under Oils > Google Sheet.
 *
 * Tabs it creates:
 *   Cards  one row per guest per glass, ready for pivot tables and charts
 *   Oils   the host's bottle list, so glass numbers can be matched to names
 *   Raw    one row per card, used by the app to pull everyone's cards back in
 */
var HEAD = ['received', 'event', 'date', 'glass', 'oil', 'cup_code', 'taster_type', 'taster',
  'like_1_5', 'aroma_0_3', 'style', 'bitter_0_3', 'pepper_0_3', 'buy', 'body_1_3', 'finish_1_3',
  'fruity_0_10', 'fruity_type', 'bitter_0_10', 'pungent_0_10',
  'fusty', 'musty', 'winey', 'acid', 'frost', 'rancid', 'other', 'other_int',
  'flavors', 'off', 'pair', 'comment', 'event_id', 'card_id'];
var OIL_HEAD = ['event_id', 'event', 'glass', 'cup_code', 'oil', 'producer', 'region', 'cultivar', 'label', 'lot', 'size', 'price', 'updated'];
var RAW_HEAD = ['card_id', 'event_id', 'updated', 'card_json'];

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    var d = JSON.parse(e.postData.contents);
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var ev = d.event || {};
    if (d.oils && d.oils.length) writeOils_(ss, ev, d.oils);
    var cards = d.cards || [];
    for (var i = 0; i < cards.length; i++) writeCard_(ss, ev, cards[i]);
    return out_({ ok: true, cards: cards.length });
  } catch (err) {
    return out_({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

function doGet(e) {
  var p = (e && e.parameter) || {};
  if (!p.event) return out_({ ok: true, app: 'olive-tasting' });
  var raw = tab_(SpreadsheetApp.getActiveSpreadsheet(), 'Raw', RAW_HEAD);
  var vals = raw.getDataRange().getValues(), cards = [];
  for (var i = 1; i < vals.length; i++) {
    if (String(vals[i][1]) === String(p.event)) { try { cards.push(JSON.parse(vals[i][3])); } catch (x) {} }
  }
  return out_({ ok: true, cards: cards });
}

function writeCard_(ss, ev, c) {
  var now = new Date();
  // Raw: one row per card (upsert)
  var raw = tab_(ss, 'Raw', RAW_HEAD), rv = raw.getDataRange().getValues(), found = 0;
  for (var i = 1; i < rv.length; i++) {
    if (String(rv[i][0]) === String(c.id)) { raw.getRange(i + 1, 1, 1, 4).setValues([[c.id, ev.id, now, JSON.stringify(c.json)]]); found = 1; break; }
  }
  if (!found) raw.appendRow([c.id, ev.id, now, JSON.stringify(c.json)]);
  // Cards: replace this card's rows
  var sh = tab_(ss, 'Cards', HEAD), v = sh.getDataRange().getValues(), idCol = HEAD.indexOf('card_id');
  for (var r = v.length - 1; r >= 1; r--) if (String(v[r][idCol]) === String(c.id)) sh.deleteRow(r + 1);
  var names = oilNames_(ss, ev.id), rows = [];
  (c.rows || []).forEach(function (row) {
    var o = {}; HEAD.forEach(function (h) { o[h] = ''; });
    for (var k in row) if (k in o) o[k] = row[k];
    o.received = now; o.event = ev.name || ''; o.date = ev.date || ''; o.event_id = ev.id || ''; o.card_id = c.id;
    var known = names[String(row.glass)];
    if (!o.oil && known) o.oil = known.oil;
    if (!o.cup_code && known) o.cup_code = known.code;
    rows.push(HEAD.map(function (h) { return o[h]; }));
  });
  if (rows.length) sh.getRange(sh.getLastRow() + 1, 1, rows.length, HEAD.length).setValues(rows);
}

function writeOils_(ss, ev, oils) {
  var sh = tab_(ss, 'Oils', OIL_HEAD), v = sh.getDataRange().getValues(), now = new Date();
  for (var r = v.length - 1; r >= 1; r--) if (String(v[r][0]) === String(ev.id)) sh.deleteRow(r + 1);
  var rows = oils.map(function (o) {
    return [ev.id, ev.name || '', "'" + o.slot, o.code || '', o.name || '', o.producer || '', o.region || '', o.cultivar || '', o.label || '', o.lot || '', o.size || '', o.price || '', now];
  });
  if (rows.length) sh.getRange(sh.getLastRow() + 1, 1, rows.length, OIL_HEAD.length).setValues(rows);
  // Fill bottle names into cards that arrived from guests' phones before the host sent the list
  var names = oilNames_(ss, ev.id), cs = tab_(ss, 'Cards', HEAD), cv = cs.getDataRange().getValues();
  var eCol = HEAD.indexOf('event_id'), gCol = HEAD.indexOf('glass'), oCol = HEAD.indexOf('oil'), kCol = HEAD.indexOf('cup_code');
  for (var i = 1; i < cv.length; i++) {
    if (String(cv[i][eCol]) !== String(ev.id)) continue;
    var n = names[glassKey_(cv[i][gCol])]; if (!n) continue;
    if (cv[i][oCol] !== n.oil) cs.getRange(i + 1, oCol + 1).setValue(n.oil);
    if (!cv[i][kCol] && n.code) cs.getRange(i + 1, kCol + 1).setValue(n.code);
  }
}

function oilNames_(ss, eventId) {
  var sh = ss.getSheetByName('Oils'), map = {};
  if (!sh) return map;
  var v = sh.getDataRange().getValues();
  for (var i = 1; i < v.length; i++) if (String(v[i][0]) === String(eventId)) map[glassKey_(v[i][2])] = { oil: v[i][4], code: v[i][3] };
  return map;
}
function glassKey_(g) { var s = String(g).replace(/^'/, ''); return s.length < 2 ? ('0' + s) : s; }

function tab_(ss, name, head) {
  var sh = ss.getSheetByName(name);
  if (!sh) {
    sh = ss.insertSheet(name);
    sh.getRange(1, 1, 1, head.length).setValues([head]).setFontWeight('bold');
    sh.setFrozenRows(1);
    if (name === 'Cards') sh.getRange('D:D').setNumberFormat('@');
  }
  return sh;
}

function out_(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}
