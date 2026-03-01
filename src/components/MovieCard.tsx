"use client";

import React, { useState, useEffect } from "react";
import { Movie } from "@/types/movie";
import { getImageUrl, getMovieTrailer, getMovieDetails } from "@/services/tmdb";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Volume2, VolumeX, Tv, Film } from "lucide-react";
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

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isHovered) {
      timer = setTimeout(async () => {
        try {
          const [key, details] = await Promise.all([
            trailerKey ? Promise.resolve(trailerKey) : getMovieTrailer(movie.id),
            watchLink ? Promise.resolve({ watch_link: watchLink }) : getMovieDetails(movie.id)
          ]);
          
          if (key) setTrailerKey(key);
          if (details?.watch_link) setWatchLink(details.watch_link);
          setShowTrailer(true);
        } catch (error) {
          console.error("Error loading trailer preview:", error);
        }
      }, 600);
    } else {
      setShowTrailer(false);
    }
    return () => clearTimeout(timer);
  }, [isHovered, movie.id, trailerKey, watchLink]);

  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -5 }}
      className="relative group cursor-pointer rounded-xl overflow-hidden bg-card shadow-lg transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onClick(movie)}
    >
      <div className="aspect-[2/3] relative overflow-hidden bg-black">
        <AnimatePresence mode="wait">
          {showTrailer && trailerKey ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-10"
            >
              <div className="absolute inset-0 w-full h-full overflow-hidden">
                <iframe
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300%] h-[100%] pointer-events-none"
                  src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&mute=${isMuted ? 1 : 0}&controls=0&loop=1&playlist=${trailerKey}&rel=0&modestbranding=1&iv_load_policy=3&disablekb=1`}
                  title="Trailer Preview"
                  allow="autoplay; encrypted-media"
                />
              </div>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setIsMuted(!isMuted);
                }}
                className="absolute bottom-3 right-3 z-20 p-2 bg-black/60 backdrop-blur-md rounded-full hover:bg-black/80 transition-colors border border-white/10"
              >
                {isMuted ? <VolumeX className="w-4 h-4 text-white" /> : <Volume2 className="w-4 h-4 text-white" />}
              </button>
            </motion.div>
          ) : (
            <motion.img
              key="poster"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              src={getImageUrl(movie.poster_path)}
              alt={movie.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
          )}
        </AnimatePresence>

        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 z-20">
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="secondary" className="bg-primary text-primary-foreground border-none font-bold px-2 py-0.5">
              <Star className="w-3 h-3 fill-current mr-1" />
              {movie.vote_average.toFixed(1)}
            </Badge>
            {movie.release_date && (
              <span className="text-xs text-white/90 font-bold drop-shadow-md">{movie.release_date.split("-")[0]}</span>
            )}
          </div>
          <h3 className="text-white font-black text-sm line-clamp-2 mb-4 drop-shadow-lg uppercase tracking-tight">{movie.title}</h3>
          
          <div className="grid grid-cols-1 gap-2">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onClick(movie);
              }}
              className="py-2.5 bg-white/15 hover:bg-white/25 backdrop-blur-xl text-white rounded-xl text-[10px] font-black flex items-center justify-center gap-2 transition-all border border-white/10"
            >
              <Film className="w-3.5 h-3.5" />
              TRAILER & INFO
            </button>
            {watchLink && (
              <a 
                href={watchLink}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="py-2.5 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl text-[10px] font-black flex items-center justify-center gap-2 transition-all shadow-xl shadow-primary/30"
              >
                <Tv className="w-3.5 h-3.5" />
                WATCH FULL MOVIE
              </a>
            )}
          </div>
        </div>
      </div>
      {movie._reason && (
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity z-30">
          <Badge className="bg-blue-600/90 backdrop-blur-md text-[10px] font-black border-none shadow-lg">AI MATCH</Badge>
        </div>
      )}
    </motion.div>
  );
};

export default MovieCard;