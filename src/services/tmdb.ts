const API_KEY = "8265bd1679663a7ea12ac168da84d2e8"; // Using a demo key for preview
const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE = "https://image.tmdb.org/t/p";

export const getImageUrl = (path: string, size: "w500" | "original" = "w500") => 
  path ? `${IMAGE_BASE}/${size}${path}` : "/placeholder.svg";

export const fetchTrending = async (): Promise<Movie[]> => {
  const res = await fetch(`${BASE_URL}/trending/movie/day?api_key=${API_KEY}`);
  const data = await res.json();
  return data.results;
};

export const searchMovies = async (query: string): Promise<Movie[]> => {
  const res = await fetch(`${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}`);
  const data = await res.json();
  return data.results;
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
  const providers = await providersRes.json();

  const trailer = videos.results?.find((v: any) => v.type === "Trailer" && v.site === "YouTube")?.key;
  const director = credits.crew?.find((c: any) => c.job === "Director")?.name;
  const cast = credits.cast?.slice(0, 5).map((c: any) => c.name);
  const ott = providers.results?.US?.flatrate?.map((p: any) => p.provider_name) || [];

  return {
    ...details,
    genres: details.genres?.map((g: any) => g.name),
    director,
    cast,
    trailer_key: trailer,
    providers: ott
  };
};

export const getRecommendations = async (id: number): Promise<Movie[]> => {
  const res = await fetch(`${BASE_URL}/movie/${id}/recommendations?api_key=${API_KEY}`);
  const data = await res.json();
  return data.results.map((m: any) => ({
    ...m,
    _reason: "Based on similar themes and genres",
    _score: Math.round(m.vote_average * 10) / 100
  }));
};