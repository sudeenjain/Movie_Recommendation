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
      if (selectedMood) data = await discoverMovies(MOOD_MAP[selectedMood]);
      else if (selectedGenre) data = await discoverMovies([GENRE_MAP[selectedGenre]]);
      else data = await fetchTrending();
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
    window.scrollTo({ top: isMobile ? 300 : 500, behavior: "smooth" });
  };

  const openDetails = (movie: Movie) => {
    setSelectedMovie(movie);
    setIsDialogOpen(true);
  };

  return (
    <div className="min-h-screen text-foreground selection:bg-primary selection:text-primary-foreground pb-32 md:pb-0 overflow-x-hidden">
      <IntroAnimation onComplete={() => setIntroComplete(true)} />
      
      <AnimatePresence>
        {introComplete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5 }}
          >
            {/* Floating Navigation */}
            <motion.nav 
              initial={{ y: -100 }}
              animate={{ y: 0 }}
              transition={{ type: "spring", damping: 20, stiffness: 100 }}
              className="fixed top-0 left-0 right-0 z-50 px-6 py-6 flex justify-between items-center bg-gradient-to-b from-black/90 via-black/40 to-transparent backdrop-blur-[2px]"
            >
              <motion.h3 
                whileHover={{ scale: 1.05 }}
                className="text-2xl font-black tracking-tighter text-white cursor-default"
              >
                CINE<span className="text-primary">AI</span>
              </motion.h3>
              <Link to="/profile">
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-3 rounded-2xl bg-white/5 border border-white/10 text-white hover:bg-primary/20 hover:border-primary/50 transition-all shadow-xl"
                >
                  <User className="w-5 h-5" />
                </motion.button>
              </Link>
            </motion.nav>

            {/* Hero Section with Floating Animation */}
            {(activeTab === "home" || activeTab === "search" || activeTab === "ai") && (
              <div className="relative min-h-[60vh] md:h-[80vh] flex flex-col items-center justify-center px-4 overflow-hidden pt-24 md:pt-0 z-10">
                <motion.div 
                  animate={{ 
                    y: [0, -20, 0],
                    rotate: [0, 1, 0, -1, 0]
                  }}
                  transition={{ 
                    duration: 6, 
                    repeat: Infinity, 
                    ease: "easeInOut" 
                  }}
                  className="relative mb-12 text-center"
                >
                  <h1 className="text-7xl md:text-[12rem] font-black tracking-tighter text-white drop-shadow-[0_0_80px_rgba(0,162,255,0.4)] select-none leading-none">
                    CINE<span className="text-primary">AI</span>
                  </h1>
                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                    className="text-[10px] md:text-xs font-black uppercase tracking-[0.5em] text-primary/60 mt-4"
                  >
                    The Future of Cinematic Discovery
                  </motion.p>
                </motion.div>
                
                <motion.div 
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.5, type: "spring" }}
                  className="w-full max-w-3xl mx-auto px-4"
                >
                  <SearchBar onSelect={handleMovieSelect} />
                </motion.div>

                {activeTab === "ai" && (
                  <motion.div 
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="pt-12 text-center"
                  >
                    <MoodFilter selected={selectedMood} onSelect={(m) => { setSelectedMood(m); setSelectedGenre(null); setActiveTab("home"); }} />
                  </motion.div>
                )}
              </div>
            )}

            <main className="max-w-7xl mx-auto px-4 pb-20 space-y-24 md:space-y-40 relative z-10">
              {/* Watchlist Section */}
              {activeTab === "watchlist" && (
                <motion.section 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-12 pt-32"
                >
                  <div className="flex items-end justify-between border-b border-white/10 pb-8">
                    <h2 className="text-4xl md:text-6xl font-black flex items-center gap-6 text-white tracking-tighter">
                      <Bookmark className="text-primary w-12 h-12" />
                      COLLECTION
                    </h2>
                  </div>
                  {watchlist.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 md:gap-8">
                      {watchlist.map((movie, i) => (
                        <MovieCard key={movie.id} movie={movie} onClick={openDetails} index={i} />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-32 space-y-6">
                      <Bookmark className="w-20 h-20 text-muted-foreground mx-auto opacity-10" />
                      <p className="text-muted-foreground text-xl font-bold">Your vault is empty</p>
                    </div>
                  )}
                </motion.section>
              )}

              {/* Home Content */}
              {activeTab === "home" && (
                <>
                  <AnimatePresence mode="wait">
                    {recommendations.length > 0 && (
                      <motion.section
                        key="recommendations"
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="space-y-12"
                      >
                        <div className="flex items-end justify-between border-b border-white/10 pb-8">
                          <div className="space-y-2">
                            <h2 className="text-4xl md:text-6xl font-black flex items-center gap-6 text-white tracking-tighter">
                              <BrainCircuit className="text-primary w-12 h-12" />
                              AI PICKS
                            </h2>
                            <p className="text-xs md:text-sm font-bold text-muted-foreground uppercase tracking-[0.2em]">Neural match for <span className="text-primary">"{searchedMovie?.title}"</span></p>
                          </div>
                        </div>
                        {loading ? <MovieGridSkeleton /> : (
                          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 md:gap-8">
                            {recommendations.map((movie, i) => (
                              <MovieCard key={movie.id} movie={movie} onClick={openDetails} index={i} />
                            ))}
                          </div>
                        )}
                      </motion.section>
                    )}
                  </AnimatePresence>

                  <motion.section 
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="space-y-12"
                  >
                    <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-white/10 pb-8 gap-8">
                      <h2 className="text-4xl md:text-6xl font-black flex items-center gap-6 text-white tracking-tighter uppercase">
                        {selectedMood || selectedGenre ? <Sparkles className="text-primary w-12 h-12" /> : <TrendingUp className="text-primary w-12 h-12" />}
                        {selectedMood ? selectedMood.replace('-', ' ') : selectedGenre ? selectedGenre : "Trending"}
                      </h2>
                      <div className="w-full md:w-auto">
                        <GenreFilter selected={selectedGenre} onSelect={(g) => { setSelectedGenre(g); setSelectedMood(null); }} />
                      </div>
                    </div>
                    {loading ? <MovieGridSkeleton count={12} /> : (
                      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 md:gap-8">
                        {movies.map((movie, i) => (
                          <MovieCard key={movie.id} movie={movie} onClick={openDetails} index={i} />
                        ))}
                      </div>
                    )}
                  </motion.section>
                </>
              )}
            </main>

            <MovieDialog movie={selectedMovie} isOpen={isDialogOpen} onClose={() => setIsDialogOpen(false)} />
            <MobileNav activeTab={activeTab} onTabChange={setActiveTab} watchlistCount={watchlist.length} />
            <Footer />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Index;