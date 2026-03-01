import React from "react";
import { Home, Search, Bookmark, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface MobileNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  watchlistCount: number;
}

const MobileNav = ({ activeTab, onTabChange, watchlistCount }: MobileNavProps) => {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 px-6 pb-6 pt-2 bg-gradient-to-t from-background via-background/95 to-transparent">
      <div className="bg-card/80 backdrop-blur-2xl border border-white/10 rounded-3xl flex items-center justify-around p-2 shadow-2xl">
        {[
          { id: "home", icon: Home, label: "Home" },
          { id: "search", icon: Search, label: "Search" },
          { id: "ai", icon: Sparkles, label: "AI Discovery" },
          { id: "watchlist", icon: Bookmark, label: "Saved", count: watchlistCount },
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={cn(
              "relative flex flex-col items-center gap-1 p-3 rounded-2xl transition-all duration-300",
              activeTab === item.id ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-white"
            )}
          >
            <item.icon className="w-6 h-6" />
            <span className="text-[10px] font-bold uppercase tracking-tighter">{item.label}</span>
            {item.count !== undefined && item.count > 0 && (
              <span className="absolute top-2 right-2 w-4 h-4 bg-primary text-primary-foreground text-[10px] font-bold rounded-full flex items-center justify-center">
                {item.count}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default MobileNav;