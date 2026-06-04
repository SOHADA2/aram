# 무작위 총력전 아수라장 내전 (ARAM Custom Team Builder)

## 프로젝트 개요
- 롤 칼바람 내전 팀짜기 **단일 HTML 웹앱** (`index.html`)
- Firebase Realtime Database로 실시간 데이터 동기화
- GitHub Pages 배포: https://sohada2.github.io/aram/
- 저장소: https://github.com/SOHADA2/aram
- 현재 버전: v2.44.3 (시즌2 엠블럼 강화 + 패스 재편 구현 완료 / 브릿지 aram-bridge v1.1.31 릴리즈 완료)
- ⚠️ **시즌2 작업 중** — 아래 "시즌 2 (헥스텍/마법공학)" 섹션 필독 (진행상황·확정정책·신규콘텐츠 기획 전부 정리됨)

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
| 🤫 비밀 퀘스트 토큰 | 200G | 구매 즉시 자동 활성화(v2.43.47~) · 다음 정규전에 본인만 보이는 비밀 퀘스트 · 적중+승리 +500~1000G · 적중+패배 LP 감소 완화 · 1일 2회 · 매치당 1회 | S1 |
| 🎫 일반 복권 | 100G | 스크래치 5칸 · 꽝 32% · 클로버 50G~왕관 800G · 한도 없음 (v2.43.91~) | S1 |
| 🎫 고급 복권 | 300G | 스크래치 6칸 · 해골 1개 완전공개 시 -200G 패널티 · 클로버 180G~왕관 3500G | S1 |
| 🎫 프리미엄 복권 | 600G | 스크래치 7칸 · 해골 2개 (각 -400G) · 클로버 500G~왕관 10000G · 레이어 4중 | S1 |
| 🪙 긁기 동전 | 200G | **영구 소유** · 모든 복권 브러시 크기 2배 자동 적용 (v2.43.96~) | S1 |
| 🔑 만능 긁개 | 500G | **영구 소유** · 브러시 3배 + 레이어 공개 임계값 55%→35% 완화 (v2.43.96~) | S1 |

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

## 📋 업데이트 노트 정책 (v2.43.263~) — 모든 작업자/컴퓨터 공통
업데이트 노트(`showChangelog`)는 **두 층**으로 운영한다:
1. **`CHANGELOG_MAJOR`** (팀원용 큐레이션, 모달 상단 카드) — **팀원에게 알려야 할 "큰 신규 기능/중요 변경"만** 넣는다. 진짜 게임 패치노트 톤(이모지 + 제목 + 1~2문장 설명). 예: 신규 미니게임/시스템, 새 콘텐츠, 경제·랭크 구조 변경.
2. **`CHANGELOG`** (상세 개발 로그, 모달 하단 `▸ 전체 변경 내역` 접힘) — 버전별 모든 변경(버그수정·UI 미세조정·내부 리팩터 포함). 기존처럼 자유롭게 누적.
- **새 작업 배포 시 규칙**:
  - 자잘한 수정/개선 → `CHANGELOG`에만 1줄 추가 (지금까지처럼). `CHANGELOG_MAJOR`엔 **넣지 않는다**.
  - 팀원이 알아야 할 큰 기능 → `CHANGELOG`에 상세 + **`CHANGELOG_MAJOR` 맨 위에 큐레이션 1줄** 추가.
  - "이게 팀 단톡방에 공지할 만한가?" 기준으로 판단. 애매하면 MAJOR에 넣지 않는다.
- 다른 컴퓨터에서 작업해도 동일 적용 (이 정책 파일이 기준).

## 🌌 시즌 2 (헥스텍/마법공학) — 진행상황 + 기획 (2026-06-04 갱신, 6/11 증바람 패치 연계)
롤 칼바람 **증강 업데이트(6/11)** 에 맞춰 앱도 **시즌 2** 시작. 비주얼=마법공학(헥스텍), 신규 콘텐츠=증강 연계 엠블럼 강화.
> 📄 **전체 디테일(진단·교훈·정확한 수치·강화/패스 표 전부)은 레포 루트 `SEASON2.md` 참조** — 이 섹션은 요약, SEASON2.md가 완전판.

### ✅ 확정 정책
- **전부 리셋**: LP·티어, 골드, 패스, 쓰레기통, **가챠 컬렉션(완전 리셋 확정)**. S2 필드는 빈 상태 시작.
- **S1 데이터 = 읽기전용 열람 유지** (시즌 셀렉터로 조회, _s1 필드·season1/ 노드 보존·수정 X).
- **⭐ 디자인 = 시즌 정체성 원칙**: 모든 비주얼은 그 시즌 귀속. **시즌 무관하게 쓰이는 디자인 발견 시 사용자에게 반드시 알릴 것.** 티어색(랭크색)만 예외.

### ✅ 코드 반영 완료 (v2.43.273~283, 전부 `season===2`/`.season-2` 게이트라 라이브 S1 무변)
- **작업1 — 시즌 누수 차단**: gold 노드 `_s1` 하드코딩 ~140곳 → `sField()` (v274). `season1/` 노드 → `seasonNode(sub)='season'+CURRENT_SEASON+'/'+sub`, LP/티어·마일스톤 구독을 `subscribeSeasonPlayers()`/`subscribeMilestones()`로 감싸 시즌전환 시 자동 재구독 (v275). 복권 시즌 격리: `lotteryHistory`(무접미사 공유배열)에 `season` 태그 + `calcLotteryGold`에서 `(h.season??1)===CURRENT_SEASON` 필터 (v276). **무회귀**: S1에선 sField(X)===X_s1.
- **프리뷰 툴 (v277)**: 콘솔 `previewSeason(2)`/`previewSeasonOff()` — 이 브라우저만 CURRENT_SEASON 오버라이드(localStorage `aram_season_preview`), 라이브 config·Firebase 안 건드림. 미리보기 중 자동쓰기(seed/migrate/autoCompensate) `__SEASON_PREVIEW` 가드로 차단, switchSeason도 차단. **S2 작업 검증은 이걸로.**
- **헥스텍 테마 (v278~283)**: `season-2` 클래스(CURRENT_SEASON===2 토글, renderHeaderSeasonLabel). `s1-active`(>=1, 동작 22곳)는 유지하고 `.season-2`가 시각을 덮음(.s1-active 뒤 배치). 블랙+골드 팔레트 + `--purple-light` 골드 remap. `body.season-2::before`(블랙+골드모트)/`::after`(골드글로우). `renderSeasonBackground()`+`_buildHexfield(cls,id)`가 육각회로 SVG 주입(육각 변 따라 **랜덤워크 골드펄스**, 중앙편향). 보라 스트래글러 ~35개 `.season-2` 스코프로 골드(비막고라)/레드(막고라) 덮음. 막고라="S2 컨셉의 레드"(메타UI 보라→레드 + 아레나 `#magolla-modal`에 `ensureMagollaHexBg()`로 레드 헥스필드 `.mg-hexfield` 주입). 전적색 정제: `--green/red/blue` remap(승=골드·패=회색·중립=화이트), W/L점·우편함 골드. (목업파일 `시즌2-헥스텍-목업.html`/`막고라-레드헥스텍-목업.html`은 gitignore 로컬전용)

### 🎮 S2 신규 콘텐츠 — "엠블럼 강화 + 패스 재편" (✅ v2.44.0~1 구현 완료 / 일반패스 적립만 브릿지 대기)
> **✅ 구현 완료** — 상세 코드맵·확정수치는 **`SEASON2.md §4` 상단 박스** 참조(완전판). 전부 `CURRENT_SEASON===2` 게이트라 라이브 S1 무영향, `previewSeason(2)`로만 검증.
> - **엠블럼**(index.html ~L7269): `EMBLEM_TICKETS`·`emblemEnhance`·`emblemSellPrice`·`openEmblemModal`/`renderEmblemBody`·연출 `_emblemPlayFx`. 효과: 출석 `doAttendance` · 복권A안 `_applyEmblemLotteryBoost` · 광채 `emblemShineHtml`. 데이터 `emblem_s2`/`emblemTickets_s2`/`emblemSellG_s2`. 판매환급 ~60%.
> - **패스**(엠블럼 블록 뒤): `PASS_TRACKS`·`calcCustomPassPts`(내전 자동)·`claimPassLevel`·`renderS2Pass`/`doClaimPass`(라우터 S2 분기). 데이터 `passCustom_s2`/`passNormal_s2`/`normalGamePts_s2`/`passGold_s2`/`passTitle_s2`. 비밀퀘 토큰 S2 OFF.
> - **⏳ 남은 것**: 일반게임 패스 포인트 적립 = 브릿지 `isCustomGame` 분리 후 `normalGamePts_s2` 적립(현재 `__addNormalPassPts` 디버그 훅만). 내전 패스는 이미 자동.
>
> *(아래 기획 원문은 레퍼런스로 보존)*

