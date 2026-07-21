import { motion, useScroll, useTransform } from 'motion/react';
import { useRef } from 'react';

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
      {/* Animated vertical line */}
      <div className="absolute left-12 top-0 bottom-0 w-px bg-gray-200 hidden lg:block">
        <motion.div
          className="absolute top-0 left-0 w-full bg-black origin-top"
          style={{ scaleY: lineScale, height: '100%' }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-16">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          {/* Left – animated headline */}
          <div>
            <div className="mb-6 flex items-start">
              <motion.h2
                initial={{ opacity: 0, y: 60, filter: 'blur(8px)' }}
                whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                viewport={{ once: false, amount: 0.2 }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="font-heading font-bold text-[clamp(2.8rem,4.2vw,5rem)] text-black leading-[1.02] whitespace-pre-line"
              >
                About{'\n'}Brickly
              </motion.h2>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-5 font-sans text-gray-500 text-lg font-medium max-w-md"
            >
              <p>
                We are a premier real estate developer dedicated to delivering high-end residential
                and commercial properties that redefine the modern skyline.
              </p>
              <p>
                Our developments combine innovative architectural design with prime locations,
                ensuring unmatched value, sustainability, and exceptional quality of life.
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
                  transition={{ duration: 0.7, delay: 0.4 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                >
                  <div className="font-heading font-bold text-4xl text-black mb-1">{s.value}</div>
                  <div className="font-sans text-xs font-semibold tracking-widest uppercase text-gray-400">
                    {s.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right – parallax image */}
          <div className="relative h-[680px] overflow-hidden rounded-2xl" ref={imgRef}>
            <motion.div
              style={{ y: imgY }}
              className="absolute inset-0 -top-12 -bottom-12"
            >
              <img
                src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2075&auto=format&fit=crop"
                alt="Modern Real Estate Development"
                className="w-full h-full object-cover"
              />
            </motion.div>

            {/* Overlay label */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="absolute bottom-8 left-8 bg-white/90 backdrop-blur-md rounded-xl px-6 py-4"
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
