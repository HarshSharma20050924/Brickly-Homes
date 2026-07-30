/**
 * Reusable animation primitives for Brickly Homes.
 *
 * TextReveal  — each line clips up from bottom (overflow hidden mask)
 * ImageReveal — image wipes in from left with a cover clip-path
 */
import { motion, useInView, useScroll, useTransform } from 'motion/react';
import { useRef, type ReactNode } from 'react';

// ── Text line reveal ──────────────────────────────────────────────────────────
// Wraps children in an overflow:hidden div so text slides up into view.
export function TextReveal({
  children,
  delay = 0,
  className = '',
  once = false,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  once?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once, margin: '-60px' });

  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      <motion.div
        initial={{ y: '108%', opacity: 0 }}
        animate={inView ? { y: '0%', opacity: 1 } : { y: '108%', opacity: 0 }}
        transition={{
          duration: 0.85,
          delay,
          ease: [0.16, 1, 0.3, 1],
        }}
      >
        {children}
      </motion.div>
    </div>
  );
}

// ── Scroll-driven text fill — text starts nearly invisible, fills to black ──────
export function FillText({
  children,
  className = '',
  fillStart = 0.2,
  fillEnd = 0.8,
}: {
  children: ReactNode;
  className?: string;
  fillStart?: number;
  fillEnd?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 0.9', 'start 0.1'],
  });

  const clipPath = useTransform(
    scrollYProgress,
    [fillStart, fillEnd],
    ['inset(0 100% 0 0)', 'inset(0 0% 0 0)']
  );

  return (
    <div ref={ref} className={`relative ${className}`}>
      {/* Base/Ghost — light grey text before scroll fill */}
      <div className="text-black/20" aria-hidden>
        {children}
      </div>
      {/* Fill — clips left to right revealing solid black text */}
      <motion.div
        className="absolute inset-0 overflow-hidden text-black"
        style={{ clipPath }}
      >
        {children}
      </motion.div>
    </div>
  );
}

// ── Scroll-driven text fill — text starts nearly invisible, fills to white ──────
export function FillTextInverted({
  children,
  className = '',
  fillStart = 0.2,
  fillEnd = 0.8,
}: {
  children: ReactNode;
  className?: string;
  fillStart?: number;
  fillEnd?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 0.9', 'start 0.1'],
  });

  const clipPath = useTransform(
    scrollYProgress,
    [fillStart, fillEnd],
    ['inset(0 100% 0 0)', 'inset(0 0% 0 0)']
  );

  return (
    <div ref={ref} className={`relative ${className}`}>
      <div className="text-white/20" aria-hidden>
        {children}
      </div>
      <motion.div
        className="absolute inset-0 overflow-hidden text-white"
        style={{ clipPath }}
      >
        {children}
      </motion.div>
    </div>
  );
}

// ── Image clip-path wipe reveal ───────────────────────────────────────────────
// The image stays exactly in place — just the visible area wipes open.
export function ImageReveal({
  src,
  alt,
  className = '',
  delay = 0,
  direction = 'left',
  once = false,
}: {
  src: string;
  alt: string;
  className?: string;
  delay?: number;
  direction?: 'left' | 'right' | 'top' | 'bottom';
  once?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once, margin: '-80px' });

  const clipStart: Record<string, string> = {
    left:   'inset(0 100% 0 0)',
    right:  'inset(0 0 0 100%)',
    top:    'inset(0 0 100% 0)',
    bottom: 'inset(100% 0 0 0)',
  };

  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      <motion.img
        src={src}
        alt={alt}
        initial={{ clipPath: clipStart[direction], scale: 1.06 }}
        animate={
          inView
            ? { clipPath: 'inset(0 0% 0 0)', scale: 1 }
            : { clipPath: clipStart[direction], scale: 1.06 }
        }
        transition={{
          clipPath: { duration: 1.1, delay, ease: [0.16, 1, 0.3, 1] },
          scale:    { duration: 1.4, delay, ease: [0.16, 1, 0.3, 1] },
        }}
        className="w-full h-full object-cover"
      />
    </div>
  );
}

// ── Video clip-path wipe reveal (curtain animation) ───────────────────────────
export function VideoReveal({
  src,
  className = '',
  delay = 0,
  direction = 'left',
  once = false,
}: {
  src: string;
  className?: string;
  delay?: number;
  direction?: 'left' | 'right' | 'top' | 'bottom' | 'center';
  once?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once, margin: '-80px' });

  const clipStart: Record<string, string> = {
    left:   'inset(0 100% 0 0)',
    right:  'inset(0 0 0 100%)',
    top:    'inset(0 0 100% 0)',
    bottom: 'inset(100% 0 0 0)',
    center: 'inset(50% 0 50% 0)',
  };

  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      <motion.video
        src={src}
        autoPlay
        loop
        muted
        playsInline
        initial={{ clipPath: clipStart[direction], scale: 1.06 }}
        animate={
          inView
            ? { clipPath: 'inset(0 0% 0 0)', scale: 1 }
            : { clipPath: clipStart[direction], scale: 1.06 }
        }
        transition={{
          clipPath: { duration: 1.1, delay, ease: [0.16, 1, 0.3, 1] },
          scale:    { duration: 1.4, delay, ease: [0.16, 1, 0.3, 1] },
        }}
        className="w-full h-full object-cover"
      />
    </div>
  );
}