**루프**: 일반 증바람 플레이 → 퀘스트(브릿지 검증) → 강화재화 → 엠블럼 강화 → 효과/추격. 골드·재화 싱크로 챌린저 골드고임 해결.

**1) 엠블럼 강화 (메이플 주문서식, 수치 확정)**
- 엠블럼 1개(단일장비, 구매/판매 가능). **슬롯=5**(강화가능수치): 성공/실패 무관 시도마다 1차감, 성공=레벨+1·실패=레벨유지(슬롯만 날림), 5칸 다쓰면 LOCK. 최종레벨=성공횟수. 5칸 시각화(어떤 강화권 성공/실패).
- **레벨(+N)과 성능 분리**: +N=성공횟수(간판), 성능=성공한 칸들의 강화권 기여값 합(진짜 스탯). 같은 +5도 성능 5~30(6배차) → 고성능 추격+실패작 판매.
- **강화권 3종**: 🟢안정 100%/성능+1, 🟡정밀 60%/성능+3, 🔴과부하 30%/성능+6 (30%라 칸당 기대성능 1.0/1.8/1.8 — 밸런스OK).
- **효과(성능 비례)**: 복권 당첨확률 성능×0.2%p(캡+8%p), 출석골드 성능×3G, 광채 성능 1~9실버/10~24골드/25+프리즈매틱+칭호.
- **복권 부스트=A안(꽝→본전)**: 결과는 긁기 전 확률표에서 확정(긁기는 연출), 엠블럼이 꽝 슬라이스를 +X%p 떼서 **본전**으로 이전(잭팟 인플레X, 손실완화). 회수율~80% 싱크 보호.
- **상점가(제안)**: 베이스 엠블럼 150G·안정 40·정밀 100·과부하 250G. **비용감**: 안정路 +5 확정 350G(성능5), 올과부하 +5=~57만G·1/411(0.3^5, 성능30 프리즈매틱).
- **판매**: ✅ `emblemSellPrice` = 베이스150×0.5 + 투입강화권가×0.35 + 성능²×2. 환급률 ~60%(흑자확률 거의0, 저강화 확정이익=인플레라 금지).

**2) 패스 재편 (확정)**
- 🤫 **비밀퀘스트 토큰 → 제거** (S2 UI 게이트 OFF). 잃는것: 패배 LP완화 안전망(수용).
- 🎫 **패스: 전투/지원 → 게임타입별 2종**(둘다 무료): **일반게임 패스**(증바람으로 채움→강화권·엠블럼·소량골드=성장) + **내전게임 패스**(내전으로 채움→골드·칭호/코스메틱·소량강화권=경쟁). 역할분리: 내전=경쟁, 일반=성장.
- **각 10레벨**, 레벨당 200p, 활동으로 포인트 적립(일반: 증바람 1판+10p/승+5p/일일퀘+20~40p · 내전: 1판+15p/승+10p/MVP·매너+10p). ✅ 보상트랙 확정 = `PASS_TRACKS`.

**3) 브릿지 확장 (전제)**
- 일반게임 eog를 내전 흐름과 **분리**: LCU `/lol-gameflow/v1/session`의 **`gameData.isCustomGame`**(브릿지가 이미 이 엔드포인트 읽음, 필드 하나 추가)로 판정 — true=내전(기존 매치저장/투표), false=일반(퀘스트 로그/엠블럼 재화). 보조검증=등록팀원 구성. 6/11에 증바람 일반 queueId 확인.
- 핵심: 브릿지 eog(`/lol-end-of-game/v1/eog-stats-block`)는 **게임종류 무관 양팀 10명 전원** 챔피언·KDA·**증강(PLAYER_AUGMENT_*)**·멀티킬 캡처. **방장 1명 브릿지+같이 증바람 큐 = 함께한 팀원 전원 자동 수집**(전원 설치 불필요, 혼자 게임은 자진신고 폴백). 앱 `augmentMap`: 증강id→이름/아이콘/등급(kSilver/kGold/kPrismatic).

### ⏭️ 남은 작업 + 미정
- **switchSeason S2 버튼**: 현재 S0/S1만. 6/11 임박 시 추가(누르면 전원 즉시 S2 — 신중). 그 전엔 previewSeason(2)로만.
- **S1 읽기전용 열람 재라우팅**: sField/season1Data가 CURRENT_SEASON 전역 → S2 중 viewSeason=1로 S1 LP랭킹/컬렉션 보려면 읽기 경로가 viewSeason 타게 손봐야(전적은 match.season 필터로 됨).
- **~~엠블럼/패스 구현~~ ✅ 완료 (v2.44.0~1)**. 일일퀘 항목·보상량은 실플레이 후 튜닝.
- **일반게임 패스 적립 연결**: 브릿지 `isCustomGame` 분리 후 일반 eog 수신 시 `normalGamePts_s2` 적립 핸들러 추가(현재 `__addNormalPassPts` 디버그 훅만).
- **6/11 확인**: 증바람 일반 queueId, 일반게임 augment가 공개 match-v5에도 오는지(현재 augment는 브릿지 LCU에서만 받음).

## LCU 브릿지 (aram-bridge)
- 리포: https://github.com/SOHADA2/aram-bridge (로컬: `C:\Users\so\aram-bridge` 또는 `C:\Users\sbs_n\Desktop\aram-bridge`)
- 현재 버전: v1.1.31 (롤 재시작 재연결 수정 + 증강 슬롯 동적수집 v1.1.27~)
- ⚠️ 시즌2 확장 예정: 일반게임 eog를 내전과 분리(`gameData.isCustomGame`) → 위 "시즌 2" 섹션 참조
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

### v2.44.0~3 (2026-06-04~05) — 🌌 시즌2 엠블럼 강화 + 패스 재편 + S2 UI 폴리시 ← 최신

> 상세 코드맵·확정 수치는 **SEASON2.md §4 상단 박스**(완전판). 전부 `CURRENT_SEASON===2` 게이트라 라이브 S1 무영향. `previewSeason(2)`로만 검증. 시즌2 미오픈이라 팀원엔 안 보임.

#### v2.44.0 — 마법공학 엠블럼 강화 (4단계, index.html ~L7269 블록)
- **1단계 스키마/코어**: `EMBLEM_TICKETS`(🟢안정100%/+1·40G · 🟡정밀60%/+3·100G · 🔴과부하30%/+6·250G), 슬롯5(시도마다1소모·LOCK), 레벨(+N)=성공수·성능=성공칸 기여합 분리. `emblemEnhance`/`emblemBuyBase`/`emblemBuyTicket`/`emblemSellPrice`. 데이터: `emblem_s2{slots:[{t,ok}],createdAt}`·`emblemTickets_s2`·`emblemSellG_s2`(`calcPlayerGoldEarned` 합산)
- **2단계 UI**: 상점 진입카드(season2 소비탭) → `openEmblemModal`/`renderEmblemBody`(5칸 시각화·강화권 구매·강화·판매). CSS `.emblem-*`
- **3단계 연출**: `_emblemPlayFx`(차징1초→성공 골드파티클/실패 흔들림, `_gSfx.mergeCharge/mergeImpact/reveal`). CSS `.emfx-*`
- **4단계 효과 연결**: 출석 `doAttendance`(`emblemAttendBonus`=성능×3G) · 복권 A안 `_applyEmblemLotteryBoost`(꽝→본전, 성능×0.2%p·캡8%, 4지점: 헬퍼+유료경로+onComplete gold+모달 결과표시) · 광채 `emblemShineHtml`/`emblemGlowMeta`(💠실버/🔶골드/🌈프리즈매틱, 성능25+ "마법공학 장인" 칭호 — 랭킹 hero/mini·프로필 pm-s1-name·대기화면 배지). CSS `.em-shine`/`.em-title`
- **판매공식 결정 (사용자와 논의)**: 환급률 ~60%로 확정. **핵심 교훈: 저강화 확정이익은 절대 금지**(안정 100%라 무한 골드머신=복권 인플레 재현). 운좋아 고성능이면 흑자(도박성·OK). 200만회 몬테카를로로 환급률·흑자확률(거의0) 검증

