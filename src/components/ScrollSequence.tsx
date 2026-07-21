import { motion, useScroll, useTransform, useSpring } from 'motion/react';
import { useRef, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { projects } from '../data/projects';

export default function ScrollSequence() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 250,
    damping: 35,
    mass: 1,
    restDelta: 0.001
  });

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  
  const fgWidth = isMobile ? 80 : 45; // vw - Size of the center focus box
  const bgWidth = isMobile ? 40 : 20; // vw - Size of the side images
  const stride = fgWidth; // Both strips move at the same speed

  const n = projects.length;

  // Create a staircase easing array to create a "locked" feeling.
  const { inputs, outputs } = useMemo(() => {
    const lockRatio = 0.4; // 40% of the scroll space is locked
    const ins = [];
    const outs = [];
    for (let i = 0; i < n; i++) {
      const center = i / (n - 1);
      const halfDist = 1 / (n - 1) / 2;
      const lockHalf = halfDist * lockRatio;
      
      if (i === 0) {
        ins.push(0);                 outs.push(0);
        ins.push(center + lockHalf); outs.push(center);
      } else if (i === n - 1) {
        ins.push(center - lockHalf); outs.push(center);
        ins.push(1);                 outs.push(1);
      } else {
        ins.push(center - lockHalf); outs.push(center);
        ins.push(center + lockHalf); outs.push(center);
      }
    }
    return { inputs: ins, outputs: outs };
  }, [n]);

  const lockedProgress = useTransform(smoothProgress, inputs, outputs);

  // FG Strip Calculations
  const fgEndX = `-${(n - 1) * stride}vw`;
  const fgX = useTransform(lockedProgress, [0, 1], ['0vw', fgEndX]);

  // BG Strip Calculations
  const bgStartXNum = -(bgWidth / 2);
  const bgEndXNum = bgStartXNum - (n - 1) * stride;
  const bgX = useTransform(lockedProgress, [0, 1], [`${bgStartXNum}vw`, `${bgEndXNum}vw`]);

  const titleOpacity = useTransform(smoothProgress, [0, 0.08, 0.15], [1, 1, 0]);
  const titleX = useTransform(smoothProgress, [0, 0.15], [0, -50]);

  return (
    <section
      ref={containerRef}
      className="relative bg-[#fcfcfc]"
      style={{ height: `${n * 100}vh` }}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center pointer-events-none">

        {/* 1. Background Strip (Small, B&W, Spaced out) */}
        <motion.div
          className="absolute top-1/2 left-[50vw] -translate-y-1/2 flex items-center z-0"
          style={{ x: bgX, gap: `${stride - bgWidth}vw` }}
        >
          {projects.map((proj) => (
            <div
              key={`bg-${proj.id}`}
              className="shrink-0 relative overflow-hidden rounded-xl grayscale opacity-30 transition-transform duration-700"
              style={{ width: `${bgWidth}vw`, height: isMobile ? '30vh' : '45vh' }}
            >
              <img
                src={proj.gallery[0]}
                alt={proj.label}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </motion.div>


        {/* 2. Foreground Mask (The Center Focus Box) */}
        <div 
          className="relative z-10 overflow-hidden shadow-2xl border border-black/8 bg-[#fcfcfc] pointer-events-auto"
          style={{ width: `${fgWidth}vw`, height: isMobile ? '60vh' : '75vh' }}
        >
          {/* Foreground Strip (Large, Colored, Touching) */}
          <motion.div
            className="absolute top-0 left-0 h-full flex"
            style={{ x: fgX }}
          >
            {projects.map((proj, i) => (
              <div
                key={`fg-${proj.id}`}
                className="shrink-0 h-full relative group"
                style={{ width: `${fgWidth}vw` }}
              >
                <img
                  src={proj.gallery[0]}
                  alt={proj.label}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
                
                <div className="absolute bottom-6 left-6 right-6 flex flex-col justify-end z-10">
                  <span className="font-sans text-xs font-bold tracking-[0.2em] uppercase text-white/80 drop-shadow">
                    {String(i + 1).padStart(2, '0')} · {proj.location}
                  </span>
                  <div className="font-heading font-bold text-2xl md:text-4xl text-white mt-1 mb-4 drop-shadow-lg">{proj.label}</div>
                  
                  <Link
                    to={`/project/${proj.id}`}
                    className="inline-flex w-fit items-center justify-center px-6 py-2.5 bg-white text-black font-sans text-xs tracking-widest font-bold uppercase rounded hover:bg-gray-200 transition-colors pointer-events-auto"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* 3. Fixed Title Text */}
        <motion.div 
          className="absolute left-8 md:left-[5vw] top-1/2 -translate-y-1/2 z-20 pointer-events-none"
          style={{ opacity: titleOpacity, x: titleX }}
        >
          <h2 className="text-black flex flex-col">
            <span className="font-sans text-[10px] tracking-[0.28em] uppercase font-bold mb-2 text-gray-400">
              Brickly Homes · Portfolio
            </span>
            <span className="font-heading font-bold text-5xl md:text-[6vw] tracking-tight leading-none">
              Unparalleled
            </span>
            <span className="font-heading font-bold text-5xl md:text-[6vw] tracking-tight leading-none text-gray-300">
              masterpieces.
            </span>
          </h2>
        </motion.div>

      </div>
    </section>
  );
}
