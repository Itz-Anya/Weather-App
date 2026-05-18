import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";


if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then((reg) => console.log("[PWA] Service worker registered:", reg.scope))
      .catch((err) => console.warn("[PWA] Service worker registration failed:", err));
  });
}

createRoot(document.getElementById("root")!).render(<App />);
