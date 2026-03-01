"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface IntroAnimationProps {
  onComplete: () => void;
}

const IntroAnimation = ({ onComplete }: IntroAnimationProps) => {
  const [isVisible, setIsVisible] = useState(true);
  const letters = "CINEAI".split("");
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Initialize audio
    const audio = new Audio("https://assets.mixkit.co/active_storage/sfx/2436/2436-preview.mp3");
    audio.volume = 0.4;
    audioRef.current = audio;

    // Play sound when the component mounts
    // Note: Browsers may block autoplay until user interaction, 
    // but we'll attempt it for the cinematic experience.
    const playSound = async () => {
      try {
        await audio.play();
      } catch (err) {
        console.log("Autoplay sound blocked by browser");
      }
    };

    playSound();

    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onComplete, 1000); // Wait for exit animation
    }, 3500);

    return () => {
      clearTimeout(timer);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [onComplete]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
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
      z: 100,
      filter: "blur(20px)",
      y: 100
    },
    visible: { 
      opacity: 1, 
      scale: 1, 
      z: 0,
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

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black overflow-hidden"
        >
          {/* Cinematic Background Glow */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.2, 0.1] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent"
          />

          <div className="flex items-center justify-center gap-2 md:gap-4">
            {letters.map((char, i) => (
              <motion.span
                key={i}
                variants={letterVariants}
                className={`text-7xl md:text-[12rem] font-black tracking-tighter select-none ${
                  i >= 4 ? "text-primary" : "text-white"
                } drop-shadow-[0_0_30px_rgba(255,255,255,0.2)]`}
                style={{
                  textShadow: i >= 4 ? "0 0 50px rgba(0,150,255,0.5)" : "none"
                }}
              >
                {char}
              </motion.span>
            ))}
          </div>

          {/* Scanning Light Effect */}
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: "200%" }}
            transition={{ duration: 2, delay: 1, ease: "easeInOut" }}
            className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-12 pointer-events-none"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default IntroAnimation;