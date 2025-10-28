'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

type SessionPhase = 'select' | 'focus' | 'complete';

interface Suggestion {
	id: string;
	text: string;
}

const parseBrainDump = (content: string): Suggestion[] => {
	const segments: string[] = [];
	content
		.split(/\r?\n/)
		.map((line) => line.split(/[.!?]/))
		.forEach((lineSegments) => {
			lineSegments.forEach((segment) => {
				const trimmed = segment.trim();
				if (trimmed.length > 3) {
					segments.push(trimmed);
				}
			});
		});

	return segments.map((text, index) => ({
		id: `entry-${index}`,
		text,
	}));
};

const formatTime = (seconds: number) => {
	const mins = Math.floor(seconds / 60);
	const secs = seconds % 60;
	return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export default function FocusSessionPage() {
	const router = useRouter();
	const [phase, setPhase] = useState<SessionPhase>('select');
	const [entries, setEntries] = useState<Suggestion[]>([]);
	const [selectedEntryId, setSelectedEntryId] = useState<string | null>(null);
	const [customFocus, setCustomFocus] = useState('');
	const [sessionLength, setSessionLength] = useState(25);
	const [timeRemaining, setTimeRemaining] = useState(sessionLength * 60);
	const [isPaused, setIsPaused] = useState(false);
	const [focusTarget, setFocusTarget] = useState<string | null>(null);

	const targetPreview = useMemo(() => {
		const custom = customFocus.trim();
		if (custom.length > 0) {
			return custom;
		}
		if (selectedEntryId) {
			const match = entries.find((entry) => entry.id === selectedEntryId);
			return match ? match.text : '';
		}
		return '';
	}, [customFocus, selectedEntryId, entries]);

	const progressPercent = useMemo(() => {
		const total = sessionLength * 60;
		if (phase !== 'focus' && phase !== 'complete') {
			return 0;
		}
		return total === 0 ? 0 : Math.min(100, ((total - timeRemaining) / total) * 100);
	}, [phase, sessionLength, timeRemaining]);

	useEffect(() => {
		if (typeof window === 'undefined') {
			return;
		}

		const storedDump = localStorage.getItem('brainDumpContent');
		if (storedDump) {
			setEntries(parseBrainDump(storedDump));
		}

		const storedLength = localStorage.getItem('focusSessionLength');
		if (storedLength) {
			const parsed = parseInt(storedLength, 10);
			if (!Number.isNaN(parsed) && parsed > 0) {
				setSessionLength(parsed);
				setTimeRemaining(parsed * 60);
			}
		}
	}, []);

	// Keep timer display in sync when adjusting length before starting
	useEffect(() => {
		if (phase === 'select') {
			setTimeRemaining(sessionLength * 60);
		}
	}, [sessionLength, phase]);

	// Persist preferred session length
	useEffect(() => {
		if (typeof window !== 'undefined') {
			localStorage.setItem('focusSessionLength', sessionLength.toString());
		}
	}, [sessionLength]);

	// Tick the timer while in focus mode
	useEffect(() => {
		if (phase !== 'focus' || isPaused) {
			return;
		}

		const interval = setInterval(() => {
			setTimeRemaining((prev) => {
				if (prev <= 1) {
					clearInterval(interval);
					setPhase('complete');
					return 0;
				}
				return prev - 1;
			});
		}, 1000);

		return () => clearInterval(interval);
	}, [phase, isPaused]);

	const handleStart = () => {
		const target = targetPreview;
		if (target.length === 0) {
			return;
		}

		setFocusTarget(target);
		setPhase('focus');
		setIsPaused(false);
		setTimeRemaining(sessionLength * 60);

		if (typeof window !== 'undefined') {
			localStorage.setItem('lastFocusTask', target);
		}
	};

	const handlePauseToggle = () => {
		setIsPaused((prev) => !prev);
	};

	const handleEndEarly = () => {
		setPhase('complete');
		setIsPaused(true);
	};

	const handleRestartSelection = () => {
		setPhase('select');
		setIsPaused(false);
		setFocusTarget(null);
		setSelectedEntryId(null);
		setCustomFocus('');
		setTimeRemaining(sessionLength * 60);
	};

	const handleBackToDump = () => {
		router.push('/brain-dump');
	};

	const handleReflection = () => {
		router.push('/brain-dump?mode=reflection');
	};

	if (entries.length === 0 && phase === 'select') {
		return (
			<div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
				<div className="max-w-xl text-center space-y-6">
					<div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mx-auto">
						<span className="text-4xl">📝</span>
					</div>
					<h1 className="text-3xl font-bold">Let&apos;s Capture a Brain Dump First</h1>
					<p className="text-lg text-gray-400">
						I couldn&apos;t find a recent brain dump. Offload everything that&apos;s on your mind and then we&apos;ll sprint on what matters.
					</p>
					<button
						onClick={handleBackToDump}
						className="bg-white text-black font-bold py-4 px-8 rounded-lg text-xl hover:bg-gray-100 transition-colors"
					>
						Start Brain Dump
					</button>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-black text-white">
			{/* Header */}
			<div className="border-b border-gray-800 p-4">
				<div className="max-w-4xl mx-auto flex justify-between items-center">
					<div>
						<h1 className="text-2xl font-bold">
							{phase === 'focus' ? 'Focused Sprint' : 'Sprint Launcher'}
						</h1>
						<p className="text-gray-400">
							{phase === 'focus'
								? 'Block distractions and stay with what matters.'
								: 'Pick a target and run a Pomodoro-style work block.'}
						</p>
					</div>
					<div className="text-right">
						<div className="text-3xl font-mono font-bold text-green-400">
							{formatTime(timeRemaining)}
						</div>
						<div className="text-sm text-gray-400">
							{phase === 'select' ? 'Session Length' : isPaused ? 'Paused' : 'Time Remaining'}
						</div>
					</div>
				</div>
			</div>

			<div className="max-w-4xl mx-auto p-4">
				{phase === 'select' && (
					<div className="py-10 space-y-8">
						<section>
							<h2 className="text-3xl font-bold mb-4">Lock in your next sprint</h2>
							<p className="text-gray-400 text-lg">
								Choose a focus target from the dump you just completed, or define a fresh one. We&apos;ll run a focused block so you can move it forward.
							</p>
						</section>

						{entries.length > 0 && (
							<section>
								<h3 className="text-sm uppercase tracking-widest text-gray-500 mb-3">
									Highlights from your dump
								</h3>
								<div className="grid md:grid-cols-2 gap-4">
									{entries.slice(0, 6).map((entry) => {
										const isSelected = selectedEntryId === entry.id;
										return (
											<button
												type="button"
												key={entry.id}
												onClick={() => setSelectedEntryId(entry.id)}
												className={`text-left bg-gray-900 border rounded-lg p-4 transition-colors ${
													isSelected
														? 'border-green-500 shadow-lg shadow-green-500/20'
														: 'border-gray-700 hover:border-gray-500'
												}`}
											>
												<p className="text-sm text-gray-400 mb-2">Tap to focus</p>
												<p className="text-base text-gray-100 leading-relaxed">
													{entry.text}
												</p>
											</button>
										);
									})}
								</div>
							</section>
						)}

						<section className="bg-gray-900 border border-gray-800 rounded-lg p-6 space-y-4">
							<h3 className="text-lg font-semibold">Or define your own focus target</h3>
							<textarea
								value={customFocus}
								onChange={(event) => setCustomFocus(event.target.value)}
								placeholder="What do you want to move forward right now?"
								className="w-full min-h-[120px] bg-black border border-gray-700 rounded-lg p-4 text-gray-100 focus:outline-none focus:border-green-400"
							/>
							<p className="text-sm text-gray-500">
								Not sure? Combine two notes from your dump, or describe what finishing looks like.
							</p>
						</section>

						<section className="bg-gray-900 border border-gray-800 rounded-lg p-6">
							<h3 className="text-lg font-semibold mb-4">Sprint length</h3>
							<div className="flex flex-wrap gap-3">
								{[15, 25, 45].map((length) => {
									const isActive = sessionLength === length;
									return (
										<button
											type="button"
											key={length}
											onClick={() => setSessionLength(length)}
											className={`px-4 py-2 rounded-full border text-sm transition-colors ${
												isActive
													? 'border-green-500 bg-green-500 text-black font-semibold'
													: 'border-gray-700 text-gray-300 hover:border-gray-500'
											}`}
										>
											{length} minutes
										</button>
									);
								})}
							</div>
							<p className="text-sm text-gray-500 mt-3">
								25 minutes keeps it classic. 45 works well for deep work, 15 for quick wins.
							</p>
						</section>

						<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
							<div className="text-sm text-gray-400">
								<span className="uppercase tracking-widest block text-xs text-gray-500">
									You&apos;re committing to
								</span>
								<span className="text-base text-gray-200">
									{targetPreview.length > 0
										? targetPreview
										: 'Select or describe what you want to focus on.'}
								</span>
							</div>
							<div className="flex gap-3">
								<button
									onClick={handleBackToDump}
									className="px-4 py-3 rounded-lg border border-gray-700 text-gray-300 hover:border-gray-500 transition-colors"
									type="button"
								>
									Revisit Dump
								</button>
								<button
									onClick={handleStart}
									disabled={targetPreview.length === 0}
									className={`px-6 py-3 rounded-lg font-bold transition-colors ${
										targetPreview.length === 0
											? 'bg-gray-700 text-gray-400 cursor-not-allowed'
											: 'bg-white text-black hover:bg-gray-100'
									}`}
									type="button"
								>
									Start Sprint
								</button>
							</div>
						</div>
					</div>
				)}

				{phase === 'focus' && focusTarget && (
					<div className="py-16 space-y-10 text-center">
						<section className="space-y-4">
							<h2 className="text-3xl font-bold">Protect your attention</h2>
							<p className="text-lg text-gray-400 max-w-2xl mx-auto">
								Stay with this one thread. Capture distractions elsewhere and let them wait.
							</p>
						</section>

						<section className="bg-gray-900 border border-gray-800 rounded-lg p-6 max-w-3xl mx-auto">
							<h3 className="text-sm uppercase tracking-widest text-gray-500 mb-2">
								Focus target
							</h3>
							<p className="text-xl text-gray-100 leading-relaxed">{focusTarget}</p>
						</section>

						<section className="flex flex-col items-center gap-6">
							<div className="relative w-64 h-64">
								<svg className="w-64 h-64 transform -rotate-90" viewBox="0 0 100 100">
									<circle
										cx="50"
										cy="50"
										r="40"
										stroke="currentColor"
										strokeWidth="8"
										fill="none"
										className="text-gray-900"
									/>
									<circle
										cx="50"
										cy="50"
										r="40"
										stroke="currentColor"
										strokeWidth="8"
										fill="none"
										strokeDasharray={`${2 * Math.PI * 40}`}
										strokeDashoffset={`${2 * Math.PI * 40 * (1 - progressPercent / 100)}`}
										className="text-green-500 transition-all duration-1000"
									/>
								</svg>
								<div className="absolute inset-0 flex items-center justify-center">
									<div>
										<div className="text-5xl font-mono font-bold text-green-400">
											{formatTime(timeRemaining)}
										</div>
										<div className="text-sm text-gray-500 mt-2">
											{isPaused ? 'Paused' : 'Stay with it'}
										</div>
									</div>
								</div>
							</div>
							<div className="flex gap-3">
								<button
									onClick={handlePauseToggle}
									className="px-5 py-3 rounded-lg border border-gray-700 text-gray-200 hover:border-gray-500 transition-colors"
									type="button"
								>
									{isPaused ? 'Resume' : 'Pause'}
								</button>
								<button
									onClick={handleEndEarly}
									className="px-5 py-3 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors"
									type="button"
								>
									End Early
								</button>
							</div>
						</section>
					</div>
				)}

				{phase === 'complete' && (
					<div className="py-16 text-center space-y-8">
						<div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto">
							<span className="text-4xl">✨</span>
						</div>
						<h2 className="text-3xl font-bold">Sprint complete</h2>
						<p className="text-lg text-gray-400 max-w-2xl mx-auto">
							Capture what surfaced, note any new tasks, and consciously close the loop before you move on.
						</p>

						<div className="bg-gray-900 border border-gray-800 rounded-lg p-6 max-w-2xl mx-auto text-left space-y-3">
							<h3 className="text-sm uppercase tracking-widest text-gray-500">
								What just happened
							</h3>
							<ul className="space-y-2 text-gray-200">
								<li>&bull; You gave {sessionLength} minutes of deep focus to {focusTarget ?? 'your target'}.</li>
								<li>&bull; Your brain is primed for a quick reflection to release residue.</li>
								<li>&bull; The breathing reset is ready whenever you are.</li>
							</ul>
						</div>

						<div className="space-y-3">
							<button
								onClick={handleReflection}
								className="bg-white text-black font-bold py-4 px-8 rounded-lg text-xl hover:bg-gray-100 transition-colors"
								type="button"
							>
								Capture Post-Sprint Reflection
							</button>
							<button
								onClick={handleRestartSelection}
								className="block mx-auto text-gray-400 hover:text-white transition-colors"
								type="button"
							>
								Run another sprint
							</button>
							<button
								onClick={handleBackToDump}
								className="block mx-auto text-gray-500 hover:text-white transition-colors text-sm"
								type="button"
							>
								Start fresh with a new dump
							</button>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
