import React from "react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

const GENRES = [
  "Action", "Adventure", "Animation", "Comedy", "Crime", 
  "Documentary", "Drama", "Family", "Fantasy", "History", 
  "Horror", "Music", "Mystery", "Romance", "Sci-Fi", "Thriller"
];

interface GenreFilterProps {
  selected: string | null;
  onSelect: (genre: string | null) => void;
}

const GenreFilter = ({ selected, onSelect }: GenreFilterProps) => {
  return (
    <ScrollArea className="w-full whitespace-nowrap pb-4">
      <div className="flex w-max space-x-2">
        <Badge
          variant={selected === null ? "default" : "outline"}
          className="cursor-pointer px-6 py-2 rounded-full text-sm transition-all"
          onClick={() => onSelect(null)}
        >
          All
        </Badge>
        {GENRES.map((genre) => (
          <Badge
            key={genre}
            variant={selected === genre ? "default" : "outline"}
            className="cursor-pointer px-6 py-2 rounded-full text-sm transition-all hover:bg-primary/20"
            onClick={() => onSelect(genre)}
          >
            {genre}
          </Badge>
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
};

export default GenreFilter;