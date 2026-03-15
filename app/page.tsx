'use client';

import { useEffect, useState } from 'react';
import { SpinWheel } from '@/components/spin-wheel';
import { WelcomeScreen } from '@/components/welcome-screen';
import { PrizeDisplay } from '@/components/prize-display';
import { FloatingDecorations } from '@/components/confetti';

interface Gift {
  id: number;
  name: string;
  color: string;
  emoji: string;
  isMystery?: boolean;
}

interface HistoryEntry {
  id: string;
  playerName: string;
  prize: string;
  prizeEmoji: string;
  prizeColor: string;
  timestamp: number;
}

export default function Home() {
  const [gifts, setGifts] = useState<Gift[]>([]);
  const [currentPlayerName, setCurrentPlayerName] = useState('');
  const [isSpinning, setIsSpinning] = useState(false);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    const loadGifts = async () => {
      try {
        const response = await fetch('/gifts.json');
        const data = await response.json();
        setGifts(data);
      } catch (error) {
        console.error('Failed to load gifts:', error);
      }
    };

    const loadHistory = () => {
      try {
        const saved = localStorage.getItem('thrMihuHistory');
        if (saved) {
          setHistory(JSON.parse(saved));
        }
      } catch (error) {
        console.error('Failed to load history:', error);
      }
    };

    loadGifts();
    loadHistory();
  }, []);

  useEffect(() => {
    if (history.length > 0) {
      localStorage.setItem('thrMihuHistory', JSON.stringify(history));
    }
  }, [history]);

  const resetHistory = () => {
    setHistory([]);
    localStorage.removeItem('thrMihuHistory');
  };

  const handleStartGame = (playerName: string) => {
    setCurrentPlayerName(playerName);
    setShowResult(false);
  };

  const handleSpinResult = (gift: Gift, playerName: string) => {
    setIsSpinning(false);

    const newEntry: HistoryEntry = {
      id: `${Date.now()}-${Math.random()}`,
      playerName,
      prize: gift.name,
      prizeEmoji: gift.emoji,
      prizeColor: gift.color,
      timestamp: Date.now(),
    };

    setHistory([...history, newEntry]);
    setShowResult(true);
  };

  const handleAddNewPlayer = () => {
    setCurrentPlayerName('');
    setShowResult(false);
  };

  if (!gifts.length) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-100 via-emerald-50 to-amber-50 bg-pattern flex items-center justify-center p-4">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-spin-slow">☪</div>
          <p className="text-xl font-semibold text-emerald-600">Memuat...</p>
        </div>
        <style jsx>{`
          @keyframes spin-slow {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          .animate-spin-slow {
            animation: spin-slow 8s linear infinite;
          }
        `}</style>
      </div>
    );
  }

  if (!currentPlayerName) {
    return <WelcomeScreen onStartGame={handleStartGame} history={history} resetHistory={resetHistory} />;
  }

  if (showResult) {
    const lastEntry = history.at(-1);
    if (!lastEntry) return null;
    return (
      <PrizeDisplay
        history={[lastEntry]}
        onAddNewPlayer={handleAddNewPlayer}
        resetHistory={resetHistory}
      />
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-emerald-100 via-emerald-50 to-amber-50 bg-pattern relative overflow-hidden">
      <FloatingDecorations />
      
      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-4 mb-3">
            <span className="text-5xl animate-float">☪</span>
            <h1 className="text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-linear-to-r from-emerald-600 to-amber-400">
              THR MIHU
            </h1>
            <span className="text-5xl animate-float-delayed">✦</span>
          </div>
          <p className="text-emerald-600/70 font-medium text-lg mt-2">
            Ayo putar roda untuk dapat THR!
          </p>
        </div>

        <div className="space-y-10">
          <div className="text-center">
            <p className="text-emerald-600/60 mb-3 font-medium text-lg">Peserta</p>
            <h2 className="text-4xl md:text-6xl font-bold text-emerald-800 bg-linear-to-r from-emerald-600 to-amber-500 bg-clip-text">
              {currentPlayerName}
            </h2>
          </div>

          <div className="flex justify-center mt-8">
            <SpinWheel
              gifts={gifts}
              onResult={handleSpinResult}
              isSpinning={isSpinning}
              playerName={currentPlayerName}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
