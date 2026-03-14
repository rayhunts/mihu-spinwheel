'use client';

import { useState } from 'react';

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

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit(e as any);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/10 to-secondary/10 py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-8 items-start lg:items-center">
          {/* Form Section */}
          <div className="w-full lg:w-96">
            <div className="bg-white rounded-3xl shadow-2xl p-8 space-y-8">
              {/* Header */}
              <div className="text-center space-y-2">
                <div className="text-7xl mb-4">🎡</div>
                <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                  THR MIHU
                </h1>
                <p className="text-muted-foreground">
                  Putar roda untuk memenangkan hadiah!
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-foreground">
                    Nama Peserta
                  </label>
                  <input
                    type="text"
                    value={playerName}
                    onChange={(e) => {
                      setPlayerName(e.target.value);
                      setError('');
                    }}
                    onKeyPress={handleKeyPress}
                    placeholder="Masukkan nama Anda"
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 text-foreground"
                    autoFocus
                  />
                  {error && (
                    <p className="text-sm text-red-500 font-semibold">{error}</p>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full py-4 bg-gradient-to-r from-primary to-red-600 text-white rounded-lg font-bold text-lg hover:shadow-lg hover:scale-105 active:scale-95 transition-all"
                >
                  Mulai Bermain
                </button>
              </form>
            </div>
          </div>

          {/* History Section */}
          {history.length > 0 && (
            <div className="flex-1 w-full">
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-foreground mb-4">
                  Riwayat Peserta ({history.length})
                </h2>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {history.map((entry, index) => (
                    <div
                      key={entry.id}
                      className="flex items-center justify-between p-4 rounded-lg bg-gray-50 border-l-4 hover:shadow-md transition-all"
                      style={{ borderColor: entry.prizeColor }}
                    >
                      <div className="flex-1">
                        <p className="font-semibold text-foreground">
                          {index + 1}. {entry.playerName}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(entry.timestamp).toLocaleTimeString('id-ID')}
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
    </div>
  );
}
