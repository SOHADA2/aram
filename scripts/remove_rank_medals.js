// 챌린저 없을 때 1등/2등/3등 메달·순위 숫자 숨기고 티어만 표시
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

// ── 1. renderS1HeroCard — hasChallenger 파라미터 추가 ─────────────────────
rep(
  `function renderS1HeroCard(r, place) {
  const medal  = place===1?'🥇':place===2?'🥈':'🥉';
  const cls    = place===1?'first':place===2?'second':'third';
  const meCls  = r.me ? ' me' : '';
  const chips  = renderRankClassChips(r.champTier1, r.champTier2);
  return \`<div class="rk-hero \${cls}\${meCls}" data-name="\${escHtml(r.name)}" style="cursor:pointer;">
    <div class="glow"></div><div class="hatch"></div>
    <div class="rk-hero-top">
      <div class="rk-hero-top-left"><span class="rk-medal">\${medal}</span>\${r.me?renderRankMeTag(false):''}</div>
      <div>\${s1TierBadgeHtml(r.tier, place===1?'big':'mid')}</div>
    </div>`,
  `function renderS1HeroCard(r, place, hasChallenger) {
  const medal  = hasChallenger ? (place===1?'🥇':place===2?'🥈':'🥉') : '';
  const cls    = place===1?'first':place===2?'second':'third';
  const meCls  = r.me ? ' me' : '';
  const chips  = renderRankClassChips(r.champTier1, r.champTier2);
  return \`<div class="rk-hero \${cls}\${meCls}" data-name="\${escHtml(r.name)}" style="cursor:pointer;">
    <div class="glow"></div><div class="hatch"></div>
    <div class="rk-hero-top">
      <div class="rk-hero-top-left">\${medal?'<span class="rk-medal">'+medal+'</span>':''}\${r.me?renderRankMeTag(false):''}</div>
      <div>\${s1TierBadgeHtml(r.tier, place===1?'big':'mid')}</div>
    </div>`,
  'renderS1HeroCard signature + medal conditional'
);

// ── 2. renderS1HeroCard — 이름 gold shimmer 조건부 ──────────────────────
rep(
  `    <div class="rk-hero-name\${place===1?' rk-name-gold':''}">\${escHtml(r.name)}</div>`,
  `    <div class="rk-hero-name\${hasChallenger&&place===1?' rk-name-gold':''}">\${escHtml(r.name)}</div>`,
  'renderS1HeroCard name gold conditional'
);

// ── 3. renderS1MiniCard — hasChallenger 파라미터 추가 + 순위 조건부 ────────
rep(
  `function renderS1MiniCard(r, displayRank) {
  const meta  = S1_TIER_META[r.tier] || S1_TIER_META.unranked;
  const meCls = r.me ? ' me' : '';
  return \`<div class="rk-mini\${meCls}" data-name="\${escHtml(r.name)}" style="cursor:pointer;">
    <div class="stripe" style="background:\${meta.color};"></div>
    <div class="rk-mini-rank">\${displayRank}</div>`,
  `function renderS1MiniCard(r, displayRank, hasChallenger) {
  const meta  = S1_TIER_META[r.tier] || S1_TIER_META.unranked;
  const meCls = r.me ? ' me' : '';
  const rankStr = hasChallenger ? displayRank : '';
  return \`<div class="rk-mini\${meCls}" data-name="\${escHtml(r.name)}" style="cursor:pointer;">
    <div class="stripe" style="background:\${meta.color};"></div>
    <div class="rk-mini-rank">\${rankStr}</div>`,
  'renderS1MiniCard signature + rank conditional'
);

// ── 4. renderS1Ranking — hasChallenger 계산 + 카드 호출에 전달 ────────────
rep(
  `  if (placed.length > 0) {
    const top3 = placed.slice(0, 3);
    html += \`<div class="rk-heroes">\`;
    top3.forEach((r,i) => html += renderS1HeroCard(r, i+1));
    html += \`</div>\`;
    const rest = placed.slice(3);
    if (rest.length > 0) {
      html += \`<div class="rk-list">\`;
      rest.forEach((r,i) => html += renderS1MiniCard(r, i+4));
      html += \`</div>\`;
    }
  }
  if (unplaced.length > 0) {
    html += \`<div class="rk-list" style="margin-top:12px;opacity:0.7;">\`;
    unplaced.forEach(r => html += renderS1MiniCard(r, '—'));`,
  `  const hasChallenger = placed.some(r => r.tier === 'challenger');

  if (placed.length > 0) {
    const top3 = placed.slice(0, 3);
    html += \`<div class="rk-heroes">\`;
    top3.forEach((r,i) => html += renderS1HeroCard(r, i+1, hasChallenger));
    html += \`</div>\`;
    const rest = placed.slice(3);
    if (rest.length > 0) {
      html += \`<div class="rk-list">\`;
      rest.forEach((r,i) => html += renderS1MiniCard(r, i+4, hasChallenger));
      html += \`</div>\`;
    }
  }
  if (unplaced.length > 0) {
    html += \`<div class="rk-list" style="margin-top:12px;opacity:0.7;">\`;
    unplaced.forEach(r => html += renderS1MiniCard(r, hasChallenger ? '—' : '', hasChallenger));`,
  'renderS1Ranking: hasChallenger propagation'
);

