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

// ══════════════════════════════════════════════════════════════
// 1. CSS 추가
// ══════════════════════════════════════════════════════════════
const newCss = [
  '#shop-panels{display:flex;gap:10px;align-items:flex-start;}',
  '@media(max-width:500px){#shop-panels{flex-direction:column;}}',
  '.sp-panel{background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:14px;flex:1;min-width:0;}',
  ".sp-header{font-family:'Black Han Sans',sans-serif;font-size:13px;letter-spacing:1px;color:var(--gold);margin-bottom:12px;padding-bottom:8px;border-bottom:1px solid rgba(200,155,60,0.2);}",
  '.sli{display:flex;align-items:center;gap:10px;padding:10px;background:var(--surface2);border:1px solid var(--border);border-radius:8px;margin-bottom:7px;transition:border-color 0.15s;}',
  '.sli:last-child{margin-bottom:0;}',
  '.sli:hover{border-color:rgba(200,155,60,0.35);}',
  '.sli-icon{width:44px;height:44px;display:flex;align-items:center;justify-content:center;font-size:26px;border-radius:8px;background:rgba(255,255,255,0.04);flex-shrink:0;}',
  '.sli-info{flex:1;min-width:0;}',
  '.sli-name{font-size:12px;font-weight:700;margin-bottom:3px;}',
  '.sli-desc{font-size:10px;color:var(--text-dim);line-height:1.4;}',
  '.sli-right{display:flex;flex-direction:column;align-items:flex-end;gap:5px;flex-shrink:0;}',
  ".sli-price{padding:5px 10px;border-radius:6px;border:none;background:linear-gradient(135deg,#a07828,var(--gold));color:#0a0e1a;font-family:'Noto Sans KR',sans-serif;font-weight:700;font-size:11px;cursor:pointer;white-space:nowrap;transition:all 0.15s;}",
  '.sli-price:disabled{opacity:0.4;cursor:not-allowed;}',
  '.sli-price:hover:not(:disabled){transform:translateY(-1px);box-shadow:0 3px 8px rgba(200,155,60,0.35);}',
  '.sli-owned{font-size:9px;color:var(--green);background:rgba(0,199,122,0.12);border:1px solid rgba(0,199,122,0.35);border-radius:6px;padding:2px 6px;text-align:center;}',
  '.inv-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:6px;}',
  '.inv-slot{aspect-ratio:1;background:rgba(255,255,255,0.025);border:1px solid rgba(255,255,255,0.07);border-radius:8px;display:flex;flex-direction:column;align-items:center;justify-content:center;cursor:pointer;transition:all 0.15s;position:relative;padding:6px 3px 4px;gap:3px;}',
  '.inv-slot:not(.inv-slot-empty):not(.inv-locked):hover{border-color:rgba(200,155,60,0.5);background:rgba(200,155,60,0.07);transform:translateY(-1px);}',
  '.inv-slot-empty{border-style:dashed;border-color:rgba(255,255,255,0.05);cursor:default;}',
  '.inv-slot.inv-active{border-color:rgba(0,199,122,0.55);background:rgba(0,199,122,0.08);box-shadow:0 0 8px rgba(0,199,122,0.15);}',
  '.inv-slot.inv-locked{opacity:0.55;cursor:not-allowed;}',
  '.inv-slot-icon{font-size:24px;line-height:1;}',
  '.inv-slot-name{font-size:8px;color:var(--text-dim);text-align:center;line-height:1.2;word-break:keep-all;}',
  '.inv-slot-dot{position:absolute;top:4px;right:4px;width:5px;height:5px;border-radius:50%;background:var(--green);}',
].join('\n');

rep(
  '.my-item-use-btn:hover{background:rgba(0,199,122,0.2);}',
  '.my-item-use-btn:hover{background:rgba(0,199,122,0.2);}\n' + newCss,
  'add new shop layout CSS'
);