#### v2.44.1~2 — S2 UI 폴리시 (다른 컴퓨터)
- **v2.44.1**: 📬 우편함 버튼 이모지 → 라인 봉투 SVG(전 시즌 공통). S2에선 has-mail 봉투·배지 골드 통일(빨강 제거, `.season-2 .mb-badge`/`.mailbox-btn.has-mail`). + 엠블럼 슬롯 투명배경 → 불투명(`.emblem-slot` background)
- **v2.44.2**: 🌨️ S2 배경 겹침 — 시즌1 눈보라(`.sf`, z:1)가 헥스텍 위로 흩날리던 것 `body.season-2 .sf{display:none}`로 숨김. S1은 그대로

#### v2.44.3 — 패스 재편 (P1~P4)
- **2종 패스**(무료): 🎮일반게임(증바람·성장)/⚔️내전게임(내전·경쟁), 각10레벨·레벨당200p. `PASS_META`·`PASS_TRACKS`·`PASS_PT_PER_LEVEL=200`·`PASS_MAX_LEVEL=10`
- **포인트**: 내전=`calcCustomPassPts`(S2 매치 순회 자동계산, 1판15·승10·MVP/매너10) / 일반=`calcNormalPassPts`(`normalGamePts_s2` 누적, 브릿지 전제)
- **클레임/UI**: `claimPassLevel`(직전레벨+도달 가드, 강화권/엠블럼/골드/칭호 지급) · `renderS2Pass`/`switchS2Pass`/`doClaimPass`(라우터 `renderAchievementsOrPass` S2 분기). 데이터 `passNormal_s2`/`passCustom_s2{claimed}`·`passGold_s2`(합산)·`passTitle_s2`. 탭배지 `_isS2PassClaimable`. CSS `.s2p-*`
- **비밀퀘 토큰 S2 OFF**: 상점 필터 + `_maybeShowSecretQuestModal` early return
- **보상트랙**: SEASON2.md §4-2 초안 그대로 확정. 10강 칭호 "마법공학 견습"(일반)/"내전의 지배자"(내전)

#### ⏳ 다음 작업 (다른 컴퓨터에서 이어서)
- **일반게임 패스 적립 연결**: 브릿지 `isCustomGame` 분리(SEASON2.md §4-3) 후, 일반 eog 수신 시 `normalGamePts_s2` 적립 핸들러 추가. 현재 `__addNormalPassPts(n)` 디버그 훅만 있음
- **switchSeason S2 버튼 / S1 읽기전용 재라우팅**: 6/11 임박 시 (SEASON2.md §5)
- **6/11 확인**: 증바람 일반 queueId, 일반게임 augment 공개 match-v5 여부

### v2.43.265~272 (2026-06-03) — 출석 버그 긴급 수정 + 브릿지 재연결 패치 + 기록 필터

> v2.43.177~264는 다른 컴퓨터/이전 세션에서 진행(복권 음수 EV 재밸런스·재오픈, 우편함 시스템, 무료 복권권, 가챠 시너지 골드 정리, 챔피언 명대사/음성, 시너지 2성/3성 분리, 브릿지 미연결 수동 투표 등). **상세는 in-app CHANGELOG 참조.**

#### 출석체크 관련 3종 수정 (v2.43.265~268) — 이날 핵심
- **v265 출석 "실패" 오표시**: 출석 시 Firebase 저장은 성공했는데 직후 UI 갱신(우편 배지 등)에서 에러 나면 catch로 떨어져 "❌ 출석 체크 실패" 토스트가 뜸. `doAttendance`에서 **저장과 UI 갱신 분리**(저장 성공=출석 완료, UI 에러 격리) + `updateMailBadge` try-catch 방어
- **v266 출석 진행도 손실 긴급 복구 + 재발 방지** ⚠️ 중요:
  - 7명(신규·울퉁·브랜딩·맹독·조조·나랑·빛나)의 `relayProgress`가 옛 `_RELAY_ROLLBACK` 값으로 되돌려진 사고. **옛 캐시 버전의 `revertRelaySogeup` 재적용이 원인**
  - 복구: `attendanceHistory.relayStep` 최대값 + 오늘 출석분으로 Firebase PATCH (신규15·울퉁23·브랜딩18·맹독18·조조16·나랑23·빛나13). 검증 완료
  - 재발 방지: (1) onValue에서 `revertRelaySogeup()` 호출 제거 (2) **`autoFixRelayShrink()` 신설** — relayProgress < attendanceHistory relayStep 최대면 자동 복구(본인 데이터만, 줄었을 때만 → 루프 없음). 어떤 경로로 줄어도 최신 기기가 즉시 복구
- **v267 릴레이 보드 팀원 현황 실시간 갱신**: 다른 팀원 출석이 열린 보드에 바로 반영 안 되던 것 → onValue(gold)에서 릴레이 모달 열려있으면 재렌더 (복권 Hub와 동일)
- **v268 "다음 받을 칸" ✓완료 오표시**: 오늘 출석 마치면 다음 칸(Day27)에 "✓완료" 배지가 붙어 진행도+1로 보임 → "다음 차례"(중립색)로 교체. 진행도 숫자는 처음부터 정확

#### 기록 탭 "내 경기" 필터 (v272)
- 기록 탭 헤더에 `👤 내 경기` 토글. 본인 1팀/2팀 참여 경기만 필터. `_recordMineOnly` 상태, 시즌 드롭다운과 함께 동작. 닉네임 없으면 버튼 숨김

#### ⏳ 미완 작업 — 브릿지 aram-bridge v1.1.31 (다른 컴퓨터에서 빌드·릴리즈 필요)
**문제**: 라이브 계정이 브릿지 켜고 게임 중 **롤 클라이언트 재시작 시 브릿지가 재연결 못 하고 멈춤** → 다음 단계(EOG 투표) 진행 불가.
- **원인**: 롤 비정상 종료 시 lockfile이 안 지워지고 남음 → 재시작 시 새 port로 덮어써지는데, `_connected=true`라 새 port를 무시하고 죽은 옛 port로 헛요청
- **수정 완료(로컬)**: `index.js`의 `LockfileConnector`에 (1) port 변경 감지 → disconnect 후 재연결 (2) `forceReset()` + poll 연속 4회 실패 시 강제 재연결. package.json 1.1.30→1.1.31
- **⚠️ push 못 함**: codespace 토큰이 `aram` 리포 전용이라 `aram-bridge`에 push 403. → **patch + 가이드를 `aram/bridge-patch/`에 보관**(GitHub에 푸시됨)
- **다른 컴퓨터(aram-bridge 있는)에서 할 일**: `git apply bridge-patch/bridge-v1.1.31.patch` → pkg 빌드 → `gh release create v1.1.31`. (웹앱은 이미 v259~271로 수동 투표 폴백 있어 당장 경기엔 지장 없음). 적용 후 `bridge-patch/` 삭제 가능

#### 웹앱 측 브릿지 끊김 대응 (이미 됨, v259~271)
- 브릿지 죽어도 라이브 계정이 승리팀 수동 선택 → "🏆 MVP·매너왕 투표창 열기" 버튼(`open-vote-btn`, 일반매치 항상 표시) → `session/manualEog` 브로드캐스트 → 전 팀원 투표창

---

### v2.43.175~176 (2026-05-29 후속) — 가챠 시너지 LP 밸런스 + 강탈 재설계 논의

