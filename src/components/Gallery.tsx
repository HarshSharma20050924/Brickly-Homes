import { motion, useScroll, useTransform, AnimatePresence } from 'motion/react';
import { useRef, useState, useEffect } from 'react';

const galleryImages = [
  { src: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=2071&auto=format&fit=crop', label: 'The Grand Facade', sub: 'Mumbai, 2024' },
  { src: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2075&auto=format&fit=crop', label: 'The Pinnacle', sub: 'Pune, 2023' },
  { src: 'https://images.unsplash.com/photo-1600607686527-6fb886090705?q=80&w=2000&auto=format&fit=crop', label: 'Horizon Villas', sub: 'Bangalore, 2022' },
  { src: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=2940&auto=format&fit=crop', label: 'Azure Residences', sub: 'Hyderabad, 2021' },
  { src: 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?q=80&w=2070&auto=format&fit=crop', label: 'Meridian Heights', sub: 'Chennai, 2020' },
  { src: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2070&auto=format&fit=crop', label: 'Elevated Living', sub: 'Delhi, 2019' },
];

// Floating positions — scattered layout
const floatLayout = [
  { top: '8%',  left: '4%',   w: '28%', rot: -3,  delay: 0 },
  { top: '5%',  left: '36%',  w: '22%', rot: 1.5, delay: 0.08 },
  { top: '3%',  left: '62%',  w: '32%', rot: -1,  delay: 0.16 },
  { top: '52%', left: '2%',   w: '24%', rot: 2,   delay: 0.12 },
  { top: '55%', left: '30%',  w: '30%', rot: -2,  delay: 0.2 },
  { top: '50%', left: '64%',  w: '26%', rot: 1,   delay: 0.06 },
];

// Full-screen gallery overlay
function GalleryPage({ onClose }: { onClose: () => void }) {
  return (
    <motion.div
      initial={{ clipPath: 'inset(0 0 100% 0)' }}
      animate={{ clipPath: 'inset(0 0 0% 0)' }}
      exit={{ clipPath: 'inset(0 0 100% 0)' }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-0 z-50 bg-black overflow-y-auto"
      style={{ scrollSnapType: 'y mandatory' }}
    >
      <button
        onClick={onClose}
        className="fixed top-8 right-8 z-50 w-12 h-12 border border-white/20 bg-white/5 flex items-center justify-center text-white hover:bg-white/15 transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {galleryImages.map((img, i) => (
        <div key={i} className="relative h-screen w-full flex items-end" style={{ scrollSnapAlign: 'start' }}>
          <motion.img src={img.src} alt={img.label}
            className="absolute inset-0 w-full h-full object-cover"
            initial={{ scale: 1.08, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: false, amount: 0.5 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
          <motion.div
            className="relative z-10 p-10 md:p-16 w-full"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.5 }}
            transition={{ duration: 0.9, delay: 0.2 }}
          >
            <span className="font-mono text-xs text-white/40 block mb-2">{String(i + 1).padStart(2, '0')} / {String(galleryImages.length).padStart(2, '0')}</span>
            <h2 className="font-heading font-bold text-5xl md:text-7xl text-white">{img.label}</h2>
            <p className="font-sans text-white/60 font-medium mt-2">{img.sub}</p>
          </motion.div>
        </div>
      ))}
    </motion.div>
  );
}

export default function Gallery() {
  const [showGallery, setShowGallery] = useState(false);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const sectionRef = useRef<HTMLDivElement>(null);

  // Track mouse for floating parallax
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      setMouse({
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2,
      });
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  return (
    <>
      <AnimatePresence>
        {showGallery && <GalleryPage onClose={() => setShowGallery(false)} />}
      </AnimatePresence>

      <section id="gallery" ref={sectionRef} className="relative bg-white overflow-hidden" style={{ minHeight: '100vh', paddingBottom: '8rem' }}>

        {/* Header */}
        <div className="max-w-7xl mx-auto px-12 xl:px-20 pt-28 pb-16 flex flex-col md:flex-row md:items-end justify-between gap-8 relative z-10">
          <div>
            <motion.div
              initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.6 }}
              className="flex items-center gap-3 mb-4"
            >
              <div className="w-8 h-px bg-black" />
              <span className="font-sans text-xs font-bold tracking-[0.25em] uppercase text-gray-400">Visual Portfolio</span>
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 50, filter: 'blur(8px)' }}
              whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              viewport={{ once: false, amount: 0.3 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="font-heading font-bold text-5xl md:text-6xl text-black"
            >
              Project <span className="italic font-light">Gallery</span>
            </motion.h2>
          </div>

          <motion.button
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
            viewport={{ once: true }} transition={{ delay: 0.3 }}
            onClick={() => setShowGallery(true)}
            className="group flex items-center gap-3 font-sans text-sm font-bold tracking-[0.12em] uppercase text-black self-start md:self-auto"
          >
            <span>Open Gallery</span>
            <span className="w-8 h-8 rounded-full border border-black flex items-center justify-center group-hover:bg-black group-hover:text-white transition-colors duration-300">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </span>
          </motion.button>
        </div>

        {/* Floating image field */}
        <div className="relative mx-auto max-w-7xl px-12 xl:px-20" style={{ height: '75vh' }}>
          {galleryImages.map((img, i) => {
            const lay = floatLayout[i];
            // Each card floats differently based on mouse
            const depth = (i % 3) + 1; // 1,2,3 parallax depth
            const px = mouse.x * depth * 8;
            const py = mouse.y * depth * 6;

            return (
              <motion.div
                key={i}
                className="absolute cursor-pointer group"
                style={{ top: lay.top, left: lay.left, width: lay.w, rotate: lay.rot }}
                initial={{ opacity: 0, y: 60, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 1, delay: lay.delay, ease: [0.16, 1, 0.3, 1] }}
                animate={{ x: px, y: py }}
                // @ts-ignore
                transition_animate={{ type: 'spring', stiffness: 60, damping: 20 }}
                onClick={() => setShowGallery(true)}
                whileHover={{ scale: 1.04, rotate: 0, zIndex: 20 }}
              >
                <div className="overflow-hidden rounded-2xl shadow-xl">
                  <img
                    src={img.src}
                    alt={img.label}
                    className="w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    style={{ aspectRatio: i % 2 === 0 ? '4/3' : '3/4' }}
                  />
                </div>
                {/* Label on hover */}
                <motion.div
                  className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                >
                  <div className="bg-white/90 backdrop-blur-sm rounded-xl px-3 py-2">
                    <p className="font-heading font-bold text-black text-sm">{img.label}</p>
                    <p className="font-sans text-gray-400 text-xs">{img.sub}</p>
                  </div>
                </motion.div>
              </motion.div>
            );
          })}
        </div>

      </section>
    </>
  );
}
