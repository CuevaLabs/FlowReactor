/**
 * App Configuration
 * Customize this file to change branding, colors, and app settings
 */

export const appConfig = {
	// App Branding
	name: "Brain Dump App",
	tagline: "Clear Your Mind, Unlock Your Flow",
	description:
		"A powerful cognitive load management tool for content creators. Clear mental clutter, achieve flow state, and maintain peak performance.",

	// Company/Creator Info
	creator: {
		name: "Your Name",
		website: "https://yourwebsite.com",
		support: "support@yourwebsite.com",
	},

	// Theme Colors (Tailwind classes)
	theme: {
		primary: "green",
		secondary: "blue",
		accent: "purple",
		warning: "yellow",
	},

	// Feature Toggles
	features: {
		brainDump: true,
		flowMode: true,
		breathingReset: true,
		organize: true,
		analytics: false, // Coming soon
		aiSuggestions: false, // Coming soon
	},

	// Pricing (if selling access tiers)
	pricing: {
		tiers: [
			{
				name: "Basic",
				price: 9.99,
				features: ["Brain Dump", "Flow Timer", "Basic Analytics"],
			},
			{
				name: "Pro",
				price: 19.99,
				features: [
					"Everything in Basic",
					"Advanced Analytics",
					"AI Suggestions",
					"Custom Categories",
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

