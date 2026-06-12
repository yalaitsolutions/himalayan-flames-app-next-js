"use client";
import { useEffect, useState } from "react";

export function useTheme() {
  const [theme, setTheme] = useState("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("theme");
      const preferred = stored || (window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark");
      setTheme(preferred);
      document.documentElement.setAttribute("data-theme", preferred);
    } catch (e) {
      console.warn("Theme initialization failed:", e);
    }
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    try {
      const newTheme = theme === "dark" ? "light" : "dark";
      setTheme(newTheme);
      localStorage.setItem("theme", newTheme);
      document.documentElement.setAttribute("data-theme", newTheme);
    } catch (e) {
      console.warn("Theme toggle failed:", e);
    }
  };

  return { theme, toggleTheme, mounted };
}
