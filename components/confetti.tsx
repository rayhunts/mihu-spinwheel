'use client';

import { useEffect, useState } from 'react';

interface ConfettiPiece {
  id: number;
  x: number;
  delay: number;
  color: string;
  size: number;
}

export function Confetti({ active }: { active: boolean }) {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([]);

  useEffect(() => {
    if (active) {
      const colors = ['#d4af37', '#065f46', '#10b981', '#f59e0b', '#ec4899'];
      const newPieces: ConfettiPiece[] = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        delay: Math.random() * 2,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 8 + 4,
      }));
      setPieces(newPieces);
      
      const timer = setTimeout(() => setPieces([]), 5000);
      return () => clearTimeout(timer);
    }
  }, [active]);

  if (!active || pieces.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {pieces.map((piece) => (
        <div
          key={piece.id}
          className="absolute animate-confetti"
          style={{
            left: `${piece.x}%`,
            top: '-20px',
            width: piece.size,
            height: piece.size * 2,
            backgroundColor: piece.color,
            animationDelay: `${piece.delay}s`,
            animationDuration: `${Math.random() * 2 + 2}s`,
          }}
        />
      ))}
      <style jsx>{`
        @keyframes confetti-fall {
          0% {
            transform: translateY(-100px) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
        .animate-confetti {
          animation: confetti-fall linear forwards;
        }
      `}</style>
    </div>
  );
}

export function FloatingDecorations() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {[...Array(8)].map((_, i) => (
        <div
          key={i}
          className="absolute text-4xl opacity-10"
          style={{
            left: `${10 + i * 12}%`,
            top: `${10 + (i % 3) * 30}%`,
            animation: `float ${4 + i % 3}s ease-in-out infinite`,
            animationDelay: `${i * 0.5}s`,
          }}
        >
          {i % 2 === 0 ? '☪' : '✦'}
        </div>
      ))}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(10deg); }
        }
      `}</style>
    </div>
  );
}
