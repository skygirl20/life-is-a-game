'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import TutorialModal from '@/components/TutorialModal';

export default function TrialPage() {
  const [text, setText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [trialCount, setTrialCount] = useState(0);
  const [showTutorial, setShowTutorial] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // 체험 횟수 확인
    const count = parseInt(localStorage.getItem('trialPlayCount') || '0');
    setTrialCount(count);

    // 튜토리얼 표시 확인 (체험 모드 전용)
    const tutorialCompleted = localStorage.getItem('trialTutorialCompleted');
    if (!tutorialCompleted) {
      setShowTutorial(true);
    }
  }, []);

  const handleCloseTutorial = () => {
    setShowTutorial(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!text.trim()) {
      alert('오늘의 플레이를 입력해주세요.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/analyze-trial', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: text.trim() }),
      });

      if (!response.ok) {
        throw new Error('분석 실패');
      }

      const result = await response.json();
      
      // 체험 결과를 localStorage에 저장
      localStorage.setItem('trialResult', JSON.stringify(result));
      
      // 체험 횟수 증가
      const newCount = trialCount + 1;
      localStorage.setItem('trialPlayCount', newCount.toString());
      
      // 결과 페이지로 이동
      router.push('/trial/result');
    } catch (error) {
      console.error('Error:', error);
      alert('AI 분석 중 오류가 발생했습니다.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center p-4">
      {/* 튜토리얼 모달 */}
      {showTutorial && <TutorialModal onClose={handleCloseTutorial} storageKey="trialTutorialCompleted" />}
      
      <div className="max-w-3xl w-full">
        {/* 헤더 */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <h1 className="text-4xl font-bold text-white mb-2 hover:scale-105 transition-transform">
              Life As A Game
            </h1>
          </Link>
          <div className="space-y-1 mt-4">
            <div className="text-yellow-300 font-medium">
              🎮 체험 플레이 · Lv.0
            </div>
            <div className="text-white/60 text-sm">
              체험 횟수: {trialCount}회 (저장되지 않습니다)
            </div>
          </div>
        </div>

        {/* 체험 안내 */}
        <div className="bg-yellow-400/10 border border-yellow-400/30 rounded-xl px-4 py-3 mb-6">
          <p className="text-yellow-200/90 text-sm">
            💡 체험 모드에서는 데이터가 저장되지 않습니다. 정식으로 플레이하려면{' '}
            <Link href="/signup" className="text-yellow-300 font-bold hover:underline">
              캐릭터를 생성
            </Link>
            하세요.
          </p>
        </div>

        {/* 입력 힌트 */}
        <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 mb-4">
          <p className="text-white/70 text-sm">
            💡 플레이 로그 예시: "공부 2시간, 운동은 못 했고, 프로젝트 조금 진행함"
          </p>
        </div>

        {/* 입력 폼 */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20">
            <label className="block text-white font-medium text-lg mb-4">
              오늘의 플레이를 기록하세요
            </label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="오늘 무엇을 했나요?&#10;&#10;예시:&#10;- 공부 3시간 했고 집중 잘 됐음&#10;- 운동 30분, 컨디션 보통&#10;- 친구 만나서 스트레스 풀림&#10;- 프로젝트 진행 안 함, 좀 미룸"
              rows={10}
              className="w-full px-4 py-3 bg-white/5 border-2 border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-pink-500 transition-colors resize-none"
              disabled={isLoading}
            />
            <div className="text-right mt-2">
              <span className="text-white/50 text-sm">
                {text.length}자
              </span>
            </div>
          </div>

          {/* 제출 버튼 */}
          <button
            type="submit"
            disabled={isLoading || !text.trim()}
            className="w-full py-4 bg-gradient-to-r from-yellow-400 to-pink-500 text-white text-xl font-bold rounded-full hover:scale-105 transition-transform duration-200 shadow-2xl hover:shadow-pink-500/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {isLoading ? 'AI가 분석하는 중...' : '📊 스탯 계산하기'}
          </button>
        </form>

        {/* 하단 링크 */}
        <div className="mt-6 text-center space-y-2">
          <p className="text-white/60 text-sm">
            마음에 드셨나요?{' '}
            <Link href="/signup" className="text-yellow-300 hover:text-yellow-200 font-medium">
              정식 캐릭터 생성하기
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
