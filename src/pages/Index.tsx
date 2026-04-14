import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { MapPin, AlertTriangle, RefreshCw, Navigation, Sun, Moon, Star, StarOff, Thermometer, Wind } from "lucide-react";
import { fetchLocation, fetchWeather } from "@/lib/weather";
import type { LocationData, WeatherData, GeocodingResult } from "@/lib/weather";
import CurrentWeather from "@/components/CurrentWeather";
import HourlyForecast from "@/components/HourlyForecast";
import DailyForecast from "@/components/DailyForecast";
import WeatherDetails from "@/components/WeatherDetails";
import CitySearch from "@/components/CitySearch";
import WeatherIcon from "@/components/WeatherIcon";
import WeatherSkeleton from "@/components/WeatherSkeleton";
import WeatherBackground from "@/components/WeatherBackground";
import TemperatureChart from "@/components/TemperatureChart";
import AirQuality from "@/components/AirQuality";
import WhatToWear from "@/components/WhatToWear";
import ShareWeather from "@/components/ShareWeather";
import FavoriteCities from "@/components/FavoriteCities";
import Footer from "@/components/Footer";
import { getConditionFromCode } from "@/lib/weather";
import { useTheme } from "@/hooks/useTheme";
import { useUnits } from "@/hooks/useUnits";
import { useFavorites } from "@/hooks/useFavorites";

