import { motion, useScroll, useTransform } from 'motion/react';
import { useRef, useMemo, Suspense } from 'react';
import { Phone, Mail, MapPin, ArrowRight } from 'lucide-react';
import { Canvas, useFrame, ThreeElements } from '@react-three/fiber';
import { useGLTF, Environment, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';

declare global {
  namespace React {
    namespace JSX {
      interface IntrinsicElements extends ThreeElements {}
    }
  }
}

// ── 3D Instanced Bricks (Lightweight Sand Physics) ──────────────────────────
function InstancedSandBricks({ count = 2000 }) {
  const { scene } = useGLTF('/stylized_mossy_brick.glb');

  const meshes = useMemo(() => {
    const arr: THREE.Mesh[] = [];
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) arr.push(child as THREE.Mesh);
    });
    return arr;
  }, [scene]);

  const refs = useRef<(THREE.InstancedMesh | null)[]>([]);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const prevMouse = useRef(new THREE.Vector2());

  const particleData = useMemo(() => {
    const data = [];
    for (let i = 0; i < count; i++) {
      const progress = Math.random();
      const startX = -24 + progress * 48;
      const startY = 16 - progress * 32;
      const basePos = new THREE.Vector3(
        startX + (Math.random() - 0.5) * 3.2,
        startY + (Math.random() - 0.5) * 2.5,
        (Math.random() - 0.5) * 4 - 2
      );

      const speedX = 0.006 + Math.random() * 0.008;
      const speedY = -(0.004 + Math.random() * 0.005);

      data.push({
        pos: basePos.clone(),
        velocity: new THREE.Vector3(speedX, speedY, (Math.random() - 0.5) * 0.003),
        speedX,
        speedY,
        rot: new THREE.Euler(
          Math.random() * Math.PI * 2,
          Math.random() * Math.PI * 2,
          Math.random() * Math.PI * 2
        ),
        rotSpeed: new THREE.Vector3(
          (Math.random() - 0.5) * 0.008,
          (Math.random() - 0.5) * 0.008,
          (Math.random() - 0.5) * 0.008
        ),
        scale: 0.22 + Math.random() * 0.35,
      });
    }
    return data;
  }, [count]);

  useFrame((state, delta) => {
    const dt = Math.min(delta, 1 / 30);
    const dtScale = dt * 60;

    const currentMouse = new THREE.Vector2(state.pointer.x, state.pointer.y);
    const mouseDelta = currentMouse.clone().sub(prevMouse.current);
    prevMouse.current.copy(currentMouse);

    const time = state.clock.elapsedTime;

    particleData.forEach((data, i) => {
      const camera = state.camera as THREE.PerspectiveCamera;
      const distToCam = camera.position.z - data.pos.z;
      const vFOV = (camera.fov * Math.PI) / 180;
      const heightAtZ = 2 * Math.tan(vFOV / 2) * distToCam;
      const widthAtZ = heightAtZ * camera.aspect;

      const cursorWorldPos = new THREE.Vector3(
        (state.pointer.x * widthAtZ) / 2,
        (state.pointer.y * heightAtZ) / 2,
        data.pos.z
      );

      const dist = cursorWorldPos.distanceTo(data.pos);
      const radius = 3.5;

      if (dist < radius) {
        const force = Math.pow((radius - dist) / radius, 2);

        data.velocity.x += mouseDelta.x * force * 0.6 * dtScale;
        data.velocity.y += mouseDelta.y * force * 0.6 * dtScale;
        data.rotSpeed.x += mouseDelta.y * force * 0.15;
        data.rotSpeed.y += mouseDelta.x * force * 0.15;

        const pushDir = data.pos.clone().sub(cursorWorldPos).normalize();
        data.velocity.add(pushDir.multiplyScalar(force * 0.0015 * dtScale));
      }

      const waveOffset = Math.sin(time * 1.2 + data.pos.x * 0.3) * 0.005 * dtScale;

      data.pos.x += data.velocity.x * dtScale;
      data.pos.y += data.velocity.y * dtScale + waveOffset;
      data.pos.z += data.velocity.z * dtScale;

      data.rot.x += data.rotSpeed.x * dtScale;
      data.rot.y += data.rotSpeed.y * dtScale;
      data.rot.z += data.rotSpeed.z * dtScale;

      const dampFactor = 1 - Math.pow(1 - 0.02, dtScale);
      data.velocity.x = THREE.MathUtils.lerp(data.velocity.x, data.speedX, dampFactor);
      data.velocity.y = THREE.MathUtils.lerp(data.velocity.y, data.speedY, dampFactor);
      data.velocity.z *= Math.pow(0.94, dtScale);
      data.rotSpeed.x *= Math.pow(0.95, dtScale);
      data.rotSpeed.y *= Math.pow(0.95, dtScale);
      data.rotSpeed.z *= Math.pow(0.95, dtScale);

      if (data.pos.x > 24 || data.pos.y < -16) {
        data.pos.x = -24 + (Math.random() - 0.5) * 3;
        data.pos.y = 16 + (Math.random() - 0.5) * 2;
        data.pos.z = (Math.random() - 0.5) * 4 - 2;
        data.velocity.set(data.speedX, data.speedY, (Math.random() - 0.5) * 0.003);
      }

      dummy.position.copy(data.pos);
      dummy.rotation.copy(data.rot);
      dummy.scale.set(data.scale, data.scale, data.scale);
      dummy.updateMatrix();

      refs.current.forEach((mesh) => {
        if (mesh) mesh.setMatrixAt(i, dummy.matrix);
      });
    });

    refs.current.forEach((mesh) => {
      if (mesh) mesh.instanceMatrix.needsUpdate = true;
    });
  });

  return (
    <group>
      {meshes.map((mesh, idx) => (
        <instancedMesh
          key={idx}
          ref={(el) => { refs.current[idx] = el; }}
          args={[mesh.geometry, mesh.material as THREE.Material, count]}
        />
      ))}
    </group>
  );
}

