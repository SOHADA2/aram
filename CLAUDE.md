# 무작위 총력전 아수라장 내전 (ARAM Custom Team Builder)

## 프로젝트 개요
- 롤 칼바람 내전 팀짜기 **단일 HTML 웹앱** (`index.html`)
- Firebase Realtime Database로 실시간 데이터 동기화
- GitHub Pages 배포: https://sohada2.github.io/aram/
- 저장소: https://github.com/SOHADA2/aram
- 현재 버전: v2.43.39

## 기술 스택
- **순수 HTML/CSS/JS** (프레임워크·빌드 없음, 파일 1개)
- **Firebase**: firebase-app, firebase-database (CDN v11.0.0)
- **폰트**: Noto Sans KR, Black Han Sans (Google Fonts)
- **배포**: GitHub Pages (main 브랜치 자동 배포)

## Firebase 데이터 구조
```
/players/{key}
  name: string
  manualTier: string | null     // null이면 승점 자동 계산
  champTier1: string[]          // 1군 챔프 클래스 ID 배열
  champTier2: string[]          // 2군 챔프 클래스 ID 배열
  motto: string                 // 한마디 (최대 20자)

/session
  active: boolean               // 현재 팀이 구성된 상태인지 여부
  teamA: string[]               // 1팀 이름 배열
  teamB: string[]               // 2팀 이름 배열
  teamSize: number
  mode: 'balance' | 'random'
  isEventMatch: boolean
  spectator: string | null      // 관전자 이름 (단일, 하위 호환)
  spectators: string[] | null   // 전체 관전자 목록 (v2.32.2~, 11명 이상 시 다수)
  spectatorPick: string | null  // 첫 번째 관전자 예측 (하위 호환)
  spectatorPicks: { [normName]: string } | null  // 다중 관전자 각자 예측
  spectatorBets:  { [normName]: number } | null  // 관전자 베팅 금액 (v2.36.11~, 30/50/80/100)
  spectatorPickStartAt: number  // 예측 모달 시작 시각
  magollaMatchId: string | null // 활성 막고라 매치 ID (v2.39.0~) — 모든 기기에 막고라 모달 전파용
  // onValue로 모든 기기에 실시간 동기화됨 (일반 매치만, 이벤트 매치는 제외)

/matches/{key}
  date: string
  timestamp: number
  teamA: string[]               // 1팀(블루) 이름 배열
  teamB: string[]               // 2팀(레드) 이름 배열
  winner: 'blue' | 'red'
  mode: 'balance' | 'random'
  size: number
  season: number                // 경기 시즌 (v2.29.x~)
  itemEffects: { [playerNormName]: string[] }  // 사용된 아이템 효과
  gameTime: number              // 게임 시간(초) — 브릿지 v1.1.6 자동 수집
  participants: { [normName]: {  // 브릿지 자동 수집 플레이어 상세
    champion, kills, deaths, assists, damage, gold, cs,
    items: number[],            // 아이템 ID 배열 (0 제외)
    augments: number[],         // ARAM 증강 ID 배열
    doubleKills, tripleKills, quadraKills, pentaKills: number,
    firstBlood: boolean
  } }
  spectatorPicks: { [normName]: { pick: 'blue'|'red', correct: boolean, betAmount?: number, payout?: number } }
                                  // 다중 관전자 예측 (v2.32.2~), 베팅 시스템 (v2.36.11~ — betAmount/payout 추가)
                                  // payout: 적중 시 +betAmount / 실패 시 -betAmount
                                  // 자동 픽(betAmount=0): 적중 시 +30G 보너스 / 실패 0 (v2.36.12~)
  secretQuests: { [normName]: { questId, questName, questDiff, questIcon, questDesc, success, won, reward, lpProtect } }
                                  // 비밀 퀘스트 토큰 (v2.43.39~) — 토큰 보유자만 저장됨
                                  // success+won=true 시 reward 골드 지급
                                  // success+won=false 시 lpProtect 만큼 LP 차감 완화 (본인 뉴비/도박권 시 비활성)
  // 하위 호환: spectatorName, spectatorPick, spectatorCorrect (단일 관전자 레거시)

/gold/{key}
  name: string
  gold: number                  // 보유 골드 (시즌 0 레거시)
  items: array                  // 보유 아이템 (시즌 0)
  gold_s1, items_s1, goldSpent_s1 ...  // 시즌 N 필드 (sField() 로 접근)
  retroApplied: boolean         // 소급 계산 완료 여부
  goldMigV2: boolean            // S0 마이그레이션 재실행 방지 가드 (v2.32.0~)
  goldBonusLegacy: number       // 구버전 goldBonus 리네임 (v2.34.x~, migrateGoldBonusToLegacy() 자동 실행)
  goldBonusLegacy_s1: number    // S1용 구버전 goldBonus_s1 리네임
  attendanceHistory: array      // 출석 이벤트 배열 { date, gold, ts } (v2.34.x~, 기존 goldBonus 대체)
  lastAttendance: string        // 마지막 출석 날짜 (YYYY-MM-DD)
  attendanceCount: number       // 누적 출석 횟수
  lotteryHistory: array         // 복권 구매·당첨 이력 (v2.31.98~) — 프리미엄은 premium:true 플래그
  lotteryCount: number          // 오늘 복권 구매 횟수 (lotteryDate 날짜 기준 리셋, 1일 10장 한도 v2.37.13~)
  lotteryDate: string           // lotteryCount 기준 날짜 (YYYY-MM-DD)
  lotteryPremiumCount: number   // 오늘 프리미엄 복권 구매 횟수 (v2.36.0~, 1일 3장 한도 v2.37.13~)
  lotteryPremiumDate: string    // lotteryPremiumCount 기준 날짜
  lotteryRefundApplied: boolean // 구버전 복권 환불 완료 플래그 (v2.31.99~)
  secretQuestCount: number      // 오늘 비밀 퀘스트 토큰 구매 횟수 (1일 2회 한도, v2.43.39~)
  secretQuestDate: string       // secretQuestCount 기준 날짜 (YYYY-MM-DD)

/config/currentSeason            // 현재 시즌 번호 (0 또는 1)
/config/riotApiKey               // Riot API Key (24h 갱신)
/config/liveOwner                // 라이브 모드 단일 소유권 (v2.31.20~)
  deviceId, label, startedAt, heartbeatAt

/season1/players/{normName}      // 시즌 1 전용 LP·티어 상태
  tier: 'unranked'|'bronze'|...|'challenger'
  lp: number
  placementGames, placementWins, placementDone
  promoActive, promoWins, promoLosses, promoGamesPlayed
```

## 탭 구성 (5탭)
1. **⚔️ 팀구성** — 참가자 선택 → 팀 설정 → 결과 → 경기 저장
2. **📋 기록** — 전체 매치 히스토리
3. **🏆 랭킹** — 승점 기반 티어, 프로필 모달 포함
4. **🛒 상점** — 골드로 아이템 구매, 내 아이템 관리
5. **🏅 업적** — 업적 달성 및 골드 보상 수령 (라이브용 계정에선 미표시)

## 티어 / 승점 시스템 (v1.8.8 기준)
- 기존 승률% 방식 → **MMR 승점 방식**으로 전면 개편
- 시작 500pt, 상한 1000pt, 하한 0pt
- 승리: **+10pt**, 패배: **-7pt**
- 아이템 `score2x` 사용 시 승리 +20pt, `insurance` 사용 시 패배 감점 없음
- **신뢰도 가중치**: `score = raw * (total/(total+10)) + 500 * (10/(total+10))`
  → 판수 적을수록 500점에 수렴
- 최소 **3판** 이상이어야 티어 부여

| 티어 | 점수 |
|------|------|
| 챌린저 | 850↑ |
| 그마 | 780↑ |
| 마스터 | 720↑ |
| 다이아 | 660↑ |
| 에메랄드 | 600↑ |
| 플래티넘 | 540↑ |
| 골드 | 480↑ |
| 실버 | 420↑ |
| 브론즈 | 360↑ |
| 아이언 | 그 외 |

## 매치 타입
- **일반 매치**: 티어 반영, 3:3 / 4:4 / 5:5, 밸런스 or 랜덤
- **이벤트 매치**: 티어 미반영, 인원 자유 (1팀/2팀 개별 설정), 저장 안 됨, 인원 많은 팀에서 핸디캡 담당자 랜덤 선정

## 골드 & 아이템 시스템
- 경기 결과에 따라 골드 자동 지급: 승리 **+15G**, 패배 **+5G**
- **출석 체크**: 하루 1회, **+30G** 지급 (패스/업적 탭 상단 카드 — 완료 시 카드 자동 숨김, 다음 날 재표시)
  - Firebase `/gold/{key}.attendanceHistory` 배열에 `{ date, gold, ts }` 이벤트 기록 (v2.34.x~)
    - 구버전 `goldBonus` → `goldBonusLegacy` 로 마이그레이션됨 (`migrateGoldBonusToLegacy()` 앱 로드 시 자동 실행)
  - `/gold/{key}.lastAttendance` (YYYY-MM-DD) 로 당일 중복 방지
  - 날짜 기준: **로컬 시간** (`getLocalDateKey()`)
