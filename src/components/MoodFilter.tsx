import React from "react";
import { motion } from "framer-motion";
import { Brain, Zap, Heart, Ghost, Rocket, Coffee } from "lucide-react";
import { cn } from "@/lib/utils";

const MOODS = [
  { id: "mind-bending", label: "Mind-Bending", icon: Brain, color: "text-purple-400", bg: "bg-purple-400/10" },
  { id: "adrenaline", label: "Adrenaline", icon: Zap, color: "text-yellow-400", bg: "bg-yellow-400/10" },
  { id: "heartwarming", label: "Heartwarming", icon: Heart, color: "text-pink-400", bg: "bg-pink-400/10" },
  { id: "spooky", label: "Spooky", icon: Ghost, color: "text-gray-400", bg: "bg-gray-400/10" },
  { id: "epic", label: "Epic Scale", icon: Rocket, color: "text-blue-400", bg: "bg-blue-400/10" },
  { id: "chill", label: "Chill Vibe", icon: Coffee, color: "text-orange-400", bg: "bg-orange-400/10" },
];

interface MoodFilterProps {
  selected: string | null;
  onSelect: (id: string | null) => void;
}

const MoodFilter = ({ selected, onSelect }: MoodFilterProps) => {
  return (
    <div className="flex flex-wrap gap-3 justify-center">
      {MOODS.map((mood) => (
        <motion.button
          key={mood.id}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onSelect(selected === mood.id ? null : mood.id)}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-2xl border transition-all duration-300",
            selected === mood.id 
              ? "bg-primary border-primary text-primary-foreground shadow-lg shadow-primary/20" 
              : "bg-card border-border hover:border-primary/50 text-muted-foreground"
          )}
        >
          <mood.icon className={cn("w-4 h-4", selected === mood.id ? "text-current" : mood.color)} />
          <span className="text-sm font-bold">{mood.label}</span>
        </motion.button>
      ))}
    </div>
  );
};

export default MoodFilter;