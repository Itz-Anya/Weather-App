import { useMemo } from "react";
import type { WeatherCondition } from "@/lib/weather";

interface Props {
  condition: WeatherCondition;
  isNight: boolean;
}

const WeatherBackground = ({ condition, isNight }: Props) => {
  const particles = useMemo(() => {
    if (condition === "rain" || condition === "likely-rain" || condition === "showers") {
      return Array.from({ length: 40 }, (_, i) => ({
        id: i,
        left: `${Math.random() * 100}%`,
        delay: `${Math.random() * 2}s`,
        duration: `${0.5 + Math.random() * 0.5}s`,
        type: "rain" as const,
      }));
    }
    if (condition === "snow") {
      return Array.from({ length: 30 }, (_, i) => ({
        id: i,
        left: `${Math.random() * 100}%`,
        delay: `${Math.random() * 4}s`,
        duration: `${3 + Math.random() * 3}s`,
        type: "snow" as const,
      }));
    }
    if (condition === "thunderstorm") {
      return Array.from({ length: 50 }, (_, i) => ({
        id: i,
        left: `${Math.random() * 100}%`,
        delay: `${Math.random() * 1.5}s`,
        duration: `${0.3 + Math.random() * 0.4}s`,
        type: "rain" as const,
      }));
    }
    return [];
  }, [condition]);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {particles.map((p) => (
        <div
          key={p.id}
          className={p.type === "rain" ? "weather-rain" : "weather-snow"}
          style={{
            left: p.left,
            animationDelay: p.delay,
            animationDuration: p.duration,
          }}
        />
      ))}
      {condition === "thunderstorm" && (
        <div className="weather-lightning" />
      )}
      {(condition === "clear" && !isNight) && (
        <div className="absolute top-10 right-10 w-32 h-32 rounded-full bg-yellow-300/10 blur-3xl animate-pulse" />
      )}
      {(condition === "clear" && isNight) && (
        <div className="absolute top-10 right-10 w-24 h-24 rounded-full bg-blue-200/10 blur-3xl animate-pulse" />
      )}
    </div>
  );
};

export default WeatherBackground;
