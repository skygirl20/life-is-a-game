'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';

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
          <p className="text-xl text-white/90 mt-4">📧 이메일 확인 필요</p>
        </div>

        {/* 안내 카드 */}
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20 space-y-6">
          {/* 아이콘 */}
          <div className="text-center text-6xl mb-4">
            📬
          </div>

          {/* 메시지 */}
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold text-white">
              확인 이메일을 발송했습니다
            </h2>
            
            {email && (
              <p className="text-white/80 text-base">
                <span className="text-yellow-300 font-medium">{email}</span>
                <br />
                으로 확인 이메일을 보냈습니다.
              </p>
            )}

            <div className="bg-blue-500/10 border border-blue-400/30 rounded-xl p-4 text-left">
              <p className="text-white/90 text-sm leading-relaxed">
                📌 <strong>다음 단계:</strong>
                <br />
                <br />
                1. 이메일 받은편지함을 확인하세요
                <br />
                2. "Confirm your email" 이메일을 찾으세요
                <br />
                3. 이메일 내 확인 링크를 클릭하세요
                <br />
                4. 확인 후 로그인하세요
              </p>
            </div>

            <div className="bg-yellow-500/10 border border-yellow-400/30 rounded-xl p-4">
              <p className="text-white/80 text-xs leading-relaxed">
                💡 <strong>이메일이 오지 않나요?</strong>
                <br />
                스팸 메일함을 확인하거나, 잠시 후 다시 시도해주세요.
                <br />
                <br />
                <strong>⚡ 빠른 시작:</strong> 이메일 확인 없이 바로 로그인할 수도 있습니다.
              </p>
            </div>
          </div>

          {/* 로그인 버튼 */}
          <div className="pt-4">
            <Link
              href="/login"
              className="block w-full py-4 bg-gradient-to-r from-yellow-400 to-pink-500 text-white text-lg font-bold rounded-full hover:scale-105 transition-transform duration-200 shadow-2xl hover:shadow-pink-500/50 text-center cursor-pointer"
            >
              ✅ 이메일 확인 후 로그인하기
            </Link>
          </div>

          {/* 홈으로 */}
          <div className="text-center">
            <Link href="/" className="text-white/60 hover:text-white/90 text-sm transition-colors">
              🏠 홈으로 돌아가기
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center">
        <div className="text-white text-xl">로딩 중...</div>
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  );
}