이전 세션에서 가동된 가챠 시너지의 **인플레/밸런스 문제를 점검**하고 LP 증감 시너지를 대폭 하향. 골드 관련 시너지(지원형·탱커 위로금)는 재설계 논의만 하고 **결정 대기 중**.

#### 검증 결과 — 골드 시너지 인플레 위험 (시뮬레이션으로 확인)
- **골드 강탈(steal, 빌지워터)**: 승리 시 패자 전원에게서 per(15/25G) 강탈 → thief 전액 수령. 문제: (1) victim 보유량 미확인 → 음수 클램프(`Math.max(0)`)로 **골드 생성 누수**, (2) 다중 thief 동시 발동 시 한 victim이 여러 번 털림, (3) 시스템 sink 아니라 단순 재분배라 인플레 억제 0
- **신성한 개입(win_gold, 서폿)**: 승리 시 +120/180G **순수 생성**. 5:5 승자 5명 전원 발동 시 최대 **+900G/경기** 무한 생성
- **탱커 위로금(unbreakable)**: 패배 시 +20/40G 순수 생성
- 음수 방지: `getMyGold`/대기화면/골드점검 **표시값엔 `Math.max(0)` 가드 있음** → 표시상 음수 안 뜸. 단 강탈 누수는 그 가드 때문에 발생하는 부작용
- **일반 경기 평균 수령 골드 = 약 35G/인** (시즌1 205경기 기준, 기본 승15/패5 + MVP·매너 각 50G가 거의 매경기 4명). → 시너지 골드 적정선 판단 기준점

#### win_lp "무조건 켜기" 문제
- win_lp 계열은 **승리 시에만 발동·패배 시 무효과** → 다운사이드 0 → 항상 켜는 게 최적해(도박권 활성 시만 억제). 슈리마 연승 보너스가 이를 증폭(부익부)
- 슈리마 연승 계산은 정확: `_currentWinStreak`(매치 저장 직전 연승 수) × streakStep, streakMax 상한. won일 때만 발동이라 연승 끊긴 경기엔 안 뜸 (버그 아님)

#### 적용 완료 (v2.43.175~176) — LP 증감만, 골드는 미적용
공격형(win_lp) 2차에 걸쳐 대폭 하향:
| 시너지 | 원본 | v175 | v176(현재) |
|---|---|---|---|
| 전사/원딜/암살자 | 5/7 | 4/6 | **2/3** |
| 검무(아이오니아) | 4/5 | 3/4 | **1/2** |
| 슈리마 | 6/8 | 5/7 | **3/4** |
| 슈리마 streakStep | 2 | 1 | 1 |
| 슈리마 streakMax2/3 | 4/6 | 4/6 | **2/3** |

방어형(lp_block) 완화량 축소:
| 시너지 | 원본 | v175 | v176(현재) |
|---|---|---|---|
| 탱커 | 8/12 | 5/8 | **3/5** |
| 데마시아 | 4/6 | 3/4 | **1/2** |

- 슈리마 최대 보너스 도달: 2성=직전 2연승(+5), 3성=직전 3연승(+7)
- `_synEffTxt`가 v2/v3/streakStep 동적 참조 → 도감·미리보기 자동 반영 (하드코딩 없음)

#### ⏳ 미결정 — 다음 세션 이어갈 작업 (골드 시너지)
**골드 강탈(빌지워터) 재설계** — 사용자에게 "골드를 실제로 빼오는(sink) 콘텐츠"로 만들지 논의 중. 제시한 방안:
- 방안 A: **강탈세** — thief가 일부만 받고 나머지 시스템 소멸 (약한 sink)
- 방안 B: **보유 골드 비례 %** 강탈 — 부자 집중 타겟, 음수 불가
- 방안 C: **순수 sink** — 패자 골드 시스템 완전 소멸, thief는 소량만
- 방안 D: 강탈 풀 + 잭팟 (도파민형)
- 공통 안전장치 필수: ① victim 실보유량 `min()` 체크 ② 다중 thief 합산 캡 ③ 정산창 victim 피해 표시("🏴‍☠️ 약탈당함 -NG")

**아직 손 안 댄 골드 시너지** (전부 인플레 위험):
- 🔴 신성한 개입(서폿) win_gold +120/180G — 순수 생성, 최우선
- 🔴 탱커 위로금(unbreakable) +20/40G
- 💫 리스크형(유레카 risk_win +12/16·패-6, 공허 risk_block) — LP라 인플레는 아니나 유레카 상승폭 큼

**정산창 강탈 표시 버그** (v153~ 현존): victim(골드 깎이는 쪽)이 본인 시너지 미장착이면 synLine 안 뜸 + 메인 골드 숫자에 시너지 골드 미반영 → playerRow의 `gold` 변수가 GOLD_WIN/LOSE+MVP+매너+뉴비만 합산([index.html ~11004]), 시너지 goldDelta/steal 누락. 골드 시너지 확정 시 함께 수정 필요

#### 핵심 코드 위치
```
GACHA_SYNERGY_GROUPS  : index.html ~22139 (효과값 정의)
SYN_PROC = {2:30,3:50}: index.html ~22054
_synEffTxt(grp,tier)  : index.html ~22055 (효과 텍스트, 동적)
_currentWinStreak     : index.html ~6785
매치 저장 시 시너지 롤 : index.html ~11526 (_synergyEffects)
LP 적용              : index.html ~20040 (s1ApplyMatchResult)
골드 적용            : index.html ~6748 (calcGoldFromMatches, steal/goldDelta)
정산창 시너지 라인    : index.html ~11052 (synLine, victim 미표시 버그)
```

---

### v2.43.152~174 (2026-05-29) — 챔피언 가챠 시스템 가동 + UI 다듬기

이날 단일 세션에서 가챠를 "껍데기만 있던 상태"에서 실제 작동까지 끌어올리고 UI를 대폭 다듬음.

**핵심 — 가챠 시너지 정식 가동 (v152~153)**
- `GACHA_SYNERGY_GROUPS` 11개를 **4분류(공격/방어/지원/리스크)** 재편. effType: win_lp/lp_block/win_gold/steal/risk_win/risk_block. 2성/3성 효과값 차등(v2/v3), 발동확률 `SYN_PROC`{2:30,3:50}
- 특수: 군림(연승)·불굴(방어+위로금)·약탈(상대 골드 강탈, 제로섬)·유레카/공허(반전 도박)
- **뽑기/합성 스텁 해제** (doGachaPull 50G/450G, doGachaMerge 3개→상위)
- 경기 결과 연결: saveMatch에서 시너지 발동 1회 롤 → `matches/{key}.synergyEffects` 기록(보유검증·도박권억제·군림 연승 스냅샷). `s1ApplyMatchResult`가 LP 적용(정규전 한정), `calcGoldFromMatches`가 골드/강탈 정산
- 활성 시너지 = `gold/{key}.activeSynergy_s1={sid,tier}`. 카드: `champCards_s1[slug]={s1,s2,s3}`, 도감 `champCardLog_s1`

**추적성 (v157, 롤백 대비)**: `gachaSpent_s1`+`gachaLog_s1`(뽑기 소모), `synergyEffects.lpDelta`(시너지 LP), 시너지 골드/강탈은 매치에 per-match 기록

**UI 다듬기 (v155~174)**: 2탭(🎲뽑기/📖컬렉션), 컬렉션 등급탭(◇파편/★★2성/★★★3성), 시너지 신규완성 알림(네비 초록배지+localStorage seen), 시너지 효과 미공개(전원 모으면 공개), 활성화 직관 버튼(드롭다운 제거), 카드 상세 = 서사 글귀(`GACHA_CHAMP_LORE` b[티어별]+모스트 「{p}」 실시간), 미보유 카드도 클릭 가능, 합성 버튼 톤·하단 이동, 대기화면/정산창 시너지 표시
- reveal/카드 이미지 = 티어별 커스텀 아트 `assets/pets/{slug}/{silver|gold|prism}/default.png` (전 18챔프 존재). 배경막·고속실루엣·경기투표카드만 ddragon(의도)

