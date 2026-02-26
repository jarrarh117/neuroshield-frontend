'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial } from '@react-three/drei';
import { useRef, Suspense, useState } from 'react';
import * as THREE from 'three';
import { motion } from 'framer-motion';

interface Stat3DProps {
  number: string;
  label: string;
  index: number;
}

function AnimatedNumber({ text, position }: { text: string; position: [number, number, number] }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5 + position[0]) * 0.1;
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime + position[0]) * 0.1;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.3} floatIntensity={0.5}>
      <mesh ref={meshRef} position={position}>
        <boxGeometry args={[0.8, 0.8, 0.3]} />
        <MeshDistortMaterial
          color="#38bdf8"
          attach="material"
          distort={0.2}
          speed={2}
          roughness={0.1}
          metalness={0.9}
        />
      </mesh>
      <pointLight position={position} intensity={0.5} color="#38bdf8" distance={2} />
    </Float>
  );
}

export function Stats3D({ number, label, index }: Stat3DProps) {
  return (
    <motion.div
      className="relative text-center"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      {/* 3D Background */}
      <div className="absolute inset-0 -z-10 opacity-50">
        <Canvas
          camera={{ position: [0, 0, 3], fov: 50 }}
          gl={{ alpha: true, antialias: true }}
          dpr={[1, 2]}
        >
          <Suspense fallback={null}>
            <ambientLight intensity={0.5} />
            <AnimatedNumber text={number} position={[0, 0, 0]} />
          </Suspense>
        </Canvas>
      </div>

      {/* Content */}
      <motion.div
        className="relative z-10"
        whileHover={{ scale: 1.1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="text-4xl sm:text-5xl font-bold text-primary mb-2 drop-shadow-[0_0_10px_rgba(56,189,248,0.5)]">
          {number}
        </div>
        <div className="text-sm text-muted-foreground">{label}</div>
      </motion.div>
    </motion.div>
  );
}
