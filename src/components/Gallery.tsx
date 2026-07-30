import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';

const galleryImages = [
  { src: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=2071&auto=format&fit=crop', label: 'The Grand Facade', sub: 'Mumbai, 2024' },
  { src: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2075&auto=format&fit=crop', label: 'The Pinnacle', sub: 'Pune, 2023' },
  { src: 'https://images.unsplash.com/photo-1600607686527-6fb886090705?q=80&w=2000&auto=format&fit=crop', label: 'Horizon Villas', sub: 'Bangalore, 2022' },
  { src: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=2940&auto=format&fit=crop', label: 'Azure Residences', sub: 'Hyderabad, 2021' },
  { src: 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?q=80&w=2070&auto=format&fit=crop', label: 'Meridian Heights', sub: 'Chennai, 2020' },
  { src: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2070&auto=format&fit=crop', label: 'Elevated Living', sub: 'Delhi, 2019' },
];

function GalleryPage({ onClose, initialIndex = 0 }: { onClose: () => void, initialIndex?: number }) {
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
        className="fixed top-8 right-8 z-50 w-12 h-12 border border-white/20 bg-white/5 flex items-center justify-center text-white hover:bg-white/15 transition-colors rounded-full"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {galleryImages.map((img, i) => (
        <div key={i} className="relative h-screen w-full flex items-end" style={{ scrollSnapAlign: 'start' }} ref={el => { if (i === initialIndex && el) el.scrollIntoView() }}>
          <motion.img src={img.src} alt={img.label}
            className="absolute inset-0 w-full h-full object-cover"
            initial={{ scale: 1.06, opacity: 0 }}
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
            <span className="font-sans text-xs text-white/40 block mb-2">{String(i + 1).padStart(2, '0')} / {String(galleryImages.length).padStart(2, '00')}</span>
            <h2 className="font-heading font-bold text-5xl md:text-7xl text-white">{img.label}</h2>
            <p className="font-sans text-white/60 font-medium mt-2">{img.sub}</p>
          </motion.div>
        </div>
      ))}
    </motion.div>
  );
}

export default function Gallery() {
  const [showGallery, setShowGallery] = useState<{ show: boolean, index: number }>({ show: false, index: 0 });

  return (
    <>
      <AnimatePresence>
        {showGallery.show && <GalleryPage onClose={() => setShowGallery({ show: false, index: 0 })} initialIndex={showGallery.index} />}
      </AnimatePresence>

      <section id="gallery" className="relative bg-[#111] text-white overflow-hidden py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-16">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-24">
            <div>
              <motion.div
                initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.6 }}
                className="flex items-center gap-3 mb-6"
              >
                <div className="w-8 h-px bg-white/30" />
                <span className="font-sans text-xs font-semibold tracking-[0.25em] text-white/50">Visual Portfolio</span>
              </motion.div>

              <h2 className="font-heading font-normal text-4xl md:text-6xl leading-tight">
                Project<br/>
                <span className="text-white/40">Gallery.</span>
              </h2>
            </div>
            
            <button
              onClick={() => setShowGallery({ show: true, index: 0 })}
              className="group flex items-center gap-3 font-sans text-sm font-bold tracking-[0.12em] text-white self-start md:self-auto"
            >
              <span>Open Gallery</span>
              <span className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-colors duration-300">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </span>
            </button>
          </div>

          <div className="border-b border-white/10">
            {galleryImages.map((img, i) => (
              <div 
                key={i} 
                className="group relative border-t border-white/10 py-16 md:py-20 cursor-pointer overflow-hidden transition-colors"
                onClick={() => setShowGallery({ show: true, index: i })}
              >
                {/* Background Image Reveal with right-to-left curtain animation */}
                <div 
                  className="absolute inset-0 z-0 [clip-path:inset(0_0_0_100%)] group-hover:[clip-path:inset(0_0_0_0)] transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
                >
                  <img src={img.src} alt="" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40" />
                </div>

                {/* Content */}
                <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8 md:gap-16">
                  
                  {/* Left: Number + Subtitle */}
                  <div className="flex items-center gap-6 md:w-[30%]">
                    <div className="w-12 h-12 rounded-full border border-white/30 flex items-center justify-center shrink-0">
                      <span className="font-mono text-sm text-white">{String(i + 1).padStart(2, '0')}</span>
                    </div>
                    <p className="font-sans text-sm text-white/60 group-hover:text-white transition-colors duration-300">
                      {img.sub}
                    </p>
                  </div>

                  {/* Center: Title */}
                  <div className="flex-1 text-left md:text-center">
                    <h3 className="relative inline-block font-sans font-light tracking-tight text-white group-hover:scale-[1.02] transition-transform duration-500 origin-center" style={{ fontSize: 'clamp(3rem, 7vw, 6rem)', lineHeight: 1 }}>
                      {img.label}
                      <span className="absolute left-0 -bottom-2 w-full h-[2px] md:h-1 bg-white scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]" />
                    </h3>
                  </div>

                  {/* Right: Arrow */}
                  <div className="hidden md:flex items-center justify-end shrink-0 md:w-[15%]">
                    <svg viewBox="0 0 24 24" fill="none" className="w-10 h-10 stroke-white opacity-0 group-hover:opacity-100 transition-all duration-500 translate-x-8 group-hover:translate-x-0" strokeWidth={1}>
                      <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>
    </>
  );
}
