'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getCharacterId, getCharacter } from '@/lib/character-service';
import { getCurrentUser, signOut } from '@/lib/auth-service';
import { Character } from '@/lib/supabase';
import { getXPForCurrentLevel, getRequiredXP } from '@/lib/level-system';

export default function CharacterPage() {
  const [character, setCharacter] = useState<Character | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    loadCharacter();
  }, []);

  const loadCharacter = async () => {
    // 로그인 확인
    const user = await getCurrentUser();
    if (!user) {
      router.push('/login');
      return;
    }

    const characterId = getCharacterId();
    
    if (!characterId) {
      router.push('/signup');
      return;
    }

    const char = await getCharacter(characterId);
    
    if (!char) {
      router.push('/signup');
      return;
    }

    setCharacter(char);
    setIsLoading(false);
  };

  const handleLogout = async () => {
    if (confirm('로그아웃 하시겠습니까?')) {
      await signOut();
      router.push('/');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center">
        <div className="text-white text-xl">로딩 중...</div>
      </div>
    );
  }

  if (!character) {
    return null;
  }

  const currentXP = getXPForCurrentLevel(character.xp, character.level);
  const requiredXP = getRequiredXP(character.level);
  const xpProgress = (currentXP / requiredXP) * 100;

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
          <p className="text-white/70">캐릭터 상태</p>
        </div>

        {/* 메인 캐릭터 카드 */}
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20 space-y-8">
          {/* 캐릭터 정보 */}
          <div className="text-center space-y-4">
            <div className="inline-block text-6xl mb-4">⚔️</div>
            <h2 className="text-3xl font-bold text-white">{character.name}</h2>
            <div className="inline-block px-6 py-2 bg-gradient-to-r from-yellow-400/20 to-pink-500/20 border border-yellow-400/30 rounded-full">
              <p className="text-xl font-bold text-yellow-300">
                Lv. {character.level}
              </p>
            </div>
          </div>

          {/* XP 진행도 */}
          <div className="space-y-3">
            <div className="flex justify-between text-white/80 text-sm">
              <span>경험치</span>
              <span>
                {currentXP} / {requiredXP} XP
              </span>
            </div>
            <div className="h-3 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-yellow-400 to-pink-500 transition-all duration-500"
                style={{ width: `${xpProgress}%` }}
              />
            </div>
            <p className="text-center text-white/60 text-sm">
              다음 레벨까지 {requiredXP - currentXP} XP
            </p>
          </div>

          {/* 구분선 */}
          <div className="h-px bg-white/20"></div>

          {/* 누적 스탯 */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white text-center mb-6">📊 누적 스탯</h3>
            
            <div className="grid grid-cols-2 gap-4">
              {/* 집중력 */}
              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">🎯</span>
                  <span className="text-white font-medium">집중력</span>
                </div>
                <p className="text-3xl font-bold text-blue-400">
                  {character.focus > 0 ? '+' : ''}{character.focus}
                </p>
              </div>

              {/* 체력 */}
              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">💪</span>
                  <span className="text-white font-medium">체력</span>
                </div>
                <p className="text-3xl font-bold text-green-400">
                  {character.health > 0 ? '+' : ''}{character.health}
                </p>
              </div>

              {/* 멘탈 */}
              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">🧠</span>
                  <span className="text-white font-medium">멘탈</span>
                </div>
                <p className="text-3xl font-bold text-purple-400">
                  {character.mental > 0 ? '+' : ''}{character.mental}
                </p>
              </div>

              {/* 성장 */}
              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">📈</span>
                  <span className="text-white font-medium">성장</span>
                </div>
                <p className="text-3xl font-bold text-pink-400">
                  {character.growth > 0 ? '+' : ''}{character.growth}
                </p>
              </div>
            </div>
          </div>

          {/* 총 경험치 */}
          <div className="text-center pt-4">
            <p className="text-white/60 text-sm">
              총 획득 경험치: <span className="text-yellow-300 font-bold">{character.xp} XP</span>
            </p>
          </div>
        </div>

        {/* 액션 버튼 */}
        <div className="space-y-4">
          <Link
            href="/input"
            className="block w-full py-4 bg-gradient-to-r from-yellow-400 to-pink-500 text-white text-xl font-bold rounded-full hover:scale-105 transition-transform duration-200 shadow-2xl hover:shadow-pink-500/50 text-center"
          >
            ▶ 오늘의 플레이 기록하기
          </Link>
          
          <div className="flex gap-3">
            <Link
              href="/"
              className="flex-1 py-3 bg-white/10 backdrop-blur text-white text-base font-medium rounded-full hover:bg-white/20 transition-colors duration-200 border border-white/20 text-center"
            >
              🏠 홈으로
            </Link>
            <button
              onClick={handleLogout}
              className="flex-1 py-3 bg-white/5 backdrop-blur text-white/80 text-base font-medium rounded-full hover:bg-red-500/20 hover:text-white transition-colors duration-200 border border-white/10"
            >
              🚪 로그아웃
            </button>
          </div>
        </div>

        {/* 하단 정보 */}
        <div className="text-center text-white/50 text-sm">
          <p>매일 플레이하면 캐릭터는 계속 성장합니다</p>
        </div>
      </div>
    </div>
  );
}
