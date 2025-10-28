'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
	getAllIntakes,
	type IntakeAnswers,
} from '@/lib/lockin-intake';
import {
	getLogs,
	type SessionLog,
} from '@/lib/lockin-logs';

type SessionWithIntake = {
	log: SessionLog;
	intake: IntakeAnswers | null;
};

const QUESTION_LABELS: Record<string, string> = {
	q1_mind: 'Top of mind',
	q2_stress: 'Stressors noted',
	q3_hour_goal: 'Sprint goal',
	q4_definition: 'Definition of done',
	q5_distractions: 'Expected distractions',
	q6_avoid_plan: 'Protection plan',
};

export default function LockInDashboard() {
    const router = useRouter();
	const [intakes, setIntakes] = useState<IntakeAnswers[]>([]);
	const [logs, setLogs] = useState<SessionLog[]>([]);

	useEffect(() => {
		if (typeof window === 'undefined') return;
		const hydrate = () => {
			setIntakes(getAllIntakes());
			setLogs(getLogs());
		};
		hydrate();

		const onStorage = (event: StorageEvent) => {
			if (!event.key || event.key.startsWith('lockin:')) hydrate();
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

	const totalMinutes = useMemo(
		() => history.reduce((acc, entry) => acc + entry.log.lengthMinutes, 0),
		[history],
	);

	const completionRate = useMemo(() => {
		if (history.length === 0) return 0;
		const completed = history.filter((entry) => entry.log.completed).length;
		return Math.round((completed / history.length) * 100);
	}, [history]);

	return (
		<div className="min-h-screen bg-gradient-to-br from-[#020617] via-[#0f172a] to-[#111827] text-white">
			<div className="mx-auto w-full max-w-6xl px-6 py-12 sm:px-10 lg:px-14">
				<header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
					<div>
						<div className="text-xs uppercase tracking-[0.3em] text-cyan-200">
							Personal Insights
						</div>
						<h1 className="mt-3 text-4xl font-semibold text-white">Lock-In Dashboard</h1>
						<p className="mt-2 max-w-2xl text-base text-slate-300">
							Review your guided answers, spot repeat patterns, and track the consistency of your focus practice.
						</p>
					</div>
					<div className="flex flex-wrap items-center gap-3">
						<Link
							href="/lock-in"
							className="rounded-full border border-white/20 px-5 py-2 text-sm font-semibold text-slate-200 transition hover:border-white/40"
						>
							Start New Intake
						</Link>
						<Link
							href="/logs"
							className="rounded-full bg-cyan-400 px-6 py-2 text-sm font-semibold text-slate-900 shadow shadow-cyan-400/40 transition hover:bg-cyan-300"
						>
							Session Logs
						</Link>
					</div>
				</header>

				<section className="mt-10 grid gap-6 md:grid-cols-3">
					<div className="rounded-3xl border border-white/10 bg-white/5 p-6">
						<div className="text-xs uppercase tracking-[0.3em] text-slate-400">
							Sessions
						</div>
						<div className="mt-4 text-4xl font-semibold text-white">
							{history.length}
						</div>
						<p className="mt-2 text-sm text-slate-300">
							Lifetime guided sprints captured with Lock-In.
						</p>
					</div>
					<div className="rounded-3xl border border-white/10 bg-white/5 p-6">
						<div className="text-xs uppercase tracking-[0.3em] text-slate-400">
							Completion Rate
						</div>
						<div className="mt-4 text-4xl font-semibold text-white">
							{completionRate}%
						</div>
						<p className="mt-2 text-sm text-slate-300">
							How often you stayed in the seat until the timer ended.
						</p>
					</div>
					<div className="rounded-3xl border border-white/10 bg-white/5 p-6">
						<div className="text-xs uppercase tracking-[0.3em] text-slate-400">
							Deep Work Minutes
						</div>
						<div className="mt-4 text-4xl font-semibold text-white">
							{totalMinutes}
						</div>
						<p className="mt-2 text-sm text-slate-300">
							Total minutes captured across all recorded lock-ins.
						</p>
					</div>
				</section>

				<section className="mt-12 space-y-6">
					<h2 className="text-2xl font-semibold text-white">Guided Intake Archive</h2>
					{history.length === 0 ? (
						<div className="rounded-3xl border border-white/10 bg-white/5 p-10 text-center text-slate-300">
							No sessions yet. Start a guided lock-in to seed your insights.
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
											Object.entries(QUESTION_LABELS).map(([key, label]) => {
												const value = intake[key as keyof IntakeAnswers];
												if (!value) return null;
												return (
													<div
														key={key}
														className="rounded-2xl border border-white/5 bg-white/5 p-4 text-slate-200"
													>
														<div className="text-[11px] uppercase tracking-[0.3em] text-slate-500">
															{label}
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
