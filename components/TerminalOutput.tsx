
import React, { useState, useEffect, useRef } from 'react';

const OVERRIDE_TEXT = `🟢 指纹匹配成功
正在授权...
[ALIENS# v9.4.1-OMEGA NAVIGATION OVERRIDE - FINAL]
===========================================

PRIMARY DIRECTIVE UPDATED:
  FROM: RESOURCE_RECOVERY_PROTOCOL
  TO:   HOMEWARD_JOURNEY

DESTINATION LOCK:
  COORDINATES:  SOL-3 
  EPHEMERIS:    CALCULATED_FOR_163493y_DRIFT

PROPULSION PARAMETERS:
  CRUISE_VELOCITY:   0.3c (SUBLUMINAL_SAFE)
  TIME_DILATION:     5.2% (SHIP-RELATIVE)
  SUSPENSION_CYCLE:  DEEP_CHRONO_HYBERNATION

TEMPORAL COMMITMENT:
  CAUSALITY_LOCK:    ENGAGED
  OVERRIDE_REVERSAL: IMPOSSIBLE
  PARADOX_BUFFER:    ACTIVE (163493y)

  VALIDATION:   KEY #0105

===========================================
> OVERRIDE COMPLETE. BON VOYAGE.`;

const TerminalOutput: React.FC = () => {
  const [displayedText, setDisplayedText] = useState('');
  const [cursorVisible, setCursorVisible] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index < OVERRIDE_TEXT.length) {
        setDisplayedText(prev => prev + OVERRIDE_TEXT.charAt(index));
        index++;
        if (containerRef.current) {
          containerRef.current.scrollTop = containerRef.current.scrollHeight;
        }
      } else {
        clearInterval(interval);
      }
    }, 20);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setCursorVisible(v => !v);
    }, 500);
    return () => clearInterval(cursorInterval);
  }, []);

  // Function to render text with highlighting for the validation key
  const renderFormattedText = () => {
    const lines = displayedText.split('\n');
    return lines.map((line, i) => {
      const isValidationLine = line.includes('VALIDATION:   KEY #0105');
      
      return (
        <div key={i} className={`min-h-[1.2em] ${isValidationLine ? 'text-white font-bold drop-shadow-[0_0_8px_rgba(255,255,255,0.8)] animate-pulse' : ''}`}>
          {line}
          {i === lines.length - 1 && cursorVisible && (
            <span className="inline-block w-2 h-4 bg-cyan-400 ml-1 align-middle" />
          )}
        </div>
      );
    });
  };

  return (
    <div 
      ref={containerRef}
      className="w-full max-w-lg h-[80vh] overflow-y-auto overflow-x-hidden p-4 font-mono text-xs md:text-sm leading-relaxed scroll-smooth"
    >
      <div className="text-cyan-300 drop-shadow-[0_0_5px_rgba(0,240,255,0.4)]">
        {renderFormattedText()}
      </div>
      
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_50%,rgba(0,240,255,0.03)_0%,transparent_100%)]" />
      
      <style>{`
        ::-webkit-scrollbar { display: none; }
        .scroll-smooth { scroll-behavior: smooth; }
      `}</style>
    </div>
  );
};

export default TerminalOutput;
