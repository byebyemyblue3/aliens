
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

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 500);
    return () => clearTimeout(timer);
  }, []);

  const handleAuthorize = useCallback(() => {
    if (navigator.vibrate) {
      navigator.vibrate([100, 30, 200]);
    }
    setStatus(AppState.AUTHORIZED);
  }, []);

  return (
    <div className={`relative w-full h-screen bg-black transition-opacity duration-2000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      <div className="scanline" />
      <div className="crt-overlay" />
      
      <BackgroundParticles isAuthorized={status === AppState.AUTHORIZED} />

      <main className="relative z-20 flex flex-col items-center justify-center h-full px-6">
        {status === AppState.IDLE ? (
          <div className="flex flex-col items-center gap-12 animate-in fade-in zoom-in duration-1000">
            <div className="text-center space-y-2">
              <h1 className="text-cyan-400 text-sm tracking-[0.4em] font-light uppercase opacity-80">
                ALIENS# SYSTEM ACCESS
              </h1>
              <p className="text-cyan-200 text-[10px] tracking-[0.2em] opacity-50 uppercase">
                Sub-Neural Authentication Required
              </p>
            </div>
            
            <FingerprintScanner onAuthorized={handleAuthorize} />
            
            <div className="text-[10px] text-cyan-900/60 absolute bottom-12 uppercase tracking-[0.3em] font-bold">
              ALIENS# v9.4.1-OMEGA PROTOCOL
            </div>
          </div>
        ) : (
          <TerminalOutput />
        )}
      </main>
    </div>
  );
};

export default App;
