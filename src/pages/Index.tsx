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
import { TrendingUp, Bookmark, BrainCircuit, Sparkles, Search as SearchIcon } from "lucide-react";
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
import { useWatchlist } from "@/hooks/use-watchlist";
import { useIsMobile } from "@/hooks/use-mobile";

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

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { damping: 50, stiffness: 400 });
  const springY = useSpring(mouseY, { damping: 50, stiffness: 400 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

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

  const contentVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { 
        duration: 1.2, 
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary selection:text-primary-foreground pb-32 md:pb-0 overflow-x-hidden">
      <IntroAnimation onComplete={() => setIntroComplete(true)} />

      {!isMobile && (
        <motion.div 
          className="fixed inset-0 pointer-events-none z-0 opacity-40"
          style={{
            background: `radial-gradient(600px circle at ${springX}px ${springY}px, rgba(var(--primary-rgb), 0.15), transparent 80%)`
          }}
        />
      )}

      <AnimatePresence>
        {introComplete && (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={contentVariants}
          >
            {/* Hero Section - Only show on Home or Search tabs */}
            {(activeTab === "home" || activeTab === "search" || activeTab === "ai") && (
              <div className="relative min-h-[50vh] md:h-[70vh] flex flex-col items-center justify-center px-4 overflow-hidden pt-16 md:pt-0 z-10">
                <motion.div variants={itemVariants} className="relative mb-6 md:mb-8">
                  <h1 className="text-6xl md:text-[10rem] font-black tracking-tighter text-white drop-shadow-[0_0_50px_rgba(255,255,255,0.1)] select-none">
                    CINE<span className="text-primary">AI</span>
                  </h1>
                </motion.div>
                
                <motion.div variants={itemVariants} className="w-full max-w-2xl mx-auto px-4">
                  <SearchBar onSelect={handleMovieSelect} />
                </motion.div>

                {activeTab === "ai" && (
                  <motion.div variants={itemVariants} className="pt-10 text-center">
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/60 mb-6">Curated Discovery</p>
                    <MoodFilter selected={selectedMood} onSelect={handleMoodSelect} />
                  </motion.div>
                )}
              </div>
            )}

            <main className="max-w-7xl mx-auto px-4 pb-20 space-y-16 md:space-y-32 relative z-10">
              {/* Watchlist Tab View */}
              {activeTab === "watchlist" && (
                <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8 pt-24">
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
                </motion.section>
              )}

              {/* Home Tab View */}
              {activeTab === "home" && (
                <>
                  {/* Recommendations Section */}
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

                  {/* Main Discovery Section */}
                  <motion.section variants={itemVariants} className="space-y-8">
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
                  </motion.section>
                </>
              )}

              {/* Search Tab View (Mobile specific) */}
              {activeTab === "search" && isMobile && (
                <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8 pt-10">
                  <div className="flex items-center gap-4 border-b border-white/5 pb-6">
                    <SearchIcon className="text-primary w-8 h-8" />
                    <h2 className="text-3xl font-black text-white tracking-tighter">SEARCH</h2>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {movies.slice(0, 10).map((movie) => (
                      <MovieCard key={movie.id} movie={movie} onClick={openDetails} />
                    ))}
                  </div>
                </motion.section>
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