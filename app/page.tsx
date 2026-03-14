'use client';

import { useEffect, useState } from 'react';
import { SpinWheel } from '@/components/spin-wheel';
import { WelcomeScreen } from '@/components/welcome-screen';
import { HistoryDisplay } from '@/components/history-display';

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

  // Load gifts and history from localStorage
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

  // Save history to localStorage whenever it changes
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
      <div className="min-h-screen bg-gradient-to-br from-background via-accent/10 to-secondary/10 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="text-6xl mb-4">🎡</div>
          <p className="text-xl font-semibold text-foreground">Memuat...</p>
        </div>
      </div>
    );
  }

  // Show welcome screen if no player is selected
  if (!currentPlayerName) {
    return <WelcomeScreen onStartGame={handleStartGame} history={history} />;
  }

  // Show result/history if spin is complete
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

  // Show game screen
  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-accent/10 to-secondary/10 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold mb-2">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
              🎡 THR MIHU
            </span>
          </h1>
          <p className="text-lg text-muted-foreground">
            Putar roda untuk memenangkan hadiah!
          </p>
        </div>

        <div className="space-y-8">
          {/* Current Player Info */}
          <div className="text-center">
            <p className="text-gray-600 mb-2">Peserta</p>
            <h2 className="text-4xl font-bold text-primary">
              {currentPlayerName}
            </h2>
          </div>

          {/* Wheel */}
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
