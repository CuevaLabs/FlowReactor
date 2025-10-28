'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

type DumpMode = 'initial' | 'reflection';

export default function BrainDumpPage() {
	const textareaRef = useRef<HTMLTextAreaElement>(null);
	const router = useRouter();
	const searchParams = useSearchParams();

	const mode: DumpMode = useMemo(() => {
		return searchParams.get('mode') === 'reflection' ? 'reflection' : 'initial';
	}, [searchParams]);

	const defaultDuration = mode === 'reflection' ? 300 : 600;
	const quickDuration = mode === 'reflection' ? 120 : 300;

	const [content, setContent] = useState('');
	const [isActive, setIsActive] = useState(false);
	const [timeRemaining, setTimeRemaining] = useState(defaultDuration);
	const [isComplete, setIsComplete] = useState(false);
	const [lastFocusTask, setLastFocusTask] = useState<string | null>(null);

	// Reset session when mode changes
	useEffect(() => {
		setContent('');
		setIsActive(false);
		setIsComplete(false);
		setTimeRemaining(defaultDuration);
	}, [mode, defaultDuration]);

	// Load context about the last focus sprint for reflection mode
	useEffect(() => {
		if (mode === 'reflection' && typeof window !== 'undefined') {
			const storedTask = localStorage.getItem('lastFocusTask');
			setLastFocusTask(storedTask && storedTask.trim().length > 0 ? storedTask : null);
		}
	}, [mode]);

	// Timer effect
	useEffect(() => {
		let interval: NodeJS.Timeout;
		if (isActive && timeRemaining > 0) {
			interval = setInterval(() => {
				setTimeRemaining((time) => time - 1);
			}, 1000);
		} else if (timeRemaining === 0 && isActive) {
			setIsActive(false);
			setIsComplete(true);
		}
		return () => clearInterval(interval);
	}, [isActive, timeRemaining]);

	// Auto-focus textarea when component mounts
	useEffect(() => {
		if (textareaRef.current) {
			textareaRef.current.focus();
		}
	}, []);

	const startDump = (duration: number = defaultDuration) => {
		setIsActive(true);
		setIsComplete(false);
		setTimeRemaining(duration);
	};

	const stopDump = () => {
		setIsActive(false);
		setIsComplete(true);
	};

	const formatTime = (seconds: number) => {
		const mins = Math.floor(seconds / 60);
		const secs = seconds % 60;
		return `${mins}:${secs.toString().padStart(2, '0')}`;
	};

	const persistDump = () => {
		if (typeof window === 'undefined') {
			return;
		}
		const storageKey = mode === 'reflection' ? 'postFocusDumpContent' : 'brainDumpContent';
		localStorage.setItem(storageKey, content);
	};

	const handleRoute = (path: string) => {
		persistDump();
		router.push(path);
	};

	const primaryStartLabel =
		mode === 'reflection' ? 'Start 5-Minute Reflection' : 'Start 10-Minute Brain Dump';
	const quickStartLabel =
		mode === 'reflection'
			? 'Need something lighter? Try a 2-minute check-in'
			: 'Or try a quick 5-minute dump';
	const heroTitle =
		mode === 'reflection' ? 'Decompress After Your Sprint' : 'Ready to Clear Your Mind?';
	const heroDescription =
		mode === 'reflection'
			? 'Capture leftover thoughts, wins, and anything pulling at your attention before you reset.'
			: "Write down everything on your mind - tasks, worries, ideas, open loops. Don't worry about organization or grammar. Just dump it all out.";
	const completionTitle =
		mode === 'reflection' ? 'Reflection Saved!' : 'Dump Complete!';
	const completionCopy =
		mode === 'reflection'
			? 'Nice work processing your session. A captured mind is a calmer mind.'
			: `Great job! You've cleared ${
					content.split(/\s+/).filter((word) => word.length > 0).length
				} words from your mental RAM. Now choose how you want to move forward.`;

	const resetSession = () => {
		setContent('');
		setIsActive(false);
		setIsComplete(false);
		setTimeRemaining(defaultDuration);
		if (textareaRef.current) {
			textareaRef.current.focus();
		}
	};

	return (
		<div className="min-h-screen bg-black text-white">
			{/* Header */}
			<div className="border-b border-gray-800 p-4">
				<div className="max-w-4xl mx-auto flex justify-between items-center">
					<h1 className="text-2xl font-bold">
						{mode === 'reflection' ? 'Post-Sprint Brain Sweep' : 'Brain Dump Mode'}
					</h1>
					{!isComplete && (
						<div className="text-right">
							<div className="text-3xl font-mono font-bold text-green-400">
								{formatTime(timeRemaining)}
							</div>
							<div className="text-sm text-gray-400">Time Remaining</div>
						</div>
					)}
				</div>
			</div>

			{/* Main Content */}
			<div className="max-w-4xl mx-auto p-4">
				{!isActive && !isComplete && (
					<div className="text-center py-16">
						<div className="mb-8">
							<div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
								<span className="text-4xl">🧠</span>
							</div>
							<h2 className="text-3xl font-bold mb-4">{heroTitle}</h2>
							<div className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto space-y-4">
								<p>{heroDescription}</p>
								{mode === 'reflection' && lastFocusTask && (
									<div className="bg-gray-900 border border-gray-700 rounded-lg p-4 text-left">
										<p className="text-sm text-gray-500 mb-1 uppercase tracking-wide">
											Last focus target
										</p>
										<p className="text-base text-gray-200">{lastFocusTask}</p>
										<p className="text-sm text-gray-500 mt-3">
											Note what felt sticky, what you completed, and anything new tugging at your attention.
										</p>
									</div>
								)}
							</div>
						</div>
						
						<div className="space-y-4">
							<button
								onClick={() => startDump(defaultDuration)}
								className="bg-white text-black font-bold py-4 px-8 rounded-lg text-xl hover:bg-gray-100 transition-colors"
							>
								{primaryStartLabel}
							</button>
							<button
								onClick={() => startDump(quickDuration)}
								className="block mx-auto text-gray-400 hover:text-white transition-colors"
							>
								{quickStartLabel}
							</button>
						</div>
					</div>
				)}

				{isActive && (
					<div className="py-8">
						<div className="mb-6">
							<div className="flex items-center justify-between mb-4">
								<h3 className="text-xl font-semibold">
									{mode === 'reflection' ? 'Capture the afterglow' : 'Dump Everything Here'}
								</h3>
								<button
									onClick={stopDump}
									className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
								>
									Complete Dump
								</button>
							</div>
							<p className="text-gray-400 text-sm">
								Don't think, just write. Capture every thought, task, worry, or idea that comes to mind.
							</p>
						</div>

						<textarea
							ref={textareaRef}
							value={content}
							onChange={(e) => setContent(e.target.value)}
							placeholder="Start typing everything that's on your mind... tasks, worries, ideas, random thoughts, anything at all..."
							className="w-full h-96 bg-gray-900 text-white p-6 rounded-lg border border-gray-700 focus:border-green-400 focus:outline-none resize-none text-lg leading-relaxed"
							style={{ fontFamily: 'monospace' }}
						/>

						<div className="mt-4 text-center">
							<div className="text-sm text-gray-500">
								{content.length} characters •{' '}
								{content.split(/\s+/).filter(word => word.length > 0).length} words
							</div>
						</div>
					</div>
				)}

				{isComplete && (
					<div className="text-center py-16">
						<div className="mb-8">
							<div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
								<span className="text-4xl">✅</span>
							</div>
							<h2 className="text-3xl font-bold mb-4">{completionTitle}</h2>
							<p className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto">{completionCopy}</p>
						</div>

						{mode === 'reflection' ? (
							<div className="space-y-4">
								<button
									onClick={() => handleRoute('/reset')}
									className="bg-white text-black font-bold py-4 px-8 rounded-lg text-xl hover:bg-gray-100 transition-colors"
								>
									Start Breathwork Reset
								</button>
								<button
									onClick={() => handleRoute('/focus')}
									className="block mx-auto text-gray-400 hover:text-white transition-colors"
								>
									Queue Another Focus Sprint
								</button>
								<button
									onClick={resetSession}
									className="block mx-auto text-gray-500 hover:text-white transition-colors text-sm"
								>
									Start Over
								</button>
							</div>
						) : (
							<div className="space-y-4">
								<button
									onClick={() => handleRoute('/focus')}
									className="bg-white text-black font-bold py-4 px-8 rounded-lg text-xl hover:bg-gray-100 transition-colors"
								>
									Begin Focused Work Session
								</button>
								<button
									onClick={() => handleRoute('/organize')}
									className="block mx-auto text-gray-400 hover:text-white transition-colors"
								>
									Organize Into Actions
								</button>
								<button
									onClick={resetSession}
									className="block mx-auto text-gray-500 hover:text-white transition-colors text-sm"
								>
									Start Over
								</button>
							</div>
						)}
					</div>
				)}
			</div>
		</div>
	);
}