- **골드 계산 통합 함수**: `calcPlayerGoldEarned(name, data)` — 경기 + goldBonusLegacy + 출석(attendanceHistory) + 업적 + 패스 + 복권 합산
  - `getMyGold()` = `calcPlayerGoldEarned(myName, myData) - goldSpent`
  - **주의**: `calcGoldFromMatches(name)` 만 쓰면 출석·업적·패스·복권 누락 → 반드시 `calcPlayerGoldEarned` 사용
- 기존 경기 기록 기반 소급 계산 자동 적용 (`retroApplied`)

## 골드 상수 버전 관리 (v2.25.0~)
- **goldVersion 필드**: 매치 데이터에 저장 — v2.25.0 이상 경기는 `goldVersion: 2`
- **MVP/SVP**: `goldVersion >= 2` → 50G / 구버전 → 10G (소급 방지)
- **관전자 적중**: `goldVersion >= 2` → 50G / 구버전 → 15G (소급 방지)
- **매너왕**: `goldVersion >= 2` 경기에만 존재, 항상 50G
- 골드 점검 시 `GOLD_MVP_LEGACY`, `GOLD_SPECTATOR_CORRECT_LEGACY` 상수 확인 필요

## 매너왕 시스템 (v2.25.2~)
- **MVP 투표 카드에 통합** — MVP·SVP·매너왕을 한 카드에서 동시에 투표
- **팀별 2인 선정**: 상대팀에서 MVP 1명 + 매너왕 1명 선택 (MVP와 매너왕은 다른 사람도 가능)
  - teamA 플레이어 → teamB에서 MVP 1명, 매너왕 1명 선택
  - teamB 플레이어 → teamA에서 MVP 1명, 매너왕 1명 선택
- **저장 조건**: MVP와 매너왕 투표 모두 완료(또는 건너뛰기)해야 저장 활성화
- **Firebase**: `session/manner/teamAVotes/{fbKey}: name` / `session/manner/teamBVotes/{fbKey}: name` / `session/manner/confirmed: { teamAManner, teamBManner }`
- **Match 저장**: `matches/{key}.mannerWinner` (승리팀 매너왕), `matches/{key}.mannerLoser` (패배팀 매너왕)
- **레거시 호환**: `matches/{key}.mannerKing` (v2.25.1 이하) — `calcGoldFromMatches()`에서 계속 지원
- **골드**: 선정자 각각 +50G (`GOLD_MANNER`)

| 아이템 | 가격 | 효과 | 시즌 |
|--------|------|------|------|
| ⚡ 승점 2배권 | 80G | 경기 전 활성화 → 승리 시 +20pt | S0 |
| 🛡️ 패배 방어권 | 60G | 경기 전 활성화 → 패배해도 감점 없음 | S0 |
| 🛡️ 승급전 방어권 | 100G | 승급전 중 패배 시 해당 판 기록 제외 · 승리 시 정상 기록 | S1 |
| ⚔️ 승급전 승리권 | 100G | 승급전 중 승리 시 2승 처리(즉시 승급) · 패배 시 1패 정상 | S1 |
| 🎲 도박권 | 60G | 일반전 전용 · 승리 +40 LP / 패배 −30 LP (승급전 중 사용 불가) | S1 |
| 🎟️ 골드 복권 | 30G | 즉시 결과 · 1일 10장 한도 · 꽝 30%~잭팟 500G 1% (EV ≈ 32G) | S1 |
| 💎 프리미엄 복권 | 200G | 즉시 결과 · **1일 3장** 한도 · 꽝 40%~메가잭팟 5000G 1% (EV ≈ 196G, 상위권 골드 흡수용) | S1 |
| 🤫 비밀 퀘스트 토큰 | 200G | 다음 정규전에 본인만 보이는 비밀 퀘스트 · 적중+승리 +500~1000G · 적중+패배 LP 감소 완화 · 1일 2회 (v2.43.39~) | S1 |

- 팀 구성 완료 후 **아이템 잠금** (경기 저장 시 자동 해제)
- 아이템 사용 통계: `calcItemStats(name)` — `matches[].itemEffects[normName]` 스캔
  - `score2xWin`: 2배권 사용 후 승리 횟수
  - `insuranceUsed`: 방어권 사용 후 패배(감점 막기) 횟수

### 상점 UI 패턴 (v2.34.1~)
- **보유 개수 배지**: 상점 목록(좌)에서 제거 → 내 아이템 슬롯(우) 좌상단에 황금빛 배지 `.inv-count-badge` 로 표시 ("N개")
  - 동일 아이템 타입의 총 보유 개수를 모든 슬롯에 표시
- **복권 한도 소진**: `lotteryCount >= 3` 이면 구매 버튼 → "한도 소진" 비활성 표시 (`.sli-price.sli-limit-hit`)
  - `renderShop()` 에서 `todayLotteryCount` 계산 후 버튼 분기 처리
- **계정 전환 토스트**: `selectMyName()` 에서 `calcPlayerGoldEarned(name, existData)` 사용 (구버전은 `calcGoldFromMatches`만 써서 출석·업적·패스·복권 누락됐었음)

## 매칭 퀘스트 시스템 (v2.5.0)
- **발동 조건**: 팀 구성에 TOP3 플레이어(3판 이상) 포함 시 15% 확률 (`QUEST_TRIGGER_RATE`)
- **발동 우선순위**: 여러 TOP3 포함 시 가장 높은 랭크(1등 우선) 퀘스트 발동
- **퀘스트 종류** (`QUEST_CONFIGS`): 1등 우선, 없으면 2등, 없으면 3등 순으로 탐색
  | 랭크 | 이름 | 상금 | 본인 패배 추가 감점 |
  |------|------|------|-----------------|
  | 1등 | 👑 왕관의 무게 | +100G | -10pt |
  | 2등 | ⚔️ 역전의 기회 | +80G | -8pt |
  | 3등 | 🚀 기회의 도약 | +50G | -5pt |
- **효과**: 승리팀 전원 상금 / 패배팀 전원 골드 없음 + 해당 플레이어 본인 추가 감점
- **상금은 독립**: MVP·뉴비·아이템 등 다른 골드 이벤트와 연산 없음
- **팝업**: 팀 구성 완료 0.7초 후 `.quest-overlay` 모달로 표시
- **저장**: `matches/{key}.questEvent` — `{ playerName, rank, bonusGold, lossExtraPt }`
- **골드 계산**: `calcGoldFromMatches()` — questEvent 있으면 일반 골드 대신 bonusGold(승)/0(패)
- **승점 계산**: `calcScore()` — 해당 플레이어 패배 시 normal loss 후 추가 lossExtraPt 감점
- **상태 변수**: `questEventState` — 팀 구성~저장 완료 사이에만 유지, 저장 후 null 초기화

## 시즌 시스템 (v2.29.x~, 시즌 1 LP v2.30.0~)
- **시즌 전환**: Firebase `/config/currentSeason` 값으로 제어 (0 또는 1)
  - 라이브 계정 푸터의 **시즌 어드민 토글**로 전환 (v2.30.1)
  - `CURRENT_SEASON` 전역 변수, 앱 기동 시 onValue 실시간 수신
- **시즌별 Firebase 필드**: `sField(field)` 헬퍼 — 시즌 0은 기존 필드명 유지, 이후 `_s1`, `_s2` suffix
  - 예: `items` (S0) / `items_s1` (S1), `goldSpent` / `goldSpent_s1`
- **매치 저장**: `matches/{key}.season` 필드에 해당 경기의 시즌 기록
- **랭킹/기록 탭 시즌 드롭다운**: 과거 시즌 기록 조회 (`viewSeason` 상태 변수)

## 시즌 1 LP 시스템 (v2.30.0)
`CURRENT_SEASON >= 1` 일 때 자동 활성화. 기존 MMR 승점 시스템 대체.

### 데이터 경로
- `/season1/players/{normName}` — 플레이어별 LP/티어 상태
- 전역 변수: `season1Data` (onValue 실시간 동기화)

### 배치고사 (5판)
- 모든 신규 플레이어는 배치고사부터 시작 (`tier: 'unranked'`)
- 5판 완료 시 승수 × **25 LP** 기준으로 티어 배정
  - 100 LP 이하 → **브론즈**, 100 LP 초과 → **실버** (초과분은 LP로 이월)
- 상수: `S1_PLACEMENT_GAMES=5`, `S1_PLACEMENT_WIN_LP=25`

### 정규전
- 승리 **+20 LP**, 패배 **−14 LP** (`S1_LP_WIN`, `S1_LP_LOSS`)
- LP 상한 **100** (`S1_LP_CAP`) — 도달 시 승급 로직 발동
- LP 0 미만 시: Bronze·Silver·Gold는 강등 없음(0LP 바닥). Platinum 이상만 강등 → 이전 티어 75LP (`S1_NO_DEMOTE`)

### 승급 / 강등
- **자동 승급** (`S1_AUTO_TIERS`): 브론즈 → 실버 (100 LP 도달 즉시)
- **승급전** (`S1_PROMO_TIERS`): 골드·플래티넘·다이아·마스터·그마 → 100 LP 도달 시 시작
  - **3판 2선승**, `promoWins/promoLosses` 추적 (판수 상한 없음 — 아이템 사용 시 자연 연장)
  - 실패(2패) 시 LP **75**로 복귀 (`S1_PROMO_FAIL_LP`)
