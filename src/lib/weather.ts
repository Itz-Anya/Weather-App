export interface LocationData {
  city: string;
  country: string;
  lat: number;
  lon: number;
}

export interface WeatherData {
  current: {
    temperature: number;
    apparent_temperature: number;
    windspeed: number;
    winddirection: number;
    weathercode: number;
    surface_pressure: number;
    relative_humidity: number;
    is_day: number;
  };
  hourly: {
    time: string[];
    temperature_2m: number[];
    precipitation_probability: number[];
    weathercode: number[];
    relative_humidity_2m: number[];
    visibility: number[];
    apparent_temperature: number[];
  };
  daily: {
    time: string[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    precipitation_sum: number[];
    weathercode: number[];
    uv_index_max: number[];
    sunrise: string[];
    sunset: string[];
    precipitation_probability_max: number[];
  };
}

export interface GeocodingResult {
  name: string;
  country: string;
  latitude: number;
  longitude: number;
  admin1?: string;
  country_code?: string;
}

// Use browser GPS first for precise location, then fall back to IP-based
export async function fetchLocation(): Promise<LocationData> {
  // Attempt 1: Browser Geolocation API (most accurate — GPS/WiFi)
  try {
    const pos = await new Promise<GeolocationPosition>((resolve, reject) => {
      if (!navigator.geolocation) return reject(new Error("No geolocation"));
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: true,
        timeout: 8000,
        maximumAge: 300000,
      });
    });
    const { latitude, longitude } = pos.coords;
    // Reverse geocode to get city name
    const cityName = await reverseGeocode(latitude, longitude);
    return { city: cityName.city, country: cityName.country, lat: latitude, lon: longitude };
  } catch {}

  // Attempt 2: ipapi.co
  try {
    const res = await fetch("https://ipapi.co/json/", { signal: AbortSignal.timeout(5000) });
    if (res.ok) {
      const data = await res.json();
      if (data.latitude && data.longitude) {
        return { city: data.city, country: data.country_name, lat: data.latitude, lon: data.longitude };
      }
    }
  } catch {}

  // Attempt 3: ipwho.is
  try {
    const res = await fetch("https://ipwho.is/", { signal: AbortSignal.timeout(5000) });
    if (res.ok) {
      const data = await res.json();
      if (data.success !== false && data.latitude && data.longitude) {
        return { city: data.city, country: data.country, lat: data.latitude, lon: data.longitude };
      }
    }
  } catch {}

  throw new Error("Could not detect your location. Please search for a city above.");
}

async function reverseGeocode(lat: number, lon: number): Promise<{ city: string; country: string }> {
  try {
    const res = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=&latitude=${lat}&longitude=${lon}&count=1&language=en&format=json`
    );
    // Open-Meteo doesn't have reverse geocoding, use nominatim
    const nomRes = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&zoom=10`,
      { headers: { "User-Agent": "SoftForecastWeatherApp/1.0" } }
    );
    if (nomRes.ok) {
      const data = await nomRes.json();
      const city = data.address?.city || data.address?.town || data.address?.village || data.address?.suburb || data.name || "Unknown";
      const country = data.address?.country || "Unknown";
      return { city, country };
    }
  } catch {}
  return { city: "Your Location", country: "" };
}

export async function searchCities(query: string): Promise<GeocodingResult[]> {
  if (!query || query.length < 2) return [];
  const res = await fetch(
    `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=8&language=en&format=json`
  );
  if (!res.ok) return [];
  const data = await res.json();
  const results: GeocodingResult[] = data.results || [];
  
  // Deduplicate by name + admin1 + country
  const seen = new Set<string>();
  return results.filter((r) => {
    const key = `${r.name}-${r.admin1 || ""}-${r.country}`.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  }).slice(0, 5);
}

export async function fetchWeather(lat: number, lon: number): Promise<WeatherData> {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m,precipitation_probability,weathercode,relative_humidity_2m,visibility,apparent_temperature&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,weathercode,uv_index_max,sunrise,sunset,precipitation_probability_max&current_weather=true&current=apparent_temperature,surface_pressure,relative_humidity_2m,wind_direction_10m,is_day&timezone=auto`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch weather data");
  const data = await res.json();
  return {
    current: {
      temperature: data.current_weather.temperature,
      apparent_temperature: data.current?.apparent_temperature ?? data.current_weather.temperature,
      windspeed: data.current_weather.windspeed,
      winddirection: data.current?.wind_direction_10m ?? data.current_weather.winddirection,
      weathercode: data.current_weather.weathercode,
      surface_pressure: data.current?.surface_pressure ?? 0,
      relative_humidity: data.current?.relative_humidity_2m ?? 0,
      is_day: data.current_weather.is_day ?? 1,
    },
    hourly: data.hourly,
    daily: data.daily,
  };
}

export type WeatherCondition = "clear" | "cloudy" | "rain" | "possible-rain" | "likely-rain" | "snow" | "showers" | "thunderstorm" | "fog";

export function getConditionInfo(weathercode: number, rainProb: number): { label: string; type: WeatherCondition } {
  if (weathercode >= 95) return { label: "Thunderstorm", type: "thunderstorm" };
  if (weathercode >= 71 && weathercode <= 77) return { label: "Snow", type: "snow" };
  if (weathercode >= 61 && weathercode <= 67) return { label: "Rain", type: "rain" };
  if (weathercode >= 80) return { label: "Showers", type: "showers" };
  if (weathercode >= 45 && weathercode <= 48) return { label: "Foggy", type: "fog" };
  if (rainProb > 60) return { label: "Likely Rain", type: "likely-rain" };
  if (rainProb > 30) return { label: "Possible Rain", type: "possible-rain" };
  if (weathercode === 0) return { label: "Clear", type: "clear" };
  return { label: "Cloudy", type: "cloudy" };
}

export function getConditionFromCode(weathercode: number): { label: string; type: WeatherCondition } {
  if (weathercode >= 95) return { label: "Thunderstorm", type: "thunderstorm" };
  if (weathercode === 0) return { label: "Clear", type: "clear" };
  if (weathercode <= 3) return { label: "Cloudy", type: "cloudy" };
  if (weathercode >= 45 && weathercode <= 48) return { label: "Foggy", type: "fog" };
  if (weathercode >= 61 && weathercode <= 67) return { label: "Rain", type: "rain" };
  if (weathercode >= 71 && weathercode <= 77) return { label: "Snow", type: "snow" };
  if (weathercode >= 80) return { label: "Showers", type: "showers" };
  return { label: "Cloudy", type: "cloudy" };
}

export function formatHour(iso: string): string {
  return new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export function formatDay(iso: string): string {
  return new Date(iso).toLocaleDateString([], { weekday: "short", month: "short", day: "numeric" });
}

export function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export function getWindDirection(degrees: number): string {
  const dirs = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
  return dirs[Math.round(degrees / 22.5) % 16];
}

export function getUVLevel(uv: number): { label: string; color: string } {
  if (uv <= 2) return { label: "Low", color: "text-green-400" };
  if (uv <= 5) return { label: "Moderate", color: "text-yellow-400" };
  if (uv <= 7) return { label: "High", color: "text-orange-400" };
  if (uv <= 10) return { label: "Very High", color: "text-red-400" };
  return { label: "Extreme", color: "text-purple-400" };
}
