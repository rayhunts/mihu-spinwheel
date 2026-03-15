'use client';

import { useState, useEffect } from 'react';
import { FloatingDecorations } from './confetti';
import { IslamicPattern } from './spin-wheel';

interface HistoryEntry {
  id: string;
  playerName: string;
  prize: string;
  prizeEmoji: string;
  prizeColor: string;
  timestamp: number;
}

interface WelcomeScreenProps {
  onStartGame: (playerName: string) => void;
  history?: HistoryEntry[];
  resetHistory?: () => void;
}

export function WelcomeScreen({ onStartGame, history = [], resetHistory }: WelcomeScreenProps) {
  const [playerName, setPlayerName] = useState('');
  const [error, setError] = useState('');
  const [mounted, setMounted] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!playerName.trim()) {
      setError('Nama tidak boleh kosong');
      if (navigator.vibrate) navigator.vibrate(100);
      return;
    }

    if (playerName.trim().length < 2) {
      setError('Nama minimal 2 karakter');
      if (navigator.vibrate) navigator.vibrate(100);
      return;
    }

    setError('');
    if (navigator.vibrate) navigator.vibrate(50);
    onStartGame(playerName.trim());
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-amber-50 bg-pattern relative overflow-hidden">
      <FloatingDecorations />
      
      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="flex flex-col lg:flex-row gap-10 items-start lg:items-center justify-center min-h-[80vh]">
          <div className={`w-full lg:w-[460px] transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="bg-white/85 backdrop-blur-xl rounded-3xl shadow-2xl p-8 sm:p-10 space-y-8 sm:space-y-10 border border-emerald-100/50">
              <div className="text-center space-y-6">
                <div className="text-5xl sm:text-6xl mb-4 animate-float">☪</div>
                <h1 className="text-3xl sm:text-4xl font-italic text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-amber-500">
                  THR MIHU
                </h1>
                <p className="text-emerald-600/70 font-medium mt-2">
                  Ayo putar roda untuk dapat THR!
                </p>
                <div className="flex justify-center mt-6">
                  <IslamicPattern className="w-[140px] h-[24px]" />
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-3">
                  <label className="block text-sm font-semibold text-emerald-800">
                    Nama Peserta
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl">👤</span>
                    <input
                      type="text"
                      value={playerName}
                      onChange={(e) => {
                        setPlayerName(e.target.value);
                        setError('');
                      }}
                      onKeyDown={(e) => e.key === 'Enter' && handleSubmit(e)}
                      placeholder="Masukkan nama Anda"
                      className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-emerald-200 focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 text-emerald-800 bg-white/50 transition-all text-lg touch-action-manipulation"
                      autoFocus
                    />
                  </div>
                  {error && (
                    <p className="text-sm text-red-500 font-semibold animate-shake">{error}</p>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full py-4 min-h-[56px] rounded-xl font-bold text-lg text-white bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 border-2 border-emerald-800 hover:shadow-xl active:scale-[0.98] transition-all flex items-center justify-center gap-3"
                >
                  <span>🎡</span>
                  <span>Mulai Bermain</span>
                </button>
              </form>
            </div>
          </div>

          {history.length > 0 && (
            <div className={`flex-1 w-full max-w-lg transition-all duration-700 delay-200 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <div className="bg-white/85 backdrop-blur-xl rounded-2xl shadow-xl border border-emerald-100/50">
                <button
                  onClick={() => setShowHistory(!showHistory)}
                  className="w-full flex items-center justify-between p-5 sm:p-7"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">📜</span>
                    <h2 className="text-lg sm:text-xl font-bold text-emerald-800">
                      Riwayat Peserta
                    </h2>
                    <span className="bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full text-sm font-semibold">
                      {history.length}
                    </span>
                  </div>
                  <span className="lg:hidden text-emerald-600 text-2xl transition-transform duration-200" style={{ transform: showHistory ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                    ▼
                  </span>
                </button>
                
                <div className={`sm:block ${showHistory ? 'block' : 'hidden'}`}>
                  <div className="space-y-3 max-h-80 overflow-y-auto px-5 pb-5 sm:px-7 sm:pb-7">
                    {[...history].reverse().map((entry, index) => (
                      <div
                        key={entry.id}
                        className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-emerald-50/50 to-amber-50/50 border border-emerald-100/50 hover:shadow-lg transition-all hover:scale-[1.01]"
                      >
                        <div className="flex-1">
                          <p className="font-semibold text-emerald-800">
                            {entry.playerName}
                          </p>
                          <p className="text-xs text-emerald-600/70">
                            {new Date(entry.timestamp).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold" style={{ color: entry.prizeColor }}>
                            {entry.prizeEmoji} {entry.prize}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {resetHistory && (
                  <div className="px-5 pb-5 sm:px-7 sm:pb-7">
                    <button
                      onClick={resetHistory}
                      className="w-full px-6 py-3 bg-red-50 hover:bg-red-100 text-red-600 font-medium rounded-lg border border-red-200 hover:shadow-lg transition-all flex items-center justify-center gap-2"
                    >
                      <span>🗑️</span>
                      <span>Reset Riwayat</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      
      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-shake {
          animation: shake 0.3s ease-in-out;
        }
      `}</style>
    </div>
  );
}