- **챌린저**: LP 상한 없음 (무제한 누적)
- **강등 제외**: 브론즈·실버 (`S1_AUTO_TIERS`)

### 티어 순서
`unranked → bronze → silver → gold → platinum → diamond → master → grandmaster → challenger`
- 메타: `S1_TIER_META` (라벨·색상·CSS 클래스)

### 시즌 1 아이템 상호작용
- `s1_promo_win` (승급전 승리권): 승리 시 즉시 승급 처리, 패배는 1패로 정상 기록
- `s1_promo_shield` (승급전 방어권): 승급전 패배 시 해당 판 기록 제외 (승리는 정상)
- `s1_gamble` (도박권): 정규전 한정, 승 **+40 LP** / 패 **−30 LP** (`S1_GAMBLE_WIN/LOSS`)

### 핵심 함수
- `s1ApplyMatchResult(name, won, activeS1Item)` — 단일 플레이어 결과 적용
- `s1ApplyAllMatchResults(winners, losers)` — `saveMatch` 훅, 전체 일괄 적용
- `s1PromoSuccess(d)` / `s1PromoFail(d)` — 승급전 성공·실패 상태 전이
- `s1LpBarHtml(d)` — LP 바 HTML (미니카드 내부용, 바 + 수치 한 줄)
- `s1TierBadgeHtml(tier, size)` — 티어 배지 HTML, size: `'big'|'mid'|'mini'`
- `renderS1HeroCard(r, place, hasChallenger)` — 1~3위 히어로 카드
- `renderS1MiniCard(r, displayRank, hasChallenger)` — 4위~ 미니 카드

### S1 랭킹 CSS 클래스 (v2.34.3~)
- `.rk-mini-right-s1` — 미니카드 우측 영역 (min-width:84px)
- `.rk-s1-tier-lp` — 티어 배지 + LP 수치 + LP 바 세로 스택 컨테이너
- `.rk-s1-lp-big` — LP 수치 텍스트 (14px, JetBrains Mono, 티어 컬러)
- `.rk-mini-lp-bar` — LP 바 (우측 전체 너비)
- `.rk-hero-s1-lp` — 히어로카드 하단 LP 영역 (border-top 구분선)
- `.rk-hero-s1-lp-head` — 티어명(좌) + LP 수치(우) 가로 배치
- `.rk-hero-s1-lp-num` — 히어로 LP 수치 (1위 26px, 2·3위 20px, Gmarket Sans)

## EOG 자동 저장 흐름 (v2.29.57~v2.29.64)
- **경기 종료 시**: `showEogOverlay()` — 승리팀 + MVP/SVP/매너왕 투표 카드가 팝업으로 등장
- **자동 저장**: 전원 투표 완료 시 `liveMode` 기기에서 `saveMatch` 자동 트리거
- **정산창**: 저장 직후 `postSaveMatchData` 기반 정산 오버레이 표시 (골드·아이템·LP 변화 요약)
- **주의**: `finalizeVotes` 는 `session` 초기화 **이전**에 호출되어야 race condition 방지 (v2.29.57)

## 정산창 (v2.37.25~)
`window.showMatchSummary({ winners, losers, itemEffects, tierChanges, s1LpBefore, questEvent, spectatorResult, mvpWinner, mvpLoser, mannerWinner, mannerLoser })`

### 레이아웃 구조 (ms2-* CSS 클래스)
- `.match-summary-overlay` (기존 backdrop 클래스 유지) > `.ms2-sheet` (max-width:560px)
- `.ms2-header` — 승리팀명 금빛 shimmer + "N vs N · 시즌 N" 서브텍스트
- `.ms2-teams-row` (grid 1fr 1fr) — `.ms2-team-card.win` / `.ms2-team-card.lose`
- `.ms2-awards-bar` — MVP / SVP / MMP 수평 pill (없으면 숨김)
- `.ms2-btm` — 관전자 예측 서브카드 + 티어업 카드 + 닫기 버튼

### 플레이어 행 구조
```
<div class="ms2-pr [me]">
  <span class="ms2-pr-name">이름</span>
  <span class="ms2-me-tag">나</span>  ← myName 일치 시
  <div class="ms2-pr-items"><span class="ms2-item-chip">SVG</span></div>
  <div class="ms2-pr-nums">
    <span class="ms2-pr-lp plus|minus|zero">+20 LP</span>
    <span class="ms2-pr-gold">+15G</span>
  </div>
</div>
```

### 팀 레이블 결정
`isWinnersTeamA = winners.some(n => currentTeamA.some(p => normName(p.name)===normName(n)))`
→ `1팀` / `2팀` 자동 결정 (`currentTeamA`는 경기 저장 후에도 수동 초기화 전까지 유지)

### 티어업 배너 억제
- `_suppressS1SuccessBanners` 플래그: `s1ApplyAllMatchResults` 직전 `true` 설정
- `_detectAllS1Changes`에서 success 배너 skip, `_shownPromoKeys`엔 추가 (중복 방지)
- 정산창 닫기(`closeMatchSummary`) 시 `false` 복원 → `_showPendingPromoNotif()` 호출
- `_showPendingPromoNotif` success 타입은 early return (정산창에서 이미 표시)

### 목업 파일
`C:\Users\so\aram\mockup-settlement.html` — 정산창 디자인 레퍼런스
`C:\Users\so\aram\waiting_mockup.html` — 대기 화면 디자인 레퍼런스

## 대기 화면 (v2.37.28~, wm-* CSS)
팀 구성 완료 후 경기 시작 대기 중 각 멤버에게 보이는 개인 미니 대시보드.
`renderMemberWaiting()` → `#member-waiting` div에 렌더링. 팀 구성 완료 시 `my-info-bar` 숨김.

### 표시 항목
- 티어 배지 + LP 바 + 승급전 상태
- 최근 10경기 폼 도트 (오른쪽이 최신)
- 승/패 카운트, 연승/연패
- 승급 예측 (다음 경기 결과별 티어 시뮬)
- MVP/SVP/MMP 어워드 스트립 (있는 경우)
- 랜덤 팁 문구

### 티어 방어막 배지 (v2.37.36~)
`s1ApplyMatchResult` 반환값에 `newlyPromoted`, `masterShield` 플래그 포함.
- `newlyPromoted: true` — 승급 직후 다음 1판 LP 보호 (0LP 바닥 + 강등 없음)
- `masterShield: true` — 마스터/그마/챌린저 첫 진입 시 추가 2판 보호
- 배지 CSS: `.s1-shield-badge.first-chance` (⏳ 첫판 보호) / `.s1-shield-badge.zero-lp` (🛡️ 0LP 방어막)
- 두 배지 동시 표시 가능: `newlyPromoted && masterShield` 조건 체크

## 마스터/그마/챌린저 첫 달성 팝업 (v2.37.35~)
`s1TriggerMilestone(tier, participants, achieverName)` — Firebase `season1/milestones/first{Tier}` 최초 저장.
`registerMilestoneListener(tier)` — onValue로 감지 → `showMilestonePopup()` 호출 (10분 이내만 표시).

### 설정 (`TIER_POPUP_CFG`)
| 티어 | 아이콘 | 보상 골드 | 컨페티 수 |
|------|--------|-----------|-----------|
| master | 👑 | 50G | 120 |
| grandmaster | 🩸 | 100G | 150 |
| challenger | ⚡ | 150G | 200 |

- 보상 골드 필드: `witnessGold_s1_master` / `witnessGold_s1_gm` / `witnessGold_s1_ch` (경기 참가자 전원에게 지급)
- 팝업 HTML: `#master-popup` (고정 DOM), `#master-popup-title` 동적 갱신

## 시즌 1 패스 시스템 (v2.31.0, 퀘스트 기반 v2.31.1, 1000G·자동완수 제거 v2.31.3~)
`CURRENT_SEASON >= 1` 일 때 **업적 탭 자리에 "🎫 시즌 패스"로 전환**. S1 고유 업적 부재와 기존 티어·아이템 업적이 S0 MMR에 묶인 문제를 해결하려는 대체 진행·보상 시스템.

### 구조: 퀘스트 기반 순차 언락
- **각 레벨마다 고유 퀘스트 1개** (v2.31.0의 XP 누적은 폐기)
- 직전 레벨까지 전부 클레임 완료 + 현재 레벨 퀘스트 조건 충족 시 수령 가능
- 상수: `S1_PASS_MAX_LEVEL=20`, `S1_PASS_QUESTS[]`, `s1PassRewardForLevel(level)`

### 설계 철학 (v2.31.3~)
- **목표**: 주 10~15판 기준 **~1개월(~40판)** 에 20레벨 완주, 하드 플레이어는 조기 완주 가능
- **자동완수 제거**: 누적 승 카운터(5승/10승/15승) 퀘스트 제거 — 낮은 레벨 진행 중 자동으로 달성되어 후반 레벨이 의미 없어지던 문제
- **단일 경기 도전형 중심**: 한 판의 킬/어시/딜량/KDA/CS, S1 아이템 사용 성공, 연승, 사교(MVP·매너·관전) 등 각 액션이 독립적
- 평균 딜량 25~40k, KDA 2~4 등 ARAM 리얼리스틱 값 기반
- RNG 의존도 높은 조건 배제 (퍼펙트 게임 = 데스 0 + 승 삭제)
- **총 보상 1000G** — 일반 20G × 16 + 마일스톤 LV5 50 + LV10 80 + LV15 150 + LV20 400

