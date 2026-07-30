import { motion, useScroll, useTransform, useMotionTemplate } from 'motion/react';
import { useRef } from 'react';
import { FillText, FillTextInverted, ImageReveal } from './AnimationPrimitives';

const projects = [
  {
    image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=2071&auto=format&fit=crop',
    title: 'Skyview Heights',
    desc: (
      <>
        <span className="font-bold text-black">A sustainable oasis</span> in the heart of downtown. <span className="font-bold text-black">Platinum LEED certified architecture</span> that breathes with the city, featuring sky gardens and natural ventilation.
      </>
    ),
    location: 'Mumbai, 2024',
  },
  {
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2940&auto=format&fit=crop',
    title: 'The Pinnacle Tower',
    desc: (
      <>
        <span className="font-bold text-black">Harnessing solar energy</span> with integrated kinetic glass panels. <span className="font-bold text-black">Future-ready living spaces</span> for the visionary, offering panoramic views of the city skyline.
      </>
    ),
    location: 'Pune, 2023',
  },
  {
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2070&auto=format&fit=crop',
    title: 'Horizon Residences',
    desc: (
      <>
        <span className="font-bold text-black">Zero-emission smart homes</span> nestled in lush private gardens. <span className="font-bold text-black">Minimalist design</span> meeting profound ecological consciousness in every detail.
      </>
    ),
    location: 'Bangalore, 2022',
  },
];

export default function Projects() {
  const introRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress: introScroll } = useScroll({
    target: introRef,
    offset: ['start start', 'end end'],
  });

  const topHalfY = useTransform(introScroll, [0, 1], ['0%', '-100%']);
  const bottomHalfY = useTransform(introScroll, [0, 1], ['0%', '100%']);

  // Arch text stays still, fades slightly as split opens
  const archOpacity = useTransform(introScroll, [0.3, 0.6], [1, 0]);

  return (
    <section id="projects-intro" className="bg-white relative">

      {/* ── Architecture Split Intro ── */}
      <div ref={introRef} className="relative h-[200vh]">
        <div className="sticky top-0 h-screen w-full overflow-hidden bg-black flex items-center justify-center">

          {/* Background Text */}
          <motion.div style={{ opacity: archOpacity }} className="text-center z-0">
            <p className="font-sans text-[11px] tracking-[0.4em] text-white/30 mb-6">
              Brickly Homes · Vision
            </p>
            <motion.h2
              className="font-heading font-bold tracking-tight leading-none lowercase"
              style={{
                fontSize: 'clamp(3rem, 12vw, 15rem)',
                backgroundImage: useMotionTemplate`linear-gradient(to right, white ${useTransform(introScroll, [0, 0.6], [0, 100])}%, rgba(255,255,255,0.15) ${useTransform(introScroll, [0, 0.6], [0, 100])}%)`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                color: 'transparent'
              }}
            >
              architecture
            </motion.h2>
          </motion.div>

          {/* Split image cover */}
          <div className="absolute inset-0 z-10 pointer-events-none flex flex-col">
            <motion.div className="relative overflow-hidden" style={{ flex: '1 0 50%', y: topHalfY }}>
              <img
                src={projects[0].image}
                alt="Architecture"
                className="absolute top-0 left-0 w-full object-cover object-top"
                style={{ height: '200%' }}
              />
            </motion.div>

            <motion.div className="relative overflow-hidden -mt-[1px]" style={{ flex: '1 0 50%', y: bottomHalfY }}>
              <img
                src={projects[0].image}
                alt="Architecture"
                className="absolute bottom-0 left-0 w-full object-cover object-bottom"
                style={{ height: '200%' }}
              />
            </motion.div>
          </div>
        </div>
      </div>

      {/* ── Normal Project Listing Sections ── */}
      <div className="relative z-20 bg-white pt-20 pb-40">
        <div className="max-w-7xl mx-auto px-6 md:px-16 flex flex-col gap-40">
          {projects.map((proj, i) => (
            <div key={i} className="grid md:grid-cols-[1fr_1.2fr] gap-12 md:gap-20 items-center">

              {/* Left text */}
              <div className={`${i % 2 !== 0 ? 'md:order-2' : ''}`}>
                <div className="mb-4">
                  <span className="font-sans text-[11px] font-bold tracking-[0.25em] text-gray-400">
                    {proj.location}
                  </span>
                </div>

                {/* Scroll fill gray to black */}
                <FillText fillStart={0.1} fillEnd={0.6}>
                  <h3 className="font-heading font-bold text-4xl md:text-5xl lg:text-6xl leading-[1.05] tracking-tight mb-6">
                    {proj.title}
                  </h3>
                </FillText>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="font-sans text-xl md:text-2xl font-medium tracking-tight text-gray-400 max-w-md leading-relaxed"
                >
                  {proj.desc}
                </motion.p>
              </div>

              {/* Right image */}
              <div className={`relative h-[600px] rounded-xl overflow-hidden ${i % 2 !== 0 ? 'md:order-1' : ''}`}>
                <ImageReveal
                  src={proj.image}
                  alt={proj.title}
                  direction={i % 2 === 0 ? 'left' : 'right'}
                  className="w-full h-full"
                />
              </div>

            </div>
          ))}
        </div>
      </div>

    </section>
  );
}
