import { motion, useScroll, useTransform } from 'motion/react';
import { useRef } from 'react';
import { TextReveal, ImageReveal, FillText, VideoReveal } from './AnimationPrimitives';

const stats = [
  { value: '12+', label: 'Years Experience' },
  { value: '40+', label: 'Projects Delivered' },
  { value: '2M+', label: 'Sq. Ft. Built' },
];

export default function About() {
  const ref = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start center', 'end center'],
  });

  const imgY = useTransform(scrollYProgress, [0, 1], ['-8%', '8%']);
  const lineScale = useTransform(scrollYProgress, [0.1, 0.6], [0, 1]);

  return (
    <section id="about" className="py-40 bg-[#f8f8f6] relative z-10 overflow-hidden" ref={ref}>
      {/* ── Video with curtain animation before About Us ── */}
      <div className="w-full px-4 lg:px-8 mx-auto mb-40">
        <VideoReveal 
          src="/why-us.mp4" 
          direction="right" 
          className="w-full h-[70vh] md:h-screen rounded-[40px] shadow-2xl" 
        />
      </div>

      {/* Animated vertical line */}
      <div className="absolute left-12 top-0 bottom-0 w-px bg-gray-200 hidden lg:block">
        <motion.div
          className="absolute top-0 left-0 w-full bg-black origin-top"
          style={{ scaleY: lineScale, height: '100%' }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-16">
        <div className="grid lg:grid-cols-2 gap-20 items-center">

          {/* Left – headline + body */}
          <div>
            {/* Mixed-weight heading like the reference */}
            <div className="mb-8">
              <FillText fillStart={0.1} fillEnd={0.6}>
                <h2 className="font-heading font-bold text-[clamp(3rem,5vw,5.5rem)] leading-[1.05] tracking-tight">
                  About
                </h2>
              </FillText>
              <TextReveal delay={0.07} once={false}>
                <h2 className="font-heading font-normal text-[clamp(3rem,5vw,5.5rem)] text-black/30 leading-[1.05] tracking-tight">
                  Brickly.
                </h2>
              </TextReveal>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-6 font-sans text-orange-500 text-xl md:text-2xl font-medium tracking-tight max-w-lg leading-relaxed"
            >
              <p>
                <span className="font-bold text-black">We are a premier real estate developer</span> dedicated to delivering <span className="font-bold text-black">high-end residential and commercial properties</span> that redefine the modern skyline.
              </p>
              <p>
                <span className="font-bold text-black">Our developments combine innovative architectural design</span> with prime locations, <span className="font-bold text-black">ensuring unmatched value</span>, sustainability, and exceptional quality of life.
              </p>
            </motion.div>

            {/* Stats */}
            <div className="mt-16 grid grid-cols-3 gap-8">
              {stats.map((s, i) => (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, delay: 0.3 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                >
                  <div className="font-heading font-extrabold text-4xl text-black mb-1">{s.value}</div>
                  <div className="font-sans text-xs font-semibold tracking-widest text-gray-400">
                    {s.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right – image wipes in from left */}
          <div className="relative h-[680px] overflow-hidden rounded-2xl" ref={imgRef}>
            <motion.div
              style={{ y: imgY }}
              className="absolute inset-0 -top-12 -bottom-12"
            >
              <ImageReveal
                src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2075&auto=format&fit=crop"
                alt="Modern Real Estate Development"
                className="absolute inset-0"
                delay={0.15}
                direction="left"
                once={false}
              />
            </motion.div>

            {/* Overlay label */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="absolute bottom-8 left-8 bg-white/90 backdrop-blur-md rounded-2xl px-6 py-4"
            >
              <div className="font-heading font-bold text-lg text-black">Est. 2012</div>
              <div className="font-sans text-sm text-gray-500 font-medium">Brickly Homes · India</div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
