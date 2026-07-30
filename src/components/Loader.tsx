import { motion, AnimatePresence } from 'motion/react';
import { useEffect, useState, useRef } from 'react';
import { startPreloading } from '../utils/frameCache';

export default function Loader({ onComplete }: { onComplete: () => void }) {
  const [isVisible, setIsVisible] = useState(true);
  const numberRef = useRef<HTMLSpanElement | null>(null);
  const barRef = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef<number | null>(null);

  const realPctRef = useRef(0);
  const smoothPctRef = useRef(0);
  const currentPctRef = useRef(0);
  const isKeyframesDoneRef = useRef(false);

  useEffect(() => {
    let lastValue = -1;

    // Start real preloading of keyframes
    startPreloading(
      (pct) => {
        realPctRef.current = pct;
      },
      () => {
        isKeyframesDoneRef.current = true;
        realPctRef.current = 100;
      }
    );

    const animate = () => {
      // Smooth baseline progression up to 85% so it never stalls at 0%
      if (smoothPctRef.current < 85 && !isKeyframesDoneRef.current) {
        smoothPctRef.current += 0.8;
      } else if (isKeyframesDoneRef.current) {
        smoothPctRef.current = 100;
      }

      const targetPct = Math.max(smoothPctRef.current, realPctRef.current);
      const diff = targetPct - currentPctRef.current;

      if (Math.abs(diff) > 0.05) {
        currentPctRef.current += diff * 0.15;
      } else {
        currentPctRef.current = targetPct;
      }

      const displayValue = Math.min(100, Math.round(currentPctRef.current));

      if (displayValue !== lastValue) {
        lastValue = displayValue;
        if (numberRef.current) {
          numberRef.current.textContent = String(displayValue);
        }
        if (barRef.current) {
          barRef.current.style.transform = `scaleX(${displayValue / 100})`;
        }
      }

      if (displayValue >= 100 && (isKeyframesDoneRef.current || currentPctRef.current >= 99.5)) {
        if (numberRef.current) numberRef.current.textContent = '100';
        if (barRef.current) barRef.current.style.transform = 'scaleX(1)';

        setTimeout(() => {
          setIsVisible(false);
          setTimeout(onComplete, 400);
        }, 200);
      } else {
        rafRef.current = requestAnimationFrame(animate);
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
          {/* Background subtle architectural grid lines */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage:
                'linear-gradient(rgba(0,0,0,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.03) 1px, transparent 1px)',
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
              <div className="w-9 h-9 bg-black rounded-md flex items-center justify-center shadow-lg">
                <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 stroke-white" strokeWidth={2}>
                  <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                  <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
              </div>
              <span className="font-heading font-bold text-base tracking-[0.22em] text-black uppercase">
                Brickly Homes
              </span>
            </div>

            {/* Percentage Counter */}
            <div className="relative">
              <span
                ref={numberRef}
                className="font-heading font-black text-[clamp(6rem,18vw,13rem)] leading-none tracking-tighter text-black tabular-nums block min-w-[1.8em] text-center select-none"
                style={{ fontVariantNumeric: 'tabular-nums' }}
              >
                0
              </span>
              <span className="absolute top-4 -right-10 font-heading font-bold text-4xl text-black/30">
                %
              </span>
            </div>

            {/* Progress bar */}
            <div className="w-72 h-[3px] bg-black/10 rounded-full overflow-hidden">
              <div
                ref={barRef}
                className="h-full bg-black rounded-full w-full will-change-transform"
                style={{ transform: 'scaleX(0)', transformOrigin: 'left' }}
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="font-sans text-[10px] font-bold tracking-[0.3em] text-gray-400 uppercase">
                LOADING ASSETS
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