// ── 5. renderRankHeroCard — hasChallenger 파라미터 추가 ──────────────────
rep(
  `function renderRankHeroCard(r, place) {
  const medal = place === 1 ? '🥇' : place === 2 ? '🥈' : '🥉';
  const cls = place === 1 ? 'first' : place === 2 ? 'second' : 'third';
  const nameClass = place === 1 ? 'rk-name-gold' : place === 2 ? 'rk-name-silver' : '';`,
  `function renderRankHeroCard(r, place, hasChallenger) {
  const medal = hasChallenger ? (place === 1 ? '🥇' : place === 2 ? '🥈' : '🥉') : '';
  const cls = place === 1 ? 'first' : place === 2 ? 'second' : 'third';
  const nameClass = hasChallenger ? (place === 1 ? 'rk-name-gold' : place === 2 ? 'rk-name-silver' : '') : '';`,
  'renderRankHeroCard signature + medal conditional'
);

// ── 6. renderRankHeroCard — medal 렌더 조건부 (medal이 빈 문자열일 수 있음) ─
rep(
  `      <div class="rk-hero-top-left">
        <span class="rk-medal">\${medal}</span>
        \${r.me ? renderRankMeTag(false) : ''}
      </div>`,
  `      <div class="rk-hero-top-left">
        \${medal ? '<span class="rk-medal">'+medal+'</span>' : ''}
        \${r.me ? renderRankMeTag(false) : ''}
      </div>`,
  'renderRankHeroCard medal render conditional'
);

// ── 7. renderRankMiniCard — hasChallenger 파라미터 추가 + 순위 조건부 ──────
rep(
  `function renderRankMiniCard(r, displayRank) {
  const tierColor = \`var(--rk-tier-\${r.tier})\`;
  const meCls = r.me ? ' me' : '';
  const dots = renderRankStreakDots(r.streak, { tiny: true });
  const chips = renderRankClassChips(r.champTier1, r.champTier2, { max: 3, tiny: true });
  const scoreNum = r.games >= 3 && r.score != null
    ? \`<span class="num">\${r.score.toLocaleString()}</span><span class="pt">pt</span>\`
    : \`<span class="num dim">—</span>\`;
  return \`<div class="rk-mini\${meCls}" data-name="\${escHtml(r.name)}">
    <div class="stripe" style="background:\${tierColor};"></div>
    <div class="rk-mini-rank">\${displayRank}</div>`,
  `function renderRankMiniCard(r, displayRank, hasChallenger) {
  const tierColor = \`var(--rk-tier-\${r.tier})\`;
  const meCls = r.me ? ' me' : '';
  const dots = renderRankStreakDots(r.streak, { tiny: true });
  const chips = renderRankClassChips(r.champTier1, r.champTier2, { max: 3, tiny: true });
  const scoreNum = r.games >= 3 && r.score != null
    ? \`<span class="num">\${r.score.toLocaleString()}</span><span class="pt">pt</span>\`
    : \`<span class="num dim">—</span>\`;
  const rankStr = hasChallenger ? displayRank : '';
  return \`<div class="rk-mini\${meCls}" data-name="\${escHtml(r.name)}">
    <div class="stripe" style="background:\${tierColor};"></div>
    <div class="rk-mini-rank">\${rankStr}</div>`,
  'renderRankMiniCard signature + rank conditional'
);

// ── 8. renderRanking — hasChallenger 계산 + 카드 호출에 전달 ─────────────
rep(
  `  const top3 = rows.slice(0, 3);
  const rest = rows.slice(3);

  let html = '';
  if (top3.length > 0) {
    html += '<div class="rk-top3">';
    if (top3[0]) html += renderRankHeroCard(top3[0], 1);
    if (top3[1] || top3[2]) {
      html += '<div class="rk-top3-row">';
      if (top3[1]) html += renderRankHeroCard(top3[1], 2);
      if (top3[2]) html += renderRankHeroCard(top3[2], 3);
      html += '</div>';
    }
    html += '</div>';
  }
  if (rest.length > 0) {
    html += \`<div class="rk-section-bar">
      <span class="lbl">전체 랭킹</span>
      <span class="meta">4–\${rows.length}위</span>
    </div>\`;
    html += '<div class="rk-list">';
    rest.forEach((r, i) => { html += renderRankMiniCard(r, i + 4); });
    html += '</div>';
  }`,
  `  const top3 = rows.slice(0, 3);
  const rest = rows.slice(3);
  const hasChallenger = rows.some(r => r.tier === 'challenger');

  let html = '';
  if (top3.length > 0) {
    html += '<div class="rk-top3">';
    if (top3[0]) html += renderRankHeroCard(top3[0], 1, hasChallenger);
    if (top3[1] || top3[2]) {
      html += '<div class="rk-top3-row">';
      if (top3[1]) html += renderRankHeroCard(top3[1], 2, hasChallenger);
      if (top3[2]) html += renderRankHeroCard(top3[2], 3, hasChallenger);
      html += '</div>';
    }
    html += '</div>';
  }
  if (rest.length > 0) {
    html += \`<div class="rk-section-bar">
      <span class="lbl">전체 랭킹</span>
      <span class="meta">4–\${rows.length}위</span>
    </div>\`;
    html += '<div class="rk-list">';
    rest.forEach((r, i) => { html += renderRankMiniCard(r, i + 4, hasChallenger); });
    html += '</div>';
  }`,
  'renderRanking: hasChallenger propagation'
);

fs.writeFileSync('C:/Users/so/aram/index.html', html, 'utf8');
console.log('\nok:', ok, 'fail:', fail);
