'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { addOrUpdateLog, getLog, type ReactorSessionLog } from '@/lib/flow-reactor-logs';
import { endSession, getSessionRemainingSeconds, useFlowReactorSession } from '@/lib/flow-reactor-session';
import { getIntake } from '@/lib/flow-reactor-intake';

const formatTime = (seconds: number) => {
	const mins = Math.floor(seconds / 60);
	const secs = seconds % 60;
	return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export default function FocusPage() {
	const router = useRouter();
	const session = useFlowReactorSession();
	const [now, setNow] = useState(() => Date.now());
	const hasRedirected = useRef(false);

	useEffect(() => {
		const tick = setInterval(() => setNow(Date.now()), 1000);
		return () => clearInterval(tick);
	}, []);

	useEffect(() => {
		if (session) {
			hasRedirected.current = false;
			return;
		}
		if (typeof window === 'undefined') return;
		if (!hasRedirected.current) {
			hasRedirected.current = true;
			router.replace('/reactor');
		}
	}, [session, router]);

	const secondsRemaining = useMemo(
		() => (session ? getSessionRemainingSeconds(session, now) : 0),
		[session, now]
	);
	const initialTotal = session ? session.lengthMinutes * 60 : 0;

	useEffect(() => {
		if (!session || session.paused) return;
		if (secondsRemaining > 0) return;

		const existingLog = getLog(session.sessionId);
		const payload: ReactorSessionLog = {
			sessionId: session.sessionId,
			intakeId: session.intakeId,
			flowType: session.flowType,
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
			router.push(session.intakeId ? `/reflection?sessionId=${session.sessionId}` : '/reflection');
		}
	}, [session, secondsRemaining, router]);

	if (!session) {
		return (
			<div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#020617] via-[#0f172a] to-[#111827] text-slate-200">
				<div className="text-sm uppercase tracking-[0.3em] text-slate-400">
					Preparing your reactor...
				</div>
			</div>
		);
	}

	const progress = useMemo(() => {
		if (initialTotal === 0) return 0;
		const elapsed = Math.max(0, initialTotal - secondsRemaining);
		return Math.min(100, Math.round((elapsed / initialTotal) * 100));
	}, [initialTotal, secondsRemaining]);

	const intake = session.intakeId ? getIntake(session.intakeId) : null;

	const handleEndEarly = () => {
		if (!session) return;
		const payload: ReactorSessionLog = {
			sessionId: session.sessionId,
			intakeId: session.intakeId,
			flowType: session.flowType,
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

	const endTime = new Date(session.endAt).toLocaleTimeString();

	return (
		<div className="relative min-h-screen overflow-hidden bg-[#020617] text-white">
			<div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(34,211,238,0.15),transparent_55%),radial-gradient(circle_at_bottom,_rgba(99,102,241,0.18),transparent_50%)]" />
			<div className="relative mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 py-10 sm:px-12">
				<header className="flex flex-col gap-6 pt-4 md:flex-row md:items-start md:justify-between">
					<div>
						<div className="text-xs uppercase tracking-[0.35em] text-slate-400">Flow Reactor Active</div>
						<h1 className="mt-4 text-4xl font-semibold leading-tight sm:text-5xl">{session.target}</h1>
						<p className="mt-3 text-sm text-slate-300">
							{session.lengthMinutes} minute activation • Ends {endTime}
						</p>
					</div>
					<button
						type="button"
						onClick={handleEndEarly}
						className="self-start rounded-full border border-red-400/60 px-5 py-2 text-sm font-semibold text-red-200 transition hover:border-red-300 hover:text-red-100"
					>
						End Early
					</button>
				</header>

				<main className="flex flex-1 flex-col items-center justify-center gap-12 text-center">
					<div className="space-y-6">
						<div className="text-xs uppercase tracking-[0.4em] text-slate-500">Time Remaining</div>
						<div className="text-[clamp(3.5rem,12vw,9rem)] font-semibold tracking-tight text-white">
							{formatTime(secondsRemaining)}
						</div>
						<div className="mx-auto h-2 w-full max-w-xl overflow-hidden rounded-full bg-white/10">
							<div
								className="h-full bg-cyan-400 transition-all"
								style={{ width: `${progress}%` }}
							/>
						</div>
						<div className="text-xs uppercase tracking-[0.3em] text-slate-500">{progress}% complete</div>
					</div>

					{intake && (
						<div className="grid w-full max-w-4xl gap-6 text-left sm:grid-cols-2">
							<div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-lg shadow-black/20">
								<div className="text-xs uppercase tracking-[0.3em] text-slate-400">Flow plan</div>
								<div className="mt-4 space-y-4 text-sm text-slate-200">
									{Object.entries(intake.answers).slice(0, 2).map(([key, value]) => (
										<div key={key}>
											<div className="text-slate-400">{key}</div>
											<p className="mt-1 text-base text-white">{value || '—'}</p>
										</div>
									))}
								</div>
							</div>
							<div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-lg shadow-black/20">
								<div className="text-xs uppercase tracking-[0.3em] text-slate-400">Ignition sequence</div>
								<div className="mt-4 space-y-4 text-sm text-slate-200">
									{Object.entries(intake.answers).slice(2).map(([key, value]) => (
										<div key={key}>
											<div className="text-slate-400">{key}</div>
											<p className="mt-1 text-white/90">{value || '—'}</p>
										</div>
									))}
								</div>
							</div>
						</div>
					)}
				</main>

				<footer className="flex flex-col gap-6 pb-10 pt-12 sm:flex-row sm:items-center sm:justify-between">
					<div>
						<div className="text-xs uppercase tracking-[0.3em] text-slate-400">Ritual</div>
						<ul className="mt-3 space-y-2 text-sm text-slate-300">
							<li>Breathe in for 4, hold for 4, out for 6 to drop in.</li>
							<li>Close or snooze anything outside today’s target.</li>
							<li>Check alignment halfway and adjust without judgment.</li>
						</ul>
					</div>
					<div className="flex flex-wrap items-center gap-3">
						<button
							type="button"
							onClick={() => router.push('/reflection')}
							className="rounded-full border border-white/20 px-5 py-2 text-sm font-semibold text-slate-200 transition hover:border-white/40"
						>
							Jump to Reflection
						</button>
						<button
							type="button"
							onClick={() => router.push('/logs')}
							className="rounded-full border border-white/20 px-5 py-2 text-sm font-semibold text-slate-200 transition hover:border-white/40"
						>
							Review Past Sessions
						</button>
						<button
							type="button"
							onClick={() => router.push('/dashboard')}
							className="rounded-full border border-white/20 px-5 py-2 text-sm font-semibold text-slate-200 transition hover:border-white/40"
						>
							Insights Dashboard
						</button>
					</div>
				</footer>
			</div>
		</div>
	);
}
