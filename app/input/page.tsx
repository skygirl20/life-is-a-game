'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function InputPage() {
  const [text, setText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!text.trim()) {
      alert('오늘의 활동을 입력해주세요!');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        throw new Error('분석 중 오류가 발생했습니다.');
      }

      const result = await response.json();
      
      // 결과를 localStorage에 저장하고 결과 페이지로 이동
      localStorage.setItem('gameResult', JSON.stringify(result));
      router.push('/result');
    } catch (error) {
      console.error('Error:', error);
      alert('분석 중 오류가 발생했습니다. 다시 시도해주세요.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center p-4">
      <div className="max-w-3xl w-full">
        {/* 헤더 */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <h1 className="text-4xl font-bold text-white mb-2 hover:scale-105 transition-transform">
              Life As A Game
            </h1>
          </Link>
          <p className="text-white/70 text-lg">오늘 하루를 플레이한 기록을 남겨보세요</p>
        </div>

        {/* 입력 카드 */}
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 안내 문구 */}
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                📝 오늘의 플레이 기록
              </h2>
              <p className="text-white/60 text-sm">
                오늘 무엇을 했나요? 일한 것, 공부한 것, 운동한 것, 쉬운 것... 자유롭게 기록해주세요.
              </p>
            </div>

            {/* 텍스트 입력 */}
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="예시: 오늘은 아침 7시에 일어나서 30분 조깅을 했다. 회사에서 새로운 프로젝트 기획서를 3시간 동안 작성했고, 점심은 동료들과 함께 먹었다. 저녁에는 온라인 강의를 1시간 들었고, 책을 읽다가 잠들었다."
              className="w-full h-64 px-6 py-4 bg-white/5 border-2 border-white/20 rounded-2xl text-white placeholder-white/40 focus:outline-none focus:border-pink-500 transition-colors resize-none"
              disabled={isLoading}
            />

            {/* 글자 수 */}
            <div className="text-right text-white/50 text-sm">
              {text.length} 글자
            </div>

            {/* 제출 버튼 */}
            <button
              type="submit"
              disabled={isLoading || !text.trim()}
              className="w-full py-4 bg-gradient-to-r from-yellow-400 to-pink-500 text-white text-xl font-bold rounded-full hover:scale-105 transition-transform duration-200 shadow-2xl hover:shadow-pink-500/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  AI가 분석 중입니다...
                </span>
              ) : (
                '🎯 스탯 계산하기'
              )}
            </button>
          </form>
        </div>

        {/* 하단 팁 */}
        <div className="mt-6 text-center text-white/50 text-sm">
          💡 Tip: 구체적으로 적을수록 더 정확한 스탯을 받을 수 있어요
        </div>
      </div>
    </div>
  );
}
