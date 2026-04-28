const fs = require('fs');
let html = fs.readFileSync('C:/Users/so/aram/index.html', 'utf8');
let ok = 0, fail = 0;

function rep(old, nw, label) {
  const cnt = html.split(old).length - 1;
  if (cnt !== 1) { console.error('FAIL(' + cnt + '):', label); fail++; return false; }
  html = html.split(old).join(nw);
  console.log('OK:', label);
  ok++;
  return true;
}

// ─── 1. CSS: .s-icon + .ms-item-icon 개선 ──────────────────────────────────
rep(
  '.ms-item-icon{font-size:12px;}',
  '.ms-item-icon{font-size:15px;vertical-align:middle;line-height:1;}\r\n.s-icon{width:1em;height:1em;display:inline-block;vertical-align:middle;flex-shrink:0;overflow:visible;}',
  'add .s-icon CSS + bump ms-item-icon'
);

// ─── 2. ITEM_SVG_ICONS 객체 삽입 (SHOP_ITEMS 바로 앞) ──────────────────────
const iconDefs =
'// ── SVG 아이콘 레지스트리 — 아이템 추가 시 여기에 id: _si(path) 형태로 추가 ──\r\n' +
'function _si(d){return\'<svg class="s-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">\'+d+\'</svg>\';}\r\n' +
'const ITEM_SVG_ICONS = {\r\n' +
'  // S0\r\n' +
'  score2x:        _si(\'<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>\'),\r\n' +
'  insurance:      _si(\'<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/>\'),\r\n' +
'  gamble:         _si(\'<rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="8.5" cy="8.5" r="1.3" fill="currentColor" stroke="none"/><circle cx="15.5" cy="8.5" r="1.3" fill="currentColor" stroke="none"/><circle cx="12" cy="12" r="1.3" fill="currentColor" stroke="none"/><circle cx="8.5" cy="15.5" r="1.3" fill="currentColor" stroke="none"/><circle cx="15.5" cy="15.5" r="1.3" fill="currentColor" stroke="none"/>\'),\r\n' +
'  // S1\r\n' +
'  s1_promo_shield: _si(\'<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><line x1="9" y1="12" x2="15" y2="12"/>\'),\r\n' +
'  s1_promo_win:   _si(\'<polyline points="2 20 4 10 8 14 12 6 16 14 20 10 22 20"/><line x1="2" y1="20" x2="22" y2="20"/>\'),\r\n' +
'  s1_gamble:      _si(\'<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none"/>\'),\r\n' +
'};\r\n\r\n';

rep(
  '// ── 아이템 정의 ──────────────────────────────────────────────\r\nconst SHOP_ITEMS = [',
  '// ── 아이템 정의 ──────────────────────────────────────────────\r\n' + iconDefs + 'const SHOP_ITEMS = [',
  'insert ITEM_SVG_ICONS'
);

// ─── 3. SHOP_ITEMS 아이콘 → ITEM_SVG_ICONS 참조 ────────────────────────────
rep(
  "{ id:'score2x',   icon:'💫', name:'승점 2배권'",
  "{ id:'score2x',   icon:ITEM_SVG_ICONS.score2x,   name:'승점 2배권'",
  'score2x ref'
);
rep(
  "{ id:'insurance', icon:'🔰', name:'패배 방어권'",
  "{ id:'insurance', icon:ITEM_SVG_ICONS.insurance,  name:'패배 방어권'",
  'insurance ref'
);
rep(
  "{ id:'gamble',    icon:'🎰', name:'도박 주사위'",
  "{ id:'gamble',    icon:ITEM_SVG_ICONS.gamble,     name:'도박 주사위'",
  'gamble ref'
);

// ─── 4. S1_SHOP_ITEMS 아이콘 → ITEM_SVG_ICONS 참조 ────────────────────────
rep(
  "{ id:'s1_promo_shield', icon:'💠', name:'승급전 방어권'",
  "{ id:'s1_promo_shield', icon:ITEM_SVG_ICONS.s1_promo_shield, name:'승급전 방어권'",
  's1_promo_shield ref'
);
rep(
  "{ id:'s1_promo_win',    icon:'👑', name:'승급전 승리권'",
  "{ id:'s1_promo_win',    icon:ITEM_SVG_ICONS.s1_promo_win,    name:'승급전 승리권'",
  's1_promo_win ref'
);
rep(
  "{ id:'s1_gamble',       icon:'🃏', name:'도박권'",
  "{ id:'s1_gamble',       icon:ITEM_SVG_ICONS.s1_gamble,       name:'도박권'",
  's1_gamble ref'
);

// ─── 5. ITEM_ICONS → ITEM_SVG_ICONS 참조 ──────────────────────────────────
rep(
  "const ITEM_ICONS = { score2x: '💫', insurance: '🔰', gamble: '🎰', s1_gamble: '🃏', s1_promo_win: '👑', s1_promo_shield: '💠' };",
  'const ITEM_ICONS = ITEM_SVG_ICONS;',
  'ITEM_ICONS → ITEM_SVG_ICONS'
);

fs.writeFileSync('C:/Users/so/aram/index.html', html, 'utf8');
console.log('\nok:', ok, 'fail:', fail);
