
import React, { useState, useRef, useEffect } from 'react';
import { sounds } from './SoundManager';

interface FingerprintScannerProps {
  onAuthorized: () => void;
}

const FingerprintScanner: React.FC<FingerprintScannerProps> = ({ onAuthorized }) => {
  const [isPressing, setIsPressing] = useState(false);
  const [progress, setProgress] = useState(0);
  const progressIntervalRef = useRef<number | null>(null);
  const soundIntervalRef = useRef<number | null>(null);

  const startPress = (e: React.PointerEvent) => {
    if (e.button !== 0) return;
    setIsPressing(true);
    setProgress(0);

    if (navigator.vibrate) navigator.vibrate([25]);
    sounds.playPing();

    progressIntervalRef.current = window.setInterval(() => {
      setProgress((prev) => {
        const next = prev + 1.2;
        if (next >= 100) {
          if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
          if (soundIntervalRef.current) clearInterval(soundIntervalRef.current);
          sounds.playSuccess();
          if (navigator.vibrate) navigator.vibrate([150, 50, 300]);
          onAuthorized();
          return 100;
        }
        return next;
      });
    }, 16);

    // Slower, deeper hum loop for cinematic weight
    soundIntervalRef.current = window.setInterval(() => {
      sounds.playScanHum(0.4);
    }, 350);
  };

  const endPress = () => {
    setIsPressing(false);
    if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    if (soundIntervalRef.current) clearInterval(soundIntervalRef.current);
    
    const resetInterval = setInterval(() => {
      setProgress(p => {
        if (p <= 0) {
          clearInterval(resetInterval);
          return 0;
        }
        return Math.max(0, p - 8);
      });
    }, 16);
  };

  return (
    <div className="relative flex items-center justify-center select-none touch-none">
      {/* Dynamic Aura */}
      <div className={`absolute inset-0 flex items-center justify-center pointer-events-none transition-opacity duration-300 ${isPressing ? 'opacity-100' : 'opacity-0'}`}>
        <div className="absolute w-40 h-40 border-2 border-cyan-400/40 rounded-full animate-[ping_1.5s_infinite] shadow-[0_0_40px_rgba(0,240,255,0.4)]" />
        <div className="absolute w-60 h-60 border border-cyan-400/10 rounded-full animate-[ping_2.5s_infinite_0.5s]" />
      </div>

      {/* Floating Interactive Particles */}
      {isPressing && (
        <div className="absolute inset-0 z-0 pointer-events-none">
          {[...Array(16)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-cyan-400 rounded-full animate-[floatIn_0.7s_ease-out_infinite]"
              style={{
                left: '50%',
                top: '50%',
                '--tx': `${(Math.random() - 0.5) * 250}px`,
                '--ty': `${(Math.random() - 0.5) * 250}px`,
                animationDelay: `${Math.random() * 0.7}s`
              } as React.CSSProperties}
            />
          ))}
        </div>
      )}

      {/* Outer Rotating HUD */}
      <div className={`absolute pointer-events-none transition-all duration-1000 ${isPressing ? 'scale-110 opacity-100' : 'scale-75 opacity-0'}`}>
        <svg className="w-80 h-80 animate-[spin_12s_linear_infinite]">
          <circle cx="160" cy="160" r="145" stroke="currentColor" strokeWidth="0.5" fill="none" strokeDasharray="5 25" className="text-cyan-500/30" />
          <path d="M160 15 A 145 145 0 0 1 305 160" fill="none" stroke="currentColor" strokeWidth="2" className="text-cyan-400/20" />
        </svg>
      </div>

      <div className="relative group flex items-center justify-center">
        <svg className="absolute w-80 h-80 -rotate-90 pointer-events-none">
          <circle cx="160" cy="160" r="82" stroke="currentColor" strokeWidth="2" fill="transparent" className="text-cyan-950/20" />
          <circle
            cx="160"
            cy="160"
            r="82"
            stroke="currentColor"
            strokeWidth="4"
            fill="transparent"
            strokeDasharray={515}
            strokeDashoffset={515 - (515 * progress) / 100}
            strokeLinecap="round"
            className={`transition-all duration-75 drop-shadow-[0_0_15px_#00f0ff] ${isPressing ? 'text-cyan-300' : 'text-cyan-900'}`}
          />
        </svg>

        <button
          onPointerDown={startPress}
          onPointerUp={endPress}
          onPointerLeave={endPress}
          onContextMenu={(e) => e.preventDefault()}
          className={`relative z-10 w-36 h-36 rounded-full flex items-center justify-center transition-all duration-300 overflow-hidden
            ${isPressing ? 'bg-cyan-500/10 scale-95 shadow-[inset_0_0_60px_rgba(0,240,255,0.4)]' : 'bg-transparent'}`}
        >
          {/* Fingerprint ridges */}
          <div className={`transition-all duration-500 transform ${isPressing ? 'text-cyan-200 scale-115 opacity-100 filter drop-shadow-[0_0_8px_rgba(0,240,255,1)]' : 'text-cyan-800 opacity-40'}`}>
            <svg viewBox="0 0 100 100" className="w-24 h-24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round">
              <path d="M50 5c-24.8 0-45 20.2-45 45M50 15c-19.3 0-35 15.7-35 35M50 25c-13.8 0-25 11.2-25 25M50 35c-8.3 0-15 6.7-15 15" />
              <path d="M50 5c24.8 0 45 20.2 45 45M50 15c19.3 0 35 15.7 35 35M50 25c13.8 0 25 11.2 25 25M50 35c8.3 0 15 6.7 15 15" />
              <path d="M20 50v5M30 50v10M40 50v15M60 50v15M70 50v10M80 50v5" />
              <path d="M15 75q35 15 70 0M25 85q25 10 50 0M5 65q45 20 90 0" />
              <circle cx="50" cy="50" r="2" fill="currentColor" className={isPressing ? 'animate-pulse' : ''} />
            </svg>
          </div>
          
          {isPressing && (
            <div className="absolute inset-0 pointer-events-none opacity-40">
              <div className="h-full w-full bg-[linear-gradient(transparent_0%,#00f0ff_50%,transparent_100%)] bg-[length:100%_4px] animate-[flow_0.25s_linear_infinite]" />
            </div>
          )}

          {isPressing && (
            <div className="absolute top-0 left-0 w-full h-[4px] bg-cyan-200 shadow-[0_0_25px_#00f0ff] animate-[scan_0.7s_ease-in-out_infinite] z-20" />
          )}
        </button>

        <div className="absolute -bottom-28 w-full text-center flex flex-col items-center">
          <div className={`text-[10px] font-bold tracking-[0.7em] transition-all duration-300 ${isPressing ? 'opacity-100 text-cyan-200 scale-110' : 'opacity-20'}`}>
            {isPressing ? 'DEEP SCANNING...' : 'SYSTEM LOCKED'}
          </div>
          <div className={`mt-3 font-mono text-[14px] transition-all duration-300 ${isPressing ? 'opacity-100 text-cyan-400 drop-shadow-[0_0_8px_#00f0ff]' : 'opacity-0'}`}>
            &lt; {Math.floor(progress).toString().padStart(3, '0')} % &gt;
          </div>
        </div>
      </div>

      <style>{`
        @keyframes scan {
          0% { top: 5%; opacity: 0; }
          40% { opacity: 1; }
          60% { opacity: 1; }
          100% { top: 95%; opacity: 0; }
        }
        @keyframes flow {
          from { transform: translateY(-100%); }
          to { transform: translateY(100%); }
        }
        @keyframes floatIn {
          0% { transform: translate(var(--tx), var(--ty)); opacity: 0; }
          50% { opacity: 0.9; }
          100% { transform: translate(0, 0); opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default FingerprintScanner;