### 퀘스트 카탈로그 (LV 1~20, ⭐=마일스톤)
| LV | 퀘스트 | 조건 | 보상 |
|----|--------|------|------|
| 1 | 첫 걸음 | S1 경기 1회 | 20G |
| 2 | 첫 승리 | 승리 1회 | 20G |
| 3 | 관찰 시작 | 관전자 1회 참여 | 20G |
| 4 | 3경기 참전 | 경기 3회 | 20G |
| 5 ⭐ | 킬 사냥꾼 | 한 판 킬 8+ | 50G |
| 6 | 신뢰의 동료 | 한 판 어시 10+ | 20G |
| 7 | 살아남기 | 데스 5 이하 + 승 | 20G |
| 8 | 딜 견습생 | 한 판 딜량 30,000+ | 20G |
| 9 | KDA 3.0 | 한 판 KDA 3.0+ | 20G |
| 10 ⭐ | 도박 성공 | 도박권 사용 후 승리 1회 | 80G |
| 11 | MVP/SVP 등극 | MVP/SVP 1회 | 20G |
| 12 | 매너왕 | 매너왕 1회 | 20G |
| 13 | 족집게 관전 | 관전 예측 1회 적중 | 20G |
| 14 | 2연승 | 2연승 달성 | 20G |
| 15 ⭐ | 대폭딜러 | 한 판 딜량 50,000+ | 150G |
| 16 | 어시 마스터 | 한 판 어시 15+ | 20G |
| 17 | KDA 4.0 클럽 | 한 판 KDA 4.0+ | 20G |
| 18 | 3연승 | 3연승 달성 | 20G |
| 19 | CS 장인 | 한 판 CS 50+ | 20G |
| 20 ⭐ | 시즌의 정점 | 한 판 킬+어시 합 25+ | 400G |

### 🎁 한 번에 수령 (v2.31.3~)
- 패스 상단 고정 버튼, 조건 충족 레벨 수와 총 골드 미리보기 포함 (`🎁 한 번에 수령 (N개 · +XXG)`)
- `claimS1PassAll()` — 현재 클레임 레벨 이후로 순차 검사 → 조건 충족한 레벨 일괄 update + 결과 팝업
- 결과 팝업 `showS1PassClaimResult()`: 수령한 레벨·퀘스트 이름·보상 목록 + 총 획득 골드, 확인 버튼으로 닫기
- 조건 미충족 레벨에서 멈춤 (순차 가드 유지)

### 통계 소스
- **`calcS1PassStats(name)`** — S1 매치 순회하며 집계:
  - 누적: `games / wins / losses / mvpCount / mannerCount / specTotal / specCorrect / attendance`
  - 단일 경기 최대치: `maxKills / maxDeaths / maxAssists / maxDamage / maxCs / maxKda / maxKa (킬+어시 합)`
  - S1 아이템 사용: `gambleWinS1` (도박권 활성 후 승리), `promoShieldUsed`, `promoWinUsed`
  - 플래그: `lowDeathWin` (데스≤3 + 승), `lowDeathWin5` (데스≤5 + 승), `perfectWin` (데스=0 + 승, v2.31.2에서 퀘스트 사용 중단)
  - 연속: `maxWinStreak`
- KDA·딜량·CS 는 `matches.participants[normName(name)]` 의 `kills/deaths/assists/damage/cs` 를 참조 (**내전 브릿지 프로그램** 자동 수집)
- S1 아이템 사용은 `matches.itemEffects[key]` 에 기록된 활성 아이템 ID 기반 (`s1_gamble` / `s1_promo_shield` / `s1_promo_win`)
- 매너왕은 레거시 `mannerKing` 포함, MVP/SVP 는 `mvpWinner/mvpLoser` 양쪽 합산
- 관전자: `specTotal` 은 `m.spectatorName===key` 전체 카운트, `specCorrect` 는 적중분만

### Firebase 저장
- `/gold/{key}.seasonPassClaimed_s1/{level}: true` — 클레임 완료 레벨 플래그
- 퀘스트 조건 판정은 매번 `calcS1PassStats` 로 동적 계산 (별도 저장 없음)

### 골드 통합
- `getMyGold()` 에 `calcS1PassGold(data.seasonPassClaimed_s1)` 합산 — S1 모드일 때만
- 보상값 조정 시 과거 수령자에게도 소급 반영 (가산식)

### 핵심 함수 & UI
- `renderS1Pass()` — 헤더(LV N/20 + 다음 퀘스트 예고) + "📊 내 시즌 1 기록" `<details>` (KDA·딜량·CS 요약) + 퀘스트 리스트
- `claimS1PassLevel(level)` — 순차 클레임 가드 (직전 레벨 미수령 or 조건 미충족 시 거부)
- `calcS1PassCurrentLevel(claimed)` — 연속으로 클레임된 가장 높은 레벨
- `renderAchievementsOrPass()` — 탭 라우터 (S0→업적 / S1→시즌 패스). 탭 버튼 라벨도 `🎫<br>패스` 로 동기화
- 탭 버튼: `.nav-tab-achievement` (라이브 계정에선 미표시), `#achievement-card-title` 동적 갱신

## 업적 시스템 (v2.7.0 → v2.8.0)
- **탭**: 🏅 업적 (5번째 탭) — 라이브용 계정에서는 탭 미표시
- **Firebase 저장**: `/gold/{key}/achievements/{id}: true` — 수령 완료 여부
- **골드 지급**: `claimAchievement(id)` → `goldBonus` 에 누적
- **통계 계산**: `calcMaxStreaks(name)` → `{ maxWin, maxLoss }`, `calcItemStats(name)` → `{ score2xWin, insuranceUsed }`
- **카테고리 4종**: 전적 기반 / 연속 기록 / 티어 기반 / 아이템

| 카테고리 | 업적 | 조건 | 보상 |
|----------|------|------|------|
| 전적 기반 | 첫 승리 | 1승 | 5G |
| 전적 기반 | 10승 달성 | 10승 | 10G |
| 전적 기반 | 50승 달성 | 50승 | 25G |
| 전적 기반 | 100승 달성 | 100승 | 50G |
| 전적 기반 | 50전 참전 | 50경기 | 15G |
| 전적 기반 | 100전 참전 | 100경기 | 25G |
| 연속 기록 | 3연승 | maxWin≥3 | 10G |
| 연속 기록 | 5연승 | maxWin≥5 | 15G |
| 연속 기록 | 10연승 | maxWin≥10 | 40G |
| 연속 기록 | 3연패 | maxLoss≥3 | 5G |
| 연속 기록 | 5연패 | maxLoss≥5 | 10G |
| 연속 기록 | 10연패 | maxLoss≥10 | 25G |
| 티어 기반 | 첫 티어 부여 | 3판↑ | 5G |
| 티어 기반 | 골드 달성 | 480pt↑ | 10G |
| 티어 기반 | 플래티넘 달성 | 540pt↑ | 15G |
| 티어 기반 | 다이아 달성 | 660pt↑ | 25G |
| 티어 기반 | 마스터 달성 | 720pt↑ | 35G |
| 티어 기반 | 그랜드마스터 | 780pt↑ | 45G |
| 티어 기반 | 챌린저 달성 | 850pt↑ | 60G |
| 아이템 | 2배권 승리 3회 | score2xWin≥3 | 10G |
| 아이템 | 2배권 승리 5회 | score2xWin≥5 | 15G |
| 아이템 | 2배권 승리 10회 | score2xWin≥10 | 30G |
| 아이템 | 철벽 방어 3회 | insuranceUsed≥3 | 5G |
| 아이템 | 철벽 방어 5회 | insuranceUsed≥5 | 15G |
| 아이템 | 철벽 방어 10회 | insuranceUsed≥10 | 25G |

## UI 개선 (v2.4.1)
- **뉴비 보너스 접기/펼치기**: 팀 카드 하단 뉴비 보너스 정보를 기본 접힘 상태로 변경
  - `🌱 뉴비 보너스 적용 중 (이름) ▾` 한 줄만 노출
  - 마우스 올리면(`:hover`) 또는 클릭(`.open` 토글)으로 상세 내용 펼쳐짐
- **1등 닉네임 금빛 shimmer**: `rank-1-name` 클래스 — 황금 그라데이션 + 2.5초 반짝임 애니메이션
  - `nameHtml(name)` 헬퍼로 1등 여부 판단 후 래핑
  - 적용 위치: 랭킹 리스트, 팀 카드, 참가자 칩, 참가자 목록, 프로필 모달

## 랭킹 TOP3 뱃지 시스템 (v2.4.0)
- `/players` + `/matches` 기반으로 승점 상위 3명을 계산 (`getTopThreeMap()`)
- 3판 이상 플레이어 중 승점 순 — 1등 🥇, 2등 🥈, 3등 🥉
- `getRankBadge(name)` 헬퍼로 뱃지 HTML 반환
- 표시 위치: 참가자 선택 칩, 참가자 목록, 팀 카드, 프로필 모달, 랭킹 리스트 이름 옆
- 랭킹 리스트에서는 `i` 인덱스 직접 사용 (중복 계산 없음)

