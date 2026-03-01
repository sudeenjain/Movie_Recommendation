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
    setSelectedGenre(null); // Clear genre when mood is selected
  };

  const handleGenreSelect = (genre: string | null) => {
    setSelectedGenre(genre);
    setSelectedMood(null); // Clear mood when genre is selected
  };

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary selection:text-primary-foreground pb-24 md:pb-0">
      {/* Hero Section */}
      <div className="relative min-h-[60vh] md:h-[70vh] flex flex-col items-center justify-center px-4 overflow-hidden pt-12 md:pt-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent opacity-50" />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 text-center space-y-6 max-w-4xl"
        >
          <h1 className="text-5xl md:text-9xl font-black tracking-tighter text-white">
            CINE<span className="text-primary">AI</span>
          </h1>
          
          <div className="pt-4 md:pt-8 w-full max-w-2xl mx-auto">
            <SearchBar onSelect={handleMovieSelect} />
          </div>

          <div className="pt-6">
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">Or discover by vibe</p>
            <MoodFilter selected={selectedMood} onSelect={handleMoodSelect} />
          </div>
        </motion.div>
      </div>

      <main className="max-w-7xl mx-auto px-4 pb-20 space-y-16 md:space-y-24">
        {/* Watchlist Section */}
        {watchlist.length > 0 && (
          <motion.section
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6 md:space-y-8"
          >
            <div className="flex items-end justify-between border-b border-border pb-4">
              <div className="space-y-1">
                <h2 className="text-2xl md:text-3xl font-black flex items-center gap-3 text-white">
                  <Bookmark className="text-primary w-6 h-6 md:w-8 md:h-8" />
                  Your Watchlist
                </h2>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6">
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
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6 md:space-y-8"
            >
              <div className="flex items-end justify-between border-b border-border pb-4">
                <div className="space-y-1">
                  <h2 className="text-2xl md:text-3xl font-black flex items-center gap-3 text-white">
                    <BrainCircuit className="text-primary w-6 h-6 md:w-8 md:h-8" />
                    AI Recommendations
                  </h2>
                  <p className="text-sm text-muted-foreground">Based on your interest in <span className="text-primary font-bold">"{searchedMovie?.title}"</span></p>
                </div>
              </div>
              {loading ? <MovieGridSkeleton /> : (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6">
                  {recommendations.map((movie) => (
                    <MovieCard key={movie.id} movie={movie} onClick={openDetails} />
                  ))}
                </div>
              )}
            </motion.section>
          )}
        </AnimatePresence>

        {/* Main Discovery Section */}
        <section className="space-y-6 md:space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-border pb-4 gap-4">
            <div className="space-y-1">
              <h2 className="text-2xl md:text-3xl font-black flex items-center gap-3 text-white">
                {selectedMood || selectedGenre ? (
                  <Sparkles className="text-primary w-6 h-6 md:w-8 md:h-8" />
                ) : (
                  <TrendingUp className="text-primary w-6 h-6 md:w-8 md:h-8" />
                )}
                {selectedMood ? `${selectedMood.replace('-', ' ')} Movies` : selectedGenre ? `${selectedGenre} Movies` : "Trending Now"}
              </h2>
            </div>
            <div className="w-full md:w-auto overflow-x-auto">
              <GenreFilter selected={selectedGenre} onSelect={handleGenreSelect} />
            </div>
          </div>
          {loading ? <MovieGridSkeleton count={12} /> : (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6">
              {movies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} onClick={openDetails} />
              ))}
            </div>
          )}
        </section>
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