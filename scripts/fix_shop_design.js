const fs = require('fs');
let html = fs.readFileSync('C:/Users/so/aram/index.html', 'utf8');
let ok = 0, fail = 0;

function rep(old, nw, label) {
  const cnt = html.split(old).length - 1;
  if (cnt !== 1) { console.error('FAIL(' + cnt + '):', label); fail++; return false; }
  html = html.replace(old, nw);
  console.log('OK:', label);
  ok++;
  return true;
}

// ─── 1. attend-done CSS 재디자인 ─────────────────────────────────
rep(
  '.attend-done{flex-shrink:0;padding:10px 18px;border-radius:8px;border:1px solid rgba(0,199,122,0.4);background:rgba(0,199,122,0.08);color:var(--green);font-family:\'Black Han Sans\',sans-serif;font-size:12px;letter-spacing:1px;}',
  '.attend-done{flex-shrink:0;padding:9px 20px;border-radius:30px;border:1.5px solid rgba(0,199,122,0.55);background:linear-gradient(135deg,rgba(0,199,122,0.2),rgba(0,199,122,0.07));color:#00e68a;font-family:\'Black Han Sans\',sans-serif;font-size:11px;letter-spacing:2.5px;box-shadow:0 0 14px rgba(0,199,122,0.22),inset 0 1px 0 rgba(255,255,255,0.07);text-shadow:0 0 8px rgba(0,199,122,0.65);}',
  'attend-done CSS redesign'
);

// ─── 2. attend-done HTML: ✅ → ✓ (깔끔하게) ────────────────────
rep(
  '? `<div class="attend-done">✅ 출석 완료</div>`',
  '? `<div class="attend-done">✓ 출석 완료</div>`',
  'attend-done emoji cleanup'
);

// ─── 3. S0 아이템 아이콘 업그레이드 ─────────────────────────────
// score2x: ⚡ → 💫
rep(
  "{ id:'score2x',   icon:'⚡', name:'승점 2배권'",
  "{ id:'score2x',   icon:'💫', name:'승점 2배권'",
  'score2x icon'
);

// insurance: 🛡️ → 🔰
rep(
  "{ id:'insurance', icon:'🛡️', name:'패배 방어권'",
  "{ id:'insurance', icon:'🔰', name:'패배 방어권'",
  'insurance icon'
);

// gamble (S0): 🎲 → 🎰
rep(
  "{ id:'gamble',    icon:'🎲', name:'도박 주사위'",
  "{ id:'gamble',    icon:'🎰', name:'도박 주사위'",
  'gamble S0 icon'
);

// ─── 4. S1 아이템 아이콘 업그레이드 ─────────────────────────────
// s1_promo_shield: 🛡️ → 💠
rep(
  "{ id:'s1_promo_shield', icon:'🛡️', name:'승급전 방어권'",
  "{ id:'s1_promo_shield', icon:'💠', name:'승급전 방어권'",
  's1_promo_shield icon'
);

// s1_promo_win: ⚔️ → 👑
rep(
  "{ id:'s1_promo_win',    icon:'⚔️', name:'승급전 승리권'",
  "{ id:'s1_promo_win',    icon:'👑', name:'승급전 승리권'",
  's1_promo_win icon'
);

// s1_gamble: 🎲 → 🃏
rep(
  "{ id:'s1_gamble',       icon:'🎲', name:'도박권'",
  "{ id:'s1_gamble',       icon:'🃏', name:'도박권'",
  's1_gamble icon'
);

// ─── 5. ITEM_ICONS / ITEM_NAMES 도 동기화 ────────────────────────
rep(
  "const ITEM_ICONS = { score2x: '⚡', insurance: '🛡️', gamble: '🎲', s1_gamble: '🎲', s1_promo_win: '⚔️', s1_promo_shield: '🛡️' };",
  "const ITEM_ICONS = { score2x: '💫', insurance: '🔰', gamble: '🎰', s1_gamble: '🃏', s1_promo_win: '👑', s1_promo_shield: '💠' };",
  'ITEM_ICONS sync'
);

fs.writeFileSync('C:/Users/so/aram/index.html', html, 'utf8');
console.log('\nok:', ok, 'fail:', fail);
