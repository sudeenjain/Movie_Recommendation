import React, { useEffect, useState } from "react";
import { Movie } from "@/types/movie";
import { fetchTrending, discoverMovies, getRecommendations, getImageUrl, GENRE_MAP, MOOD_MAP } from "@/services/tmdb";
import MovieCard from "@/components/MovieCard";
import MovieDialog from "@/components/MovieDialog";
import SearchBar from "@/components/SearchBar";
import GenreFilter from "@/components/GenreFilter";
import MoodFilter from "@/components/MoodFilter";
import MobileNav from "@/components/MobileNav";
import Footer from "@/components/Footer";
import IntroAnimation from "@/components/IntroAnimation";
import { MovieGridSkeleton } from "@/components/MovieSkeleton";
import { TrendingUp, Bookmark, BrainCircuit, Sparkles, User, Home, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useWatchlist } from "@/hooks/use-watchlist";
import { useIsMobile } from "@/hooks/use-mobile";
import { useImageColor } from "@/hooks/use-image-color";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import NeuralSearch from "@/components/NeuralSearch";
import Trending3D from "@/components/Trending3D";
import ThreeBackground from "@/components/ThreeBackground";

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
  const [cinematicMode, setCinematicMode] = useState(false);
  const [liveSearchQuery, setLiveSearchQuery] = useState("");
  const [liveSearchResults, setLiveSearchResults] = useState<Movie[]>([]);
  
  const { watchlist } = useWatchlist();
  const isMobile = useIsMobile();

  // Use the dynamic color hook based on the selected movie or the first trending movie
  useImageColor(selectedMovie?.poster_path ? getImageUrl(selectedMovie.poster_path) : (movies[0]?.poster_path ? getImageUrl(movies[0].poster_path) : null));

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
    setSelectedMovie(movie);
    setIsDialogOpen(true);
    
    setLoading(true);
    const recs = await getRecommendations(movie.id);
    setRecommendations(recs);
    setLoading(false);
    
    setActiveTab("home");
  };

  const openDetails = (movie: Movie) => {
    setSelectedMovie(movie);
    setIsDialogOpen(true);
  };

  const navItems = [
    { id: "home", icon: Home, label: "Home" },
    { id: "ai", icon: Sparkles, label: "AI Discovery" },
    { id: "watchlist", icon: Bookmark, label: "Saved", count: watchlist.length },
  ];

  return (
    <div className="min-h-screen text-foreground selection:bg-primary selection:text-primary-foreground pb-32 md:pb-0 overflow-x-hidden bg-[#050505]">
      <IntroAnimation onComplete={() => setIntroComplete(true)} />
      
      <AnimatePresence>
        {introComplete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <nav className="sticky top-0 left-0 right-0 z-50 px-6 md:px-12 py-6 flex justify-between items-center bg-[#050505]/80 backdrop-blur-2xl border-b border-white/5">
              <div className="flex items-center gap-12">
                <h3 
                  onClick={() => setActiveTab("home")}
                  className="text-2xl font-bold tracking-tight text-white cursor-pointer"
                >
                  Cine<span className="text-white/50">AI</span>
                </h3>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-8">
                  {navItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={cn(
                        "flex items-center gap-2 text-sm font-medium transition-all hover:text-white",
                        activeTab === item.id ? "text-white" : "text-white/40"
                      )}
                    >
                      <item.icon className="w-4 h-4" />
                      {item.label}
                      {item.count !== undefined && item.count > 0 && (
                        <span className="bg-white/10 text-white px-2 py-0.5 rounded-full text-[10px]">
                          {item.count}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-4">
                <Link to="/profile">
                  <button className="p-2.5 rounded-full bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all">
                    <User className="w-5 h-5" />
                  </button>
                </Link>
              </div>
            </nav>

            {(activeTab === "home" || activeTab === "ai") && (
              <div className="relative pt-12 pb-16 flex flex-col items-center justify-center px-4 w-full">
                  <motion.div 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="w-full max-w-5xl mx-auto relative z-50"
                  >
                    {activeTab === "home" && (
                      <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-white mb-8 text-center">
                        What do you want to <span className="text-white/40 italic">watch?</span>
                      </h1>
                    )}
                    <NeuralSearch 
                      onSelect={handleMovieSelect} 
                      onSearchResults={(q, results) => {
                        setLiveSearchQuery(q);
                        setLiveSearchResults(results);
                      }}
                    />
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
                {activeTab === "watchlist" && (
                  <motion.section 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-12 pt-32"
                  >
                    <div className="flex items-end justify-between border-b border-white/10 pb-8">
                      <h2 className="text-2xl md:text-3xl font-semibold flex items-center gap-3 text-white tracking-tight">
                        <Bookmark className="text-white/60 w-6 h-6" />
                        Collection
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

                {activeTab === "home" && (
                  <>
                    <AnimatePresence mode="wait">
                      {recommendations.length > 0 && !liveSearchQuery && (
                        <motion.section
                          key="recommendations"
                          initial={{ opacity: 0, y: 40 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          className="space-y-12"
                        >
                          <div className="flex items-end justify-between border-b border-white/10 pb-8">
                            <div className="space-y-2">
                              <h2 className="text-2xl md:text-3xl font-semibold flex items-center gap-3 text-white tracking-tight">
                                <BrainCircuit className="text-white/60 w-6 h-6" />
                                AI Picks
                              </h2>
                              <p className="text-sm text-white/50">Neural match for <span className="text-white italic">"{searchedMovie?.title}"</span></p>
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
                      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-white/10 pb-8 gap-8 px-4 md:px-0">
                        <h2 className="text-2xl md:text-3xl font-semibold flex items-center gap-3 text-white tracking-tight">
                          {liveSearchQuery ? (
                            <Search className="text-white/60 w-6 h-6" />
                          ) : selectedMood || selectedGenre ? (
                            <Sparkles className="text-white/60 w-6 h-6" />
                          ) : (
                            <TrendingUp className="text-white/60 w-6 h-6" />
                          )}
                          {liveSearchQuery 
                            ? `Results for "${liveSearchQuery}"`
                            : selectedMood ? selectedMood.replace('-', ' ') 
                            : selectedGenre ? selectedGenre : "Trending"}
                        </h2>
                        {!liveSearchQuery && (
                          <div className="w-full md:w-auto">
                            <GenreFilter selected={selectedGenre} onSelect={(g) => { setSelectedGenre(g); setSelectedMood(null); }} />
                          </div>
                        )}
                      </div>
                      
                      {loading && !liveSearchQuery ? <MovieGridSkeleton count={12} /> : (
                        <>
                          {liveSearchQuery && liveSearchResults.length > 0 ? (
                            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 md:gap-8 px-4 md:px-0">
                              {liveSearchResults.map((movie, i) => (
                                <MovieCard key={movie.id} movie={movie} onClick={openDetails} index={i} />
                              ))}
                            </div>
                          ) : liveSearchQuery && liveSearchResults.length === 0 ? (
                            <div className="text-center py-20 text-white/40">No transmission anomalies found for "{liveSearchQuery}".</div>
                          ) : !(selectedMood || selectedGenre) ? (
                             <div className="-mx-4 md:mx-0">
                               <Trending3D movies={movies} onSelect={openDetails} />
                             </div>
                          ) : (
                            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 md:gap-8 px-4 md:px-0">
                              {movies.map((movie, i) => (
                                <MovieCard key={movie.id} movie={movie} onClick={openDetails} index={i} />
                              ))}
                            </div>
                          )}
                        </>
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