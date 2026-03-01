const TMDB_BASE = "https://api.themoviedb.org/3";
const TMDB_IMG = "https://image.tmdb.org/t/p/w500";
const TMDB_ORIG = "https://image.tmdb.org/t/p/original";

// Note: In a real app, this would be an environment variable.
// For this demo, we'll allow the user to provide one or use a fallback.
let API_KEY = "";

export const setApiKey = (key: string) => {
  API_KEY = key;
};

export const getImageUrl = (path: string, size: 'w500' | 'original' = 'w500') => {
  if (!path) return "";
  return size === 'original' ? `${TMDB_ORIG}${path}` : `${TMDB_IMG}${path}`;
};

const fetchTMDB = async (path: string, params: Record<string, string> = {}) => {
  if (!API_KEY) throw new Error("TMDB API Key is required");
  
  const queryParams = new URLSearchParams({
    api_key: API_KEY,
    ...params,
  });
  
  const response = await fetch(`${TMDB_BASE}${path}?${queryParams}`);
  if (!response.ok) throw new Error("Failed to fetch from TMDB");
  return response.json();
};

export const getTrending = async () => {
  const data = await fetchTMDB("/trending/movie/day");
  return data.results;
};

export const searchMovies = async (query: string) => {
  const data = await fetchTMDB("/search/movie", { query });
  return data.results;
};

export const getMovieDetails = async (id: number) => {
  return fetchTMDB(`/movie/${id}`, { append_to_response: "credits,videos,recommendations,watch/providers" });
};

export const getRecommendations = async (movieId: number) => {
  const data = await fetchTMDB(`/movie/${movieId}/recommendations`);
  return data.results;
};