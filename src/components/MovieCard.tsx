import React from 'react';
import { motion } from 'framer-motion';
import { Star, Play, Plus } from 'lucide-react';
import { getImageUrl } from '@/services/tmdb';
import { Badge } from '@/components/ui/badge';

interface MovieCardProps {
  movie: any;
  onClick: (movie: any) => void;
}

const MovieCard = ({ movie, onClick }: MovieCardProps) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -10 }}
      className="group relative cursor-pointer overflow-hidden rounded-xl bg-zinc-900 shadow-xl transition-all duration-300"
      onClick={() => onClick(movie)}
    >
      <div className="aspect-[2/3] w-full overflow-hidden">
        <img
          src={getImageUrl(movie.poster_path)}
          alt={movie.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
      </div>
      
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <div className="absolute bottom-0 p-4 w-full">
          <div className="flex items-center justify-between mb-2">
            <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-500 border-none">
              <Star className="w-3 h-3 mr-1 fill-current" />
              {movie.vote_average?.toFixed(1)}
            </Badge>
            <span className="text-xs text-zinc-400">
              {movie.release_date?.split('-')[0]}
            </span>
          </div>
          <h3 className="text-white font-bold text-sm line-clamp-2 mb-3">{movie.title}</h3>
          <div className="flex gap-2">
            <button className="flex-1 bg-white text-black py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1 hover:bg-zinc-200 transition-colors">
              <Play className="w-3 h-3 fill-current" /> Details
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default MovieCard;