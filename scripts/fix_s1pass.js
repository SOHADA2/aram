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

// LV3: 관전자 퀘스트 → 딜러 입문 (한 경기 딜량 10,000 이상)
rep(
  "{ lv:3,  icon:'👁️',  name:'관찰 시작',       desc:'관전자로 1경기 참여',                  check:s=>s.specTotal>=1,         prog:s=>[Math.min(s.specTotal,1),1] },",
  "{ lv:3,  icon:'🗡️',  name:'딥러 입문',       desc:'한 경기에서 딥량 10,000 이상',              check:s=>s.maxDamage>=10000,      prog:s=>[Math.min(s.maxDamage,10000).toLocaleString(),'10,000'] },",
  'LV3: 관찰 시작 → 딜러 입문'
);

// LV13: 족집게 관전 → 불사조 (한 경기 데스 없이 승리)
rep(
  "{ lv:13, icon:'🔮',  name:'족집게 관전',     desc:'관전자 예측 1회 적중',                 check:s=>s.specCorrect>=1,        prog:s=>[Math.min(s.specCorrect,1),1] },",
  "{ lv:13, icon:'💀',  name:'불사조',         desc:'한 경기 데스 없이 승리',                 check:s=>s.perfectWin,            prog:null },",
  'LV13: 족집게 관전 → 불사조'
);

// Version bump
rep("const APP_VERSION = 'v2.31.55';", "const APP_VERSION = 'v2.31.56';", 'version bump');

fs.writeFileSync('C:/Users/so/aram/index.html', html, 'utf8');
console.log('\nok:', ok, 'fail:', fail);
