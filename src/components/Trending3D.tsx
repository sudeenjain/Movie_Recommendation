"use client";

import React from "react";
import { motion } from "framer-motion";
import { Movie } from "@/types/movie";
import { getImageUrl } from "@/services/tmdb";
import { Star, Play } from "lucide-react";

interface TrendingProps {
  movies: Movie[];
  onSelect: (movie: Movie) => void;
}

const Trending3D = ({ movies, onSelect }: TrendingProps) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  
  return (
    <div className="relative w-full overflow-hidden py-4 md:py-8">
      <div 
        ref={containerRef}
        className="flex gap-4 md:gap-6 overflow-x-auto pb-8 no-scrollbar px-6 md:px-12"
      >
        {movies.map((movie, i) => (
          <TrendingCard key={movie.id} movie={movie} index={i} onClick={() => onSelect(movie)} />
        ))}
      </div>
    </div>
  );
};

const TrendingCard = ({ movie, index, onClick }: { movie: Movie, index: number, onClick: () => void }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
      onClick={onClick}
      className="flex-shrink-0 w-[140px] md:w-[200px] aspect-[2/3] relative group cursor-pointer rounded-md overflow-hidden bg-[#111] transition-transform duration-300 transform hover:scale-105 hover:shadow-[0_0_40px_rgba(255,255,255,0.08)]"
    >
      {/* Poster */}
      <img
        src={getImageUrl(movie.poster_path, "w500")}
        className="absolute inset-0 w-full h-full object-cover"
        alt={movie.title}
      />

      {/* Rating Floating */}
      <div className="absolute top-2 right-2 z-20">
         <div className="flex items-center gap-1 bg-black/60 backdrop-blur-md px-1.5 py-0.5 rounded text-white/90">
            <Star className="w-3 h-3 fill-white/80" />
            <span className="text-xs font-semibold">{movie.vote_average.toFixed(1)}</span>
         </div>
      </div>

      {/* Info */}
      <div className="absolute inset-x-0 bottom-0 p-3 z-20 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
         <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-transparent -z-10" />
         
         <div className="relative space-y-1.5">
            <h3 className="text-sm font-semibold text-white leading-tight truncate">
              {movie.title}
            </h3>
            
            <div className="pt-1">
               <button className="flex items-center justify-center gap-1.5 w-full py-1.5 bg-white text-black rounded font-semibold text-xs hover:bg-white/90 transition-colors">
                  <Play className="w-3 h-3 fill-black text-black" />
                  Play
               </button>
            </div>
         </div>
      </div>
    </motion.div>
  );
};

export default Trending3D;
