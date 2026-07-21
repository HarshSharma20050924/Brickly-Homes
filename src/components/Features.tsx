import { motion, useScroll, useTransform } from 'motion/react';
import { useRef } from 'react';
import { Home, ShieldCheck, MapPin, Building2, Trees, Car } from 'lucide-react';

const features = [
  { icon: MapPin, label: 'Prime Locations', desc: 'Strategically situated in the heart of the city with unmatched connectivity.' },
  { icon: Building2, label: 'Modern Design', desc: 'Contemporary architecture with premium finishes that stand the test of time.' },
  { icon: Trees, label: 'Green Spaces', desc: 'Eco-friendly landscaping, parks, and gardens woven into every development.' },
  { icon: Home, label: 'Smart Homes', desc: 'Integrated automation and intelligent systems for seamless modern living.' },
  { icon: ShieldCheck, label: '24/7 Security', desc: 'Advanced surveillance, biometric access, and round-the-clock security teams.' },
  { icon: Car, label: 'Ample Parking', desc: 'Spacious multi-level parking with EV charging infrastructure built in.' },
];

function FeatureCard({ item, index }: { item: typeof features[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 0.9', 'start 0.4'],
  });
  const y = useTransform(scrollYProgress, [0, 1], [60, 0]);
  const opacity = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <motion.div
      ref={ref}
      style={{ y, opacity }}
      className="group relative bg-white p-8 rounded-2xl border border-gray-100 hover:border-black/10 hover:shadow-xl transition-all duration-500 cursor-default overflow-hidden"
    >
      {/* Animated background accent */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Icon */}
      <div className="relative w-14 h-14 rounded-xl bg-gray-50 group-hover:bg-black flex items-center justify-center mb-8 transition-colors duration-400">
        <item.icon className="w-6 h-6 stroke-[1.5] text-black group-hover:text-white transition-colors duration-400" />
      </div>

      {/* Number */}
      <div className="absolute top-8 right-8 font-heading font-bold text-5xl text-gray-50 group-hover:text-gray-100 transition-colors duration-400 leading-none select-none">
        {String(index + 1).padStart(2, '0')}
      </div>

      <h3 className="relative font-heading font-bold text-xl text-black mb-3">{item.label}</h3>
      <p className="relative font-sans text-base font-medium text-gray-500 leading-relaxed">{item.desc}</p>
    </motion.div>
  );
}

export default function Features() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'start 0.1'],
  });

  const lineScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section className="py-40 bg-[#f8f8f6] relative z-10 overflow-hidden" ref={containerRef}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-24 grid lg:grid-cols-2 gap-10 items-end">
          <div>
            <div className="overflow-hidden">
              <motion.h2
                initial={{ opacity: 0, y: 60, filter: 'blur(8px)' }}
                whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                viewport={{ once: false, amount: 0.2 }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="font-heading font-bold text-[clamp(2.8rem,4.2vw,5rem)] text-black leading-[1.02] whitespace-pre-line"
              >
                World-Class{'\n'}Amenities
              </motion.h2>
            </div>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="font-sans text-lg text-gray-500 font-medium max-w-md"
          >
            Every detail of our developments is crafted with residents in mind — because the finest
            quality of life is built into the architecture itself.
          </motion.p>
        </div>

        {/* Animated separator */}
        <div className="relative h-px bg-gray-200 mb-16 overflow-hidden">
          <motion.div
            className="absolute inset-0 bg-black origin-left"
            style={{ scaleX: lineScale }}
          />
        </div>

        {/* Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {features.map((item, index) => (
            <FeatureCard key={index} item={item} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
