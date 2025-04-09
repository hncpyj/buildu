import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  safelist: [
    "bg-yellow-300", // 변경된 단어 (diffWords)
    "px-1",
    "line-through",
    "bg-green-200",  // 검색어
    "bg-pink-200",   // 대체어
  ],
  theme: {
    extend: {
      colors: {
        background: "#ffffff",
        foreground: "#171717",
        text: "#171717",
      },
    },
  },
  plugins: [],
} satisfies Config;