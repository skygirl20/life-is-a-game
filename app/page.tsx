'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth-service';
import Link from 'next/link';

export default function Home() {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const user = await getCurrentUser();
    setLoggedIn(!!user);
    setIsChecking(false);
  };

  const handleStart = () => {
    if (loggedIn) {
      router.push('/character');
    } else {
      router.push('/signup');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex flex-col">
      {/* 메인 컨텐츠 */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full text-center space-y-6">
          {/* 타이틀 */}
          <div className="space-y-3">
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
          <div className="pt-6 space-y-3">
            <button
              onClick={handleStart}
              disabled={isChecking}
              className="inline-block px-10 py-4 bg-gradient-to-r from-yellow-400 to-pink-500 text-white text-xl font-bold rounded-full hover:scale-105 transition-transform duration-200 shadow-2xl hover:shadow-pink-500/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {isChecking ? '로딩 중...' : (loggedIn ? '⚔️ 내 캐릭터 보기' : '⚔️ 플레이 시작')}
            </button>

            {!loggedIn && !isChecking && (
              <div className="space-y-2">
                <p className="text-white/60 text-sm">또는</p>
                <Link
                  href="/trial"
                  className="inline-block px-8 py-3 bg-white/10 text-white text-base font-medium rounded-full hover:bg-white/20 transition-colors border border-white/20"
                >
                  🎮 로그인 없이 체험하기
                </Link>
                <p className="text-white/50 text-xs">(체험 모드는 데이터가 저장되지 않습니다)</p>
              </div>
            )}
          </div>

          {/* 하단 정보 */}
          <div className="pt-8 text-white/50 text-sm space-y-1">
            <p>할 일 관리 앱이 아닙니다</p>
            <p>당신의 하루를 게임으로 재해석합니다</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-4 text-center">
        <p className="text-white/30 text-xs">
          © 2026 skygirl20 | Life As A Game. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
