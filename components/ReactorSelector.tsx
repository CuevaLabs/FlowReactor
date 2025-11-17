'use client';

import { motion } from "framer-motion";
import { FlowType } from "@/lib/flow-reactor-types";

type ReactorOption = {
	id: FlowType;
	name: string;
	description: string;
	color: string;
	icon: string;
};

const TYPES: ReactorOption[] = [
	{
		id: FlowType.TYPE_A,
		name: "Overthinker Core",
		description: "Slow the mental noise and focus the plasma stream.",
		color: "from-pink-500 to-rose-600",
		icon: "🧠",
	},
	{
		id: FlowType.TYPE_B,
		name: "Momentum Core",
		description: "Kickstart the ignition loop and ride the surge.",
		color: "from-cyan-400 to-blue-600",
		icon: "🚀",
	},
	{
		id: FlowType.TYPE_C,
		name: "Purpose Core",
		description: "Align the output to something worth chasing.",
		color: "from-amber-400 to-orange-600",
		icon: "🎯",
	},
	{
		id: FlowType.TYPE_D,
		name: "Structure Core",
		description: "Channel the beam with crisp sequencing.",
		color: "from-purple-500 to-indigo-600",
		icon: "⚡",
	},
	{
		id: FlowType.TYPE_E,
		name: "Shield Core",
		description: "Armor up against distractions and drift.",
		color: "from-emerald-400 to-teal-600",
		icon: "♾️",
	},
];

type ReactorSelectorProps = {
	selected?: FlowType | null;
	onSelect: (type: FlowType) => void;
};

export function ReactorSelector({ selected, onSelect }: ReactorSelectorProps) {
	return (
		<div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
			{TYPES.map((type) => {
				const isActive = selected === type.id;
				return (
					<motion.button
						type="button"
						key={type.id}
						whileHover={{ scale: 1.05, rotate: 1 }}
						whileTap={{ scale: 0.95 }}
						onClick={() => onSelect(type.id)}
						className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${type.color} p-6 text-left text-white shadow-lg transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 ${
							isActive ? "ring-2 ring-white/80" : "opacity-90 hover:opacity-100"
						}`}
					>
						<div className="text-5xl">{type.icon}</div>
						<h3 className="mt-4 text-2xl font-bold">{type.name}</h3>
						<p className="mt-2 text-sm text-white/80">{type.description}</p>
						<div className="mt-4 text-xs uppercase tracking-[0.4em] text-white/70">
							Reactor {type.id.replace("TYPE_", "")}
						</div>
						<div className="pointer-events-none absolute inset-0 bg-white opacity-0 transition-opacity duration-300 hover:opacity-10" />
					</motion.button>
				);
			})}
		</div>
	);
}
