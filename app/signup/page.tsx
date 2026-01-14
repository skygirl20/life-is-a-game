'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { signUp } from '@/lib/auth-service';

export default function SignUpPage() {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [nickname, setNickname] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userId.trim() || !password || !nickname.trim()) {
      alert('모든 항목을 입력해주세요.');
      return;
    }

    if (password !== passwordConfirm) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }

    setIsLoading(true);

    try {
      const result = await signUp(userId.trim(), password, nickname.trim());
      
      if (!result.success) {
        alert(result.error || '회원가입에 실패했습니다.');
        setIsLoading(false);
        return;
      }

      // 회원가입 성공 - 이메일 확인 페이지로 이동
      router.push(`/verify-email?email=${encodeURIComponent(userId.trim())}`);
    } catch (error) {
      console.error('Error:', error);
      alert('회원가입 중 오류가 발생했습니다.');
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
          <p className="text-xl text-white/90 mt-4">정식 캐릭터 생성</p>
          <p className="text-white/70 text-sm mt-2">Lv.1부터 본격적인 플레이가 시작됩니다</p>
        </div>

        {/* 회원가입 폼 */}
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
                placeholder="이메일 또는 4자 이상 사용자명"
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
                placeholder="6자 이상"
                className="w-full px-4 py-3 bg-white/5 border-2 border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-pink-500 transition-colors"
                disabled={isLoading}
                autoComplete="new-password"
              />
            </div>

            {/* 비밀번호 확인 */}
            <div className="space-y-2">
              <label className="block text-white font-medium text-sm">
                비밀번호 확인
              </label>
              <input
                type="password"
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
                placeholder="비밀번호 재입력"
                className="w-full px-4 py-3 bg-white/5 border-2 border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-pink-500 transition-colors"
                disabled={isLoading}
                autoComplete="new-password"
              />
            </div>

            {/* 캐릭터 이름 */}
            <div className="space-y-2">
              <label className="block text-white font-medium text-sm">
                캐릭터 이름
              </label>
              <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="게임에서 사용할 이름"
                maxLength={20}
                className="w-full px-4 py-3 bg-white/5 border-2 border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-pink-500 transition-colors"
                disabled={isLoading}
              />
              <p className="text-white/50 text-xs text-right">
                {nickname.length}/20
              </p>
            </div>

            {/* 제출 버튼 */}
            <button
              type="submit"
              disabled={isLoading || !userId || !password || !passwordConfirm || !nickname}
              className="w-full py-4 bg-gradient-to-r from-yellow-400 to-pink-500 text-white text-xl font-bold rounded-full hover:scale-105 transition-transform duration-200 shadow-2xl hover:shadow-pink-500/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {isLoading ? '생성 중...' : '⚔️ 정식 시작하기'}
            </button>
          </form>

          {/* 로그인 링크 */}
          <div className="mt-6 text-center">
            <p className="text-white/60 text-sm">
              이미 계정이 있으신가요?{' '}
              <Link href="/login" className="text-yellow-300 hover:text-yellow-200 font-medium underline">
                로그인
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
