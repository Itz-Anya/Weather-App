import { motion } from "framer-motion";
import { CalendarDays, Droplets, ArrowUp, ArrowDown } from "lucide-react";
import GlassCard from "./GlassCard";
import WeatherIcon from "./WeatherIcon";
import { getConditionFromCode, formatDay } from "@/lib/weather";
import type { WeatherData } from "@/lib/weather";
import { useUnits } from "@/hooks/useUnits";

interface Props {
  weather: WeatherData;
}

const DailyForecast = ({ weather }: Props) => {
  const { time, temperature_2m_max, temperature_2m_min, precipitation_sum, weathercode } = weather.daily;
  const { convertTemp } = useUnits();

  return (
    <GlassCard delay={0.3} className="p-4">
      <div className="flex items-center gap-2 mb-3 px-2">
        <CalendarDays className="w-4 h-4 text-muted-foreground" />
        <p className="text-sm font-medium text-muted-foreground">7-Day Forecast</p>
      </div>
      <div className="space-y-2">
        {time.map((t, i) => {
          const cond = getConditionFromCode(weathercode[i]);
          return (
            <motion.div
              key={t}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.06 * i, duration: 0.3 }}
              className="flex items-center justify-between rounded-xl border border-[hsl(var(--glass-border))] bg-[hsl(var(--glass-bg))] backdrop-blur-lg px-4 py-3 hover:scale-[1.02] transition-transform"
            >
              <div className="flex items-center gap-3 min-w-[130px]">
                <WeatherIcon type={cond.type} className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium text-foreground">{formatDay(t)}</span>
              </div>
              <span className="text-xs text-muted-foreground hidden sm:block">{cond.label}</span>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 text-sm">
                  <ArrowUp className="w-3 h-3 text-destructive/70" />
                  <span className="font-semibold text-foreground">{convertTemp(temperature_2m_max[i])}°</span>
                </div>
                <div className="flex items-center gap-1 text-sm">
                  <ArrowDown className="w-3 h-3 text-primary/70" />
                  <span className="text-muted-foreground">{convertTemp(temperature_2m_min[i])}°</span>
                </div>
                <div className="flex items-center gap-0.5">
                  <Droplets className="w-3 h-3 text-primary/60" />
                  <span className="text-[10px] text-muted-foreground">{precipitation_sum[i]}mm</span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </GlassCard>
  );
};

export default DailyForecast;
