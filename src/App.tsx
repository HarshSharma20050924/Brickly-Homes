import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Loader from './components/Loader';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Projects from './components/Projects';
import ScrollSequence from './components/ScrollSequence';
import Features from './components/Features';
import Timeline from './components/Timeline';
import Gallery from './components/Gallery';
import Contact from './components/Contact';
import ProjectDetailPage from './pages/ProjectDetailPage';
import { AnimatePresence, motion } from 'motion/react';
import { X, Phone, Mail, MapPin } from 'lucide-react';

const contacts = [
  { icon: Phone, label: 'Phone', value: '+91 98765 43210', href: 'tel:+919876543210' },
  { icon: Mail, label: 'Email', value: 'hello@bricklyhomes.in', href: 'mailto:hello@bricklyhomes.in' },
  { icon: MapPin, label: 'Office', value: 'Mumbai · Pune · Bangalore', href: '#' },
];

function HomePage() {
  const [loading, setLoading] = useState(() => {
    return !sessionStorage.getItem('hasLoadedIntro');
  });
  const [showContact, setShowContact] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleComplete = () => {
    sessionStorage.setItem('hasLoadedIntro', 'true');
    setLoading(false);
  };

  return (
    <div className="bg-white min-h-screen text-black">
      {loading && <Loader onComplete={handleComplete} />}

      {/* Global contact popover */}
      <AnimatePresence>
        {showContact && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowContact(false)}
              className="fixed inset-0 z-40"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: -8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: -8 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="fixed top-24 right-6 z-50 bg-white rounded-2xl shadow-2xl border border-gray-100 p-6 w-72"
            >
              <div className="flex items-center justify-between mb-5">
                <span className="font-sans text-xs font-bold tracking-widest uppercase text-gray-400">
                  Contact Us
                </span>
                <button
                  onClick={() => setShowContact(false)}
                  className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-black transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-4">
                {contacts.map((c, i) => (
                  <motion.a
                    key={i}
                    href={c.href}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06 }}
                    className="flex items-center gap-4 group"
                  >
                    <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-black transition-colors duration-300 shrink-0">
                      <c.icon className="w-4 h-4 text-black group-hover:text-white transition-colors duration-300" />
                    </div>
                    <div>
                      <div className="font-sans text-xs text-gray-400 font-medium">{c.label}</div>
                      <div className="font-sans text-sm font-semibold text-black">{c.value}</div>
                    </div>
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className={loading ? 'h-screen overflow-hidden' : ''}>
        <Navbar onContactClick={() => setShowContact((v) => !v)} />
        <main>
          <Hero />
          <About />
          <Projects />
          <ScrollSequence />
          <Features />
          <Timeline />
          <Gallery />
          <Contact />
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/project/:id" element={<ProjectDetailPage />} />
      </Routes>
    </BrowserRouter>
  );
}
