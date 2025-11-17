'use client';

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import type { FlowReactorSession } from "@/lib/flow-reactor-session";
import { getSessionRemainingSeconds } from "@/lib/flow-reactor-session";

type FocusTimerProps = {
	session: FlowReactorSession;
};

export function FocusTimer({ session }: FocusTimerProps) {
	const [now, setNow] = useState(() => Date.now());

	useEffect(() => {
		const id = window.setInterval(() => setNow(Date.now()), 200);
		return () => window.clearInterval(id);
	}, []);

	const remainingSeconds = getSessionRemainingSeconds(session, now);
	const totalMs = session.lengthMinutes * 60 * 1000;
	const remainingMs = remainingSeconds * 1000;
	const progress = Math.min(1, Math.max(0, (totalMs - remainingMs) / totalMs));
	const mins = Math.floor(remainingSeconds / 60);
	const secs = remainingSeconds % 60;

	return (
		<div className="relative mx-auto h-80 w-80">
			<svg className="absolute inset-0 h-full w-full -rotate-90">
				<circle cx="160" cy="160" r="140" stroke="#1a1a2e" strokeWidth="12" fill="none" />
				<motion.circle
					cx="160"
					cy="160"
					r="140"
					stroke="#00ff9d"
					strokeWidth="12"
					fill="none"
					strokeDasharray="880"
					animate={{ strokeDashoffset: 880 * (1 - progress) }}
					transition={{ duration: 0.4, ease: "easeInOut" }}
					className="drop-shadow-reactor"
				/>
			</svg>

			<div className="absolute inset-8 flex flex-col items-center justify-center rounded-full bg-reactor-panel/80 shadow-core">
				<div className="text-6xl font-mono font-bold text-reactor-core">
					{String(mins).padStart(2, "0")}:{String(secs).padStart(2, "0")}
				</div>
				<div className="mt-2 text-xs uppercase tracking-[0.5em] text-cyan-300">
					Containment Stable
				</div>
			</div>

			<motion.div
				className="absolute inset-16 rounded-full bg-reactor-core blur-3xl opacity-40"
				animate={{ scale: [1, 1.15, 1] }}
				transition={{ repeat: Infinity, duration: 2 }}
			/>
		</div>
	);
}

