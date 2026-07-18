import { Wind, Thermometer, Droplets, Navigation } from "lucide-react";
import GlassCard from "./GlassCard";
import WeatherIcon from "./WeatherIcon";
import { getConditionFromCode, getWindDirection } from "@/lib/weather";
import type { WeatherData } from "@/lib/weather";
import { useUnits } from "@/hooks/useUnits";

interface Props {
  weather: WeatherData;
}

const CurrentWeather = ({ weather }: Props) => {
  const { temperature, apparent_temperature, windspeed, winddirection, weathercode, relative_humidity, is_day } = weather.current;
  const condition = getConditionFromCode(weathercode);
  const windDir = getWindDirection(winddirection);
  const { convertTemp, tempLabel, convertSpeed, speedLabel } = useUnits();

  return (
    <GlassCard delay={0.1}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-primary/10">
            <WeatherIcon type={condition.type} isNight={is_day === 0} className="w-7 h-7 text-primary" />
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Current</p>
            <p className="text-lg font-semibold text-foreground mt-0.5">{condition.label}</p>
          </div>
        </div>
        <div className="text-right space-y-1.5">
          <div className="flex items-center justify-end gap-1.5 text-sm text-muted-foreground">
            <Wind className="w-3.5 h-3.5" />
            <span className="font-medium text-foreground">{convertSpeed(windspeed)} {speedLabel}</span>
            <Navigation className="w-3 h-3 text-muted-foreground" style={{ transform: `rotate(${winddirection}deg)` }} />
            <span className="text-xs">{windDir}</span>
          </div>
          <div className="flex items-center justify-end gap-1.5 text-sm text-muted-foreground">
            <Thermometer className="w-3.5 h-3.5" />
            <span>Feels <span className="font-medium text-foreground">{convertTemp(apparent_temperature)}{tempLabel}</span></span>
          </div>
          <div className="flex items-center justify-end gap-1.5 text-sm text-muted-foreground">
            <Droplets className="w-3.5 h-3.5" />
            <span className="font-medium text-foreground">{relative_humidity}%</span>
          </div>
        </div>
      </div>
    </GlassCard>
  );
};

export default CurrentWeather;
