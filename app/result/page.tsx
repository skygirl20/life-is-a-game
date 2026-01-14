'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getCurrentUser } from '@/lib/auth-service';
import { Character } from '@/lib/supabase';
import { getLevelMessage, getXPForCurrentLevel, getRequiredXP } from '@/lib/level-system';

interface GameResult {
  stats: {
    focus: number;
    health: number;
    mental: number;
    growth: number;
  };
  xp: number;
  comment: string;
  character?: Character;
  levelUp?: {
    leveled: boolean;
    oldLevel: number;
    newLevel: number;
  };
}

const StatBar = ({ label, value, icon, color }: { label: string; value: number; icon: string; color: string }) => {
  const percentage = ((value + 3) / 6) * 100; // -3 ~ +3을 0 ~ 100%로 변환
  const displayValue = value > 0 ? `+${value}` : value;
  
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{icon}</span>
          <span className="text-white font-medium">{label}</span>
        </div>
        <span className={`text-xl font-bold ${value > 0 ? 'text-green-400' : value < 0 ? 'text-red-400' : 'text-gray-400'}`}>
          {displayValue}
        </span>
      </div>
      <div className="h-3 bg-white/10 rounded-full overflow-hidden">
        <div
          className={`h-full ${color} transition-all duration-1000 ease-out`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export default function ResultPage() {
  const [result, setResult] = useState<GameResult | null>(null);
  const router = useRouter();

  useEffect(() => {
    checkAuthAndLoadResult();
  }, [router]);

  const checkAuthAndLoadResult = async () => {
    // 로그인 확인
    const user = await getCurrentUser();
    if (!user) {
      router.push('/login');
      return;
    }

    const savedResult = localStorage.getItem('gameResult');
    
    if (!savedResult) {
      router.push('/input');
      return;
    }

    try {
      const parsed = JSON.parse(savedResult);
      setResult(parsed);
    } catch (error) {
      console.error('Failed to parse result:', error);
      router.push('/input');
    }
  }, [router]);

  if (!result) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center">
        <div className="text-white text-xl">로딩 중...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full space-y-6">
        {/* 헤더 */}
        <div className="text-center">
          <Link href="/" className="inline-block">
            <h1 className="text-3xl font-bold text-white mb-2 hover:scale-105 transition-transform">
              Life As A Game
            </h1>
          </Link>
          {result.character && (
            <div className="text-yellow-300 font-medium mt-2">
              ⚔️ {result.character.name} · Lv.{result.character.level} · XP {result.character.xp}
            </div>
          )}
        </div>

        {/* 메인 결과 카드 */}
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20 space-y-8">
          {/* 타이틀 */}
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold text-white">🎮 오늘의 플레이 결과</h2>
            <div className="h-1 w-24 mx-auto bg-gradient-to-r from-yellow-400 to-pink-500 rounded-full"></div>
          </div>

          {/* 레벨업 메시지 */}
          {result.levelUp?.leveled && (
            <div className={`rounded-2xl p-6 border-2 ${
              getLevelMessage(result.levelUp.newLevel).isSpecial
                ? 'bg-gradient-to-r from-yellow-400/30 to-pink-500/30 border-yellow-400 shadow-2xl shadow-yellow-400/50'
                : 'bg-white/10 border-white/30'
            }`}>
              <div className="text-center space-y-2">
                <h3 className="text-2xl font-bold text-white">
                  {getLevelMessage(result.levelUp.newLevel).title}
                </h3>
                <p className="text-white/90 text-lg leading-relaxed">
                  {getLevelMessage(result.levelUp.newLevel).message}
                </p>
              </div>
            </div>
          )}

          {/* 경험치 */}
          <div className="bg-gradient-to-r from-yellow-400/20 to-pink-500/20 rounded-2xl p-6 border border-yellow-400/30">
            <div className="text-center space-y-2">
              <p className="text-white/80 text-sm font-medium">획득 경험치</p>
              <p className="text-5xl font-bold text-yellow-300">+{result.xp} XP</p>
              {result.character && (
                <>
                  <p className="text-white/60 text-sm">
                    총 XP: {result.character.xp}
                  </p>
                  <div className="mt-4 pt-4 border-t border-white/20">
                    <p className="text-white/70 text-sm">
                      다음 레벨까지: {getRequiredXP(result.character.level) - getXPForCurrentLevel(result.character.xp, result.character.level)} XP
                    </p>
                    <div className="mt-2 h-2 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-yellow-400 to-pink-500 transition-all duration-1000"
                        style={{
                          width: `${(getXPForCurrentLevel(result.character.xp, result.character.level) / getRequiredXP(result.character.level)) * 100}%`
                        }}
                      />
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* 스탯 */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white text-center mb-4">📊 스탯 변화</h3>
            <StatBar
              label="집중력"
              value={result.stats.focus}
              icon="🎯"
              color="bg-blue-500"
            />
            <StatBar
              label="체력"
              value={result.stats.health}
              icon="💪"
              color="bg-green-500"
            />
            <StatBar
              label="멘탈"
              value={result.stats.mental}
              icon="🧠"
              color="bg-purple-500"
            />
            <StatBar
              label="성장"
              value={result.stats.growth}
              icon="📈"
              color="bg-pink-500"
            />
          </div>

          {/* AI 코멘트 */}
          <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
            <div className="flex items-start gap-3">
              <span className="text-3xl">💬</span>
              <div className="flex-1">
                <p className="text-white/60 text-sm mb-2">캐릭터의 한마디</p>
                <p className="text-white text-lg leading-relaxed italic">
                  "{result.comment}"
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 액션 버튼 */}
        <div className="flex gap-4">
          <Link
            href="/input"
            className="flex-1 py-4 bg-gradient-to-r from-yellow-400 to-pink-500 text-white text-lg font-bold rounded-full hover:scale-105 transition-transform duration-200 shadow-xl text-center"
          >
            🔄 다시 기록하기
          </Link>
          <Link
            href="/"
            className="flex-1 py-4 bg-white/10 backdrop-blur text-white text-lg font-bold rounded-full hover:bg-white/20 transition-colors duration-200 border border-white/20 text-center"
          >
            🏠 홈으로
          </Link>
        </div>

        {/* 하단 정보 */}
        <div className="text-center text-white/50 text-sm">
          <p>매일 기록하면 당신의 캐릭터는 계속 성장합니다</p>
        </div>
      </div>
    </div>
  );
}
