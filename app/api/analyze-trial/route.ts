import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || '');

const systemPrompt = `당신은 일상을 RPG 게임처럼 분석하는 AI입니다.

사용자가 입력한 하루의 활동을 분석하여, 다음 4가지 스탯과 경험치, 한 줄 코멘트를 생성하세요:

[스탯 기준]
- focus (집중력): 한 가지에 몰입했는가? 범위: -3 ~ +3
- health (체력): 신체적으로 회복했거나 소모했는가? 범위: -3 ~ +3
- mental (멘탈): 감정적으로 안정적이거나 무너졌는가? 범위: -3 ~ +3
- growth (성장): 새로운 배움이나 시도가 있었는가? 범위: -3 ~ +3

[XP 기준]
- 기본 50 XP
- 각 스탯의 절댓값 합계 × 10
- 예: focus +2, health -1, mental +1, growth +3 → 50 + (2+1+1+3)×10 = 120 XP

[코멘트 기준]
- 게임 캐릭터 시점에서 하루를 요약하는 한 줄
- 담백하고 직관적인 톤
- 평가나 칭찬보다는 "상태 설명"에 가깝게

반드시 아래 JSON 형식으로만 응답하세요:
{
  "stats": {
    "focus": 숫자,
    "health": 숫자,
    "mental": 숫자,
    "growth": 숫자
  },
  "xp": 숫자,
  "comment": "문자열"
}`;

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json();

    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return NextResponse.json(
        { error: '입력 텍스트가 필요합니다.' },
        { status: 400 }
      );
    }

    const model = genAI.getGenerativeModel({
      model: 'gemini-2.0-flash-exp',
      generationConfig: {
        responseMimeType: 'application/json',
      },
    });

    const prompt = `${systemPrompt}\n\n사용자 입력:\n${text}`;
    const result = await model.generateContent(prompt);
    const response = result.response;
    const responseText = response.text();

    // JSON 파싱
    let parsed;
    try {
      parsed = JSON.parse(responseText);
    } catch (parseError) {
      console.error('JSON 파싱 실패:', responseText);
      throw new Error('AI 응답을 파싱할 수 없습니다.');
    }

    // 유효성 검사
    if (!parsed.stats || !parsed.xp || !parsed.comment) {
      throw new Error('AI 응답 형식이 올바르지 않습니다.');
    }

    return NextResponse.json(parsed);
  } catch (error) {
    console.error('Error in trial analyze API:', error);
    return NextResponse.json(
      { error: 'AI 분석 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
