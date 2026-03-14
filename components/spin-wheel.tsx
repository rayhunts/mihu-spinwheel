'use client';

import { useEffect, useRef, useState } from 'react';

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

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 2 - 10;

    const drawWheel = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(rotationRef.current);

      const sliceAngle = (Math.PI * 2) / gifts.length;

      // Draw segments
      gifts.forEach((gift, index) => {
        const startAngle = index * sliceAngle;
        const endAngle = (index + 1) * sliceAngle;

        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.arc(0, 0, radius, startAngle, endAngle);
        ctx.closePath();
        ctx.fillStyle = gift.color;
        ctx.fill();

        // Border
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 3;
        ctx.stroke();

        // Text
        ctx.save();
        ctx.rotate(startAngle + sliceAngle / 2);
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 14px sans-serif';
        ctx.textAlign = 'right';
        ctx.textBaseline = 'middle';

        const text = `${gift.emoji} ${gift.name}`;
        ctx.fillText(text, radius - 30, 0);
        ctx.restore();
      });

      ctx.restore();

      // Draw center circle
      ctx.beginPath();
      ctx.arc(centerX, centerY, 20, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.fill();
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Draw pointer (triangle at top)
      const pointerX = centerX + radius;
      const pointerY = centerY;
      const pointerSize = 15;

      ctx.beginPath();
      ctx.moveTo(pointerX - pointerSize, pointerY);
      ctx.lineTo(pointerX + pointerSize, pointerY - pointerSize);
      ctx.lineTo(pointerX + pointerSize, pointerY + pointerSize);
      ctx.closePath();
      ctx.fillStyle = '#ef4444';
      ctx.fill();
    };

    drawWheel();
  }, [gifts]);

  const spin = () => {
    if (isSpinning) return;

    // Cancel any ongoing animation
    if (animationIdRef.current) {
      cancelAnimationFrame(animationIdRef.current);
    }

    const spinDuration = 5000; // 5 seconds
    const rotations = 5; // Number of full rotations
    
    // Check if player name starts with "Pak" - they get mystery gift (which is now in the wheel)
    let targetIndex = 0;
    if (playerName.trim().startsWith('Pak') || playerName.trim().startsWith('pak')) {
      // Find mystery gift index in the gifts array
      targetIndex = gifts.findIndex(gift => gift.name === 'Hadiah Misterius');
      if (targetIndex === -1) targetIndex = 0; // Fallback
    } else {
      // Regular players can only win 5000 or 10000
      const allowedPrizes = gifts
        .map((gift, index) => ({ gift, index }))
        .filter(item => item.gift.name === 'Rp 5.000' || item.gift.name === 'Rp 10.000');
      
      if (allowedPrizes.length > 0) {
        const selectedPrize = allowedPrizes[Math.floor(Math.random() * allowedPrizes.length)];
        targetIndex = selectedPrize.index;
      } else {
        targetIndex = 0; // Fallback
      }
    }
    
    const sliceAngle = (Math.PI * 2) / gifts.length;
    // Calculate the angle to stop at the pointer (which is at the top/0 angle)
    // We need to rotate so the target index ends up at the pointer
    const targetRotation = rotations * Math.PI * 2 + (Math.PI * 2 - (targetIndex * sliceAngle + sliceAngle / 2));

    const startTime = Date.now();
    const startRotation = rotationRef.current;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / spinDuration, 1);

      // Easing function: fast at start, slow at end
      const easeProgress = 1 - Math.pow(1 - progress, 3);

      rotationRef.current = startRotation + (targetRotation - startRotation) * easeProgress;

      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          const width = canvas.width;
          const height = canvas.height;
          const centerX = width / 2;
          const centerY = height / 2;
          const radius = Math.min(width, height) / 2 - 10;

          ctx.clearRect(0, 0, width, height);
          ctx.save();
          ctx.translate(centerX, centerY);
          ctx.rotate(rotationRef.current);

          gifts.forEach((gift, index) => {
            const startAngle = index * sliceAngle;
            const endAngle = (index + 1) * sliceAngle;

            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.arc(0, 0, radius, startAngle, endAngle);
            ctx.closePath();
            ctx.fillStyle = gift.color;
            ctx.fill();

            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 3;
            ctx.stroke();

            ctx.save();
            ctx.rotate(startAngle + sliceAngle / 2);
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 14px sans-serif';
            ctx.textAlign = 'right';
            ctx.textBaseline = 'middle';

            const text = `${gift.emoji} ${gift.name}`;
            ctx.fillText(text, radius - 30, 0);
            ctx.restore();
          });

          ctx.restore();

          ctx.beginPath();
          ctx.arc(centerX, centerY, 20, 0, Math.PI * 2);
          ctx.fillStyle = '#ffffff';
          ctx.fill();
          ctx.strokeStyle = '#ef4444';
          ctx.lineWidth = 3;
          ctx.stroke();

          const pointerX = centerX + radius;
          const pointerY = centerY;
          const pointerSize = 15;

          ctx.beginPath();
          ctx.moveTo(pointerX - pointerSize, pointerY);
          ctx.lineTo(pointerX + pointerSize, pointerY - pointerSize);
          ctx.lineTo(pointerX + pointerSize, pointerY + pointerSize);
          ctx.closePath();
          ctx.fillStyle = '#ef4444';
          ctx.fill();
        }
      }

      if (progress < 1) {
        animationIdRef.current = requestAnimationFrame(animate);
      } else {
        onResult(gifts[targetIndex], playerName);
      }
    };

    animationIdRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    if (isSpinning) {
      spin();
    }
  }, [isSpinning]);

  return (
    <div className="flex flex-col items-center gap-8">
      <canvas
        ref={canvasRef}
        width={500}
        height={500}
        className="w-full max-w-md aspect-square drop-shadow-lg"
      />
      <button
        onClick={spin}
        disabled={isSpinning}
        className={`px-8 py-4 rounded-full font-bold text-lg transition-all ${
          isSpinning
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-gradient-to-r from-red-500 to-pink-500 text-white hover:shadow-lg hover:scale-105 active:scale-95'
        }`}
      >
        {isSpinning ? 'BERPUTAR...' : 'PUTAR RODA'}
      </button>
    </div>
  );
}
