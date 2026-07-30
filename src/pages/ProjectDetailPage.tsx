import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useTransform, useMotionValue, useSpring } from 'motion/react';
import {
  ArrowLeft, MapPin, Ruler, Building2, Calendar,
  CheckCircle2, Mail, Phone, User, Send, X, ChevronLeft, ChevronRight,
  ShieldCheck, Home, Trees, Car, Star, Award, Layers, Sparkles
} from 'lucide-react';
import { projects } from '../data/projects';
import { FillText } from '../components/AnimationPrimitives';

type Tab = 'overview' | 'gallery' | 'enquiry';

/* ─── Lightbox ─────────────────────────────────────────────────────────────── */
function Lightbox({ images, index, onClose }: { images: string[]; index: number; onClose: () => void }) {
  const [cur, setCur] = useState(index);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') setCur(i => (i + 1) % images.length);
      if (e.key === 'ArrowLeft') setCur(i => (i - 1 + images.length) % images.length);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [images.length, onClose]);

  return (
    <motion.div
      className="fixed inset-0 z-[200] bg-black/90 flex items-center justify-center"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
    >
      <button onClick={onClose} className="absolute top-6 right-6 w-9 h-9 border border-white/20 bg-white/5 hover:bg-white/15 flex items-center justify-center text-white transition-all">
        <X className="w-4 h-4" />
      </button>
      <button onClick={() => setCur(i => (i - 1 + images.length) % images.length)} className="absolute left-5 w-10 h-10 border border-white/20 bg-white/5 hover:bg-white/15 flex items-center justify-center text-white transition-all">
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button onClick={() => setCur(i => (i + 1) % images.length)} className="absolute right-5 w-10 h-10 border border-white/20 bg-white/5 hover:bg-white/15 flex items-center justify-center text-white transition-all">
        <ChevronRight className="w-5 h-5" />
      </button>

      <AnimatePresence mode="wait">
        <motion.img key={cur} src={images[cur]} alt="" className="max-w-[88vw] max-h-[82vh] object-contain"
          initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }} transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        />
      </AnimatePresence>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
        {images.map((_, i) => (
          <button key={i} onClick={() => setCur(i)}
            className={`h-[2px] rounded-full transition-all duration-300 ${i === cur ? 'w-7 bg-white' : 'w-2 bg-white/25'}`}
          />
        ))}
      </div>

      <span className="absolute top-7 left-1/2 -translate-x-1/2 font-mono text-[10px] text-white/30 tracking-widest">
        {String(cur + 1).padStart(2, '0')} / {String(images.length).padStart(2, '0')}
      </span>
    </motion.div>
  );
}

/* ─── Tilt Feature Card for Highlights (exact FeatureCard from Features.tsx) ─── */
const featurePresets: Record<string, { icon: any; desc: string }> = {
  'Prime Locations': { icon: MapPin, desc: 'Strategically situated in the heart of the city with unmatched connectivity.' },
  'Modern Design': { icon: Building2, desc: 'Contemporary architecture with premium finishes that stand the test of time.' },
  'Green Spaces': { icon: Trees, desc: 'Eco-friendly landscaping, parks, and gardens woven into every development.' },
  'Smart Homes': { icon: Home, desc: 'Integrated automation and intelligent systems for seamless modern living.' },
  '24/7 Security': { icon: ShieldCheck, desc: 'Advanced surveillance, biometric access, and round-the-clock security teams.' },
  'Ample Parking': { icon: Car, desc: 'Spacious multi-level parking with EV charging infrastructure built in.' },
};

