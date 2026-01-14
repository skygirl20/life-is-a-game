'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getCharacterId, getCharacter } from '@/lib/character-service';

export default function Home() {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    checkCharacter();
  }, []);

  const checkCharacter = async () => {
    const characterId = getCharacterId();
    
    // 로컬에 캐릭터 ID가 있는지 확인
    if (!characterId) {
      setIsChecking(false);
      return;
    }

    // 실제로 캐릭터가 존재하는지 확인
    const character = await getCharacter(characterId);
    setIsChecking(false);
  };

  const handleStart = () => {
    const characterId = getCharacterId();
    
    if (characterId) {
      router.push('/input');
    } else {
      router.push('/create-character');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full text-center space-y-8">
        {/* 타이틀 */}
        <div className="space-y-4">
          <h1 className="text-6xl font-bold text-white drop-shadow-lg">
            Life As A Game
          </h1>
          <div className="h-1 w-32 mx-auto bg-gradient-to-r from-yellow-400 to-pink-500 rounded-full"></div>
        </div>

        {/* 캐치 문구 */}
        <p className="text-2xl md:text-3xl text-white/90 font-medium leading-relaxed">
          오늘 당신의 캐릭터는<br />
          얼마나 성장했나요?
        </p>

        {/* 서브 설명 */}
        <p className="text-lg text-white/70 max-w-md mx-auto">
          현실에서의 하루 행동을 RPG 게임 캐릭터의 성장 시스템으로 변환해보세요
        </p>

        {/* CTA 버튼 */}
        <div className="pt-8">
          <button
            onClick={handleStart}
            disabled={isChecking}
            className="inline-block px-10 py-4 bg-gradient-to-r from-yellow-400 to-pink-500 text-white text-xl font-bold rounded-full hover:scale-105 transition-transform duration-200 shadow-2xl hover:shadow-pink-500/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {isChecking ? '로딩 중...' : '🎮 오늘의 플레이 기록하기'}
          </button>
        </div>

        {/* 하단 정보 */}
        <div className="pt-12 text-white/50 text-sm space-y-2">
          <p>할 일 관리 앱이 아닙니다</p>
          <p>당신의 하루를 게임으로 재해석합니다</p>
        </div>
      </div>
    </div>
  );
}
