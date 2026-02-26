'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Shield, Lock, Zap, Eye } from 'lucide-react';

interface LandingLoaderProps {
  onComplete?: () => void;
  duration?: number;
}

const loadingStages = [
  { text: 'Initializing Neural Network...', icon: Zap },
  { text: 'Loading AI Models...', icon: Shield },
  { text: 'Securing Connection...', icon: Lock },
  { text: 'Activating Protection...', icon: Eye },
];

export function LandingLoader({ onComplete, duration = 3000 }: LandingLoaderProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [progress, setProgress] = useState(0);
  const [stageIndex, setStageIndex] = useState(0);

  useEffect(() => {
    // Smooth progress animation
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 2;
      });
    }, duration / 50);

    // Stage progression
    const stageInterval = setInterval(() => {
      setStageIndex((prev) => (prev + 1) % loadingStages.length);
    }, duration / loadingStages.length);

    const timer = setTimeout(() => {
      setIsVisible(false);
      onComplete?.();
    }, duration);

    return () => {
      clearTimeout(timer);
      clearInterval(progressInterval);
      clearInterval(stageInterval);
    };
  }, [duration, onComplete]);

  const currentStage = loadingStages[stageIndex];
  const StageIcon = currentStage.icon;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 overflow-hidden"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
        >
          {/* Animated grid background */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute inset-0" style={{
              backgroundImage: `
                linear-gradient(to right, rgba(56, 189, 248, 0.1) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(56, 189, 248, 0.1) 1px, transparent 1px)
              `,
              backgroundSize: '50px 50px',
            }} />
          </div>

          {/* Animated background particles with varied sizes */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(40)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full"
                style={{
                  width: Math.random() * 4 + 1,
                  height: Math.random() * 4 + 1,
                  background: i % 3 === 0 
                    ? 'rgba(56, 189, 248, 0.4)' 
                    : i % 3 === 1 
                    ? 'rgba(168, 85, 247, 0.4)' 
                    : 'rgba(59, 130, 246, 0.4)',
                }}
                initial={{
                  x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
                  y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1000),
                  scale: 0,
                }}
                animate={{
                  scale: [0, 1, 0],
                  opacity: [0, 1, 0],
                  y: [
                    Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1000),
                    Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1000) - 200,
                  ],
                }}
                transition={{
                  duration: 3 + Math.random() * 3,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                  ease: 'easeInOut',
                }}
              />
            ))}
          </div>

          {/* Orbiting particles around shield */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={`orbit-${i}`}
                className="absolute w-2 h-2 bg-primary/60 rounded-full"
                style={{
                  filter: 'blur(1px)',
                }}
                animate={{
                  rotate: 360,
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  rotate: {
                    duration: 4,
                    repeat: Infinity,
                    ease: 'linear',
                    delay: (i * 0.5),
                  },
                  scale: {
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  },
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    left: '50%',
                    top: '50%',
                    transform: `translate(-50%, -50%) translateX(${80 + i * 10}px)`,
                  }}
                />
              </motion.div>
            ))}
          </div>

          {/* Main loader content */}
          <div className="relative z-10 flex flex-col items-center gap-8">
            {/* Animated Shield Icon with multiple layers */}
            <motion.div
              className="relative"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            >
              {/* Outer expanding rings */}
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={`ring-${i}`}
                  className="absolute inset-0 rounded-full border-2 border-primary/20"
                  style={{
                    width: 96 + i * 40,
                    height: 96 + i * 40,
                    left: '50%',
                    top: '50%',
                    transform: 'translate(-50%, -50%)',
                  }}
                  animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.5, 0, 0.5],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: i * 0.4,
                  }}
                />
              ))}

              {/* Outer glow ring with enhanced effect */}
              <motion.div
                className="absolute inset-0 rounded-full"
                animate={{
                  boxShadow: [
                    '0 0 30px 15px rgba(56, 189, 248, 0.4)',
                    '0 0 60px 30px rgba(168, 85, 247, 0.6)',
                    '0 0 30px 15px rgba(56, 189, 248, 0.4)',
                  ],
                }}
                transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
              />

              {/* Rotating outer ring */}
              <motion.div
                className="absolute -inset-6 border-2 border-primary/30 rounded-full"
                style={{
                  borderStyle: 'dashed',
                }}
                animate={{ rotate: 360 }}
                transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
              />

              {/* Counter-rotating middle ring */}
              <motion.div
                className="absolute -inset-4 border-2 border-accent/30 rounded-full"
                animate={{ rotate: -360 }}
                transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
              />

              {/* Shield icon container with enhanced gradient */}
              <motion.div
                className="relative w-24 h-24 flex items-center justify-center bg-gradient-to-br from-primary/30 via-accent/20 to-primary/30 rounded-full backdrop-blur-sm border-2 border-primary/40 shadow-2xl"
                animate={{
                  scale: [1, 1.08, 1],
                  borderColor: ['rgba(56, 189, 248, 0.4)', 'rgba(168, 85, 247, 0.6)', 'rgba(56, 189, 248, 0.4)'],
                }}
                transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
              >
                <motion.div
                  animate={{
                    rotate: [0, 5, -5, 0],
                  }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <Shield className="w-12 h-12 text-primary drop-shadow-lg" strokeWidth={2} />
                </motion.div>
              </motion.div>

              {/* Inner pulse waves */}
              {[0, 1].map((i) => (
                <motion.div
                  key={`pulse-${i}`}
                  className="absolute inset-0 rounded-full bg-gradient-to-r from-primary/30 to-accent/30"
                  animate={{
                    scale: [1, 2, 1],
                    opacity: [0.6, 0, 0.6],
                  }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: i * 1.25,
                  }}
                />
              ))}
            </motion.div>

            {/* Brand name with enhanced gradient */}
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <motion.h1 
                className="text-5xl font-bold mb-3"
                animate={{
                  textShadow: [
                    '0 0 20px rgba(56, 189, 248, 0.5)',
                    '0 0 40px rgba(168, 85, 247, 0.7)',
                    '0 0 20px rgba(56, 189, 248, 0.5)',
                  ],
                }}
                transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
              >
                <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
                  NeuroShield
                </span>
              </motion.h1>
              
              {/* Dynamic loading stage with icon */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={stageIndex}
                  className="flex items-center justify-center gap-2 text-muted-foreground text-sm"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <StageIcon className="w-4 h-4 text-primary" />
                  <span>{currentStage.text}</span>
                </motion.div>
              </AnimatePresence>
            </motion.div>

            {/* Enhanced progress bar with glow */}
            <motion.div
              className="relative w-72 h-2 bg-muted/30 rounded-full overflow-hidden shadow-inner"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.8 }}
            >
              <motion.div
                className="h-full bg-gradient-to-r from-primary via-accent to-primary rounded-full relative"
                style={{ width: `${progress}%` }}
                transition={{ duration: 0.1 }}
                animate={{
                  backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                }}
              >
                {/* Glow effect on progress bar */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                  animate={{
                    x: ['-100%', '200%'],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: 'linear',
                  }}
                />
              </motion.div>
              
              {/* Progress percentage */}
              <motion.div
                className="absolute -top-6 right-0 text-xs font-mono text-primary"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
              >
                {Math.round(progress)}%
              </motion.div>
            </motion.div>

            {/* Enhanced loading dots with different animation */}
            <motion.div
              className="flex gap-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 1 }}
            >
              {[0, 1, 2, 3].map((i) => (
                <motion.div
                  key={i}
                  className="w-2.5 h-2.5 rounded-full bg-gradient-to-br from-primary to-accent"
                  animate={{
                    scale: [1, 1.8, 1],
                    opacity: [0.4, 1, 0.4],
                    y: [0, -10, 0],
                  }}
                  transition={{
                    duration: 1.2,
                    repeat: Infinity,
                    delay: i * 0.15,
                    ease: 'easeInOut',
                  }}
                />
              ))}
            </motion.div>
          </div>

          {/* Bottom text with animation */}
          <motion.div
            className="absolute bottom-8 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.5 }}
          >
            <p className="text-xs text-muted-foreground mb-1">Powered by AI Intelligence</p>
            <motion.div
              className="flex items-center justify-center gap-1 text-[10px] text-muted-foreground/60"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Lock className="w-3 h-3" />
              <span>Secure • Private • Fast</span>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
