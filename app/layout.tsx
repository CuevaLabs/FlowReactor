import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";
import FocusOverlay from "@/components/focus/FocusOverlay";
import FocusShield from "@/components/focus/FocusShield";

const spaceGrotesk = Space_Grotesk({
	subsets: ["latin"],
	weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
	title: "Flow Reactor",
	description: "Personalized flow activation. Enter the reactor.",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning className="bg-reactor-bg text-white">
			<body className={`${spaceGrotesk.className} min-h-screen bg-gradient-to-br from-reactor-bg via-reactor-shield to-reactor-bg text-white antialiased`}>
				<div className="pointer-events-none fixed inset-0">
					<div className="absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-reactor-core blur-[180px] opacity-20 animate-pulse" />
				</div>
				<main className="relative z-10 min-h-screen">{children}</main>
				<FocusOverlay />
				<FocusShield />
			</body>
		</html>
	);
}