// ══════════════════════════════════════════════════════════════
// 2. tab-achievement HTML — 출석체크 카드 추가
// ══════════════════════════════════════════════════════════════
rep(
  '<!-- ===== TAB: 상점 ===== -->\n<div id="tab-achievement" class="tab-content">\n  <div class="card">\n    <div class="card-title" id="achievement-card-title">🏅 업적</div>\n    <div id="achievement-content"></div>\n  </div>\n</div>',
  '<!-- ===== TAB: 패스/업적 ===== -->\n<div id="tab-achievement" class="tab-content">\n  <div class="card" id="attend-card" style="display:none;">\n    <div class="card-title">출석 체크</div>\n    <div id="attend-content"></div>\n  </div>\n  <div class="card">\n    <div class="card-title" id="achievement-card-title">🏅 업적</div>\n    <div id="achievement-content"></div>\n  </div>\n</div>',
  'move attend-card to achievement tab'
);

// ══════════════════════════════════════════════════════════════
// 3. tab-shop HTML — 2패널 레이아웃으로 교체
// ══════════════════════════════════════════════════════════════
const oldShop = '<div id="tab-shop" class="tab-content">\n  <div class="card" id="attend-card" style="display:none;">\n    <div class="card-title">출석 체크</div>\n    <div id="attend-content"></div>\n  </div>\n  <div class="card">\n    <div class="card-title">아이템 상점</div>\n    <div id="shop-no-user" style="text-align:center;padding:20px;color:var(--text-dim);font-size:13px;">\n      위의 <strong style="color:var(--gold)">내 닉네임</strong>을 먼저 선택해주세요!\n    </div>\n    <div id="shop-content" style="display:none;">\n      <div class="shop-grid" id="shop-grid"></div>\n    </div>\n  </div>\n  <div class="card" id="my-items-card" style="display:none;">\n    <div class="card-title">내 아이템</div>\n    <!-- 잠금 배너 -->\n    <div class="item-lock-banner" id="item-lock-banner">\n      <div class="item-lock-icon">🔒</div>\n      <div class="item-lock-text">\n        <strong style="color:var(--red)">팀 구성이 완료됐어요!</strong><br>\n        아이템 변경이 잠겼어요. 경기 저장 후 자동으로 해제됩니다.\n      </div>\n    </div>\n    <div id="my-items-list"></div>\n  </div>\n</div>';

const newShop = '<div id="tab-shop" class="tab-content">\n  <div id="shop-no-user" style="text-align:center;padding:28px 20px;color:var(--text-dim);font-size:13px;">\n    위의 <strong style="color:var(--gold)">내 닉네임</strong>을 먼저 선택해주세요!\n  </div>\n  <div id="shop-panels" style="display:none;">\n    <div class="sp-panel">\n      <div class="sp-header">아이템 상점</div>\n      <div id="shop-list"></div>\n    </div>\n    <div class="sp-panel">\n      <div class="sp-header">인벤토리</div>\n      <div class="item-lock-banner" id="item-lock-banner">\n        <div class="item-lock-icon">🔒</div>\n        <div class="item-lock-text">\n          <strong style="color:var(--red)">팀 구성이 완료됐어요!</strong><br>\n          아이템 변경이 잠겼어요. 경기 저장 후 자동으로 해제됩니다.\n        </div>\n      </div>\n      <div class="inv-grid" id="inv-grid"></div>\n    </div>\n  </div>\n</div>';

rep(oldShop, newShop, 'replace tab-shop with 2-panel layout');

