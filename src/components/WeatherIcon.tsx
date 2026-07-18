import { Sun, Cloud, CloudRain, CloudDrizzle, CloudSnow, CloudSun, CloudLightning, CloudFog, Moon, CloudMoon, type LucideProps } from "lucide-react";
import type { WeatherCondition } from "@/lib/weather";

interface Props extends LucideProps {
  type: WeatherCondition;
  isNight?: boolean;
}

const WeatherIcon = ({ type, isNight = false, ...props }: Props) => {
  if (isNight) {
    if (type === "clear") return <Moon {...props} />;
    if (type === "cloudy") return <CloudMoon {...props} />;
  }

  switch (type) {
    case "clear":
      return <Sun {...props} />;
    case "cloudy":
      return <CloudSun {...props} />;
    case "rain":
    case "likely-rain":
    case "showers":
      return <CloudRain {...props} />;
    case "possible-rain":
      return <CloudDrizzle {...props} />;
    case "snow":
      return <CloudSnow {...props} />;
    case "thunderstorm":
      return <CloudLightning {...props} />;
    case "fog":
      return <CloudFog {...props} />;
    default:
      return <Cloud {...props} />;
  }
};

export default WeatherIcon;
