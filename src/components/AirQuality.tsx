import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Wind, Leaf } from "lucide-react";
import GlassCard from "./GlassCard";

interface AQIData {
  european_aqi: number;
  pm2_5: number;
  pm10: number;
  us_aqi: number;
}

interface Props {
  lat: number;
  lon: number;
}

function getAQILevel(aqi: number): { label: string; color: string; desc: string } {
  if (aqi <= 20) return { label: "Good", color: "text-green-400", desc: "Air quality is excellent. Enjoy outdoor activities." };
  if (aqi <= 40) return { label: "Fair", color: "text-emerald-400", desc: "Air quality is acceptable for most people." };
  if (aqi <= 60) return { label: "Moderate", color: "text-yellow-400", desc: "Sensitive groups may experience minor effects." };
  if (aqi <= 80) return { label: "Poor", color: "text-orange-400", desc: "Health effects possible for sensitive groups." };
  if (aqi <= 100) return { label: "Very Poor", color: "text-red-400", desc: "Health risk for everyone. Limit outdoor time." };
  return { label: "Hazardous", color: "text-purple-400", desc: "Serious health risk. Avoid outdoor activities." };
}

const AirQuality = ({ lat, lon }: Props) => {
  const [data, setData] = useState<AQIData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAQI = async () => {
      try {
        const res = await fetch(
          `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&current=european_aqi,pm2_5,pm10,us_aqi`
        );
        if (res.ok) {
          const json = await res.json();
          setData({
            european_aqi: json.current.european_aqi,
            pm2_5: json.current.pm2_5,
            pm10: json.current.pm10,
            us_aqi: json.current.us_aqi,
          });
        }
      } catch {} finally { setLoading(false); }
    };
    fetchAQI();
  }, [lat, lon]);

  if (loading || !data) return null;

  const level = getAQILevel(data.european_aqi);
  const progress = Math.min((data.european_aqi / 120) * 100, 100);

  return (
    <GlassCard delay={0.35} className="p-4">
      <div className="flex items-center gap-2 mb-3 px-2">
        <Leaf className="w-4 h-4 text-muted-foreground" />
        <p className="text-sm font-medium text-muted-foreground">Air Quality</p>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex-shrink-0 text-center">
          <p className={`text-3xl font-bold ${level.color}`}>{data.european_aqi}</p>
          <p className={`text-xs font-semibold ${level.color}`}>{level.label}</p>
        </div>
        <div className="flex-1 space-y-2">
          <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="h-full rounded-full"
              style={{ background: "linear-gradient(90deg, hsl(120 60% 50%), hsl(60 80% 50%), hsl(30 80% 50%), hsl(0 70% 50%))" }}
            />
          </div>
          <p className="text-xs text-muted-foreground">{level.desc}</p>
          <div className="flex gap-4 text-xs text-muted-foreground">
            <span>PM2.5: <span className="text-foreground font-medium">{data.pm2_5}</span></span>
            <span>PM10: <span className="text-foreground font-medium">{data.pm10}</span></span>
          </div>
        </div>
      </div>
    </GlassCard>
  );
};

export default AirQuality;
