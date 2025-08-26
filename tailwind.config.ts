// Tailwind CSS v4 - Minimal config for legacy compatibility only
// Most configuration moved to CSS @theme directive in globals.css
import type { Config } from "tailwindcss"

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "mocha-mousse": "hsl(var(--mocha-mousse))",
        "mint-sage": "hsl(var(--mint-sage))",
        sage: "hsl(var(--sage))",
        evergreen: "hsl(var(--evergreen))",
      },
    },
  },
  plugins: [],
}

export default config
