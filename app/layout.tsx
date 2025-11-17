import type { Metadata } from "next";
import "./globals.css";
import FocusOverlay from "@/components/focus/FocusOverlay";
import FocusShield from "@/components/focus/FocusShield";

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
		<html lang="en" suppressHydrationWarning>
			<body className="antialiased">
				{children}
				<FocusOverlay />
				<FocusShield />
			</body>
		</html>
	);
}
