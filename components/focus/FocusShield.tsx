'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
	endSession as endFocusSession,
	useFocusSession,
} from '@/lib/focus-session';
import {
	endSession as endFlowSession,
	useFlowReactorSession,
} from '@/lib/flow-reactor-session';

const BLOCKED_HOSTS = [
	'discord.com',
	'discord.gg',
	'slack.com',
	'x.com',
	'twitter.com',
	'instagram.com',
	'facebook.com',
	'messenger.com',
	'telegram.org',
	't.me',
	'reddit.com',
	'youtube.com',
	'tiktok.com',
];

const HOLD_DURATION_MS = 3000;

export default function FocusShield() {
	const flowSession = useFlowReactorSession();
	const lockSession = useFocusSession();
	const activeSession = flowSession ?? lockSession;

	const [toast, setToast] = useState<string | null>(null);
	const timeoutRef = useRef<number | null>(null);
	const holdFrame = useRef<number | null>(null);
	const holdStart = useRef<number | null>(null);
	const [holdProgress, setHoldProgress] = useState(0);

	const show = useCallback((message: string) => {
		setToast(message);
		if (timeoutRef.current !== null) {
			window.clearTimeout(timeoutRef.current);
		}
		timeoutRef.current = window.setTimeout(() => setToast(null), 2400);
	}, []);

	useEffect(
		() => () => {
			if (timeoutRef.current !== null) {
				window.clearTimeout(timeoutRef.current);
			}
			if (holdFrame.current !== null) {
				window.cancelAnimationFrame(holdFrame.current);
			}
		},
		[]
	);

	useEffect(() => {
		if (!activeSession) return;

		const onClick = (event: MouseEvent) => {
			const el = (event.target as HTMLElement)?.closest?.('a') as HTMLAnchorElement | null;
			if (!el) return;

			const href = el.getAttribute('href') || '';
			if (!href || href.startsWith('#')) return;

			try {
				const url = new URL(href, window.location.href);
				const host = url.hostname.toLowerCase();
				const isBlocked =
					BLOCKED_HOSTS.some((blocked) => host.endsWith(blocked)) ||
					el.dataset.distraction === 'true';

				if (isBlocked) {
					event.preventDefault();
					event.stopPropagation();
					show('Locked-In mode is active. Save that scroll for your cooldown.');
				}
			} catch {
				// ignore invalid links
			}
		};

		const onVisibilityChange = () => {
			if (document.hidden) {
				show('Flow Shield: return to your reactor to stay in sync.');
			}
		};

		const onBlur = () => {
			show('Shield still on. Jump back in when you can.');
		};

		document.addEventListener('click', onClick, true);
		document.addEventListener('visibilitychange', onVisibilityChange);
		window.addEventListener('blur', onBlur);

		return () => {
			document.removeEventListener('click', onClick, true);
			document.removeEventListener('visibilitychange', onVisibilityChange);
			window.removeEventListener('blur', onBlur);
		};
	}, [activeSession, show]);

	const handleEmergencyExit = useCallback(() => {
		if (flowSession) {
			endFlowSession();
		} else if (lockSession) {
			endFocusSession();
		}
		setHoldProgress(0);
		show('Emergency exit triggered. Session safely ended.');
	}, [flowSession, lockSession, show]);

	const cancelHold = useCallback(() => {
		if (holdFrame.current !== null) {
			window.cancelAnimationFrame(holdFrame.current);
			holdFrame.current = null;
		}
		holdStart.current = null;
		setHoldProgress(0);
	}, []);

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
		const target = activeSession.target ?? 'this session';
		return `Hold to exit “${target.slice(0, 60)}”`;
	}, [activeSession]);

	return (
		<>
			{activeSession && (
				<div className="pointer-events-none fixed bottom-6 left-6 z-[1001]">
					<div className="pointer-events-auto max-w-xs rounded-3xl border border-cyan-400/40 bg-slate-950/90 p-4 text-sm text-slate-100 shadow-lg shadow-black/40 backdrop-blur">
						<div className="text-[10px] uppercase tracking-[0.3em] text-cyan-200">Focus shield</div>
						<p className="mt-1 text-base font-semibold text-white">
							Guard rails are on across tabs + devices.
						</p>
						<p className="mt-2 text-xs text-slate-300">
							Need out? Hold for 3 seconds to exit safely without force quitting your browser.
						</p>
						<button
							type="button"
							onPointerDown={startHold}
							onPointerUp={cancelHold}
							onPointerLeave={cancelHold}
							onPointerCancel={cancelHold}
							className="mt-4 w-full rounded-full border border-red-300/60 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-red-100 transition hover:border-red-200"
						>
							{emergencyCopy ?? 'Hold to exit'}
						</button>
						<div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-white/10">
							<div
								className="h-full rounded-full bg-red-400 transition-[width]"
								style={{ width: `${Math.min(holdProgress * 100, 100)}%` }}
							/>
						</div>
					</div>
				</div>
			)}
			{toast && (
				<div className="fixed bottom-24 right-6 z-[1001]">
					<div className="rounded-2xl border border-cyan-400/40 bg-slate-950/90 px-4 py-3 text-sm font-semibold text-cyan-100 shadow-lg shadow-black/40 backdrop-blur">
						{toast}
					</div>
				</div>
			)}
		</>
	);
}
