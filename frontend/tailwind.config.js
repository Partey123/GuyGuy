/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    './pages/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
    './app/**/*.{js,jsx}',
    './src/**/*.{js,jsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "#0F1F3D",
          foreground: "#F8F9FA",
        },
        secondary: {
          DEFAULT: "#F5A623",
          foreground: "#0F1F3D",
        },
        destructive: {
          DEFAULT: "#D94040",
          foreground: "#F8F9FA",
        },
        muted: {
          DEFAULT: "#2D2D2D",
          foreground: "#F8F9FA",
        },
        accent: {
          DEFAULT: "#F8F9FA",
          foreground: "#0F1F3D",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        success: "#1A7A4A",
        navy: "#0F1F3D",
        amber: "#F5A623",
        offwhite: "#F8F9FA",
        darkgrey: "#2D2D2D",
        forestgreen: "#1A7A4A",
        warmred: "#D94040",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        heading: ['DM Sans', 'sans-serif'],
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}