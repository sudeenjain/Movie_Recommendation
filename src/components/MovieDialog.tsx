import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Movie } from "@/types/movie";
import { getMovieDetails, getImageUrl, getRecommendations } from "@/services/tmdb";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Star, Plus, Check, Info, Tv, Users, Film, Play } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { useWatchlist } from "@/hooks/use-watchlist";
import { motion } from "framer-motion";

interface MovieDialogProps {
  movie: Movie | null;
  isOpen: boolean;
  onClose: () => void;
}

const MovieDialog = ({ movie, isOpen, onClose }: MovieDialogProps) => {
  const [details, setDetails] = useState<Movie | null>(null);
  const [similar, setSimilar] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const { toggleWatchlist, isInWatchlist } = useWatchlist();

  useEffect(() => {
    if (movie && isOpen) {
      setLoading(true);
      Promise.all([
        getMovieDetails(movie.id),
        getRecommendations(movie.id)
      ]).then(([detailsData, similarData]) => {
        setDetails(detailsData);
        setSimilar(similarData.slice(0, 4));
        setLoading(false);
      });
    }
  }, [movie, isOpen]);

  if (!movie) return null;

  const inWatchlist = isInWatchlist(movie.id);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl p-0 overflow-hidden bg-background border-none shadow-2xl h-[90vh] md:h-auto">
        <ScrollArea className="h-full max-h-[90vh]">
          <div className="relative aspect-video w-full bg-black group">
            {details?.trailer_key ? (
              <iframe
                className="w-full h-full"
                src={`https://www.youtube.com/embed/${details.trailer_key}?autoplay=1&mute=0&rel=0&modestbranding=1`}
                title="Trailer"
                allow="autoplay; encrypted-media"
                allowFullScreen
              />
            ) : (
              <div className="relative w-full h-full">
                <img
                  src={getImageUrl(movie.backdrop_path, "original")}
                  className="w-full h-full object-cover opacity-60"
                  alt={movie.title}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center space-y-2">
                    <Film className="w-12 h-12 text-white/20 mx-auto" />
                    <p className="text-white/40 text-sm font-medium">Trailer not available</p>
                  </div>
                </div>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent pointer-events-none" />
          </div>

          <div className="p-6 md:p-8 -mt-12 md:-mt-20 relative z-10">
            <div className="flex flex-col md:flex-row gap-8">
              <div className="hidden md:block w-48 shrink-0">
                <motion.img
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  src={getImageUrl(movie.poster_path)}
                  className="w-full rounded-xl shadow-2xl border-4 border-background"
                  alt={movie.title}
                />
                
                {details?.watch_link && (
                  <Button 
                    className="w-full mt-4 gap-2 font-bold bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20" 
                    asChild
                  >
                    <a href={details.watch_link} target="_blank" rel="noopener noreferrer">
                      <Tv className="w-4 h-4" />
                      Watch Full Movie
                    </a>
                  </Button>
                )}
              </div>

              <div className="flex-1 space-y-6">
                <div className="flex justify-between items-start gap-4">
                  <div className="space-y-2">
                    <DialogHeader>
                      <DialogTitle className="text-3xl md:text-4xl font-black tracking-tight text-white">
                        {movie.title}
                      </DialogTitle>
                    </DialogHeader>
                    <div className="flex flex-wrap gap-3 items-center text-xs md:text-sm text-muted-foreground">
                      <Badge variant="outline" className="flex gap-1 items-center border-primary/20 text-primary font-bold">
                        <Star className="w-3 h-3 fill-primary text-primary" />
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
                      variant={inWatchlist ? "secondary" : "outline"}
                      size="icon"
                      className="rounded-full shrink-0 border-primary/20"
                      onClick={() => toggleWatchlist(movie)}
                    >
                      {inWatchlist ? <Check className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                    </Button>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {details?.genres?.map((g) => (
                    <Badge key={g} variant="secondary" className="rounded-full px-4 bg-white/5 hover:bg-white/10 text-white border-none text-[10px] md:text-xs">
                      {g}
                    </Badge>
                  ))}
                </div>

                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-primary">Overview</h4>
                  <p className="text-sm md:text-base text-muted-foreground leading-relaxed">{movie.overview}</p>
                </div>

                {details?.cast && details.cast.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-widest text-primary flex items-center gap-2">
                      <Users className="w-4 h-4" /> Starring
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {details.cast.map((name) => (
                        <span key={name} className="text-xs bg-white/5 px-3 py-1 rounded-full text-white/80">
                          {name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {similar.length > 0 && (
                  <div className="space-y-4 pt-4">
                    <h4 className="text-xs font-bold uppercase tracking-widest text-primary flex items-center gap-2">
                      <Film className="w-4 h-4" /> Similar Titles
                    </h4>
                    <div className="grid grid-cols-4 gap-3">
                      {similar.map((m) => (
                        <div key={m.id} className="space-y-1 group cursor-pointer" onClick={() => setDetails(null)}>
                          <img 
                            src={getImageUrl(m.poster_path, "w92")} 
                            className="w-full aspect-[2/3] object-cover rounded-lg border border-white/10 group-hover:border-primary/50 transition-colors"
                            alt=""
                          />
                          <p className="text-[10px] font-bold truncate text-muted-foreground group-hover:text-white transition-colors">
                            {m.title}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {details?.watch_link && (
                  <div className="md:hidden pt-4">
                    <Button className="w-full gap-2 font-bold bg-primary" asChild>
                      <a href={details.watch_link} target="_blank" rel="noopener noreferrer">
                        <Tv className="w-4 h-4" />
                        Watch Full Movie
                      </a>
                    </Button>
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