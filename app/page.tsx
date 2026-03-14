'use client';

import { useEffect, useState } from 'react';
import { SpinWheel } from '@/components/spin-wheel';
import { WelcomeScreen } from '@/components/welcome-screen';
import { HistoryDisplay } from '@/components/history-display';
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
  const [mysteryGift, setMysteryGift] = useState<Gift | null>(null);
  const [currentPlayerName, setCurrentPlayerName] = useState('');
  const [isSpinning, setIsSpinning] = useState(false);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    const loadGifts = async () => {
      try {
        const response = await fetch('/gifts.json');
        const data = await response.json();
        setGifts(data.gifts);
        if (data.mysterygift) {
          setMysteryGift(data.mysterygift);
        }
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

  const handlePlayAgain = () => {
    setCurrentPlayerName('');
    setShowResult(false);
  };

  const handleAddNewPlayer = () => {
    setCurrentPlayerName('');
    setShowResult(false);
  };

  if (!gifts.length || !mysteryGift) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-amber-50 bg-pattern flex items-center justify-center p-4">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-spin-slow">☪</div>
          <p className="text-xl font-semibold text-emerald-700">Memuat...</p>
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
    return <WelcomeScreen onStartGame={handleStartGame} history={history} />;
  }

  if (showResult) {
    const lastEntry = history[history.length - 1];
    return (
      <HistoryDisplay
        history={[lastEntry]}
        onPlayAgain={handlePlayAgain}
        onAddNewPlayer={handleAddNewPlayer}
      />
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-amber-50 bg-pattern relative overflow-hidden">
      <FloatingDecorations />
      
      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-2">
            <span className="text-4xl animate-float">☪</span>
            <h1 className="text-4xl md:text-5xl font-bold">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-700 via-emerald-600 to-amber-500">
                THR MIHU
              </span>
            </h1>
            <span className="text-4xl animate-float-delayed">✦</span>
          </div>
          <p className="text-emerald-600/80 font-medium text-lg">
            Putar roda untuk memenangkan hadiah!
          </p>
        </div>

        <div className="space-y-8">
          <div className="text-center">
            <p className="text-emerald-600/70 mb-2 font-medium">Peserta</p>
            <h2 className="text-4xl md:text-5xl font-bold text-emerald-800 bg-gradient-to-r from-emerald-700 to-amber-600 bg-clip-text text-transparent">
              {currentPlayerName}
            </h2>
          </div>

          <div className="flex justify-center">
            <SpinWheel
              gifts={gifts}
              mysteryGift={mysteryGift}
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
