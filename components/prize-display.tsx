'use client';

import { useState, useEffect } from 'react';
import { Confetti, FloatingDecorations } from './confetti';

interface HistoryEntry {
  id: string;
  playerName: string;
  prize: string;
  prizeEmoji: string;
  prizeColor: string;
  timestamp: number;
}

interface PrizeDisplayProps {
  history: HistoryEntry[];
  onAddNewPlayer: () => void;
  resetHistory: () => void;
}

export function PrizeDisplay({
  history,
  onAddNewPlayer,
}: PrizeDisplayProps) {
  const [mounted, setMounted] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showPrize, setShowPrize] = useState(false);

  useEffect(() => {
    setMounted(true);
    setShowConfetti(true);

    const confettiTimer = setTimeout(() => setShowConfetti(false), 5000);
    const prizeTimer = setTimeout(() => setShowPrize(true), 800);

    return () => {
      clearTimeout(confettiTimer);
      clearTimeout(prizeTimer);
    };
  }, []);

  const lastEntry = history[history.length - 1];

  const handleShare = () => {
    const message = `🎉 THR MIHU 2026!\n\n${lastEntry.playerName} berhasil mendapatkan:\n${lastEntry.prizeEmoji} ${lastEntry.prize}\n\n#THRMIHA #HariRaya`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-amber-50 bg-pattern relative overflow-hidden">
      <FloatingDecorations />
      <Confetti active={showConfetti} />

      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className={`text-center mb-14 transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
          <div className="text-6xl mb-5 animate-bounce">🎉</div>
          <h1 className="text-4xl md:text-6xl font-bold mb-3">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-700 via-emerald-600 to-amber-500">
              Selamat! {lastEntry?.playerName} mendapat:
            </span>
          </h1>
        </div>

        <div className="flex justify-center">
          <div className="w-full max-w-xl">
            <div
              className={`bg-white/90 backdrop-blur-xl rounded-2xl p-7 shadow-xl border-2 transition-all duration-500 hover:scale-[1.02] ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
              style={{
                borderColor: lastEntry.prizeColor,
              }}
            >
              <div className="flex items-center gap-5">
                <div
                  className={`w-24 h-24 rounded-2xl flex items-center justify-center text-5xl shadow-inner transition-all duration-700 ${showPrize ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
                    }`}
                  style={{
                    backgroundColor: lastEntry.prizeColor + '20',
                  }}
                >
                  {lastEntry.prizeEmoji}
                </div>
                <div className="flex-1">
                  <p className="font-bold text-2xl text-emerald-800">
                    {lastEntry.playerName}
                  </p>
                  <p className="text-emerald-600/70 text-sm font-medium">
                    Menerima
                  </p>
                  <p
                    className={`text-xl font-bold mt-1 transition-all duration-500 ${showPrize ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                      }`}
                    style={{ color: lastEntry.prizeColor, transitionDelay: '400ms' }}
                  >
                    {showPrize ? `${lastEntry.prizeEmoji} ${lastEntry.prize}` : '???'}
                  </p>
                </div>
                <div className="text-5xl animate-pulse">
                  ✨
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-6 mt-14">
          <button
            onClick={handleShare}
            className="px-8 py-4 min-h-[56px] rounded-xl font-semibold text-lg bg-emerald-600 text-white hover:bg-emerald-700 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3"
          >
            <span>📤</span>
            <span>Bagikan</span>
          </button>
          <button
            onClick={onAddNewPlayer}
            className="px-8 py-4 min-h-[56px] rounded-xl font-semibold text-lg bg-amber-600 text-white hover:bg-amber-700 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3"
          >
            <span>👤</span>
            <span>Peserta Baru</span>
          </button>
        </div>
      </div>
    </div>
  );
}
