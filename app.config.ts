/**
 * App Configuration
 * Customize this file to change branding, colors, and app settings
 */

export const appConfig = {
	// App Branding
	name: "Flow Reactor",
	tagline: "Personalized flow activation. Enter the reactor.",
	description:
		"A personalized flow-activation experience tailored to your mental ignition pattern.",

	// Company/Creator Info
	creator: {
		name: "Your Name",
		website: "https://yourwebsite.com",
		support: "support@yourwebsite.com",
	},

	// Theme Colors (Tailwind classes)
	theme: {
		primary: "cyan",
		secondary: "indigo",
		accent: "emerald",
		warning: "amber",
	},

	// Feature Toggles
	features: {
		guidedIntake: true,
		focusShield: true,
		sessionOverlay: true,
		reflection: true,
		insightsDashboard: true,
		analytics: false, // Coming soon
		aiSuggestions: false, // Coming soon
	},

	// Pricing (if selling access tiers)
	pricing: {
		tiers: [
			{
				name: "Starter",
				price: 12,
				features: ["Flow Reactor Sessions", "Persistent Timer", "Reflection Journal"],
			},
			{
				name: "Studio",
				price: 24,
				features: [
					"Everything in Starter",
					"Focus Shield Controls",
					"Insight Dashboard",
					"Team Ritual Templates",
				],
			},
		],
	},

	// Social Links (for discover page)
	social: {
		twitter: "https://twitter.com/yourusername",
		instagram: "https://instagram.com/yourusername",
		youtube: "https://youtube.com/@yourusername",
		discord: "https://discord.gg/yourinvite",
	},
};

export default appConfig;
