import { motion } from "framer-motion";
import {
  Map,
  MapMarker,
  MarkerContent,
  MarkerPopup,
  MapControls,
} from "@/components/ui/map";
import { getConditionFromCode } from "@/lib/weather";
import type { WeatherData, LocationData } from "@/lib/weather";
import { useTheme } from "@/hooks/useTheme";
import WeatherIcon from "@/components/WeatherIcon";

interface Props {
  weather: WeatherData;
  location: LocationData;
}

// Satellite raster style using Esri World Imagery + a translucent labels overlay
// so streets/place names remain readable on top of the aerial imagery.
const satelliteStyle = {
  version: 8 as const,
  sources: {
    "esri-satellite": {
      type: "raster" as const,
      tiles: [
        "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
      ],
      tileSize: 256,
      attribution:
        "Tiles © Esri — Source: Esri, Maxar, Earthstar Geographics, and the GIS User Community",
      maxzoom: 19,
    },
    "carto-labels": {
      type: "raster" as const,
      tiles: [
        "https://basemaps.cartocdn.com/rastertiles/voyager_only_labels/{z}/{x}/{y}.png",
      ],
      tileSize: 256,
      attribution: "© OpenStreetMap contributors © CARTO",
      maxzoom: 20,
    },
  },
  layers: [
    { id: "satellite", type: "raster" as const, source: "esri-satellite" },
    { id: "labels", type: "raster" as const, source: "carto-labels", paint: { "raster-opacity": 0.9 } },
  ],
  glyphs: "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/{fontstack}/{range}.pbf",
};

export default function WeatherMap({ weather, location }: Props) {
  const { theme } = useTheme();
  const condition = getConditionFromCode(weather.current.weathercode);
  const isNight = weather.current.is_day === 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="rounded-2xl border border-[hsl(var(--glass-border))] bg-[hsl(var(--glass-bg))] backdrop-blur-xl shadow-glass overflow-hidden"
    >
      <div className="flex items-center justify-between px-4 pt-4 pb-2">
        <p className="text-sm font-medium text-muted-foreground">Location Map</p>
        <span className="text-[10px] text-muted-foreground/70">
          {location.lat.toFixed(3)}, {location.lon.toFixed(3)}
        </span>
      </div>
      <div className="relative h-72 w-full">
        <Map
          key={`${location.lat.toFixed(4)}-${location.lon.toFixed(4)}`}
          theme={theme === "dark" ? "dark" : "light"}
          styles={{ light: satelliteStyle, dark: satelliteStyle }}
          center={[location.lon, location.lat] as [number, number]}
          zoom={9}
          viewport={{
            center: [location.lon, location.lat] as [number, number],
            zoom: 9,
          }}
          onViewportChange={() => {}}
          className="h-full w-full"
        >
          <MapControls position="top-right" showZoom showCompass />
          <MapMarker longitude={location.lon} latitude={location.lat}>
            <MarkerContent>
              <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-primary bg-background/90 shadow-lg backdrop-blur">
                {condition && (
                  <WeatherIcon
                    type={condition.type}
                    isNight={isNight}
                    className="h-5 w-5 text-primary"
                  />
                )}
              </div>
            </MarkerContent>
            <MarkerPopup>
              <div className="rounded-xl border border-[hsl(var(--glass-border))] bg-[hsl(var(--glass-bg))] px-3 py-2 text-center shadow-glass backdrop-blur-xl">
                <p className="text-sm font-semibold text-foreground">
                  {location.city}
                  {location.country ? `, ${location.country}` : ""}
                </p>
                <p className="text-xs text-muted-foreground">
                  {Math.round(weather.current.temperature)}°C
                  {condition ? ` · ${condition.label}` : ""}
                </p>
              </div>
            </MarkerPopup>
          </MapMarker>
        </Map>
      </div>
    </motion.div>
  );
}
