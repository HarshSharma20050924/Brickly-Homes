import { motion } from 'motion/react';
import { useState, useEffect, useRef, Suspense, useMemo } from 'react';
import { Phone, Mail, MapPin } from 'lucide-react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, Float, Environment, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';

// Use Vite's ?url import to get the path to the glb file
import brickUrl from '../../stylized_mossy_brick.glb?url';

// ─── 3D Instanced Physics Bricks ──────────────────────────────────────────────
function InstancedBricks({ count = 1000 }) {
  const { scene } = useGLTF(brickUrl);
  
  // Extract all meshes in case the GLTF is composed of multiple parts
  const meshes = useMemo(() => {
    const arr: THREE.Mesh[] = [];
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        arr.push(child as THREE.Mesh);
      }
    });
    return arr;
  }, [scene]);

  const refs = useRef<(THREE.InstancedMesh | null)[]>([]);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  
  // Initialize data for 1000 bricks in a dense, flowing pattern
  const particleData = useMemo(() => {
    const data = [];
    for (let i = 0; i < count; i++) {
      const basePos = new THREE.Vector3(
        (Math.random() - 0.5) * 20, // Much narrower X spread for density
        (Math.random() - 0.5) * 25, // Vertical spread
        (Math.random() - 0.5) * 4 - 2 // Tightly packed in Z
      );
      
      data.push({
        basePos,
        pos: basePos.clone(),
        targetRot: new THREE.Euler(
          Math.random() * Math.PI * 2,
          Math.random() * Math.PI * 2,
          Math.random() * Math.PI * 2
        ),
        currentQuat: new THREE.Quaternion(),
        scale: 0.0015 + Math.random() * 0.002, // Very small 'coffee bean' size
        speed: 0.2 + Math.random() * 0.8,
        offset: Math.random() * 1000
      });
    }
    return data;
  }, [count]);

  useFrame((state, delta) => {
    const cursorWorldPos = new THREE.Vector3(
      (state.pointer.x * state.viewport.width) / 2,
      (state.pointer.y * state.viewport.height) / 2,
      -2 // Approximate interaction depth
    );

    const repelRadius = 4;
    const time = state.clock.elapsedTime;

    particleData.forEach((data, i) => {
      // Calculate fluid-like organic floating
      const floatY = Math.sin(time * data.speed + data.offset) * 0.3;
      const floatX = Math.cos(time * data.speed * 0.8 + data.offset) * 0.1;
      
      const targetPos = data.basePos.clone();
      targetPos.y += floatY;
      targetPos.x += floatX;

      // Physics distance check
      const dist = cursorWorldPos.distanceTo(data.basePos);
      
      if (dist < repelRadius) {
        // Calculate physics repulsion
        const dir = data.basePos.clone().sub(cursorWorldPos).normalize();
        const force = Math.pow((repelRadius - dist) / repelRadius, 2) * 3; // Smooth falloff force
        
        targetPos.add(dir.multiplyScalar(force));

        // Tumble! Add rotation based on push direction
        data.targetRot.x += dir.y * force * delta * 4;
        data.targetRot.y += dir.x * force * delta * 4;
      }

      // Smooth lerp to target position (fast out, slow return)
      data.pos.lerp(targetPos, dist < repelRadius ? 0.2 : 0.02);

      // Smooth quaternion slerp for tumbling
      const targetQuat = new THREE.Quaternion().setFromEuler(data.targetRot);
      data.currentQuat.slerp(targetQuat, 0.1);

      // Apply transformations to dummy object
      dummy.position.copy(data.pos);
      dummy.quaternion.copy(data.currentQuat);
      dummy.scale.set(data.scale, data.scale, data.scale);
      dummy.updateMatrix();
      
      // Update all meshes at this index
      refs.current.forEach(mesh => {
        if (mesh) mesh.setMatrixAt(i, dummy.matrix);
      });
    });

    // Notify ThreeJS that the instance matrices have changed
    refs.current.forEach(mesh => {
      if (mesh) mesh.instanceMatrix.needsUpdate = true;
    });
  });

  return (
    <group>
      {meshes.map((mesh, idx) => (
        <instancedMesh
          key={idx}
          ref={(el) => (refs.current[idx] = el)}
          args={[mesh.geometry, mesh.material, count]}
        />
      ))}
    </group>
  );
}


// ─── Camera Rig for Parallax ──────────────────────────────────────────────────
function Rig() {
  useFrame((state) => {
    // Subtle camera parallax to add depth
    state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, state.pointer.x * 2, 0.05);
    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, state.pointer.y * 2, 0.05);
    state.camera.lookAt(0, 0, 0);
  });
  return null;
}

