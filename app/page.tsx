'use client';

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { ReactorSelector } from "@/components/ReactorSelector";
import { ReactorButton } from "@/components/ReactorButton";
import { FlowType } from "@/lib/flow-reactor-types";
import { getUserFlowType, setUserFlowType } from "@/lib/flow-type-storage";
import { useFlowReactorSession } from "@/lib/flow-reactor-session";
import { getLogs, type ReactorSessionLog } from "@/lib/flow-reactor-logs";

type NavigationCard = {
	title: string;
	description: string;
	href: string;
	icon: string;
	accent: string;
};

const NAVIGATION: NavigationCard[] = [
	{
		title: "Dashboard",
		description: "Track streak, XP, and ignition consistency.",
		href: "/dashboard",
		icon: "📊",
		accent: "from-cyan-400/60 to-blue-500/40",
	},
	{
		title: "Reactor Control",
		description: "Guided intake to start a fresh mission.",
		href: "/reactor",
		icon: "🛰️",
		accent: "from-rose-400/60 to-orange-500/40",
	},
	{
		title: "Community",
		description: "Swap intel with the rest of the squad.",
		href: "/community",
		icon: "💬",
		accent: "from-emerald-400/60 to-teal-500/40",
	},
	{
		title: "Logs",
		description: "Review previous reactors and reflections.",
		href: "/logs",
		icon: "📓",
		accent: "from-purple-400/60 to-indigo-500/40",
	},
];

