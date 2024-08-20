"use client";
import { useState, useEffect } from "react";
import { CiLight, CiDark } from "react-icons/ci";

export default function DarkModeToggle() {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [hideBackground, setHideBackground] = useState<boolean>(false);

  const initiateHideBackground = () => {
    // Clear any existing timeout
    setHideBackground(false);
    setTimeout(() => {
      setHideBackground(true);
    }, 3000);
  };

  useEffect(() => {
    // Check if dark mode is already enabled and set the state accordingly
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setIsDarkMode(true);
      document.documentElement.classList.add("dark");
    }

    // Trigger the background fade out after 3 seconds initially
    initiateHideBackground();
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
    initiateHideBackground(); // Reset the background visibility after toggle
  };

  return (
    <button
      onClick={toggleDarkMode}
      className={`relative w-16 h-8 flex items-center rounded-full p-1 transition-colors duration-300 ${
        hideBackground ? "bg-transparent" : "bg-custom-pri dark:bg-color-orange"
      }`}
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
        className={`bg-white dark:bg-color-gray w-6 h-6 rounded-full shadow-2xl transform transition-transform duration-300 ease-in-out ${
          isDarkMode ? "translate-x-8" : "translate-x-0"
        } flex items-center justify-center`}
      >
        {/* Icon inside the knob */}
        {isDarkMode ? (
          <CiLight size={24} className=" dark:text-color-orange" />
        ) : (
          <CiDark size={24} className="text-custom-pri dark:text-gray-300" />
        )}
      </div>
    </button>
  );
}
