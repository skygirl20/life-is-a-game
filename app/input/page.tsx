'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getCharacterId, getCharacter } from '@/lib/character-service';
import { Character } from '@/lib/supabase';
import TutorialModal from '@/components/TutorialModal';
import { getXPForCurrentLevel, getRequiredXP } from '@/lib/level-system';

export default function InputPage() {
  const [text, setText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [character, setCharacter] = useState<Character | null>(null);
  const [isLoadingCharacter, setIsLoadingCharacter] = useState(true);
  const [showTutorial, setShowTutorial] = useState(false);
  const router = useRouter();

  useEffect(() => {
    loadCharacter();
  }, []);

  const loadCharacter = async () => {
    const characterId = getCharacterId();
    
    if (!characterId) {
      router.push('/create-character');
      return;
    }

    const char = await getCharacter(characterId);
    
    if (!char) {
      router.push('/create-character');
      return;
    }

    setCharacter(char);
    setIsLoadingCharacter(false);

    // 튜토리얼 표시 여부 확인
    checkTutorial();
  };

  const checkTutorial = () => {
    // localStorage에서 튜토리얼 완료 여부 확인
    const tutorialCompleted = localStorage.getItem('tutorialCompleted');
    
    // 튜토리얼을 본 적이 없으면 표시
    if (!tutorialCompleted) {
      setShowTutorial(true);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!text.trim()) {
      alert('오늘의 활동을 입력해주세요!');
      return;
    }

    if (!character) {
      alert('캐릭터 정보를 불러오는 중입니다.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text, characterId: character.id }),
      });

      if (!response.ok) {
        throw new Error('분석 중 오류가 발생했습니다.');
      }

      const result = await response.json();
      
      // 에러 응답 확인
      if (!response.ok || result.error) {
        const errorMsg = result.details || result.error || '알 수 없는 오류가 발생했습니다.';
        console.error('API 에러:', result);
        alert(`오류: ${errorMsg}\n\n브라우저 콘솔(F12)에서 자세한 오류를 확인하세요.`);
        setIsLoading(false);
        return;
      }
      
      // 결과를 localStorage에 저장하고 결과 페이지로 이동
      localStorage.setItem('gameResult', JSON.stringify(result));
      router.push('/result');
    } catch (error) {
      console.error('Error:', error);
      const errorMsg = error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.';
      alert(`오류: ${errorMsg}\n\n브라우저 콘솔(F12)에서 자세한 오류를 확인하세요.`);
      setIsLoading(false);
    }
  };

  if (isLoadingCharacter) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center">
        <div className="text-white text-xl">로딩 중...</div>
      </div>
    );
  }

  return (
    <>
      {/* 튜토리얼 모달 */}
      {showTutorial && <TutorialModal onClose={() => setShowTutorial(false)} />}

      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center p-4">
        <div className="max-w-3xl w-full">
        {/* 헤더 */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <h1 className="text-4xl font-bold text-white mb-2 hover:scale-105 transition-transform">
              Life As A Game
            </h1>
          </Link>
          {character && (
            <div className="space-y-1">
              <div className="text-yellow-300 font-medium">
                ⚔️ {character.name} · Lv.{character.level}
              </div>
              <div className="text-white/60 text-sm">
                XP: {getXPForCurrentLevel(character.xp, character.level)} / {getRequiredXP(character.level)}
              </div>
            </div>
          )}
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
              {/* 입력 힌트 */}
              <div className="bg-yellow-400/10 border border-yellow-400/30 rounded-xl px-4 py-2 mt-3">
                <p className="text-yellow-200/80 text-sm">
                  💡 플레이 로그 예시<br />
                  "공부 2시간, 운동은 못 했고, 프로젝트 조금 진행함"
                </p>
              </div>
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
    </>
  );
}
