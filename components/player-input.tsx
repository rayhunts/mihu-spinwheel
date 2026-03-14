'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface PlayerInputProps {
  onPlayersSubmit: (players: string[]) => void;
  isDisabled: boolean;
}

export function PlayerInput({ onPlayersSubmit, isDisabled }: PlayerInputProps) {
  const [players, setPlayers] = useState<string[]>(['', '']);
  const [input, setInput] = useState('');

  const addPlayer = () => {
    if (input.trim()) {
      setPlayers([...players, input.trim()]);
      setInput('');
    }
  };

  const removePlayer = (index: number) => {
    setPlayers(players.filter((_, i) => i !== index));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addPlayer();
    }
  };

  const handleSubmit = () => {
    const validPlayers = players.filter((p) => p.trim());
    if (validPlayers.length >= 2) {
      onPlayersSubmit(validPlayers);
    }
  };

  const validPlayers = players.filter((p) => p.trim());
  const canSubmit = validPlayers.length >= 2;

  return (
    <div className="w-full max-w-md space-y-6">
      <div className="space-y-3">
        <label className="block text-sm font-semibold text-foreground">
          Tambah Peserta
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Masukkan nama peserta"
            className="flex-1 px-4 py-2 rounded-lg border-2 border-gray-300 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            disabled={isDisabled}
          />
          <button
            onClick={addPlayer}
            disabled={!input.trim() || isDisabled}
            className="px-4 py-2 bg-secondary text-white rounded-lg font-semibold hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            Tambah
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold text-foreground">
          Peserta ({validPlayers.length})
        </label>
        <div className="space-y-2 max-h-40 overflow-y-auto">
          {players.map((player, index) => (
            <div
              key={index}
              className={`flex items-center justify-between p-3 rounded-lg transition-all ${
                player.trim()
                  ? 'bg-gradient-to-r from-accent/20 to-secondary/20 border-2 border-accent/50'
                  : 'bg-gray-100 border-2 border-gray-300'
              }`}
            >
              <input
                type="text"
                value={player}
                onChange={(e) => {
                  const newPlayers = [...players];
                  newPlayers[index] = e.target.value;
                  setPlayers(newPlayers);
                }}
                placeholder={`Peserta ${index + 1}`}
                className="flex-1 bg-transparent outline-none font-medium text-foreground"
                disabled={isDisabled}
              />
              <button
                onClick={() => removePlayer(index)}
                disabled={isDisabled}
                className="ml-2 p-1 hover:bg-red-100 rounded-md transition-colors disabled:opacity-50"
              >
                <X className="w-5 h-5 text-red-500" />
              </button>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={handleSubmit}
        disabled={!canSubmit || isDisabled}
        className={`w-full py-3 rounded-lg font-bold text-lg transition-all ${
          canSubmit && !isDisabled
            ? 'bg-gradient-to-r from-primary to-red-600 text-white hover:shadow-lg hover:scale-105 active:scale-95'
            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
        }`}
      >
        Mulai Permainan
      </button>
    </div>
  );
}
