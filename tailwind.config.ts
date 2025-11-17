import type { Config } from "tailwindcss";
import { frostedThemePlugin } from "@whop/react/tailwind";

const config: Config = {
	theme: {
		extend: {
			colors: {
				reactor: {
					core: "#00ff9d",
					hot: "#ff3b5c",
					warn: "#ffb800",
					shield: "#1a1a2e",
					bg: "#0a0a0f",
					panel: "#141424",
					glow: "#00ff9d33",
				},
			},
			fontFamily: {
				mono: ["'Space Grotesk'", "monospace"],
			},
			boxShadow: {
				reactor: "0 0 30px 5px rgba(0, 255, 157, 0.4)",
				core: "inset 0 0 40px rgba(0, 255, 157, 0.6)",
			},
			animation: {
				pulse: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
				"pulse-fast": "pulse 0.8s ease-in-out infinite",
				"shield-flicker": "flicker 1.5s infinite",
			},
			keyframes: {
				pulse: {
					"0%, 100%": { opacity: "0.7" },
					"50%": { opacity: "1" },
				},
				flicker: {
					"0%, 100%": { opacity: "1" },
					"50%": { opacity: "0.6" },
				},
			},
		},
	},
	plugins: [frostedThemePlugin()],
};

export default config;

