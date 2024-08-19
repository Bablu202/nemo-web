import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class", // Add this line to enable dark mode
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        gray: {
          DEFAULT: "#86868b",
          100: "#94928d",
          200: "#afafaf",
          300: "#42424570",
        },
        blue: { DEFAULT: "#4D9DE0" },
        custom: {
          pri: "#24386E",
          sec: "#0D0D0D",
          blue: "#13678A",
          light: "#ADD9D1",
          white: "#F7FAFA",
        },
        color: {
          purple: "#AC6AFF",
          yellow: "#FFC43D",
          orange: "#F2790F",
          red: "#FF0000",
          green: "#3BB273",
          blue: "#4D9DE0",
          gray: "#33332D",
          white: "#F7FAFA",
        },

        stroke: {
          1: "#26242C",
        },
      },
    },
  },
  plugins: [],
};
export default config;
