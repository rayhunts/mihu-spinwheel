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

interface HistoryDisplayProps {
  history: HistoryEntry[];
  onPlayAgain: () => void;
  onAddNewPlayer: () => void;
}

export function HistoryDisplay({
  history,
  onPlayAgain,
  onAddNewPlayer,
}: HistoryDisplayProps) {
  const [mounted, setMounted] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    setMounted(true);
    setShowConfetti(true);
    const timer = setTimeout(() => setShowConfetti(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-amber-50 bg-pattern relative overflow-hidden">
      <FloatingDecorations />
      <Confetti active={showConfetti} />
      
      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className={`text-center mb-10 transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
          <div className="text-6xl mb-4 animate-bounce">🎉</div>
          <h1 className="text-4xl md:text-5xl font-bold mb-2">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-700 via-emerald-600 to-amber-500">
              Selamat!
            </span>
          </h1>
          <p className="text-emerald-600/80 text-lg">
            Hadiah Anda telah ditentukan
          </p>
        </div>

        <div className="flex justify-center">
          <div className="w-full max-w-xl space-y-4">
            {history.map((entry, index) => (
              <div
                key={entry.id}
                className={`bg-white/90 backdrop-blur-xl rounded-2xl p-6 shadow-xl border-2 transition-all duration-500 hover:scale-[1.02] ${
                  mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
                style={{ 
                  borderColor: entry.prizeColor,
                  transitionDelay: `${index * 150}ms`
                }}
              >
                <div className="flex items-center gap-4">
                  <div 
                    className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl shadow-inner"
                    style={{ backgroundColor: entry.prizeColor + '20' }}
                  >
                    {entry.prizeEmoji}
                  </div>
                  <div className="flex-1">
                    <p className="text-emerald-600/70 text-sm font-medium">
                      Pemenang
                    </p>
                    <p className="font-bold text-2xl text-emerald-800">
                      {entry.playerName}
                    </p>
                    <p 
                      className="text-xl font-bold mt-1"
                      style={{ color: entry.prizeColor }}
                    >
                      {entry.prize}
                    </p>
                  </div>
                  <div className="text-4xl animate-pulse">
                    ✨
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-center gap-4 mt-12">
          <button
            onClick={onPlayAgain}
            className="px-8 py-4 btn-gold rounded-xl font-bold text-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
          >
            <span>🔄</span>
            <span>Putar Lagi</span>
          </button>
          <button
            onClick={onAddNewPlayer}
            className="px-8 py-4 bg-emerald-600 text-white rounded-xl font-bold text-lg hover:bg-emerald-700 hover:shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
          >
            <span>👤</span>
            <span>Peserta Baru</span>
          </button>
        </div>

        {history.length > 1 && (
          <div className="mt-12 flex justify-center">
            <div className="w-full max-w-xl bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-emerald-100">
              <h2 className="text-xl font-bold text-emerald-800 mb-4 text-center flex items-center justify-center gap-2">
                <span>📜</span>
                <span>Riwayat Hari Ini</span>
              </h2>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {history.map((entry, index) => (
                  <div
                    key={entry.id}
                    className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-emerald-50/50 to-amber-50/50"
                  >
                    <span className="font-semibold text-emerald-800">
                      {index + 1}. {entry.playerName}
                    </span>
                    <span className="font-bold" style={{ color: entry.prizeColor }}>
                      {entry.prizeEmoji} {entry.prize}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
