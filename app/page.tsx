'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useFlowReactorSession } from '@/lib/flow-reactor-session';

export default function HomePage() {
	const router = useRouter();
	const session = useFlowReactorSession();

	return (
		<div className="min-h-screen bg-gradient-to-br from-[#020617] via-[#0f172a] to-[#111827] text-white">
			<div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 py-16 sm:px-10 lg:px-16">
				<header className="flex items-center justify-between">
					<div className="text-2xl font-semibold tracking-tight text-cyan-200">
						Flow Reactor
					</div>
					<nav className="flex items-center gap-4 text-sm text-slate-300">
						<Link href="/reactor" className="hover:text-white transition-colors">
							Start
						</Link>
						<Link href="/focus" className="hover:text-white transition-colors">
							Focus
						</Link>
						<Link href="/logs" className="hover:text-white transition-colors">
							Logs
						</Link>
						<Link href="/dashboard" className="hover:text-white transition-colors">
							Dashboard
						</Link>
					</nav>
				</header>

				<main className="flex flex-1 flex-col-reverse items-center justify-center gap-16 py-12 lg:flex-row lg:items-stretch lg:py-20">
					<section className="w-full max-w-xl space-y-8">
						<div>
							<h1 className="text-4xl font-semibold leading-tight text-white sm:text-5xl">
								Personalized flow activation tailored to your mental ignition pattern.
							</h1>
							<p className="mt-4 text-lg text-slate-300">
								Flow Reactor personalizes your ignition sequence based on your reactor type,
								keeps your activation alive across tabs and devices, and helps you build pattern awareness.
							</p>
						</div>

						<div className="flex flex-col gap-4 sm:flex-row sm:items-center">
							<Link
								href="/reactor"
								className="inline-flex items-center justify-center rounded-full bg-cyan-400 px-6 py-3 text-lg font-semibold text-slate-900 shadow-lg shadow-cyan-500/25 transition-transform hover:-translate-y-0.5 hover:bg-cyan-300"
							>
								Enter the Reactor
							</Link>
							<Link
								href="/logs"
								className="inline-flex items-center justify-center rounded-full border border-slate-700 px-6 py-3 text-lg font-semibold text-slate-200 transition-colors hover:border-slate-500"
							>
								View Progress
							</Link>
						</div>

						<div className="grid gap-4 sm:grid-cols-3">
							<div className="rounded-2xl border border-white/5 bg-white/5 p-4 backdrop-blur">
								<div className="text-sm uppercase tracking-widest text-slate-400">
									Ignite
								</div>
								<p className="mt-2 text-base text-white">
									Select your reactor type and complete your personalized ignition sequence.
								</p>
							</div>
							<div className="rounded-2xl border border-white/5 bg-white/5 p-4 backdrop-blur">
								<div className="text-sm uppercase tracking-widest text-slate-400">
									Activate
								</div>
								<p className="mt-2 text-base text-white">
									The timer persists even if you hop away—come back and resume instantly.
								</p>
							</div>
							<div className="rounded-2xl border border-white/5 bg-white/5 p-4 backdrop-blur">
								<div className="text-sm uppercase tracking-widest text-slate-400">
									Reflect
								</div>
								<p className="mt-2 text-base text-white">
									Compare intentions with outcomes to spot patterns and level up.
								</p>
							</div>
						</div>
					</section>

					<aside className="relative w-full max-w-md rounded-3xl border border-cyan-400/20 bg-slate-900/60 p-6 backdrop-blur-lg">
						<div className="absolute -top-12 right-6 hidden h-24 w-24 rounded-full bg-cyan-500/30 blur-3xl sm:block" />
						<div className="relative space-y-6">
							<div className="text-sm uppercase tracking-widest text-cyan-200">
								Session Snapshot
							</div>
							{session ? (
								<div className="rounded-2xl border border-cyan-400/40 bg-cyan-500/10 p-5 text-slate-100">
									<div className="text-xs uppercase tracking-[0.25em] text-cyan-200">
										Reactor Active
									</div>
									<div className="mt-3 text-2xl font-semibold text-white">
										{session.target}
									</div>
									<div className="mt-3 flex flex-col gap-1 text-sm text-slate-300">
										<span>Length: {session.lengthMinutes} min</span>
										<span>
											Started: {new Date(session.startAt).toLocaleTimeString()}
										</span>
									</div>
									<button
										type="button"
										onClick={() => router.push('/focus')}
										className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
									>
										Resume Focus
									</button>
								</div>
							) : (
								<div className="rounded-2xl border border-white/10 bg-white/5 p-5 text-slate-200">
									<div className="text-xl font-semibold text-white">
										No active session
									</div>
									<p className="mt-3 text-sm text-slate-300">
										Your next activation is one ignition sequence away. Start whenever you&apos;re
										ready and we&apos;ll keep the reactor running.
									</p>
									<Link
										href="/reactor"
										className="mt-6 inline-flex w-full items-center justify-center rounded-full border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:border-slate-500"
									>
										Enter the Reactor
									</Link>
								</div>
							)}
						</div>
					</aside>
				</main>

				<footer className="mt-16 flex flex-col items-start justify-between gap-3 border-t border-white/10 pt-6 text-xs text-slate-400 sm:flex-row">
					<span>Built for creators who ship through deep focus.</span>
					<span>Flow Reactor © {new Date().getFullYear()}</span>
				</footer>
			</div>
		</div>
	);
}
