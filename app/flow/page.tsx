'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

type ThoughtCategory =
	| 'do-now'
	| 'schedule'
	| 'delete'
	| 'delegate'
	| 'uncategorized';

const THOUGHT_CATEGORIES: ThoughtCategory[] = [
	'do-now',
	'schedule',
	'delete',
	'delegate',
	'uncategorized',
];

interface StoredThought {
	text: string;
	category: ThoughtCategory;
}

interface Task {
	id: string;
	text: string;
	category: string;
	estimatedTime: number; // in minutes
}

const isStoredThought = (value: unknown): value is StoredThought => {
	if (!value || typeof value !== 'object') {
		return false;
	}
	const candidate = value as Partial<StoredThought>;
	return (
		typeof candidate.text === 'string' &&
		typeof candidate.category === 'string' &&
		THOUGHT_CATEGORIES.includes(candidate.category as ThoughtCategory)
	);
};

const parseStoredThoughts = (raw: string): StoredThought[] => {
	try {
		const parsed = JSON.parse(raw);
		if (!Array.isArray(parsed)) {
			return [];
		}
		return parsed.filter(isStoredThought);
	} catch (error) {
		console.warn('Unable to parse stored organized thoughts', error);
		return [];
	}
};

export default function FlowPage() {
	const [tasks, setTasks] = useState<Task[]>([]);
	const [selectedTask, setSelectedTask] = useState<Task | null>(null);
	const [isFlowMode, setIsFlowMode] = useState(false);
	const [timeRemaining, setTimeRemaining] = useState(0);
	const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null);
	const router = useRouter();

	useEffect(() => {
		// Load organized thoughts as tasks
		if (typeof window !== 'undefined') {
			const organizedThoughts = localStorage.getItem('organizedThoughts');
			if (organizedThoughts) {
				const thoughts = parseStoredThoughts(organizedThoughts);
				const doNowTasks = thoughts
					.filter((t) => t.category === 'do-now')
					.map((t, index) => ({
						id: `task-${index}`,
						text: t.text,
						category: t.category,
						estimatedTime: 5 // Default 5 minutes for do-now tasks
					}));
				const scheduleTasks = thoughts
					.filter((t) => t.category === 'schedule')
					.map((t, index) => ({
						id: `task-${doNowTasks.length + index}`,
						text: t.text,
						category: t.category,
						estimatedTime: 25 // Default 25 minutes for scheduled tasks
					}));
				
				setTasks([...doNowTasks, ...scheduleTasks]);
			}
		}
	}, []);

	useEffect(() => {
		let interval: NodeJS.Timeout;
		if (isFlowMode && timeRemaining > 0) {
			interval = setInterval(() => {
				setTimeRemaining(prev => prev - 1);
			}, 1000);
		} else if (isFlowMode && timeRemaining === 0) {
			// Flow session complete
			setIsFlowMode(false);
			setSelectedTask(null);
		}
		return () => clearInterval(interval);
	}, [isFlowMode, timeRemaining]);

	const startFlowSession = (task: Task) => {
		setSelectedTask(task);
		setTimeRemaining(task.estimatedTime * 60);
		setIsFlowMode(true);
		setSessionStartTime(new Date());
	};

	const stopFlowSession = () => {
		setIsFlowMode(false);
		setSelectedTask(null);
		setTimeRemaining(0);
		setSessionStartTime(null);
	};

	const formatTime = (seconds: number) => {
		const mins = Math.floor(seconds / 60);
		const secs = seconds % 60;
		return `${mins}:${secs.toString().padStart(2, '0')}`;
	};

	const getProgressPercentage = () => {
		if (!selectedTask) return 0;
		const total = selectedTask.estimatedTime * 60;
		return ((total - timeRemaining) / total) * 100;
	};

	if (isFlowMode && selectedTask) {
		return (
			<div className="min-h-screen bg-black text-white">
				{/* Flow Mode Header */}
				<div className="border-b border-gray-800 p-4">
					<div className="max-w-4xl mx-auto flex justify-between items-center">
						<div>
							<h1 className="text-xl font-bold text-green-400">FLOW MODE</h1>
							<p className="text-sm text-gray-400">Focus on your task</p>
						</div>
						<div className="text-right">
							<div className="text-3xl font-mono font-bold text-green-400">
								{formatTime(timeRemaining)}
							</div>
							<div className="text-sm text-gray-400">Time Remaining</div>
						</div>
					</div>
				</div>

				{/* Flow Mode Content */}
				<div className="max-w-4xl mx-auto p-4">
					<div className="text-center py-16">
						{/* Task Display */}
						<div className="mb-12">
							<h2 className="text-3xl font-bold mb-4">Current Task</h2>
							<div className="bg-gray-900 rounded-lg p-8 max-w-2xl mx-auto">
								<p className="text-xl text-gray-300">{selectedTask.text}</p>
							</div>
						</div>

						{/* Progress Circle */}
						<div className="mb-12">
							<div className="relative w-64 h-64 mx-auto">
								<svg className="w-64 h-64 transform -rotate-90" viewBox="0 0 100 100">
									<circle
										cx="50"
										cy="50"
										r="40"
										stroke="currentColor"
										strokeWidth="8"
										fill="none"
										className="text-gray-800"
									/>
									<circle
										cx="50"
										cy="50"
										r="40"
										stroke="currentColor"
										strokeWidth="8"
										fill="none"
										strokeDasharray={`${2 * Math.PI * 40}`}
										strokeDashoffset={`${2 * Math.PI * 40 * (1 - getProgressPercentage() / 100)}`}
										className="text-green-500 transition-all duration-1000"
									/>
								</svg>
								<div className="absolute inset-0 flex items-center justify-center">
									<div className="text-center">
										<div className="text-4xl font-bold text-green-400">
											{Math.round(getProgressPercentage())}%
										</div>
										<div className="text-sm text-gray-400">Complete</div>
									</div>
								</div>
							</div>
						</div>

						{/* Flow Tips */}
						<div className="bg-gray-900 rounded-lg p-6 max-w-2xl mx-auto mb-8">
							<h3 className="text-lg font-bold mb-4 text-green-400">Flow State Tips</h3>
							<div className="space-y-2 text-sm text-gray-300">
								<p>• Stay focused on the task at hand</p>
								<p>• Let distractions pass without engaging</p>
								<p>• Trust your preparation and let your skills flow</p>
								<p>• Breathe naturally and maintain good posture</p>
							</div>
						</div>

						{/* Control Buttons */}
						<div className="space-x-4">
							<button
								onClick={stopFlowSession}
								className="bg-red-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-red-700 transition-colors"
							>
								End Session
							</button>
						</div>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-black text-white">
			{/* Header */}
			<div className="border-b border-gray-800 p-4">
				<div className="max-w-4xl mx-auto">
					<h1 className="text-2xl font-bold mb-2">Flow Task Launcher</h1>
					<p className="text-gray-400">
						Select a task to enter focused flow state. Block distractions and work with intention.
					</p>
				</div>
			</div>

			<div className="max-w-4xl mx-auto p-4">
				{tasks.length === 0 ? (
					<div className="text-center py-16">
						<div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
							<span className="text-4xl">📝</span>
						</div>
						<h2 className="text-3xl font-bold mb-4">No Tasks Available</h2>
						<p className="text-lg text-gray-400 mb-8">
							Complete the brain dump and organization process first to see your tasks here.
						</p>
						<button
							onClick={() => router.push('/brain-dump')}
							className="bg-white text-black font-bold py-4 px-8 rounded-lg text-xl hover:bg-gray-100 transition-colors"
						>
							Start Brain Dump
						</button>
					</div>
				) : (
					<div className="py-8">
						<div className="mb-8">
							<h2 className="text-2xl font-bold mb-4">Choose Your Focus Task</h2>
							<p className="text-gray-400">
								Select a task to enter flow state. Focus on one thing at a time for maximum productivity.
							</p>
						</div>

						<div className="grid md:grid-cols-2 gap-6">
							{tasks.map((task) => (
								<div
									key={task.id}
									className="bg-gray-900 border border-gray-700 rounded-lg p-6 hover:border-green-500 transition-colors cursor-pointer"
									onClick={() => startFlowSession(task)}
								>
									<div className="flex justify-between items-start mb-4">
										<div className="flex-1">
											<h3 className="text-lg font-semibold mb-2">{task.text}</h3>
											<div className="flex items-center space-x-4 text-sm text-gray-400">
												<span className={`px-2 py-1 rounded ${
													task.category === 'do-now' 
														? 'bg-green-900 text-green-300' 
														: 'bg-blue-900 text-blue-300'
												}`}>
													{task.category === 'do-now' ? 'Do Now' : 'Scheduled'}
												</span>
												<span>~{task.estimatedTime} min</span>
											</div>
										</div>
										<div className="text-green-400">
											<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
											</svg>
										</div>
									</div>
									<div className="text-sm text-gray-500">
										Click to start focused work session
									</div>
								</div>
							))}
						</div>

						<div className="mt-8 text-center">
							<button
								onClick={() => router.push('/brain-dump')}
								className="text-gray-400 hover:text-white transition-colors"
							>
								Add more tasks with another brain dump
							</button>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