export default function HomePage() {
	const router = useRouter();
	const session = useFlowReactorSession();
	const [selected, setSelected] = useState<FlowType | null>(null);
	const [logs, setLogs] = useState<ReactorSessionLog[]>([]);

	useEffect(() => {
		setSelected(getUserFlowType());
	}, []);

	useEffect(() => {
		if (typeof window === "undefined") return;
		const hydrate = () => setLogs(getLogs());
		hydrate();
		const onStorage = (event: StorageEvent) => {
			if (!event.key || event.key.startsWith("flowReactor:")) hydrate();
		};
		window.addEventListener("storage", onStorage);
		return () => window.removeEventListener("storage", onStorage);
	}, []);

	const startFlow = () => {
		if (!selected) return;
		setUserFlowType(selected);
		router.push("/reactor");
	};

	const scrollToIgnition = () => {
		if (typeof window === "undefined") return;
		document.getElementById("ignite")?.scrollIntoView({ behavior: "smooth", block: "start" });
	};

	const heroCopy = useMemo(() => {
		if (selected) {
			return `Core ${selected.replace("TYPE_", "")} is primed. Sync with reactor control or change course below.`;
		}
		return "Mission control unifies everything: dashboard intel, community hails, and your most recent reactor burns.";
	}, [selected]);

	const recentLogs = useMemo(() => {
		return logs
			.slice()
			.sort((a, b) => b.startAt - a.startAt)
			.slice(0, 3);
	}, [logs]);

	return (
		<div className="min-h-screen bg-gradient-to-br from-[#020617] via-[#0f172a] to-[#111827] text-white">
			<div className="mx-auto w-full max-w-6xl px-6 py-12 sm:px-10 lg:px-14">
				<header className="rounded-[40px] border border-white/10 bg-white/[0.04] px-6 py-10 text-center shadow-[0_0_120px_rgba(15,23,42,0.45)] backdrop-blur">
					<p className="text-xs uppercase tracking-[0.8em] text-cyan-300">Flow Reactor Control Deck</p>
					<h1 className="mt-6 text-4xl font-semibold text-white sm:text-5xl md:text-6xl">
						Welcome back to mission control
					</h1>
					<p className="mx-auto mt-4 max-w-3xl text-base text-slate-300 md:text-lg">{heroCopy}</p>
					<div className="mt-6 flex flex-wrap items-center justify-center gap-4">
						<button
							type="button"
							onClick={() => (session ? router.push("/focus") : router.push("/dashboard"))}
							className="rounded-full bg-cyan-400 px-5 py-2 text-sm font-semibold text-slate-900 shadow shadow-cyan-400/50 transition hover:bg-cyan-300"
						>
							{session ? "Resume containment" : "View dashboard"}
						</button>
						<Link
							href="/reactor"
							className="rounded-full border border-white/20 px-5 py-2 text-sm font-semibold text-slate-200 transition hover:border-white/50"
						>
							Skip to intake
						</Link>
					</div>
				</header>

				<main className="mt-12 space-y-10">
					<section className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
						<div className="rounded-[32px] border border-white/10 bg-white/5 p-6 backdrop-blur">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-xs uppercase tracking-[0.6em] text-cyan-200">Mission Navigation</p>
									<h2 className="mt-3 text-2xl font-semibold text-white">Where do you need to go?</h2>
								</div>
								<Link href="/dashboard" className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-400 hover:text-white">
									View all
								</Link>
							</div>
							<div className="mt-6 grid gap-4 md:grid-cols-2">
								{NAVIGATION.map((card) => (
									<Link
										key={card.href}
										href={card.href}
										className="relative overflow-hidden rounded-3xl border border-white/10 bg-slate-950/60 p-5 transition hover:border-cyan-300/50"
									>
										<div className="flex items-center justify-between text-sm">
											<span className="text-2xl">{card.icon}</span>
											<span className="text-[10px] uppercase tracking-[0.4em] text-slate-500">Navigate</span>
										</div>
										<h3 className="mt-3 text-xl font-semibold">{card.title}</h3>
										<p className="mt-2 text-sm text-slate-300">{card.description}</p>
										<div className="mt-4 inline-flex items-center text-xs font-semibold text-cyan-200">
											<span>Enter</span>
											<span className="ml-2 text-base">→</span>
										</div>
										<div className={`pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-br ${card.accent} opacity-0 blur-2xl transition duration-500 hover:opacity-70`} />
									</Link>
								))}
							</div>
						</div>

						<div className="flex flex-col justify-between rounded-[32px] border border-white/10 bg-slate-950/50 p-6 text-left shadow-inner shadow-black/60">
							<p className="text-xs uppercase tracking-[0.6em] text-cyan-200">Active Reactor</p>
							{session ? (
								<>
									<h2 className="mt-3 text-2xl font-semibold text-white">{session.target}</h2>
									<p className="mt-2 text-sm text-slate-300">
										{session.lengthMinutes} min ignition • Started {new Date(session.startAt).toLocaleTimeString()}
									</p>
									<div className="mt-5 flex flex-wrap gap-3">
										<button
											type="button"
											onClick={() => router.push("/focus")}
											className="rounded-full bg-white px-5 py-2 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
										>
											Open containment
										</button>
										<button
											type="button"
											onClick={() => router.push("/reflection")}
											className="rounded-full border border-white/30 px-5 py-2 text-sm font-semibold text-slate-200 transition hover:border-white/60"
										>
											Log reflections
										</button>
									</div>
								</>
							) : (
								<>
									<h2 className="mt-3 text-2xl font-semibold text-white">No reactor currently live</h2>
									<p className="mt-2 text-sm text-slate-300">
										Your chamber is idle. Prime a core below or jump straight into a guided intake sequence.
									</p>
									<div className="mt-5 flex flex-wrap gap-3">
										<button
											type="button"
											onClick={scrollToIgnition}
											className="rounded-full bg-cyan-400 px-5 py-2 text-sm font-semibold text-slate-900 shadow shadow-cyan-400/40 transition hover:bg-cyan-300"
										>
											Prime a reactor
										</button>
										<Link
											href="/reactor"
											className="rounded-full border border-white/30 px-5 py-2 text-sm font-semibold text-slate-200 transition hover:border-white/60"
										>
											Run guided intake
										</Link>
									</div>
								</>
							)}
						</div>
					</section>

					<section id="ignite" className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
						<div className="rounded-[32px] border border-white/10 bg-white/5 p-6 backdrop-blur">
							<div className="flex flex-col gap-3 border-b border-white/10 pb-5 sm:flex-row sm:items-center sm:justify-between">
								<div>
									<p className="text-xs uppercase tracking-[0.6em] text-cyan-200">Ignition Bay</p>
									<h2 className="mt-2 text-2xl font-semibold text-white">Select the right reactor</h2>
								</div>
								<p className="text-sm text-slate-400">
									{selected ? `Core ${selected.replace("TYPE_", "")} highlighted.` : "Choose the issue you need to neutralize."}
								</p>
							</div>
							<div className="mt-6">
								<ReactorSelector selected={selected} onSelect={setSelected} />
							</div>
							<div className="mt-8 flex flex-wrap items-center gap-4">
								<ReactorButton onClick={startFlow} disabled={!selected}>
									{selected ? `Ignite Reactor ${selected.replace("TYPE_", "")}` : "Select reactor core"}
								</ReactorButton>
								<p className="text-sm uppercase tracking-[0.45em] text-cyan-300/70">
									Contain distractions. Amplify signal.
								</p>
							</div>
						</div>

						<div className="rounded-[32px] border border-white/10 bg-slate-950/60 p-6">
							<div className="flex items-center justify-between pb-4">
								<div>
									<p className="text-xs uppercase tracking-[0.6em] text-cyan-200">Previous Reactors</p>
									<h2 className="mt-2 text-2xl font-semibold text-white">Recent ignition logs</h2>
								</div>
								<Link href="/logs" className="text-xs font-semibold uppercase tracking-[0.4em] text-slate-400 hover:text-white">
									View logbook
								</Link>
							</div>
							<div className="space-y-4">
								{recentLogs.length === 0 ? (
									<div className="rounded-2xl border border-white/10 bg-white/5 p-5 text-sm text-slate-300">
										No sessions logged yet. Activate a reactor to seed your history.
									</div>
								) : (
									recentLogs.map((log) => (
										<div key={log.sessionId} className="rounded-2xl border border-white/10 bg-white/5 p-5 text-sm text-slate-200">
											<div className="flex items-start justify-between gap-3">
												<div>
													<div className="text-xs uppercase tracking-[0.4em] text-slate-500">
														{log.completed ? "Completed run" : "Ended early"}
													</div>
													<p className="mt-2 text-base font-semibold text-white">{log.target}</p>
												</div>
												<div className="text-right text-xs text-slate-400">
													<div>{new Date(log.startAt).toLocaleDateString()}</div>
													<div>{log.lengthMinutes} min</div>
												</div>
											</div>
											{log.reflection?.summary && (
												<p className="mt-3 text-sm text-slate-300">“{log.reflection.summary}”</p>
											)}
										</div>
									))
								)}
							</div>
						</div>
					</section>
				</main>
			</div>
		</div>
	);
}
