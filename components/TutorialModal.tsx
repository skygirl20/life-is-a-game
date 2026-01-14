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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="bg-gradient-to-b from-slate-900 to-slate-800 rounded-2xl p-10 max-w-2xl w-full shadow-2xl border border-slate-700/50 max-h-[90vh] overflow-y-auto">
        {/* 제목 */}
        <div className="text-center mb-8">
          <div className="inline-block px-6 py-2 bg-slate-800/50 border border-slate-600/30 rounded-lg mb-4">
            <h2 className="text-2xl font-medium text-slate-200 tracking-wide">
              새로운 플레이어가 접속했습니다
            </h2>
          </div>
        </div>

        {/* 본문 */}
        <div className="space-y-6 text-slate-300 leading-relaxed">
          {/* 도입 */}
          <div className="border-l-2 border-slate-600 pl-6 py-2">
            <p className="text-lg mb-4">
              이곳은 당신의 하루가<br />
              플레이 기록으로 남는 세계입니다.
            </p>
            <p className="text-base text-slate-400">
              오늘의 플레이는<br />
              완벽할 필요도, 멋질 필요도 없습니다.<br />
              단지 플레이하면 됩니다.
            </p>
          </div>

          {/* 플레이 방식 */}
          <div className="bg-slate-800/30 rounded-xl p-6 border border-slate-700/30">
            <p className="text-base mb-4">
              오늘 한 일을<br />
              기억나는 대로 적어보세요.
            </p>
            <p className="text-sm text-slate-400 mb-3">
              잘한 일만 남기지 않아도 됩니다.<br />
              멈춘 순간도, 흐트러진 하루도<br />
              이 세계에서는 기록이 됩니다.
            </p>
            <p className="text-base text-slate-200 font-medium">
              이 게임에서<br />
              모든 행동은 경험치가 됩니다.
            </p>
          </div>

          {/* 스탯 시스템 */}
          <div className="space-y-4">
            <p className="text-base text-slate-300">
              플레이 결과는<br />
              다음 스탯으로 변환됩니다.
            </p>
            
            <div className="space-y-3 pl-4">
              <div className="flex items-start gap-3">
                <span className="text-blue-400 font-medium min-w-[80px]">집중력</span>
                <span className="text-sm text-slate-400 leading-relaxed">
                  한 가지에 몰입한 흔적이 있었는가
                </span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-green-400 font-medium min-w-[80px]">체력</span>
                <span className="text-sm text-slate-400 leading-relaxed">
                  몸을 회복했는가, 혹은 소모했는가
                </span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-purple-400 font-medium min-w-[80px]">멘탈</span>
                <span className="text-sm text-slate-400 leading-relaxed">
                  감정은 무너지지 않았는가
                </span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-pink-400 font-medium min-w-[80px]">성장</span>
                <span className="text-sm text-slate-400 leading-relaxed">
                  배움이나 새로운 시도가 있었는가
                </span>
              </div>
            </div>

            <p className="text-sm text-slate-500 pt-2">
              스탯은 점수가 아니라<br />
              오늘 하루의 플레이 성향입니다.
            </p>
          </div>

          {/* 평가 기준 */}
          <div className="border-l-2 border-slate-600 pl-6 py-2">
            <p className="text-base mb-3">
              이 세계에는 정답이 없습니다.
            </p>
            <p className="text-sm text-slate-400 mb-3">
              어제의 당신과<br />
              오늘의 당신만이 비교 대상입니다.
            </p>
            <p className="text-sm text-slate-500">
              모든 평가는<br />
              오늘 하루를 기준으로 상대적으로 이루어집니다.
            </p>
          </div>

          {/* 마무리 */}
          <div className="text-center pt-4 pb-2">
            <div className="inline-block border-t-2 border-b-2 border-slate-600/50 py-4 px-8">
              <p className="text-base text-slate-300 mb-3">
                준비는 끝났습니다.<br />
                이제 플레이를 시작하세요.
              </p>
              <p className="text-sm text-slate-400">
                당신의 하루는<br />
                이미 하나의 게임입니다.
              </p>
            </div>
          </div>
        </div>

        {/* 다시 보지 않기 체크박스 */}
        <div className="mt-8 flex items-center justify-center gap-2">
          <input
            type="checkbox"
            id="dontShowAgain"
            checked={dontShowAgain}
            onChange={(e) => setDontShowAgain(e.target.checked)}
            className="w-4 h-4 rounded bg-slate-700 border-slate-600"
          />
          <label htmlFor="dontShowAgain" className="text-slate-500 text-sm cursor-pointer">
            다시 보지 않기
          </label>
        </div>

        {/* 시작 버튼 */}
        <div className="mt-6">
          <button
            onClick={handleClose}
            className="w-full py-4 bg-slate-700 hover:bg-slate-600 text-slate-200 text-lg font-medium rounded-lg transition-colors duration-200 border border-slate-600/50"
          >
            ▶ 첫 플레이 시작하기
          </button>
        </div>
      </div>
    </div>
  );
}