## 뉴비 시스템 (v2.3.0, 시즌 1 이식 v2.31.5~)
- `/players/{key}.isNewbie: boolean` — 뉴비 마크 여부
- **부여/해제**: 라이브용 계정에서만 가능
  - 랭킹 탭 → 각 행 우측 🌱 버튼 (즉시 적용)
  - 랭킹 탭 → 프로필 편집 → 뉴비 마크 체크박스 (저장 시 반영)
- 팀 결과 카드 하단에 뉴비 보너스 안내 표시, `isNewbie()` 헬퍼로 현재 여부 조회

### 시즌 0 (MMR 승점)
- **뉴비 팀원과 승리 시** (뉴비 본인 제외): +3pt 추가, +5G 추가
- **뉴비 팀원과 패배 시** (뉴비 본인 제외): -4pt (기존 -7pt)
- **뉴비 본인 패배 시**: -2pt (기존 -7pt → 대폭 완화, 0pt는 랭킹 인플레 유발)
- `calcScore()` / `calcGoldFromMatches()` 에서 `matchTime >= getNewbieSince(name)` 로 뉴비 ON 이후 경기만 보너스

### 시즌 1 (LP 시스템, v2.31.5~)
- **정규전 승리**: 뉴비 팀원 있으면 **+3 LP 추가** (+20 → +23), +5G 유지
- **정규전 패배 (본인 뉴비 아님)**: 뉴비 팀원 있으면 **-3 LP 완화** (-14 → -11)
- **정규전 패배 (본인 뉴비)**: **-5 LP** (기본 -14 → -5, ~64% 완화)
- **배치고사 뉴비 본인**: 5판 완료 시 `effectiveWins = min(5, wins + 1)` — 실질 1패 무시 효과 (0승 → 1승=25LP 브론즈, 3승 2패 → 4승=100LP 실버 0LP)
- **승급전·강등 구간**: 뉴비 보너스 **미적용** (공정 경쟁 유지)
- **`s1_gamble` 활성 시**: 뉴비 보너스 전부 **무시** — 도박권은 순수 리스크 보장 (S0 `gamble` 도박 주사위와 동일 철학)
- 상수: `S1_NEWBIE_WIN_BONUS_LP=3`, `S1_NEWBIE_LOSS_REDUCE_LP=3`, `S1_NEWBIE_SELF_LOSS_LP=5`
- 함수: `s1ApplyMatchResult(name, won, activeS1Item, hasNewbieTeammate, iAmNewbie)` — 뉴비 파라미터 수신. `s1ApplyAllMatchResults` 에서 팀 기반으로 계산 후 전달
- UI: 뉴비 뱃지 🌱 툴팁이 시즌에 따라 `newbie_bonus` / `newbie_bonus_s1` 로 자동 전환 (LP 수치·배치 보정·승급전 미적용 안내 포함)

## 부가 기능
- **연승/연패 표시**: 2연속 이상 시 랭킹/팀카드에 표시
- **승급찬스/강등위기**: 다음 경기 결과 시뮬레이션으로 티어 변동 예고
- **케미 링**: 같은 팀 3판↑ 높은 승률 쌍 — 원형 컬러 링
- **웬수 링**: 같은 팀 3판↑ 40% 이하 승률 쌍 — 사각 컬러 링
- **본인 닉네임 선택**: localStorage 저장, 내 정보 바에 골드 표시
- **프로필 모달**: 바텀 시트 방식, 챔프 클래스·한마디·통계 한 번에 편집
- **챔피언 클래스**: assassin(암살) / warrior(전사) / marksman(원딜) / mage(법사) / tank(탱커) / support(서폿)

## 기본 팀원 (DEFAULT_MEMBERS)
앱 최초 실행 시 Firebase `/players`에 자동 등록:
`애긔반달곰`, `ap렉사이서폿`, `울퉁쓰`, `빛나는언즈`, `나랑듀오해듀오`, `맹독 벌꿀오소리`, `브랜딩프로`, `신규회원임`, `조조와빈찬합`

## Riot API 연동 계획 (v2.10.0~)
- **1단계 (완료)**: 플레이어 프로필에 Riot ID 등록 — `/players/{key}.riotId` (형식: `닉네임#태그`)
- **2단계 (완료)**: Firebase `/config/riotApiKey` 에서 API Key 로드 + PUUID 조회 저장
  - `lookupRiotId(fbKey)` — Riot ID → PUUID 조회 후 `/players/{key}.puuid` 저장
  - `onValue(ref(db,'config/riotApiKey'))` 로 키 실시간 수신 (코드에 키 없음)
- **3단계 (완료)**: 게임 자동 감지 + 승패 자동 판정 (v2.11.0)
  - `startGameDetection()` — makeTeams() 완료 후 자동 시작
  - `pollGameStatus()` — 30초 간격 Spectator API 폴링 (kr.api.riotgames.com)
  - `fetchMatchResult()` — 게임 종료 후 Match-v5 API로 결과 조회 (최대 6회 재시도)
  - `showAutoResultPopup()` — 자동 감지 결과 표시 + selectWinner() 자동 호출
  - 감지 실패 시 수동 입력 fallback
  - `stopGameDetection()` — saveMatch() / resetSession() 시 폴링 중단
  - UI: `#game-detection-status` — 감지 상태 실시간 표시
- **API Key 관리**: Firebase `/config/riotApiKey` 에 저장 (24시간마다 갱신 필요)

## 코드 규칙
- 모든 사용자 입력은 `escHtml()` 이스케이프 (`&` `<` `>` `"` `'` 포함)
- 이름 비교는 항상 `normName()` 사용 (trim + 연속 공백 단일화)
- Firebase 변경은 `onValue` 리스너가 자동으로 UI 갱신
- 이벤트 매치 결과는 Firebase에 저장하지 않음
- CSS 변수는 `:root`에서 관리 (`--gold`, `--blue`, `--red`, `--tier-*` 등)
- CSS 중복 선언 금지 (과거 버그 — 같은 클래스 두 번 정의된 적 있음)

## LCU 브릿지 (aram-bridge)
- 리포: https://github.com/SOHADA2/aram-bridge (로컬: `C:\Users\so\aram-bridge`)
- 현재 버전: v1.1.27
- 배포 형태: GitHub Releases에 ZIP (exe + `이 파일을 실행해 주세요.vbs`) 업로드
- 웹사이트 다운로드 링크: GitHub API로 최신 릴리즈 .zip 에셋 자동 감지 (`index.html` line ~3510)

### 빌드
```
cd C:\Users\so\aram-bridge
node node_modules\pkg\lib-es5\bin.js . --targets node18-win-x64 --output dist/aram-bridge-vX.X.X.exe
```

### 릴리즈
```
Compress-Archive -Path dist/aram-bridge-vX.X.X.exe, "이 파일을 실행해 주세요.vbs" -DestinationPath dist/aram-bridge-vX.X.X.zip
gh release create vX.X.X dist/aram-bridge-vX.X.X.zip dist/aram-bridge-vX.X.X.exe --repo SOHADA2/aram-bridge
```

### 주요 구조
- `index.js` — LCU 폴링 + Firebase 전송 + HTTP 상태 페이지(7654포트)
- `이 파일을 실행해 주세요.vbs` — 런처 (CP949 인코딩, Zone.Identifier 자동 해제 후 exe 숨김 실행)
- 상태 페이지: `/api/status` (JSON), `/api/shutdown` (POST → 종료)

## 막고라 매치 시스템 (v2.39.0~, v2.40.x 대규모 개선)
최소 5인 세션에서 파이터 2명이 1:1 대결, 나머지는 관전자로 배팅 참여하는 미니게임.

### 발동 조건 및 UI
- `sessionPlayers.length >= 5` 이고 `liveMode` 일 때 막고라 드롭다운 항목 활성화
- 매치 타입 드롭다운 3번째 항목 (일반/이벤트/막고라), 조건 미충족 시 dim 처리
- 막고라 진행 중에는 `make-teams-btn`(팀짜기) 비활성화
- **`type="module"` 주의**: HTML onclick 사용 함수는 반드시 `window.*` 등록 필요

### Firebase 데이터 구조
```
/magolla_matches/{matchId}
  status: 'betting' | 'closed' | 'settled' | 'cancelled'
  fighter1: string          // 파이터 1 이름
  fighter2: string          // 파이터 2 이름
  spectators: string[]      // 관전자(배팅자) 이름 배열 (3명)
  bettingStartAt: number    // 배팅 시작 타임스탬프
  createdBy: string         // 생성자 이름
  season: number
  bets: {
    [normName]: {
      winner: string        // 승리 예측 이름
      cond: 'tower'|'kill2'|'cs100'  // 승리 요건 예측
      amount: number        // 배팅 금액 (10~100G, step 10)
      betAt: number
    }
  }
  result: { winner: string, cond: string }  // 라이브 결과 입력
  payouts: { [normName]: number }           // 정산 후 net 골드 (파이터: 절대값, 관전자: net)
  status: 'settled' → payouts 확정

/session/magollaMatchId: string | null  // 활성 매치 ID — 모든 기기 전파용
```

