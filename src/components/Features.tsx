import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'motion/react';
import { useRef, useState, useCallback } from 'react';
import { Home, ShieldCheck, MapPin, Building2, Trees, Car } from 'lucide-react';
import { TextReveal, FillText } from './AnimationPrimitives';

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
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 0.95', 'start 0.4'],
  });

  const y = useTransform(scrollYProgress, [0, 1], [80, 0]);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [0, 1]);
  const rotateX = useTransform(scrollYProgress, [0, 1], [20, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [0.9, 1]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    const dx = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
    const dy = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);
    setTilt({ x: -dy * 8, y: dx * 8 });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setTilt({ x: 0, y: 0 });
    setIsHovered(false);
  }, []);

  return (
    <motion.div
      ref={ref}
      style={{ y, opacity, rotateX, scale, transformPerspective: 900 }}
    >
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onMouseEnter={() => setIsHovered(true)}
        animate={{ rotateX: tilt.x, rotateY: tilt.y, scale: isHovered ? 1.03 : 1 }}
        transition={{ type: 'spring', stiffness: 220, damping: 22 }}
        className="group relative bg-white p-8 rounded-2xl border border-gray-100 cursor-default overflow-hidden"
        style={{
          transformStyle: 'preserve-3d',
          boxShadow: isHovered
            ? '0 24px 60px rgba(0,0,0,0.10), 0 4px 16px rgba(0,0,0,0.06)'
            : '0 1px 4px rgba(0,0,0,0.04)',
          transition: 'box-shadow 0.4s ease',
        }}
      >
        {/* Shimmer */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-500"
          style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0) 50%)',
          }}
        />

        {/* Icon */}
        <div className="relative w-12 h-12 rounded-xl bg-gray-50 group-hover:bg-black flex items-center justify-center mb-7 transition-all duration-400">
          <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-400" style={{ boxShadow: '0 0 20px 6px rgba(0,0,0,0.12)' }} />
          <item.icon className="relative w-5 h-5 stroke-[1.5] text-black group-hover:text-white transition-colors duration-400" />
        </div>

        {/* Big ghost number */}
        <div className="absolute top-6 right-6 font-heading font-extrabold text-5xl text-gray-50 group-hover:text-gray-100 transition-colors duration-400 leading-none select-none">
          {String(index + 1).padStart(2, '0')}
        </div>

        <h3 className="font-heading font-bold text-xl text-black mb-3">{item.label}</h3>
        <p className="font-sans text-[15px] text-gray-500 leading-relaxed">{item.desc}</p>

        <div className="absolute bottom-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </motion.div>
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

  // 3D Carousel logic
  const rotation = useMotionValue(0);
  const springRot = useSpring(rotation, { stiffness: 100, damping: 20 });
  const [isDragging, setIsDragging] = useState(false);

  const handlePan = (e: any, info: any) => {
    rotation.set(rotation.get() + info.delta.x * 0.2);
  };
  const handlePanEnd = (e: any, info: any) => {
    setIsDragging(false);
    const segment = 360 / features.length;
    const current = rotation.get();
    const velocity = info.velocity.x * 0.2;
    const target = current + velocity;
    const snapped = Math.round(target / segment) * segment;
    rotation.set(snapped);
  };

  return (
    <section className="py-40 bg-[#f8f8f6] relative z-10 overflow-hidden" ref={containerRef}>
      <div className="max-w-7xl mx-auto px-6">
        {/* Header — mixed weight like reference */}
        <div className="mb-24 grid lg:grid-cols-2 gap-10 items-end">
          <div>
            <FillText fillStart={0.1} fillEnd={0.6}>
              <h2 className="font-heading font-bold text-[clamp(2.8rem,4.5vw,5.5rem)] leading-[1.05] tracking-tight">
                World-Class
              </h2>
            </FillText>
            <TextReveal delay={0.07} once={false}>
              <h2 className="font-heading font-normal text-[clamp(2.8rem,4.5vw,5.5rem)] text-black/30 leading-[1.05] tracking-tight">
                Amenities.
              </h2>
            </TextReveal>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="font-sans text-xl md:text-2xl font-medium tracking-tight text-orange-500 max-w-xl leading-relaxed"
          >
            <span className="font-bold text-black">Every detail of our developments</span> is crafted with residents in mind — because the <span className="font-bold text-black">finest quality of life</span> is built into the architecture itself.
          </motion.p>
        </div>

        {/* Line */}
        <div className="relative h-px bg-gray-200 mb-16 overflow-hidden">
          <motion.div className="absolute inset-0 bg-black origin-left" style={{ scaleX: lineScale }} />
        </div>

        {/* 3D Carousel */}
        <div className="relative h-[600px] w-full max-w-4xl mx-auto flex items-center justify-center" style={{ perspective: '1200px' }}>
          <motion.div
            onPanStart={() => setIsDragging(true)}
            onPan={handlePan}
            onPanEnd={handlePanEnd}
            style={{ rotateY: springRot, transformStyle: 'preserve-3d' }}
            className={`relative w-[320px] h-[400px] flex items-center justify-center touch-none ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
          >
            {features.map((item, index) => {
              const deg = (360 / features.length) * index;
              return (
                <div
                  key={index}
                  className="absolute w-full"
                  style={{
                    transform: `rotateY(${deg}deg) translateZ(400px)`,
                    transformStyle: 'preserve-3d',
                  }}
                >
                  <FeatureCard item={item} index={index} />
                </div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
}