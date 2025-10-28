'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
	addOrUpdateLog,
	getLog,
	type SessionLog,
} from '@/lib/lockin-logs';
import {
	endSession,
	getSession,
	pauseSession,
	resumeSession,
	subscribeSession,
	type FocusSession,
} from '@/lib/focus-session';
import { getIntake } from '@/lib/lockin-intake';

const formatTime = (seconds: number) => {
	const mins = Math.floor(seconds / 60);
	const secs = seconds % 60;
	return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export default function FocusPage() {
	const router = useRouter();
	const [session, setSession] = useState<FocusSession | null>(null);
	const [remaining, setRemaining] = useState<number>(0);
	const [initialTotal, setInitialTotal] = useState<number>(0);
	const [isPaused, setIsPaused] = useState<boolean>(false);
	const hasRedirected = useRef<boolean>(false);

useEffect(() => {
	if (typeof window === 'undefined') return;

	const hydrate = () => {
		const current = getSession();
		if (!current) {
			if (!hasRedirected.current) {
				router.replace('/lock-in');
				hasRedirected.current = true;
			}
			return;
		}

		const secondsRemaining = Math.max(
			0,
			Math.floor((current.endAt - Date.now()) / 1000),
		);

		setSession(current);
		setRemaining(current.paused ? current.remaining ?? secondsRemaining : secondsRemaining);
		setInitialTotal(current.lengthMinutes * 60);
		setIsPaused(current.paused);
	};

	hydrate();
	const unsubscribe = subscribeSession(hydrate);

	const tick = setInterval(() => {
		setRemaining((prev) => {
			if (isPaused || !session) return prev;
			return Math.max(0, prev - 1);
		});
	}, 1000);

	return () => {
		clearInterval(tick);
		unsubscribe();
	};
}, [isPaused, router, session]);

	useEffect(() => {
    if (!session || remaining > 0 || isPaused) return;

    const existingLog = getLog(session.sessionId);
    const payload: SessionLog = {
        sessionId: session.sessionId,
        intakeId: session.intakeId,
        target: session.target,
        startAt: session.startAt,
        endAt: Date.now(),
        lengthMinutes: session.lengthMinutes,
        completed: true,
    };

    if (existingLog?.reflection) {
        payload.reflection = existingLog.reflection;
        payload.insights = existingLog.insights;
    }

    addOrUpdateLog(payload);
    endSession();

    if (!hasRedirected.current) {
        hasRedirected.current = true;
        setSession(null);
        setRemaining(0);
        router.push(session.intakeId ? `/reflection?sessionId=${session.sessionId}` : '/reflection');
    }
}, [isPaused, remaining, router, session]);

	if (!session) {
		return (
			<div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#020617] via-[#0f172a] to-[#111827] text-slate-200">
				<div className="text-sm uppercase tracking-[0.3em] text-slate-400">
					Preparing your sprint...
				</div>
			</div>
		);
	}

	const secondsRemaining = session.paused
		? session.remaining ?? remaining
		: remaining;

	const progress = useMemo(() => {
		if (initialTotal === 0) return 0;
		const elapsed = Math.max(0, initialTotal - secondsRemaining);
		return Math.min(100, Math.round((elapsed / initialTotal) * 100));
	}, [initialTotal, secondsRemaining]);

	const intake = session.intakeId ? getIntake(session.intakeId) : null;

	const handlePauseToggle = () => {
		if (isPaused) resumeSession();
		else pauseSession();

		setIsPaused((previous) => !previous);
	};

	const handleEndEarly = () => {
		const payload: SessionLog = {
			sessionId: session.sessionId,
			intakeId: session.intakeId,
			target: session.target,
			startAt: session.startAt,
			endAt: Date.now(),
			lengthMinutes: session.lengthMinutes,
			completed: false,
		};

		addOrUpdateLog(payload);
		endSession();

		if (!hasRedirected.current) {
			hasRedirected.current = true;
			router.push('/reflection');
		}
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-[#020617] via-[#0f172a] to-[#111827] text-white">
			<div className="mx-auto flex w-full max-w-5xl flex-col gap-10 px-6 py-12 sm:px-10 lg:px-12">
				<header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
					<div>
						<div className="text-xs uppercase tracking-[0.3em] text-cyan-200">
							Locked-In Sprint
						</div>
						<h1 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">
							{session.target}
						</h1>
						<p className="mt-2 text-sm text-slate-300">
							{session.lengthMinutes} minute block • Started{' '}
							{new Date(session.startAt).toLocaleTimeString()}
						</p>
					</div>
					<div className="flex items-center gap-3">
						<button
							type="button"
							onClick={handlePauseToggle}
							className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
								isPaused
									? 'bg-cyan-400 text-slate-900 shadow-lg shadow-cyan-400/40 hover:bg-cyan-300'
									: 'border border-white/20 text-slate-200 hover:border-white/40'
							}`}
						>
							{isPaused ? 'Resume' : 'Pause'}
						</button>
						<button
							type="button"
							onClick={handleEndEarly}
							className="rounded-full border border-red-400/60 px-5 py-2 text-sm font-semibold text-red-200 transition hover:border-red-300 hover:text-red-100"
						>
							End Early
						</button>
					</div>
				</header>

				<section className="grid gap-8 rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-lg lg:grid-cols-[1.2fr_0.8fr] lg:p-10">
					<div className="flex flex-col justify-between gap-8">
						<div className="relative flex flex-col items-center justify-center rounded-3xl border border-cyan-400/30 bg-slate-950/60 px-6 py-10 text-center shadow-inner shadow-black/40">
							<div className="absolute inset-0 -z-10 rounded-3xl bg-gradient-to-br from-cyan-500/10 via-transparent to-indigo-500/10" />
							<div className="text-sm uppercase tracking-[0.3em] text-cyan-200">
								Time Remaining
							</div>
							<div className="mt-6 text-6xl font-semibold tracking-tight text-white sm:text-7xl">
								{formatTime(secondsRemaining)}
							</div>
							<div className="mt-4 flex w-full items-center gap-3 text-sm text-slate-300">
								<div className="flex-1 rounded-full bg-slate-800/60">
									<div
										className="h-2 rounded-full bg-cyan-400 transition-all"
										style={{ width: `${progress}%` }}
									/>
								</div>
								<div className="w-12 text-right tabular-nums text-cyan-100">{progress}%</div>
							</div>
						</div>

						<div className="rounded-3xl border border-white/10 bg-white/5 p-5 text-left">
							<div className="text-xs uppercase tracking-[0.3em] text-slate-400">
								Ritual
							</div>
							<ul className="mt-3 space-y-2 text-sm text-slate-200">
								<li className="flex items-start gap-2">
									<span className="mt-1 h-1.5 w-1.5 rounded-full bg-cyan-400" />
									Breathe in for 4, hold 4, out 6 to drop into focus.
								</li>
								<li className="flex items-start gap-2">
									<span className="mt-1 h-1.5 w-1.5 rounded-full bg-cyan-400" />
									Close or snooze anything outside today’s target.
								</li>
								<li className="flex items-start gap-2">
									<span className="mt-1 h-1.5 w-1.5 rounded-full bg-cyan-400" />
									Check alignment halfway and adjust without judgment.
								</li>
							</ul>
						</div>
					</div>

					<div className="flex flex-col gap-5">
						{intake && (
							<div className="rounded-3xl border border-white/10 bg-slate-950/60 p-5">
								<div className="text-xs uppercase tracking-[0.3em] text-slate-400">
									Your Intent
								</div>
								<div className="mt-3 space-y-4 text-sm text-slate-200">
									<div>
										<div className="text-slate-400">Focus for this sprint</div>
										<p className="mt-1 text-base text-white">{intake.q3_hour_goal || intake.q4_definition}</p>
									</div>
									<div>
										<div className="text-slate-400">Potential distractions</div>
										<p className="mt-1">{intake.q5_distractions}</p>
									</div>
									<div>
										<div className="text-slate-400">Guardrails you set</div>
										<p className="mt-1">{intake.q6_avoid_plan}</p>
									</div>
								</div>
							</div>
						)}

						<div className="rounded-3xl border border-white/10 bg-white/5 p-5">
							<div className="text-xs uppercase tracking-[0.3em] text-slate-400">
								Quick Actions
							</div>
							<div className="mt-4 flex flex-col gap-3">
								<button
									type="button"
									onClick={() => router.push('/reflection')}
									className="rounded-2xl border border-white/15 px-4 py-3 text-sm font-semibold text-slate-200 transition hover:border-white/40"
								>
									Jump to Reflection
								</button>
								<button
									type="button"
									onClick={() => router.push('/logs')}
									className="rounded-2xl border border-white/15 px-4 py-3 text-sm font-semibold text-slate-200 transition hover:border-white/40"
								>
									Review Past Sessions
								</button>
								<button
									type="button"
									onClick={() => router.push('/dashboard')}
									className="rounded-2xl border border-white/15 px-4 py-3 text-sm font-semibold text-slate-200 transition hover:border-white/40"
								>
									Insights Dashboard
								</button>
							</div>
						</div>
					</div>
				</section>
			</div>
		</div>
	);
}
