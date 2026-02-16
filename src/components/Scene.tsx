"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Stars, MeshDistortMaterial } from "@react-three/drei";
import { useRef, useMemo } from "react";
import * as THREE from "three";

/* ——— Floating orb with distortion ——— */
function GlowOrb({
  position,
  color,
  size = 1.2,
  speed = 0.3,
}: {
  position: [number, number, number];
  color: string;
  size?: number;
  speed?: number;
}) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.x = state.clock.elapsedTime * speed * 0.5;
    ref.current.rotation.y = state.clock.elapsedTime * speed;
  });

  return (
    <Float speed={1.5} rotationIntensity={0.4} floatIntensity={1.8}>
      <mesh ref={ref} position={position}>
        <sphereGeometry args={[size, 64, 64]} />
        <MeshDistortMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.6}
          roughness={0.2}
          metalness={0.8}
          distort={0.45}
          speed={2}
          transparent
          opacity={0.7}
        />
      </mesh>
    </Float>
  );
}

/* ——— Particle Field ——— */
function ParticleField({ count = 300 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 30;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 30;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 30;
    }
    return pos;
  }, [count]);

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.y = state.clock.elapsedTime * 0.02;
    ref.current.rotation.x = state.clock.elapsedTime * 0.01;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial size={0.03} color="#6366f1" transparent opacity={0.6} sizeAttenuation />
    </points>
  );
}

/* ——— Main Scene ——— */
export default function Scene() {
  return (
    <div className="fixed inset-0 -z-10">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 50 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
      >
        <color attach="background" args={["#030014"]} />

        {/* Starfield */}
        <Stars
          radius={80}
          depth={60}
          count={3000}
          factor={3}
          saturation={0}
          fade
          speed={0.5}
        />

        {/* Particles */}
        <ParticleField count={400} />

        {/* Lighting */}
        <ambientLight intensity={0.3} />
        <pointLight position={[10, 8, 10]} intensity={2} color="#6366f1" />
        <pointLight position={[-8, -5, -10]} intensity={1.5} color="#22d3ee" />
        <pointLight position={[0, 10, -5]} intensity={1} color="#a855f7" />

        {/* Orbs */}
        <GlowOrb position={[-4, 2.5, -4]} color="#6366f1" size={1.4} speed={0.2} />
        <GlowOrb position={[4.5, -1.5, -6]} color="#22d3ee" size={1} speed={0.35} />
        <GlowOrb position={[0, -3, -8]} color="#a855f7" size={1.8} speed={0.15} />
      </Canvas>

      {/* Gradient overlay — gives depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#030014]/50 to-[#030014] pointer-events-none" />
    </div>
  );
}
