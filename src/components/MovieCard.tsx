import React, { useState, useEffect } from "react";
import { Movie } from "@/types/movie";
import { getImageUrl, getMovieTrailer, getMovieDetails } from "@/services/tmdb";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Play, Volume2, VolumeX, Tv } from "lucide-react";
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
        const [key, details] = await Promise.all([
          trailerKey ? Promise.resolve(trailerKey) : getMovieTrailer(movie.id),
          watchLink ? Promise.resolve({ watch_link: watchLink }) : getMovieDetails(movie.id)
        ]);
        
        setTrailerKey(key);
        if (details.watch_link) setWatchLink(details.watch_link);
        setShowTrailer(true);
      }, 800);
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

        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 z-20">
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="secondary" className="bg-primary text-primary-foreground border-none font-bold">
              <Star className="w-3 h-3 fill-current mr-1" />
              {movie.vote_average.toFixed(1)}
            </Badge>
            {movie.release_date && (
              <span className="text-xs text-white/80 font-medium">{movie.release_date.split("-")[0]}</span>
            )}
          </div>
          <h3 className="text-white font-bold text-sm line-clamp-2 mb-3">{movie.title}</h3>
          
          <div className="grid grid-cols-2 gap-2">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onClick(movie);
              }}
              className="py-2 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white rounded-lg text-[10px] font-bold flex items-center justify-center gap-1.5 transition-colors"
            >
              <Play className="w-3 h-3 fill-current" />
              DETAILS
            </button>
            {watchLink && (
              <a 
                href={watchLink}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg text-[10px] font-bold flex items-center justify-center gap-1.5 transition-all shadow-lg shadow-primary/20"
              >
                <Tv className="w-3 h-3" />
                WATCH
              </a>
            )}
          </div>
        </div>
      </div>
      {movie._reason && (
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-30">
          <Badge className="bg-blue-600/90 backdrop-blur-sm text-[10px] font-bold">AI MATCH</Badge>
        </div>
      )}
    </motion.div>
  );
};

export default MovieCard;