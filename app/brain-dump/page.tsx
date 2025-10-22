'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

export default function BrainDumpPage() {
	const [content, setContent] = useState('');
	const [isActive, setIsActive] = useState(false);
	const [timeRemaining, setTimeRemaining] = useState(600); // 10 minutes in seconds
	const [isComplete, setIsComplete] = useState(false);
	const textareaRef = useRef<HTMLTextAreaElement>(null);
	const router = useRouter();

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

	const startDump = (duration = 600) => {
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

	const handleComplete = () => {
		// Store the brain dump content (in a real app, this would go to a database)
		if (typeof window !== 'undefined') {
			localStorage.setItem('brainDumpContent', content);
		}
		router.push('/organize');
	};

	return (
		<div className="min-h-screen bg-black text-white">
			{/* Header */}
			<div className="border-b border-gray-800 p-4">
				<div className="max-w-4xl mx-auto flex justify-between items-center">
					<h1 className="text-2xl font-bold">Brain Dump Mode</h1>
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
							<h2 className="text-3xl font-bold mb-4">Ready to Clear Your Mind?</h2>
							<p className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto">
								Write down everything on your mind - tasks, worries, ideas, open loops. 
								Don't worry about organization or grammar. Just dump it all out.
							</p>
						</div>
						
						<div className="space-y-4">
							<button
								onClick={() => startDump()}
								className="bg-white text-black font-bold py-4 px-8 rounded-lg text-xl hover:bg-gray-100 transition-colors"
							>
								Start 10-Minute Brain Dump
							</button>
							<button
								onClick={() => startDump(300)}
								className="block mx-auto text-gray-400 hover:text-white transition-colors"
							>
								Or try a quick 5-minute dump
							</button>
						</div>
					</div>
				)}

				{isActive && (
					<div className="py-8">
						<div className="mb-6">
							<div className="flex items-center justify-between mb-4">
								<h3 className="text-xl font-semibold">Dump Everything Here</h3>
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
								{content.length} characters • {content.split(/\s+/).filter(word => word.length > 0).length} words
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
							<h2 className="text-3xl font-bold mb-4">Dump Complete!</h2>
							<p className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto">
								Great job! You've cleared {content.split(/\s+/).filter(word => word.length > 0).length} words from your mental RAM. 
								Now let's organize these thoughts into actionable items.
							</p>
						</div>

						<div className="space-y-4">
							<button
								onClick={handleComplete}
								className="bg-white text-black font-bold py-4 px-8 rounded-lg text-xl hover:bg-gray-100 transition-colors"
							>
								Organize Your Thoughts
							</button>
							<button
								onClick={() => {
									setContent('');
									setIsComplete(false);
									setTimeRemaining(600);
								}}
								className="block mx-auto text-gray-400 hover:text-white transition-colors"
							>
								Start Over
							</button>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
