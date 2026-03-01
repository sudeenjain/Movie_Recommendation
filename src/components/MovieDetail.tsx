import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { getImageUrl } from '@/services/tmdb';
import { Star, Clock, Calendar, Play, Info } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

interface MovieDetailProps {
  movie: any;
  isOpen: boolean;
  onClose: () => void;
}

const MovieDetail = ({ movie, isOpen, onClose }: MovieDetailProps) => {
  if (!movie) return null;

  const trailer = movie.videos?.results?.find((v: any) => v.type === "Trailer" && v.site === "YouTube");
  const director = movie.credits?.crew?.find((c: any) => c.job === "Director")?.name;
  const cast = movie.credits?.cast?.slice(0, 5).map((c: any) => c.name).join(", ");

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl p-0 overflow-hidden bg-zinc-950 border-zinc-800 text-white">
        <div className="relative h-[300px] md:h-[400px]">
          <img
            src={getImageUrl(movie.backdrop_path, 'original')}
            className="w-full h-full object-cover opacity-50"
            alt={movie.title}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 to-transparent" />
          
          <div className="absolute bottom-0 left-0 p-6 md:p-10 w-full">
            <div className="flex flex-wrap gap-2 mb-4">
              {movie.genres?.map((g: any) => (
                <Badge key={g.id} variant="outline" className="border-zinc-700 text-zinc-300">
                  {g.name}
                </Badge>
              ))}
            </div>
            <h2 className="text-3xl md:text-5xl font-black mb-2">{movie.title}</h2>
            <p className="text-zinc-400 italic text-sm md:text-base">{movie.tagline}</p>
          </div>
        </div>

        <ScrollArea className="max-h-[50vh] p-6 md:p-10 pt-0">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-6">
              <div>
                <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
                  <Info className="w-5 h-5 text-blue-500" /> Overview
                </h3>
                <p className="text-zinc-300 leading-relaxed">{movie.overview}</p>
              </div>

              {trailer && (
                <div>
                  <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <Play className="w-5 h-5 text-red-500" /> Official Trailer
                  </h3>
                  <div className="aspect-video rounded-xl overflow-hidden border border-zinc-800">
                    <iframe
                      width="100%"
                      height="100%"
                      src={`https://www.youtube.com/embed/${trailer.key}`}
                      title="YouTube video player"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-6">
              <div className="bg-zinc-900/50 p-4 rounded-xl border border-zinc-800 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-zinc-400 text-sm">Rating</span>
                  <span className="flex items-center gap-1 text-yellow-500 font-bold">
                    <Star className="w-4 h-4 fill-current" /> {movie.vote_average?.toFixed(1)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-zinc-400 text-sm">Runtime</span>
                  <span className="flex items-center gap-1 text-zinc-200">
                    <Clock className="w-4 h-4" /> {movie.runtime} min
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-zinc-400 text-sm">Release</span>
                  <span className="flex items-center gap-1 text-zinc-200">
                    <Calendar className="w-4 h-4" /> {movie.release_date}
                  </span>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-bold text-zinc-500 uppercase tracking-wider mb-2">Director</h4>
                <p className="text-zinc-200">{director || "N/A"}</p>
              </div>

              <div>
                <h4 className="text-sm font-bold text-zinc-500 uppercase tracking-wider mb-2">Top Cast</h4>
                <p className="text-zinc-200 text-sm leading-relaxed">{cast || "N/A"}</p>
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default MovieDetail;