import React, { useEffect, useState } from "react";
import { Movie } from "@/types/movie";
import { fetchTrending, discoverMovies, getRecommendations, GENRE_MAP, MOOD_MAP } from "@/services/tmdb";
import MovieCard from "@/components/MovieCard";
import MovieDialog from "@/components/MovieDialog";
import SearchBar from "@/components/SearchBar";
import GenreFilter from "@/components/GenreFilter";
import MoodFilter from "@/components/MoodFilter";
import MobileNav from "@/components/MobileNav";
import Footer from "@/components/Footer";
import { MovieGridSkeleton } from "@/components/MovieSkeleton";
import { TrendingUp, Bookmark, BrainCircuit, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useWatchlist } from "@/hooks/use-watchlist";

const Index = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [recommendations, setRecommendations] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchedMovie, setSearchedMovie] = useState<Movie | null>(null);
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("home");
  
  const { watchlist } = useWatchlist();

  // Handle initial load and filters
  useEffect(() => {
    const loadMovies = async () => {
      setLoading(true);
      let data: Movie[] = [];
      
      if (selectedMood) {
        data = await discoverMovies(MOOD_MAP[selectedMood]);
      } else if (selectedGenre) {
        data = await discoverMovies([GENRE_MAP[selectedGenre]]);
      } else {
        data = await fetchTrending();
      }
      
      setMovies(data);
      setLoading(false);
    };

    loadMovies();
  }, [selectedGenre, selectedMood]);

  const handleMovieSelect = async (movie: Movie) => {
    setSearchedMovie(movie);
    setLoading(true);
    const recs = await getRecommendations(movie.id);
    setRecommendations(recs);
    setLoading(false);
    window.scrollTo({ top: 400, behavior: "smooth" });
  };

  const openDetails = (movie: Movie) => {
    setSelectedMovie(movie);
    setIsDialogOpen(true);
  };

  const handleMoodSelect = (mood: string | null) => {
    setSelectedMood(mood);
    setSelectedGenre(null);
  };

  const handleGenreSelect = (genre: string | null) => {
    setSelectedGenre(genre);
    setSelectedMood(null);
  };

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, filter: "blur(10px)" },
    visible: { 
      opacity: 1, 
      y: 0, 
      filter: "blur(0px)",
      transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
    },
  };

  const logoVariants = {
    hidden: { opacity: 0, scale: 0.8, filter: "blur(20px)" },
    visible: { 
      opacity: 1, 
      scale: 1, 
      filter: "blur(0px)",
      transition: { duration: 1.2, ease: [0.22, 1, 0.36, 1] }
    },
  };

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary selection:text-primary-foreground pb-24 md:pb-0 overflow-x-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/5 rounded-full blur-[120px] animate-pulse delay-1000" />
      </div>

      {/* Hero Section */}
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="relative min-h-[70vh] md:h-[80vh] flex flex-col items-center justify-center px-4 overflow-hidden pt-12 md:pt-0 z-10"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent opacity-50" />
        
        <motion.div variants={logoVariants} className="relative mb-8">
          <h1 className="text-7xl md:text-[12rem] font-black tracking-tighter text-white drop-shadow-[0_0_50px_rgba(255,255,255,0.15)] select-none">
            CINE<span className="text-primary">AI</span>
          </h1>
          <div className="absolute -inset-4 bg-primary/20 blur-3xl rounded-full opacity-20 animate-pulse" />
        </motion.div>
        
        <motion.div variants={itemVariants} className="w-full max-w-2xl mx-auto px-4">
          <SearchBar onSelect={handleMovieSelect} />
        </motion.div>

        <motion.div variants={itemVariants} className="pt-10 text-center">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/60 mb-6">Curated Discovery</p>
          <MoodFilter selected={selectedMood} onSelect={handleMoodSelect} />
        </motion.div>
      </motion.div>

      <main className="max-w-7xl mx-auto px-4 pb-20 space-y-20 md:space-y-32 relative z-10">
        {/* Watchlist Section */}
        {watchlist.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div className="flex items-end justify-between border-b border-white/5 pb-6">
              <div className="space-y-1">
                <h2 className="text-3xl md:text-4xl font-black flex items-center gap-4 text-white tracking-tighter">
                  <Bookmark className="text-primary w-8 h-8" />
                  YOUR COLLECTION
                </h2>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
              {watchlist.map((movie) => (
                <MovieCard key={movie.id} movie={movie} onClick={openDetails} />
              ))}
            </div>
          </motion.section>
        )}

        {/* Recommendations Section */}
        <AnimatePresence mode="wait">
          {recommendations.length > 0 && (
            <motion.section
              key="recommendations"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.6 }}
              className="space-y-8"
            >
              <div className="flex items-end justify-between border-b border-white/5 pb-6">
                <div className="space-y-1">
                  <h2 className="text-3xl md:text-4xl font-black flex items-center gap-4 text-white tracking-tighter">
                    <BrainCircuit className="text-primary w-8 h-8" />
                    AI PICKS
                  </h2>
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Inspired by <span className="text-primary">"{searchedMovie?.title}"</span></p>
                </div>
              </div>
              {loading ? <MovieGridSkeleton /> : (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                  {recommendations.map((movie) => (
                    <MovieCard key={movie.id} movie={movie} onClick={openDetails} />
                  ))}
                </div>
              )}
            </motion.section>
          )}
        </AnimatePresence>

        {/* Main Discovery Section */}
        <motion.section 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="space-y-8"
        >
          <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-white/5 pb-6 gap-6">
            <div className="space-y-1">
              <h2 className="text-3xl md:text-4xl font-black flex items-center gap-4 text-white tracking-tighter uppercase">
                {selectedMood || selectedGenre ? (
                  <Sparkles className="text-primary w-8 h-8" />
                ) : (
                  <TrendingUp className="text-primary w-8 h-8" />
                )}
                {selectedMood ? selectedMood.replace('-', ' ') : selectedGenre ? selectedGenre : "Trending"}
              </h2>
            </div>
            <div className="w-full md:w-auto">
              <GenreFilter selected={selectedGenre} onSelect={handleGenreSelect} />
            </div>
          </div>
          {loading ? <MovieGridSkeleton count={12} /> : (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
              {movies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} onClick={openDetails} />
              ))}
            </div>
          )}
        </motion.section>
      </main>

      <MovieDialog
        movie={selectedMovie}
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
      />
      
      <MobileNav 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
        watchlistCount={watchlist.length} 
      />

      <Footer />
    </div>
  );
};

export default Index;