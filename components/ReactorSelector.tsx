'use client';

import { motion } from "framer-motion";
import { FlowType } from "@/lib/flow-reactor-types";

type ReactorOption = {
	id: FlowType;
	name: string;
	description: string;
	signal: string;
	color: string;
	icon: string;
};

const TYPES: ReactorOption[] = [
	{
		id: FlowType.TYPE_A,
		name: "Overthinker Core",
		description: "Slow the mental noise and focus the plasma stream.",
		signal: "Quiet the noise spiral",
		color: "from-pink-500/60 to-rose-600/40",
		icon: "🧠",
	},
	{
		id: FlowType.TYPE_B,
		name: "Momentum Core",
		description: "Kickstart the ignition loop and ride the surge.",
		signal: "Boost momentum",
		color: "from-cyan-400/60 to-blue-600/40",
		icon: "🚀",
	},
	{
		id: FlowType.TYPE_C,
		name: "Purpose Core",
		description: "Align the output to something worth chasing.",
		signal: "Aim at what matters",
		color: "from-amber-400/60 to-orange-600/40",
		icon: "🎯",
	},
	{
		id: FlowType.TYPE_D,
		name: "Structure Core",
		description: "Channel the beam with crisp sequencing.",
		signal: "Sequencing and order",
		color: "from-purple-500/60 to-indigo-600/40",
		icon: "⚡",
	},
	{
		id: FlowType.TYPE_E,
		name: "Shield Core",
		description: "Armor up against distractions and drift.",
		signal: "Fortify your edges",
		color: "from-emerald-400/60 to-teal-600/40",
		icon: "♾️",
	},
];

type ReactorSelectorProps = {
	selected?: FlowType | null;
	onSelect: (type: FlowType) => void;
};

export function ReactorSelector({ selected, onSelect }: ReactorSelectorProps) {
	return (
		<div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
			{TYPES.map((type) => {
				const isActive = selected === type.id;
				return (
					<motion.button
						type="button"
						key={type.id}
						whileHover={{ scale: 1.015 }}
						whileTap={{ scale: 0.985 }}
						onClick={() => onSelect(type.id)}
						className={`group relative overflow-hidden rounded-3xl border border-white/10 bg-slate-950/70 p-5 text-left text-white transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/70 ${
							isActive ? "border-cyan-300/70 shadow-[0_0_35px_rgba(34,211,238,0.3)]" : "hover:border-white/30"
						}`}
					>
						<div className="flex items-center justify-between text-white/80">
							<div className="text-4xl">{type.icon}</div>
							<div className="text-[10px] uppercase tracking-[0.4em]">
								Reactor {type.id.replace("TYPE_", "")}
							</div>
						</div>
						<h3 className="mt-3 text-xl font-semibold text-white">{type.name}</h3>
						<p className="mt-2 text-sm text-slate-300">{type.description}</p>
						<div className="mt-5 flex items-center justify-between text-xs text-slate-400">
							<span>{type.signal}</span>
							{isActive && (
								<span className="rounded-full bg-cyan-400/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.4em] text-cyan-200">
									Selected
								</span>
							)}
						</div>
						<div
							className={`pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-br ${type.color} opacity-0 blur-3xl transition duration-300 group-hover:opacity-70 ${
								isActive ? "opacity-70" : ""
							}`}
						/>
					</motion.button>
				);
			})}
		</div>
	);
}
