import { motion, useScroll, useTransform } from 'motion/react';
import { useState, useEffect } from 'react';

// Custom dots icon
function DotsIcon() {
  return (
    <svg width="18" height="4" viewBox="0 0 18 4" fill="currentColor">
      <circle cx="2" cy="2" r="2" />
      <circle cx="9" cy="2" r="2" />
      <circle cx="16" cy="2" r="2" />
    </svg>
  );
}

const spanVariants = {
  initial: { y: 0 },
  hover: { y: -20 }
};

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <motion.a
      href={href}
      className="relative overflow-hidden flex flex-col h-5 leading-[20px] items-center cursor-pointer"
      initial="initial"
      whileHover="hover"
    >
      <motion.span
        className="text-gray-600 block transition-colors"
        variants={spanVariants}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      >
        {children}
      </motion.span>
      <motion.span
        className="absolute top-5 text-black block"
        variants={spanVariants}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      >
        {children}
      </motion.span>
    </motion.a>
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

  const navBackground = useTransform(
    scrollY,
    [0, 50],
    ['rgba(255, 255, 255, 0)', 'rgba(255, 255, 255, 0.95)']
  );

  const navBackdropBlur = useTransform(
    scrollY,
    [0, 50],
    ['blur(0px)', 'blur(12px)']
  );

  return (
    <motion.header
      style={{
        backgroundColor: navBackground,
        backdropFilter: navBackdropBlur,
      }}
      className="fixed top-0 left-0 right-0 z-40 transition-shadow duration-500 data-[scrolled=true]:shadow-sm data-[scrolled=true]:border-b data-[scrolled=true]:border-gray-100"
      data-scrolled={isScrolled}
    >
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <div className="flex items-center gap-2 cursor-pointer">
          <span className="font-heading font-bold text-2xl tracking-tight text-black">BRICKLY HOMES</span>
        </div>

        <nav className="hidden md:flex items-center gap-10 font-sans text-sm font-medium">
          <NavLink href="#about">About</NavLink>
          <NavLink href="#projects">Projects</NavLink>
          <NavLink href="#gallery">Gallery</NavLink>
        </nav>

        {/* Three-dot contact button */}
        <button
          onClick={onContactClick}
          className="flex items-center gap-3 group"
          aria-label="Contact"
        >
          <span className="hidden md:inline font-sans text-sm font-medium text-gray-600 group-hover:text-black transition-colors">
            Contact
          </span>
          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-black group-hover:text-white transition-colors text-black">
            <DotsIcon />
          </div>
        </button>
      </div>
    </motion.header>
  );
}
