"use client";

import React, { useState, useEffect, useRef } from "react";
import { Movie } from "@/types/movie";
import { getImageUrl, getMovieTrailer, getMovieDetails } from "@/services/tmdb";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Volume2, VolumeX, Tv, Film, PlayCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface MovieCardProps {
  movie: Movie;
  onClick: (movie: Movie) => void;
}

const MovieCard = ({ movie, onClick }: MovieCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [trailerKey, setTrailerKey] = useState<string | null>(null);
  const [watchLink, setWatchLink] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [showTrailer, setShowTrailer] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const hoverTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isHovered) {
      setIsLoading(true);
      hoverTimerRef.current = setTimeout(async () => {
        try {
          const [key, details] = await Promise.all([
            trailerKey ? Promise.resolve(trailerKey) : getMovieTrailer(movie.id),
            watchLink ? Promise.resolve({ watch_link: watchLink }) : getMovieDetails(movie.id)
          ]);
          
          if (key) {
            setTrailerKey(key);
            setShowTrailer(true);
          }
          if (details?.watch_link) setWatchLink(details.watch_link);
          setIsLoading(false);
        } catch (error) {
          console.error("Error loading trailer preview:", error);
          setIsLoading(false);
        }
      }, 600);
    } else {
      if (hoverTimerRef.current) {
        clearTimeout(hoverTimerRef.current);
        hoverTimerRef.current = null;
      }
      setShowTrailer(false);
      setIsLoading(false);
    }

    return () => {
      if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
    };
  }, [isHovered, movie.id, trailerKey, watchLink]);

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -8 }}
      className="relative group cursor-pointer rounded-2xl overflow-hidden bg-card shadow-2xl transition-all duration-500"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onClick(movie)}
    >
      <div className="aspect-[2/3] relative overflow-hidden bg-neutral-900">
        {/* Poster Image (Always present as background) */}
        <motion.img
          src={getImageUrl(movie.poster_path)}
          alt={movie.title}
          className={`w-full h-full object-cover transition-all duration-700 ${
            showTrailer ? "scale-110 blur-sm opacity-40" : "group-hover:scale-105"
          }`}
        />

        {/* Trailer Preview Layer */}
        <AnimatePresence>
          {showTrailer && trailerKey && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-10"
            >
              <div className="absolute inset-0 w-full h-full overflow-hidden">
                <iframe
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300%] h-[120%] pointer-events-none scale-110"
                  src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&mute=${isMuted ? 1 : 0}&controls=0&loop=1&playlist=${trailerKey}&rel=0&modestbranding=1&iv_load_policy=3&disablekb=1&showinfo=0&origin=${window.location.origin}`}
                  title="Trailer Preview"
                  allow="autoplay; encrypted-media"
                />
              </div>
              
              {/* Mute Toggle */}
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setIsMuted(!isMuted);
                }}
                className="absolute top-3 right-3 z-30 p-2 bg-black/40 backdrop-blur-xl rounded-full hover:bg-black/60 transition-all border border-white/10"
              >
                {isMuted ? <VolumeX className="w-3.5 h-3.5 text-white" /> : <Volume2 className="w-3.5 h-3.5 text-white" />}
              </button>

              {/* Live Indicator */}
              <div className="absolute top-3 left-3 z-30 flex items-center gap-1.5 px-2 py-1 bg-red-600/90 backdrop-blur-md rounded-md border border-red-500/50">
                <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                <span className="text-[8px] font-black text-white uppercase tracking-widest">Preview</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Loading State */}
        {isLoading && !showTrailer && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/20 backdrop-blur-[2px]">
            <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
          </div>
        )}

        {/* Overlay UI */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-5 z-20">
          <div className="flex items-center gap-2 mb-3">
            <Badge className="bg-primary text-primary-foreground border-none font-black px-2 py-0.5 text-[10px]">
              <Star className="w-3 h-3 fill-current mr-1" />
              {movie.vote_average.toFixed(1)}
            </Badge>
            {movie.release_date && (
              <span className="text-[10px] text-white/80 font-bold tracking-wider">{movie.release_date.split("-")[0]}</span>
            )}
          </div>
          
          <h3 className="text-white font-black text-base line-clamp-2 mb-5 leading-tight uppercase tracking-tighter group-hover:translate-y-0 translate-y-2 transition-transform duration-500">
            {movie.title}
          </h3>
          
          <div className="flex flex-col gap-2 group-hover:translate-y-0 translate-y-4 transition-transform duration-500 delay-75">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onClick(movie);
              }}
              className="w-full py-3 bg-white/10 hover:bg-white/20 backdrop-blur-2xl text-white rounded-xl text-[10px] font-black flex items-center justify-center gap-2 transition-all border border-white/10 uppercase tracking-widest"
            >
              <PlayCircle className="w-4 h-4 text-primary" />
              Details & Trailer
            </button>
            
            {watchLink && (
              <a 
                href={watchLink}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="w-full py-3 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl text-[10px] font-black flex items-center justify-center gap-2 transition-all shadow-xl shadow-primary/20 uppercase tracking-widest"
              >
                <Tv className="w-4 h-4" />
                Watch Now
              </a>
            )}
          </div>
        </div>
      </div>
      
      {/* AI Match Badge */}
      {movie._reason && (
        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-500 z-30 scale-90 group-hover:scale-100">
          <Badge className="bg-blue-600/90 backdrop-blur-md text-[9px] font-black border-none shadow-xl px-3 py-1">AI MATCH</Badge>
        </div>
      )}
    </motion.div>
  );
};

export default MovieCard;