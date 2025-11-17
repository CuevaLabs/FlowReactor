'use client';

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FlowType } from "@/lib/flow-reactor-types";
import { getUserFlowType, setUserFlowType } from "@/lib/flow-type-storage";
import { useFlowReactorSession } from "@/lib/flow-reactor-session";
import { ReactorButton } from "@/components/ReactorButton";

type ModuleDescriptor = {
	key: "navigation" | "reactor" | "active" | "logs";
	title: string;
	description: string;
	signal: string;
	cta: string;
	href: string;
	steps: string[];
};

const MODULES: ModuleDescriptor[] = [
	{
		key: "navigation",
		title: "Mission Navigation",
		description: "The living map. Decide if you need guidance, insights, or community support before entering the chamber.",
		signal: "Scan the field",
		cta: "Open Dashboard",
		href: "/dashboard",
		steps: [
			"Check streak, XP, and alignment stats.",
			"Decide where to route your attention.",
			"Use role unlocks to sync back to Whop.",
		],
	},
	{
		key: "reactor",
		title: "Ignition Bay",
		description: "Guided intake questions narrow the mission and set a timer. This is where priming begins.",
		signal: "Prime a core",
		cta: "Start guided intake",
		href: "/reactor",
		steps: [
			"Pick the block you’re solving (Momentum, Shield, etc.).",
			"Answer three prompts to aim the beam.",
			"Lock the duration and ignite.",
		],
	},
	{
		key: "active",
		title: "Active Reactor",
		description: "Once lit, your focus timer, shield, and rituals live here. This keeps you in the chamber.",
		signal: "Hold containment",
		cta: "Enter containment",
		href: "/focus",
		steps: [
			"Monitor the main timer + shield warnings.",
			"Log friction mid-session if something breaches.",
			"Emergency exit routes you to reflection.",
		],
	},
	{
		key: "logs",
		title: "Archive & Reflections",
		description: "Every session writes to the logbook. Capture reflections to see patterns and award XP.",
		signal: "Integrate",
		cta: "Review logbook",
		href: "/logs",
		steps: [
			"Record what shipped and what pulled you away.",
			"Award completion % + XP.",
			"Compare intent vs. outcome via alignment score.",
		],
	},
];

