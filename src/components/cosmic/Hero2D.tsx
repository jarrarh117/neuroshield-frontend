'use client';

import { motion } from 'framer-motion';
import { Shield } from 'lucide-react';

export function Hero2D() {
  return (
    <div className="absolute inset-0 w-full h-full flex items-center justify-center overflow-hidden opacity-30">
      {/* Animated gradient orbs */}
      <motion.div
        className="absolute w-64 h-64 rounded-full blur-3xl opacity-40"
        style={{
          background: 'radial-gradient(circle, rgba(168,85,247,0.6) 0%, transparent 70%)',
        }}
        animate={{
          scale: [1, 1.2, 1],
          x: [-50, 50, -50],
          y: [-30, 30, -30],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      
      <motion.div
        className="absolute w-64 h-64 rounded-full blur-3xl opacity-40"
        style={{
          background: 'radial-gradient(circle, rgba(56,189,248,0.6) 0%, transparent 70%)',
        }}
        animate={{
          scale: [1.2, 1, 1.2],
          x: [50, -50, 50],
          y: [30, -30, 30],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 1,
        }}
      />

      {/* Central shield with rings */}
      <div className="relative opacity-50">
        {/* Outer rotating rings */}
        {[0, 1, 2].map((i) => (
          <motion.div
            key={`ring-${i}`}
            className="absolute inset-0 rounded-full border border-primary/10"
            style={{
              width: 150 + i * 50,
              height: 150 + i * 50,
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
            }}
            animate={{
              rotate: i % 2 === 0 ? 360 : -360,
              scale: [1, 1.05, 1],
            }}
            transition={{
              rotate: {
                duration: 20 + i * 5,
                repeat: Infinity,
                ease: 'linear',
              },
              scale: {
                duration: 3,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: i * 0.5,
              },
            }}
          />
        ))}

        {/* Pulsing glow rings */}
        {[0, 1].map((i) => (
          <motion.div
            key={`glow-${i}`}
            className="absolute inset-0 rounded-full"
            style={{
              width: 120,
              height: 120,
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
              background: 'radial-gradient(circle, rgba(168,85,247,0.2) 0%, transparent 70%)',
            }}
            animate={{
              scale: [1, 2, 1],
              opacity: [0.3, 0, 0.3],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeOut',
              delay: i * 1.5,
            }}
          />
        ))}

        {/* Central shield */}
        <motion.div
          className="relative w-24 h-24 rounded-full bg-gradient-to-br from-primary/20 via-accent/10 to-primary/20 backdrop-blur-sm border border-primary/20 shadow-2xl flex items-center justify-center"
          animate={{
            boxShadow: [
              '0 0 30px rgba(168,85,247,0.2)',
              '0 0 50px rgba(56,189,248,0.3)',
              '0 0 30px rgba(168,85,247,0.2)',
            ],
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <motion.div
            animate={{
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <Shield className="w-12 h-12 text-primary/40 drop-shadow-lg" strokeWidth={1.5} />
          </motion.div>
        </motion.div>

        {/* Orbiting particles */}
        {[...Array(6)].map((_, i) => {
          const angle = (i / 6) * Math.PI * 2;
          const radius = 80;
          return (
            <motion.div
              key={`particle-${i}`}
              className="absolute w-2 h-2 rounded-full bg-primary/30 shadow-lg shadow-primary/30"
              style={{
                left: '50%',
                top: '50%',
              }}
              animate={{
                x: [
                  Math.cos(angle) * radius,
                  Math.cos(angle + Math.PI * 2) * radius,
                ],
                y: [
                  Math.sin(angle) * radius,
                  Math.sin(angle + Math.PI * 2) * radius,
                ],
                scale: [1, 1.3, 1],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: 'linear',
                delay: i * 0.3,
              }}
            />
          );
        })}
      </div>

      {/* Animated grid overlay */}
      <div className="absolute inset-0 opacity-5">
        <motion.div
          className="w-full h-full"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(168,85,247,0.3) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(168,85,247,0.3) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
          }}
          animate={{
            backgroundPosition: ['0px 0px', '60px 60px'],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      </div>
    </div>
  );
}
