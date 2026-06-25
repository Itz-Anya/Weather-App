import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, MapPin, Loader2 } from "lucide-react";
import { searchCities } from "@/lib/weather";
import type { GeocodingResult } from "@/lib/weather";

interface Props {
  onSelect: (result: GeocodingResult) => void;
}

const CitySearch = ({ onSelect }: Props) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<GeocodingResult[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleChange = (value: string) => {
    setQuery(value);
    clearTimeout(timerRef.current);
    if (value.length < 2) {
      setResults([]);
      setOpen(false);
      return;
    }
    setLoading(true);
    timerRef.current = setTimeout(async () => {
      const res = await searchCities(value);
      setResults(res);
      setOpen(res.length > 0);
      setLoading(false);
    }, 300);
  };

  const handleSelect = (r: GeocodingResult) => {
    setQuery("");
    setResults([]);
    setOpen(false);
    onSelect(r);
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-md mx-auto">
      <div className="flex items-center rounded-xl border border-[hsl(var(--glass-border))] bg-[hsl(var(--glass-bg))] backdrop-blur-xl px-4 py-2.5 shadow-glass-sm transition-shadow focus-within:shadow-glass">
        <Search className="w-4 h-4 text-muted-foreground mr-2.5" />
        <input
          type="text"
          value={query}
          onChange={(e) => handleChange(e.target.value)}
          placeholder="Search any city…"
          className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
        />
        {loading && <Loader2 className="w-4 h-4 text-primary animate-spin" />}
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 mt-2 w-full rounded-xl border border-[hsl(var(--glass-border))] bg-[hsl(var(--glass-bg))] backdrop-blur-xl shadow-glass overflow-hidden"
          >
            {results.map((r, i) => (
              <button
                key={`${r.latitude}-${r.longitude}-${i}`}
                onClick={() => handleSelect(r)}
                className="w-full text-left px-4 py-3 text-sm text-foreground hover:bg-primary/10 transition-colors border-b border-[hsl(var(--glass-border))] last:border-b-0 flex items-center gap-2.5"
              >
                <MapPin className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                <div>
                  <span className="font-medium">{r.name}</span>
                  <span className="text-muted-foreground ml-1.5 text-xs">
                    {r.admin1 ? `${r.admin1}, ` : ""}{r.country}
                  </span>
                </div>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CitySearch;
