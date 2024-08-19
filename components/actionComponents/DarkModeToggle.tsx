"use client";
import { useState, useEffect } from "react";
import { CiLight, CiDark } from "react-icons/ci";

export default function DarkModeToggle() {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  useEffect(() => {
    // Check if dark mode is already enabled and set the state accordingly
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setIsDarkMode(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleDarkMode = () => {
    if (isDarkMode) {
      // Switch to light mode
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    } else {
      // Switch to dark mode
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    }
    setIsDarkMode(!isDarkMode);
  };

  return (
    <button
      onClick={toggleDarkMode}
      className={`relative w-16 h-8 flex items-center bg-custom-pri dark:bg-color-orange rounded-full p-1 transition-colors duration-300`}
    >
      {/* Light Icon */}
      <CiLight
        size={20}
        className={`absolute left-2 transition-opacity duration-300 ${
          isDarkMode ? "opacity-0" : "opacity-100"
        }`}
      />
      {/* Dark Icon */}
      <CiDark
        size={20}
        className={`absolute right-2 transition-opacity duration-300 ${
          isDarkMode ? "opacity-100" : "opacity-0"
        }`}
      />
      {/* Knob */}
      <div
        className={`bg-white dark:bg-custom-sec w-6 h-6 rounded-full shadow-md transform transition-transform duration-300 ease-in-out ${
          isDarkMode ? "translate-x-8" : "translate-x-0"
        } flex items-center justify-center`}
      >
        {/* Icon inside the knob */}
        {isDarkMode ? (
          <CiDark size={20} className="text-gray-700 dark:text-white" />
        ) : (
          <CiLight size={20} className="text-color-yellow dark:text-gray-300" />
        )}
      </div>
    </button>
  );
}
