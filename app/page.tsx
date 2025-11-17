'use client';

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ReactorSelector } from "@/components/ReactorSelector";
import { ReactorButton } from "@/components/ReactorButton";
import { FlowType } from "@/lib/flow-reactor-types";
import { getUserFlowType, setUserFlowType } from "@/lib/flow-type-storage";
import { useFlowReactorSession } from "@/lib/flow-reactor-session";

export default function HomePage() {
	const router = useRouter();
	const session = useFlowReactorSession();
	const [selected, setSelected] = useState<FlowType | null>(null);

	useEffect(() => {
		setSelected(getUserFlowType());
	}, []);

	const startFlow = () => {
		if (!selected) return;
		setUserFlowType(selected);
		router.push("/reactor");
	};

	const heroCopy = useMemo(() => {
		if (!selected) return "Select your core to calculate the safest ignition path.";
		return `Core ${selected.replace("TYPE_", "")} primed. Stabilize field and ignite.`;
	}, [selected]);

	return (
		<div className="relative flex min-h-screen flex-col items-center justify-center gap-12 px-6 py-16 text-center">
			<div className="absolute inset-0">
				<div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(0,255,157,0.15),transparent_55%),radial-gradient(circle_at_bottom,_rgba(99,102,241,0.35),transparent_50%)]" />
				<div className="pointer-events-none absolute inset-0 opacity-30 mix-blend-screen" style={{ backgroundImage: "linear-gradient(120deg, rgba(255,255,255,0.08) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
			</div>

			<div className="relative z-10 flex w-full max-w-6xl flex-col items-center gap-6">
				<p className="text-xs uppercase tracking-[0.8em] text-cyan-300">Flow Reactor</p>
				<h1 className="bg-gradient-to-r from-reactor-core via-cyan-400 to-white bg-clip-text text-5xl font-bold text-transparent md:text-7xl">
					Nuclear-grade focus activation
				</h1>
				<p className="max-w-3xl text-lg text-cyan-200/80 md:text-xl">{heroCopy}</p>
				<div className="mt-4 w-full max-w-5xl rounded-[32px] border border-white/10 bg-white/5 p-8 backdrop-blur">
					<ReactorSelector selected={selected} onSelect={setSelected} />
				</div>
				<div className="mt-8 flex flex-col items-center gap-4">
					<ReactorButton onClick={startFlow} disabled={!selected}>
						{selected ? `Ignite Reactor ${selected.replace("TYPE_", "")}` : "Select your core"}
					</ReactorButton>
					<p className="text-sm uppercase tracking-[0.5em] text-cyan-300/80">
						Contain distractions. Amplify signal.
					</p>
				</div>
				{session && (
					<div className="mt-6 w-full max-w-xl rounded-3xl border border-reactor-core/30 bg-reactor-panel/80 p-6 text-left shadow-core">
						<div className="text-xs uppercase tracking-[0.4em] text-reactor-core">Core Online</div>
						<h2 className="mt-2 text-2xl font-semibold text-white">{session.target}</h2>
						<p className="mt-2 text-sm text-cyan-200/80">
							Length: {session.lengthMinutes} min • Started at {new Date(session.startAt).toLocaleTimeString()}
						</p>
						<button
							type="button"
							onClick={() => router.push("/focus")}
							className="mt-4 rounded-full border border-reactor-core/60 px-4 py-2 text-sm font-semibold text-reactor-core transition hover:border-white hover:text-white"
						>
							Return to containment chamber
						</button>
					</div>
				)}
			</div>
		</div>
	);
}

