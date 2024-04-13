"use client";
import React, { createContext, useContext, useEffect } from "react";

// Define the theme context
interface ThemeContextProps {
  mode: string;
  setMode: (mode: string) => void;
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

// Custom hook to access the theme context
export const useTheme = (): ThemeContextProps => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useThemeContext must be used within a ThemeProvider");
  }
  return context;
};

// Theme provider component
interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [mode, setMode] = React.useState("light");

  const value: ThemeContextProps = {
    mode,
    setMode,
  };
  const handleThemeChange = () => {
    if (
      localStorage.theme === "dark" ||
      (!("theme" in localStorage) &&
        window.matchMedia("prefers-color-scheme: dark").matches)
    ) {
      setMode("dark");
      document.documentElement.classList.add("dark");
    } else {
      setMode("light");
      document.documentElement.classList.remove("dark");
    }
  };

  useEffect(() => {
    handleThemeChange();
  }, [mode]);

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};