// ══════════════════════════════════════════════════════════════
// 4. renderShop() — 인덱스 기반 교체
// ══════════════════════════════════════════════════════════════
const shopFnStart = html.indexOf('function renderShop() {');
const shopFnEnd   = html.indexOf('\n// 아이템 구매\n// 아이템 상점 ? 툴팁 토글');
if (shopFnStart < 0 || shopFnEnd < 0) {
  console.error('FAIL: renderShop boundaries not found', shopFnStart, shopFnEnd);
  fail++;
} else {
  const newFn = `function renderShop() {
  const noUser  = document.getElementById('shop-no-user');
  const panels  = document.getElementById('shop-panels');
  if (!myName) {
    noUser.style.display='block'; panels.style.display='none'; return;
  }
  noUser.style.display='none'; panels.style.display='flex';
  const myGold  = getMyGold();
  const myItems = getMyItems();

  // 잠금 배너
  const lockBanner = document.getElementById('item-lock-banner');
  if (lockBanner) lockBanner.classList.toggle('show', itemsLocked);

  // ── 상점 리스트 ─────────────────────────────────────────
  const _shopList = CURRENT_SEASON >= 1 ? S1_SHOP_ITEMS : SHOP_ITEMS;
  document.getElementById('shop-list').innerHTML = _shopList.map(item => {
    const owned    = myItems.filter(i=>i.id===item.id).length;
    const canBuy   = myGold >= item.price && !itemsLocked;
    const nameColor = item.color || 'var(--text)';
    return \`<div class="sli">
      <div class="sli-icon" style="color:\${nameColor};">\${item.icon}</div>
      <div class="sli-info">
        <div class="sli-name" style="color:\${nameColor};">\${item.name}</div>
        <div class="sli-desc">\${item.desc}</div>
      </div>
      <div class="sli-right">
        <button class="sli-price" \${!canBuy?'disabled':''} onclick="buyItem('\${item.id}')">
          \${itemsLocked?'🔒':\`\\\`🪙\${item.price}G\\\`\`}
        </button>
        \${owned>0?\`<div class="sli-owned">보유 \${owned}개</div>\`:''}
        <button class="shop-item-help-btn" data-tip="item_\${item.id}">?</button>
      </div>
    </div>\`;
  }).join('');

  // ── 인벤토리 그리드 ──────────────────────────────────────
  const SLOT_CNT = Math.max(myItems.length + 4, 8);
  const allDefs  = [...SHOP_ITEMS, ...S1_SHOP_ITEMS];
  const slots = [];
  for (let i = 0; i < SLOT_CNT; i++) {
    const item = myItems[i];
    if (!item) { slots.push('<div class="inv-slot inv-slot-empty"></div>'); continue; }
    const def = allDefs.find(s=>s.id===item.id);
    if (!def)  { slots.push('<div class="inv-slot inv-slot-empty"></div>'); continue; }
    const isActive   = !!item.active;
    const nameColor  = def.color || 'var(--text)';
    const lockedCls  = itemsLocked ? ' inv-locked' : '';
    const clickAttr  = itemsLocked ? '' : \`onclick="toggleItemActive(\${i})"\`;
    slots.push(\`<div class="inv-slot\${isActive?' inv-active':''}\${lockedCls}" \${clickAttr} title="\${def.name}">
      \${isActive?'<div class="inv-slot-dot"></div>':''}
      <div class="inv-slot-icon" style="color:\${nameColor};">\${def.icon}</div>
      <div class="inv-slot-name">\${def.name}</div>
    </div>\`);
  }
  document.getElementById('inv-grid').innerHTML = slots.join('');
}`;
  html = html.slice(0, shopFnStart) + newFn + html.slice(shopFnEnd);
  console.log('OK: renderShop rewritten (index-based)');
  ok++;
}

// ══════════════════════════════════════════════════════════════
// 5. renderAchievementsOrPass — renderAttendance() 추가
// ══════════════════════════════════════════════════════════════
rep(
  'window.renderAchievementsOrPass = function renderAchievementsOrPass() {\n  if (CURRENT_SEASON >= 1) renderS1Pass();',
  'window.renderAchievementsOrPass = function renderAchievementsOrPass() {\n  renderAttendance();\n  if (CURRENT_SEASON >= 1) renderS1Pass();',
  'renderAchievementsOrPass + renderAttendance'
);

fs.writeFileSync('C:/Users/so/aram/index.html', html, 'utf8');
console.log('\nok:', ok, 'fail:', fail);
