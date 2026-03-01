"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Loader2 } from "lucide-react";
import { getRandomMovie } from "@/services/tmdb";
import { Movie } from "@/types/movie";

interface SurpriseMeProps {
  onSelect: (movie: Movie) => void;
}

const SurpriseMe = ({ onSelect }: SurpriseMeProps) => {
  const [loading, setLoading] = useState(false);

  const handleSurprise = async () => {
    setLoading(true);
    try {
      const movie = await getRandomMovie();
      // Artificial delay for cinematic effect
      setTimeout(() => {
        onSelect(movie);
        setLoading(false);
      }, 1500);
    } catch (error) {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-24 md:bottom-8 right-8 z-50">
      <motion.button
        whileHover={{ scale: 1.1, rotate: 5 }}
        whileTap={{ scale: 0.9 }}
        onClick={handleSurprise}
        disabled={loading}
        className="relative group flex items-center gap-3 px-6 py-4 bg-primary text-primary-foreground rounded-full font-black uppercase tracking-widest text-xs shadow-2xl shadow-primary/40 border border-white/20 overflow-hidden"
      >
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0, rotate: -180 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: 180 }}
            >
              <Loader2 className="w-5 h-5 animate-spin" />
            </motion.div>
          ) : (
            <motion.div
              key="icon"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              className="flex items-center gap-3"
            >
              <Sparkles className="w-5 h-5" />
              <span>Surprise Me</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Animated Background Glow */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
      </motion.button>

      {/* Loading Overlay for the whole screen */}
      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-md flex items-center justify-center pointer-events-none"
          >
            <div className="text-center space-y-6">
              <motion.div
                animate={{ 
                  scale: [1, 1.2, 1],
                  rotate: [0, 360],
                }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-20 h-20 border-4 border-primary border-t-transparent rounded-full mx-auto"
              />
              <p className="text-white font-black uppercase tracking-[0.5em] text-xl animate-pulse">
                Finding your next favorite...
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SurpriseMe;