### 골드 처리
- **배팅 시**: 관전자 `goldSpent += amount` (선차감)
- **정산 시**: `mgSettleMatch()` — `goldSpent` 복구 후 `magollaHistory` 배열에 net delta 기록
- **취소 시**: `mgCancelMatch()` / `mgForceCancel()` — 모든 배팅자 `goldSpent -= amount` 환불
- **파이터**: goldSpent 변동 없음, magollaHistory goldDelta로만 earned 증가
- `calcMagollaGold(history)` — `magollaHistory_s1` 배열 합산, `calcPlayerGoldEarned`에 통합

### 배팅 배율 (군중 배율)
- 승자 예측 단독: ×1.4 / 다수 중 소수: ×1.0 / 전원 동일: ×0.8
- 요건 예측 단독: ×1.6 / 다수 중 소수: ×1.0 / 전원 동일: ×0.75
- 둘 다 맞춤: `amount × 2.20 × wm × cm`
- 하나만 맞춤: `amount × 0.88 × wm` 또는 `amount × 1.08 × cm`
- 파이터: 승리 +100G / 패배 +50G (`MAGOLLA_FIGHTER_WIN/LOSE`)

### 상태 흐름
```
null → 'betting'(90초) → 'closed'(타이머 만료)
                       → 'settled'(라이브 결과 입력 후 mgConfirmResult)
                       → 'cancelled'(매칭 취소 버튼)
```
- `closed` 상태: 배팅 마감, 라이브 결과 입력 대기 (UI에 "마감" 표시)
- `settled` → `session/magollaMatchId = null` 자동 초기화
- `cancelled` → `session/magollaMatchId = null` + 모든 기기 모달 즉시 닫힘

### 핵심 변수 (전역)
```javascript
let magollaState      = null;  // null | 'active' | 'settled'
let currentMagollaId  = null;
let magollaData       = null;  // onMagollaUpdate에서 최신 snap.val() 캐시
let magollaUnsubscribe   = null;
let magollaTimerInterval = null;
let _mgSelectedWinner = null;  // 배팅 뷰 로컬 선택값
let _mgSelectedCond   = null;
let _mgResultWinner   = null;  // 라이브 결과 입력 선택값
let _mgResultCond     = null;
let _mgBettingTabFocused = false; // 관전자 배팅탭 자동포커스 1회 가드
const MAGOLLA_BET_DURATION = 90000; // 90초
```

### 파이터 선정 로직 (v2.40.13~)
- 전체 쌍(C(n,2))을 `weight = 1/(LP차이+20)` 가중치 랜덤으로 선택 — LP 밸런스 유지하되 다양한 매치업 가능
- 직전 정산 완료된 파이터 쌍은 `localStorage('mgLastFighters')`로 저장 → 다음 매치에서 weight=0 제외

### 파이터 카드 표시 정보 (v2.40.x~)
- 티어/LP, 전체 승률/전적, 평균 KDA (K/D/A 3열 그리드), 연승/연패 배지, 최근 5경기 폼 도트
- `mgAvgKda(name)` — `Object.values(matches)` 순회, participants KDA 집계
- `mgRecentForm(name, n)` — 최근 n경기 W/L 배열
- `mgHeadToHead(n1, n2)` — 서로 다른 팀에 속했던 경기에서의 팀경기 승부 전적
- 배팅 뷰 매치업 헤더 아래 `.bet-fighter-info` 패널: KDA + 폼 도트 (라이브/파이터/배팅자 모두 표시)

### 브릿지 충돌 방지 (v2.40.16~17)
막고라 1v1 게임 종료 시 브릿지 이벤트가 일반 매치 UI를 오염하지 않도록 `magollaState === 'active'` 가드:
- `bridge/eogStats` → EOG 오버레이 차단
- `bridge/matchData` → EOG 오버레이 차단
- `bridge/voteStarted` → 탭 전환/배너 차단
- `bridge/gamePhase → InProgress` → `currentMatchParticipants` 오염 차단

### 핵심 함수
- `openMagollaModal()` — 새 매치 생성 + session/magollaMatchId 저장 + 모달 오픈
- `closeMagollaModal()` — 모달 닫기 (settled/cancelled 시 상태 초기화)
- `onMagollaUpdate(snap)` — Firebase 실시간 업데이트 핸들러, 모든 뷰 렌더링
- `mgStartTimer(data)` — 90초 카운트다운, 만료 시 liveMode 기기가 status='closed' 기록
- `mgConfirmBet()` — 배팅 확정/수정 (재배팅 허용, goldSpent 차액 조정)
- `mgConfirmResult()` — 라이브 전용, 결과 입력 후 mgSettleMatch 호출
- `mgCancelMatch()` — UI 취소 버튼 (확인 다이얼로그 포함)
- `mgForceCancel(matchId?)` — 콘솔 강제 취소/환불 (matchId 없으면 session에서 자동 조회)
- `diagMagolla()` — 콘솔 진단 함수

### 전파 메커니즘
- 호스트 기기: `push(magolla_matches)` → `set(session/magollaMatchId, matchId)`
- 다른 기기: `onValue(session/magollaMatchId)` 감지 → 자동 모달 오픈 + 리스너 구독
- 관전자: 첫 onMagollaUpdate 시 배팅 탭 자동 포커스 (`_mgBettingTabFocused` 가드)

### 주의사항
- `type="module"` 스크립트라 onclick 함수는 반드시 `window.함수명` 으로 등록해야 함
- `cancelled` 상태 수신 시 `onMagollaUpdate`에서 `magollaState=null` 먼저 세팅 후 `closeMagollaModal()` 호출
- 파이터 통계 헬퍼는 전역 `matches` 객체 사용 (`Object.values(matches)`) — `allMatches`는 함수 내 지역 변수라 접근 불가

---

## 세션 작업 이력

> 새 세션 시작 시 이 섹션을 읽어 최근 맥락 파악. 작업 완료 후 업데이트할 것.

### v2.43.x (2026-05-22) ← 최신

#### 릴레이 보드 UI + 버그 수정 집중 (v2.43.21~32, 다른 컴퓨터 작업)

- **v2.43.21**: 릴레이 30칸 완료 후 패스 탭 노란 dot 오표시 수정
  - `updateS1PassTabBadge` / `updateRelayEventBtn` 두 곳에 `Math.min(..., 30)` 캡 추가
- **v2.43.22**: 릴레이 완주 후 출첵 0G 버그 수정
  - 30스텝 완료 후 이후 출첵에서 슬롯당 50G 기본 보상 지급 (attendanceHistory.gold 기록)
- **v2.43.23**: `migrateRelayBase()` 비활성화 — `relayBase > relayClaimed` 상태 야기하는 근본 원인
- **v2.43.24**: `fixRelayBaseOnly()` 도입 — relayBase > relayClaimed인 유저 6명 relayBase=0 일괄 초기화
  - 영향 유저: 애긢반달곰·신규회원임·울퉁쓰·브랜딩프로·조조와빈찬합·빛나는언즈
- **v2.43.25**: `fixRelaySogeup()` — 전원 relayClaimed 소급 + 마일스톤 아이템 자동 지급 (→ 과지급 발생)
- **v2.43.26**: `revertRelaySogeup()` — v2.43.25 과지급 롤백, 원본값 스냅샷 복원
  - `fixRelaySogeup`은 빈 함수로 비활성화 유지, `fixRelayBaseOnly`만 앱 로드 시 실행
- **v2.43.27**: **릴레이 보상 전면 상향** — 일반 칸 20G→**50G**, 마일스톤 전체 상향, 총합 **2160G**
  - Day5: 40→70G+LP2x / Day10: 55→100G+LP2x / Day15: 65→130G+도박권
  - Day20: 90→160G+승급전방어권 / Day25: 110→200G+LP2x / Day30: 160→300G+LP2x
- **v2.43.28**: LP 2배권 EOG 표시 버그 수정 + 아이콘 개선
  - `renderRelayBoard`의 `rlb-lp2x` 텍스트 뱃지 분기 제거 → `SHOP_ITEMS.icon` SVG로 통합
  - `s1Resimulate()`에 s1_lp2x 분기 추가 (재시뮬 시 +40LP 적용)
  - `buyItem`에 `relayOnly` 가드 추가 (콘솔 익스플로잇 방어)
- **v2.43.29**: LP 2배권 릴레이 보드 아이콘 SVG 적용 완료
- **v2.43.30**: 릴레이 보드 UI 정리
  - 팀원 현황 기본 접힘, 출석법 호버 툴팁 추가
- **v2.43.31**: 릴레이 보드 UI 개선
  - 타이틀 크기/정렬, 단계 표시, 보상판에 출석 버튼 추가
- **v2.43.32**: 릴레이 보드 오전/오후 출첵 상태 텍스트 제거 (오늘 둘 다 완료 시에만 표시)

#### LP 2배권 (s1_lp2x) 아이템 설계
- `relayOnly:true`, `price:0` — 상점에서 구매 불가, 릴레이 보상으로만 획득 (Day5/10/25/30)
- 정규전 전 활성화 시: 승리 → **+40 LP** / 패배 → 아이템 소모 + **-14 LP** (일반 패배)
- 배치고사·승급전 중 사용 불가

