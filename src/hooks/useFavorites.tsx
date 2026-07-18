import { useState, useEffect } from "react";

export interface FavoriteCity {
  name: string;
  country: string;
  lat: number;
  lon: number;
}

const STORAGE_KEY = "weather-favorites";

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<FavoriteCity[]>(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    } catch { return []; }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
  }, [favorites]);

  const addFavorite = (city: FavoriteCity) => {
    setFavorites((prev) => {
      if (prev.some((f) => f.lat === city.lat && f.lon === city.lon)) return prev;
      return [...prev, city].slice(0, 10);
    });
  };

  const removeFavorite = (lat: number, lon: number) => {
    setFavorites((prev) => prev.filter((f) => f.lat !== lat || f.lon !== lon));
  };

  const isFavorite = (lat: number, lon: number) => favorites.some((f) => f.lat === lat && f.lon === lon);

  return { favorites, addFavorite, removeFavorite, isFavorite };
};
