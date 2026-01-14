# 설정 가이드

## 1. 환경 변수 설정

프로젝트 루트에 `.env.local` 파일을 생성하고 다음 내용을 추가하세요:

```env
OPENAI_API_KEY=your_openai_api_key_here
```

### OpenAI API 키 발급 방법

1. [OpenAI Platform](https://platform.openai.com/api-keys) 접속
2. 로그인 또는 회원가입
3. API Keys 메뉴에서 새 키 생성
4. 생성된 키를 복사하여 `.env.local` 파일에 붙여넣기

⚠️ **주의**: API 키는 절대 공개 저장소에 커밋하지 마세요!

## 2. 로컬 실행

```bash
npm install
npm run dev
```

브라우저에서 `http://localhost:3000` 접속

## 3. Vercel 배포

### 배포 준비
1. GitHub에 저장소 생성 및 푸시
2. [Vercel](https://vercel.com) 접속 및 로그인
3. "Import Project" 선택

### 환경 변수 설정
Vercel 프로젝트 설정에서 다음 환경 변수 추가:
- Key: `OPENAI_API_KEY`
- Value: 발급받은 OpenAI API 키

### 배포 실행
- "Deploy" 버튼 클릭
- 배포 완료 후 URL 확인

## 4. 기능 테스트

### 테스트 시나리오 1: 균형잡힌 하루
```
오늘은 아침 7시에 일어나서 30분 조깅을 했다. 
회사에서 새로운 프로젝트 기획서를 3시간 동안 작성했고, 
점심은 동료들과 함께 먹었다. 
저녁에는 온라인 강의를 1시간 들었고, 
책을 읽다가 잠들었다.
```

예상 결과:
- Focus: +2
- Health: +2
- Mental: +1
- Growth: +2
- XP: 120~150

### 테스트 시나리오 2: 격한 운동의 하루
```
새벽 6시에 일어나 하프 마라톤을 뛰었다.
오후에는 헬스장에서 2시간 웨이트 트레이닝을 했고,
저녁에는 집에서 요가를 30분 했다.
```

예상 결과:
- Focus: 0
- Health: +3
- Mental: +1
- Growth: +1
- XP: 100~130

### 테스트 시나리오 3: 집중 학습의 하루
```
오늘 하루 종일 새로운 프로그래밍 언어를 공부했다.
강의를 6시간 듣고, 실습 프로젝트를 만들었다.
식사도 거른 채 코딩에 몰두했다.
```

예상 결과:
- Focus: +3
- Health: -1
- Mental: -1
- Growth: +3
- XP: 140~170

## 문제 해결

### "OpenAI API 키가 설정되지 않았습니다" 오류
- `.env.local` 파일이 프로젝트 루트에 있는지 확인
- 파일 이름이 정확한지 확인 (`.env.local`, `.env`가 아님)
- 개발 서버 재시작 (`Ctrl+C` 후 `npm run dev`)

### "분석 중 오류가 발생했습니다" 오류
- OpenAI API 키가 유효한지 확인
- 인터넷 연결 확인
- OpenAI 계정에 크레딧이 있는지 확인

### 스타일이 적용되지 않음
- `npm run dev` 재시작
- 브라우저 캐시 삭제 후 새로고침
