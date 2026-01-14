import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { getCurrentUser } from '@/lib/auth-service';
import { getCharacter } from '@/lib/character-service';
import { getPlayStyle, getRankTier } from '@/lib/player-style';

export const dynamic = 'force-dynamic';

interface PlayerInfo {
  nickname: string;
  level: number;
  playStyle: string;
  rankTier: string;
  isMe: boolean;
}

export async function GET(request: NextRequest) {
  try {
    // 1. 로그인 확인
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: '로그인이 필요합니다.' },
        { status: 401 }
      );
    }

    // 2. 내 캐릭터 조회
    const { data: myCharacterData, error: myCharError } = await supabase
      .from('characters')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (myCharError || !myCharacterData) {
      return NextResponse.json(
        { error: '캐릭터를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    // 3. 레벨 5 이상 확인
    if (myCharacterData.level < 5) {
      return NextResponse.json(
        { error: 'Lv.5 이상만 이용 가능합니다.' },
        { status: 403 }
      );
    }

    // 4. Lv.5 이상인 모든 플레이어 조회 (XP 내림차순)
    const { data: allPlayers, error: playersError } = await supabase
      .from('characters')
      .select('id, nickname, level, xp, focus, health, mental, growth, user_id')
      .gte('level', 5)
      .order('xp', { ascending: false });

    if (playersError || !allPlayers) {
      return NextResponse.json(
        { error: '플레이어 목록을 불러올 수 없습니다.' },
        { status: 500 }
      );
    }

    // 5. 내 랭킹 위치 계산 (나보다 XP가 높은 플레이어 수)
    const myXP = myCharacterData.xp;
    const higherRankedCount = allPlayers.filter(p => p.xp > myXP).length;
    const totalPlayers = allPlayers.length;
    const myRankTier = getRankTier(myXP, totalPlayers, higherRankedCount);

    // 6. 다른 플레이어 정보 가공 (최대 10명, 랜덤 샘플링)
    const otherPlayers = allPlayers
      .filter(p => p.user_id !== user.id)
      .sort(() => Math.random() - 0.5) // 랜덤 섞기
      .slice(0, 10)
      .map((player): PlayerInfo => {
        const playStyle = getPlayStyle({
          focus: player.focus,
          health: player.health,
          mental: player.mental,
          growth: player.growth,
        });

        // 해당 플레이어의 랭킹 구간 계산
        const playerHigherRanked = allPlayers.filter(p => p.xp > player.xp).length;
        const rankTier = getRankTier(player.xp, totalPlayers, playerHigherRanked);

        return {
          nickname: `익명 플레이어`, // MVP에서는 모두 익명
          level: player.level,
          playStyle,
          rankTier,
          isMe: false,
        };
      });

    // 7. 내 정보도 포함
    const myPlayStyle = getPlayStyle({
      focus: myCharacterData.focus,
      health: myCharacterData.health,
      mental: myCharacterData.mental,
      growth: myCharacterData.growth,
    });

    const myInfo: PlayerInfo = {
      nickname: myCharacterData.nickname,
      level: myCharacterData.level,
      playStyle: myPlayStyle,
      rankTier: myRankTier,
      isMe: true,
    };

    return NextResponse.json({
      success: true,
      myInfo,
      otherPlayers,
      totalPlayers, // 전체 Lv.5+ 플레이어 수
    });
  } catch (error) {
    console.error('플레이어 목록 조회 오류:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
