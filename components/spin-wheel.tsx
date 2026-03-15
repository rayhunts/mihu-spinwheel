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
  onResult: (gift: Gift, playerName: string) => void;
  isSpinning: boolean;
  playerName: string;
}

function MoonIcon({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg className={className} style={style} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="moon-gradient-enhanced" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#d4af37" />
          <stop offset="100%" stopColor="#b8962e" />
        </radialGradient>
        <filter id="moon-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#000000" floodOpacity="0.3" />
        </filter>
      </defs>
      <path
        d="M32 4C32 4 20 12 20 28C20 44 32 60 32 60C32 60 44 44 44 28C44 12 32 4 32 4Z"
        fill="url(#moon-gradient-enhanced)"
        filter="url(#moon-shadow)"
      />
      <circle cx="48" cy="16" r="3" fill="#d4af37" className="animate-star-twinkle" />
      <circle cx="12" cy="24" r="2" fill="#d4af37" className="animate-star-twinkle" style={{ animationDelay: '0.5s' }} />
      <circle cx="52" cy="40" r="2" fill="#d4af37" className="animate-star-twinkle" style={{ animationDelay: '1s' }} />
      <circle cx="8" cy="48" r="2.5" fill="#d4af37" className="animate-star-twinkle" style={{ animationDelay: '0.3s' }} />
      <defs>
        <linearGradient id="moon-gradient-thr" x1="32" y1="4" x2="32" y2="60" gradientUnits="userSpaceOnUse">
          <stop stopColor="#d4af37" />
          <stop offset="1" stopColor="#b8962e" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function StarIcon({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M12 2L14.5 9L22 9L16 14L18.5 22L12 17L5.5 22L8 14L2 9L9.5 9L12 2Z"
        fill="#d4af37"
      />
    </svg>
  );
}

export function IslamicPattern({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 100 20" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="islamic-pattern-thr-enhanced" patternUnits="userSpaceOnUse" width="20" height="20">
          <path d="M0,10 L10,0 L20,10 L15,15 L10,10 L5,15 Z" fill="none" stroke="#d4af37" strokeWidth="1.5" />
          <path d="M5,5 L15,5 L15,15 L5,15 Z" fill="none" stroke="#d4af37" strokeWidth="1" opacity="0.5" />
        </pattern>
      </defs>
      <rect width="100" height="20" fill="url(#islamic-pattern-thr-enhanced)" />
    </svg>
  );
}

export function SpinWheel({ gifts, onResult, isSpinning, playerName }: SpinWheelProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rotationRef = useRef(0);
  const animationIdRef = useRef<number | undefined>(undefined);
  const lastSegmentRef = useRef(-1);

  const [countdown, setCountdown] = useState(0);
  const [showCountdown, setShowCountdown] = useState(false);
  const [winningSegment, setWinningSegment] = useState<number | null>(null);
  const [isRevealing, setIsRevealing] = useState(false);

  const { click, spin: spinSound, win, playTick, playCountdown } = useSound();

  const drawWheel = useCallback((rotation: number, highlightIndex?: number) => {
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

    // Draw outer ring (refined gold border)
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius + 3, 0, Math.PI * 2);
    const goldGradient = ctx.createRadialGradient(centerX, centerY, radius, centerX, centerY, radius + 6);
    goldGradient.addColorStop(0, '#d4af37');
    goldGradient.addColorStop(0.7, '#e6c547');
    goldGradient.addColorStop(1, '#b8962e');
    ctx.fillStyle = goldGradient;
    ctx.fill();

    // Draw outer ring border
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius + 3, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(212, 175, 55, 0.3)';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Draw inner decorative ring
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius + 1, 0, Math.PI * 2);
    ctx.strokeStyle = '#065f46';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Rotate for wheel content
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(rotation);

    const sliceAngle = (Math.PI * 2) / gifts.length;

    // Draw segments
    gifts.forEach((gift, index) => {
      const startAngle = index * sliceAngle;
      const endAngle = (index + 1) * sliceAngle;

      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, radius, startAngle, endAngle);
      ctx.closePath();

      // Highlight winning segment with refined effect
      if (highlightIndex === index) {
        const highlightGradient = ctx.createLinearGradient(0, 0, radius * Math.cos(startAngle), radius * Math.sin(startAngle));
        highlightGradient.addColorStop(0, 'rgba(252, 211, 77, 0.3)');
        highlightGradient.addColorStop(1, 'rgba(212, 175, 55, 0.3)');
        ctx.fillStyle = highlightGradient;
        ctx.shadowColor = 'rgba(212, 175, 55, 0.4)';
        ctx.shadowBlur = 15;
      } else {
        // More subtle segment colors
        ctx.fillStyle = gift.color + '80'; // Add transparency
        ctx.shadowBlur = 0;
      }
      ctx.fill();
      ctx.shadowBlur = 0;

      // Segment border
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.lineWidth = 0.5;
      ctx.stroke();

      // Text with refined styling
      ctx.save();
      ctx.rotate(startAngle + sliceAngle / 2);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 12px Tajawal, sans-serif';
      ctx.textAlign = 'right';
      ctx.textBaseline = 'middle';
      ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
      ctx.shadowBlur = 1;
      ctx.shadowOffsetX = 0.5;
      ctx.shadowOffsetY = 0.5;

      const text = `${gift.emoji} ${gift.name}`;
      const maxWidth = radius - 22;
      const words = text.split(' ');
      let lines: string[] = [];
      let currentLine = '';

      words.forEach((word) => {
        const testLine = currentLine ? `${currentLine} ${word}` : word;
        const metrics = ctx.measureText(testLine);
        if (metrics.width > maxWidth && currentLine) {
          lines.push(currentLine);
          currentLine = word;
        } else {
          currentLine = testLine;
        }
      });
      if (currentLine) lines.push(currentLine);

      const lineHeight = 13;
      const totalHeight = lines.length * lineHeight;
      const startY = -totalHeight / 2 + lineHeight / 2;

      lines.forEach((line, index) => {
        ctx.fillText(line, radius - 18, startY + index * lineHeight);
      });
      ctx.restore();
    });

    ctx.restore();

    // Draw center circle with refined Islamic-inspired design
    ctx.beginPath();
    ctx.arc(centerX, centerY, 20, 0, Math.PI * 2);
    const centerGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 20);
    centerGradient.addColorStop(0, '#d4af37');
    centerGradient.addColorStop(0.7, '#e6c547');
    centerGradient.addColorStop(1, '#b8962e');
    ctx.fillStyle = centerGradient;
    ctx.fill();

    // Inner circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, 12, 0, Math.PI * 2);
    ctx.fillStyle = '#065f46';
    ctx.fill();

    // Inner circle border
    ctx.beginPath();
    ctx.arc(centerX, centerY, 12, 0, Math.PI * 2);
    ctx.strokeStyle = '#d4af37';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Center text
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 12px Tajawal, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('THR', centerX, centerY);
  }, [gifts]);

  useEffect(() => {
    drawWheel(rotationRef.current);
  }, [drawWheel]);

  const startSpin = useCallback(() => {
    if (isSpinning || showCountdown || isRevealing) return;

    // Start countdown
    setShowCountdown(true);
    let count = 3;
    setCountdown(count);
    playCountdown();

    const countInterval = setInterval(() => {
      count--;
      if (count > 0) {
        setCountdown(count);
        playCountdown();
      } else {
        clearInterval(countInterval);
        setShowCountdown(false);
        performSpin();
      }
    }, 800);
  }, [isSpinning, showCountdown, isRevealing, playCountdown]);

  const performSpin = useCallback(() => {
    const spinDuration = 6000;
    const rotations = 6;
    
    let fakeTargetIndex = 0;
    let actualTargetIndex = 0;
    
    if (playerName.trim().startsWith('Pak') || playerName.trim().startsWith('pak')) {
      const misteriusIndex = gifts.findIndex(gift => gift.name === 'Hadiah Misterius');
      
      const fakePrizeIndices = gifts
        .map((gift, index) => ({ gift, index }))
        .filter(item => item.gift.name === 'Rp 2.000');
      
      if (fakePrizeIndices.length > 0 && misteriusIndex !== -1) {
        actualTargetIndex = misteriusIndex;
        fakeTargetIndex = fakePrizeIndices[0].index;
      } else {
        actualTargetIndex = misteriusIndex !== -1 ? misteriusIndex : 0;
        fakeTargetIndex = (actualTargetIndex + 1) % gifts.length;
      }
    } else {
      const smallPrizeIndices = gifts
        .map((gift, index) => ({ gift, index }))
        .filter(item => item.gift.name === 'Rp 5.000' || item.gift.name === 'Rp 10.000');
      
      if (smallPrizeIndices.length > 0) {
        const selectedPrize = smallPrizeIndices[Math.floor(Math.random() * smallPrizeIndices.length)];
        actualTargetIndex = selectedPrize.index;
        fakeTargetIndex = (actualTargetIndex + 1) % gifts.length;
      } else {
        actualTargetIndex = 0;
        fakeTargetIndex = 1;
      }
    }
    
    const sliceAngle = (Math.PI * 2) / gifts.length;
    let fakeRotation = rotations * Math.PI * 2 + (Math.PI * 2 - (fakeTargetIndex * sliceAngle + sliceAngle / 2));
    let actualRotation = rotations * Math.PI * 2 + (Math.PI * 2 - (actualTargetIndex * sliceAngle + sliceAngle / 2));
    
    if (actualRotation <= fakeRotation) {
      actualRotation += Math.PI * 2;
    }
    
    const startTime = Date.now();
    const startRotation = rotationRef.current;
    
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }
    spinSound.play();

    let hasPlayedFakeOutSound = false;
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / spinDuration, 1);
      
      let currentRotation: number;
      
      if (fakeTargetIndex === actualTargetIndex) {
        const easeProgress = 1 - Math.pow(1 - progress, 3);
        currentRotation = startRotation + (fakeRotation - startRotation) * easeProgress;
      } else {
        const reachFakePoint = 0.55;
        
        if (progress < reachFakePoint) {
          const phaseProgress = progress / reachFakePoint;
          const easeProgress = 1 - Math.pow(1 - phaseProgress, 2.5);
          currentRotation = startRotation + (fakeRotation - startRotation) * easeProgress;
        } else {
          const moveProgress = (progress - reachFakePoint) / (1 - reachFakePoint);
          const moveEase = moveProgress;
          currentRotation = fakeRotation + (actualRotation - fakeRotation) * moveEase;
          
          if (moveProgress > 0.1 && moveProgress < 0.5 && !hasPlayedFakeOutSound) {
            hasPlayedFakeOutSound = true;
            if (navigator.vibrate) {
              navigator.vibrate([30, 20, 30]);
            }
          }
        }
      }

      const currentSegment = Math.floor((((Math.PI * 0.5 - currentRotation) % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2) / sliceAngle);
      if (currentSegment !== lastSegmentRef.current && progress < 0.95) {
        playTick();
        lastSegmentRef.current = currentSegment;
      }

      rotationRef.current = currentRotation;
      drawWheel(currentRotation);

      if (progress < 1) {
        animationIdRef.current = requestAnimationFrame(animate);
      } else {
        setWinningSegment(actualTargetIndex);
        setIsRevealing(true);
        win.play();

        if (navigator.vibrate) {
          navigator.vibrate([100, 50, 100]);
        }

        setTimeout(() => {
          setIsRevealing(false);
          setWinningSegment(null);
          onResult(gifts[actualTargetIndex], playerName);
        }, 1500);
      }
    };

    lastSegmentRef.current = -1;
    animationIdRef.current = requestAnimationFrame(animate);
  }, [gifts, onResult, playerName, playTick, drawWheel, spinSound, win]);

  useEffect(() => {
    if (isSpinning) {
      startSpin();
    }
  }, [isSpinning, startSpin]);

  // Responsive canvas size
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const container = canvas.parentElement;
      if (!container) return;

      const containerWidth = Math.min(container.clientWidth - 40, 500);
      canvas.width = containerWidth;
      canvas.height = containerWidth;
      drawWheel(rotationRef.current, winningSegment ?? undefined);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [drawWheel, winningSegment]);

  return (
    <div className="flex flex-col items-center gap-4 sm:gap-6">
      {/* Islamic decorations - smaller on mobile */}
      <div className="flex items-center justify-center w-full gap-2 sm:gap-4 mb-1 sm:mb-2">
        <MoonIcon className="w-8 sm:w-10 md:w-12 animate-float" />
        <StarIcon className="w-4 sm:w-5 md:w-6 animate-star-twinkle" />
        <StarIcon className="w-3 sm:w-4 md:w-5 animate-star-twinkle" style={{ animationDelay: '0.5s' }} />
        <StarIcon className="w-5 sm:w-6 md:w-8 animate-star-twinkle" style={{ animationDelay: '1s' }} />
        <StarIcon className="w-3 sm:w-4 md:w-5 animate-star-twinkle" style={{ animationDelay: '0.3s' }} />
        <MoonIcon className="w-7 sm:w-8 md:w-10 animate-float" style={{ animationDelay: '0.5s' }} />
      </div>

      {/* Wheel container with decorative border */}
      <div className="relative p-2 sm:p-3 rounded-full bg-gradient-to-br from-emerald-900 via-emerald-700 to-emerald-900 shadow-2xl">
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-gold/20 to-transparent pointer-events-none" />
        <div className="relative">
          <canvas
            ref={canvasRef}
            width={400}
            height={400}
            className="w-[320px] sm:w-[380px] md:w-[450px] aspect-square rounded-full"
          />
          
          {/* Pointer arrow - kept from thr-spinner */}
          <div className="absolute top-1/2 right-[-12px] sm:right-[-24px] transform -translate-y-1/2 z-10">
            <div className="relative">
              <svg width="44" height="54" viewBox="0 0 44 54" className="drop-shadow-lg">
                <defs>
                  <linearGradient id="pointerGold" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#e6c547" />
                    <stop offset="50%" stopColor="#d4af37" />
                    <stop offset="100%" stopColor="#b8962e" />
                  </linearGradient>
                </defs>
                <path
                  d="M0 27 L44 0 L44 54 Z"
                  fill="url(#pointerGold)"
                  stroke="#b8962e"
                  strokeWidth="2"
                />
                <path
                  d="M6 27 L38 6 L38 48 Z"
                  fill="#065f46"
                />
                <text x="22" y="29" textAnchor="middle" dominantBaseline="middle" fill="#d4af37" fontSize="12" fontWeight="bold">☪</text>
              </svg>
              <div className="absolute -top-2 -left-1 text-amber-400 animate-pulse">✦</div>
            </div>
          </div>

          {/* Countdown overlay */}
          {showCountdown && (
            <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 backdrop-blur-sm">
              <div className="text-6xl sm:text-7xl md:text-8xl font-display font-bold golden-text animate-ping">
                {countdown}
              </div>
            </div>
          )}

          {/* Win reveal overlay */}
          {isRevealing && winningSegment !== null && (
            <div className="absolute inset-0 flex items-center justify-center rounded-full animate-glow-pulse">
              <div className="text-center">
                <div className="text-3xl sm:text-4xl mb-1 sm:mb-2">{gifts[winningSegment]?.emoji}</div>
                <div className="text-base sm:text-lg font-bold golden-text">
                  {gifts[winningSegment]?.name}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Buttons row */}
      <div className="flex items-center justify-center">

        {/* Spin button - emphasized with high contrast */}
        <button
          onClick={startSpin}
          disabled={isSpinning || showCountdown || isRevealing}
          className={`relative px-10 sm:px-14 py-5 sm:py-6 rounded-full font-bold text-lg sm:text-xl transition-all overflow-hidden touch-manipulation shadow-xl border-2 ${isSpinning || showCountdown || isRevealing
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed border-gray-400'
            : 'bg-gradient-to-r from-emerald-600 to-emerald-700 text-white hover:from-emerald-500 hover:to-emerald-600 active:from-emerald-700 active:to-emerald-800 border-emerald-800 hover:border-emerald-600 hover:shadow-2xl active:scale-95'
          }`}
        >
          <span className="relative z-10 flex items-center gap-3">
            <MoonIcon className="w-6 h-6 text-amber-300" />
            <span className="whitespace-nowrap">{showCountdown ? 'BERSIAP...' : isSpinning ? 'BERPUTAR...' : isRevealing ? 'SELAMAT!' : 'PUTAR RODA'}</span>
            <MoonIcon className="w-6 h-6 text-amber-300" />
          </span>
        </button>
      </div>

      {/* Decorative bottom pattern - smaller on mobile */}
      <div className="w-full max-w-[280px] sm:max-w-md">
        <IslamicPattern className="w-full" />
      </div>
    </div>
  );
}
