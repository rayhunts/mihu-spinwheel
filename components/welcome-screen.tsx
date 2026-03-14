'use client';

import { useState, useEffect } from 'react';
import { FloatingDecorations } from './confetti';

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
}

export function WelcomeScreen({ onStartGame, history = [] }: WelcomeScreenProps) {
  const [playerName, setPlayerName] = useState('');
  const [error, setError] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!playerName.trim()) {
      setError('Nama tidak boleh kosong');
      return;
    }

    if (playerName.trim().length < 2) {
      setError('Nama minimal 2 karakter');
      return;
    }

    setError('');
    onStartGame(playerName.trim());
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-amber-50 bg-pattern relative overflow-hidden">
      <FloatingDecorations />
      
      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="flex flex-col lg:flex-row gap-8 items-start lg:items-center justify-center min-h-[80vh]">
          <div className={`w-full lg:w-[420px] transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 space-y-8 border border-emerald-100">
              <div className="text-center space-y-3">
                <div className="text-6xl mb-3 animate-float">☪</div>
                <h1 className="text-4xl font-bold">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-700 via-emerald-600 to-amber-500">
                    THR MIHU
                  </span>
                </h1>
                <p className="text-emerald-600/80 font-medium">
                  Putar roda untuk memenangkan hadiah!
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
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
                      onKeyPress={(e) => e.key === 'Enter' && handleSubmit(e)}
                      placeholder="Masukkan nama Anda"
                      className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-emerald-200 focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 text-emerald-800 bg-white/50 transition-all text-lg"
                      autoFocus
                    />
                  </div>
                  {error && (
                    <p className="text-sm text-red-500 font-semibold animate-shake">{error}</p>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full py-4 btn-gold rounded-xl font-bold text-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                >
                  <span>🎡</span>
                  <span>Mulai Bermain</span>
                </button>
              </form>
            </div>
          </div>

          {history.length > 0 && (
            <div className={`flex-1 w-full max-w-lg transition-all duration-700 delay-200 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl p-6 border border-emerald-100">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-2xl">📜</span>
                  <h2 className="text-xl font-bold text-emerald-800">
                    Riwayat Peserta
                  </h2>
                  <span className="ml-auto bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-sm font-semibold">
                    {history.length}
                  </span>
                </div>
                <div className="space-y-2 max-h-80 overflow-y-auto pr-2">
                  {[...history].reverse().map((entry, index) => (
                    <div
                      key={entry.id}
                      className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-emerald-50/50 to-amber-50/50 border border-emerald-100 hover:shadow-md transition-all hover:scale-[1.01]"
                      style={{ animationDelay: `${index * 50}ms` }}
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
