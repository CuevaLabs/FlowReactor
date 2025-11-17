'use client';

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { addOrUpdateLog, getLog, type ReactorSessionLog } from "@/lib/flow-reactor-logs";
import { endSession, getSessionRemainingSeconds, useFlowReactorSession } from "@/lib/flow-reactor-session";
import { getIntake } from "@/lib/flow-reactor-intake";
import { FocusTimer } from "@/components/FocusTimer";

export default function FocusPage() {
	const router = useRouter();
	const session = useFlowReactorSession();
	const [now, setNow] = useState(() => Date.now());
	const hasRedirected = useRef(false);

	useEffect(() => {
		const tick = window.setInterval(() => setNow(Date.now()), 1000);
		return () => window.clearInterval(tick);
	}, []);

	useEffect(() => {
		if (session) {
			hasRedirected.current = false;
			return;
		}
		if (!hasRedirected.current) {
			hasRedirected.current = true;
			router.replace("/reactor");
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
			router.push(session.intakeId ? `/reflection?sessionId=${session.sessionId}` : "/reflection");
		}
	}, [session, secondsRemaining, router]);

	if (!session) {
		return (
			<div className="flex min-h-screen items-center justify-center bg-reactor-bg text-cyan-200">
				<div className="text-sm uppercase tracking-[0.45em]">Stabilizing containment...</div>
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
			router.push("/reflection");
		}
	};

	return (
		<div className="relative min-h-screen overflow-hidden bg-reactor-bg text-white">
			<div className="pointer-events-none absolute inset-0">
				<div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(0,255,157,0.15),transparent_50%),radial-gradient(circle_at_bottom,_rgba(255,59,92,0.25),transparent_55%)]" />
				<div className="absolute inset-0 border border-white/5" />
			</div>
			<div className="relative z-10 mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-10 px-6 py-12 sm:px-10 lg:px-16">
				<header className="flex flex-col gap-4 border-b border-white/10 pb-6 text-left md:flex-row md:items-end md:justify-between">
					<div>
						<p className="text-xs uppercase tracking-[0.65em] text-cyan-300">Containment Chamber</p>
						<h1 className="mt-4 text-3xl font-semibold text-white sm:text-4xl">{session.target}</h1>
						<p className="mt-2 text-sm text-cyan-100/70">
							{session.lengthMinutes} minute ignition • Ends {new Date(session.endAt).toLocaleTimeString()}
						</p>
					</div>
					<button
						type="button"
						onClick={handleEndEarly}
						className="self-start rounded-full border border-reactor-hot/60 px-5 py-2 text-sm font-semibold text-reactor-hot transition hover:border-white hover:text-white"
					>
						Emergency shutdown
					</button>
				</header>

				<main className="grid flex-1 gap-10 lg:grid-cols-[1.1fr_0.9fr]">
					<section className="flex flex-col items-center justify-center gap-8 rounded-[36px] border border-white/5 bg-reactor-panel/60 p-6 backdrop-blur">
						<FocusTimer session={session} />
						<div className="text-center text-sm text-cyan-200/80">
							<div className="text-xs uppercase tracking-[0.4em] text-white/70">Reactor output</div>
							<p className="mt-2 text-lg font-semibold text-white">{progress}% stabilized</p>
						</div>
					</section>

					<section className="space-y-6 rounded-[36px] border border-white/5 bg-white/5 p-6 text-left backdrop-blur">
						<div>
							<p className="text-xs uppercase tracking-[0.45em] text-cyan-200">Ignition Data</p>
							<ul className="mt-4 space-y-3 text-sm text-white/80">
								<li>Session ID: {session.sessionId.slice(0, 8)}...</li>
								<li>Flow type: {session.flowType ?? "—"}</li>
								<li>Intake Linked: {session.intakeId ? "Yes" : "No"}</li>
							</ul>
						</div>
						{intake && (
							<div className="rounded-2xl border border-white/10 bg-reactor-shield/50 p-4">
								<div className="text-xs uppercase tracking-[0.4em] text-reactor-core">Ignition Notes</div>
								<div className="mt-3 space-y-3 text-sm text-cyan-50/90">
									{Object.entries(intake.answers).map(([key, value]) => (
										<div key={key}>
											<p className="text-[11px] uppercase tracking-[0.4em] text-white/60">{key}</p>
											<p className="text-base text-white">{value || "—"}</p>
										</div>
									))}
								</div>
							</div>
						)}
						<div className="rounded-2xl border border-white/10 bg-black/20 p-4 text-sm text-cyan-100/80">
							<p className="text-xs uppercase tracking-[0.4em] text-white/60">Ritual</p>
							<ul className="mt-3 space-y-2">
								<li>Inhale 4 • Hold 4 • Exhale 6 to stabilize.</li>
								<li>Seal all hatches (notifications, tabs, alerts).</li>
								<li>Check alignment midway and adjust without judgment.</li>
							</ul>
						</div>
					</section>
				</main>
			</div>
		</div>
	);
}

