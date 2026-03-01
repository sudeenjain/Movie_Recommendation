export interface WatchProvider {
  provider_id: number;
  provider_name: string;
  logo_path: string;
}

export interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  release_date: string;
  vote_average: number;
  genres?: string[];
  runtime?: number;
  tagline?: string;
  director?: string;
  cast?: string[];
  trailer_key?: string;
  providers?: WatchProvider[];
  watch_link?: string;
  _reason?: string;
  _score?: number;
}

export interface Genre {
  id: number;
  name: string;
}