
import React, { useState, useRef, useEffect } from 'react';

interface FingerprintScannerProps {
  onAuthorized: () => void;
}

const FingerprintScanner: React.FC<FingerprintScannerProps> = ({ onAuthorized }) => {
  const [isPressing, setIsPressing] = useState(false);
  const [progress, setProgress] = useState(0);
  const progressIntervalRef = useRef<number | null>(null);

  const startPress = (e: React.PointerEvent) => {
    if (e.button !== 0) return;
    setIsPressing(true);
    setProgress(0);

    if (navigator.vibrate) navigator.vibrate([20]);

    progressIntervalRef.current = window.setInterval(() => {
      setProgress((prev) => {
        const next = prev + 1.2;
        if (next >= 100) {
          if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
          if (navigator.vibrate) navigator.vibrate([100, 50, 200]);
          onAuthorized();
          return 100;
        }
        return next;
      });
    }, 16);
  };

  const endPress = () => {
    setIsPressing(false);
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
    }
    const resetInterval = setInterval(() => {
      setProgress(p => {
        if (p <= 0) {
          clearInterval(resetInterval);
          return 0;
        }
        return Math.max(0, p - 6);
      });
    }, 16);
  };

  return (
    <div className="relative flex items-center justify-center select-none touch-none">
      <div className={`absolute inset-0 flex items-center justify-center pointer-events-none transition-opacity duration-300 ${isPressing ? 'opacity-100' : 'opacity-0'}`}>
        <div className="absolute w-40 h-40 border border-cyan-400/30 rounded-full animate-[ping_2s_infinite]" />
        <div className="absolute w-48 h-48 border border-cyan-400/10 rounded-full animate-[ping_3s_infinite_0.75s]" />
      </div>

      {/* Outer Tech Rings */}
      <div className={`absolute pointer-events-none transition-all duration-1000 ${isPressing ? 'scale-110 opacity-100' : 'scale-90 opacity-0'}`}>
        <svg className="w-64 h-64 animate-[spin_20s_linear_infinite]">
          <circle cx="128" cy="128" r="110" stroke="currentColor" strokeWidth="0.5" fill="none" strokeDasharray="4 20" className="text-cyan-500/40" />
          <circle cx="128" cy="128" r="120" stroke="currentColor" strokeWidth="1" fill="none" strokeDasharray="80 160" className="text-cyan-500/20" />
        </svg>
      </div>

      <div className="relative group flex items-center justify-center">
        <svg className="absolute w-80 h-80 -rotate-90 pointer-events-none">
          <circle cx="160" cy="160" r="75" stroke="currentColor" strokeWidth="2" fill="transparent" className="text-cyan-950/20" />
          <circle
            cx="160"
            cy="160"
            r="75"
            stroke="currentColor"
            strokeWidth="2"
            fill="transparent"
            strokeDasharray={471}
            strokeDashoffset={471 - (471 * progress) / 100}
            strokeLinecap="round"
            className={`transition-all duration-75 drop-shadow-[0_0_10px_#00f0ff] ${isPressing ? 'text-cyan-400' : 'text-cyan-700'}`}
          />
        </svg>

        <button
          onPointerDown={startPress}
          onPointerUp={endPress}
          onPointerLeave={endPress}
          onContextMenu={(e) => e.preventDefault()}
          className={`relative z-10 w-36 h-36 rounded-full flex items-center justify-center transition-all duration-300 overflow-hidden
            ${isPressing ? 'bg-cyan-500/5 scale-95 shadow-[inset_0_0_40px_rgba(0,240,255,0.15)]' : 'bg-transparent'}`}
        >
          {/* Detailed Fingerprint SVG */}
          <div className={`transition-all duration-500 transform ${isPressing ? 'text-cyan-300 scale-105 opacity-100' : 'text-cyan-600 opacity-40'}`}>
            <svg viewBox="0 0 100 100" className="w-20 h-20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <path d="M50 10c-22.1 0-40 17.9-40 40M50 20c-16.6 0-30 13.4-30 30M50 30c-11 0-20 9-20 20M50 40c-5.5 0-10 4.5-10 10" />
              <path d="M50 10c22.1 0 40 17.9 40 40M50 20c16.6 0 30 13.4 30 30M50 30c11 0 20 9 20 20M50 40c5.5 0 10 4.5 10 10" />
              <path d="M30 70c0 11 9 20 20 20s20-9 20-20M40 70c0 5.5 4.5 10 10 10s10-4.5 10-10M20 70c0 16.6 13.4 30 30 30s30-13.4 30-30" />
              <path d="M50 50v10M45 55c0 2.8 2.2 5 5 5s5-2.2 5-5" />
              <path d="M15 50v5M85 50v5M25 50v10M75 50v10" />
              {/* Extra ridges for realism */}
              <path d="M35 50q0 5 5 5M65 50q0 5-5 5" strokeWidth="1" opacity="0.7" />
              <path d="M42 65q8 4 16 0" strokeWidth="1" />
            </svg>
          </div>
          
          {isPressing && (
            <div className="absolute inset-0 pointer-events-none opacity-20">
              <div className="h-full w-full bg-[linear-gradient(transparent_0%,#00f0ff_50%,transparent_100%)] bg-[length:100%_6px] animate-[flow_0.4s_linear_infinite]" />
            </div>
          )}

          {isPressing && (
            <div className="absolute top-0 left-0 w-full h-[2px] bg-cyan-300 shadow-[0_0_15px_#00f0ff] animate-[scan_1s_ease-in-out_infinite] z-20" />
          )}
        </button>

        <div className="absolute -bottom-24 w-full text-center flex flex-col items-center">
          <div className={`text-[9px] font-bold tracking-[0.6em] transition-all duration-300 ${isPressing ? 'opacity-100 text-cyan-200' : 'opacity-30'}`}>
            {isPressing ? 'SCANNING DNA RIDGES' : 'IDENTITY CHECK REQUIRED'}
          </div>
          <div className={`mt-2 font-mono text-[11px] transition-all duration-300 ${isPressing ? 'opacity-100 scale-110 text-cyan-400' : 'opacity-0 scale-90'}`}>
            [{Math.floor(progress).toString().padStart(3, '0')}%]
          </div>
        </div>
      </div>

      <style>{`
        @keyframes scan {
          0% { top: 15%; opacity: 0; }
          30% { opacity: 1; }
          70% { opacity: 1; }
          100% { top: 85%; opacity: 0; }
        }
        @keyframes flow {
          from { transform: translateY(-100%); }
          to { transform: translateY(100%); }
        }
      `}</style>
    </div>
  );
};

export default FingerprintScanner;