const Index = () => {
  const [location, setLocation] = useState<LocationData | null>(null);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState(-1);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const { theme, toggleTheme } = useTheme();
  const { convertTemp, tempLabel, convertSpeed, speedLabel, toggleTemp, toggleSpeed, tempUnit, speedUnit } = useUnits();
  const { favorites, addFavorite, removeFavorite, isFavorite } = useFavorites();

  const loadWeather = async (lat: number, lon: number, city: string, country: string) => {
    setLoading(true);
    setError(null);
    try {
      const w = await fetchWeather(lat, lon);
      setLocation({ city, country, lat, lon });
      setWeather(w);
      setLastUpdated(new Date());
    } catch (e: any) {
      setError(e.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const initLocation = async () => {
    try {
      const loc = await fetchLocation();
      await loadWeather(loc.lat, loc.lon, loc.city, loc.country);
    } catch {
      setError("Could not detect your location. Please search for a city above.");
      setLoading(false);
    }
  };

  useEffect(() => {
    initLocation();
  }, []);

  const handleCitySelect = (result: GeocodingResult) => {
    setSelectedDay(-1);
    loadWeather(result.latitude, result.longitude, result.name, result.country);
  };

  const handleFavoriteSelect = (city: { name: string; country: string; lat: number; lon: number }) => {
    setSelectedDay(-1);
    loadWeather(city.lat, city.lon, city.name, city.country);
  };

  const handleRefresh = () => {
    if (location) loadWeather(location.lat, location.lon, location.city, location.country);
  };

  const toggleFavorite = () => {
    if (!location) return;
    if (isFavorite(location.lat, location.lon)) {
      removeFavorite(location.lat, location.lon);
    } else {
      addFavorite({ name: location.city, country: location.country, lat: location.lat, lon: location.lon });
    }
  };

  const condition = weather ? getConditionFromCode(weather.current.weathercode) : null;
  const isNight = weather ? weather.current.is_day === 0 : false;

  return (
    <div className="min-h-screen pb-12 relative" style={{ background: "var(--gradient-sky)" }}>
      {/* Animated weather background */}
      {condition && <WeatherBackground condition={condition.type} isNight={isNight} />}

      <div className="max-w-xl mx-auto px-4 pt-6 relative z-10">
        {/* Top bar: theme + units */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-1.5">
            <button onClick={toggleTemp} className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-[hsl(var(--glass-bg))] border border-[hsl(var(--glass-border))] backdrop-blur-lg text-foreground hover:bg-primary/10 transition-colors">
              {tempUnit === "C" ? "°C" : "°F"}
            </button>
            <button onClick={toggleSpeed} className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-[hsl(var(--glass-bg))] border border-[hsl(var(--glass-border))] backdrop-blur-lg text-foreground hover:bg-primary/10 transition-colors">
              {speedUnit === "kmh" ? "km/h" : "mph"}
            </button>
          </div>
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full bg-[hsl(var(--glass-bg))] border border-[hsl(var(--glass-border))] backdrop-blur-lg hover:bg-primary/10 transition-colors"
            title="Toggle theme"
          >
            {theme === "light" ? <Moon className="w-4 h-4 text-foreground" /> : <Sun className="w-4 h-4 text-foreground" />}
          </button>
        </div>

        {/* Search Bar */}
        <div className="mb-3">
          <CitySearch onSelect={handleCitySelect} />
        </div>

        {/* Favorite cities bar */}
        {favorites.length > 0 && (
          <div className="mb-4">
            <FavoriteCities favorites={favorites} onSelect={handleFavoriteSelect} onRemove={removeFavorite} />
          </div>
        )}

        {loading && !weather ? (
          <WeatherSkeleton />
        ) : error && !weather ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-2xl border border-destructive/30 bg-destructive/10 backdrop-blur-xl p-8 text-center"
          >
            <AlertTriangle className="w-10 h-10 text-destructive mx-auto mb-3" />
            <p className="text-foreground font-semibold">Couldn't detect your location</p>
            <p className="text-muted-foreground text-sm mt-2">Use the search bar above to find your city</p>
            <button
              onClick={initLocation}
              className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              <Navigation className="w-4 h-4" />
              Retry Location
            </button>
          </motion.div>
        ) : (
          <>
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-8"
            >
              <div className="flex items-center justify-center gap-1.5 text-sm font-medium text-muted-foreground">
                <MapPin className="w-3.5 h-3.5" />
                <span>{location?.city}{location?.country ? `, ${location.country}` : ""}</span>
                <button onClick={toggleFavorite} className="ml-1 p-1 rounded-full hover:bg-primary/10 transition-colors" title="Toggle favorite">
                  {location && isFavorite(location.lat, location.lon)
                    ? <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                    : <Star className="w-3.5 h-3.5 text-muted-foreground" />
                  }
                </button>
                <button onClick={handleRefresh} className="p-1 rounded-full hover:bg-primary/10 transition-colors" title="Refresh">
                  <RefreshCw className={`w-3.5 h-3.5 text-muted-foreground ${loading ? "animate-spin" : ""}`} />
                </button>
                {weather && location && <ShareWeather weather={weather} location={location} />}
              </div>
              <div className="flex items-center justify-center gap-4 mt-3">
                <p className="text-7xl font-extralight text-foreground tracking-tight">
                  {weather ? convertTemp(weather.current.temperature) : "--"}°
                </p>
                {condition && (
                  <WeatherIcon type={condition.type} isNight={isNight} className="w-12 h-12 text-primary opacity-80" />
                )}
              </div>
              {condition && (
                <p className="text-sm text-muted-foreground mt-2">{condition.label}</p>
              )}
              {weather && (
                <div className="flex items-center justify-center gap-4 mt-2 text-xs text-muted-foreground">
                  <span>H: {convertTemp(weather.daily.temperature_2m_max[0])}°</span>
                  <span>L: {convertTemp(weather.daily.temperature_2m_min[0])}°</span>
                  <span>Feels {convertTemp(weather.current.apparent_temperature)}°</span>
                </div>
              )}
              {lastUpdated && (
                <p className="text-[10px] text-muted-foreground/60 mt-1.5">
                  Updated {lastUpdated.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </p>
              )}
            </motion.div>

            {weather && <CurrentWeather weather={weather} />}
            <div className="mt-4">{weather && <WeatherDetails weather={weather} />}</div>
            <div className="mt-4">{weather && <TemperatureChart weather={weather} />}</div>
            <div className="mt-4">
              {weather && (
                <HourlyForecast weather={weather} selectedDay={selectedDay} onDayChange={setSelectedDay} />
              )}
            </div>
            <div className="mt-4">{weather && <DailyForecast weather={weather} />}</div>
            <div className="mt-4">{location && <AirQuality lat={location.lat} lon={location.lon} />}</div>
            <div className="mt-4">{weather && <WhatToWear weather={weather} />}</div>

            {/* Precipitation summary */}
            {weather && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="mt-4 rounded-2xl border border-[hsl(var(--glass-border))] bg-[hsl(var(--glass-bg))] backdrop-blur-xl shadow-glass p-4"
              >
                <p className="text-sm font-medium text-muted-foreground mb-3">Precipitation Chance</p>
                <div className="flex items-end gap-1 h-16">
                  {weather.daily.precipitation_probability_max.map((prob, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1">
                      <div
                        className="w-full rounded-t-md bg-primary/30 transition-all"
                        style={{ height: `${Math.max(prob * 0.6, 2)}px` }}
                      >
                        <div
                          className="w-full rounded-t-md bg-primary/70"
                          style={{ height: `${Math.max(prob * 0.4, 1)}px` }}
                        />
                      </div>
                      <span className="text-[9px] text-muted-foreground">
                        {i === 0 ? "Today" : new Date(weather.daily.time[i]).toLocaleDateString([], { weekday: "narrow" })}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            <Footer />
          </>
        )}
      </div>
    </div>
  );
};

export default Index;
