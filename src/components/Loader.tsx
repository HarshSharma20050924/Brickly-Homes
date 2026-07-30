import { motion, AnimatePresence } from 'motion/react';
import { useEffect, useState, useRef } from 'react';

export default function Loader({ onComplete }: { onComplete: () => void }) {
  const [isVisible, setIsVisible] = useState(true);
  const numberRef = useRef<HTMLSpanElement | null>(null);
  const barRef = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const DURATION = 1600; // ms - snappier response

  useEffect(() => {
    let lastValue = -1;

    const animate = (timestamp: number) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const elapsed = timestamp - startTimeRef.current;
      const rawProgress = Math.min(1, elapsed / DURATION);
      
      // Smooth power curve ease-out for fast initial response and ultra-smooth landing
      const easedProgress = 1 - Math.pow(1 - rawProgress, 3);
      const displayValue = Math.min(100, Math.round(easedProgress * 100));

      if (displayValue !== lastValue) {
        lastValue = displayValue;
        if (numberRef.current) {
          numberRef.current.textContent = String(displayValue);
        }
        if (barRef.current) {
          barRef.current.style.transform = `scaleX(${easedProgress})`;
        }
      }

      if (rawProgress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      } else {
        if (numberRef.current) numberRef.current.textContent = '100';
        if (barRef.current) barRef.current.style.transform = 'scaleX(1)';
        
        setTimeout(() => {
          setIsVisible(false);
          setTimeout(onComplete, 500);
        }, 200);
      }
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white text-black overflow-hidden select-none"
        >
          {/* Background grid lines */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage:
                'linear-gradient(rgba(0,0,0,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.04) 1px, transparent 1px)',
              backgroundSize: '60px 60px',
            }}
          />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center gap-8 relative z-10"
          >
            {/* Brand mark */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-black rounded-sm flex items-center justify-center">
                <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 stroke-white" strokeWidth={2}>
                  <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                  <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
              </div>
              <span className="font-heading font-bold text-sm tracking-[0.2em] text-black">
                Brickly Homes
              </span>
            </div>

            {/* Giant percentage — driven directly via DOM Ref to avoid React state re-render lag */}
            <div className="relative">
              <span
                ref={numberRef}
                className="font-heading font-black text-[clamp(6rem,20vw,14rem)] leading-none tracking-tighter text-black tabular-nums block min-w-[1.8em] text-center"
                style={{ fontVariantNumeric: 'tabular-nums' }}
              >
                0
              </span>
              <span className="absolute top-4 -right-10 font-heading font-bold text-4xl text-black/30">
                %
              </span>
            </div>

            {/* Progress bar */}
            <div className="w-64 h-[2px] bg-black/10 rounded-full overflow-hidden">
              <div
                ref={barRef}
                className="h-full bg-black rounded-full w-full will-change-transform"
                style={{ transform: 'scaleX(0)', transformOrigin: 'left' }}
              />
            </div>

            <span className="font-sans text-[10px] font-bold tracking-[0.3em] text-gray-400 uppercase">
              Loading experience
            </span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
