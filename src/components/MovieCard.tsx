"use client";

import React, { useState, useEffect, useRef } from "react";
import { Movie } from "@/types/movie";
import { getImageUrl, getMovieTrailer, getMovieDetails } from "@/services/tmdb";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Volume2, VolumeX, Tv, PlayCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

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
  const isMobile = useIsMobile();

  useEffect(() => {
    if (isHovered && !isMobile) {
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
  }, [isHovered, movie.id, trailerKey, watchLink, isMobile]);

  return (
    <motion.div
      whileHover={!isMobile ? { scale: 1.02, y: -8 } : {}}
      whileTap={{ scale: 0.98 }}
      className="relative group cursor-pointer rounded-2xl overflow-hidden bg-card shadow-2xl transition-all duration-500"
      onMouseEnter={() => !isMobile && setIsHovered(true)}
      onMouseLeave={() => !isMobile && setIsHovered(false)}
      onClick={() => onClick(movie)}
    >
      <div className="aspect-[2/3] relative overflow-hidden bg-neutral-900">
        <motion.img
          src={getImageUrl(movie.poster_path)}
          alt={movie.title}
          className={cn(
            "w-full h-full object-cover transition-all duration-700",
            showTrailer ? "scale-110 blur-sm opacity-40" : "group-hover:scale-105",
            isMobile && "opacity-60"
          )}
        />

        <AnimatePresence>
          {showTrailer && trailerKey && !isMobile && (
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
              
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setIsMuted(!isMuted);
                }}
                className="absolute top-3 right-3 z-30 p-2 bg-black/40 backdrop-blur-xl rounded-full hover:bg-black/60 transition-all border border-white/10"
              >
                {isMuted ? <VolumeX className="w-3.5 h-3.5 text-white" /> : <Volume2 className="w-3.5 h-3.5 text-white" />}
              </button>

              <div className="absolute top-3 left-3 z-30 flex items-center gap-1.5 px-2 py-1 bg-red-600/90 backdrop-blur-md rounded-md border border-red-500/50">
                <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                <span className="text-[8px] font-black text-white uppercase tracking-widest">Preview</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {isLoading && !showTrailer && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/20 backdrop-blur-[2px]">
            <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
          </div>
        )}

        <div className={cn(
          "absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent transition-all duration-500 flex flex-col justify-end p-4 z-20",
          isMobile ? "opacity-100" : "opacity-0 group-hover:opacity-100"
        )}>
          <div className="flex items-center gap-2 mb-2">
            <Badge className="bg-primary text-primary-foreground border-none font-black px-2 py-0.5 text-[9px]">
              <Star className="w-2.5 h-2.5 fill-current mr-1" />
              {movie.vote_average.toFixed(1)}
            </Badge>
            {movie.release_date && (
              <span className="text-[9px] text-white/80 font-bold tracking-wider">{movie.release_date.split("-")[0]}</span>
            )}
          </div>
          
          <h3 className="text-white font-black text-sm line-clamp-2 mb-4 leading-tight uppercase tracking-tighter">
            {movie.title}
          </h3>
          
          <div className="flex flex-col gap-2">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onClick(movie);
              }}
              className="w-full py-2.5 bg-white/10 hover:bg-white/20 backdrop-blur-2xl text-white rounded-xl text-[9px] font-black flex items-center justify-center gap-2 transition-all border border-white/10 uppercase tracking-widest active:scale-95"
            >
              <PlayCircle className="w-3.5 h-3.5 text-primary" />
              Details
            </button>
          </div>
        </div>
      </div>
      
      {movie._reason && (
        <div className={cn(
          "absolute top-3 right-3 z-30 transition-all duration-500",
          isMobile ? "opacity-100" : "opacity-0 group-hover:opacity-100"
        )}>
          <Badge className="bg-blue-600/90 backdrop-blur-md text-[8px] font-black border-none shadow-xl px-2 py-0.5">AI MATCH</Badge>
        </div>
      )}
    </motion.div>
  );
};

export default MovieCard;