import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Info, Search } from 'lucide-react';
import { getImageUrl } from '@/services/tmdb';
import { Input } from '@/components/ui/input';

interface HeroProps {
  movie: any;
  onSearch: (query: string) => void;
  onDetail: (movie: any) => void;
}

const Hero = ({ movie, onSearch, onDetail }: HeroProps) => {
  if (!movie) return null;

  return (
    <div className="relative h-[70vh] w-full overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={movie.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="absolute inset-0"
        >
          <img
            src={getImageUrl(movie.backdrop_path, 'original')}
            className="h-full w-full object-cover"
            alt={movie.title}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent" />
        </motion.div>
      </AnimatePresence>

      <div className="relative h-full container mx-auto px-6 flex flex-col justify-center max-w-4xl">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="space-y-6"
        >
          <div className="flex items-center gap-2">
            <span className="bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-widest">Trending Now</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-white leading-tight">
            {movie.title}
          </h1>
          <p className="text-lg text-zinc-300 max-w-2xl line-clamp-3">
            {movie.overview}
          </p>
          
          <div className="flex flex-wrap gap-4">
            <button 
              onClick={() => onDetail(movie)}
              className="bg-white text-black px-8 py-3 rounded-full font-bold flex items-center gap-2 hover:bg-zinc-200 transition-all transform hover:scale-105"
            >
              <Play className="w-5 h-5 fill-current" /> Watch Trailer
            </button>
            <button 
              onClick={() => onDetail(movie)}
              className="bg-zinc-800/80 text-white px-8 py-3 rounded-full font-bold flex items-center gap-2 hover:bg-zinc-700 transition-all backdrop-blur-md"
            >
              <Info className="w-5 h-5" /> More Info
            </button>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-12 max-w-md relative"
        >
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 w-5 h-5" />
          <Input
            placeholder="Search for a movie to get recommendations..."
            className="bg-zinc-900/50 border-zinc-800 text-white pl-12 h-14 rounded-2xl backdrop-blur-xl focus:ring-2 focus:ring-blue-500 transition-all"
            onKeyDown={(e) => {
              if (e.key === 'Enter') onSearch((e.target as HTMLInputElement).value);
            }}
          />
        </motion.div>
      </div>
    </div>
  );
};

export default Hero;