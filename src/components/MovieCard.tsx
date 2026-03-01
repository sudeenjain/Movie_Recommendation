import React, { useState, useEffect } from "react";
import { Movie } from "@/types/movie";
import { getImageUrl, getMovieTrailer } from "@/services/tmdb";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Play, Volume2, VolumeX } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface MovieCardProps {
  movie: Movie;
  onClick: (movie: Movie) => void;
}

const MovieCard = ({ movie, onClick }: MovieCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [trailerKey, setTrailerKey] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [showTrailer, setShowTrailer] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isHovered) {
      timer = setTimeout(async () => {
        if (!trailerKey) {
          const key = await getMovieTrailer(movie.id);
          setTrailerKey(key);
        }
        setShowTrailer(true);
      }, 800); // Delay to prevent accidental triggers while scrolling
    } else {
      setShowTrailer(false);
    }
    return () => clearTimeout(timer);
  }, [isHovered, movie.id, trailerKey]);

  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -5 }}
      className="relative group cursor-pointer rounded-xl overflow-hidden bg-card shadow-lg transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onClick(movie)}
    >
      <div className="aspect-[2/3] relative overflow-hidden">
        <AnimatePresence mode="wait">
          {showTrailer && trailerKey ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-10 bg-black"
            >
              <iframe
                className="w-full h-full scale-[1.5] pointer-events-none"
                src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&mute=${isMuted ? 1 : 0}&controls=0&loop=1&playlist=${trailerKey}&rel=0&modestbranding=1`}
                title="Trailer Preview"
                allow="autoplay; encrypted-media"
              />
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setIsMuted(!isMuted);
                }}
                className="absolute bottom-2 right-2 z-20 p-1.5 bg-black/50 backdrop-blur-md rounded-full hover:bg-black/80 transition-colors"
              >
                {isMuted ? <VolumeX className="w-3 h-3 text-white" /> : <Volume2 className="w-3 h-3 text-white" />}
              </button>
            </motion.div>
          ) : (
            <motion.img
              key="poster"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              src={getImageUrl(movie.poster_path)}
              alt={movie.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          )}
        </AnimatePresence>

        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 z-20">
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="secondary" className="bg-yellow-500 text-black border-none">
              <Star className="w-3 h-3 fill-current mr-1" />
              {movie.vote_average.toFixed(1)}
            </Badge>
            {movie.release_date && (
              <span className="text-xs text-white/80">{movie.release_date.split("-")[0]}</span>
            )}
          </div>
          <h3 className="text-white font-bold text-sm line-clamp-2 mb-2">{movie.title}</h3>
          <button className="w-full py-2 bg-primary text-primary-foreground rounded-lg text-xs font-bold flex items-center justify-center gap-2">
            <Play className="w-3 h-3 fill-current" />
            Details
          </button>
        </div>
      </div>
      {movie._reason && (
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-30">
          <Badge className="bg-blue-600/90 backdrop-blur-sm text-[10px]">AI Match</Badge>
        </div>
      )}
    </motion.div>
  );
};

export default MovieCard;