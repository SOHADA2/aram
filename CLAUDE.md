# 무작위 총력전 아수라장 내전 (ARAM Custom Team Builder)

## 프로젝트 개요
- 롤 칼바람 내전 팀짜기 **단일 HTML 웹앱** (`index.html`)
- Firebase Realtime Database로 실시간 데이터 동기화
- GitHub Pages 배포: https://sohada2.github.io/aram/
- 저장소: https://github.com/SOHADA2/aram
- 현재 버전: v2.2.9

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
  itemEffects: { [playerNormName]: string[] }  // 사용된 아이템 효과

/gold/{key}
  name: string
  gold: number                  // 보유 골드
  items: array                  // 보유 아이템 목록
  retroApplied: boolean         // 소급 계산 완료 여부
```

## 탭 구성 (4탭)
1. **⚔️ 팀구성** — 참가자 선택 → 팀 설정 → 결과 → 경기 저장
2. **📋 기록** — 전체 매치 히스토리
3. **🏆 랭킹** — 승점 기반 티어, 프로필 모달 포함
4. **🛒 상점** — 골드로 아이템 구매, 내 아이템 관리

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
  - `getMyGold()` = `calcGoldFromMatches() + goldBonus - goldSpent`
- 기존 경기 기록 기반 소급 계산 자동 적용 (`retroApplied`)

| 아이템 | 가격 | 효과 |
|--------|------|------|
| ⚡ 승점 2배권 | 80G | 경기 전 활성화 → 승리 시 +20pt |
| 🛡️ 패배 방어권 | 60G | 경기 전 활성화 → 패배해도 감점 없음 |

- 팀 구성 완료 후 **아이템 잠금** (경기 저장 시 자동 해제)

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

## 코드 규칙
- 모든 사용자 입력은 `escHtml()` 이스케이프 (`&` `<` `>` `"` `'` 포함)
- 이름 비교는 항상 `normName()` 사용 (trim + 연속 공백 단일화)
- Firebase 변경은 `onValue` 리스너가 자동으로 UI 갱신
- 이벤트 매치 결과는 Firebase에 저장하지 않음
- CSS 변수는 `:root`에서 관리 (`--gold`, `--blue`, `--red`, `--tier-*` 등)
- CSS 중복 선언 금지 (과거 버그 — 같은 클래스 두 번 정의된 적 있음)
