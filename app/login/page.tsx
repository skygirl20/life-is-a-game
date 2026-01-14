'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { signIn } from '@/lib/auth-service';

export default function LoginPage() {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userId.trim() || !password) {
      alert('아이디와 비밀번호를 입력해주세요.');
      return;
    }

    setIsLoading(true);

    try {
      const result = await signIn(userId.trim(), password);
      
      if (!result.success) {
        alert(result.error || '로그인에 실패했습니다.');
        setIsLoading(false);
        return;
      }

      // 로그인 성공 - 캐릭터 페이지로 이동
      router.push('/character');
    } catch (error) {
      console.error('Error:', error);
      alert('로그인 중 오류가 발생했습니다.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* 헤더 */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <h1 className="text-4xl font-bold text-white mb-2 hover:scale-105 transition-transform">
              Life As A Game
            </h1>
          </Link>
          <p className="text-xl text-white/90 mt-4">플레이어 접속</p>
          <p className="text-white/70 text-sm mt-2">이어서 플레이하기</p>
        </div>

        {/* 로그인 폼 */}
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 아이디 */}
            <div className="space-y-2">
              <label className="block text-white font-medium text-sm">
                아이디 (이메일 또는 사용자명)
              </label>
              <input
                type="text"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                placeholder="이메일 또는 사용자명 입력"
                className="w-full px-4 py-3 bg-white/5 border-2 border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-pink-500 transition-colors"
                disabled={isLoading}
                autoComplete="username"
              />
            </div>

            {/* 비밀번호 */}
            <div className="space-y-2">
              <label className="block text-white font-medium text-sm">
                비밀번호
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="비밀번호 입력"
                className="w-full px-4 py-3 bg-white/5 border-2 border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-pink-500 transition-colors"
                disabled={isLoading}
                autoComplete="current-password"
              />
            </div>

            {/* 제출 버튼 */}
            <button
              type="submit"
              disabled={isLoading || !userId || !password}
              className="w-full py-4 bg-gradient-to-r from-yellow-400 to-pink-500 text-white text-xl font-bold rounded-full hover:scale-105 transition-transform duration-200 shadow-2xl hover:shadow-pink-500/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {isLoading ? '접속 중...' : '⚔️ 접속하기'}
            </button>
          </form>

          {/* 회원가입 링크 */}
          <div className="mt-6 text-center">
            <p className="text-white/60 text-sm">
              아이디가 없으신가요?{' '}
              <Link href="/signup" className="text-yellow-300 hover:text-yellow-200 font-medium underline">
                회원가입
              </Link>
            </p>
          </div>
        </div>

        {/* 체험 링크 */}
        <div className="mt-6 text-center">
          <Link 
            href="/trial" 
            className="text-white/50 hover:text-white/80 text-sm transition-colors"
          >
            → 로그인 없이 체험하기 (Lv.0)
          </Link>
        </div>
      </div>
    </div>
  );
}
