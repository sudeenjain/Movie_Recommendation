import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { setApiKey, getTrending, searchMovies, getMovieDetails, getRecommendations } from '@/services/tmdb';
import Hero from '@/components/Hero';
import MovieCard from '@/components/MovieCard';
import MovieDetail from '@/components/MovieDetail';
import { Loader2, Sparkles, Film, TrendingUp, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const Index = () => {
  const [trending, setTrending] = useState<any[]>([]);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<any>(null);
  const [fullMovieData, setFullMovieData] = useState<any>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [apiKeyInput, setApiKeyInput] = useState("");
  const [hasKey, setHasKey] = useState(false);

  useEffect(() => {
    const savedKey = localStorage.getItem('tmdb_api_key');
    if (savedKey) {
      setApiKey(savedKey);
      setHasKey(true);
      loadInitialData();
    } else {
      setLoading(false);
    }
  }, []);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      const trendingData = await getTrending();
      setTrending(trendingData);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveKey = () => {
    if (apiKeyInput.trim()) {
      localStorage.setItem('tmdb_api_key', apiKeyInput.trim());
      setApiKey(apiKeyInput.trim());
      setHasKey(true);
      loadInitialData();
    }
  };

  const handleSearch = async (query: string) => {
    if (!query.trim()) return;
    setLoading(true);
    try {
      const results = await searchMovies(query);
      if (results.length > 0) {
        const firstMovie = results[0];
        const recs = await getRecommendations(firstMovie.id);
        setRecommendations(recs);
        setSearchQuery(query);
        // Scroll to results
        document.getElementById('results')?.scrollIntoView({ behavior: 'smooth' });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleMovieClick = async (movie: any) => {
    setLoading(true);
    try {
      const fullData = await getMovieDetails(movie.id);
      setFullMovieData(fullData);
      setIsDetailOpen(true);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (!hasKey) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full space-y-8 text-center"
        >
          <div className="space-y-2">
            <div className="inline-flex p-4 bg-blue-500/10 rounded-full mb-4">
              <Film className="w-12 h-12 text-blue-500" />
            </div>
            <h1 className="text-4xl font-black text-white">CineAI</h1>
            <p className="text-zinc-400">Enter your TMDB API Key to start exploring.</p>
          </div>
          
          <div className="space-y-4">
            <Input 
              type="password" 
              placeholder="TMDB API Key" 
              value={apiKeyInput}
              onChange={(e) => setApiKeyInput(e.target.value)}
              className="bg-zinc-900 border-zinc-800 text-white h-12"
            />
            <Button onClick={handleSaveKey} className="w-full h-12 bg-blue-600 hover:bg-blue-700 font-bold">
              Get Started
            </Button>
            <p className="text-xs text-zinc-500">
              Don't have a key? Get one for free at <a href="https://www.themoviedb.org/settings/api" target="_blank" className="text-blue-500 underline">themoviedb.org</a>
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white selection:bg-blue-500/30">
      <Hero 
        movie={trending[0]} 
        onSearch={handleSearch} 
        onDetail={handleMovieClick} 
      />

      <main className="container mx-auto px-6 py-12 space-y-16">
        {/* Recommendations Section */}
        <AnimatePresence>
          {recommendations.length > 0 && (
            <motion.section 
              id="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h2 className="text-3xl font-black flex items-center gap-3">
                    <Sparkles className="text-blue-500" /> AI Recommendations
                  </h2>
                  <p className="text-zinc-400">Based on your search for "{searchQuery}"</p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
                {recommendations.map((movie) => (
                  <MovieCard key={movie.id} movie={movie} onClick={handleMovieClick} />
                ))}
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        {/* Trending Section */}
        <section className="space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-black flex items-center gap-3">
              <TrendingUp className="text-red-500" /> Trending Today
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
            {trending.slice(1).map((movie) => (
              <MovieCard key={movie.id} movie={movie} onClick={handleMovieClick} />
            ))}
          </div>
        </section>
      </main>

      <MovieDetail 
        movie={fullMovieData} 
        isOpen={isDetailOpen} 
        onClose={() => setIsDetailOpen(false)} 
      />

      {loading && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center">
          <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
        </div>
      )}

      <footer className="border-t border-zinc-900 py-12 text-center text-zinc-500 text-sm">
        <p>© 2024 CineAI Recommendation Engine. Powered by TMDB.</p>
      </footer>
    </div>
  );
};

export default Index;