'use client';

import { motion } from "framer-motion";
import type { ReactNode } from "react";

type ReactorButtonProps = {
	children: ReactNode;
	onClick?: () => void;
	disabled?: boolean;
};

export function ReactorButton({ children, onClick, disabled }: ReactorButtonProps) {
	return (
		<motion.button
			type="button"
			whileHover={disabled ? undefined : { scale: 1.05 }}
			whileTap={disabled ? undefined : { scale: 0.95 }}
			onClick={disabled ? undefined : onClick}
			disabled={disabled}
			className={`relative group px-10 py-4 text-lg font-bold tracking-[0.25em] uppercase rounded-full overflow-hidden transition-all duration-300 ${
				disabled
					? "cursor-not-allowed bg-slate-700/60 text-slate-400"
					: "bg-gradient-to-r from-reactor-core to-cyan-400 text-slate-900 shadow-reactor"
			}`}
		>
			<span className="relative z-10">{children}</span>
			{!disabled && (
				<>
					<div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity" />
					<div className="absolute -inset-1 bg-reactor-core blur-xl opacity-40 group-hover:opacity-70 animate-pulse-fast" />
				</>
			)}
		</motion.button>
	);
}