export default function HomePage() {
	const router = useRouter();
	const session = useFlowReactorSession();
	const [selectedModule, setSelectedModule] = useState<ModuleDescriptor>(MODULES[0]!);
	const [preferredType, setPreferredType] = useState<FlowType | null>(null);

	useEffect(() => {
		setPreferredType(getUserFlowType());
	}, []);

	const handleQuickStart = () => {
		if (preferredType) {
			setUserFlowType(preferredType);
		}
		router.push("/reactor");
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-[#020617] via-[#0f172a] to-[#111827] text-white">
			<div className="mx-auto w-full max-w-5xl px-6 py-12 sm:px-10 lg:px-12">
				<section className="rounded-[40px] border border-white/10 bg-white/[0.05] px-6 py-10 text-center shadow-[0_0_120px_rgba(15,23,42,0.45)] backdrop-blur">
					<p className="text-xs uppercase tracking-[0.8em] text-cyan-300">Flow Reactor Control Deck</p>
					<h1 className="mt-6 text-4xl font-semibold text-white sm:text-5xl">
						Orient before you fire anything up
					</h1>
					<p className="mx-auto mt-4 max-w-3xl text-base text-slate-300 md:text-lg">
						This hero view walks you through every module. Tap a button to inspect it, then commit to the one move that matters.
					</p>
					<div className="mt-6 flex flex-wrap items-center justify-center gap-4">
						<ReactorButton onClick={handleQuickStart} disabled={false}>
							{preferredType ? `Run ${preferredType.replace("TYPE_", "")} protocol` : "Start guidance"}
						</ReactorButton>
						<button
							type="button"
							onClick={() => router.push("/dashboard")}
							className="rounded-full border border-white/30 px-5 py-2 text-sm font-semibold text-slate-200 transition hover:border-white/60"
						>
							Snapshot my status
						</button>
					</div>
					{session && (
						<div className="mt-8 grid gap-4 rounded-[32px] border border-reactor-core/30 bg-reactor-panel/50 p-6 text-left text-cyan-100">
							<div className="text-xs uppercase tracking-[0.4em] text-reactor-core">Active reactor detected</div>
							<p className="text-2xl font-semibold text-white">{session.target}</p>
							<p className="text-sm text-cyan-100/80">
								{session.lengthMinutes} minute ignition • Started {new Date(session.startAt).toLocaleTimeString()}
							</p>
							<div className="flex flex-wrap gap-3">
								<button
									type="button"
									onClick={() => router.push("/focus")}
									className="rounded-full bg-white px-5 py-2 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
								>
									Resume containment
								</button>
								<button
									type="button"
									onClick={() => router.push("/reflection")}
									className="rounded-full border border-white/30 px-5 py-2 text-sm font-semibold text-white transition hover:border-white/60"
								>
									Log reflections
								</button>
							</div>
						</div>
					)}
				</section>

				<section className="mt-12 rounded-[32px] border border-white/10 bg-white/5 p-6 text-left backdrop-blur">
					<p className="text-xs uppercase tracking-[0.6em] text-cyan-200">Flight checklist</p>
					<h2 className="mt-3 text-2xl font-semibold text-white">Your cadence every time you arrive</h2>
					<div className="mt-6 grid gap-4 sm:grid-cols-2">
						{["Scan your dashboard for patterns.", "Prime your reactor with a single intent.", "Hold the chamber until the timer ends.", "Debrief, log XP, and course-correct."].map(
							(entry, index) => (
								<div key={entry} className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
									<div className="text-xs font-semibold uppercase tracking-[0.4em] text-slate-500">Step {index + 1}</div>
									<p className="mt-2 text-sm text-slate-200">{entry}</p>
								</div>
							)
						)}
					</div>
				</section>

				<section className="mt-10 grid gap-6 rounded-[32px] border border-white/10 bg-slate-950/60 p-6 text-left shadow-inner shadow-black/60 lg:grid-cols-[0.9fr_1.1fr]">
					<div>
						<p className="text-xs uppercase tracking-[0.6em] text-cyan-200">Mission modules</p>
						<h2 className="mt-3 text-2xl font-semibold text-white">Tap to inspect</h2>
						<div className="mt-6 space-y-3">
							{MODULES.map((module) => {
								const isActive = module.key === selectedModule.key;
								return (
									<button
										type="button"
										key={module.key}
										onClick={() => setSelectedModule(module)}
										className={`flex w-full flex-col rounded-2xl border px-4 py-4 text-left transition ${
											isActive ? "border-cyan-400/60 bg-cyan-500/10 shadow shadow-cyan-400/30" : "border-white/10 bg-white/5 hover:border-white/20"
										}`}
									>
										<div className="text-xs uppercase tracking-[0.4em] text-slate-400">{module.signal}</div>
										<div className="mt-2 text-lg font-semibold text-white">{module.title}</div>
										<p className="mt-2 text-sm text-slate-300">{module.description}</p>
									</button>
								);
							})}
						</div>
					</div>

					<div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
						<div className="text-xs uppercase tracking-[0.4em] text-cyan-200">Module detail</div>
						<h3 className="mt-2 text-2xl font-semibold text-white">{selectedModule.title}</h3>
						<p className="mt-3 text-sm text-slate-200">{selectedModule.description}</p>
						<ul className="mt-6 space-y-3 text-sm text-slate-200">
							{selectedModule.steps.map((step) => (
								<li key={step} className="flex gap-3">
									<span className="mt-1 h-2 w-2 rounded-full bg-cyan-300" />
									<span>{step}</span>
								</li>
							))}
						</ul>
						<div className="mt-8 flex flex-wrap gap-3">
							<Link
								href={selectedModule.href}
								className="rounded-full bg-cyan-400 px-5 py-2 text-sm font-semibold text-slate-900 shadow shadow-cyan-400/50 transition hover:bg-cyan-300"
							>
								{selectedModule.cta}
							</Link>
							<button
								type="button"
								onClick={() => setSelectedModule(MODULES[(MODULES.indexOf(selectedModule) + 1) % MODULES.length]!)}
								className="rounded-full border border-white/30 px-5 py-2 text-sm font-semibold text-slate-200 transition hover:border-white/60"
							>
								Next module
							</button>
						</div>
					</div>
				</section>
			</div>
		</div>
	);
}
