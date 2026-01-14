# Life As A Game

> 현실에서의 하루 행동을 RPG 게임 캐릭터의 성장 시스템으로 변환해주는 AI 서비스

## 🎮 서비스 컨셉

"나는 오늘 하루를 플레이했다"

Life As A Game은 당신의 일상을 게임으로 바라봅니다. 오늘 하루 동안 한 행동을 입력하면, AI가 이를 RPG 캐릭터의 스탯 변화와 경험치로 해석하여 보여줍니다. 

이 서비스는 할 일 관리 앱이나 생산성 도구가 아닙니다. 단지 당신의 하루를 게임 플레이처럼 재해석해주는 경험을 제공합니다.

## ✨ 주요 기능

### 1. Lv.0 체험 모드
- 로그인 없이 서비스를 체험할 수 있습니다
- AI 분석 기능을 바로 사용해볼 수 있습니다
- 체험 모드에서는 데이터가 저장되지 않습니다

### 2. 회원가입 및 로그인
- 간단한 아이디/비밀번호 기반 인증
- 회원가입 시 자동으로 Lv.1 캐릭터 생성
- 모든 플레이 데이터가 안전하게 저장됩니다

### 3. 캐릭터 성장 시스템
- 지수 레벨 시스템 (Lv.1→2: 500 XP, 이후 1.5배씩 증가)
- 레벨별 특별 메시지 (Lv.2, Lv.5, Lv.10)
- 누적 스탯 관리 (집중력, 체력, 멘탈, 성장)

### 4. AI 스탯 분석
AI가 입력된 하루를 분석하여 4가지 RPG 스탯으로 변환합니다:
- 🎯 **집중력 (Focus)** - 한 가지에 몰입했는가?
- 💪 **체력 (Health)** - 몸을 회복했는가, 소모했는가?
- 🧠 **멘탈 (Mental)** - 감정은 무너지지 않았는가?
- 📈 **성장 (Growth)** - 배움이나 새로운 시도가 있었는가?

각 스탯은 -3에서 +3 범위로 평가되며, 경험치(XP)가 함께 계산됩니다.

### 5. 플레이 로그 저장
- 매일의 플레이 기록이 자동 저장
- AI가 생성한 캐릭터 코멘트
- 일일 스탯 변화 기록

## 👤 사용자 흐름

### 체험 모드 (Lv.0)
1. **랜딩 페이지** - "로그인 없이 체험하기" 선택
2. **체험 입력** - 오늘 하루 행동 입력
3. **체험 결과** - AI 분석 결과 확인 (저장되지 않음)

### 정식 플레이 (Lv.1+)
1. **회원가입** - 아이디, 비밀번호, 캐릭터 이름 입력
2. **캐릭터 페이지** - 현재 상태 확인
3. **입력 페이지** - 오늘의 플레이 기록
4. **결과 페이지** - 스탯 변화, 레벨업, AI 코멘트 확인

## 🛠️ 기술 스택

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **AI**: Google Gemini (gemini-1.5-flash)
- **Database**: Supabase (PostgreSQL)
- **Deployment**: Vercel

## 🚀 실행 방법

### 로컬 실행

1. 저장소 클론 및 의존성 설치
```bash
git clone https://github.com/yourusername/life-as-a-game.git
cd life-as-a-game
npm install
```

2. Supabase 프로젝트 생성 및 테이블 설정
- [Supabase](https://supabase.com)에서 프로젝트 생성
- SQL Editor에서 `supabase-schema-v2.sql` 실행 (users, characters, daily_logs 테이블 생성)

3. 환경 변수 설정
```bash
# .env.local 파일 생성
GOOGLE_API_KEY=your_google_api_key
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. 개발 서버 실행
```bash
npm run dev
```

5. 브라우저에서 `http://localhost:3000` 접속

### 배포

Vercel을 사용한 배포:

1. Vercel 계정 연결
2. 프로젝트 import
3. 환경 변수 `GOOGLE_API_KEY` 설정
4. Deploy

## 💡 향후 개선 아이디어

- 일간/주간/월간 통계 대시보드
- 히스토리 조회 (과거 플레이 로그)
- 스킬 트리 및 업적 시스템
- 친구와 스탯 비교 기능
- 캐릭터 커스터마이징
- OAuth 소셜 로그인 (Google, GitHub 등)
- 플레이 스트릭 (연속 플레이 일수)
- 스탯 그래프 시각화

## 📝 라이선스

MIT License