#### 현재 RELAY_REWARDS 구조 (v2.43.27~)
```
총 2160G = 24칸×50G + 마일스톤 6개(70+100+130+160+200+300)
Day5:+LP2x  Day10:+LP2x  Day15:+도박권  Day20:+승급전방어권  Day25:+LP2x  Day30:+LP2x
```

#### 릴레이 소급/마이그레이션 함수 현황
- `migrateRelayBase()`: **비활성화** (v2.43.23~, 과지급 원인)
- `fixRelaySogeup()`: **빈 함수** (v2.43.26 롤백)
- `revertRelaySogeup()`: v2.43.25 과지급 복원용 (앱 로드 시 실행)
- `fixRelayBaseOnly()`: relayBase>relayClaimed 초기화만 수행 (앱 로드 시 실행)

#### 릴레이 출석 호환성 (v2.43.15~17)
- **v2.43.15**: `relayBase_s1` 필드 도입 — v2.43.14 이전 유저의 이중 골드 지급 방지
  - `calcRelayGold(claimed, base)` — `RELAY_REWARDS.slice(base, claimed)` 합산
  - `calcPlayerGoldEarned`에서 `relayBase` 참조
  - `doAttendance`에서 `isLegacyUser` 판별 후 `newBase` 설정
- **v2.43.16**: `migrateRelayBase()` — v2.43.14 창 유저 자동 마이그레이션 (출석 이력 기반 `correctBase` 계산)
- **v2.43.17**: `attendanceHistory` 항목에 `relayStep` 필드 추가 (출석 시 현재 릴레이 단계 기록)

#### 챔피언 가챠 개편 (v2.43.18~20)
- **v2.43.18**: 1성 → **파편** 리네임 (배경만 존재, 누끼 없음, 효과 없음)
  - `GACHA_TIER_KR`, `GACHA_STAR_LABEL`, `GACHA_STAR_FLAVOR` 갱신
  - `_gachaCardHtml`: `isShard = star===1` 분기 — 파편은 petWrap/roleText/효과 미표시
- **v2.43.19**: 가챠 확률 복원 — 파편 87% / 2성 10% / 3성 3% (`gachaRollStar` 정상화)
- **v2.43.20**: **시너지 시스템 전면 개편**
  - `GACHA_CHAMPS`에 `faction` 필드 추가 (ionia/void/bilgewater/demacia/shurima/null)
  - `GACHA_SYNERGY_GROUPS` 3개 → **11개** (역할 6 + 진영 5)
    - 역할: 검을 뽑아라(전사), 신성한 개입(서폿), 탄환 세례(원딜), 그림자 주자(암살자), 강철 심장(탱커), 유레카(마법사)
    - 진영: 검무(아이오니아), 공허 균열(공허), 골드 강탈(빌지워터), 여명의 의지(데마시아), 나는 왕이다(슈리마)
  - 카드 개별 타입/효과 표시 제거 (`GACHA_PET_TYPE`, `GACHA_EFFECT_TXT`, `GACHA_SET_CFG` 폐기)
  - **시너지 효과**: 발동률 2성=10% / 3성=20%, 효과값은 멤버수 기준 (2명→약, 3명→중, 4명→강)
  - **토글 조건**: 2성 토글 = 전원 s2≥1 / 3성 토글 = 전원 s3≥1, 동시 1개만 활성화
  - Firebase: `activeSynergy_s1: {sid, tier}` 저장
  - `_renderSynGroup()`: 시너지 row 렌더 (챔피언 실루엣 줄 + 토글 버튼 + 효과 미리보기 드롭다운)
  - `window.toggleGachaSynergy(sid, tier)`: 토글 ON/OFF + Firebase 저장
  - CSS: `.syn-row`, `.syn-fig`, `.syn-toggle`, `.dex-syn-group` 등 시너지 row 스타일 추가

#### 시너지 효과 설계
| 시너지 | 이름 | 효과 타입 | 효과값 |
|--------|------|----------|--------|
| 전사(3명) | 검을 뽑아라 | 승리 LP | +6 |
| 서폿(2명) | 신성한 개입 | 패배 LP 방어 | -3 방어 |
| 원딜(3명) | 탄환 세례 | 승리 LP | +6 |
| 암살자(3명) | 그림자 주자 | 출석 골드 | +12G |
| 탱커(4명) | 강철 심장 | 패배 LP 방어 | -8 방어 |
| 마법사(3명) | 유레카 | 출석 골드 | +12G |
| 아이오니아(2명) | 검무 | 승리 LP | +4 |
| 공허(2명) | 공허 균열 | 패배 LP 방어 | -3 방어 |
| 빌지워터(2명) | 골드 강탈 | 출석 골드 | +8G |
| 데마시아(3명) | 여명의 의지 | 승리 LP | +6 |
| 슈리마(4명) | 나는 왕이다 | 승리 LP | +9 |

#### 다음 작업 (미구현)
- 시너지 실제 효과 적용 로직 (`activeSynergy_s1` 읽어서 경기 결과·출석 시 LP/골드 발동 계산)
- 챔피언 이미지 파일 (`assets/pets/{slug}/silver|gold|prism/default.png`) 준비
- 뽑기 기능 활성화 (현재 "준비 중" 상태)

### v2.42.x (2026-05-21)
- **v2.42.0~3**: 챔피언 가챠 시스템 index.html 통합
  - 상점 탭 "펫" 카테고리 → 뽑기/카드/도감 3탭 구조
  - RPG 카드 디자인: `aspect-ratio:5/7`, `.pc-art/.pc-vignette/.pc-top/.pc-pet-wrap/.pc-bottom`
  - `GACHA_CHAMPS` 18종 (desc 필드 추가, DrMundo role fighter 수정)
  - `GACHA_SYNERGY_GROUPS`, `GACHA_PET_TYPE`, `GACHA_EFFECT_TXT`, `GACHA_TIER_PATH` 등 상수
  - `_gachaCardHtml()`, `_gachaDexFigure()`, `renderGachaDex()`, `showGachaCardZoom()` 함수
  - 카드 줌: `#card-zoom-overlay` > `.cz-wrap` > `.cz-card-host` + `.cz-detail` (역할칩/타입/효과/설명/합성)
  - 뽑기/합성 구매는 "준비 중" 상태 유지 (이미지 미완성)
  - 펫 이미지 경로: `assets/pets/{slug}/{silver|gold|prism}/default.png`
- **v2.42.4**: 팀원용 아이템 페이즈 배너 (`#member-item-phase-bar`)
  - 라이브 계정이 팀짜기 시작 시 비(非)라이브 팀원 전 기기에 탭 무관 전역 표시
  - 타이머(좌) + 구분선 + 아이템 구매·활성화 칩(우) 레이아웃
  - `startItemCountdown()` / `stopItemCountdown()` / `tick()` 연동
  - `_qibRenderChips('mipb-chips', true)` — 기존 qib 칩 재사용
- **v2.42.5**: 팀 결과 UI 개선 3종
  - `#quick-item-bar`: 전체 목록 대신 활성화된 아이템만 뱃지(`.qib-active-badge`)로 표시
  - `closeMatchSummary()`: 닫힐 때 `teams-grid` 재렌더 → LP/티어 즉시 최신화
  - 챌린저 LP: `⚡` 제거, `#ffe040` 노란색, 닉네임-배지 사이 인라인 배치 (`tc-lp-chall`)
- **v2.42.6**: 챌린저 LP + 아이템 페이즈 배너 리디자인
  - 챌린저 `tc-lp-chall`: `lpBefore` 필드로 tp-main-row 내 인라인 배치 확정
  - 배너 골드 테마: 상단 3px 진행바(금→레드), 타이머 32px 금색 + `SEC` 서브라벨, 수직 구분선
  - urgent(≤3초): 전체 보더/타이머/바 레드 + 글로우 애니메이션, `.mipb-wrap.urgent` 클래스

### v2.41.x (2026-05-12~19)
- **v2.41.4**: `calcChampDetail` 시즌 필터 폴백 제거 — S1 브릿지 데이터 없을 때 S0 챔피언이 S1 랭킹에 표시되던 버그 수정. `entries` 없으면 null 반환으로 단순화
- **v2.41.0**: 기록 탭 막고라 파트 추가
  - 시즌 드롭다운에 "⚔️ 막고라" 항목 (`selectViewSeason('magolla')`)
  - `viewSeason` 타입 확장: 숫자 → 숫자 | `'magolla'`
  - `magollaMatches = {}` 전역 캐시 + `/magolla_matches` onValue 리스너
  - `renderMagollaHistory()` — settled 경기만 표시, 파이터 VS 카드 + 배팅 결과 행
  - `window.mgHistoryPreview()` — 콘솔 미리보기 헬퍼 (Firebase 쓰기 없음)
  - `calcMagollaGold(history)` → `calcPlayerGoldEarned`에 통합
- **v2.41.1**: 막고라 기록 카드 색상 — 초록 제거, 보라(`#b48aff`) + 금빛(`var(--gold-light)`) 통일
- **v2.41.2**: 막고라 인트로 팝업 (`#mgintro-popup`, `.mgintro-*` CSS)
  - 앱 로드 후 1.4초 뒤 표시 (`showMgIntro()` in `renderAllWhenReady`)
  - `localStorage.mgIntroSeen = '1'` 시 영구 숨김 ("다시 안보기")
  - "확인" 버튼은 세션 닫기만 (다음 접속 시 재표시)
