'use client';

import Link from "next/link";

const TRANSMISSIONS = [
	{
		id: "ops-042",
		title: "Daily field report",
		author: "Ops // Reactor B",
		content: "Momentum core locked for 45 minutes. Shared a tactic for muting Discord while screen sharing.",
		timeAgo: "12m ago",
	},
	{
		id: "ops-041",
		title: "Containment breach averted",
		author: "Labs // Reactor C",
		content: "Re-centered after a context switch by rewriting the mission brief in 3 sentences. Posted template for others.",
		timeAgo: "52m ago",
	},
	{
		id: "ops-040",
		title: "Community ritual",
		author: "Ops // Reactor D",
		content: "New lock-in soundtrack thread launched. Drop your go-to loops and tag the emotion it evokes.",
		timeAgo: "2h ago",
	},
];

const HUD_METRICS = [
	{ label: "live reactors", value: "08", detail: "Members currently running sessions" },
	{ label: "threads active", value: "14", detail: "Last 24 hours of chatter" },
	{ label: "rituals shared", value: "27", detail: "Tactics pinned this week" },
];

export default function CommunityPage() {
	return (
		<div className="min-h-screen bg-gradient-to-br from-[#020617] via-[#0f172a] to-[#111827] text-white">
			<div className="mx-auto w-full max-w-6xl px-6 py-12 sm:px-10 lg:px-16">
				<header className="rounded-[36px] border border-white/10 bg-white/5 p-6 text-center backdrop-blur">
					<p className="text-xs uppercase tracking-[0.6em] text-cyan-200">Community Frequency</p>
					<h1 className="mt-4 text-3xl font-semibold text-white sm:text-4xl">Signal exchange bay</h1>
					<p className="mx-auto mt-3 max-w-3xl text-sm text-slate-300 sm:text-base">
						Drop wins, rituals, or questions from your latest run. This feed surfaces the freshest intel from other reactors so you are never building alone.
					</p>
					<div className="mt-6 flex flex-wrap items-center justify-center gap-3">
						<Link
							href="/"
							className="rounded-full border border-white/20 px-5 py-2 text-sm font-semibold text-slate-200 transition hover:border-white/50"
						>
							Back to mission control
						</Link>
						<Link
							href="/logs"
							className="rounded-full bg-cyan-400 px-5 py-2 text-sm font-semibold text-slate-900 shadow shadow-cyan-400/40 transition hover:bg-cyan-300"
						>
							Share a ritual
						</Link>
					</div>
				</header>

				<section className="mt-10 grid gap-6 md:grid-cols-3">
					{HUD_METRICS.map((metric) => (
						<div key={metric.label} className="rounded-3xl border border-white/10 bg-slate-950/60 p-5 text-center shadow-inner shadow-black/50">
							<div className="text-[11px] uppercase tracking-[0.5em] text-slate-400">{metric.label}</div>
							<div className="mt-3 text-4xl font-semibold text-white">{metric.value}</div>
							<p className="mt-2 text-sm text-slate-400">{metric.detail}</p>
						</div>
					))}
				</section>

				<section className="mt-10 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
					<div className="space-y-5">
						{TRANSMISSIONS.map((post) => (
							<div key={post.id} className="rounded-3xl border border-white/10 bg-white/5 p-5 text-slate-200 backdrop-blur">
								<div className="flex items-center justify-between text-xs uppercase tracking-[0.4em] text-slate-500">
									<span>{post.author}</span>
									<span>{post.timeAgo}</span>
								</div>
								<h2 className="mt-3 text-xl font-semibold text-white">{post.title}</h2>
								<p className="mt-2 text-sm text-slate-200">{post.content}</p>
								<div className="mt-4 flex flex-wrap gap-2 text-[11px] uppercase tracking-[0.35em] text-cyan-200">
									<button type="button" className="rounded-full border border-white/20 px-3 py-1 text-slate-200 transition hover:border-white/50">
										Boost
									</button>
									<button type="button" className="rounded-full border border-white/20 px-3 py-1 text-slate-200 transition hover:border-white/50">
										Bookmark
									</button>
								</div>
							</div>
						))}
					</div>
					<div className="rounded-3xl border border-white/10 bg-slate-950/70 p-6">
						<p className="text-xs uppercase tracking-[0.6em] text-cyan-200">Upcoming transmissions</p>
						<ul className="mt-5 space-y-4 text-sm text-slate-300">
							<li className="rounded-2xl border border-white/10 bg-black/20 p-4">
								<strong className="text-white">Office hours merge</strong>
								<p className="mt-1 text-slate-400">Live session pairing to debug your workflow block.</p>
							</li>
							<li className="rounded-2xl border border-white/10 bg-black/20 p-4">
								<strong className="text-white">Community reflection prompt</strong>
								<p className="mt-1 text-slate-400">“What single ritual made the biggest difference this week?”</p>
							</li>
							<li className="rounded-2xl border border-white/10 bg-black/20 p-4">
								<strong className="text-white">Audio drop</strong>
								<p className="mt-1 text-slate-400">New binaural loop for Reactor Type B release.</p>
							</li>
						</ul>
					</div>
				</section>
			</div>
		</div>
	);
}
