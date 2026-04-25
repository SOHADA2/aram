# 무작위 총력전 아수라장 내전 (ARAM Custom Team Builder)

## 프로젝트 개요
- 롤 칼바람 내전 팀짜기 **단일 HTML 웹앱** (`index.html`)
- Firebase Realtime Database로 실시간 데이터 동기화
- GitHub Pages 배포: https://sohada2.github.io/aram/
- 저장소: https://github.com/SOHADA2/aram
- 현재 버전: v2.31.7

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

/gold/{key}
  name: string
  gold: number                  // 보유 골드 (시즌 0)
  items: array                  // 보유 아이템 (시즌 0)
  gold_s1, items_s1, goldSpent_s1 ...  // 시즌 N 필드 (sField() 로 접근)
  retroApplied: boolean         // 소급 계산 완료 여부

/config/currentSeason            // 현재 시즌 번호 (0 또는 1)
/config/riotApiKey               // Riot API Key (24h 갱신)

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
- **출석 체크**: 하루 1회, **+30G** 지급 (상점 탭 최상단 카드)
  - Firebase `/gold/{key}.goldBonus` 에 누적, `/gold/{key}.lastAttendance` (YYYY-MM-DD) 로 중복 방지
  - 날짜 기준: **로컬 시간** (`getLocalDateKey()`) — UTC 기준 버그 수정 (v2.8.0)
  - `getMyGold()` = `calcGoldFromMatches() + goldBonus - goldSpent`
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

- 팀 구성 완료 후 **아이템 잠금** (경기 저장 시 자동 해제)
- 아이템 사용 통계: `calcItemStats(name)` — `matches[].itemEffects[normName]` 스캔
  - `score2xWin`: 2배권 사용 후 승리 횟수
  - `insuranceUsed`: 방어권 사용 후 패배(감점 막기) 횟수

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
- LP 0 미만 강등 시 이전 티어 **75 LP**로 진입 (`S1_DEMOTION_LP`)

### 승급 / 강등
- **자동 승급** (`S1_AUTO_TIERS`): 브론즈 → 실버 (100 LP 도달 즉시)
- **승급전** (`S1_PROMO_TIERS`): 골드·플래티넘·다이아·마스터·그마 → 100 LP 도달 시 시작
  - **3판 2선승**, `promoWins/promoLosses` 추적
  - 5판 이내 미완료 시 소멸 → 승급 실패, LP **75**로 복귀 (`S1_PROMO_FAIL_LP`, `S1_PROMO_EXPIRY=5`)
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
- `s1LpBarHtml(d)` — 랭킹 탭 LP 바·승급전 도트·배치 진행 렌더

## EOG 자동 저장 흐름 (v2.29.57~v2.29.64)
- **경기 종료 시**: `showEogOverlay()` — 승리팀 + MVP/SVP/매너왕 투표 카드가 팝업으로 등장
- **자동 저장**: 전원 투표 완료 시 `liveMode` 기기에서 `saveMatch` 자동 트리거
- **정산창**: 저장 직후 `postSaveMatchData` 기반 정산 오버레이 표시 (골드·아이템·LP 변화 요약)
- **주의**: `finalizeVotes` 는 `session` 초기화 **이전**에 호출되어야 race condition 방지 (v2.29.57)

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
