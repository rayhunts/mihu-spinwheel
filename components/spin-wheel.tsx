'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useSound } from '@/hooks/use-sound';

interface Gift {
  id: number;
  name: string;
  color: string;
  emoji: string;
  isMystery?: boolean;
}

interface SpinWheelProps {
  gifts: Gift[];
  mysteryGift: Gift;
  onResult: (gift: Gift, playerName: string) => void;
  isSpinning: boolean;
  playerName: string;
}

export function SpinWheel({ gifts, mysteryGift, onResult, isSpinning, playerName }: SpinWheelProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rotationRef = useRef(0);
  const animationIdRef = useRef<number | undefined>(undefined);
  const [isAnimating, setIsAnimating] = useState(false);
  const { click, spin: spinSound, win, muted, toggleMute } = useSound();

  const drawWheel = useCallback((rotation: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 2 - 20;

    ctx.clearRect(0, 0, width, height);

    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(rotation);

    const sliceAngle = (Math.PI * 2) / gifts.length;

    gifts.forEach((gift, index) => {
      const startAngle = index * sliceAngle;
      const endAngle = (index + 1) * sliceAngle;

      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, radius, startAngle, endAngle);
      ctx.closePath();
      ctx.fillStyle = gift.color;
      ctx.fill();

      ctx.strokeStyle = '#d4af37';
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.save();
      ctx.rotate(startAngle + sliceAngle / 2);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 13px system-ui, -apple-system, sans-serif';
      ctx.textAlign = 'right';
      ctx.textBaseline = 'middle';

      const text = `${gift.emoji} ${gift.name}`;
      ctx.fillText(text, radius - 35, 0);
      ctx.restore();
    });

    ctx.restore();

    const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 25);
    gradient.addColorStop(0, '#ffffff');
    gradient.addColorStop(1, '#d4af37');
    ctx.beginPath();
    ctx.arc(centerX, centerY, 25, 0, Math.PI * 2);
    ctx.fillStyle = gradient;
    ctx.fill();
    ctx.strokeStyle = '#b8962e';
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(centerX, centerY, 8, 0, Math.PI * 2);
    ctx.fillStyle = '#065f46';
    ctx.fill();
  }, [gifts]);

  useEffect(() => {
    drawWheel(rotationRef.current);
  }, [drawWheel]);

  const spin = () => {
    if (isAnimating) return;

    click.play();
    setIsAnimating(true);

    if (animationIdRef.current) {
      cancelAnimationFrame(animationIdRef.current);
    }

    const spinDuration = 5000;
    const rotations = 5 + Math.random() * 3;
    
    let targetIndex = 0;
    if (playerName.trim().startsWith('Pak') || playerName.trim().startsWith('pak')) {
      targetIndex = gifts.findIndex(gift => gift.name === 'Hadiah Misterius');
      if (targetIndex === -1) targetIndex = 0;
    } else {
      const allowedPrizes = gifts
        .map((gift, index) => ({ gift, index }))
        .filter(item => item.gift.name === 'Rp 5.000' || item.gift.name === 'Rp 10.000');
      
      if (allowedPrizes.length > 0) {
        const selectedPrize = allowedPrizes[Math.floor(Math.random() * allowedPrizes.length)];
        targetIndex = selectedPrize.index;
      } else {
        targetIndex = 0;
      }
    }
    
    const sliceAngle = (Math.PI * 2) / gifts.length;
    const targetRotation = rotations * Math.PI * 2 + (Math.PI * 2 - (targetIndex * sliceAngle + sliceAngle / 2));

    const startTime = Date.now();
    const startRotation = rotationRef.current;

    spinSound.play();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / spinDuration, 1);

      const easeProgress = 1 - Math.pow(1 - progress, 4);

      rotationRef.current = startRotation + (targetRotation - startRotation) * easeProgress;

      drawWheel(rotationRef.current);

      if (progress < 1) {
        animationIdRef.current = requestAnimationFrame(animate);
      } else {
        setIsAnimating(false);
        win.play();
        onResult(gifts[targetIndex], playerName);
      }
    };

    animationIdRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    if (isSpinning && !isAnimating) {
      spin();
    }
  }, [isSpinning]);

  return (
    <div className="flex flex-col items-center gap-8">
      <div className="relative">
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-amber-300/30 to-emerald-500/30 blur-3xl transform scale-110 animate-pulse-gold" />
        
        <div className="relative">
          <canvas
            ref={canvasRef}
            width={450}
            height={450}
            className={`w-full max-w-sm aspect-square drop-shadow-2xl transition-transform ${isAnimating ? 'scale-105' : ''}`}
          />
          
          <div className="absolute top-1/2 right-[-20px] transform -translate-y-1/2">
            <div className="relative">
              <svg width="40" height="50" viewBox="0 0 40 50" className="drop-shadow-lg">
                <path
                  d="M0 25 L40 0 L40 50 Z"
                  fill="#d4af37"
                  stroke="#b8962e"
                  strokeWidth="2"
                />
                <path
                  d="M5 25 L35 5 L35 45 Z"
                  fill="#065f46"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={toggleMute}
          className="p-2 rounded-full bg-white/80 shadow-md hover:bg-white transition-all"
          aria-label={muted ? 'Unmute' : 'Mute'}
        >
          {muted ? (
            <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
            </svg>
          ) : (
            <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
            </svg>
          )}
        </button>

        <button
          onClick={spin}
          disabled={isAnimating}
          className={`relative px-12 py-5 rounded-full font-bold text-lg overflow-hidden transition-all transform ${
            isAnimating
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed scale-95'
              : 'btn-gold hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl'
          }`}
        >
          <span className={`relative z-10 ${isAnimating ? '' : 'flex items-center gap-2'}`}>
            {isAnimating ? (
              <>
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                MEMUTAR...
              </>
            ) : (
              <>
                <span>🎡</span>
                <span>PUTAR RODA</span>
              </>
            )}
          </span>
          {!isAnimating && (
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-shimmer" />
          )}
        </button>
      </div>
    </div>
  );
}