// ── Scroll-driven text fill — text starts nearly invisible, fills to black ──────
function FillText({
  children,
  className = '',
  scrollYProgress,
  fillStart,
  fillEnd,
}: {
  children: React.ReactNode;
  className?: string;
  scrollYProgress: ReturnType<typeof useScroll>['scrollYProgress'];
  fillStart: number;
  fillEnd: number;
}) {
  const clipPath = useTransform(
    scrollYProgress,
    [fillStart, fillEnd],
    ['inset(0 100% 0 0)', 'inset(0 0% 0 0)'],
  );

  return (
    <div className={`relative ${className}`}>
      {/* Base/Ghost */}
      <div className="text-black/20" aria-hidden>
        {children}
      </div>
      {/* Fill */}
      <motion.div
        className="absolute inset-0 overflow-hidden text-black"
        style={{ clipPath }}
      >
        {children}
      </motion.div>
    </div>
  );
}

export default function Contact() {
  const sectionRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end end'],
  });

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="relative bg-white overflow-hidden"
      style={{ minHeight: '100vh' }}
    >
      {/* ── 3D Canvas Background (Sand Physics Bricks) ── */}
      <div className="absolute inset-0 z-0 pointer-events-auto">
        <Canvas>
          <PerspectiveCamera makeDefault position={[0, 0, 15]} />
          <ambientLight intensity={1.5} />
          <directionalLight position={[10, 20, 10]} intensity={2.5} />
          <directionalLight position={[-10, -20, -10]} intensity={1} />
          <Environment preset="city" />

          <Suspense fallback={null}>
            <InstancedSandBricks count={1500} />
          </Suspense>
        </Canvas>
      </div>

      {/* ── Main content (overlay) ── */}
      <div className="relative z-10 max-w-7xl mx-auto px-8 md:px-16 pt-40 pb-0 pointer-events-none">

        {/* Label */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="flex items-center gap-3 mb-10 pointer-events-auto"
        >
          <div className="w-8 h-px bg-black" />
          <span className="font-sans text-[11px] font-semibold tracking-[0.28em] text-gray-400">
            Get In Touch
          </span>
        </motion.div>

        {/* ── Hero heading with scroll fill ── */}
        <div className="mb-16 pointer-events-auto">
          <FillText
            scrollYProgress={scrollYProgress}
            fillStart={0.4}
            fillEnd={0.7}
          >
            <h2
              className="font-heading font-bold leading-[1] tracking-tight"
              style={{ fontSize: 'clamp(3.5rem, 7.5vw, 9rem)' }}
            >
              Start Your
            </h2>
          </FillText>

          <FillText
            scrollYProgress={scrollYProgress}
            fillStart={0.5}
            fillEnd={0.8}
          >
            <h2
              className="font-heading font-normal leading-[1] tracking-tight"
              style={{ fontSize: 'clamp(3.5rem, 7.5vw, 9rem)', color: 'inherit' }}
            >
              Journey.
            </h2>
          </FillText>
        </div>

        {/* Two-column: body copy + form */}
        <div className="grid md:grid-cols-2 gap-16 mb-32 items-start pointer-events-auto">

          {/* Left — description + contact pills */}
          <div>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.15 }}
              className="font-sans text-xl md:text-2xl font-medium tracking-tight text-orange-500 max-w-sm leading-relaxed mb-10"
            >
              <span className="font-bold text-black">Ready to find your perfect home?</span> Let's talk about your vision and how Brickly can <span className="font-bold text-black">bring it to life.</span>
            </motion.p>

            <div className="flex flex-col gap-4">
              {[
                { icon: Phone, label: '+91 98765 43210', href: 'tel:+919876543210' },
                { icon: Mail, label: 'hello@bricklyhomes.in', href: 'mailto:hello@bricklyhomes.in' },
                { icon: MapPin, label: 'Mumbai · Pune · Bangalore', href: '#' },
              ].map(({ icon: Icon, label, href }, i) => (
                <motion.a
                  key={label}
                  href={href}
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 + i * 0.08 }}
                  className="flex items-center gap-3 group bg-white/40 p-1 pr-4 rounded-full backdrop-blur-sm border border-transparent hover:border-gray-200 transition-all self-start"
                >
                  <div className="w-9 h-9 rounded-full bg-white border border-gray-200 flex items-center justify-center group-hover:bg-black group-hover:border-black transition-colors duration-300">
                    <Icon className="w-3.5 h-3.5 text-gray-500 group-hover:text-white transition-colors duration-300" />
                  </div>
                  <span className="font-sans text-sm text-gray-500 group-hover:text-black transition-colors duration-200">
                    {label}
                  </span>
                </motion.a>
              ))}
            </div>
          </div>

          {/* Right — email capture */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-white/60 p-8 rounded-3xl backdrop-blur-md border border-gray-100 shadow-xl shadow-black/5 hover:-translate-y-2 hover:shadow-2xl transition-all duration-500"
          >
            <form className="space-y-4">
              <div>
                <label className="font-sans text-xs font-semibold tracking-widest text-gray-400 block mb-2">
                  Your Name
                </label>
                <input
                  type="text"
                  placeholder="Arjun Sharma"
                  className="w-full bg-transparent border-b border-gray-200 py-3 font-sans text-base text-black focus:outline-none focus:border-black transition-colors placeholder-gray-300"
                />
              </div>
              <div>
                <label className="font-sans text-xs font-semibold tracking-widest text-gray-400 block mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="hello@yourmail.com"
                  className="w-full bg-transparent border-b border-gray-200 py-3 font-sans text-base text-black focus:outline-none focus:border-black transition-colors placeholder-gray-300"
                />
              </div>

              <div className="pt-6">
                <button
                  type="submit"
                  className="group inline-flex items-center gap-3 px-8 py-4 bg-black text-white font-sans text-sm font-semibold rounded-full hover:bg-gray-800 transition-colors"
                >
                  Send Message
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>

      {/* ── BRICKLY HOMES large footer text ── */}
      <div className="relative z-10 w-full overflow-hidden border-t border-gray-100 pt-10 pb-0 pointer-events-none">
        <div className="w-full text-center">
          <div
            className="font-heading font-black text-black leading-none tracking-tighter w-full text-center pointer-events-auto"
            style={{ fontSize: 'clamp(4rem, 13vw, 16rem)' }}
          >
            BRICKLY
          </div>
        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div className="relative z-20 bg-black px-8 md:px-16 py-5 flex flex-col md:flex-row items-center justify-between gap-4 pointer-events-auto">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-white rounded-sm flex items-center justify-center shrink-0">
            <svg viewBox="0 0 24 24" fill="none" className="w-3.5 h-3.5 stroke-black" strokeWidth={2.5}>
              <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
          </div>
          <span className="font-heading font-bold text-sm text-white tracking-tight">BRICKLY</span>
          <span className="font-sans text-xs text-white/30 ml-4">© 2026 All rights reserved.</span>
        </div>

        <nav className="flex items-center gap-8 font-sans text-xs text-white/40 tracking-wider">
          <a href="#about" className="hover:text-white transition-colors">About</a>
          <a href="#projects" className="hover:text-white transition-colors">Projects</a>
          <a href="#gallery" className="hover:text-white transition-colors">Gallery</a>
          <a href="mailto:hello@bricklyhomes.in" className="hover:text-white transition-colors">Contact</a>
        </nav>
      </div>

    </section>
  );
}