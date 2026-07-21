import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft, MapPin, Ruler, Building2, Calendar,
  CheckCircle2, Mail, Phone, User, Send, X, ChevronLeft, ChevronRight,
} from 'lucide-react';
import { projects } from '../data/projects';

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

/* ─── Enquiry Form ─────────────────────────────────────────────────────────── */
function EnquiryForm({ project }: { project: (typeof projects)[0] }) {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });

  const handle = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  const inputClass = 'w-full bg-white border border-gray-200 rounded-full font-sans text-sm text-black placeholder-gray-300 focus:outline-none focus:border-black transition-colors py-3.5 px-5';

  return (
    <div className="max-w-xl">
      <AnimatePresence mode="wait">
        {sent ? (
          <motion.div key="success" className="flex flex-col items-start py-16" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="w-12 h-12 border border-black flex items-center justify-center mb-6">
              <CheckCircle2 className="w-5 h-5 text-black" />
            </div>
            <h3 className="font-heading font-bold text-3xl text-black mb-3">Enquiry Received.</h3>
            <p className="text-gray-400 font-sans text-sm leading-relaxed mb-8 max-w-xs">
              Our team will reach out within 24 hours regarding <strong className="text-black">{project.label}</strong>.
            </p>
            <button onClick={() => setSent(false)} className="font-sans text-xs tracking-[0.25em] uppercase font-bold text-black border-b border-black pb-0.5 hover:border-amber-600 hover:text-amber-600 transition-colors">
              Send Another →
            </button>
          </motion.div>
        ) : (
          <motion.form key="form" onSubmit={handle} className="space-y-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <p className="font-sans text-sm text-gray-400 mb-8 leading-relaxed">
              Interested in <strong className="text-black">{project.label}</strong>? Fill in your details and a dedicated advisor will be in touch.
            </p>

            <div className="grid md:grid-cols-2 gap-3">
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-300" />
                <input required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="Full Name" className={`${inputClass} pl-11`} />
              </div>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-300" />
                <input required value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                  placeholder="Phone Number" className={`${inputClass} pl-11`} />
              </div>
            </div>

            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-300" />
              <input required type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                placeholder="Email Address" className={`${inputClass} pl-11`} />
            </div>

            <textarea value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
              placeholder="Requirements, budget range, preferred unit size..." rows={4}
              className="w-full bg-white border border-gray-200 rounded-3xl font-sans text-sm text-black placeholder-gray-300 focus:outline-none focus:border-black transition-colors py-4 px-5 resize-none"
            />

            <button type="submit" className="w-full flex items-center justify-center gap-3 py-4 rounded-full bg-black text-white font-sans font-bold text-xs tracking-[0.25em] uppercase hover:bg-gray-800 transition-colors">
              <Send className="w-3.5 h-3.5" />
              Submit Enquiry
            </button>

            <div className="flex items-center gap-8 pt-3">
              <a href="tel:+919876543210" className="flex items-center gap-2 font-sans text-xs text-gray-300 hover:text-black transition-colors">
                <Phone className="w-3 h-3" /> +91 98765 43210
              </a>
              <a href="mailto:hello@bricklyhomes.in" className="flex items-center gap-2 font-sans text-xs text-gray-300 hover:text-black transition-colors">
                <Mail className="w-3 h-3" /> hello@bricklyhomes.in
              </a>
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
          <p className="text-gray-400 font-sans text-sm mb-4">Project not found.</p>
          <button onClick={() => navigate(-1)} className="font-sans text-xs font-bold tracking-widest uppercase text-black border-b border-black pb-0.5 hover:text-amber-600 hover:border-amber-600 transition-colors">← Go Back</button>
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
        <div className="relative z-10 flex flex-col justify-center w-[46%] px-12 xl:px-20 flex-shrink-0 bg-[#fcfcfc]">

          {/* Top nav */}
          <div className="absolute top-8 left-12 xl:left-20 flex items-center gap-6">
            <button onClick={() => navigate(-1)} className="flex items-center gap-2 font-sans text-[10px] font-bold tracking-[0.25em] uppercase text-gray-400 hover:text-black transition-colors">
              <ArrowLeft className="w-3.5 h-3.5" /> Back
            </button>
          </div>

          {/* Brand */}
          <p className="font-sans text-[10px] font-bold tracking-[0.28em] uppercase text-gray-400 mb-10">
            Brickly Homes · {project.sub}
          </p>

          {/* Category tag */}
          <div className="flex items-center gap-3 mb-5">
            <span className="font-mono text-[10px] text-gray-300">
              {String(projects.findIndex(p => p.id === id) + 1).padStart(2, '0')}
            </span>
            <span className="h-px w-8 bg-gray-200" />
            <span className="font-sans text-[11px] font-bold tracking-[0.22em] uppercase text-amber-600">
              {project.type}
            </span>
          </div>

          {/* Project name */}
          <motion.h1
            className="font-heading font-bold text-[clamp(2.8rem,4vw,5rem)] text-black leading-[1.02] mb-6"
            initial={{ opacity: 0, y: 50, filter: 'blur(8px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            {project.label}
          </motion.h1>

          {/* Description */}
          <motion.p
            className="font-sans text-[15px] text-gray-500 leading-relaxed max-w-[330px] mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {project.description}
          </motion.p>

          {/* Meta row */}
          <motion.div
            className="flex flex-wrap items-center gap-5 text-[11px] font-sans text-gray-400 mb-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3 h-3 text-amber-500" />
              {project.location}
            </span>
            <span className="flex items-center gap-1.5">
              <Ruler className="w-3 h-3 text-amber-500" />
              {project.area}
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3 h-3 text-amber-500" />
              {project.year}
            </span>
          </motion.div>

          {/* Status + CTA */}
          <div className="flex items-center gap-5">
            <span className="font-sans text-[10px] font-black tracking-[0.3em] uppercase text-amber-600 border border-amber-200 px-3 py-1.5">
              {project.status}
            </span>
            <button
              onClick={() => setTab('enquiry')}
              className="font-sans text-[10px] font-bold tracking-[0.25em] uppercase text-black border-b border-black pb-0.5 hover:text-amber-600 hover:border-amber-600 transition-colors"
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
      <div className="sticky top-0 z-30 bg-[#fcfcfc]/97 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-12 xl:px-20 flex items-center gap-0">
          {tabs.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className="relative px-6 py-5 font-sans text-sm font-semibold transition-colors"
              style={{ color: tab === t.key ? '#000' : '#9ca3af' }}
            >
              {t.label}
              {tab === t.key && (
                <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-[2px] bg-black" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* ── Tab Content ── */}
      <div className="max-w-6xl mx-auto px-12 xl:px-20 py-20">
        <AnimatePresence mode="wait">

          {/* ── OVERVIEW ── */}
          {tab === 'overview' && (
            <motion.div key="overview"
              initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="grid md:grid-cols-3 gap-16"
            >
              {/* Left: description + highlights */}
              <div className="md:col-span-2 space-y-14">
                <div>
                  <p className="font-sans text-[10px] font-bold tracking-[0.3em] uppercase text-amber-600 mb-4">About the Property</p>
                  <h2 className="font-heading font-bold text-4xl text-black mb-6 leading-tight">{project.label}</h2>
                  <p className="font-sans text-base text-gray-500 leading-[1.85]">{project.longDescription}</p>
                </div>

                {/* Highlights */}
                <div>
                  <p className="font-sans text-[10px] font-bold tracking-[0.3em] uppercase text-gray-300 mb-5">Key Highlights</p>
                  <div className="grid grid-cols-2 gap-px bg-gray-100">
                    {project.highlights.map(h => (
                      <div key={h} className="flex items-center gap-3 bg-[#fcfcfc] px-4 py-4">
                        <CheckCircle2 className="w-4 h-4 shrink-0 text-amber-500" />
                        <span className="font-sans text-sm font-semibold text-black">{h}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CTA */}
                <button onClick={() => setTab('enquiry')}
                  className="inline-flex items-center gap-3 px-8 py-4 bg-black text-white font-sans font-bold text-xs tracking-[0.25em] uppercase hover:bg-amber-600 transition-colors"
                >
                  <Mail className="w-3.5 h-3.5" />
                  Enquire About This Property
                </button>
              </div>

              {/* Right: specs */}
              <div>
                <p className="font-sans text-[10px] font-bold tracking-[0.3em] uppercase text-gray-300 mb-5">Specifications</p>
                <div className="divide-y divide-gray-100 border-t border-b border-gray-100">
                  {project.specs.map(s => (
                    <div key={s.label} className="flex justify-between items-center py-4">
                      <span className="font-sans text-xs text-gray-400 font-medium">{s.label}</span>
                      <span className="font-sans text-sm font-bold text-black text-right max-w-[55%]">{s.value}</span>
                    </div>
                  ))}
                </div>

                {/* Meta */}
                <div className="mt-8 space-y-3">
                  {[
                    { icon: MapPin, label: 'Location', val: project.location },
                    { icon: Ruler, label: 'Total Area', val: project.area },
                    { icon: Building2, label: 'Type', val: project.type },
                    { icon: Calendar, label: 'Year', val: project.year },
                  ].map(({ icon: Icon, label, val }) => (
                    <div key={label} className="flex items-start gap-3 border border-gray-100 p-4">
                      <Icon className="w-4 h-4 shrink-0 mt-0.5 text-amber-500" />
                      <div>
                        <p className="font-sans text-[10px] font-bold tracking-widest uppercase text-gray-300">{label}</p>
                        <p className="font-sans text-sm font-semibold text-black">{val}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* ── GALLERY ── */}
          {tab === 'gallery' && (
            <motion.div key="gallery"
              initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              <p className="font-sans text-[10px] font-bold tracking-[0.3em] uppercase text-amber-600 mb-3">Visual Tour</p>
              <h2 className="font-heading font-bold text-4xl text-black mb-12 leading-tight">Photo Gallery</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {project.gallery.map((src, i) => (
                  <motion.div key={i}
                    className={`relative overflow-hidden cursor-pointer group bg-gray-100 ${i === 0 ? 'md:col-span-2 md:row-span-2' : ''}`}
                    style={{ aspectRatio: i === 0 ? '16/10' : '4/3' }}
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: i * 0.05 }}
                    onClick={() => setLightbox(i)}
                    whileHover={{ scale: 1.01 }}
                  >
                    <img src={src} alt="" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                      <div className="w-10 h-10 border border-white/70 bg-white/10 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                        <ChevronRight className="w-4 h-4 text-white" />
                      </div>
                    </div>
                    <div className="absolute bottom-3 right-3 bg-black/50 px-2 py-0.5">
                      <span className="font-mono text-[9px] text-white/60">{String(i + 1).padStart(2, '0')}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* ── ENQUIRY ── */}
          {tab === 'enquiry' && (
            <motion.div key="enquiry"
              initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              <p className="font-sans text-[10px] font-bold tracking-[0.3em] uppercase text-amber-600 mb-3">Get In Touch</p>
              <h2 className="font-heading font-bold text-4xl text-black mb-2 leading-tight">Enquire Now</h2>
              <p className="font-sans text-sm text-gray-400 mb-12">Our property advisors respond within 24 hours.</p>
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
