import { useMemo } from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { TrendingUp } from "lucide-react";
import GlassCard from "./GlassCard";
import type { WeatherData } from "@/lib/weather";
import { useUnits } from "@/hooks/useUnits";

interface Props {
  weather: WeatherData;
}

const TemperatureChart = ({ weather }: Props) => {
  const { convertTemp, tempLabel } = useUnits();
  
  const data = useMemo(() => {
    const now = new Date();
    const startIdx = weather.hourly.time.findIndex((t) => new Date(t) >= now);
    if (startIdx < 0) return [];
    return weather.hourly.time.slice(startIdx, startIdx + 24).map((t, i) => ({
      time: new Date(t).toLocaleTimeString([], { hour: "2-digit" }),
      temp: convertTemp(weather.hourly.temperature_2m[startIdx + i]),
      feels: convertTemp(weather.hourly.apparent_temperature[startIdx + i]),
    }));
  }, [weather, convertTemp]);

  if (data.length === 0) return null;

  return (
    <GlassCard delay={0.25} className="p-4">
      <div className="flex items-center gap-2 mb-3 px-2">
        <TrendingUp className="w-4 h-4 text-muted-foreground" />
        <p className="text-sm font-medium text-muted-foreground">24h Temperature</p>
      </div>
      <div className="h-40 -mx-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="tempGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(210 60% 55%)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(210 60% 55%)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="feelsGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(30 80% 55%)" stopOpacity={0.2} />
                <stop offset="95%" stopColor="hsl(30 80% 55%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="time" tick={{ fontSize: 10 }} stroke="hsl(220 10% 50%)" tickLine={false} axisLine={false} interval={3} />
            <YAxis hide domain={["dataMin - 2", "dataMax + 2"]} />
            <Tooltip
              contentStyle={{
                background: "hsl(220 30% 15% / 0.9)",
                border: "1px solid hsl(220 20% 30% / 0.3)",
                borderRadius: "12px",
                backdropFilter: "blur(20px)",
                fontSize: 12,
                color: "hsl(210 30% 92%)",
              }}
              formatter={(value: number, name: string) => [`${value}${tempLabel}`, name === "temp" ? "Temperature" : "Feels Like"]}
            />
            <Area type="monotone" dataKey="temp" stroke="hsl(210 60% 55%)" fill="url(#tempGrad)" strokeWidth={2} dot={false} />
            <Area type="monotone" dataKey="feels" stroke="hsl(30 80% 55%)" fill="url(#feelsGrad)" strokeWidth={1.5} dot={false} strokeDasharray="4 4" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="flex items-center justify-center gap-4 mt-2 text-[10px] text-muted-foreground">
        <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-primary rounded" /> Temperature</span>
        <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-orange-400 rounded" style={{ borderTop: "1px dashed" }} /> Feels Like</span>
      </div>
    </GlassCard>
  );
};

export default TemperatureChart;
