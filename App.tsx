
import React, { useState, useEffect, useCallback } from 'react';
import FingerprintScanner from './components/FingerprintScanner';
import TerminalOutput from './components/TerminalOutput';
import BackgroundParticles from './components/BackgroundParticles';

enum AppState {
  IDLE,
  AUTHORIZED,
}

const App: React.FC = () => {
  const [status, setStatus] = useState<AppState>(AppState.IDLE);
  const [isVisible, setIsVisible] = useState(false);
  const [isFlashing, setIsFlashing] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 300);
    return () => clearTimeout(timer);
  }, []);

  const handleAuthorize = useCallback(() => {
    setIsFlashing(true);
    // Longer transition for cinematic "handshake" feeling
    setTimeout(() => {
      setStatus(AppState.AUTHORIZED);
      setIsFlashing(false);
    }, 450);
  }, []);

  return (
    <div className={`relative w-full h-screen bg-black transition-opacity duration-[3000ms] ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      <div className="scanline" />
      <div className="crt-overlay" />
      
      {/* Auth Flash Effect */}
      <div className={`fixed inset-0 z-50 pointer-events-none transition-opacity duration-500 ${isFlashing ? 'opacity-100 bg-cyan-400' : 'opacity-0'}`} />

      <BackgroundParticles isAuthorized={status === AppState.AUTHORIZED} />

      <main className="relative z-20 flex flex-col items-center justify-center h-full px-6 overflow-hidden">
        {status === AppState.IDLE ? (
          <div className="flex flex-col items-center gap-14 animate-in fade-in zoom-in duration-1000">
            <div className="text-center space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 border border-cyan-500/20 rounded-full text-[8px] text-cyan-400/80 uppercase tracking-[0.3em] bg-cyan-500/5 animate-pulse">
                <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full" />
                System Idle // Standby
              </div>
              
              <div className="relative">
                <h1 className="text-cyan-400 text-3xl md:text-4xl tracking-[0.6em] font-light uppercase drop-shadow-[0_0_15px_rgba(0,240,255,0.6)]">
                  ALIENS#
                </h1>
                <div className="absolute -inset-2 bg-cyan-400/5 blur-2xl -z-10" />
              </div>

              <p className="text-cyan-200/40 text-[9px] tracking-[0.4em] uppercase max-w-[200px] mx-auto leading-relaxed">
                Biometric Handshake Required for Override
              </p>
            </div>
            
            <FingerprintScanner onAuthorized={handleAuthorize} />
            
            <div className="text-[9px] text-cyan-900/40 absolute bottom-10 uppercase tracking-[0.5em] font-bold border-t border-cyan-900/20 pt-4 w-40 text-center">
              ALIENS# OMEGA-9
            </div>
          </div>
        ) : (
          <div className="w-full flex justify-center animate-in slide-in-from-bottom-8 duration-700">
            <TerminalOutput />
          </div>
        )}
      </main>
      
      <style>{`
        @keyframes flash {
          0% { opacity: 0; }
          50% { opacity: 1; }
          100% { opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default App;
