import { Movie } from "@/types/movie";

const API_KEY = "3e6de8a45463ba8310359da2d236c60e"; 
const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE = "https://image.tmdb.org/t/p";

export const GENRE_MAP: Record<string, number> = {
  "Action": 28, "Adventure": 12, "Animation": 16, "Comedy": 35, "Crime": 80, 
  "Documentary": 99, "Drama": 18, "Family": 10751, "Fantasy": 14, "History": 36, 
  "Horror": 27, "Music": 10402, "Mystery": 9648, "Romance": 10749, "Sci-Fi": 878, "Thriller": 53
};

export const MOOD_MAP: Record<string, number[]> = {
  "mind-bending": [9648, 878, 18],
  "adrenaline": [28, 12, 53],
  "heartwarming": [10749, 10751, 35],
  "spooky": [27, 9648],
  "epic": [12, 14, 36],
  "chill": [35, 99, 16]
};

export const getImageUrl = (path: string, size: "w92" | "w500" | "original" = "w500") => 
  path ? `${IMAGE_BASE}/${size}${path}` : "/placeholder.svg";

export const fetchTrending = async (): Promise<Movie[]> => {
  const res = await fetch(`${BASE_URL}/trending/movie/day?api_key=${API_KEY}`);
  const data = await res.json();
  return data.results;
};

export const discoverMovies = async (genreIds: number[]): Promise<Movie[]> => {
  const genres = genreIds.join(",");
  const res = await fetch(`${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=${genres}&sort_by=popularity.desc`);
  const data = await res.json();
  return data.results;
};

export const searchMovies = async (query: string): Promise<Movie[]> => {
  const res = await fetch(`${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}`);
  const data = await res.json();
  return data.results;
};

export const getMovieTrailer = async (id: number): Promise<string | null> => {
  try {
    const res = await fetch(`${BASE_URL}/movie/${id}/videos?api_key=${API_KEY}`);
    const data = await res.json();
    return data.results?.find((v: any) => v.type === "Trailer" && v.site === "YouTube")?.key || null;
  } catch (error) {
    return null;
  }
};

export const getMovieDetails = async (id: number): Promise<Movie> => {
  const [detailsRes, creditsRes, videosRes, providersRes] = await Promise.all([
    fetch(`${BASE_URL}/movie/${id}?api_key=${API_KEY}`),
    fetch(`${BASE_URL}/movie/${id}/credits?api_key=${API_KEY}`),
    fetch(`${BASE_URL}/movie/${id}/videos?api_key=${API_KEY}`),
    fetch(`${BASE_URL}/movie/${id}/watch/providers?api_key=${API_KEY}`)
  ]);

  const details = await detailsRes.json();
  const credits = await creditsRes.json();
  const videos = await videosRes.json();
  const providersData = await providersRes.json();

  const trailer = videos.results?.find((v: any) => v.type === "Trailer" && v.site === "YouTube")?.key;
  const director = credits.crew?.find((c: any) => c.job === "Director")?.name;
  const cast = credits.cast?.slice(0, 5).map((c: any) => c.name);
  
  const results = providersData.results || {};
  let watchLink = results.US?.link || Object.values(results).find((r: any) => r.link)?.link;

  if (!watchLink) {
    watchLink = `https://www.justwatch.com/us/search?q=${encodeURIComponent(details.title)}`;
  }

  return {
    ...details,
    genres: details.genres?.map((g: any) => g.name),
    director,
    cast,
    trailer_key: trailer,
    watch_link: watchLink
  };
};

export const getRecommendations = async (id: number): Promise<Movie[]> => {
  const res = await fetch(`${BASE_URL}/movie/${id}/recommendations?api_key=${API_KEY}`);
  const data = await res.json();
  return data.results.map((m: any) => ({
    ...m,
    _reason: "Based on similar themes",
    _score: Math.round(m.vote_average * 10) / 100
  }));
};