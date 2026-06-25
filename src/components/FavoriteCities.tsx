import { motion, AnimatePresence } from "framer-motion";
import { Star, X, MapPin } from "lucide-react";
import type { FavoriteCity } from "@/hooks/useFavorites";

interface Props {
  favorites: FavoriteCity[];
  onSelect: (city: FavoriteCity) => void;
  onRemove: (lat: number, lon: number) => void;
}

const FavoriteCities = ({ favorites, onSelect, onRemove }: Props) => {
  if (favorites.length === 0) return null;

  return (
    <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
      <AnimatePresence>
        {favorites.map((city) => (
          <motion.button
            key={`${city.lat}-${city.lon}`}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => onSelect(city)}
            className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-[hsl(var(--glass-bg))] border border-[hsl(var(--glass-border))] backdrop-blur-lg text-foreground hover:bg-primary/10 transition-colors group"
          >
            <MapPin className="w-3 h-3 text-muted-foreground" />
            <span>{city.name}</span>
            <X
              className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={(e) => { e.stopPropagation(); onRemove(city.lat, city.lon); }}
            />
          </motion.button>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default FavoriteCities;
