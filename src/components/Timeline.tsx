import { motion, useScroll, useTransform } from 'motion/react';
import { useRef } from 'react';

const phases = [
  {
    phase: 'Phase 01',
    title: 'Site Acquisition & Planning',
    desc: 'Securing prime locations and completing architectural blueprints with world-class design firms.',
    year: '2022',
  },
  {
    phase: 'Phase 02',
    title: 'Foundation & Structure',
    desc: 'Groundbreaking and core structural development using advanced engineering and premium materials.',
    year: '2023',
  },
  {
    phase: 'Phase 03',
    title: 'Interior & Exterior Finish',
    desc: 'Premium fittings, bespoke facades, and curated landscaping — every surface considered.',
    year: '2024',
  },
  {
    phase: 'Phase 04',
    title: 'Handover & Occupancy',
    desc: 'Final quality inspections and a seamless handover experience for every resident.',
    year: '2025',
  },
];

function PhaseRow({ phase, index }: { phase: typeof phases[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 0.85', 'start 0.35'],
  });

  const opacity = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const x = useTransform(scrollYProgress, [0, 1], [-60, 0]);
  const lineW = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);
  const dotScale = useTransform(scrollYProgress, [0, 0.5, 1], [0, 0, 1]);

  return (
    <motion.div
      ref={ref}
      style={{ opacity, x }}
      className="grid grid-cols-[1fr_auto_2fr] md:grid-cols-[200px_auto_1fr] gap-x-8 md:gap-x-12 items-start"
    >
      {/* Left: phase label + year */}
      <div className="text-right pt-1">
        <div className="font-sans text-xs font-bold tracking-[0.2em] uppercase text-gray-400 mb-1">
          {phase.phase}
        </div>
        <div className="font-heading font-bold text-2xl text-black/20">{phase.year}</div>
      </div>

      {/* Center: timeline dot + line */}
      <div className="flex flex-col items-center pt-2">
        <motion.div
          style={{ scale: dotScale }}
          className="w-4 h-4 rounded-full bg-black border-4 border-[#f8f8f6] shrink-0 origin-center"
        />
        {index < phases.length - 1 && (
          <div className="relative mt-3 w-px bg-gray-200 flex-1" style={{ minHeight: 80 }}>
            <motion.div
              className="absolute top-0 left-0 w-full bg-black origin-top"
              style={{ height: '100%', scaleY: lineW as any }}
            />
          </div>
        )}
      </div>

      {/* Right: content */}
      <div className="pb-20">
        <div className="overflow-hidden mb-3">
          <motion.h3
            initial={{ y: '110%' }}
            whileInView={{ y: '0%' }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1], delay: index * 0.05 }}
            className="font-heading font-bold text-2xl md:text-3xl text-black"
          >
            {phase.title}
          </motion.h3>
        </div>
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.8, delay: 0.15 + index * 0.05 }}
          className="font-sans text-base font-medium text-gray-500 max-w-md leading-relaxed"
        >
          {phase.desc}
        </motion.p>
      </div>
    </motion.div>
  );
}

export default function Timeline() {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <section className="py-40 bg-[#f8f8f6] relative z-10" ref={containerRef}>
      <div className="max-w-5xl mx-auto px-6">
        {/* Section header */}
        <div className="mb-24">
          <div className="overflow-hidden">
            <motion.h2
              initial={{ opacity: 0, y: 60, filter: 'blur(8px)' }}
              whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="font-heading font-bold text-[clamp(2.8rem,4.2vw,5rem)] text-black leading-[1.02] whitespace-pre-line"
            >
              How We{'\n'}Build
            </motion.h2>
          </div>
        </div>

        {/* Phases */}
        <div>
          {phases.map((phase, i) => (
            <PhaseRow key={i} phase={phase} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
