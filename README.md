# Life As A Game

> 현실에서의 하루 행동을 RPG 게임 캐릭터의 성장 시스템으로 변환해주는 AI 서비스

## 🎮 서비스 컨셉

"나는 오늘 하루를 플레이했다"

Life As A Game은 당신의 일상을 게임으로 바라봅니다. 오늘 하루 동안 한 행동을 입력하면, AI가 이를 RPG 캐릭터의 스탯 변화와 경험치로 해석하여 보여줍니다. 

이 서비스는 할 일 관리 앱이나 생산성 도구가 아닙니다. 단지 당신의 하루를 게임 플레이처럼 재해석해주는 경험을 제공합니다.

## ✨ 주요 기능

### 1. 캐릭터 생성 및 관리
- 자신을 대표하는 캐릭터 생성
- 레벨 시스템 (500 XP마다 레벨업)
- 누적 스탯 관리

### 2. 하루 행동 입력
자연어로 오늘 하루 동안 한 행동을 자유롭게 기록합니다.

### 3. AI 스탯 변환
AI가 입력된 행동을 분석하여 4가지 RPG 스탯으로 변환합니다:
- 🎯 **집중력 (Focus)** - 업무, 공부 등 집중이 필요한 활동
- 💪 **체력 (Health)** - 운동, 수면 등 신체 활동
- 🧠 **멘탈 (Mental)** - 휴식, 취미 등 정신 건강 활동
- 📈 **성장 (Growth)** - 학습, 도전 등 성장 관련 활동

각 스탯은 -3에서 +3 범위로 평가되며, 경험치(XP)가 함께 계산됩니다.

### 4. 캐릭터 성장 및 기록
- 스탯과 XP가 캐릭터에 누적
- 매일의 플레이 로그 자동 저장
- AI가 생성한 캐릭터 코멘트

## 👤 사용자 흐름

1. **랜딩 페이지** - 서비스 소개 및 캐릭터 확인
2. **캐릭터 생성** (최초 1회) - 닉네임 입력 후 캐릭터 생성
3. **입력 페이지** - 오늘 하루 행동을 자유롭게 입력
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
- SQL Editor에서 `supabase-schema.sql` 실행

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
- 사용자 인증 (OAuth)

## 📝 라이선스

MIT License
