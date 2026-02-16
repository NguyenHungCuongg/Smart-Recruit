import { useEffect, useState } from "react";

export const useDarkMode = () => {
  const [isDark, setIsDark] = useState<boolean>(() => {
    const stored = localStorage.getItem("theme");
    return stored === "dark" || (!stored && window.matchMedia("(prefers-color-scheme: dark)").matches);
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  const toggleDark = () => setIsDark(!isDark);

  return { isDark, toggleDark };
};
