import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, BrainCircuit, Sparkles, X, Loader2 } from "lucide-react";
import { searchMovies, getImageUrl } from "@/services/tmdb";
import { Movie } from "@/types/movie";
import { cn } from "@/lib/utils";

interface NeuralSearchProps {
  onSelect: (movie: Movie) => void;
  onSearchResults?: (query: string, results: Movie[]) => void;
}

const NeuralSearch = ({ onSelect, onSearchResults }: NeuralSearchProps) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Movie[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (query.length > 2) {
        setIsScanning(true);
        setIsSearching(true);
        setSelectedIndex(-1);
        
        // Artificial delay for "Neural Analysis" feel
        const data = await searchMovies(query);
        
        setTimeout(() => {
          const topResults = data.slice(0, 8);
          setResults(topResults);
          if (onSearchResults) onSearchResults(query, data.slice(0, 18));
          setIsScanning(false);
          setIsSearching(false);
          setIsOpen(true);
        }, 800);
      } else {
        setResults([]);
        if (onSearchResults) onSearchResults("", []);
        setIsOpen(false);
        setSelectedIndex(-1);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInputKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || results.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => {
        const next = prev < results.length - 1 ? prev + 1 : 0;
        resultsRef.current[next]?.scrollIntoView({ block: "nearest" });
        return next;
      });
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => {
        const next = prev > 0 ? prev - 1 : results.length - 1;
        resultsRef.current[next]?.scrollIntoView({ block: "nearest" });
        return next;
      });
    } else if (e.key === "Enter" && selectedIndex >= 0) {
      e.preventDefault();
      onSelect(results[selectedIndex]);
      setIsOpen(false);
      setQuery("");
    } else if (e.key === "Escape") {
      setIsOpen(false);
      inputRef.current?.blur();
    }
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-4xl mx-auto z-[100]">
      <div className="relative group">
        <div className={cn(
          "flex items-center bg-[#111111]/80 backdrop-blur-3xl border border-white/10 rounded-2xl p-1 transition-all duration-300",
          "focus-within:border-white/30 focus-within:bg-[#1a1a1a]/90 focus-within:shadow-[0_0_40px_rgba(255,255,255,0.05)]"
        )}>
          <div className="flex items-center flex-1 px-5 gap-4">
            {isSearching ? (
              <Loader2 className="w-5 h-5 text-white/50 animate-spin" />
            ) : (
              <Search className="w-5 h-5 text-white/40 group-focus-within:text-white transition-colors" />
            )}
            
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleInputKeyDown}
              onFocus={() => { if (query.length > 2) setIsOpen(true); }}
              placeholder="Search movies, TV shows, directors..."
              className="w-full bg-transparent border-none focus:outline-none text-lg md:text-xl font-medium text-white placeholder:text-white/30 py-4"
            />
          </div>

          <div className="flex items-center gap-2 pr-4">
             <div className="hidden md:flex items-center gap-1 mr-2 px-2 py-1 rounded bg-white/5 border border-white/5 text-white/40">
                <span className="text-[10px] font-semibold">⌘K</span>
             </div>
            {query && (
              <button 
                onClick={() => { setQuery(""); inputRef.current?.focus(); }}
                className="p-1.5 rounded-full hover:bg-white/10 transition-colors"
                title="Clear Search"
              >
                <X className="w-4 h-4 text-white/60" />
              </button>
            )}
          </div>
        </div>

        {/* Results Panel */}
        <AnimatePresence>
          {isOpen && results.length > 0 && !isSearching && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
              className="absolute top-[calc(100%+8px)] left-0 right-0 bg-[#0a0a0a]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden p-2"
            >
              <div className="max-h-[50vh] overflow-y-auto custom-scrollbar flex flex-col gap-1 p-1">
                {results.map((movie, i) => (
                  <motion.button
                    ref={(el) => (resultsRef.current[i] = el)}
                    key={movie.id}
                    onClick={() => {
                      onSelect(movie);
                      setIsOpen(false);
                      setQuery("");
                    }}
                    onMouseEnter={() => setSelectedIndex(i)}
                    className={cn(
                      "flex items-center gap-4 p-3 rounded-xl transition-all text-left",
                      selectedIndex === i 
                        ? "bg-white/10 border-transparent" 
                        : "hover:bg-white/5 border-transparent"
                    )}
                  >
                    <div className="relative flex-shrink-0">
                      <img
                        src={getImageUrl(movie.poster_path, "w92")}
                        className="w-12 h-16 object-cover rounded-md shadow-md"
                        alt={movie.title}
                      />
                    </div>
                    <div className="flex-1 min-w-0 pr-4">
                      <h4 className="font-semibold text-base text-white truncate tracking-tight">
                        {movie.title}
                      </h4>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[11px] text-white/40 font-medium">
                          {movie.release_date?.split("-")[0]}
                        </span>
                        {movie.vote_average > 0 && (
                          <>
                            <span className="text-white/20 text-[10px]">•</span>
                            <span className="text-[11px] text-white/40 font-medium flex items-center gap-1">
                              ★ {movie.vote_average.toFixed(1)}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
              
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default NeuralSearch;
