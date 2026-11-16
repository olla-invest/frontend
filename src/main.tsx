import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { Toaster } from "@/components/ui/sonner";

if (import.meta.env.VITE_IS_DEV === "false") {
  const script = document.createElement("script");

  script.async = true;
  script.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2423101718639537";
  script.crossOrigin = "anonymous";

  document.head.appendChild(script);
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Toaster />
    <App />
  </StrictMode>,
);
