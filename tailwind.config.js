/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
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
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          50: "#f0f9ff",
          100: "#e0f2fe",
          200: "#bae6fd",
          300: "#7dd3fc",
          400: "#38bdf8",
          500: "#0ea5e9",
          600: "#0284c7",
          700: "#0369a1",
          800: "#075985",
          900: "#0c4a6e",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        gray: {
          50: "#f9fafb",
          100: "#f3f4f6",
          200: "#e5e7eb",
          300: "#d1d5db",
          400: "#9ca3af",
          500: "#6b7280",
          600: "#4b5563",
          700: "#374151",
          800: "#1f2937",
          900: "#111827",
        },
        slate: {
          50: "#f8fafc",
          100: "#f1f5f9",
          200: "#e2e8f0",
          300: "#cbd5e1",
          400: "#94a3b8",
          500: "#64748b",
          600: "#475569",
          700: "#334155",
          800: "#1e293b",
          900: "#0f172a",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ["Montserrat", "system-ui", "sans-serif"],
      },
      fontSize: {
        xs: ["0.75rem", { lineHeight: "1rem" }],
        sm: ["0.875rem", { lineHeight: "1.25rem" }],
        base: ["1rem", { lineHeight: "1.5rem" }],
        lg: ["1.125rem", { lineHeight: "1.75rem" }],
        xl: ["1.25rem", { lineHeight: "1.75rem" }],
        "2xl": ["1.5rem", { lineHeight: "2rem" }],
        "3xl": ["1.875rem", { lineHeight: "2.25rem" }],
        "4xl": ["2.25rem", { lineHeight: "2.5rem" }],
        "5xl": ["3rem", { lineHeight: "1" }],
        "6xl": ["3.75rem", { lineHeight: "1" }],
      },
      spacing: {
        18: "4.5rem",
        88: "22rem",
        128: "32rem",
      },
      boxShadow: {
        soft: "0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)",
        "soft-lg":
          "0 10px 25px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
        "soft-xl":
          "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
        glow: "0 0 20px rgba(59, 130, 246, 0.15)",
        "glow-lg": "0 0 40px rgba(59, 130, 246, 0.2)",
      },
      animation: {
        "fade-in": "fadeIn 0.6s ease-out forwards",
        "fade-in-up": "fadeInUp 0.8s ease-out forwards",
        "fade-in-down": "fadeInDown 0.8s ease-out forwards",
        "fade-in-left": "fadeInLeft 0.8s ease-out forwards",
        "fade-in-right": "fadeInRight 0.8s ease-out forwards",
        "slide-in-left": "slideInLeft 0.8s ease-out forwards",
        "slide-in-right": "slideInRight 0.8s ease-out forwards",
        "slide-in-up": "slideInUp 0.8s ease-out forwards",
        "slide-in-down": "slideInDown 0.8s ease-out forwards",
        "scale-in": "scaleIn 0.6s ease-out forwards",
        "scale-in-up": "scaleInUp 0.8s ease-out forwards",
        "rotate-in": "rotateIn 0.8s ease-out forwards",
        "rotate-in-up-left": "rotateInUpLeft 0.8s ease-out forwards",
        float: "float 3s ease-in-out infinite",
        "float-slow": "floatSlow 4s ease-in-out infinite",
        "float-reverse": "floatReverse 3s ease-in-out infinite",
        glow: "glow 2s ease-in-out infinite",
        "glow-pulse": "glowPulse 2s ease-in-out infinite",
        gradient: "gradientShift 3s ease infinite",
        shimmer: "shimmer 2s infinite",
        typewriter:
          "typewriter 3s steps(40, end), blink 0.75s step-end infinite",
        morph: "morph 4s ease-in-out infinite",
        particle: "particleFloat 3s ease-out infinite",
        wave: "wave 2s ease-in-out infinite",
        "bounce-subtle": "bounceSubtle 2s infinite",
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      keyframes: {
        fadeIn: {
          from: { opacity: "0", transform: "translateY(20px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        fadeInUp: {
          from: { opacity: "0", transform: "translateY(30px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        fadeInDown: {
          from: { opacity: "0", transform: "translateY(-30px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        fadeInLeft: {
          from: { opacity: "0", transform: "translateX(-30px)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
        fadeInRight: {
          from: { opacity: "0", transform: "translateX(30px)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
        slideInLeft: {
          from: { opacity: "0", transform: "translateX(-50px)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
        slideInRight: {
          from: { opacity: "0", transform: "translateX(50px)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
        slideInUp: {
          from: { opacity: "0", transform: "translateY(50px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        slideInDown: {
          from: { opacity: "0", transform: "translateY(-50px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        scaleIn: {
          from: { opacity: "0", transform: "scale(0.8)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
        scaleInUp: {
          from: { opacity: "0", transform: "scale(0.8) translateY(20px)" },
          to: { opacity: "1", transform: "scale(1) translateY(0)" },
        },
        rotateIn: {
          from: { opacity: "0", transform: "rotate(-180deg) scale(0.8)" },
          to: { opacity: "1", transform: "rotate(0deg) scale(1)" },
        },
        rotateInUpLeft: {
          from: {
            opacity: "0",
            transform: "rotate(45deg) translateX(-30px) translateY(30px)",
          },
          to: {
            opacity: "1",
            transform: "rotate(0deg) translateX(0) translateY(0)",
          },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        floatSlow: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-5px)" },
        },
        floatReverse: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(10px)" },
        },
        glow: {
          "0%, 100%": { boxShadow: "0 0 5px rgba(59, 130, 246, 0.3)" },
          "50%": {
            boxShadow:
              "0 0 20px rgba(59, 130, 246, 0.6), 0 0 30px rgba(59, 130, 246, 0.4)",
          },
        },
        glowPulse: {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.8", transform: "scale(1.05)" },
        },
        gradientShift: {
          "0%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        typewriter: {
          from: { width: "0" },
          to: { width: "100%" },
        },
        blink: {
          "0%, 50%": { borderColor: "transparent" },
          "51%, 100%": { borderColor: "currentColor" },
        },
        morph: {
          "0%, 100%": { borderRadius: "50%" },
          "25%": { borderRadius: "20% 80% 20% 80%" },
          "50%": { borderRadius: "80% 20% 80% 20%" },
          "75%": { borderRadius: "40% 60% 40% 60%" },
        },
        particleFloat: {
          "0%": { transform: "translateY(0px) rotate(0deg)", opacity: "1" },
          "100%": {
            transform: "translateY(-100px) rotate(360deg)",
            opacity: "0",
          },
        },
        wave: {
          "0%, 100%": { transform: "rotate(0deg)" },
          "10%": { transform: "rotate(14deg)" },
          "20%": { transform: "rotate(-8deg)" },
          "30%": { transform: "rotate(14deg)" },
          "40%": { transform: "rotate(-4deg)" },
          "50%": { transform: "rotate(10deg)" },
          "60%": { transform: "rotate(0deg)" },
        },
        bounceSubtle: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-5px)" },
        },
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      backdropBlur: {
        xs: "2px",
      },
      transitionTimingFunction: {
        "bounce-in": "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    function ({ addUtilities }) {
      addUtilities({
        ".focus-ring-none": {
          "&:focus": {
            outline: "none",
            "box-shadow": "none",
          },
        },
        ".focus-ring-custom": {
          "&:focus": {
            outline: "none",
            "box-shadow": "0 0 0 2px hsl(var(--primary) / 0.3)",
          },
        },
      });
    },
  ],
};
