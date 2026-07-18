import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

type TempUnit = "C" | "F";
type SpeedUnit = "kmh" | "mph";

interface UnitsContextType {
  tempUnit: TempUnit;
  speedUnit: SpeedUnit;
  toggleTemp: () => void;
  toggleSpeed: () => void;
  convertTemp: (celsius: number) => number;
  convertSpeed: (kmh: number) => number;
  tempLabel: string;
  speedLabel: string;
}

const UnitsContext = createContext<UnitsContextType | null>(null);

export const UnitsProvider = ({ children }: { children: ReactNode }) => {
  const [tempUnit, setTempUnit] = useState<TempUnit>(() => (localStorage.getItem("tempUnit") as TempUnit) || "C");
  const [speedUnit, setSpeedUnit] = useState<SpeedUnit>(() => (localStorage.getItem("speedUnit") as SpeedUnit) || "kmh");

  useEffect(() => { localStorage.setItem("tempUnit", tempUnit); }, [tempUnit]);
  useEffect(() => { localStorage.setItem("speedUnit", speedUnit); }, [speedUnit]);

  const toggleTemp = () => setTempUnit((u) => (u === "C" ? "F" : "C"));
  const toggleSpeed = () => setSpeedUnit((u) => (u === "kmh" ? "mph" : "kmh"));

  const convertTemp = (c: number) => (tempUnit === "F" ? Math.round(c * 9 / 5 + 32) : Math.round(c));
  const convertSpeed = (k: number) => (speedUnit === "mph" ? Math.round(k * 0.621371) : Math.round(k));

  const tempLabel = tempUnit === "C" ? "°C" : "°F";
  const speedLabel = speedUnit === "kmh" ? "km/h" : "mph";

  return (
    <UnitsContext.Provider value={{ tempUnit, speedUnit, toggleTemp, toggleSpeed, convertTemp, convertSpeed, tempLabel, speedLabel }}>
      {children}
    </UnitsContext.Provider>
  );
};

export const useUnits = () => {
  const ctx = useContext(UnitsContext);
  if (!ctx) throw new Error("useUnits must be inside UnitsProvider");
  return ctx;
};