**⚠️ v166 치명 사고 + 교훈**: v165 CHANGELOG 편집 시 v164 항목 `{ver,changes:[}` 래퍼를 빠뜨려 **인라인 스크립트 전체 SyntaxError → 사이트 먹통**(연결중 멈춤·테스트FAB노출·버튼 동작X). 원인이 캐시인 줄 알고 헤맴. **교훈: `node --check`를 `<script type="module">`뿐 아니라 모든 `<script>` 블록(CHANGELOG가 든 인라인 포함)에 돌릴 것.** 검증 스니펫: `const re=/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/g`

**미검증**: 가챠 LP/골드 경로 실경기 테스트는 아직 (node --check 구문만). 복권은 여전히 `SCRATCH_LOTTERY_LOCKED=true` 잠금.

### v2.43.x (2026-05-28) — 스크래치 복권 정식 오픈 + 전면 롤백

오전~오후: 다른 컴퓨터에서 v2.43.125~146 진행 (프리미엄 셀 디자인·Hub UX·정식 오픈·가격/잭팟 재조정·구당첨금 소급 회수).
저녁: 인플레 문제로 전체 잠금 → 전 사용자 완전 pre-v135 상태 롤백 (v2.43.147~151).

#### 다른 컴퓨터 작업분 (v2.43.125~146)

##### 프리미엄 셀 디자인 완성 (v2.43.125, 128, 131)
- v2.43.125: 12면 보석체 clip-path 제거 → 원형 통일 + 레인보우 글로우 (1차 1차원 시도)
- v2.43.128: 3열(3+3+1) → 8컬럼 4+3 피라미드 배열 (균등 크기)
- v2.43.131: **최종** — 원형 → 9점 gem clip-path 크리스탈 실루엣 + box-shadow/border → filter:drop-shadow() 전환 (clip-path 환경 대응). 6컬럼 2+3+2 다이아몬드 배치. scardPremBorder → scardPremGlow (drop-shadow 레인보우)

##### Hub UX 다듬기 (v2.43.126, 129~130, 132~133)
- v2.43.126: 복권 ? 버튼 2종 추가 (Hub 카드 ? + 스크래치 모달 헤더 ?)
  - 해골 있는 티어는 "다 긁지 마세요!" 전략 강조
- v2.43.129: ? 버튼 클리핑 수정 (header-row 밖으로 이동), 팝오버 위치 카드 좌측 → 버튼 바로 아래
- v2.43.130: 팝오버 → 인라인 확장(`.lh-tier-help`)으로 교체 — `.show/.active` 토글, overflow 클리핑 해결
- v2.43.132~133: 팀 시도 횟수 표시 + 총 시도 0이면 자동 숨김

##### 스크래치 UX (v2.43.127, 137)
- v2.43.127: 첫 셀 reveal 직후부터 확인 버튼 활성화 — 해골 회피 전략 가능 ("중간에 멈추고 확인")
- v2.43.137: 복권 구매 확인 팝업 + 긁기 전 X 취소 시 환불 (한 획이라도 그으면 환불 X)

##### 정식 오픈 + 가격 리워크 (v2.43.134~136, 138, 139) ← 매우 중요
- **v2.43.134** (16:26 KST): 가격 100/300/600G → **70/200/400G** (-33%), 잭팟 상한 캡 (일반 1500→1000G, 고급 6000→3000G + 해골패 200→150G, 프리미엄 12000→5000G + 해골패 400→250G)
- **v2.43.135** (16:47 KST): **정식 오픈** — SCRATCH_LOTTERY_TESTMODE=false, 어드민 복권 로그(openLotteryLog) 추가
  - `SCRATCH_LAUNCH_TS = new Date('2026-05-28T00:00:00+09:00').getTime() = 1779894000000` 기준점
- v2.43.136 (16:52): 시도 횟수 집계 launch_ts 이후로 한정
- v2.43.138 (17:28): **가격 불일치 버그 수정** — S1_SHOP_ITEMS(100/300/600G)가 SCRATCH_TIERS(70/200/400G)와 달라 골드 체크 잘못 막힘. scratch_tier 분기에서 tierDef.price 단일 출처
- v2.43.139 (17:35): **과다차감 자동 환불** — `autoRefundLotteryOvercharge()` liveMode 진입 시 1회 자동 실행, 구가-신가 차액 환불. `config/lotteryOverchargeRefundDone` 플래그

##### 일반 복권 임시 잠금·재밸런싱 (v2.43.140~143)
- v2.43.140 (17:56): `SCRATCH_NORMAL_LOCKED=true` — Hub 카드 비활성. _lhBuyTier 이중 가드로 우회 차단
- v2.43.141 (18:12): 일반 5칸→4칸, 심볼 9개 (❄️눈꽃·⚡번개 추가). appear 재분배 (클로버 30→18). 당첨률 87%→~54%. CSS tier-0 그리드 3+2 → 2+2
- **v2.43.142** (18:19): **일반 복권 구 당첨금 소급 회수**
  - calcLotteryGold 에 `lotteryNormalRollbackG_s1` 차감 로직 추가 (별도 필드)
  - Firebase 직접 PATCH 8명:
    - 당첨금 회수: 27,950G (lotteryNormalRollbackG_s1)
    - 구매비 환불: 14,910G (goldSpent_s1 감소, **트래킹 필드 없음**)
    - 맹독 벌꿀오소리 제보 위로금: 1,000G (goldBonusLegacy_s1 추정)
- v2.43.143 (18:21): SCRATCH_NORMAL_LOCKED=false, 4칸 9심볼 ~54% 정식 오픈

##### 전 티어 밸런스 + 환불 정책 강화 (v2.43.144~145)
- v2.43.144 (18:44): **전 티어 재조정**
  - 일반(안B): 수익률 131%→92%. 눈꽃 90→70G, 왕관 1000→700G
  - 고급: 상금 ×2.5 + 해골패 150→60G. 수익률 8%→98%. 클로버 200→500G, 왕관 3000→7500G
  - 프리미엄: 상금 ×2.5 + 해골패 250→100G. 수익률 -16%→91%. 클로버 400→1000G, 왕관 5000→12500G
- v2.43.145 (19:03): 고급 skullPenalty 60→**150G 원복**, 프리미엄 100→**250G 원복**, 상금 ×2.80/×3.30 스케일. `hasScratched` 플래그 추가 — 한 획이라도 그으면 환불 불가

##### 일반 심볼 확장 (v2.43.146)
- v2.43.146 (19:18): 일반 심볼 9→11종 (🔥불꽃 90G, 💠보석 380G 추가). 당첨률 ~60%→~52%, 수익률 ~96%

---

#### 인플레 문제 인지 후 전면 잠금 + 롤백 (v2.43.147~151)

3시간 19분(16:53~20:12) 동안 1,113건 거래에서 +231,085G 발생. 실제 회수율 ~121% (목표 90~96% 대비 과대). 럼블 488회·맹독 326회 등 그라인딩 극심. 사용자 결정: 전면 잠금 + pre-v135 상태로 완전 복원.

##### 1차 잠금 (v2.43.147~148)
- v2.43.147: `SCRATCH_LOTTERY_LOCKED = true` — 일반·고급·프리미엄 + 긁기 도구 전부 차단. 토스트 "⚖️ 스크래치 복권 밸런스 패치 중입니다!". 단 처음엔 상점 카드 자체가 숨김되던 문제
- v2.43.148: 잠금 정책 수정 — **카드는 노출하고 클릭만 차단** (토스트로 안내). `.lot-entry-locked` CSS 추가 (grayscale 0.45, cursor:not-allowed). **테스트 FAB 영구 숨김** (정식 오픈 후 잔재, SCRATCH_LOTTERY_LOCKED 분기 제거하고 무조건 hide)

##### 2차 롤백 — 1차 net profit 회수 (v2.43.149)
- calcLotteryGold 에 `lotteryRollbackG_s1` 차감 로직 추가 (signed: 양수=회수·음수=보상)
- 11명 일괄 PATCH — 정식 오픈 이후 lottery_history net profit (winnings - new_price * count) - lotteryNormalRollbackG_s1
- 회수 24,080G(ap렉사이 10850·신규 8010·럼블 5220) + 보상 12,145G(맹독 6375 과회수 보정·애긔 3620·애블린 1350)
- **버그**: Python 스크립트에서 SCRATCH_LAUNCH_TS = 1748358000000(2025년!) 잘못 사용 → 5/27 거래 9건 포함. 즉시 보정 (3명: 애긔 -10, 브랜딩 -30, 맹독 +120)