// ─── Main Contact Section ────────────────────────────────────────────────────
export default function Contact() {
  return (
    <section className="relative w-full min-h-screen bg-white overflow-hidden">
      
      {/* 3D Canvas covers the entire section as background */}
      <div className="absolute inset-0 z-0">
        <Canvas>
          <PerspectiveCamera makeDefault position={[0, 0, 15]} />
          {/* Brighter lights to match the white background */}
          <ambientLight intensity={1.5} />
          <directionalLight position={[10, 20, 10]} intensity={2.5} />
          <directionalLight position={[-10, -20, -10]} intensity={1} />
          <Environment preset="city" />
          
          <Suspense fallback={null}>
            <InstancedBricks count={1000} />
          </Suspense>
          <Rig />
        </Canvas>
      </div>

      {/* Content overlay container (pointer-events-none lets mouse pass through to Canvas) */}
      <div className="relative z-10 w-full min-h-screen flex flex-col justify-between pointer-events-none">
        
        {/* CTA block (pointer-events-auto so form is clickable) */}
        <div className="pt-40 max-w-4xl mx-auto px-12 xl:px-20 text-center pointer-events-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="bg-white/60 backdrop-blur-md p-10 rounded-3xl shadow-[0_0_40px_rgba(0,0,0,0.05)] border border-white/50"
          >
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="h-px w-10 bg-black" />
              <span className="font-sans text-[10px] font-bold tracking-[0.3em] uppercase text-gray-400">
                Brickly Homes · Get In Touch
              </span>
              <div className="h-px w-10 bg-black" />
            </div>

            <motion.h2
              initial={{ opacity: 0, y: 60, filter: 'blur(8px)' }}
              whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="font-heading font-bold text-[clamp(2.8rem,5vw,6rem)] text-black leading-[1.02] mb-8 whitespace-pre-line"
            >
              {'Start Your\nJourney.'}
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="font-sans text-lg text-gray-500 max-w-lg mx-auto mb-14 leading-relaxed"
            >
              Ready to find your perfect home? Let's talk about your vision and how we can bring it to life.
            </motion.p>

            <motion.form
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="flex gap-3 max-w-md mx-auto"
            >
              <input
                type="email"
                placeholder="Your email address"
                className="flex-1 bg-white border border-gray-200 rounded-full px-6 py-4 font-sans text-sm text-black focus:outline-none focus:border-black transition-colors placeholder-gray-400 shadow-sm"
              />
              <button
                type="submit"
                className="px-8 py-4 bg-black text-white font-sans text-sm font-bold tracking-[0.1em] uppercase rounded-full hover:bg-gray-800 transition-colors shrink-0 shadow-xl"
              >
                Connect
              </button>
            </motion.form>

            {/* Contact pills */}
            <div className="flex flex-wrap items-center justify-center gap-4 mt-10">
              {[
                { icon: Phone, label: '+91 98765 43210', href: 'tel:+919876543210' },
                { icon: Mail, label: 'hello@bricklyhomes.in', href: 'mailto:hello@bricklyhomes.in' },
                { icon: MapPin, label: 'Mumbai · Pune · Bangalore', href: '#' },
              ].map(({ icon: Icon, label, href }) => (
                <a key={label} href={href} className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-gray-200 bg-white/50 font-sans text-sm text-gray-500 hover:border-black hover:text-black transition-colors">
                  <Icon className="w-3.5 h-3.5" />
                  {label}
                </a>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Big Text Above Footer */}
        <div className="w-full text-center pb-8 pt-20 overflow-hidden">
          <h3 className="font-heading font-black text-[12vw] text-black tracking-tighter leading-[0.8] mix-blend-overlay opacity-90">
            BRICKLY<br/>HOMES
          </h3>
        </div>

        {/* Bottom bar (pointer-events-auto so links work) */}
        <div className="bg-black px-12 xl:px-20 py-6 flex flex-col md:flex-row items-center justify-between gap-4 pointer-events-auto">
          <p className="font-sans text-xs text-white/50 tracking-widest uppercase">
            © 2026 Brickly Homes. All rights reserved.
          </p>
          <nav className="flex items-center gap-8 font-sans text-xs text-white/50 uppercase tracking-wider">
            <a href="#about" className="hover:text-white transition-colors">About</a>
            <a href="#projects" className="hover:text-white transition-colors">Projects</a>
            <a href="#gallery" className="hover:text-white transition-colors">Gallery</a>
            <a href="mailto:hello@bricklyhomes.in" className="hover:text-white transition-colors">Contact</a>
          </nav>
        </div>

      </div>
    </section>
  );
}
