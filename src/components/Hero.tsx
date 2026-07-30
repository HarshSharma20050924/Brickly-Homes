import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';

// ── Config ────────────────────────────────────────────────────────────────────
const TOTAL_FRAMES = 1749;

function getFrameUrl(i: number) {
  const n = i + 136;
  return `/image-asset/frame_${String(n).padStart(6, '0')}.jpg`;
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

// ── Phases ────────────────────────────────────────────────────────────────────
const PHASES = [
  {
    range: [0, 0.34],
    tag: '01',
    eyebrow: 'Planning',
    headline: 'Vision into\nreality.',
    body: 'Meticulous planning and architectural brilliance. We start by ensuring every foundation is built to last.',
  },
  {
    range: [0.34, 0.67],
    tag: '02',
    eyebrow: 'Construction',
    headline: 'Building\ntomorrow.',
    body: 'Precision engineering at scale. Watch as raw materials transform into towering structures of modern design.',
  },
  {
    range: [0.67, 1.01],
    tag: '03',
    eyebrow: 'Handover',
    headline: 'Ready for\nlife.',
    body: 'The final masterpiece. Unmatched finishing touches and quality control make it ready for generations to come.',
  },
];

// ── Component ─────────────────────────────────────────────────────────────────
export default function Hero() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<(HTMLImageElement | null)[]>(Array(TOTAL_FRAMES).fill(null));

  // Smooth frame interpolation
  const targetFrameRef = useRef(0);   // where scroll says we should be
  const currentFrameRef = useRef(0);   // lerped value (float)
  const lastDrawnRef = useRef(-1);  // last integer frame drawn
  const rafRef = useRef<number | null>(null);

  // Mouse parallax
  const mouseRef = useRef({ x: 0, y: 0 });   // -1 to 1
  const parallaxRef = useRef({ x: 0, y: 0 }); // smoothed

  const [loadedCount, setLoadedCount] = useState(0);
  const [canvasReady, setCanvasReady] = useState(false);
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);

  // ── Draw (with fallback to nearest loaded frame if exact target isn't ready) ─
  const drawFrame = useCallback((index: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return false;

    const targetIdx = Math.min(TOTAL_FRAMES - 1, Math.max(0, Math.round(index)));
    let img = imagesRef.current[targetIdx];

    // Fallback: If exact frame is missing/loading, find closest available frame
    if (!img || !img.complete || img.naturalWidth === 0) {
      let closest = -1;
      let minDiff = Infinity;

      for (let offset = 1; offset < TOTAL_FRAMES; offset++) {
        if (offset > minDiff) break;
        const left = targetIdx - offset;
        const right = targetIdx + offset;

        if (left >= 0 && imagesRef.current[left]?.complete && imagesRef.current[left]?.naturalWidth! > 0) {
          closest = left;
          minDiff = offset;
          break;
        }
        if (right < TOTAL_FRAMES && imagesRef.current[right]?.complete && imagesRef.current[right]?.naturalWidth! > 0) {
          closest = right;
          minDiff = offset;
          break;
        }
      }

      if (closest !== -1) {
        img = imagesRef.current[closest];
      } else {
        return false;
      }
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) return false;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    const w = rect.width, h = rect.height;

    if (canvas.width !== w * dpr || canvas.height !== h * dpr) {
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.scale(dpr, dpr);
    }

    // cover-fit (fills entire area, cropping if necessary)
    const ir = img.naturalWidth / img.naturalHeight;
    const cr = w / h;
    let dw: number, dh: number, dx: number, dy: number;
    if (ir > cr) {
      // image is wider than canvas -> match height, crop width
      dh = h; dw = h * ir; dx = (w - dw) / 2; dy = 0;
    } else {
      // image is taller than canvas -> match width, crop height
      dw = w; dh = w / ir; dx = 0; dy = (h - dh) / 2;
    }

    ctx.clearRect(0, 0, w, h);
    ctx.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight, dx, dy, dw, dh);
    return true;
  }, []);

  // ── rAF loop — always running, handles lerp + parallax ──────────────────
  useEffect(() => {
    const loop = () => {
      // Lerp frame
      currentFrameRef.current = lerp(currentFrameRef.current, targetFrameRef.current, 0.09);
      const frameInt = Math.min(TOTAL_FRAMES - 1, Math.round(currentFrameRef.current));

      if (frameInt !== lastDrawnRef.current) {
        const success = drawFrame(frameInt);
        if (success) {
          lastDrawnRef.current = frameInt;
        }
      }

      // Lerp parallax
      parallaxRef.current.x = lerp(parallaxRef.current.x, mouseRef.current.x, 0.06);
      parallaxRef.current.y = lerp(parallaxRef.current.y, mouseRef.current.y, 0.06);

      const canvas = canvasRef.current;
      if (canvas) {
        const px = parallaxRef.current.x * 14;
        const py = parallaxRef.current.y * 10;
        // subtle scale-up to hide parallax edges
        canvas.style.transform = `translate(${px}px, ${py}px) scale(1.04)`;
      }

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [drawFrame]);

  // ── Mouse tracking ───────────────────────────────────────────────────────
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouseRef.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseRef.current.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  // ── Staged Priority Preloader ─────────────────────────────────────────────
  useEffect(() => {
    let loaded = 0;
    const isLoaded = new Uint8Array(TOTAL_FRAMES);

    // Build loading priority order:
    // Pass 1: Every 5th keyframe (0, 5, 10... 1745) for fast end-to-end coverage
    // Pass 2: Every 2nd frame
    // Pass 3: All remaining frames
    const queue: number[] = [];

    // Stage 1: Keyframes across full timeline
    for (let i = 0; i < TOTAL_FRAMES; i += 5) {
      queue.push(i);
    }
    // Stage 2: Half-frames
    for (let i = 0; i < TOTAL_FRAMES; i += 2) {
      if (i % 5 !== 0) queue.push(i);
    }
    // Stage 3: Remaining frames
    for (let i = 0; i < TOTAL_FRAMES; i++) {
      if (i % 2 !== 0 && i % 5 !== 0) queue.push(i);
    }

    let queueIdx = 0;
    const CONCURRENCY = 16;

    const loadNext = () => {
      // Find next unloaded frame from queue
      while (queueIdx < queue.length && isLoaded[queue[queueIdx]]) {
        queueIdx++;
      }
      if (queueIdx >= queue.length) return;

      const i = queue[queueIdx++];
      isLoaded[i] = 1;

      const img = new Image();
      img.src = getFrameUrl(i);

      const onDone = () => {
        loaded++;
        setLoadedCount(loaded);
        if (loaded === 1) setCanvasReady(true);
        loadNext();
      };

      img.onload = () => {
        imagesRef.current[i] = img;
        // Draw the very first frame immediately so the canvas is never blank
        if (i === 0) {
          // Use a tiny timeout so the canvas has had one paint cycle to size itself
          setTimeout(() => {
            drawFrame(0);
            lastDrawnRef.current = 0;
          }, 0);
        }
        onDone();
      };
      img.onerror = onDone;
    };

    // Kick off CONCURRENCY number of parallel loaders
    for (let j = 0; j < CONCURRENCY; j++) {
      loadNext();
    }
  }, [drawFrame]);

  // ── Scroll → target frame + phase ───────────────────────────────────────
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const onScroll = () => {
      const rect = section.getBoundingClientRect();
      const scrollable = section.offsetHeight - window.innerHeight;
      const progress = Math.min(1, Math.max(0, -rect.top) / scrollable);
      setScrollProgress(progress);

      targetFrameRef.current = progress * (TOTAL_FRAMES - 1);

      const pi = PHASES.findIndex(p => progress >= p.range[0] && progress < p.range[1]);
      if (pi !== -1) setPhaseIndex(pi);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // ── Resize ───────────────────────────────────────────────────────────────
  useEffect(() => {
    const onResize = () => {
      const c = canvasRef.current;
      if (!c) return;
      c.width = 0; c.height = 0;
      drawFrame(lastDrawnRef.current);
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [drawFrame]);

  const loadPct = Math.round((loadedCount / TOTAL_FRAMES) * 100);
  const phase = PHASES[phaseIndex];

  return (
    <section ref={sectionRef} style={{ height: '400vh' }} className="relative w-full">

      {/* ── Sticky ────────────────────────────────────────────────────── */}
      <div className="sticky top-0 w-full h-screen bg-[#fcfcfc] overflow-hidden flex">

        {/* ════ LEFT ════════════════════════════════════════════════════ */}
        <div className="relative z-10 flex flex-col justify-center w-[48%] px-12 xl:px-20 flex-shrink-0">

          {/* Brand */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="font-sans text-xl font-medium tracking-tight text-gray-400 mb-12"
          >
            <span className="font-bold text-black">This isn't just</span> about real estate.
          </motion.p>

          {/* Eyebrow */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`ey-${phaseIndex}`}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 12 }}
              transition={{ duration: 0.35 }}
              className="flex items-center gap-3 mb-6"
            >
              <span className="font-sans text-sm font-semibold tracking-tight text-gray-400">{phase.tag}</span>
              <span className="h-px w-10 bg-gray-200" />
              <span className="font-sans text-lg font-bold tracking-tight text-amber-600">
                {phase.eyebrow}
              </span>
            </motion.div>
          </AnimatePresence>

          {/* Headline */}
          <AnimatePresence mode="wait">
            <motion.h1
              key={`h-${phaseIndex}`}
              initial={{ opacity: 0, y: 60, filter: 'blur(8px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -60, filter: 'blur(8px)' }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="font-heading font-extrabold text-[clamp(3.8rem,6.5vw,7.5rem)] text-black leading-[0.98] mb-8 whitespace-pre-line tracking-tight"
            >
              {phase.headline}
            </motion.h1>
          </AnimatePresence>

          {/* Body */}
          <AnimatePresence mode="wait">
            <motion.p
              key={`b-${phaseIndex}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="font-sans text-xl text-gray-500 leading-relaxed max-w-xl"
            >
              {phase.body}
            </motion.p>
          </AnimatePresence>

          {/* Phase stepper */}
          <div className="flex items-end gap-6 mt-12">
            {PHASES.map((p, i) => (
              <div key={i} className="flex flex-col gap-1.5">
                <span
                  className="font-sans text-sm font-bold tracking-tight transition-colors duration-400"
                  style={{ color: i === phaseIndex ? '#111' : '#d1d5db' }}
                >
                  {p.eyebrow}
                </span>
                <motion.span
                  className="block h-[2px] rounded-full bg-black"
                  animate={{ width: i === phaseIndex ? 28 : 12, opacity: i === phaseIndex ? 1 : 0.15 }}
                  transition={{ duration: 0.4 }}
                  style={{ display: 'block' }}
                />
              </div>
            ))}
          </div>

          {/* Scroll cue */}
          {scrollProgress < 0.04 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
              className="absolute bottom-10 left-12 xl:left-20 flex items-center gap-3"
            >
              <motion.div
                animate={{ x: [0, 6, 0] }}
                transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
                className="h-px w-8 bg-gray-300"
              />
              <span className="font-sans text-[10px] tracking-widest text-gray-400">
                Scroll to explore
              </span>
            </motion.div>
          )}
        </div>

        {/* ════ RIGHT — live canvas ════════════════════════════════════ */}
        <div className="relative flex-1 h-full overflow-hidden">

          {/* Skeleton pulse */}
          {!canvasReady && (
            <div className="absolute inset-0 bg-gray-200 animate-pulse z-10" />
          )}

          {/* Zoom effect wrapper */}
          <motion.div
            className="absolute inset-0 w-full h-full transform-gpu"
            style={{
              scale: 0.9 + (scrollProgress * 0.08) // Zoomed out slightly, zooms in on scroll
            }}
          >
            {/* Canvas */}
            <canvas
              ref={canvasRef}
              className="absolute inset-0 w-full h-full transition-none will-change-transform"
              style={{
                display: canvasReady ? 'block' : 'none',
                transformOrigin: 'center center',
              }}
            />
          </motion.div>

          {/* Seamless gradient overlay blending left into right */}
          <div
            className="absolute inset-0 pointer-events-none z-10"
            style={{
              background: 'linear-gradient(to right, #fcfcfc 0%, rgba(252,252,252,0) 25%)',
            }}
          />

          {/* Ambient gradient that shifts with mouse */}
          <div
            className="absolute inset-0 pointer-events-none z-10 mix-blend-overlay"
            style={{
              background:
                'radial-gradient(ellipse 70% 70% at 70% 40%, rgba(255,255,255,0.4) 0%, transparent 70%)',
            }}
          />

          {/* Phase overlay tag — bottom left of canvas */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`ov-${phaseIndex}`}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.35 }}
              className="absolute bottom-7 left-7 z-20 flex items-center gap-2"
            >
              <span className="font-sans text-xs font-bold tracking-[0.22em] text-black/30">
                {phase.eyebrow}
              </span>
            </motion.div>
          </AnimatePresence>

          {/* Loading bar */}
          {loadedCount < TOTAL_FRAMES && (
            <div className="absolute bottom-7 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-1.5 w-32">
              <div className="w-full h-[2px] bg-black/10 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-black/20 rounded-full"
                  animate={{ width: `${loadPct}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
              <span className="font-sans text-[9px] tracking-widest text-black/20">
                {loadPct}%
              </span>
            </div>
          )}

          {/* Frame number */}
          <span className="absolute bottom-7 right-7 font-mono text-[9px] text-black/15 select-none z-20">
            {String(Math.min(TOTAL_FRAMES, Math.round(currentFrameRef.current) + 1)).padStart(3, '0')}
            <span className="text-black/10"> / {TOTAL_FRAMES}</span>
          </span>
        </div>

      </div>
    </section>
  );
}
