import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Movie } from "@/types/movie";
import { getMovieDetails, getImageUrl } from "@/services/tmdb";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Star, Play, Info, Plus, Check, ExternalLink } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { useWatchlist } from "@/hooks/use-watchlist";

interface MovieDialogProps {
  movie: Movie | null;
  isOpen: boolean;
  onClose: () => void;
}

const MovieDialog = ({ movie, isOpen, onClose }: MovieDialogProps) => {
  const [details, setDetails] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(false);
  const { toggleWatchlist, isInWatchlist } = useWatchlist();

  useEffect(() => {
    if (movie && isOpen) {
      setLoading(true);
      getMovieDetails(movie.id).then((data) => {
        setDetails(data);
        setLoading(false);
      });
    }
  }, [movie, isOpen]);

  if (!movie) return null;

  const inWatchlist = isInWatchlist(movie.id);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl p-0 overflow-hidden bg-background border-none shadow-2xl">
        <ScrollArea className="max-h-[90vh]">
          <div className="relative aspect-video w-full bg-black">
            {details?.trailer_key ? (
              <iframe
                className="w-full h-full"
                src={`https://www.youtube.com/embed/${details.trailer_key}?autoplay=1&mute=0&rel=0`}
                title="Trailer"
                allow="autoplay; encrypted-media"
                allowFullScreen
              />
            ) : (
              <img
                src={getImageUrl(movie.backdrop_path, "original")}
                className="w-full h-full object-cover opacity-60"
                alt={movie.title}
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent pointer-events-none" />
          </div>

          <div className="p-8 -mt-20 relative z-10">
            <div className="flex flex-col md:flex-row gap-8">
              <div className="hidden md:block w-48 shrink-0">
                <img
                  src={getImageUrl(movie.poster_path)}
                  className="w-full rounded-xl shadow-2xl border-4 border-background"
                  alt={movie.title}
                />
                
                {details?.watch_link && (
                  <Button 
                    className="w-full mt-4 gap-2 font-bold" 
                    asChild
                  >
                    <a href={details.watch_link} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-4 h-4" />
                      Watch Now
                    </a>
                  </Button>
                )}
              </div>

              <div className="flex-1 space-y-6">
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <DialogHeader>
                      <DialogTitle className="text-4xl font-black tracking-tight mb-2">
                        {movie.title}
                      </DialogTitle>
                    </DialogHeader>
                    <div className="flex flex-wrap gap-3 items-center text-sm text-muted-foreground">
                      <Badge variant="outline" className="flex gap-1 items-center">
                        <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                        {movie.vote_average.toFixed(1)}
                      </Badge>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {movie.release_date?.split("-")[0]}
                      </span>
                      {details?.runtime && (
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {details.runtime} min
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant={inWatchlist ? "secondary" : "default"}
                      size="icon"
                      className="rounded-full shrink-0"
                      onClick={() => toggleWatchlist(movie)}
                    >
                      {inWatchlist ? <Check className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                    </Button>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {details?.genres?.map((g) => (
                    <Badge key={g} variant="secondary" className="rounded-full px-4">
                      {g}
                    </Badge>
                  ))}
                </div>

                <div className="space-y-2">
                  <h4 className="text-sm font-bold uppercase tracking-wider text-primary">Overview</h4>
                  <p className="text-muted-foreground leading-relaxed">{movie.overview}</p>
                </div>

                {details?.providers && details.providers.length > 0 && (
                  <div className="p-4 bg-primary/5 rounded-xl border border-primary/10">
                    <h4 className="text-xs font-bold uppercase text-primary mb-3">Available On</h4>
                    <div className="flex flex-wrap gap-4">
                      {details.providers.map((p) => (
                        <div key={p.provider_id} className="flex items-center gap-2 group">
                          <img 
                            src={getImageUrl(p.logo_path, "w92")} 
                            alt={p.provider_name}
                            className="w-8 h-8 rounded-lg shadow-sm group-hover:scale-110 transition-transform"
                          />
                          <span className="text-sm font-medium">{p.provider_name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {movie._reason && (
                  <div className="p-4 bg-blue-500/10 rounded-xl border border-blue-500/20 flex gap-3">
                    <Info className="w-5 h-5 text-blue-500 shrink-0" />
                    <div>
                      <h4 className="text-xs font-bold uppercase text-blue-500 mb-1">AI Insight</h4>
                      <p className="text-sm text-blue-700/80 dark:text-blue-300/80 italic">
                        "{movie._reason}"
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default MovieDialog;