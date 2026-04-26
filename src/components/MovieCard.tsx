"use client";

import React, { useState } from "react";
import { Movie } from "@/types/movie";
import { getImageUrl } from "@/services/tmdb";
import { motion } from "framer-motion";
import { Star, PlayCircle, Bookmark, Check } from "lucide-react";
import { useWatchlist } from "@/hooks/use-watchlist";
import { cn } from "@/lib/utils";

interface MovieCardProps {
  movie: Movie;
  onClick: (movie: Movie) => void;
  index?: number;
}

const MovieCard = ({ movie, onClick, index = 0 }: MovieCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const { toggleWatchlist, isInWatchlist } = useWatchlist();
  const inWatchlist = isInWatchlist(movie.id);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onClick(movie)}
      className="relative cursor-pointer group"
    >
      <div className="relative aspect-[2/3] rounded-md overflow-hidden bg-[#111] transition-transform duration-300 transform group-hover:scale-105 group-hover:shadow-[0_0_40px_rgba(255,255,255,0.08)]">
        
        {/* Poster */}
        <img
          src={getImageUrl(movie.poster_path)}
          alt={movie.title}
          className="w-full h-full object-cover"
        />

        {/* Rating Floating */}
        <div className="absolute top-2 right-2 z-20">
           <div className="flex items-center gap-1 bg-black/60 backdrop-blur-md px-1.5 py-0.5 rounded text-white/90">
              <Star className="w-3 h-3 fill-white/80" />
              <span className="text-xs font-medium">{movie.vote_average.toFixed(1)}</span>
           </div>
        </div>

        {/* Content Info */}
        <div className="absolute inset-x-0 bottom-0 p-3 z-20 space-y-2 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
           <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent -z-10" />
           
           <div className="relative space-y-2">
              <h3 className="text-sm font-semibold text-white leading-tight">
                {movie.title}
              </h3>
              <p className="text-[11px] text-white/50 font-medium">
                {movie.release_date?.split("-")[0]}
              </p>

              <div className="flex items-center gap-2 pt-1">
                 <button className="flex-1 h-7 bg-white rounded text-black text-xs font-semibold flex items-center justify-center gap-1.5 hover:bg-white/90 transition-colors">
                    <PlayCircle className="w-3 h-3" />
                    Details
                 </button>
                 <button 
                  onClick={(e) => { e.stopPropagation(); toggleWatchlist(movie); }}
                  className="h-7 w-7 rounded bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-colors backdrop-blur-md"
                 >
                    {inWatchlist ? <Check className="w-3.5 h-3.5" /> : <Bookmark className="w-3.5 h-3.5" />}
                 </button>
              </div>
           </div>
        </div>
      </div>
    </motion.div>
  );
};

export default MovieCard;