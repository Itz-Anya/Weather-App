import { Droplets, Sun, Sunrise, Sunset, Thermometer, Wind, Gauge, Eye } from "lucide-react";
import GlassCard from "./GlassCard";
import { formatTime, getWindDirection, getUVLevel } from "@/lib/weather";
import type { WeatherData } from "@/lib/weather";
import { useUnits } from "@/hooks/useUnits";
import { Shield } from "lucide-react";

interface Props {
  weather: WeatherData;
}

const WeatherDetails = ({ weather }: Props) => {
  const { convertTemp, tempLabel, convertSpeed, speedLabel } = useUnits();
  const now = new Date();
  const hourIdx = weather.hourly.time.findIndex((t) => new Date(t) >= now);
  const humidity = weather.current.relative_humidity ?? (weather.hourly.relative_humidity_2m[hourIdx] ?? "--");
  const uvIndex = weather.daily.uv_index_max[0] ?? 0;
  const uvInfo = getUVLevel(uvIndex);
  const sunrise = weather.daily.sunrise[0];
  const sunset = weather.daily.sunset[0];
  const windspeed = weather.current.windspeed;
  const windDir = getWindDirection(weather.current.winddirection);
  const pressure = weather.current.surface_pressure;
  const feelsLike = weather.current.apparent_temperature;
  const visibility = weather.hourly.visibility?.[hourIdx];
  const visibilityKm = visibility ? (visibility / 1000).toFixed(1) : "--";

  const items = [
    { icon: Thermometer, label: "Feels Like", value: `${convertTemp(feelsLike)}${tempLabel}`, color: "text-emerald-400" },
    { icon: Droplets, label: "Humidity", value: `${humidity}%`, color: "text-primary/80" },
    { icon: Sun, label: "UV Index", value: `${uvIndex}`, sub: uvInfo.label, color: uvInfo.color },
    { icon: Wind, label: "Wind", value: `${convertSpeed(windspeed)} ${speedLabel}`, sub: windDir, color: "text-primary/60" },
    { icon: Gauge, label: "Pressure", value: `${Math.round(pressure)} hPa`, color: "text-accent-foreground" },
    { icon: Eye, label: "Visibility", value: `${visibilityKm} km`, color: "text-emerald-400" },
    { icon: Sunrise, label: "Sunrise", value: sunrise ? formatTime(sunrise) : "--", color: "text-destructive/60" },
    { icon: Sunset, label: "Sunset", value: sunset ? formatTime(sunset) : "--", color: "text-primary" },
  ];

  return (
    <GlassCard delay={0.15} className="p-4">
      <div className="flex items-center gap-2 mb-3 px-2">
        <Shield className="w-4 h-4 text-muted-foreground" />
        <p className="text-sm font-medium text-muted-foreground">Weather Details</p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {items.map((item) => (
          <div
            key={item.label}
            className="flex flex-col items-center gap-1.5 rounded-xl border border-[hsl(var(--glass-border))] bg-[hsl(var(--glass-bg))] backdrop-blur-lg p-3 text-center transition-transform hover:scale-105"
          >
            <item.icon className={`w-5 h-5 ${item.color}`} />
            <span className="text-[10px] text-muted-foreground uppercase tracking-wider">{item.label}</span>
            <span className="text-sm font-semibold text-foreground">{item.value}</span>
            {item.sub && (
              <span className={`text-[10px] font-medium ${item.color}`}>{item.sub}</span>
            )}
          </div>
        ))}
      </div>
    </GlassCard>
  );
};

export default WeatherDetails;
