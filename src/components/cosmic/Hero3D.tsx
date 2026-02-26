'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float, MeshDistortMaterial, Sphere } from '@react-three/drei';
import { useRef, Suspense, useState } from 'react';
import * as THREE from 'three';

function Shield3D() {
  const meshRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.005;
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
    }
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.2;
    }
  });

  return (
    <group ref={groupRef}>
      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
        {/* Main Shield */}
        <mesh ref={meshRef} position={[0, 0, 0]}>
          <cylinderGeometry args={[1.5, 1.5, 0.3, 6]} />
          <MeshDistortMaterial
            color="#a855f7"
            attach="material"
            distort={0.3}
            speed={2}
            roughness={0.2}
            metalness={0.8}
          />
        </mesh>

        {/* Shield Glow */}
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[1.6, 1.6, 0.35, 6]} />
          <meshBasicMaterial color="#38bdf8" transparent opacity={0.3} />
        </mesh>

        {/* Inner Core */}
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[0.5, 32, 32]} />
          <meshStandardMaterial
            color="#60a5fa"
            emissive="#38bdf8"
            emissiveIntensity={0.5}
            metalness={0.9}
            roughness={0.1}
          />
        </mesh>

        {/* Orbiting Particles */}
        {[...Array(8)].map((_, i) => {
          const angle = (i / 8) * Math.PI * 2;
          const radius = 2;
          const time = Date.now() * 0.001;
          return (
            <mesh
              key={i}
              position={[
                Math.cos(angle + time) * radius,
                Math.sin(angle * 2 + time) * 0.5,
                Math.sin(angle + time) * radius,
              ]}
            >
              <sphereGeometry args={[0.1, 16, 16]} />
              <meshStandardMaterial
                color="#38bdf8"
                emissive="#38bdf8"
                emissiveIntensity={1}
              />
            </mesh>
          );
        })}
      </Float>

      {/* Point Lights */}
      <pointLight position={[2, 2, 2]} intensity={1} color="#38bdf8" />
      <pointLight position={[-2, -2, -2]} intensity={0.5} color="#a855f7" />
    </group>
  );
}

function FloatingParticles() {
  const particlesRef = useRef<THREE.Points>(null);
  const [positions] = useState(() => {
    const particleCount = 100;
    const pos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 10;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 10;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    return pos;
  });

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.05;
      particlesRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.1;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color="#38bdf8"
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
}

function AnimatedSphere({ position }: { position: [number, number, number] }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime + position[0]) * 0.5;
    }
  });

  return (
    <Float speed={3} rotationIntensity={1} floatIntensity={2}>
      <Sphere ref={meshRef} args={[0.3, 32, 32]} position={position}>
        <MeshDistortMaterial
          color="#60a5fa"
          attach="material"
          distort={0.5}
          speed={3}
          roughness={0}
          metalness={1}
        />
      </Sphere>
    </Float>
  );
}

export function Hero3D() {
  return (
    <div className="absolute inset-0 w-full h-full">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 50 }}
        gl={{ alpha: true, antialias: true }}
        dpr={[1, 2]}
      >
        <Suspense fallback={null}>
          {/* Lighting */}
          <ambientLight intensity={0.3} />
          <directionalLight position={[5, 5, 5]} intensity={1} color="#ffffff" />
          <directionalLight position={[-5, -5, -5]} intensity={0.5} color="#a855f7" />

          {/* Main 3D Shield */}
          <Shield3D />

          {/* Floating Particles */}
          <FloatingParticles />

          {/* Decorative Spheres */}
          <AnimatedSphere position={[-3, 1, -2]} />
          <AnimatedSphere position={[3, -1, -2]} />
          <AnimatedSphere position={[0, 2, -3]} />

          {/* Controls - subtle auto-rotation */}
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            autoRotate
            autoRotateSpeed={0.5}
            maxPolarAngle={Math.PI / 2}
            minPolarAngle={Math.PI / 2}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
