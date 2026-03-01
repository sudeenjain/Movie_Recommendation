import React, { useEffect, useState } from "react";
import { Movie } from "@/types/movie";
import { fetchTrending, getRecommendations } from "@/services/tmdb";
import MovieCard from "@/components/MovieCard";
import MovieDialog from "@/components/MovieDialog";
import SearchBar from "@/components/SearchBar";
import GenreFilter from "@/components/GenreFilter";
import { MovieGridSkeleton } from "@/components/MovieSkeleton";
import { Sparkles, TrendingUp, Film, Clapperboard, Bookmark } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { MadeWithDyad } from "@/components/made-with-dyad";
import { useWatchlist } from "@/hooks/use-watchlist";

const Index = () => {
  const [trending, setTrending] = useState<Movie[]>([]);
  const [recommendations, setRecommendations] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchedMovie, setSearchedMovie] = useState<Movie | null>(null);
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  
  const { watchlist } = useWatchlist();

  useEffect(() => {
    setLoading(true);
    fetchTrending().then((data) => {
      setTrending(data);
      setLoading(false);
    });
  }, []);

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

  const filteredTrending = selectedGenre 
    ? trending.filter(m => m.genres?.includes(selectedGenre) || true) 
    : trending;

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary selection:text-primary-foreground">
      {/* Hero Section */}
      <div className="relative h-[70vh] flex flex-col items-center justify-center px-4 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent opacity-50" />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 text-center space-y-6 max-w-4xl"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-md text-primary text-sm font-bold mb-4">
            <Sparkles className="w-4 h-4" />
            AI-Powered Movie Discovery
          </div>
          <h1 className="text-6xl md:text-9xl font-black tracking-tighter text-white">
            CINE<span className="text-primary">AI</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-medium">
            Discover your next favorite film using our advanced recommendation engine. 
            Enter a movie you love, and we'll find its perfect match.
          </p>
          
          <div className="pt-8">
            <SearchBar onSelect={handleMovieSelect} />
          </div>
        </motion.div>
      </div>

      <main className="max-w-7xl mx-auto px-4 pb-20 space-y-24">
        {/* Watchlist Section */}
        {watchlist.length > 0 && (
          <motion.section
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-8"
          >
            <div className="flex items-end justify-between border-b border-border pb-4">
              <div className="space-y-1">
                <h2 className="text-3xl font-black flex items-center gap-3 text-white">
                  <Bookmark className="text-primary w-8 h-8" />
                  Your Watchlist
                </h2>
                <p className="text-muted-foreground">Movies you've saved for later.</p>
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
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="flex items-end justify-between border-b border-border pb-4">
                <div className="space-y-1">
                  <h2 className="text-3xl font-black flex items-center gap-3 text-white">
                    <Clapperboard className="text-primary w-8 h-8" />
                    Because you liked <span className="text-primary">"{searchedMovie?.title}"</span>
                  </h2>
                  <p className="text-muted-foreground">Our AI analyzed themes, tone, and genre DNA to find these matches.</p>
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

        {/* Trending Section */}
        <section className="space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-border pb-4 gap-4">
            <div className="space-y-1">
              <h2 className="text-3xl font-black flex items-center gap-3 text-white">
                <TrendingUp className="text-primary w-8 h-8" />
                Trending Today
              </h2>
              <p className="text-muted-foreground">The most popular movies across the globe right now.</p>
            </div>
            <div className="w-full md:w-auto">
              <GenreFilter selected={selectedGenre} onSelect={setSelectedGenre} />
            </div>
          </div>
          {loading ? <MovieGridSkeleton count={12} /> : (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
              {filteredTrending.map((movie) => (
                <MovieCard key={movie.id} movie={movie} onClick={openDetails} />
              ))}
            </div>
          )}
        </section>

        {/* Features Section */}
        <section className="grid md:grid-cols-3 gap-8 pt-10">
          {[
            { icon: Sparkles, title: "Smart Matching", desc: "TF-IDF based similarity scoring across 32,000+ titles." },
            { icon: Film, title: "Rich Metadata", desc: "Trailers, cast details, and where to watch on OTT platforms." },
            { icon: Clapperboard, title: "AI Insights", desc: "Understand exactly why a movie was recommended for you." }
          ].map((feature, i) => (
            <div key={i} className="p-8 rounded-3xl bg-card border border-border hover:bg-accent transition-colors group">
              <feature.icon className="w-10 h-10 text-primary mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-bold mb-2 text-white">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.desc}</p>
            </div>
          ))}
        </section>
      </main>

      <MovieDialog
        movie={selectedMovie}
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
      />
      
      <footer className="border-t border-border py-10">
        <MadeWithDyad />
      </footer>
    </div>
  );
};

export default Index;