'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
	getAllIntakes,
	type ReactorAnswers,
} from '@/lib/flow-reactor-intake';
import {
	getLogs,
	type ReactorSessionLog,
} from '@/lib/flow-reactor-logs';
import { computeProgress, ROLE_THRESHOLDS } from '@/lib/lockin-progress';
import {
	computeFocusVsCommunityRatio,
	getCommunityBaseline,
	saveCommunityBaseline,
} from '@/lib/community-insights';

type SessionWithIntake = {
	log: ReactorSessionLog;
	intake: ReactorAnswers | null;
};

export default function FlowReactorDashboard() {
	const router = useRouter();
	const [intakes, setIntakes] = useState<ReactorAnswers[]>([]);
	const [logs, setLogs] = useState<ReactorSessionLog[]>([]);
	const [baseline, setBaseline] = useState(() => getCommunityBaseline());
	const [unlockState, setUnlockState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
	const [unlockMessage, setUnlockMessage] = useState<string | null>(null);

	useEffect(() => {
		if (typeof window === 'undefined') return;
		const hydrate = () => {
			setIntakes(getAllIntakes());
			setLogs(getLogs());
		};
		hydrate();

		const onStorage = (event: StorageEvent) => {
			if (!event.key || event.key.startsWith('flowReactor:')) hydrate();
		};
		window.addEventListener('storage', onStorage);
		return () => window.removeEventListener('storage', onStorage);
	}, []);

	const history = useMemo<SessionWithIntake[]>(() => {
	return logs
		.slice()
		.sort((a, b) => b.startAt - a.startAt)
		.map((log) => ({
			log,
			intake: log.intakeId
				? intakes.find((item) => item.id === log.intakeId) ?? null
				: null,
		}));
	}, [intakes, logs]);

	const totals = useMemo(() => computeProgress(logs), [logs]);

	const completionRate = useMemo(() => {
		if (history.length === 0) return 0;
		const completed = history.filter((entry) => entry.log.completed).length;
		return Math.round((completed / history.length) * 100);
	}, [history]);

	const latestSession = history[0]?.log ?? null;
	const focusVsCommunity = useMemo(() => {
		if (!latestSession) return null;
		return computeFocusVsCommunityRatio(latestSession.lengthMinutes, baseline.baselineMinutes);
	}, [latestSession, baseline.baselineMinutes]);

	const handleBaselineUpdate = (minutes: number) => {
		const next = saveCommunityBaseline(minutes);
		setBaseline(next);
	};

	const roleToSync = totals.currentRole;
	const canSyncRole = totals.totalXP > 0;

	const handleRoleSync = async () => {
		if (!canSyncRole) return;
		setUnlockState('loading');
		setUnlockMessage(null);
		try {
			const response = await fetch('/api/roles/unlock', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					roleKey: roleToSync.key,
					roleLabel: roleToSync.label,
					xp: totals.totalXP,
				}),
			});
			const result = await response.json();
			if (!response.ok) throw new Error(result?.message ?? 'Unable to sync role');
			setUnlockState('success');
			setUnlockMessage(result?.message ?? 'Role synced to Whop');
		} catch (error) {
			console.error('[flow-reactor] role sync error', error);
			setUnlockState('error');
			setUnlockMessage(error instanceof Error ? error.message : 'Unable to sync role');
		}
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-[#020617] via-[#0f172a] to-[#111827] text-white">
			<div className="mx-auto w-full max-w-6xl px-6 py-12 sm:px-10 lg:px-14">
				<header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
					<div>
						<div className="text-xs uppercase tracking-[0.3em] text-cyan-200">
							Personal Insights
						</div>
						<h1 className="mt-3 text-4xl font-semibold text-white">Flow Reactor Dashboard</h1>
						<p className="mt-2 max-w-2xl text-base text-slate-300">
							Review your ignition sequences, spot repeat patterns, and track the consistency of your focus practice.
						</p>
					</div>
					<div className="flex flex-wrap items-center gap-3">
						<Link
							href="/reactor"
							className="rounded-full border border-white/20 px-5 py-2 text-sm font-semibold text-slate-200 transition hover:border-white/40"
						>
							Start New Session
						</Link>
						<Link
							href="/logs"
							className="rounded-full bg-cyan-400 px-6 py-2 text-sm font-semibold text-slate-900 shadow shadow-cyan-400/40 transition hover:bg-cyan-300"
						>
							Session Logs
						</Link>
					</div>
				</header>

			<section className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
				<div className="rounded-3xl border border-white/10 bg-white/5 p-6">
					<div className="text-xs uppercase tracking-[0.3em] text-slate-400">Total XP</div>
					<div className="mt-4 text-4xl font-semibold text-white">{totals.totalXP}</div>
					<p className="mt-2 text-sm text-slate-300">Self-awarded XP across reactor sessions.</p>
				</div>
				<div className="rounded-3xl border border-white/10 bg-white/5 p-6">
					<div className="text-xs uppercase tracking-[0.3em] text-slate-400">Deep Work Minutes</div>
					<div className="mt-4 text-4xl font-semibold text-white">{totals.totalMinutes}</div>
					<p className="mt-2 text-sm text-slate-300">Total focused minutes logged.</p>
				</div>
				<div className="rounded-3xl border border-white/10 bg-white/5 p-6">
					<div className="text-xs uppercase tracking-[0.3em] text-slate-400">Streak</div>
					<div className="mt-4 text-4xl font-semibold text-white">{totals.streakDays}d</div>
					<p className="mt-2 text-sm text-slate-300">Consecutive days with at least one reactor session.</p>
				</div>
				<div className="rounded-3xl border border-white/10 bg-white/5 p-6">
					<div className="text-xs uppercase tracking-[0.3em] text-slate-400">Completion Rate</div>
					<div className="mt-4 text-4xl font-semibold text-white">{completionRate}%</div>
					<p className="mt-2 text-sm text-slate-300">Reactor sessions that finished the timer.</p>
				</div>
			</section>

			<section className="mt-12 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
				<div className="rounded-3xl border border-white/10 bg-white/5 p-6">
					<div className="text-xs uppercase tracking-[0.3em] text-slate-400">Role Progress</div>
					<h2 className="mt-3 text-2xl font-semibold text-white">{totals.currentRole.label}</h2>
					<p className="mt-2 text-sm text-slate-300">{totals.currentRole.description}</p>
					<div className="mt-6 space-y-3">
						{ROLE_THRESHOLDS.map((role) => {
							const unlocked = totals.totalXP >= role.xp;
							return (
								<div key={role.key} className="flex items-center justify-between rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm">
									<div>
										<div className="font-semibold text-white/90">{role.label}</div>
										<div className="text-[11px] uppercase tracking-[0.3em] text-slate-500">{role.xp} XP</div>
									</div>
									<div className={`text-xs font-semibold ${unlocked ? 'text-cyan-300' : 'text-slate-500'}`}>
										{unlocked ? 'Unlocked' : 'Locked'}
									</div>
								</div>
							);
						})}
					</div>
					<button
						type="button"
						onClick={handleRoleSync}
						disabled={!canSyncRole || unlockState === 'loading'}
						className={`mt-6 rounded-full px-5 py-2 text-sm font-semibold transition ${
							canSyncRole
								? 'bg-cyan-400 text-slate-900 shadow shadow-cyan-400/40 hover:bg-cyan-300'
								: 'bg-white/10 text-slate-400 cursor-not-allowed'
						}`}
					>
						{unlockState === 'loading' ? 'Syncing…' : `Sync ${roleToSync.label} to Whop`}
					</button>
					{unlockMessage && (
						<div className={`mt-3 text-xs ${unlockState === 'success' ? 'text-emerald-300' : 'text-red-300'}`}>
							{unlockMessage}
						</div>
					)}
				</div>

				<div className="rounded-3xl border border-white/10 bg-white/5 p-6">
					<div className="text-xs uppercase tracking-[0.3em] text-slate-400">Community Comparison</div>
					<h2 className="mt-3 text-2xl font-semibold text-white">Flow Reactor vs Community Time</h2>
					<p className="mt-2 text-sm text-slate-300">
						Set how much time you typically spend in community chats. We'll compare your latest reactor session against it.
					</p>
					<div className="mt-6">
						<label className="text-xs uppercase tracking-[0.3em] text-slate-400" htmlFor="baselineMinutes">
							Community baseline (minutes)
						</label>
						<input
							id="baselineMinutes"
							type="range"
							min={5}
							max={120}
							value={baseline.baselineMinutes}
							onChange={(event) => handleBaselineUpdate(Number.parseInt(event.target.value, 10))}
							className="mt-3 w-full accent-cyan-400"
						/>
						<div className="mt-2 text-sm text-slate-200">{baseline.baselineMinutes} minutes per day in community</div>
					</div>
					{latestSession ? (
						<div className="mt-6 rounded-3xl border border-white/10 bg-slate-950/60 p-5 text-sm text-slate-200 shadow-inner">
							<div className="text-xs uppercase tracking-[0.3em] text-slate-400">Latest session</div>
							<p className="mt-3 text-base text-white">Focused {latestSession.lengthMinutes} minutes on “{latestSession.target}”.</p>
							<p className="mt-2 text-sm text-slate-300">
								This is {focusVsCommunity ? `${focusVsCommunity}x` : '—'} your community baseline.
							</p>
						</div>
					) : (
						<div className="mt-6 rounded-3xl border border-white/10 bg-slate-950/60 p-5 text-sm text-slate-300">
							Start a reactor session to see comparisons here.
						</div>
					)}
				</div>
			</section>

				<section className="mt-12 space-y-6">
					<h2 className="text-2xl font-semibold text-white">Guided Intake Archive</h2>
					{history.length === 0 ? (
						<div className="rounded-3xl border border-white/10 bg-white/5 p-10 text-center text-slate-300">
							No sessions yet. Start a Flow Reactor session to seed your insights.
						</div>
					) : (
						<div className="space-y-5">
							{history.map(({ log, intake }) => (
								<div
									key={log.sessionId}
									className="rounded-3xl border border-white/10 bg-slate-950/60 p-6 text-sm text-slate-200 shadow-inner shadow-black/40 backdrop-blur"
								>
									<div className="flex flex-col gap-3 border-b border-white/5 pb-4 md:flex-row md:items-center md:justify-between">
										<div>
											<div className="text-xs uppercase tracking-[0.3em] text-slate-400">
												{log.completed ? 'Completed Session' : 'Ended Early'}
											</div>
											<div className="mt-2 text-xl font-semibold text-white">
												{log.target}
											</div>
						<div className="mt-1 text-xs text-slate-500">
							{new Date(log.startAt).toLocaleString()} • {log.lengthMinutes} min
						</div>
						<div className="mt-2 flex flex-wrap items-center gap-3 text-[11px] uppercase tracking-[0.25em] text-slate-500">
							<span>
								Completion {typeof log.completionPercent === 'number' ? `${log.completionPercent}%` : '—'}
							</span>
							<span>XP {log.xpAwarded ?? 0}</span>
						</div>
					</div>
										<div className="flex gap-2 text-xs text-slate-400">
                                            <button
                                                type="button"
                                                onClick={() => router.push(`/reflection?sessionId=${log.sessionId}`)}
                                                className="rounded-full border border-white/20 px-4 py-1.5 font-semibold transition hover:border-white/40"
                                            >
                                                Reflect
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => router.push('/focus')}
                                                className="rounded-full border border-white/20 px-4 py-1.5 font-semibold transition hover:border-white/40"
                                            >
                                                Restart Focus
                                            </button>
										</div>
									</div>

									<div className="mt-4 grid gap-4 lg:grid-cols-2">
										{intake ? (
											Object.entries(intake.answers).map(([key, value]) => {
												if (!value) return null;
												return (
													<div
														key={key}
														className="rounded-2xl border border-white/5 bg-white/5 p-4 text-slate-200"
													>
														<div className="text-[11px] uppercase tracking-[0.3em] text-slate-500">
															{key}
														</div>
														<p className="mt-2 text-base text-white">{value}</p>
													</div>
												);
											})
										) : (
											<div className="rounded-2xl border border-white/5 bg-white/5 p-4 text-slate-400">
												No intake data saved with this session.
											</div>
										)}
										{log.reflection && (
											<div className="rounded-2xl border border-white/5 bg-white/5 p-4 text-slate-200">
												<div className="text-[11px] uppercase tracking-[0.3em] text-slate-500">
													Reflection
												</div>
												<p className="mt-2 text-base text-white">{log.reflection.summary}</p>
												{log.reflection.distractionsNoted && (
													<p className="mt-2 text-sm text-slate-300">
														Pulls noticed: {log.reflection.distractionsNoted}
													</p>
												)}
												{log.reflection.nextStep && (
													<p className="mt-2 text-sm text-slate-300">
														Next step: {log.reflection.nextStep}
													</p>
												)}
											</div>
										)}
										{log.insights?.alignmentScore !== undefined && (
											<div className="rounded-2xl border border-cyan-400/30 bg-cyan-500/10 p-4 text-cyan-100">
												<div className="text-[11px] uppercase tracking-[0.3em] text-cyan-200">
													Alignment
												</div>
												<p className="mt-3 text-3xl font-semibold text-white">
													{log.insights.alignmentScore}%
												</p>
												{log.insights.notes && (
													<p className="mt-1 text-xs text-cyan-100/80">{log.insights.notes}</p>
												)}
											</div>
										)}
									</div>
								</div>
							))}
						</div>
					)}
				</section>
			</div>
		</div>
	);
}