function HighlightCard({ title, index }: { title: string; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const preset = featurePresets[title];
  const IconComp = preset ? preset.icon : (() => {
    const lower = title.toLowerCase();
    if (lower.includes('unit') || lower.includes('home') || lower.includes('residence') || lower.includes('living')) return Home;
    if (lower.includes('garden') || lower.includes('green') || lower.includes('park') || lower.includes('sea')) return Trees;
    if (lower.includes('security') || lower.includes('shield')) return ShieldCheck;
    if (lower.includes('amenit') || lower.includes('star') || lower.includes('gold') || lower.includes('leed')) return Star;
    if (lower.includes('parking') || lower.includes('car')) return Car;
    if (lower.includes('floor') || lower.includes('tower') || lower.includes('building') || lower.includes('sky')) return Building2;
    return Sparkles;
  })();

  const description = preset ? preset.desc : 'Bespoke architectural craft and precision engineering woven into every detail.';

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
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={() => setIsHovered(true)}
      animate={{ rotateX: tilt.x, rotateY: tilt.y, scale: isHovered ? 1.03 : 1 }}
      transition={{ type: 'spring', stiffness: 220, damping: 22 }}
      className="group relative bg-white p-8 rounded-2xl border border-gray-100 cursor-default overflow-hidden w-[310px] h-[360px] flex flex-col justify-between"
      style={{
        transformStyle: 'preserve-3d',
        boxShadow: isHovered
          ? '0 24px 60px rgba(0,0,0,0.12), 0 4px 16px rgba(0,0,0,0.06)'
          : '0 4px 20px rgba(0,0,0,0.05)',
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

      {/* Icon — squircle rounded-xl container */}
      <div className="relative w-12 h-12 rounded-xl bg-gray-50 group-hover:bg-black flex items-center justify-center mb-7 transition-all duration-400">
        <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-400" style={{ boxShadow: '0 0 20px 6px rgba(0,0,0,0.12)' }} />
        <IconComp className="relative w-5 h-5 stroke-[1.5] text-black group-hover:text-white transition-colors duration-400" />
      </div>

      {/* Big ghost number */}
      <div className="absolute top-6 right-6 font-heading font-extrabold text-5xl text-gray-50 group-hover:text-gray-100 transition-colors duration-400 leading-none select-none">
        {String(index + 1).padStart(2, '0')}
      </div>

      <div>
        <h3 className="font-heading font-bold text-xl text-black mb-3">{title}</h3>
        <p className="font-sans text-[15px] text-gray-500 leading-relaxed">{description}</p>
      </div>

      <div className="absolute bottom-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </motion.div>
  );
}

/* ─── 3D Revolving Carousel for Key Highlights ─────────────────────────────── */
function Highlights3DCarousel({ highlights }: { highlights: string[] }) {
  // Use landing page 6 features if available, otherwise project highlights
  const items = highlights.length > 0 ? highlights : [
    'Prime Locations', 'Modern Design', 'Green Spaces', 'Smart Homes', '24/7 Security', 'Ample Parking'
  ];

  const rotation = useMotionValue(0);
  const springRot = useSpring(rotation, { stiffness: 100, damping: 20 });
  const [isDragging, setIsDragging] = useState(false);

  const handlePan = (e: any, info: any) => {
    rotation.set(rotation.get() + info.delta.x * 0.25);
  };
  const handlePanEnd = (e: any, info: any) => {
    setIsDragging(false);
    const segment = 360 / items.length;
    const current = rotation.get();
    const velocity = info.velocity.x * 0.2;
    const target = current + velocity;
    const snapped = Math.round(target / segment) * segment;
    rotation.set(snapped);
  };

  return (
    <div className="relative h-[500px] w-full max-w-4xl mx-auto flex items-center justify-center my-8" style={{ perspective: '1200px' }}>
      <motion.div
        onPanStart={() => setIsDragging(true)}
        onPan={handlePan}
        onPanEnd={handlePanEnd}
        style={{ rotateY: springRot, transformStyle: 'preserve-3d' }}
        className={`relative w-[310px] h-[360px] flex items-center justify-center touch-none ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
      >
        {items.map((h, index) => {
          const deg = (360 / items.length) * index;
          const radius = items.length > 4 ? 420 : 360;
          return (
            <div
              key={index}
              className="absolute w-full"
              style={{
                transform: `rotateY(${deg}deg) translateZ(${radius}px)`,
                transformStyle: 'preserve-3d',
              }}
            >
              <HighlightCard title={h} index={index} />
            </div>
          );
        })}
      </motion.div>
    </div>
  );
}

/* ─── Enquiry Form ─────────────────────────────────────────────────────────── */
function EnquiryForm({ project }: { project: (typeof projects)[0] }) {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });

  const handle = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="w-full max-w-2xl bg-white/70 p-10 md:p-16 rounded-[36px] backdrop-blur-2xl border border-white/90 shadow-2xl shadow-black/10 hover:-translate-y-1 transition-all duration-500">
      <AnimatePresence mode="wait">
        {sent ? (
          <motion.div key="success" className="flex flex-col items-start py-16" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="w-16 h-16 border-2 border-black flex items-center justify-center mb-8 rounded-full bg-white/80 backdrop-blur-md">
              <CheckCircle2 className="w-7 h-7 text-black" />
            </div>
            <h3 className="font-heading font-extrabold text-4xl text-black mb-4">Enquiry Received.</h3>
            <p className="text-gray-600 font-sans text-lg leading-relaxed mb-10 max-w-md">
              Our dedicated property advisors will reach out within 24 hours regarding <strong className="text-black font-semibold">{project.label}</strong>.
            </p>
            <button onClick={() => setSent(false)} className="font-sans text-sm tracking-tight uppercase font-bold text-black border-b-2 border-black pb-1 hover:border-amber-600 hover:text-amber-600 transition-colors">
              Send Another →
            </button>
          </motion.div>
        ) : (
          <motion.form key="form" onSubmit={handle} className="space-y-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <p className="font-sans text-xl font-medium tracking-tight text-gray-400 mb-8 leading-relaxed">
              <span className="font-bold text-black">Interested in {project.label}?</span> Fill in your details below and a dedicated advisor will be in touch shortly.
            </p>

            <div>
              <label className="font-sans text-sm font-bold tracking-tight uppercase text-gray-400 block mb-3">
                Your Name
              </label>
              <input
                required
                type="text"
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                placeholder="Full Name"
                className="w-full bg-transparent border-b-2 border-gray-200 py-4 font-sans text-lg md:text-xl text-black focus:outline-none focus:border-black transition-colors placeholder-gray-300 font-medium"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <label className="font-sans text-sm font-bold tracking-tight uppercase text-gray-400 block mb-3">
                  Phone Number
                </label>
                <input
                  required
                  type="text"
                  value={form.phone}
                  onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                  placeholder="+91 98765 43210"
                  className="w-full bg-transparent border-b-2 border-gray-200 py-4 font-sans text-lg md:text-xl text-black focus:outline-none focus:border-black transition-colors placeholder-gray-300 font-medium"
                />
              </div>
              <div>
                <label className="font-sans text-sm font-bold tracking-tight uppercase text-gray-400 block mb-3">
                  Email Address
                </label>
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  placeholder="hello@yourmail.com"
                  className="w-full bg-transparent border-b-2 border-gray-200 py-4 font-sans text-lg md:text-xl text-black focus:outline-none focus:border-black transition-colors placeholder-gray-300 font-medium"
                />
              </div>
            </div>

            <div>
              <label className="font-sans text-sm font-bold tracking-tight uppercase text-gray-400 block mb-3">
                Requirements & Message
              </label>
              <textarea
                rows={3}
                value={form.message}
                onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                placeholder="Requirements, budget range, preferred unit size..."
                className="w-full bg-transparent border-b-2 border-gray-200 py-4 font-sans text-lg md:text-xl text-black focus:outline-none focus:border-black transition-colors placeholder-gray-300 resize-none font-medium"
              />
            </div>

            <div className="pt-6 flex flex-wrap items-center justify-between gap-6">
              <button
                type="submit"
                className="group inline-flex items-center gap-4 px-10 py-5 bg-black text-white font-sans text-base font-bold rounded-full hover:bg-gray-800 transition-all duration-300 shadow-xl hover:-translate-y-0.5"
              >
                Send Message
                <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>

              <div className="flex items-center gap-6">
                <a href="tel:+919876543210" className="flex items-center gap-3 font-sans text-sm font-medium text-gray-500 hover:text-black transition-colors">
                  <div className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-black">
                    <Phone className="w-4 h-4" />
                  </div>
                  <span>+91 98765 43210</span>
                </a>
              </div>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── Main Page ─────────────────────────────────────────────────────────────── */
export default function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>('overview');
  const [lightbox, setLightbox] = useState<number | null>(null);

  const project = projects.find(p => p.id === id);

  useEffect(() => {
    window.scrollTo(0, 0);
    document.body.style.overflow = '';
  }, []);

  if (!project) {
    return (
      <div className="min-h-screen bg-[#fcfcfc] flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400 font-sans text-base mb-4">Project not found.</p>
          <button onClick={() => navigate(-1)} className="font-sans text-sm font-bold tracking-widest uppercase text-black border-b border-black pb-0.5 hover:text-amber-600 hover:border-amber-600 transition-colors">← Go Back</button>
        </div>
      </div>
    );
  }

  const tabs: { key: Tab; label: string }[] = [
    { key: 'overview', label: 'Overview' },
    { key: 'gallery', label: `Gallery (${project.gallery.length})` },
    { key: 'enquiry', label: 'Enquire Now' },
  ];

  return (
    <div className="min-h-screen bg-[#fcfcfc] text-black">

      {/* ── Full-bleed Hero — split layout like landing page ── */}
      <div className="relative h-screen flex overflow-hidden">

        {/* LEFT: text side */}
        <div className="relative z-10 flex flex-col justify-center w-[48%] px-12 xl:px-24 flex-shrink-0 bg-[#fcfcfc]">

          {/* Top nav */}
          <div className="absolute top-10 left-12 xl:left-24 flex items-center gap-6">
            <button onClick={() => navigate(-1)} className="flex items-center gap-2 font-sans text-xs font-bold tracking-tight uppercase text-gray-400 hover:text-black transition-colors">
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
          </div>

          {/* Brand */}
          <p className="font-sans text-base font-semibold text-gray-500 mb-12">
            Brickly Homes · {project.sub}
          </p>

          {/* Category tag */}
          <div className="flex items-center gap-4 mb-6">
            <span className="font-sans text-base font-bold text-gray-400">
              {String(projects.findIndex(p => p.id === id) + 1).padStart(2, '0')}
            </span>
            <span className="h-px w-8 bg-gray-200" />
            <span className="font-sans text-base font-bold text-black uppercase tracking-tight">
              {project.type}
            </span>
          </div>

          {/* Project name */}
          <motion.h1
            className="font-heading font-extrabold text-[clamp(3.5rem,5.5vw,6.5rem)] text-black leading-[1.0] mb-8 tracking-tight"
            initial={{ opacity: 0, y: 50, filter: 'blur(8px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            {project.label}
          </motion.h1>

          {/* Description */}
          <motion.p
            className="font-sans text-xl md:text-2xl font-medium tracking-tight text-gray-400 mb-12 max-w-[520px]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <span className="font-bold text-black">A boutique masterpiece</span> where architectural perfection meets artisanal luxury.
          </motion.p>

          {/* Meta row */}
          <motion.div
            className="flex flex-wrap items-center gap-8 text-base md:text-lg font-sans font-semibold text-gray-600 mb-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <span className="flex items-center gap-2.5">
              <MapPin className="w-5 h-5 text-amber-500" />
              {project.location}
            </span>
            <span className="flex items-center gap-2.5">
              <Ruler className="w-5 h-5 text-amber-500" />
              {project.area}
            </span>
            <span className="flex items-center gap-2.5">
              <Calendar className="w-5 h-5 text-amber-500" />
              {project.year}
            </span>
          </motion.div>

          {/* Status + CTA */}
          <div className="flex items-center gap-8">
            <span className="font-sans text-base font-bold tracking-tight text-amber-600">
              {project.status}
            </span>
            <button
              onClick={() => setTab('enquiry')}
              className="font-sans text-base font-bold tracking-tight uppercase text-black border-b-2 border-black pb-0.5 hover:text-amber-600 hover:border-amber-600 transition-colors"
            >
              Enquire →
            </button>
          </div>
        </div>

        {/* RIGHT: hero image */}
        <div className="relative flex-1 h-full overflow-hidden">
          <motion.img
            src={project.src}
            alt={project.label}
            className="w-full h-full object-cover"
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
          />
          {/* Blend edge into white left side */}
          <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(to right, #fcfcfc 0%, rgba(252,252,252,0) 20%)' }} />
        </div>
      </div>

      {/* ── Tabs ── */}
      <div className="sticky top-0 z-30 bg-[#fcfcfc]/90 backdrop-blur-xl border-b border-gray-100/80">
        <div className="max-w-7xl mx-auto px-12 xl:px-24 flex items-center gap-4">
          {tabs.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className="relative px-8 py-6 font-sans text-base font-bold tracking-tight transition-colors"
              style={{ color: tab === t.key ? '#000' : '#9ca3af' }}
            >
              {t.label}
              {tab === t.key && (
                <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-[3px] bg-black" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* ── Tab Content ── */}
      <div className="max-w-7xl mx-auto px-12 xl:px-24 py-24">
        <AnimatePresence mode="wait">

          {/* ── OVERVIEW ── */}
          {tab === 'overview' && (
            <motion.div key="overview"
              initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-24"
            >
              {/* Story / About section with FillText animation */}
              <div className="relative bg-white/70 backdrop-blur-xl border border-white/90 p-10 md:p-16 rounded-[36px] shadow-2xl shadow-black/5 overflow-hidden">
                <div className="max-w-4xl">
                  <FillText fillStart={0.1} fillEnd={0.7}>
                    <h2 className="font-heading font-extrabold text-4xl md:text-6xl mb-8 leading-tight">{project.label}</h2>
                  </FillText>
                  <p className="font-sans text-xl md:text-2xl font-medium tracking-tight text-gray-400 leading-relaxed">
                    <span className="font-bold text-black">{project.longDescription.slice(0, 75)}</span>
                    {project.longDescription.slice(75)}
                  </p>
                </div>
              </div>

              {/* Key Highlights Section (3D Revolving Carousel like Features.tsx) */}
              <div className="space-y-6">
                <FillText fillStart={0.1} fillEnd={0.6}>
                  <h2 className="font-heading font-extrabold text-4xl md:text-6xl leading-tight">Key Highlights</h2>
                </FillText>

                <Highlights3DCarousel highlights={project.highlights} />
              </div>

              {/* Property Profile in Paragraph Style */}
              <div className="space-y-10">
                <FillText fillStart={0.1} fillEnd={0.6}>
                  <h2 className="font-heading font-extrabold text-4xl md:text-6xl leading-tight">Property Profile</h2>
                </FillText>

                <div className="bg-white/70 backdrop-blur-xl border border-white/90 p-10 md:p-16 rounded-[36px] shadow-xl space-y-8">
                  <p className="font-sans text-xl md:text-2xl font-medium tracking-tight text-gray-400 leading-relaxed">
                    <span className="font-bold text-black">{project.label} is positioned in {project.location}</span>, featuring an expansive total area of <span className="font-bold text-black">{project.area}</span>. Developed as a flagship <span className="font-bold text-black">{project.type}</span> completed in <span className="font-bold text-black">{project.year}</span>.
                  </p>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 pt-4 border-t border-gray-100">
                    {project.specs.map(s => (
                      <div key={s.label} className="p-4">
                        <p className="font-sans text-sm text-gray-400 font-semibold mb-1">{s.label}</p>
                        <p className="font-heading font-extrabold text-2xl text-black">{s.value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom CTA */}
              <div className="pt-8 flex justify-center">
                <button
                  onClick={() => setTab('enquiry')}
                  className="inline-flex items-center gap-4 px-12 py-6 bg-black text-white font-sans font-bold text-base rounded-full hover:bg-gray-800 transition-all duration-300 shadow-2xl hover:-translate-y-1"
                >
                  <Mail className="w-5 h-5" />
                  Enquire About This Property
                </button>
              </div>
            </motion.div>
          )}

          {/* ── GALLERY ── */}
          {tab === 'gallery' && (
            <motion.div key="gallery"
              initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="bg-[#111] text-white -mx-12 xl:-mx-24 px-12 xl:px-24 py-24 min-h-screen"
            >
              <div className="max-w-7xl mx-auto">
                <div className="flex items-start gap-8 mb-24">
                  <span className="font-sans text-xs font-bold tracking-widest uppercase mt-3">Gallery</span>
                  <div>
                    <h2 className="font-heading font-normal text-4xl md:text-5xl leading-tight">
                      Explore<br/>
                      <span className="text-white/50">The Vision</span>
                    </h2>
                  </div>
                </div>

                <div className="border-b border-white/10">
                  {project.gallery.map((src, i) => {
                    const titles = ['Facade', 'Lobby', 'Amenities', 'Residences', 'Details', 'Views', 'Lifestyle'];
                    const descs = [
                      'The architectural masterpiece from the outside, blending modern lines with timeless materials.',
                      'Step into the grand entrance and lounge, designed to leave a lasting first impression.',
                      'World-class facilities for residents, dialed in to get you the best experience, fast.',
                      'Spacious, light-filled living spaces. We’ve done this over 10,000 times, and we know what wins.',
                      'Bespoke architectural craft and precision engineering woven into every corner.',
                      'Panoramic city and ocean vistas that offer an unmatched perspective.',
                      'A sustainable oasis in the heart of downtown.'
                    ];
                    
                    return (
                      <div 
                        key={i} 
                        className="group relative border-t border-white/10 py-16 md:py-24 cursor-pointer overflow-hidden transition-colors"
                        onClick={() => setLightbox(i)}
                      >
                        {/* Background Image Reveal */}
                        <div className="absolute inset-0 z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                          <img src={src} alt="" className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/40" />
                        </div>

                        {/* Content */}
                        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8 md:gap-16">
                          
                          {/* Left: Number + Desc */}
                          <div className="flex items-start gap-6 max-w-sm">
                            <div className="w-10 h-10 rounded-full border border-white/40 flex items-center justify-center shrink-0">
                              <span className="font-mono text-xs text-white">{i + 1}</span>
                            </div>
                            <p className="font-sans text-sm text-white/70 leading-relaxed group-hover:text-white transition-colors">
                              {descs[i % descs.length]}
                            </p>
                          </div>

                          {/* Center: Huge Title */}
                          <div className="flex-1 text-left md:text-center">
                            <h3 className="relative inline-block font-sans font-light tracking-tight text-white group-hover:scale-105 transition-transform duration-500 origin-center" style={{ fontSize: 'clamp(4rem, 10vw, 8rem)', lineHeight: 1 }}>
                              {titles[i % titles.length]}
                              <span className="absolute left-0 -bottom-2 w-full h-[2px] md:h-1 bg-white scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]" />
                            </h3>
                          </div>

                          {/* Right: Arrow */}
                          <div className="hidden md:flex items-center justify-end shrink-0 w-24">
                            <svg viewBox="0 0 24 24" fill="none" className="w-12 h-12 stroke-white opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-4 group-hover:translate-x-0" strokeWidth={1}>
                              <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}

          {/* ── ENQUIRY ── */}
          {tab === 'enquiry' && (
            <motion.div key="enquiry"
              initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-center py-8"
            >
              <div className="text-center mb-16 max-w-2xl">
                <FillText fillStart={0.1} fillEnd={0.6}>
                  <h2 className="font-heading font-extrabold text-5xl md:text-7xl mb-4 leading-tight">Enquire Now</h2>
                </FillText>
                <p className="font-sans text-xl font-medium tracking-tight text-gray-400 mt-4">
                  Our property advisors respond within <span className="font-bold text-black">24 hours</span>.
                </p>
              </div>
              <EnquiryForm project={project} />
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* ── Lightbox ── */}
      <AnimatePresence>
        {lightbox !== null && (
          <Lightbox images={project.gallery} index={lightbox} onClose={() => setLightbox(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}
