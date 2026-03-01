"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface IntroAnimationProps {
  onComplete: () => void;
}

const IntroAnimation = ({ onComplete }: IntroAnimationProps) => {
  const [isVisible, setIsVisible] = useState(true);
  const letters = "CINEAI".split("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onComplete, 1000); // Wait for exit animation
    }, 4500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
    exit: {
      opacity: 0,
      scale: 1.1,
      filter: "blur(20px)",
      transition: { duration: 1, ease: "easeInOut" }
    }
  };

  const letterVariants = {
    hidden: { 
      opacity: 0, 
      scale: 4, 
      filter: "blur(20px)",
      y: 100
    },
    visible: { 
      opacity: 1, 
      scale: 1, 
      filter: "blur(0px)",
      y: 0,
      transition: { 
        type: "spring",
        damping: 12,
        stiffness: 100,
        duration: 0.8 
      }
    }
  };

  const rippleVariants = {
    start: { scale: 0.8, opacity: 0.5 },
    end: { 
      scale: 2, 
      opacity: 0,
      transition: { duration: 1, ease: "easeOut" }
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black overflow-hidden"
        >
          {/* Cinematic Background Glow */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.2, 0.1] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent"
          />

          {/* Visual Sound Waves (Equalizer) */}
          <div className="absolute bottom-20 flex items-end gap-1 h-32">
            {Array.from({ length: 40 }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ height: 4 }}
                animate={{ 
                  height: [4, Math.random() * 100 + 10, 4],
                }}
                transition={{ 
                  duration: 0.5, 
                  repeat: Infinity, 
                  delay: i * 0.02,
                  ease: "easeInOut"
                }}
                className="w-1 bg-primary/40 rounded-full"
              />
            ))}
          </div>

          <div className="relative flex items-center justify-center gap-2 md:gap-4">
            {letters.map((char, i) => (
              <div key={i} className="relative">
                <motion.span
                  variants={letterVariants}
                  className={`text-7xl md:text-[12rem] font-black tracking-tighter select-none ${
                    i >= 4 ? "text-primary" : "text-white"
                  } drop-shadow-[0_0_30px_rgba(255,255,255,0.2)] relative z-10`}
                  style={{
                    textShadow: i >= 4 ? "0 0 50px rgba(0,150,255,0.5)" : "none"
                  }}
                >
                  {char}
                </motion.span>

                {/* Sonic Ripple Effect on each letter impact */}
                <motion.div
                  variants={rippleVariants}
                  initial="start"
                  animate="end"
                  className="absolute inset-0 border-2 border-primary/30 rounded-full z-0"
                />
              </div>
            ))}
          </div>

          {/* Scanning Light Effect */}
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: "200%" }}
            transition={{ duration: 2, delay: 1, ease: "easeInOut" }}
            className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-12 pointer-events-none"
          />

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5 }}
            className="mt-8 text-[10px] font-black uppercase tracking-[1em] text-muted-foreground/60"
          >
            Experience the Future of Cinema
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default IntroAnimation;