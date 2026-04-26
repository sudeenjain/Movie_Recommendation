import { useState, useEffect } from "react";
import { Movie } from "@/types/movie";
import { showSuccess, showError } from "@/utils/toast";
import { auth } from "@/lib/firebase";
import { useNavigate } from "react-router-dom";

export const useWatchlist = () => {
  const [watchlist, setWatchlist] = useState<Movie[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const saved = localStorage.getItem("cineai_watchlist");
    if (saved) setWatchlist(JSON.parse(saved));
  }, []);

  const toggleWatchlist = (movie: Movie) => {
    if (!auth.currentUser) {
      showError("Please sign in to save movies to your Collection.");
      navigate("/auth");
      return;
    }

    setWatchlist((prev) => {
      const exists = prev.find((m) => m.id === movie.id);
      let next;
      if (exists) {
        next = prev.filter((m) => m.id !== movie.id);
        showSuccess(`Removed ${movie.title} from collection`);
      } else {
        next = [...prev, movie];
        showSuccess(`Added ${movie.title} to collection`);
      }
      localStorage.setItem("cineai_watchlist", JSON.stringify(next));
      return next;
    });
  };

  const isInWatchlist = (id: number) => watchlist.some((m) => m.id === id);

  return { watchlist, toggleWatchlist, isInWatchlist };
};