##### 3차 롤백 — v142/v139 부수효과 회수 (v2.43.150)
- 사용자 지적: "v149만으로 pre-v135 상태가 아니다" — v142의 구매비 환불(14,910G) + 위로금(1,000G) + v139 자동환불(5,600G)이 아직 잔고에 남음
- **역추산 검증**: pre-v142 모든 T0 거래 × 70G = 14,910G → changelog와 정확히 일치
- 누락 보정 21,510G 추가 적용 (9명, 맹독 +10,600·럼블 +6,240·신규 +3,550)

##### 스크래치 도구 환불·회수 (v2.43.151)
- 5명 보유 (럼블/신규 동전+만능, 맹독/ap렉사이/애긔 만능)
- items_s1 에서 제거 + 가격(200G/500G)만큼 goldBonusLegacy_s1 가산
- 총 2,900G 환불. 잔여 0개 검증 완료

---

#### 회고 — 시뮬레이션이 실패한 원인 (사용자 지적)

처음 "다음에 시뮬해라"고 조언했으나 사용자가 "이미 했다"고 지적. 진짜 원인 재분석:
1. **rollScratch 후처리 룰 미모델링** — cap=matchCount, 다중 매칭 방지, 쪼는 맛(winSym 마지막 셀 강제)이 raw 추첨보다 win rate를 끌어올림. cap이 사실상 "당첨 floor"
2. **다중 매칭 방지(v122)의 EV 영향** — 낮은 가치 매칭 제거하고 winner만 남기니 평균 당첨금 상승
3. **해골 확률화(v124) 변동성 재계산 누락 의심** — 평균은 동일하나 분포가 달라짐
4. **연쇄 패치의 누적 효과 미검증** — v134→144→145→146 각자 90% 회수율로 계산했어도 합쳐서는 안 봤을 가능성
5. **평균 EV만 보고 분포 무시** — 잭팟 적중자 5%가 경제 왜곡

#### 핵심 데이터 구조 변경 (이 세션)

```js
// 신규 필드
/gold/{key}.lotteryRollbackG_s1: number  // signed, calcLotteryGold 차감 (v149~)
//   양수 = 회수, 음수 = 보상

// 기존 필드 (v2.43.142~)
/gold/{key}.lotteryNormalRollbackG_s1: number  // 일반 복권 구당첨금 차감

// 계산 통합 (v150 기준)
calcLotteryGold(data) = raw_winnings 
                     - data.lotteryNormalRollbackG_s1 
                     - data.lotteryRollbackG_s1

// 코드 상수
const SCRATCH_LAUNCH_TS = new Date('2026-05-28T00:00:00+09:00').getTime();
// = 1779894000000  (Python으로 작업 시 주의 — 2025 아님!)
const V142_TS = ...  // 2026-05-28 18:19:50 KST (커밋 시각)
const V139_TS = ...  // 2026-05-28 17:35:25 KST
```

#### 남은 작업 (다음 세션)

1. **복권 시스템 재설계** (사용자 결정 대기)
   - 음수 EV 모델 (회수율 75~85%) — 현실 복권 톤
   - 하드 캡 (일반 3장/고급 1장/프리미엄 0~1장 일 단위)
   - 잭팟 분할 지급 (즉시 경제 왜곡 방지)
   - 단계적 출시 (일반만 2주 → 고급 추가 → 프리미엄)
   - 시뮬레이션 모델: 실제 rollScratch 직접 N회 호출 + 분포(p50/p90/p99) 검증

2. **위로금/제보 협력 보상 재요청 처리** (사용자가 별도로 요청 예정)
   - v150에서 회수했으니 재지급 시 별도 추적 필드 사용 권장

3. **잠금 해제 시점** — v2.43.147~148의 `SCRATCH_LOTTERY_LOCKED=true`를 언제 false로 되돌릴지

---

### v2.43.x (2026-05-27 후속) — 스크래치 복권 풀 리워크 (이전 세션)

#### 스크래치 복권 풀 리워크 + 환불·보상 일괄 처리 (v2.43.97~124, 2026-05-27)

이날 단일 세션에서 스크래치 복권 시스템 전반·릴레이 보상 정산·도구 환불·UI 다듬기까지 약 28개 패치 진행. 시간 순으로 요약:

##### 비밀 퀘스트 토큰 race condition 정리 (v2.43.97)
- `buyItem` 중복 가드 (신규회원임 case)

##### 스크래치 복권 통합 진입점 + 테마/UX 빌드업 (v2.43.98~108)
- v2.43.98: 상점 카드 단일 → 통합 hub 모달 진입점 신설
- v2.43.99~101: 셀 디자인 (원형 동전, 그리드, 난이도 완화)
- v2.43.102: 티어별 테마 차별화 시도 (1차) — 실제 복권 긁기 느낌(다중 라인 + 가루 파티클)
- v2.43.103: matchCount 도입 — 일반 2매칭, 고급/프리미엄 3매칭. 보상 재밸런싱
- v2.43.104~105: 단일 레이어 통일, "마지막!" 텍스트 제거, cover alpha 0.92~0.93
- v2.43.106: 실시간 진행 상태 표시 (가장 많이 모인 심볼 카운트 + 해골 + net 금액)
- v2.43.107: 치명 — `matchCount`가 `rollScratch` 스코프에만 있어서 결과 화면 안 뜨던 ReferenceError 수정 (showScratchModal 상단에 `const matchCount = activeTier.matchCount || 2` 추가)
- v2.43.108: 해골 회피 매커닉 강화 (해골만 reveal 임계값 0.65로 고정 등)

##### 출연 확률 시스템 + 7종 심볼 확장 (v2.43.109~111)
- v2.43.109: prob(전체 당첨 확률) → appear(셀당 출연 확률) 시스템. 해골 reveal 임계값 분기 제거 (티 안 나게)
- v2.43.110: 5종 → 7종 (⚔️ 검 + 🛡️ 방패 추가). 블랭크 제거 — 모든 슬롯에 무조건 심볼
- v2.43.111: 매칭 완성 자동 종료 제거 (사용자가 더 긁어볼 수 있음), 보상 대폭 하향 (잭팟 일반 7000→1500G·고급 15000→6000G·프리미엄 30000→12000G, EV 100~115%)

