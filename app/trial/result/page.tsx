'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface TrialResult {
  stats: {
    focus: number;
    health: number;
    mental: number;
    growth: number;
  };
  xp: number;
  comment: string;
}

const StatBar = ({ label, value, icon, color }: { label: string; value: number; icon: string; color: string }) => (
  <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20">
    <div className="flex items-center justify-between mb-2">
      <div className="flex items-center gap-2">
        <span className="text-2xl">{icon}</span>
        <span className="text-white font-medium">{label}</span>
      </div>
      <span className={`text-xl font-bold ${value > 0 ? 'text-green-400' : value < 0 ? 'text-red-400' : 'text-gray-400'}`}>
        {value > 0 ? `+${value}` : value}
      </span>
    </div>
    <div className="h-2 bg-white/20 rounded-full overflow-hidden">
      <div
        className={`h-full ${color} transition-all duration-500 ease-out`}
        style={{ width: `${Math.abs(value) * 33.33}%` }}
      />
    </div>
  </div>
);

export default function TrialResultPage() {
  const [result, setResult] = useState<TrialResult | null>(null);
  const router = useRouter();

  useEffect(() => {
    const savedResult = localStorage.getItem('trialResult');
    if (!savedResult) {
      router.push('/trial');
      return;
    }
    try {
      const parsed = JSON.parse(savedResult);
      setResult(parsed);
    } catch (error) {
      console.error('Failed to parse result:', error);
      router.push('/trial');
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
          <h1 className="text-3xl font-bold text-white mb-2">
            체험 플레이 결과
          </h1>
          <div className="text-yellow-300 font-medium">
            🎮 Lv.0 체험 모드
          </div>
        </div>

        {/* 체험 안내 */}
        <div className="bg-yellow-400/20 border border-yellow-400/50 rounded-xl px-4 py-3">
          <p className="text-yellow-200 text-sm text-center">
            ⚠️ 체험 모드에서는 데이터가 저장되지 않습니다
          </p>
        </div>

        {/* XP 섹션 */}
        <div className="bg-gradient-to-r from-yellow-400/20 to-pink-500/20 rounded-2xl p-6 border border-yellow-400/30">
          <div className="text-center space-y-2">
            <p className="text-white/80 text-sm font-medium">획득 경험치</p>
            <p className="text-5xl font-bold text-yellow-300">+{result.xp} XP</p>
            <p className="text-white/60 text-sm">(체험 모드에서는 누적되지 않습니다)</p>
          </div>
        </div>

        {/* AI 코멘트 */}
        <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl p-6 border border-purple-400/30">
          <div className="text-center">
            <p className="text-purple-200 text-sm font-medium mb-2">💬 AI 코멘트</p>
            <p className="text-white text-lg italic">"{result.comment}"</p>
          </div>
        </div>

        {/* 스탯 */}
        <div className="space-y-3">
          <h2 className="text-white text-xl font-bold text-center mb-4">📊 오늘의 스탯</h2>
          <StatBar label="집중력" value={result.stats.focus} icon="🎯" color="bg-gradient-to-r from-blue-400 to-blue-600" />
          <StatBar label="체력" value={result.stats.health} icon="💪" color="bg-gradient-to-r from-green-400 to-green-600" />
          <StatBar label="멘탈" value={result.stats.mental} icon="🧠" color="bg-gradient-to-r from-purple-400 to-purple-600" />
          <StatBar label="성장" value={result.stats.growth} icon="📈" color="bg-gradient-to-r from-pink-400 to-pink-600" />
        </div>

        {/* 액션 버튼 */}
        <div className="space-y-4 pt-4">
          <Link
            href="/trial"
            className="block w-full py-4 bg-white/10 text-white text-lg font-bold rounded-full hover:bg-white/20 transition-colors duration-200 border border-white/20 text-center"
          >
            ↻ 다시 체험하기
          </Link>
          <Link
            href="/signup"
            className="block w-full py-4 bg-gradient-to-r from-yellow-400 to-pink-500 text-white text-xl font-bold rounded-full hover:scale-105 transition-transform duration-200 shadow-2xl hover:shadow-pink-500/50 text-center"
          >
            ⚔️ 정식으로 시작하기
          </Link>
          <div className="text-center">
            <Link href="/" className="text-white/50 hover:text-white/80 text-sm">
              ← 메인으로 돌아가기
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
