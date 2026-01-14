'use client';

import { useState } from 'react';

interface TutorialModalProps {
  onClose: () => void;
}

export default function TutorialModal({ onClose }: TutorialModalProps) {
  const [dontShowAgain, setDontShowAgain] = useState(false);

  const handleClose = () => {
    if (dontShowAgain) {
      localStorage.setItem('tutorialCompleted', 'true');
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 rounded-3xl p-8 max-w-2xl w-full shadow-2xl border border-white/20 max-h-[90vh] overflow-y-auto">
        {/* 제목 */}
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-white mb-2">
            🎮 Life As A Game에 오신 걸 환영합니다
          </h2>
          <div className="h-1 w-32 mx-auto bg-gradient-to-r from-yellow-400 to-pink-500 rounded-full"></div>
        </div>

        {/* 본문 */}
        <div className="space-y-6 text-white/90">
          <div className="bg-white/10 rounded-2xl p-6 backdrop-blur">
            <p className="text-lg leading-relaxed mb-4">
              이곳에서는 하루를 '기록'하지 않습니다.<br />
              하루를 '플레이'합니다.
            </p>
            <p className="text-base leading-relaxed">
              오늘 한 일을 편하게 적어주세요.<br />
              잘한 일만 쓸 필요도 없고,<br />
              못한 일을 숨길 필요도 없습니다.
            </p>
          </div>

          <div className="bg-white/5 rounded-2xl p-6">
            <p className="text-base leading-relaxed mb-4">
              AI가 오늘의 행동을 보고<br />
              당신의 캐릭터 스탯과 경험치로 바꿔줍니다.
            </p>
          </div>

          {/* 스탯 설명 */}
          <div className="bg-white/10 rounded-2xl p-6 backdrop-blur">
            <h3 className="text-xl font-bold mb-4">📌 스탯은 이렇게 해석됩니다.</h3>
            <div className="space-y-3 text-sm">
              <div>
                <span className="text-blue-300 font-medium">• 집중력:</span> 한 가지 일에 몰입한 시간이 있었는지
              </div>
              <div>
                <span className="text-green-300 font-medium">• 체력:</span> 몸을 돌봤는지, 또는 소모했는지
              </div>
              <div>
                <span className="text-purple-300 font-medium">• 멘탈:</span> 감정이 안정적이었는지
              </div>
              <div>
                <span className="text-pink-300 font-medium">• 성장:</span> 배움이나 새로운 시도가 있었는지
              </div>
            </div>
            <p className="text-sm text-white/70 mt-4">
              스탯은 절대 평가가 아니라<br />
              '오늘 하루 기준'의 상대 평가입니다.
            </p>
          </div>

          {/* 마무리 문구 */}
          <div className="text-center bg-gradient-to-r from-yellow-400/20 to-pink-500/20 rounded-2xl p-6 border border-yellow-400/30">
            <p className="text-lg font-medium">
              정답은 없습니다.<br />
              당신의 하루는 이미 하나의 플레이 기록입니다.
            </p>
          </div>
        </div>

        {/* 다시 보지 않기 체크박스 */}
        <div className="mt-6 flex items-center justify-center gap-2">
          <input
            type="checkbox"
            id="dontShowAgain"
            checked={dontShowAgain}
            onChange={(e) => setDontShowAgain(e.target.checked)}
            className="w-4 h-4 rounded"
          />
          <label htmlFor="dontShowAgain" className="text-white/70 text-sm cursor-pointer">
            이 가이드는 다시 보지 않기
          </label>
        </div>

        {/* 시작 버튼 */}
        <div className="mt-6">
          <button
            onClick={handleClose}
            className="w-full py-4 bg-gradient-to-r from-yellow-400 to-pink-500 text-white text-xl font-bold rounded-full hover:scale-105 transition-transform duration-200 shadow-2xl hover:shadow-pink-500/50"
          >
            🎮 첫 플레이 시작하기
          </button>
        </div>
      </div>
    </div>
  );
}
