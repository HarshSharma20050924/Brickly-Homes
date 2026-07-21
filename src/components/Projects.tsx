import { motion, useScroll, useTransform } from 'motion/react';
import { useRef } from 'react';

// Real architecture home images
const archImages = [
  'https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=2071&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2940&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2070&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1600607686527-6fb886090705?q=80&w=2000&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?q=80&w=2070&auto=format&fit=crop',
];

const archProjects = [
  {
    id: 1,
    name: 'Skyview Heights',
    details: 'A sustainable oasis in the heart of downtown. Platinum LEED certified architecture that breathes with the city.',
    image: archImages[0],
  },
  {
    id: 2,
    name: 'The Pinnacle Tower',
    details: 'Harnessing solar energy with integrated kinetic glass panels. Future-ready living spaces for the visionary.',
    image: archImages[1],
  },
  {
    id: 3,
    name: 'Horizon Residences',
    details: 'Zero-emission smart homes nestled in lush private gardens. Minimalist design meeting profound ecological consciousness.',
    image: archImages[2],
  },
];

// Pre-defined scroll ranges for each project (avoids hooks in loops)
const PROJECT_RANGES = [
  { start: 0.35, enter: 0.41, hold: 0.49, exit: 0.53, gone: 0.57 },
  { start: 0.55, enter: 0.61, hold: 0.69, exit: 0.73, gone: 0.77 },
  { start: 0.75, enter: 0.81, hold: 0.89, exit: 0.93, gone: 0.97 },
];

function ProjectSlide({
  proj,
  idx,
  scrollYProgress,
}: {
  proj: (typeof archProjects)[0];
  idx: number;
  scrollYProgress: ReturnType<typeof useScroll>['scrollYProgress'];
}) {
  const r = PROJECT_RANGES[idx];
  const opacity   = useTransform(scrollYProgress, [r.start, r.enter, r.hold, r.exit, r.gone], [0, 1, 1, 1, 0]);
  const scale     = useTransform(scrollYProgress, [r.start, r.enter, r.hold, r.gone], [0.72, 1, 1, 1.06]);
  const rotate    = useTransform(scrollYProgress, [r.start, r.enter, r.hold, r.gone], [-8, 0, 0, 3]);
  const textOpacity = useTransform(scrollYProgress, [r.enter, r.enter + 0.04, r.hold, r.exit], [0, 1, 1, 0]);

  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center"
      style={{ opacity }}
    >
      <div className="flex w-full max-w-6xl mx-auto px-12 xl:px-20 items-center gap-16">

        {/* Circular stacked image */}
        <motion.div className="relative shrink-0" style={{ scale, rotate }}>
          {/* Back card (offset + grayscale) */}
          <div
            className="absolute rounded-[2.5rem] overflow-hidden"
            style={{
              width: 'min(36vw, 400px)',
              height: 'min(36vw, 400px)',
              top: -16,
              left: 16,
              backgroundImage: `url(${archImages[(idx + 1) % archImages.length]})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              filter: 'grayscale(70%) brightness(0.55)',
              boxShadow: '0 8px 40px rgba(0,0,0,0.12)',
            }}
          />
          {/* Front card */}
          <div
            className="relative rounded-[2.5rem] overflow-hidden"
            style={{
              width: 'min(36vw, 400px)',
              height: 'min(36vw, 400px)',
              boxShadow: '0 24px 60px rgba(0,0,0,0.18)',
            }}
          >
            <img src={proj.image} alt={proj.name} className="w-full h-full object-cover" />
          </div>
          {/* Number badge */}
          <div className="absolute -bottom-5 -right-5 w-14 h-14 rounded-full bg-black flex items-center justify-center shadow-xl z-10">
            <span className="font-mono text-white text-xs font-bold">{String(idx + 1).padStart(2, '0')}</span>
          </div>
        </motion.div>

        {/* Text */}
        <motion.div className="flex-1" style={{ opacity: textOpacity }}>
          <p className="font-sans text-[10px] font-bold tracking-[0.3em] uppercase text-gray-300 mb-4">Featured Property</p>
          <h3 className="font-heading font-bold text-5xl md:text-6xl text-black leading-tight mb-6">{proj.name}</h3>
          <p className="font-sans text-lg text-gray-500 leading-relaxed max-w-sm">{proj.details}</p>
          <div className="mt-8 flex items-center gap-4">
            <div className="h-px w-12 bg-black" />
            <span className="font-sans text-xs font-bold tracking-widest uppercase text-black/35">Brickly Homes</span>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default function Projects() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // Intro word animation
  const susOpacity = useTransform(scrollYProgress, [0.03, 0.12, 0.28, 0.35], [0, 1, 1, 0]);
  const susY       = useTransform(scrollYProgress, [0.03, 0.35], [40, -40]);

  return (
    <section ref={containerRef} id="projects" className="relative bg-[#fcfcfc]" style={{ height: '520vh' }}>
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center">

        {/* ─── ARCHITECTURE INTRO WORD ─── */}
        <motion.div
          style={{ opacity: susOpacity, y: susY }}
          className="absolute inset-0 flex flex-col items-center justify-center text-center z-0 pointer-events-none"
        >
          <p className="font-sans text-[10px] tracking-[0.4em] text-black/25 uppercase mb-6">
            Brickly Homes · 100% Future-Ready
          </p>
          <h2 className="font-heading font-bold text-[13vw] tracking-tighter text-black lowercase leading-none">
            architecture
          </h2>
          <p className="font-sans text-sm tracking-wide text-gray-400 mt-6 max-w-xs">
            Sustainable materials &amp; precision engineering
          </p>
        </motion.div>

        {/* ─── PROJECT SLIDES ─── */}
        {archProjects.map((proj, i) => (
          <ProjectSlide key={proj.id} proj={proj} idx={i} scrollYProgress={scrollYProgress} />
        ))}

      </div>
    </section>
  );
}