- **v2.41.3**: 이스터에그 2종
  - `_eggChaos()` — `h1` 1.6초 내 10회 연타 → 텍스트 변경 + shake + 이모지 낙하 3초
  - `_lateNightEgg()` — 새벽 2~4시 접속 시 시간대별 토스트 (`.late-toast` CSS)
- **v2.41.22**: 대기 화면 패스 탭(전투/지원) + 지원 패스 순차 언락; 펫 시스템 추가 후 revert (미완성)
- **v2.41.23**: EOG 투표 UI 색상 통일
- **v2.41.24**: EOG 카드 1~2인 시 초상화 비율 버그 수정
- **v2.41.25**: 팀 재구성(recompose) 기능 — 기존 체크 유지 수정
- **v2.41.26**: EOG 투표 카드 전적 표시 (KDA, 딜량, CS)
- **v2.41.27**: EOG 카드 증강 아이콘 초기 구현
- **v2.41.28**: EOG 증강 아이콘 옵션 B 확정 (KDA + 딜량 + 증강, CS 제거)
  - 증강 아이콘 크기 버그 수정: `.eog-cc img` → `.eog-cc>img` (CSS 특이성 충돌)
  - 증강 호버 툴팁 (`showAugTip/hideAugTip` 재활용)
  - 툴팁 raw 변수 문자열(`@var@`, `%var%`) 제거 — `stripTags` 정규식 보강
  - 희귀도 레이블: "프리즈매틱" → "프리즘" (`kPrismatic` rMap)
  - `__mockEog()` 콘솔 헬퍼 추가
- **v2.41.29**: 대기 화면 패스 탭 텍스트 줄바꿈 수정 (`white-space:nowrap`)
- **v2.41.30**: 패스 탭 이모지 제거 (⚔️전투→전투, 🤝지원→지원); 대기 화면 챔피언 카드 "전체 보기 ›" 버튼
- **v2.41.31**: 챔피언 풀 카테고리 필터 — 주력(첫 번째) 태그만 사용 (`champTags[slug][0]`), 베인/트위치/야스오 암살자 오분류 수정
- **v2.41.32**: 챔피언 풀 필터 탭 카테고리별 챔피언 수 표시
- **v2.41.33**: 팀 결과 카드 LP 텍스트 표시 (티어 배지 옆 `tc-lp-mini`)
- **v2.41.34**: `APP_VERSION` 상수 버그 수정 (v2.41.28에 고착됨); 챔피언 풀 승률 바 (wins/losses 텍스트 대체, `cp-wr-bar`)
- **v2.41.35**: 참가자 선택 목록 승률 % 만 표시 (wins/losses 제거); LP 바 추가 (`sp-lp-wrap/bar/fill`)
- **v2.41.36**: 팀 결과 카드 LP 바 1차 (티어 배지 아래)
- **v2.41.37**: 팀 결과 카드 LP 바 최종 — 닉네임-티어 사이 전체 너비 배치
  - `.team-player` column flex 재구성, `.tp-main-row` + `.tp-lp-row`
  - 일반 티어: lp/100% 바 + "XX LP" / 승급전: promoWins/2 바 + "XW/XL" / 챌린저: LP 텍스트만 / 배치: 바 없음
- **(다른 컴퓨터, v2.41.37 이후 — APP_VERSION 미변경)**
  - **퀵 아이템 바** (`renderQuickItemBar`, `_qibRender`): 아이템 사용 시간 중(`#quick-item-bar-prep`) + 팀 결과 화면(`#quick-item-bar`) 두 곳에 표시
    - 라이브 계정/이벤트 매치에서는 숨김; 팀 결성 전(allowBuy=true)은 구매 가능, 후(false)는 상태 표시만
    - `quickToggleItem(idx)` / `quickBuyItem(itemId)` — window 등록, toggleItemActive와 동일한 충돌 검사 적용
    - CSS: `.qib-wrap`, `.qib-chip`, `.qib-icon`, `.qib-btn`, `.qib-status` 등
  - **관전 패스 버그 수정** (`calcS1PassStats`): 관전자는 teamA/B에 없으므로 `spectatorPicks` 기반 별도 스캔 분리 — specTotal/specCorrect 누락 수정
  - **복권 통계 헬퍼** (`window.lotteryStats()`): 전체 팀원 복권 현황 요약 `console.table` 출력 (일반/프리미엄/순이익/최고당첨, 하우스 수익 합계)
  - **펫 목업** (`pet_mockup.html`): 사이트 톤앤매너 리디자인, 드라마틱 가챠 리빌 연출, RPG 장비창 스타일 장착 UI, 프로필 모달 peek 애니메이션 (index.html 미통합)

### v2.40.x (다른 컴퓨터 작업)
- **v2.40.0~1**: 막고라 CSS/JS/HTML 전면 재구현, 드롭다운 3번째 항목으로 이동
- **v2.40.2~7**: 버그 수정 (onclick, disabled, 역할 판정 등) + 콘솔 헬퍼
- **v2.40.8**: `mgPreview()` 콘솔 UI 미리보기
- **v2.40.9~11**: 모바일 이름 말줄임 수정
- **v2.40.12~13**: 파이터 선정 가중치 랜덤(LP 차이 역비례)
- **v2.40.14**: 취소 후 버튼 상태 초기화 버그 수정
- **v2.40.15**: `mgLastFighters` localStorage — 직전 파이터 쌍 재선정 제외
- **v2.40.16~17**: 브릿지 이벤트 오염 방지 (EOG/matchData/voteStarted/InProgress 가드)
- **v2.40.18~24**: 파이터 카드 — 폼 도트, 연승배지, H2H 전적, avg KDA(K/D/A 3열)
- **v2.40.25**: 배팅 뷰 `.bet-fighter-info` 패널 — 모든 역할 KDA+폼 도트

### 다음 작업: 펫 시스템 (미구현 — 설계 확정)

#### 최종 확정 설계
- **50G 뽑기** → 항상 **기본 클래식 포로** 지급 (랜덤 아님)
- **1판 완료** → 10종 중 랜덤 변신 (이게 수집 요소, 레벨 시스템 없음)
- 스페셜(cosplay5) 확률 미확정 (유저에게 물어볼 것: 5%? 10%?)
- 기존 펫 보유 중 뽑기 시 "기존 포로가 사라집니다" 경고 팝업 필수
- **컬렉션(도감)**: 한 번이라도 획득한 포로는 영구 기록 (펫 교체해도 도감은 유지)
- 1인 1펫 — 동시에 여러 마리 보유 불가

#### 이미지 소스 (Community Dragon CDN)
```
기본 포로 (항상 이 이미지로 시작):
https://raw.communitydragon.org/latest/game/assets/characters/petporo/hud/loadscreen_poro_base_classic_tier1.png

변신 후 랜덤 10종 (variant1~5 + cosplay1~4 + cosplay5스페셜):
https://raw.communitydragon.org/latest/game/assets/characters/petporo/hud/loadscreen_poro_base_variant{1~5}_tier1.png
https://raw.communitydragon.org/latest/game/assets/characters/petporo/hud/loadscreen_poro_cosplay_cosplay{1~4}_tier1.png
https://raw.communitydragon.org/latest/game/assets/characters/petporo/hud/loadscreen_poro_cosplay_cosplay5_tier1.png  ← 스페셜
```

#### Firebase 데이터 구조 (추가 필드)
```
/gold/{key}
  pet_s1: {
    type: 'classic' | 'variant1'~'variant5' | 'cosplay1'~'cosplay5' | null
    obtained: number   // 변신 완료 timestamp (null이면 아직 기본 포로 상태)
    pulledAt: number   // 뽑기 timestamp
  }
  petLog_s1: string[]  // 도감 — 획득한 type 문자열 배열 (중복 제거, 영구 누적)
```

#### UI 구현 위치
- 상점 탭(`🛒 상점`) 내 새 카테고리 **"🐾 펫"** 추가
- 뽑기 버튼 (50G), 보유 펫 카드 표시 (loadscreen 이미지 카드 스타일)
- 1판 대기 중: 기본 포로 카드 + "다음 경기 후 변신!" 안내
- 컬렉션 그리드: 11종, 미획득은 실루엣(filter:brightness(0) opacity(0.2)) + 🔒
- 카드 스타일: 세로 카드, 아트 위/이름 아래, rounded border

### v2.38.x ~ v2.39.x
- **v2.39.0**: 막고라 매치 JS 최초 구현 (v2.40에서 전면 재구현)
- **v2.38.21**: 패스 탭 출석 제거 + 상단 버튼 glow 애니메이션
- **v2.38.18~20**: 랭킹 me-tag 위치 조정, 상단바 출석 퀵버튼
- **v2.38.8**: 챔피언 이름 전역 한글화 (`loadChampNamesKR()` 앱 초기화 시 선로드)
- **v2.38.7**: 대기화면 챔피언 한글명, `renderS1WaitingCard` async 전환
- **v2.38.0~6**: 유료 패스 2종 (전투/지원 패스권 500G, 25레벨), 패스 탭 UI 정리