##### 출석 릴레이 보상 복구 (v2.43.112~113) — Firebase 직접 보정
- v2.43.112: 5/21 릴레이 도입 후 출석은 됐지만 `relayProgress` 갱신 안 된 7명(신규회원임·울퉁쓰·브랜딩프로·맹독 벌꿀오소리·조조와빈찬합·나랑듀오해듀오·빛나는언즈) 자동 보정 코드 추가 (`autoCompensateRelayV1`). 누락 칸 RELAY_REWARDS 일괄 지급 (+2640G + s1_lp2x ×9)
- v2.43.113: 치명 — v2.43.26에서 추가한 `revertRelaySogeup`이 매 onValue 호출 시 자동 보정값을 옛 값으로 되돌리던 문제. 영구 비활성화 (`_relayRollbackDone = true; return;`)
- **추후 별도 패치**: 7명에 대해 `relayClaimed_s1`/`relayProgress_s1`을 target(6~10)으로 끌어올리되, calcRelayGold 증가분만큼 `goldBonusLegacy_s1`에서 차감 → **순 골드 0 변동**. items_s1 미터치 (이미 지급된 마일스톤 아이템 유지). 환불 스크립트 ([summary 참고](#))

##### 스크래치 다중 매칭 방지 + 쪼는 맛 (v2.43.114~115)
- v2.43.114: 일반 복권 동일 심볼 cap=2 (`tier.idx === 0`만) — 3·4·5개 겹쳐 보이는 시각 혼란 차단
- v2.43.115: **쪼는 맛 강화** — 당첨이면 winSym 1개를 마지막 셀(cells-1)에 강제, 나머지는 앞쪽 셀 랜덤. cap=matchCount를 전 티어 확장 → winSym 정확히 matchCount 개 → 강제 배치 안정성

##### 긁기 속도 슬로다운 (v2.43.116)
- 메인 brush alpha 0.65→0.40, 가장자리 0.35→0.20·갯수 3→2, reveal 임계값 0.45→0.55, 도구 임계값 비례 조정

##### 긁기 도구 시뮬레이션 토글 + 사전 구매분 환불 (v2.43.117)
- 테스트 모드에서만 노출되는 [없음/🪙 동전/🔑 만능] 3버튼 토글 (Hub 모달 상단)
- `_scratchTestTool` 모듈 변수, `scratch_tier` 구매 흐름에서 override
- **환불 Firebase 직접 적용**: 브랜딩프로 만능 긁개 500G, 맹독 벌꿀오소리 동전+만능 700G → `goldBonusLegacy_s1`에 가산, `items_s1`에서 제거

##### 스크래치 결과 액션 3종 (v2.43.118)
- `#scard-confirm` 단독 → `#scard-actions` 그룹으로 교체
- [← 뒤로][🔁 한 번 더 (-NG)][✓ 보유 NG · 확인] 3버튼
- 뒤로: onComplete 후 `window.openLotteryHub()` / 한 번 더: onComplete 후 `window.buyItem(tierDef.id)` / 확인: 기존 동작
- 테스트 모드는 2버튼 (한 번 더 없음 — 확인이 onNext = 다시 긁기)

##### 비침·배치·도형 1차 (v2.43.119)
- emoji opacity 0.13→0.22, blur 5px→3px, cover alpha 0.92→0.82 (peek-through 강화)
- 일반 복권 5칸 한 줄 → 3+2 2행 (6컬럼 그리드, 각 셀 span 2, 셀 크기 tier1과 동일)
- 프리미엄 셀 원형 → 육각형 (clip-path polygon)

##### 비침·속도·도형 2차 + 모드 토글 제거 (v2.43.120)
- emoji opacity 0.22→0.55, cover alpha 0.82→0.75 (더 강화 — 그러나 user 피드백: "긁기 전에 알면 안 됨" → v2.43.121에서 되돌림)
- 메인 brush alpha 0.40→0.30, 가장자리 0.20→0.12, 픽셀 클리어 임계값 `d[i] < 200` → `< 120` (셀당 ~2배 스트로크)
- 프리미엄 육각형 → 팔각형 (중앙 영역 넓힘) + 자식(.scard-sym/.scard-canvas) 명시적 클립
- **드래그/홀드 토글 완전 제거** — `.scard-mode-tog`/`.scard-mode-btn` CSS, `scratchMode` 변수, `startHold/stopHold` 로직 일괄 삭제. pointer drag 단일화

##### 비침 스포일러 차단 (v2.43.121) ← 중요 수정
- v2.43.120의 cover alpha 0.75가 너무 투명해 긁기 전에 심볼 정체 노출되던 문제 (user 피드백: "긁기도 전에 알면 안 된다, 긁을수록 보여야")
- cover alpha 0.75 → **0.94** 복구. emoji opacity 0.55는 유지 → 긁은 자리만 destination-out으로 픽셀 투명화될수록 점진 노출. 임계값 도달 시 sharp reveal

##### 일반 복권 다중 매칭 방지 (v2.43.122)
- 5칸 2매칭 구조 → 달2 + 클로버2 같은 다중 매칭 케이스 가능 → 결과 모호성
- cap 통과 후 후처리: 매칭 심볼이 2종 이상이면 가장 가치 큰 것만 winner로 남기고, 다른 매칭 심볼은 1개 인스턴스를 cnt=0 싱글톤으로 교체 → 항상 단일 매칭
- 고급·프리미엄은 6/7칸·3매칭 구조상 다중 매칭 불가능해 영향 없음

##### 프리미엄 복권 셀 디자인 업그레이드 (v2.43.123)
- 도형: 팔각형 → **12면 cushion-cut 보석체** `polygon(25% 0%, 75% 0%, 90% 8%, 100% 25%, 100% 75%, 90% 92%, 75% 100%, 25% 100%, 10% 92%, 0% 75%, 0% 25%, 10% 8%)`
- 배경: 단일 라디얼 → 멀티 레이어 (핑크 하이라이트 + 보라 그림자 + 다크 보라 베이스)
- 외곽 글로우: `filter:drop-shadow(0 0 6px rgba(232,121,249,0.35))` (clip-path 모양 따라 자연 렌더)
- 당첨 셀 펄스: `scardGemPulse` 1.6s 사이클 drop-shadow 강도 펄싱
- **커버 텍스처 차별화**: `_scardDrawCover(ctx, w, h, layerLeft, tierIdx)`로 인자 확장. 일반·고급은 황금 그라데이션 / 프리미엄은 핑크-퍼플-골드 멀티 그라데이션 + 십자 facet 광택선 + 흰 글리터 점

##### 해골 확률 출현 (v2.43.124)
- 기존: tier1=1개 / tier2=2개 고정 출현
- 변경: `skullAppear` 가중치 필드 추가 — tier1=20 (~17% 셀당), tier2=40 (~29% 셀당). 셀별 독립 추첨 시 `심볼 100 + skullAppear`의 합산 가중치 풀에서 추첨
- 평균 갯수는 기존과 동일 (1.0, 2.0) but 변동성 ↑ (운 좋으면 0개, 운 나쁘면 3개+)
- Hub 확률표·모달 우측 당첨표·룰 텍스트·상점 카드 설명 모두 % 표시로 갱신
- `rollScratch` 내부에서 `skulls` 참조 → `skullCount` 동적 변수로 교체

#### 핵심 함수/상수 변화 정리

```js
// 추가/변경된 변수·상수
let _scratchTestTool = null;                           // 테스트 도구 시뮬레이션 (v2.43.117~)
const SCRATCH_TIERS[i].skullAppear = 0|20|40;         // 해골 가중치 (v2.43.124~)
const SCRATCH_TIERS[i].matchCount = 2|3|3;            // 매칭 갯수 (v2.43.103~)

// 변경된 함수 시그니처
_scardDrawCover(ctx, w, h, layerLeft, tierIdx)        // tierIdx 추가 (v2.43.123)
showScratchModal(result, gold, { tierDef, toolParams, onComplete, testMode, onNext })

// 새 window 함수
window._setScratchTestTool(toolId)                    // 토글 핸들러 (v2.43.117)
window.openLotteryHub() / window.closeLotteryHub()    // Hub 모달
window._lhBuyTier(id), window._lhBuyTool(id)          // Hub 내 버튼 핸들러

// rollScratch 내부 로직 핵심
- 셀당 독립 추첨 (심볼 + 해골 가중치 풀)
- cap=matchCount: 같은 심볼 matchCount 초과 시 미달 심볼로 교체
- 다중 매칭 방지 (tier 0): 가장 가치 큰 winner 외 다른 매칭 심볼은 cnt=0 싱글톤으로 교체
- 쪼는 맛: 당첨이면 winSym 1개를 cells-1에 강제 배치, 나머지는 앞쪽 셀 랜덤
```

#### CSS 핵심 클래스 (v2.43.x)

```
.scard-overlay / .scard-modal.tier-0/1/2          /* 모달 컨테이너, 티어별 테마 */
.scard-grid.tier-0  → 6컬럼 그리드, 3+2 배치 (v2.43.119)
.scard-grid.tier-2  → 4컬럼, 5/6/7번 셀 재배치
.scard-cell         → 원형 (tier 0/1), 12면 보석체 (tier 2, clip-path)
.scard-sym-emoji    → opacity 0.55, blur 3px (긁힌 자리에서 점진 노출용)
.scard-canvas       → tier 2 는 동일 clip-path 명시
.scard-actions      → [뒤로/한 번 더/확인] 3버튼 그룹
.scard-act-back / .scard-act-replay / .scard-act-confirm
.lh-test-tool-row   → 테스트 도구 토글 노란 점선 박스
@keyframes scardGemPulse  → 프리미엄 당첨 셀 펄스
```

#### 다음 작업 (미구현, 사용자 요청 보류)

- **긁기 도구 의미 부여**: 현재 도구가 큰 차이 없음. 4가지 방안 제안 중:
  - A: 브러시 alpha 자체 ↑ (coin 0.30→0.50, key 0.30→0.80)
  - B: 픽셀 클리어 임계값 차등 (coin <170, key <220 → 한 번 닿으면 cleared)
  - C: 도구별 고유 메커닉 (coin = 가루 폭발, key = 자동 미리보기)
  - D: 결과 보너스 (coin = +10% 골드, key = +1 무료 reveal + +15% 골드)
  - 추천: A+B 조합. 사용자 의사결정 대기 중

---

### v2.43.x (2026-05-27 전반)

#### 챔피언 가챠 프리즘 카드 + 복권 개선 (v2.43.82~89, 2026-05-27)

##### 복권 긁기 시스템 개편 (v2.43.82~86)
- **v2.43.82**: 3줄 평행선 긁기 → 단일 스트로크로 변경 시도 (dark blob 문제)
- **v2.43.83**: 이모지 즉시 노출 시도 (유저 요청으로 롤백)
- **v2.43.84**: `lineCap:'square'` 사각형 긁기로 변경
- **v2.43.85**: `globalAlpha:0.45` 레이어 효과 추가 (한 꺼풀씩 벗겨지는 느낌)
- **v2.43.86**: **최종 확정** — 이모지를 캔버스 아래에 즉시 노출(opacity:1), destination-out + globalAlpha:0.45로 긁을수록 비쳐 보이는 구조. checkCellReveal 임계값 `< 200` (1번 긁힌 픽셀도 카운트)
  - 핵심: 캔버스(은박 커버)가 불투명하게 이모지를 가리고, 긁으면 캔버스가 반투명해지며 아래 이모지 노출

##### 복권 확률/골드 조정 (v2.43.87)
- 🍀 클로버 5%→**30%** 50G / 🌙 달 20%→**25%** 100G / ⭐ 별 8% 200G / 💎 다이아 4% 400G / 👑 왕관 1.5%→**1%** 1000G→**800G**
- 총 당첨률 38.5%→**68%**, 꽝 **32%**
- `rollScratch()` 누적 확률 구간 갱신

##### 챔피언 가챠 프리즘 이미지 (v2.43.88~89)
- 프리즘 카드 이미지 18종 추가 (`assets/pets/{slug}/prism/default.png`)
  - 스타일: StarCraft Remastered Cartooned DLC 스타일 (Adobe Firefly 생성)
  - 골드=기본 스킨 치비 일러스트 / 프리즘=유료 스킨 동일 스타일
  - 스킨 목록: Cyber Pop 아크샨, Re-Gifted 아무무, Zombie 브랜드, Corporate 문도, Fuzz 피즈, Sultan 갱플랭크, High Noon 진, Mecha 카직스, Pool Party 룰루, Glacial 말파이트, Snow Day 말자하, Prestige Winterblessed 멜, Sinful Succulence 모르가나, Soul Fighter 나피리, Lollipoppy, Durian Guardian 람머스, 악마의 저주(대혼란) 베인, PROJECT 야스오
- `gacha_mockup.html` 추가 (gitignore됨 — 로컬 테스트용)
- `gachaTestGrant()` / `gachaTestReset()` 콘솔 함수 추가 (전 챔피언 카드 임시 부여/초기화)
- 카드 배경 아트 밝기 조정: t1(파편) brightness(0.5), t2(골드) 0.32, t3(프리즘) 0.28

##### 다음 작업 (미구현)
- **시너지 효과 적용 로직**: `activeSynergy_s1` {sid, tier} 읽어서 경기 결과(`s1ApplyMatchResult`) + 출석(`doAttendance`) 시 LP/골드 발동 계산
  - `win_lp`: 승리 시 확률(2성 10%/3성 20%) → LP 추가
  - `loss_lp`: 패배 시 확률 → LP 감소 방어
  - `attend_g`: 출석 시 확률 → 골드 추가
- **뽑기/합성 기능 활성화**: `doGachaPull`, `doGachaMerge` 함수 "준비 중" 잠금 해제

### v2.43.x (2026-05-22~23)

#### 비밀 퀘스트 토큰 엣지 케이스 5종 보강 (v2.43.48, 2026-05-23)
프로세스 정밀 검토에서 발견된 엣지 케이스 일괄 수정.

- **#1 한도 우회 차단**:
  - `buyItem` 가드: `existingItems.some(it => it.id === 'secret_quest')` — active 무관, 보유 자체로 추가 구매 차단
  - `toggleItemActive` OFF 분기: `secret_quest` 토글 OFF 시 `questId`/`activatedAt` 함께 제거 → 재활성화 시 새 questId 강제 부여 (어뷰즈 차단)
  - 상점 카드 버튼: active=true → `다음 판 발동` / active=false → `보유 중`
- **#2 이벤트/막고라 매치 모달 차단**: `_maybeShowSecretQuestModal`에 `isEventMatch` + `magollaState === 'active'` 가드 추가 (saveMatch 없는 흐름에서 사용자 혼란 방지)
- **#3 sq_mvp 토큰 보존**: MVP 정보 부재(`!_mvpInfoAvailable`) 시 토큰 보존
  - `window._preservedSqPlayersForThisMatch` Set으로 saveMatch → giveMatchGold 전달
  - `giveMatchGold` 필터에서 secret_quest + preserved 케이스는 `return true`로 active 유지
  - 본인이면 토스트 안내 "MVP 투표 미확정으로 다음 매치로 미뤄짐"
- **#4 자동 비활성화 알림 강화**: 토스트 + `showSecretQuestPreservedNotice` 모달 결합. 시안 톤 검정 배경, 인벤토리 보존 명시
- **#5 fallback 식별 플래그**: `wasFallback: true` 필드 추가 (saveMatch에서 questId 즉석 부여 케이스). 정산창 `.ms-sq-fb-badge` 로 🔄 복구 배지 표시

#### 비밀 퀘스트 토큰 구매=즉시 활성화 정책 전환 (v2.43.47, 2026-05-23)
인벤토리 적재로 못 쓰는 토큰 발생 가능성을 원천 차단.

- **buyItem**: secret_quest 구매 시 `active:true, activatedAt:Date.now()` 로 인벤토리 추가 → `_maybeShowSecretQuestModal()` 자동 트리거 대상
- **사전 차단**: 구매 시점에 배치/승급전/도박권/이미 활성화된 토큰 보유 여부 체크 → 200G 낭비 방지
- **상점 카드**: `📅 오늘 N/2 · 구매 즉시 다음 매치 자동 발동` 안내 + `한도 소진 (N/2)` / `다음 판 발동` 상태 분기
- **showSecretQuestPurchaseInfo**: "즉시 활성화 완료 · 별도 활성화 불필요" 로 안내 문구 갱신
- 인벤토리 토글로 비활성화는 여전히 가능 (사용자가 원하면 끄기)

#### 비밀 퀘스트 토큰 안정성 보강 (v2.43.46, 2026-05-23)
새로고침·재팀짜기 케이스에서 토큰이 소실되거나 200G가 증발하던 엣지 케이스 차단.

- **재팀짜기 정책**: `questId` 한 번 부여되면 saveMatch까지 고정(어뷰즈·리롤 차단), 모달은 새 팀 발표마다 재노출
- **`_shownSqForTeamTs` 가드**: `_currentTeamsFormedAt`과 비교해 같은 팀 형성 중 중복 모달 방지
- **Option A (백업 트리거)**: `applySessionData`에서 `teamsChanged === true` 시 9초 후 `_maybeShowSecretQuestModal()` 호출 — 발표 오버레이를 놓친 기기 (탭 이동·새로고침) 대비
- **Option B (saveMatch fallback)**: `active=true` 토큰에 `questId`가 없으면 즉석 부여(`pickRandomSecretQuest()`)해서 판정·소비 — 모달 노출 전 새로고침된 케이스에서 토큰 손실 방지
- **소비 시점 원칙**: 토큰은 saveMatch 시점에만 소비됨 → 게임 미완료(reset/cancel) 시 토큰 보존
- `resetSession`에서 `_shownSqForTeamTs = 0` 초기화

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
