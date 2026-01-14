import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { updateCharacterStats, saveDailyLog } from '@/lib/character-service';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || '');

export async function POST(request: NextRequest) {
  try {
    const { text, characterId } = await request.json();

    if (!text || typeof text !== 'string') {
      return NextResponse.json(
        { error: '유효한 텍스트를 입력해주세요.' },
        { status: 400 }
      );
    }

    if (!characterId || typeof characterId !== 'string') {
      return NextResponse.json(
        { error: '캐릭터 ID가 필요합니다.' },
        { status: 400 }
      );
    }

    if (!process.env.GOOGLE_API_KEY) {
      return NextResponse.json(
        { error: 'Google API 키가 설정되지 않았습니다.' },
        { status: 500 }
      );
    }

    // AI 프롬프트 설계
    const systemPrompt = `당신은 RPG 게임의 스탯 분석 시스템입니다.
사용자가 입력한 하루 동안의 행동을 분석하여, 게임 캐릭터의 스탯 변화로 변환해야 합니다.

스탯 정의:
- focus (집중력): 업무, 공부, 집중이 필요한 활동 → -3 ~ +3
- health (체력): 운동, 신체 활동, 수면 → -3 ~ +3
- mental (멘탈): 휴식, 취미, 여가, 정신 건강 → -3 ~ +3
- growth (성장): 새로운 학습, 도전, 자기계발 → -3 ~ +3

경험치(XP) 계산:
- 기본: 50 XP
- 활동의 다양성, 강도, 의미에 따라 0~200 XP 범위로 조정

캐릭터 코멘트:
- RPG 게임 캐릭터가 플레이어에게 말하는 것처럼 작성
- 오늘의 플레이를 한 줄로 요약
- 격려, 인정, 또는 부드러운 조언 포함
- 한국어로 작성
- 50자 이내

반드시 아래 JSON 형식으로만 응답하세요:
{
  "stats": {
    "focus": number,
    "health": number,
    "mental": number,
    "growth": number
  },
  "xp": number,
  "comment": "string"
}

오늘의 활동:
${text}`;

    const model = genAI.getGenerativeModel({ 
      model: 'gemini-1.5-flash',
      generationConfig: {
        temperature: 0.7,
        responseMimeType: 'application/json',
      },
    });

    const result = await model.generateContent(systemPrompt);
    const response = result.response;
    const responseText = response.text();

    if (!responseText) {
      throw new Error('AI 응답이 비어있습니다.');
    }

    const parsed = JSON.parse(responseText);

    // 응답 검증
    if (
      !parsed.stats ||
      typeof parsed.stats.focus !== 'number' ||
      typeof parsed.stats.health !== 'number' ||
      typeof parsed.stats.mental !== 'number' ||
      typeof parsed.stats.growth !== 'number' ||
      typeof parsed.xp !== 'number' ||
      typeof parsed.comment !== 'string'
    ) {
      throw new Error('AI 응답 형식이 올바르지 않습니다.');
    }

    // 캐릭터 스탯 업데이트
    const updatedCharacter = await updateCharacterStats(
      characterId,
      parsed.stats,
      parsed.xp
    );

    if (!updatedCharacter) {
      throw new Error('캐릭터 업데이트에 실패했습니다.');
    }

    // 플레이 로그 저장
    await saveDailyLog(
      characterId,
      text,
      parsed.stats,
      parsed.xp,
      parsed.comment
    );

    // 업데이트된 캐릭터 정보와 AI 결과 함께 반환
    return NextResponse.json({
      ...parsed,
      character: updatedCharacter,
    });
  } catch (error) {
    console.error('Error in analyze API:', error);
    
    return NextResponse.json(
      { 
        error: '분석 중 오류가 발생했습니다.',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
