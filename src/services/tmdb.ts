import { Movie } from "@/types/movie";

const API_KEY = "81835962871d82c0339ef1d79628791d";
const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE = "https://image.tmdb.org/t/p";

/* =========================
   GENRE & MOOD MAPS
========================= */

export const GENRE_MAP: Record<string, number> = {
  Action: 28,
  Adventure: 12,
  Animation: 16,
  Comedy: 35,
  Crime: 80,
  Documentary: 99,
  Drama: 18,
  Family: 10751,
  Fantasy: 14,
  History: 36,
  Horror: 27,
  Music: 10402,
  Mystery: 9648,
  Romance: 10749,
  "Sci-Fi": 878,
  Thriller: 53,
};

export const MOOD_MAP: Record<string, number[]> = {
  "mind-bending": [9648, 878, 18],
  adrenaline: [28, 12, 53],
  heartwarming: [10749, 10751, 35],
  spooky: [27, 9648],
  epic: [12, 14, 36],
  chill: [35, 99, 16],
};

/* =========================
   CORE FETCH FUNCTION
========================= */

const fetchFromTMDB = async (endpoint: string) => {
  const url = `${BASE_URL}${endpoint}${
    endpoint.includes("?") ? "&" : "?"
  }api_key=${API_KEY}`;

  try {
    const res = await fetch(url);

    if (!res.ok) {
      const errorData = await res.json();
      console.error("TMDB API Full Error:", errorData);
      throw new Error(
        errorData.status_message || `TMDB Error ${res.status}`
      );
    }

    return await res.json();
  } catch (error) {
    console.error("Network/TMDB Error:", error);
    throw error;
  }
};

/* =========================
   IMAGE HELPER
========================= */

export const getImageUrl = (
  path: string,
  size: "w92" | "w185" | "w500" | "original" = "w500"
) => (path ? `${IMAGE_BASE}/${size}${path}` : "/placeholder.svg");

/* =========================
   BASIC FETCH FUNCTIONS
========================= */

export const fetchTrending = async (): Promise<Movie[]> => {
  const data = await fetchFromTMDB("/trending/movie/day");
  return data.results || [];
};

export const discoverMovies = async (
  genreIds: number[]
): Promise<Movie[]> => {
  const genres = genreIds.join(",");
  const data = await fetchFromTMDB(
    `/discover/movie?with_genres=${genres}&sort_by=popularity.desc`
  );
  return data.results || [];
};

export const searchMovies = async (
  query: string
): Promise<Movie[]> => {
  const data = await fetchFromTMDB(
    `/search/movie?query=${encodeURIComponent(query)}`
  );
  return data.results || [];
};

/* =========================
   MOVIE DETAILS
========================= */

export const getMovieTrailer = async (
  id: number
): Promise<string | null> => {
  const data = await fetchFromTMDB(`/movie/${id}/videos`);

  return (
    data.results?.find(
      (v: any) => v.type === "Trailer" && v.site === "YouTube"
    )?.key || null
  );
};

export const getMovieDetails = async (
  id: number
): Promise<Movie> => {
  const [details, credits, videos, providersData] =
    await Promise.all([
      fetchFromTMDB(`/movie/${id}`),
      fetchFromTMDB(`/movie/${id}/credits`),
      fetchFromTMDB(`/movie/${id}/videos`),
      fetchFromTMDB(`/movie/${id}/watch/providers`),
    ]);

  const trailer =
    videos.results?.find(
      (v: any) => v.type === "Trailer" && v.site === "YouTube"
    )?.key;

  const director =
    credits.crew?.find((c: any) => c.job === "Director")?.name;

  const cast =
    credits.cast?.slice(0, 8).map((c: any) => ({
      name: c.name,
      character: c.character,
      profile_path: c.profile_path,
    })) || [];

  const results = providersData.results || {};
  const usProviders = results.US || {};

  const providers = [
    ...(usProviders.flatrate || []),
    ...(usProviders.buy || []),
    ...(usProviders.rent || []),
  ].slice(0, 5);

  const watchLink =
    usProviders.link ||
    `https://www.justwatch.com/us/search?q=${encodeURIComponent(
      details.title
    )}`;

  return {
    ...details,
    genres: details.genres?.map((g: any) => g.name),
    director,
    cast,
    trailer_key: trailer,
    watch_link: watchLink,
    providers: providers.map((p: any) => ({
      provider_id: p.provider_id,
      provider_name: p.provider_name,
      logo_path: p.logo_path,
    })),
  };
};

/* =========================
   RECOMMENDATIONS
========================= */

export const getRecommendations = async (
  id: number
): Promise<Movie[]> => {
  const data = await fetchFromTMDB(
    `/movie/${id}/recommendations`
  );

  return (data.results || []).map((m: any) => ({
    ...m,
    _reason: "Based on similar themes",
    _score: Math.round(m.vote_average * 10) / 100,
  }));
};