import { motion, AnimatePresence } from 'motion/react';
import { useEffect, useState } from 'react';
import { Home } from 'lucide-react';

export default function Loader({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const duration = 2000; 
    const interval = 20; 
    const steps = duration / interval;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const newProgress = Math.min(100, Math.floor(easeOutExpo(currentStep / steps) * 100));
      setProgress(newProgress);
      
      if (currentStep >= steps) {
        clearInterval(timer);
        setTimeout(() => {
          setIsVisible(false);
          setTimeout(onComplete, 600);
        }, 300);
      }
    }, interval);

    return () => clearInterval(timer);
  }, [onComplete]);

  function easeOutExpo(x: number): number {
    return x === 1 ? 1 : 1 - Math.pow(2, -10 * x);
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white text-black"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col items-center gap-6"
          >
            <Home className="w-12 h-12 text-black stroke-[1.5]" />
            <div className="flex flex-col items-center">
              <span className="font-heading font-bold text-7xl md:text-9xl tracking-tighter">
                {progress}%
              </span>
              <span className="font-sans text-sm font-medium tracking-[0.2em] uppercase text-gray-500 mt-4">
                Loading
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
