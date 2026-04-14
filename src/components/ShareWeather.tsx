import { Share2, Copy, Check } from "lucide-react";
import { useState } from "react";
import type { WeatherData, LocationData } from "@/lib/weather";
import { getConditionFromCode } from "@/lib/weather";
import { useUnits } from "@/hooks/useUnits";

interface Props {
  weather: WeatherData;
  location: LocationData;
}

const ShareWeather = ({ weather, location }: Props) => {
  const [copied, setCopied] = useState(false);
  const { convertTemp, tempLabel, convertSpeed, speedLabel } = useUnits();
  const condition = getConditionFromCode(weather.current.weathercode);

  const text = `🌤 Weather in ${location.city}, ${location.country}\n` +
    `🌡 ${convertTemp(weather.current.temperature)}${tempLabel} (Feels ${convertTemp(weather.current.apparent_temperature)}${tempLabel})\n` +
    `${condition.label} • 💨 ${convertSpeed(weather.current.windspeed)} ${speedLabel}\n` +
    `H: ${convertTemp(weather.daily.temperature_2m_max[0])}${tempLabel} L: ${convertTemp(weather.daily.temperature_2m_min[0])}${tempLabel}`;

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: "Weather Forecast", text });
      } catch {}
    } else {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <button
      onClick={handleShare}
      className="p-2 rounded-full hover:bg-primary/10 transition-colors"
      title="Share weather"
    >
      {copied ? <Check className="w-4 h-4 text-green-400" /> : <Share2 className="w-4 h-4 text-muted-foreground" />}
    </button>
  );
};

export default ShareWeather;
