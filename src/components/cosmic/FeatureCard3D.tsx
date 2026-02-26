'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { RoundedBox, MeshDistortMaterial, Float } from '@react-three/drei';
import { useRef, Suspense, useState } from 'react';
import * as THREE from 'three';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface FeatureCard3DProps {
  icon: LucideIcon;
  title: string;
  description: string;
  color?: string;
}

function FloatingIcon({ color = '#38bdf8' }: { color?: string }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.3;
      meshRef.current.rotation.y += 0.01;
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.1;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <RoundedBox ref={meshRef} args={[1, 1, 0.2]} radius={0.1} smoothness={4}>
        <MeshDistortMaterial
          color={color}
          attach="material"
          distort={0.3}
          speed={2}
          roughness={0.2}
          metalness={0.8}
        />
      </RoundedBox>

      {/* Glow effect */}
      <pointLight position={[0, 0, 1]} intensity={1} color={color} distance={3} />
    </Float>
  );
}

export function FeatureCard3D({ icon: Icon, title, description, color = '#38bdf8' }: FeatureCard3DProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className="relative h-full"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ scale: 1.05, z: 50 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="cosmic-card border-primary/20 h-full relative overflow-hidden group">
        {/* 3D Background Canvas */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <Canvas
            camera={{ position: [0, 0, 3], fov: 50 }}
            gl={{ alpha: true, antialias: true }}
            dpr={[1, 2]}
          >
            <Suspense fallback={null}>
              <ambientLight intensity={0.5} />
              <FloatingIcon color={color} />
            </Suspense>
          </Canvas>
        </div>

        {/* Gradient overlay */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-2xl" />

        <CardHeader className="relative z-10">
          <motion.div
            className="mb-4 p-3 rounded-lg bg-primary/10 border border-primary/20 w-fit"
            animate={{
              boxShadow: isHovered
                ? `0 0 20px ${color}40`
                : '0 0 0px transparent',
            }}
            transition={{ duration: 0.3 }}
          >
            <Icon className="h-6 w-6 text-primary" />
          </motion.div>
          <CardTitle className="text-xl">{title}</CardTitle>
        </CardHeader>
        <CardContent className="relative z-10">
          <CardDescription className="text-base">{description}</CardDescription>
        </CardContent>

        {/* Animated border glow */}
        <motion.div
          className="absolute inset-0 rounded-lg"
          style={{
            background: `linear-gradient(45deg, ${color}20, transparent)`,
          }}
          animate={{
            opacity: isHovered ? 1 : 0,
          }}
          transition={{ duration: 0.3 }}
        />
      </Card>
    </motion.div>
  );
}
