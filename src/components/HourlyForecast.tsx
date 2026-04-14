import { useRef } from "react";
import { motion } from "framer-motion";
import { Clock, Droplets } from "lucide-react";
import GlassCard from "./GlassCard";
import WeatherIcon from "./WeatherIcon";
import { getConditionInfo, formatHour } from "@/lib/weather";
import type { WeatherData } from "@/lib/weather";
import { useUnits } from "@/hooks/useUnits";

interface Props {
  weather: WeatherData;
  selectedDay?: number;
  onDayChange?: (dayIdx: number) => void;
}

const HourlyForecast = ({ weather, selectedDay = -1, onDayChange }: Props) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { time, temperature_2m, precipitation_probability, weathercode } = weather.hourly;
  const { convertTemp } = useUnits();
  const days = weather.daily.time;

  let hours: { idx: number; time: string }[] = [];
  if (selectedDay <= 0) {
    const now = new Date();
    const startIdx = time.findIndex((t) => new Date(t) >= now);
    if (startIdx >= 0) {
      hours = time.slice(startIdx, startIdx + 24).map((t, i) => ({ idx: startIdx + i, time: t }));
    }
  } else {
    const dayDate = days[selectedDay];
    hours = time.map((t, i) => ({ idx: i, time: t })).filter(({ time: t }) => t.startsWith(dayDate));
  }

  const activeDayIdx = selectedDay <= 0 ? -1 : selectedDay;

  return (
    <GlassCard delay={0.2} className="p-4">
      <div className="flex items-center gap-2 mb-3 px-2">
        <Clock className="w-4 h-4 text-muted-foreground" />
        <p className="text-sm font-medium text-muted-foreground">Hourly Forecast</p>
      </div>
      <div className="flex gap-1.5 overflow-x-auto scrollbar-hide mb-3 px-1">
        <button
          onClick={() => onDayChange?.(-1)}
          className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
            activeDayIdx === -1
              ? "bg-primary text-primary-foreground shadow-sm"
              : "bg-[hsl(var(--glass-bg))] text-muted-foreground hover:text-foreground border border-[hsl(var(--glass-border))]"
          }`}
        >
          Now
        </button>
        {days.map((d, i) => (
          <button
            key={d}
            onClick={() => onDayChange?.(i)}
            className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              activeDayIdx === i
                ? "bg-primary text-primary-foreground shadow-sm"
                : "bg-[hsl(var(--glass-bg))] text-muted-foreground hover:text-foreground border border-[hsl(var(--glass-border))]"
            }`}
          >
            {i === 0 ? "Today" : new Date(d).toLocaleDateString([], { weekday: "short" })}
          </button>
        ))}
      </div>
      <div ref={scrollRef} className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {hours.map(({ idx, time: t }, i) => {
          const temp = temperature_2m[idx];
          const rain = precipitation_probability[idx];
          const code = weathercode[idx];
          const cond = getConditionInfo(code, rain);
          return (
            <motion.div
              key={t}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.02 * i, duration: 0.25 }}
              className="flex-shrink-0 w-[90px] rounded-xl border border-[hsl(var(--glass-border))] bg-[hsl(var(--glass-bg))] backdrop-blur-lg p-3 text-center hover:scale-105 transition-transform"
            >
              <p className="text-xs text-muted-foreground">{formatHour(t)}</p>
              <div className="flex justify-center my-2">
                <WeatherIcon type={cond.type} className="w-5 h-5 text-primary" />
              </div>
              <p className="text-sm font-semibold text-foreground">{convertTemp(temp)}°</p>
              <div className="flex items-center justify-center gap-0.5 mt-1">
                <Droplets className="w-2.5 h-2.5 text-primary/60" />
                <p className="text-[10px] text-muted-foreground">{rain}%</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </GlassCard>
  );
};

export default HourlyForecast;
