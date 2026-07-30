import { motion, useScroll, useTransform } from 'motion/react';
import { useRef } from 'react';
import { TextReveal, FillText } from './AnimationPrimitives';

const phases = [
  {
    phase: 'Phase 01',
    title: 'Site Acquisition & Planning',
    descHighlighted: 'Securing prime locations',
    descRest: ' and completing architectural blueprints with world-class design firms.',
    year: '2022',
  },
  {
    phase: 'Phase 02',
    title: 'Foundation & Structure',
    descHighlighted: 'Groundbreaking and core structural development',
    descRest: ' using advanced engineering and premium materials.',
    year: '2023',
  },
  {
    phase: 'Phase 03',
    title: 'Interior & Exterior Finish',
    descHighlighted: 'Premium fittings, bespoke facades,',
    descRest: ' and curated landscaping — every surface considered.',
    year: '2024',
  },
  {
    phase: 'Phase 04',
    title: 'Handover & Occupancy',
    descHighlighted: 'Final quality inspections',
    descRest: ' and a seamless handover experience for every resident.',
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
  const x = useTransform(scrollYProgress, [0, 1], [-40, 0]);
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
        <div className="font-sans text-xs font-bold tracking-tight text-gray-400 mb-1">{phase.phase}</div>
        <div className="font-heading font-extrabold text-2xl text-black/15 tracking-tight">{phase.year}</div>
      </div>

      {/* Center: dot + line */}
      <div className="flex flex-col items-center pt-2">
        <motion.div style={{ scale: dotScale }} className="w-4 h-4 rounded-full bg-black border-4 border-[#f8f8f6] shrink-0 origin-center" />
        {index < phases.length - 1 && (
          <div className="relative mt-3 w-px bg-gray-200 flex-1" style={{ minHeight: 80 }}>
            <motion.div className="absolute top-0 left-0 w-full bg-black origin-top" style={{ height: '100%', scaleY: lineW as any }} />
          </div>
        )}
      </div>

      {/* Right: content */}
      <div className="pb-20">
        <div className="overflow-hidden mb-3">
          <motion.h3
            initial={{ y: '110%' }}
            whileInView={{ y: '0%' }}
            viewport={{ once: false, margin: '-60px' }}
            transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1], delay: index * 0.04 }}
            className="font-heading font-bold text-2xl md:text-3xl text-black"
          >
            {phase.title}
          </motion.h3>
        </div>
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: '-60px' }}
          transition={{ duration: 0.8, delay: 0.12 + index * 0.04 }}
          className="font-sans text-lg font-medium tracking-tight text-gray-500 max-w-md leading-relaxed"
        >
          <span className="font-bold text-black">{phase.descHighlighted}</span>
          {phase.descRest}
        </motion.p>
      </div>
    </motion.div>
  );
}

export default function Timeline() {
  return (
    <section className="py-40 bg-[#f8f8f6] relative z-10">
      <div className="max-w-5xl mx-auto px-6">
        {/* Section header */}
        <div className="mb-24">
          <FillText fillStart={0.1} fillEnd={0.6}>
            <h2 className="font-heading font-bold text-[clamp(2.8rem,4.5vw,5.5rem)] leading-[1.05] tracking-tight">
              How We
            </h2>
          </FillText>
          <TextReveal delay={0.07} once={false}>
            <h2 className="font-heading font-normal text-[clamp(2.8rem,4.5vw,5.5rem)] text-black/30 leading-[1.05] tracking-tight">
              Build.
            </h2>
          </TextReveal>
        </div>

        <div>
          {phases.map((phase, i) => (
            <PhaseRow key={i} phase={phase} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}