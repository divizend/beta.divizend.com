"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button
        className="opacity-0 pointer-events-none w-10 h-10"
        aria-label="Toggle theme"
      >
        <Sun className="h-5 w-5" />
      </button>
    );
  }

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="relative w-10 h-10 rounded-full transition-all duration-200 hover:bg-muted/50 active:bg-muted focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background"
      aria-label="Toggle theme"
    >
      <Sun className="absolute inset-0 m-auto h-5 w-5 rotate-0 scale-100 transition-all duration-300 dark:-rotate-90 dark:scale-0 text-foreground/70" />
      <Moon className="absolute inset-0 m-auto h-5 w-5 rotate-90 scale-0 transition-all duration-300 dark:rotate-0 dark:scale-100 text-foreground/70" />
    </button>
  );
}
