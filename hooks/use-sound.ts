'use client';

import { useCallback, useRef } from 'react';

interface SoundType {
  play: () => void;
  setMuted: (muted: boolean) => void;
}

export function useSound(): { click: SoundType; spin: SoundType; win: SoundType; muted: boolean; toggleMute: () => void } {
  const mutedRef = useRef(false);
  const audioContextRef = useRef<AudioContext | null>(null);

  const playTone = useCallback((frequency: number, duration: number, type: OscillatorType = 'sine') => {
    if (mutedRef.current) return;
    
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioContextRef.current;
      
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      oscillator.type = type;
      oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);
      
      gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);
      
      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + duration);
    } catch (e) {
      console.log('Audio not supported');
    }
  }, []);

  const click = {
    play: () => playTone(800, 0.1, 'sine'),
    setMuted: (muted: boolean) => { mutedRef.current = muted; }
  };

  const spin = {
    play: () => {
      if (mutedRef.current) return;
      let count = 0;
      const interval = setInterval(() => {
        if (count >= 10) {
          clearInterval(interval);
          return;
        }
        playTone(300 + count * 50, 0.05, 'triangle');
        count++;
      }, 100);
    },
    setMuted: (muted: boolean) => { mutedRef.current = muted; }
  };

  const win = {
    play: () => {
      if (mutedRef.current) return;
      const notes = [523, 659, 784, 1047];
      notes.forEach((freq, i) => {
        setTimeout(() => playTone(freq, 0.3, 'sine'), i * 150);
      });
    },
    setMuted: (muted: boolean) => { mutedRef.current = muted; }
  };

  const toggleMute = useCallback(() => {
    mutedRef.current = !mutedRef.current;
  }, []);

  return { click, spin, win, muted: mutedRef.current, toggleMute };
}
