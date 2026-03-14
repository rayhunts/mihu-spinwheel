'use client';

import { Button } from '@/components/ui/button';

interface Result {
  winner: string;
  giftName: string;
  giftEmoji: string;
  giftColor: string;
}

interface ResultsDisplayProps {
  results: Result[];
  onPlayAgain: () => void;
}

export function ResultsDisplay({ results, onPlayAgain }: ResultsDisplayProps) {
  return (
    <div className="w-full max-w-md space-y-6">
      <h2 className="text-3xl font-bold text-center text-foreground">
        🎉 Hasil 🎉
      </h2>

      <div className="space-y-3 max-h-64 overflow-y-auto">
        {results.map((result, index) => (
          <div
            key={index}
            className="p-4 rounded-xl border-2 border-accent shadow-md hover:shadow-lg transition-all"
            style={{ borderColor: result.giftColor }}
          >
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1">
                <p className="font-bold text-lg text-foreground">{result.winner}</p>
                <p className="text-sm text-muted-foreground">
                  Menang: {result.giftEmoji} {result.giftName}
                </p>
              </div>
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center text-2xl shadow-md"
                style={{ backgroundColor: result.giftColor + '30', borderColor: result.giftColor }}
              >
                {result.giftEmoji}
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={onPlayAgain}
        className="w-full py-3 bg-gradient-to-r from-primary to-red-600 text-white rounded-lg font-bold text-lg hover:shadow-lg hover:scale-105 active:scale-95 transition-all"
      >
        Main Lagi
      </button>
    </div>
  );
}
