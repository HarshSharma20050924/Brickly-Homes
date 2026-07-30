import { motion, useScroll, useTransform } from 'motion/react';
import { useState, useEffect } from 'react';

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      className="relative font-sans text-sm font-medium text-gray-500 hover:text-black transition-colors duration-200 group"
    >
      {children}
      <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-black group-hover:w-full transition-all duration-300 ease-out" />
    </a>
  );
}

export default function Navbar({ onContactClick }: { onContactClick?: () => void }) {
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    return scrollY.on('change', (latest) => {
      setIsScrolled(latest > 50);
    });
  }, [scrollY]);

  const navBackground = useTransform(scrollY, [0, 50], ['rgba(255,255,255,0)', 'rgba(255,255,255,0.95)']);
  const navBlur = useTransform(scrollY, [0, 50], ['blur(0px)', 'blur(12px)']);

  return (
    <motion.header
      style={{ backgroundColor: navBackground, backdropFilter: navBlur }}
      className={`fixed top-0 left-0 right-0 z-40 transition-shadow duration-500 ${isScrolled ? 'shadow-sm border-b border-gray-100' : ''}`}
    >
      <div className="max-w-7xl mx-auto px-6 h-[72px] flex items-center justify-between">

        {/* Logo — clean wordmark like the reference */}
        <div className="flex items-center gap-2 cursor-pointer">
          <div className="w-7 h-7 bg-black rounded-sm flex items-center justify-center shrink-0">
            <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 stroke-white" strokeWidth={2.5}>
              <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
          </div>
          <span className="font-heading font-bold text-[15px] tracking-tight text-black">BRICKLY</span>
        </div>

        {/* Nav links */}
        <nav className="hidden md:flex items-center gap-10">
          <NavLink href="#about">About</NavLink>
          <NavLink href="#projects">Projects</NavLink>
          <NavLink href="#gallery">Gallery</NavLink>
        </nav>

        {/* Contact pill — like the reference "Sign In" rounded pill */}
        <a
          href="#contact"
          className="hidden md:flex items-center gap-2 px-5 py-2.5 bg-black text-white rounded-full font-sans text-sm font-semibold hover:bg-gray-800 transition-colors"
        >
          Contact Us
        </a>
      </div>
    </motion.header>
  );
}
