import React, { useEffect, useState } from "react";
import { Movie } from "@/types/movie";
import { fetchTrending, discoverMovies, getRecommendations, GENRE_MAP, MOOD_MAP, searchMovies } from "@/services/tmdb";
import MovieCard from "@/components/MovieCard";
import MovieDialog from "@/components/MovieDialog";
import SearchBar from "@/components/SearchBar";
import GenreFilter from "@/components/GenreFilter";
import MoodFilter from "@/components/MoodFilter";
import MobileNav from "@/components/MobileNav";
import Footer from "@/components/Footer";
import IntroAnimation from "@/components/IntroAnimation";
import { MovieGridSkeleton } from "@/components/MovieSkeleton";
import { TrendingUp, Bookmark, BrainCircuit, Sparkles, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useWatchlist } from "@/hooks/use-watchlist";
import { useIsMobile } from "@/hooks/use-mobile";
import { Link } from "react-router-dom";

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
  const [introComplete, setIntroComplete] = useState(false);
  
  const { watchlist } = useWatchlist();
  const isMobile = useIsMobile();

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
    setActiveTab("home");
    window.scrollTo({ top: isMobile ? 300 : 400, behavior: "smooth" });
  };

  const openDetails = (movie: Movie) => {
    setSelectedMovie(movie);
    setIsDialogOpen(true);
  };

  const handleMoodSelect = (mood: string | null) => {
    setSelectedMood(mood);
    setSelectedGenre(null);
    setActiveTab("home");
  };

  const handleGenreSelect = (genre: string | null) => {
    setSelectedGenre(genre);
    setSelectedMood(null);
    setActiveTab("home");
  };

  return (
    <div className="min-h-screen text-foreground selection:bg-primary selection:text-primary-foreground pb-32 md:pb-0 overflow-x-hidden">
      <IntroAnimation onComplete={() => setIntroComplete(true)} />
      
      <AnimatePresence>
        {introComplete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            {/* Top Navigation */}
            <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4 flex justify-between items-center bg-gradient-to-b from-black/80 to-transparent backdrop-blur-sm">
              <h3 className="text-xl font-black tracking-tighter text-white">
                CINE<span className="text-primary">AI</span> 2.0
              </h3>
              <Link to="/profile">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 rounded-full bg-white/5 border border-white/10 text-white hover:bg-primary/20 hover:border-primary/50 transition-all"
                >
                  <User className="w-5 h-5" />
                </motion.button>
              </Link>
            </nav>

            {/* Hero Section */}
            {(activeTab === "home" || activeTab === "search" || activeTab === "ai") && (
              <div className="relative min-h-[50vh] md:h-[70vh] flex flex-col items-center justify-center px-4 overflow-hidden pt-16 md:pt-0 z-10">
                <motion.div 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="relative mb-6 md:mb-8 text-center"
                >
                  <h1 className="text-6xl md:text-[10rem] font-black tracking-tighter text-white drop-shadow-[0_0_50px_rgba(0,162,255,0.3)] select-none">
                    CINE<span className="text-primary">AI</span>
                  </h1>
                </motion.div>
                
                <div className="w-full max-w-2xl mx-auto px-4">
                  <SearchBar onSelect={handleMovieSelect} />
                </div>

                {activeTab === "ai" && (
                  <div className="pt-10 text-center">
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/60 mb-6">Curated Discovery</p>
                    <MoodFilter selected={selectedMood} onSelect={handleMoodSelect} />
                  </div>
                )}
              </div>
            )}

            <main className="max-w-7xl mx-auto px-4 pb-20 space-y-16 md:space-y-32 relative z-10">
              {/* Watchlist Tab View */}
              {activeTab === "watchlist" && (
                <section className="space-y-8 pt-24">
                  <div className="flex items-end justify-between border-b border-white/5 pb-6">
                    <h2 className="text-3xl md:text-4xl font-black flex items-center gap-4 text-white tracking-tighter">
                      <Bookmark className="text-primary w-8 h-8" />
                      YOUR COLLECTION
                    </h2>
                  </div>
                  {watchlist.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6">
                      {watchlist.map((movie) => (
                        <MovieCard key={movie.id} movie={movie} onClick={openDetails} />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-20 space-y-4">
                      <Bookmark className="w-12 h-12 text-muted-foreground mx-auto opacity-20" />
                      <p className="text-muted-foreground font-bold">Your watchlist is empty</p>
                    </div>
                  )}
                </section>
              )}

              {/* Home Tab View */}
              {activeTab === "home" && (
                <>
                  <AnimatePresence mode="wait">
                    {recommendations.length > 0 && (
                      <motion.section
                        key="recommendations"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="space-y-8"
                      >
                        <div className="flex items-end justify-between border-b border-white/5 pb-6">
                          <div className="space-y-1">
                            <h2 className="text-3xl md:text-4xl font-black flex items-center gap-4 text-white tracking-tighter">
                              <BrainCircuit className="text-primary w-8 h-8" />
                              AI PICKS
                            </h2>
                            <p className="text-[10px] md:text-xs font-bold text-muted-foreground uppercase tracking-widest">Inspired by <span className="text-primary">"{searchedMovie?.title}"</span></p>
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

                  <section className="space-y-8">
                    <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-white/5 pb-6 gap-6">
                      <h2 className="text-3xl md:text-4xl font-black flex items-center gap-4 text-white tracking-tighter uppercase">
                        {selectedMood || selectedGenre ? (
                          <Sparkles className="text-primary w-8 h-8" />
                        ) : (
                          <TrendingUp className="text-primary w-8 h-8" />
                        )}
                        {selectedMood ? selectedMood.replace('-', ' ') : selectedGenre ? selectedGenre : "Trending"}
                      </h2>
                      <div className="w-full md:w-auto">
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
                </>
              )}
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
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Index;