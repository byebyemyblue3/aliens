
import React, { useState, useEffect, useRef } from 'react';
import { sounds } from './SoundManager';

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

  VALIDATION:   KEY #1423

===========================================
> OVERRIDE COMPLETE. BON VOYAGE.`;

const SCRAMBLE_CHARS = '0123456789ABCDEF!@#$%^&*()_+?><';

const ScrambledData: React.FC<{ value: string }> = ({ value }) => {
  const [display, setDisplay] = useState('');
  const [isLocked, setIsLocked] = useState(false);
  
  useEffect(() => {
    let iteration = 0;
    const interval = setInterval(() => {
      setDisplay(
        value.split('')
          .map((char, index) => {
            if (index < iteration) return value[index];
            return SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
          })
          .join('')
      );
      
      iteration += 1 / 4;
      if (iteration >= value.length) {
        clearInterval(interval);
        setIsLocked(true);
      }
    }, 25);
    
    return () => clearInterval(interval);
  }, [value]);

  return (
    <span className={`${isLocked ? 'text-cyan-300 drop-shadow-[0_0_8px_rgba(0,240,255,0.8)]' : 'text-cyan-600/60 font-mono'}`}>
      {display}
    </span>
  );
};

const TerminalOutput: React.FC = () => {
  const [displayedText, setDisplayedText] = useState('');
  const [cursorVisible, setCursorVisible] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const alertedRef = useRef(false);

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index < OVERRIDE_TEXT.length) {
        const char = OVERRIDE_TEXT.charAt(index);
        setDisplayedText(prev => prev + char);
        
        const currentText = OVERRIDE_TEXT.slice(0, index + 1);
        if (currentText.includes('VALIDATION:') && !alertedRef.current) {
          sounds.playAlert();
          alertedRef.current = true;
        }

        if (char !== ' ' && char !== '\n') {
          sounds.playType();
        }
        
        index++;
        if (containerRef.current) {
          containerRef.current.scrollTop = containerRef.current.scrollHeight;
        }
      } else {
        clearInterval(interval);
      }
    }, 18);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setCursorVisible(v => !v);
    }, 500);
    return () => clearInterval(cursorInterval);
  }, []);

  const processLine = (line: string) => {
    const dataRegex = /(SOL-3|163493y|0\.3c|5\.2%|#1423|v9\.4\.1-OMEGA)/g;
    const parts = line.split(dataRegex);
    
    return parts.map((part, i) => {
      if (part.match(dataRegex)) {
        return <ScrambledData key={i} value={part} />;
      }
      return part;
    });
  };

  const renderFormattedText = () => {
    const lines = displayedText.split('\n');
    return lines.map((line, i) => {
      const isValidationLine = line.includes('VALIDATION:');
      const isDivider = line.includes('====');

      if (isValidationLine) {
        return (
          <div key={i} className="relative my-8 py-6 flex flex-col items-center justify-center">
            {/* Minimalist Tech Brackets */}
            <div className="absolute top-0 left-0 w-8 h-px bg-gradient-to-r from-cyan-400 to-transparent" />
            <div className="absolute top-0 right-0 w-8 h-px bg-gradient-to-l from-cyan-400 to-transparent" />
            <div className="absolute bottom-0 left-0 w-8 h-px bg-gradient-to-r from-cyan-400 to-transparent" />
            <div className="absolute bottom-0 right-0 w-8 h-px bg-gradient-to-l from-cyan-400 to-transparent" />
            <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-cyan-400 via-transparent to-cyan-400 opacity-20" />
            <div className="absolute right-0 top-0 bottom-0 w-px bg-gradient-to-b from-cyan-400 via-transparent to-cyan-400 opacity-20" />

            <div className="relative text-cyan-50 font-light tracking-[0.4em] text-xs md:text-sm uppercase flex items-center gap-4">
              <span className="text-[10px] opacity-40">IDENT:</span>
              <span>{line.includes('KEY') ? (
                  <>
                    VALIDATION <span className="mx-2 opacity-30">|</span> KEY <ScrambledData value="#1423" />
                  </>
                ) : (
                  line
                )}</span>
            </div>
            
            {/* Subtle high-tech scanner line passing through */}
            <div className="absolute inset-x-0 h-px bg-cyan-400/20 shadow-[0_0_15px_#00f0ff] animate-[shimmer_2s_ease-in-out_infinite]" />
          </div>
        );
      }

      return (
        <div 
          key={i} 
          className={`min-h-[1.4em] transition-opacity duration-300 ${isDivider ? 'opacity-20 border-b border-cyan-900 my-2' : 'text-cyan-400/80'}`}
        >
          {isDivider ? null : processLine(line)}
          {i === lines.length - 1 && cursorVisible && (
            <span className="inline-block w-1.5 h-3.5 bg-cyan-400 ml-1 align-middle opacity-80" />
          )}
        </div>
      );
    });
  };

  return (
    <div 
      ref={containerRef}
      className="w-full max-w-lg h-[85vh] overflow-y-auto overflow-x-hidden p-8 font-mono text-[10px] md:text-xs leading-relaxed scroll-smooth bg-black/90 border border-white/5 rounded-3xl backdrop-blur-2xl relative shadow-2xl"
    >
      {/* HUD Header */}
      <div className="sticky top-0 z-10 flex justify-between items-center mb-8 border-b border-white/10 pb-4 text-[7px] tracking-[0.3em] text-cyan-400/40 uppercase">
        <div className="flex items-center gap-2">
          <div className="w-1 h-1 bg-cyan-500 rounded-full animate-pulse" />
          Neural Link: Active
        </div>
        <div>Stream_0939</div>
      </div>

      <div className="relative z-0">
        {renderFormattedText()}
      </div>
      
      {/* Technical Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-5">
        <div className="absolute top-1/4 left-0 w-full h-px bg-cyan-400" />
        <div className="absolute top-2/4 left-0 w-full h-px bg-cyan-400" />
        <div className="absolute top-3/4 left-0 w-full h-px bg-cyan-400" />
      </div>
      
      <style>{`
        ::-webkit-scrollbar { display: none; }
        .scroll-smooth { scroll-behavior: smooth; }
        @keyframes shimmer {
          0% { top: 0%; opacity: 0; }
          50% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default TerminalOutput;
