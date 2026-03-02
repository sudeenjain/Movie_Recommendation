"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface IntroAnimationProps {
  onComplete: () => void;
}

const IntroAnimation = ({ onComplete }: IntroAnimationProps) => {
  const [isVisible, setIsVisible] = useState(true);
  const [text, setText] = useState("");
  const fullText = "CINEAI";
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*";

  useEffect(() => {
    let iteration = 0;
    const interval = setInterval(() => {
      setText(
        fullText
          .split("")
          .map((letter, index) => {
            if (index < iteration) return fullText[index];
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join("")
      );

      if (iteration >= fullText.length) {
        clearInterval(interval);
        setTimeout(() => {
          setIsVisible(false);
          setTimeout(onComplete, 1000);
        }, 1500);
      }

      iteration += 1 / 3;
    }, 50);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ 
            opacity: 0,
            scale: 1.05,
            filter: "blur(20px)",
            transition: { duration: 0.8, ease: [0.43, 0.13, 0.23, 0.96] }
          }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black overflow-hidden"
        >
          {/* Cinematic Background Elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <motion.div 
              animate={{ 
                opacity: [0.1, 0.3, 0.1],
                scale: [1, 1.1, 1]
              }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent"
            />
            
            {/* Scanning Grid */}
            <div className="absolute inset-0 opacity-[0.03]" 
                 style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} 
            />
          </div>

          {/* Technical Metadata */}
          <div className="absolute top-12 left-12 space-y-1 hidden md:block">
            <motion.p 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 0.4, x: 0 }}
              className="text-[10px] font-mono text-white tracking-[0.3em] uppercase"
            >
              System: Neural_Engine_v4.0
            </motion.p>
            <motion.p 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 0.4, x: 0 }}
              transition={{ delay: 0.1 }}
              className="text-[10px] font-mono text-white tracking-[0.3em] uppercase"
            >
              Status: Decoding_Cinematic_Data...
            </motion.p>
          </div>

          <div className="relative">
            {/* Main Logo Text */}
            <motion.h1 
              className="text-7xl md:text-[12rem] font-black tracking-tighter select-none flex"
            >
              {text.split("").map((char, i) => (
                <span 
                  key={i} 
                  className={i >= 4 ? "text-primary" : "text-white"}
                  style={{
                    textShadow: i >= 4 ? "0 0 40px rgba(var(--primary-rgb), 0.5)" : "0 0 40px rgba(255,255,255,0.1)"
                  }}
                >
                  {char}
                </span>
              ))}
            </motion.h1>

            {/* Scanning Laser Line */}
            <motion.div
              initial={{ top: "-20%", opacity: 0 }}
              animate={{ top: "120%", opacity: [0, 1, 1, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="absolute left-0 right-0 h-[2px] bg-primary/50 shadow-[0_0_15px_rgba(var(--primary-rgb),0.8)] z-20"
            />
          </div>

          {/* Bottom Progress Indicator */}
          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-48 space-y-2">
            <div className="h-[1px] w-full bg-white/10 overflow-hidden">
              <motion.div 
                initial={{ x: "-100%" }}
                animate={{ x: "0%" }}
                transition={{ duration: 2, ease: "easeInOut" }}
                className="h-full w-full bg-primary"
              />
            </div>
            <div className="flex justify-between text-[8px] font-mono text-white/30 tracking-widest uppercase">
              <span>Initializing</span>
              <span>100%</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default IntroAnimation;