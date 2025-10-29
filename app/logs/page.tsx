"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { getLogs, type SessionLog } from "@/lib/lockin-logs";

const formatDateTime = (value: number) =>
	new Date(value).toLocaleString(undefined, {
		hour: "numeric",
		minute: "2-digit",
		month: "short",
		day: "numeric",
	});

export default function LogsPage() {
	const [logs, setLogs] = useState<SessionLog[]>([]);

	useEffect(() => {
		if (typeof window === "undefined") return;
		const hydrate = () => setLogs(getLogs());
		hydrate();

		const onStorage = (event: StorageEvent) => {
			if (!event.key || event.key === "lockin:logs") hydrate();
		};

		window.addEventListener("storage", onStorage);
		return () => window.removeEventListener("storage", onStorage);
	}, []);

const ordered = useMemo(
	() => logs.slice().sort((a, b) => b.startAt - a.startAt),
	[logs],
);

	const totals = useMemo(() => {
		if (ordered.length === 0) {
			return { sessions: 0, minutes: 0, avgCompletion: undefined as number | undefined, xp: 0 };
		}
		const minutes = ordered.reduce((acc, log) => acc + log.lengthMinutes, 0);
		const completionValues = ordered
			.map((log) => log.completionPercent)
			.filter((value): value is number => typeof value === 'number');
		const avgCompletion = completionValues.length
			? Math.round(completionValues.reduce((acc, value) => acc + value, 0) / completionValues.length)
			: undefined;
		const xp = ordered.reduce((acc, log) => acc + (log.xpAwarded ?? 0), 0);
		return { sessions: ordered.length, minutes, avgCompletion, xp };
	}, [ordered]);

	return (
		<div className="min-h-screen bg-gradient-to-br from-[#020617] via-[#0f172a] to-[#111827] text-white">
			<div className="mx-auto w-full max-w-5xl px-6 py-12 sm:px-10 lg:px-12">
				<header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
					<div>
						<div className="text-xs uppercase tracking-[0.3em] text-cyan-200">
							History
						</div>
						<h1 className="mt-3 text-4xl font-semibold text-white">Session Logs</h1>
						<p className="mt-2 max-w-2xl text-base text-slate-300">
							Every Lock-In captured with reflection notes and alignment insights.
						</p>
					</div>
					<Link
						href="/dashboard"
						className="rounded-full border border-white/20 px-6 py-2 text-sm font-semibold text-slate-200 transition hover:border-white/40"
					>
						Insights Dashboard
					</Link>
				</header>

			{ordered.length > 0 && (
				<section className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
					<div className="rounded-3xl border border-white/10 bg-white/5 p-6">
						<div className="text-xs uppercase tracking-[0.3em] text-slate-400">Sessions</div>
						<div className="mt-3 text-3xl font-semibold text-white">{totals.sessions}</div>
						<p className="mt-1 text-xs text-slate-400">Lifetime lock-ins captured</p>
					</div>
					<div className="rounded-3xl border border-white/10 bg-white/5 p-6">
						<div className="text-xs uppercase tracking-[0.3em] text-slate-400">Deep Work Minutes</div>
						<div className="mt-3 text-3xl font-semibold text-white">{totals.minutes}</div>
						<p className="mt-1 text-xs text-slate-400">Total focused minutes logged</p>
					</div>
					<div className="rounded-3xl border border-white/10 bg-white/5 p-6">
						<div className="text-xs uppercase tracking-[0.3em] text-slate-400">Avg Completion</div>
						<div className="mt-3 text-3xl font-semibold text-white">
							{typeof totals.avgCompletion === "number" ? `${totals.avgCompletion}%` : '—'}
						</div>
						<p className="mt-1 text-xs text-slate-400">Self-rated completion across sessions</p>
					</div>
					<div className="rounded-3xl border border-white/10 bg-white/5 p-6">
						<div className="text-xs uppercase tracking-[0.3em] text-slate-400">XP Bank</div>
						<div className="mt-3 text-3xl font-semibold text-white">{totals.xp}</div>
						<p className="mt-1 text-xs text-slate-400">Total XP you’ve awarded yourself</p>
					</div>
				</section>
			)}

			<section className="mt-10">
					{ordered.length === 0 ? (
						<div className="rounded-3xl border border-white/10 bg-white/5 p-12 text-center text-slate-300">
							No sessions yet. Start a Lock-In to seed your history.
						</div>
					) : (
						<div className="space-y-4">
							{ordered.map((log) => (
								<div
									key={log.sessionId}
									className="rounded-3xl border border-white/10 bg-slate-950/60 p-6 text-sm text-slate-200 shadow-inner shadow-black/40 backdrop-blur"
								>
					<div className="flex flex-col gap-3 border-b border-white/5 pb-4 md:flex-row md:items-center md:justify-between">
						<div>
							<div className="text-xs uppercase tracking-[0.3em] text-slate-400">
								{log.completed ? "Completed" : "Ended Early"}
							</div>
							<div className="mt-2 text-xl font-semibold text-white">
								{log.target}
							</div>
							<div className="mt-1 text-xs text-slate-500">
								{formatDateTime(log.startAt)} → {formatDateTime(log.endAt)} •{" "}
								{log.lengthMinutes} min
							</div>
							<div className="mt-2 flex flex-wrap items-center gap-3 text-[11px] uppercase tracking-[0.25em] text-slate-500">
								<span>
									Completion {typeof log.completionPercent === 'number' ? `${log.completionPercent}%` : '—'}
								</span>
								<span>XP {log.xpAwarded ?? 0}</span>
							</div>
						</div>
						<div className="flex flex-wrap items-center gap-3">
							{typeof log.insights?.alignmentScore === "number" && (
								<span className="rounded-full border border-cyan-400/40 px-4 py-1.5 text-xs font-semibold text-cyan-200">
									Alignment {log.insights.alignmentScore}%
												</span>
											)}
											<Link
												href={`/reflection?sessionId=${log.sessionId}`}
												className="rounded-full border border-white/20 px-4 py-1.5 text-xs font-semibold text-slate-200 transition hover:border-white/40"
											>
												View Reflection
											</Link>
										</div>
									</div>

									{log.reflection?.summary ? (
										<div className="mt-4 text-base text-slate-100">{log.reflection.summary}</div>
									) : (
										<div className="mt-4 text-xs text-slate-400">
											No reflection saved yet. Capture one to unlock insights.
										</div>
									)}
								</div>
							))}
						</div>
					)}
				</section>
			</div>
		</div>
	);
}
