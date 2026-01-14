'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createCharacter } from '@/lib/character-service';

export default function CreateCharacterPage() {
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      alert('닉네임을 입력해주세요!');
      return;
    }

    setIsLoading(true);

    try {
      const character = await createCharacter(name.trim());
      
      if (!character) {
        throw new Error('캐릭터 생성에 실패했습니다. Supabase 테이블이 생성되었는지 확인해주세요.');
      }

      // 캐릭터 생성 완료 후 입력 페이지로 이동
      router.push('/input');
    } catch (error) {
      console.error('Error:', error);
      const errorMessage = error instanceof Error 
        ? error.message 
        : '캐릭터 생성 중 오류가 발생했습니다.';
      alert(`오류: ${errorMessage}\n\n브라우저 콘솔(F12)에서 자세한 오류를 확인하세요.`);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* 타이틀 */}
        <div className="text-center mb-8 space-y-4">
          <h1 className="text-5xl font-bold text-white drop-shadow-lg">
            Life As A Game
          </h1>
          <div className="h-1 w-24 mx-auto bg-gradient-to-r from-yellow-400 to-pink-500 rounded-full"></div>
          <p className="text-xl text-white/90 mt-4">캐릭터 생성</p>
          <p className="text-white/70">당신을 대표할 캐릭터의 닉네임을 정해주세요</p>
        </div>

        {/* 캐릭터 생성 카드 */}
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 캐릭터 아이콘 */}
            <div className="text-center">
              <div className="inline-block text-8xl mb-4">⚔️</div>
              <p className="text-white/60 text-sm">
                Lv.1에서 시작합니다
              </p>
            </div>

            {/* 닉네임 입력 */}
            <div className="space-y-2">
              <label className="block text-white font-medium">
                닉네임
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="예: 모험가123"
                maxLength={20}
                className="w-full px-4 py-3 bg-white/5 border-2 border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-pink-500 transition-colors"
                disabled={isLoading}
                autoFocus
              />
              <p className="text-white/50 text-sm text-right">
                {name.length}/20
              </p>
            </div>

            {/* 초기 스탯 안내 */}
            <div className="bg-white/5 rounded-xl p-4 space-y-2">
              <p className="text-white/80 text-sm font-medium">초기 스탯</p>
              <div className="grid grid-cols-2 gap-2 text-white/60 text-sm">
                <div>• Level: 1</div>
                <div>• XP: 0</div>
                <div>• 집중력: 0</div>
                <div>• 체력: 0</div>
                <div>• 멘탈: 0</div>
                <div>• 성장: 0</div>
              </div>
            </div>

            {/* 생성 버튼 */}
            <button
              type="submit"
              disabled={isLoading || !name.trim()}
              className="w-full py-4 bg-gradient-to-r from-yellow-400 to-pink-500 text-white text-xl font-bold rounded-full hover:scale-105 transition-transform duration-200 shadow-2xl hover:shadow-pink-500/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  생성 중...
                </span>
              ) : (
                '🎮 캐릭터 생성하기'
              )}
            </button>
          </form>
        </div>

        {/* 하단 안내 */}
        <div className="mt-6 text-center text-white/50 text-sm">
          <p>매일 플레이하면서 캐릭터를 성장시켜보세요</p>
        </div>
      </div>
    </div>
  );
}
