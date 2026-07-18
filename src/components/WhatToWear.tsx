import { Shirt, Umbrella, Snowflake, Sun, Wind, CloudRain } from "lucide-react";
import GlassCard from "./GlassCard";
import type { WeatherData } from "@/lib/weather";
import { useUnits } from "@/hooks/useUnits";

interface Props {
  weather: WeatherData;
}

function getSuggestions(tempC: number, rainProb: number, windSpeed: number, uvIndex: number) {
  const items: { icon: typeof Shirt; text: string; color: string }[] = [];

  if (tempC <= 0) {
    items.push({ icon: Snowflake, text: "Heavy winter coat, gloves & scarf", color: "text-blue-400" });
  } else if (tempC <= 10) {
    items.push({ icon: Wind, text: "Warm jacket & layers recommended", color: "text-sky-400" });
  } else if (tempC <= 20) {
    items.push({ icon: Shirt, text: "Light jacket or sweater", color: "text-emerald-400" });
  } else if (tempC <= 30) {
    items.push({ icon: Shirt, text: "Light, breathable clothing", color: "text-green-400" });
  } else {
    items.push({ icon: Sun, text: "Very light clothes, stay hydrated", color: "text-orange-400" });
  }

  if (rainProb > 40) {
    items.push({ icon: Umbrella, text: `Carry an umbrella (${rainProb}% rain chance)`, color: "text-blue-400" });
  }

  if (uvIndex >= 6) {
    items.push({ icon: Sun, text: `Sunscreen recommended (UV ${uvIndex})`, color: "text-yellow-400" });
  }

  if (windSpeed > 30) {
    items.push({ icon: Wind, text: "Windproof layer advised", color: "text-sky-400" });
  }

  return items;
}

const WhatToWear = ({ weather }: Props) => {
  const { convertTemp } = useUnits();
  const tempC = weather.current.temperature;
  const rainProb = weather.hourly.precipitation_probability[0] ?? 0;
  const uvIndex = weather.daily.uv_index_max[0] ?? 0;
  const suggestions = getSuggestions(tempC, rainProb, weather.current.windspeed, uvIndex);

  return (
    <GlassCard delay={0.4} className="p-4">
      <div className="flex items-center gap-2 mb-3 px-2">
        <Shirt className="w-4 h-4 text-muted-foreground" />
        <p className="text-sm font-medium text-muted-foreground">What to Wear</p>
      </div>
      <div className="space-y-2">
        {suggestions.map((s, i) => (
          <div key={i} className="flex items-center gap-3 rounded-xl border border-[hsl(var(--glass-border))] bg-[hsl(var(--glass-bg))] backdrop-blur-lg px-4 py-3">
            <s.icon className={`w-5 h-5 flex-shrink-0 ${s.color}`} />
            <span className="text-sm text-foreground">{s.text}</span>
          </div>
        ))}
      </div>
    </GlassCard>
  );
};

export default WhatToWear;
