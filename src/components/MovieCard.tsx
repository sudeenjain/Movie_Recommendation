import React from "react";
import { Movie } from "@/types/movie";
import { getImageUrl } from "@/services/tmdb";
import { motion } from "framer-motion";
import { Star, Play } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface MovieCardProps {
  movie: Movie;
  onClick: (movie: Movie) => void;
}

const MovieCard = ({ movie, onClick }: MovieCardProps) => {
  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -5 }}
      className="relative group cursor-pointer rounded-xl overflow-hidden bg-card shadow-lg transition-all duration-300"
      onClick={() => onClick(movie)}
    >
      <div className="aspect-[2/3] relative">
        <img
          src={getImageUrl(movie.poster_path)}
          alt={movie.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
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
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Badge className="bg-blue-600/90 backdrop-blur-sm text-[10px]">AI Match</Badge>
        </div>
      )}
    </motion.div>
  );
};

export default MovieCard;