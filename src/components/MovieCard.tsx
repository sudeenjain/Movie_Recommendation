"use client";

import React, { useState, useEffect, useRef } from "react";
import { Movie } from "@/types/movie";
import { getImageUrl, getMovieTrailer, getMovieDetails } from "@/services/tmdb";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Volume2, VolumeX, PlayCircle, Bookmark, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useIsMobile } from "@/hooks/use-mobile";
import { useWatchlist } from "@/hooks/use-watchlist";
import { cn } from "@/lib/utils";

interface MovieCardProps {
  movie: Movie;
  onClick: (movie: Movie) => void;
  index?: number;
}

const MovieCard = ({ movie, onClick, index = 0 }: MovieCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [trailerKey, setTrailerKey] = useState<string | null>(null);
  const [watchLink, setWatchLink] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [showTrailer, setShowTrailer] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const hoverTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isMobile = useIsMobile();
  const { toggleWatchlist, isInWatchlist } = useWatchlist();

  const inWatchlist = isInWatchlist(movie.id);

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
          setIsLoading(false);
        }
      }, 600);
    } else {
      if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
      setShowTrailer(false);
      setIsLoading(false);
    }
    return () => { if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current); };
  }, [isHovered, movie.id, trailerKey, watchLink, isMobile]);

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWatchlist(movie);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: (index % 6) * 0.1 }}
      whileHover={!isMobile ? { scale: 1.05, y: -12, zIndex: 40 } : {}}
      whileTap={{ scale: 0.95 }}
      className="relative group cursor-pointer rounded-2xl overflow-hidden bg-card shadow-2xl"
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
            showTrailer ? "scale-110 blur-md opacity-30" : "group-hover:scale-110",
            isMobile && "opacity-70"
          )}
        />

        {/* Quick Save Button */}
        <button
          onClick={handleSave}
          className={cn(
            "absolute top-3 right-3 z-30 p-2.5 rounded-xl backdrop-blur-xl border transition-all duration-300",
            inWatchlist 
              ? "bg-primary border-primary text-primary-foreground shadow-lg shadow-primary/20" 
              : "bg-black/40 border-white/10 text-white hover:bg-white/20",
            !isMobile && "opacity-0 group-hover:opacity-100"
          )}
        >
          {inWatchlist ? <Check className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
        </button>

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
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300%] h-[120%] pointer-events-none scale-125"
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
                className="absolute top-3 left-3 z-30 p-2 bg-black/60 backdrop-blur-xl rounded-full hover:bg-primary transition-all border border-white/10"
              >
                {isMuted ? <VolumeX className="w-3.5 h-3.5 text-white" /> : <Volume2 className="w-3.5 h-3.5 text-white" />}
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <div className={cn(
          "absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent transition-all duration-500 flex flex-col justify-end p-5 z-20",
          isMobile ? "opacity-100" : "opacity-0 group-hover:opacity-100"
        )}>
          <motion.div 
            initial={false}
            animate={isHovered || isMobile ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
            className="space-y-3"
          >
            <div className="flex items-center gap-2">
              <Badge className="bg-primary text-primary-foreground border-none font-black px-2 py-0.5 text-[10px]">
                <Star className="w-3 h-3 fill-current mr-1" />
                {movie.vote_average.toFixed(1)}
              </Badge>
              <span className="text-[10px] text-white/80 font-bold tracking-widest">{movie.release_date?.split("-")[0]}</span>
            </div>
            
            <h3 className="text-white font-black text-base line-clamp-2 leading-tight uppercase tracking-tighter">
              {movie.title}
            </h3>
            
            <button className="w-full py-3 bg-primary text-primary-foreground rounded-xl text-[10px] font-black flex items-center justify-center gap-2 transition-all uppercase tracking-widest shadow-lg shadow-primary/20">
              <PlayCircle className="w-4 h-4" />
              View Details
            </button>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default MovieCard;