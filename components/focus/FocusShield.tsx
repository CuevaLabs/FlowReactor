'use client';

import { motion } from "framer-motion";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
	endSession as endFocusSession,
	useFocusSession,
} from "@/lib/focus-session";
import {
	endSession as endFlowSession,
	useFlowReactorSession,
} from "@/lib/flow-reactor-session";

const BLOCKED_HOSTS = [
	"discord.com",
	"discord.gg",
	"slack.com",
	"x.com",
	"twitter.com",
	"instagram.com",
	"facebook.com",
	"messenger.com",
	"telegram.org",
	"t.me",
	"reddit.com",
	"youtube.com",
	"tiktok.com",
];

const HOLD_DURATION_MS = 3000;

export default function FocusShield() {
	const flowSession = useFlowReactorSession();
	const lockSession = useFocusSession();
	const activeSession = flowSession ?? lockSession;

	const [toast, setToast] = useState<string | null>(null);
	const [holdProgress, setHoldProgress] = useState(0);
	const timeoutRef = useRef<number | null>(null);
	const holdFrame = useRef<number | null>(null);
	const holdStart = useRef<number | null>(null);

	const showToast = useCallback((message: string) => {
		setToast(message);
		if (timeoutRef.current !== null) {
			window.clearTimeout(timeoutRef.current);
		}
		timeoutRef.current = window.setTimeout(() => setToast(null), 2200);
	}, []);

	useEffect(() => {
		return () => {
			if (timeoutRef.current !== null) {
				window.clearTimeout(timeoutRef.current);
			}
			if (holdFrame.current !== null) {
				window.cancelAnimationFrame(holdFrame.current);
			}
		};
	}, []);

	useEffect(() => {
		if (!activeSession) return;

		const onClick = (event: MouseEvent) => {
			const el = (event.target as HTMLElement)?.closest?.("a") as HTMLAnchorElement | null;
			if (!el) return;
			const href = el.getAttribute("href") || "";
			if (!href || href.startsWith("#")) return;
			try {
				const url = new URL(href, window.location.href);
				const host = url.hostname.toLowerCase();
				const isBlocked =
					BLOCKED_HOSTS.some((blocked) => host.endsWith(blocked)) ||
					el.dataset.distraction === "true";
				if (isBlocked) {
					event.preventDefault();
					event.stopPropagation();
					showToast("Shield active: log it after the burn.");
				}
			} catch {
				// ignore invalid links
			}
		};

		const onVisibilityChange = () => {
			if (document.hidden) showToast("Containment breach detected. Return to the chamber.");
		};

		const onBlur = () => showToast("Shield still up. Regain the chamber to continue.");

		document.addEventListener("click", onClick, true);
		document.addEventListener("visibilitychange", onVisibilityChange);
		window.addEventListener("blur", onBlur);
		return () => {
			document.removeEventListener("click", onClick, true);
			document.removeEventListener("visibilitychange", onVisibilityChange);
			window.removeEventListener("blur", onBlur);
		};
	}, [activeSession, showToast]);

	const cancelHold = useCallback(() => {
		if (holdFrame.current !== null) {
			window.cancelAnimationFrame(holdFrame.current);
			holdFrame.current = null;
		}
		holdStart.current = null;
		setHoldProgress(0);
	}, []);

	const handleEmergencyExit = useCallback(() => {
		if (flowSession) {
			endFlowSession();
		} else if (lockSession) {
			endFocusSession();
		}
		showToast("Emergency exit engaged. Reactor safely powered down.");
		setHoldProgress(0);
	}, [flowSession, lockSession, showToast]);

	const startHold = useCallback(() => {
		if (!activeSession || holdFrame.current !== null) return;
		holdStart.current = Date.now();
		const tick = () => {
			if (holdStart.current === null) return;
			const elapsed = Date.now() - holdStart.current;
			const progress = Math.min(1, elapsed / HOLD_DURATION_MS);
			setHoldProgress(progress);
			if (progress >= 1) {
				cancelHold();
				handleEmergencyExit();
				return;
			}
			holdFrame.current = window.requestAnimationFrame(tick);
		};
		holdFrame.current = window.requestAnimationFrame(tick);
	}, [activeSession, cancelHold, handleEmergencyExit]);

	const emergencyCopy = useMemo(() => {
		if (!activeSession) return null;
		const target = activeSession.target ?? "session";
		return `Emergency exit • ${target.slice(0, 42)}`;
	}, [activeSession]);

	if (!activeSession) {
		return null;
	}

	return (
		<>
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				className="fixed inset-0 z-[1001] bg-reactor-shield/90 backdrop-blur-sm"
			>
				<div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-reactor-glow via-transparent to-reactor-glow opacity-30 animate-shield-flicker" />
				<div className="relative flex h-full flex-col items-center justify-center gap-6 px-4 text-center text-white">
					<motion.div
						className="absolute inset-10 border border-cyan-400/20"
						animate={{ opacity: [0.4, 0.9, 0.4] }}
						transition={{ repeat: Infinity, duration: 2 }}
					/>
					<div className="relative z-10 max-w-2xl space-y-4">
						<p className="text-sm uppercase tracking-[0.8em] text-cyan-300">Focus Shield</p>
						<h2 className="text-4xl font-bold text-reactor-core md:text-5xl">Containment field active</h2>
						<p className="text-cyan-200/80">
							Distractions neutralized. Reactor output remains stable until the cycle completes.
						</p>
					</div>
					<div className="relative z-10 w-full max-w-md rounded-3xl border border-reactor-hot/40 bg-reactor-panel/80 p-6">
						<p className="text-xs uppercase tracking-[0.5em] text-reactor-hot">
							{emergencyCopy ?? "Emergency exit"}
						</p>
						<p className="mt-3 text-sm text-cyan-200/80">
							Hold 3 seconds to vent the chamber if you need out now.
						</p>
						<button
							type="button"
							onPointerDown={startHold}
							onPointerUp={cancelHold}
							onPointerLeave={cancelHold}
							onPointerCancel={cancelHold}
							onTouchStart={startHold}
							onTouchEnd={cancelHold}
							className="mt-6 flex w-full flex-col items-center rounded-full border border-reactor-hot/60 px-6 py-4 text-sm font-semibold uppercase tracking-[0.4em] text-reactor-hot transition hover:border-white hover:text-white"
						>
							Hold to release
						</button>
						<div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-white/10">
							<div
								className="h-full rounded-full bg-reactor-hot transition-[width]"
								style={{ width: `${Math.min(holdProgress * 100, 100)}%` }}
							/>
						</div>
					</div>
				</div>
			</motion.div>
			{toast && (
				<div className="fixed bottom-6 right-6 z-[1002] rounded-2xl border border-white/20 bg-black/70 px-4 py-3 text-sm text-white shadow-lg">
					{toast}
				</div>
			)}
		</>
	);
}

