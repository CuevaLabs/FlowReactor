'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ResetPage() {
	const [phase, setPhase] = useState<'preparation' | 'breathing' | 'complete'>('preparation');
	const [breathCount, setBreathCount] = useState(0);
	const [isBreathing, setIsBreathing] = useState(false);
	const [breathPhase, setBreathPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
	const [timeRemaining, setTimeRemaining] = useState(0);
	const [reflectionSummary, setReflectionSummary] = useState<string | null>(null);
	const router = useRouter();

	const breathingSequence = [
		{ phase: 'inhale', duration: 3, instruction: 'Breathe in slowly' },
		{ phase: 'hold', duration: 2, instruction: 'Hold your breath' },
		{ phase: 'exhale', duration: 10, instruction: 'Breathe out slowly' }
	];

	useEffect(() => {
		let interval: NodeJS.Timeout;
		if (isBreathing && timeRemaining > 0) {
			interval = setInterval(() => {
				setTimeRemaining(prev => prev - 1);
			}, 1000);
		} else if (isBreathing && timeRemaining === 0) {
			// Move to next phase or complete cycle
			const currentIndex = breathingSequence.findIndex(seq => seq.phase === breathPhase);
			if (currentIndex < breathingSequence.length - 1) {
				const nextPhase = breathingSequence[currentIndex + 1];
				setBreathPhase(nextPhase.phase as 'inhale' | 'hold' | 'exhale');
				setTimeRemaining(nextPhase.duration);
			} else {
				// Complete one breath cycle
				setBreathCount(prev => prev + 1);
				if (breathCount + 1 >= 3) {
					// Complete all 3 cycles
					setIsBreathing(false);
					setPhase('complete');
				} else {
					// Start next cycle
					setBreathPhase('inhale');
					setTimeRemaining(3);
				}
			}
		}
		return () => clearInterval(interval);
	}, [isBreathing, timeRemaining, breathPhase, breathCount]);

	useEffect(() => {
		if (typeof window === 'undefined') {
			return;
		}
		const content = localStorage.getItem('postFocusDumpContent');
		if (content && content.trim().length > 0) {
			setReflectionSummary(content.trim());
		}
	}, []);

	const startBreathing = () => {
		setPhase('breathing');
		setIsBreathing(true);
		setBreathPhase('inhale');
		setTimeRemaining(3);
		setBreathCount(0);
	};

	const skipBreathing = () => {
		router.push('/flow');
	};

	const getCircleSize = () => {
		if (!isBreathing) return 200;
		
		const maxSize = 300;
		const minSize = 100;
		const progress = (breathingSequence.find(seq => seq.phase === breathPhase)?.duration || 3) - timeRemaining;
		const totalDuration = breathingSequence.find(seq => seq.phase === breathPhase)?.duration || 3;
		const ratio = progress / totalDuration;
		
		if (breathPhase === 'inhale') {
			return minSize + (maxSize - minSize) * ratio;
		} else if (breathPhase === 'exhale') {
			return maxSize - (maxSize - minSize) * ratio;
		} else {
			return maxSize;
		}
	};

	const getCircleColor = () => {
		if (breathPhase === 'inhale') return 'bg-green-500';
		if (breathPhase === 'hold') return 'bg-yellow-500';
		return 'bg-blue-500';
	};

	const handleComplete = () => {
		router.push('/flow');
	};

	return (
		<div className="min-h-screen bg-black text-white">
			{/* Header */}
			<div className="border-b border-gray-800 p-4">
				<div className="max-w-4xl mx-auto">
					<h1 className="text-2xl font-bold mb-2">Release and Reset</h1>
					<p className="text-gray-400">
						Step 3: Activate your parasympathetic nervous system with guided breathing
					</p>
				</div>
			</div>

			<div className="max-w-4xl mx-auto p-4">
				{phase === 'preparation' && (
					<div className="text-center py-16">
						<div className="mb-8">
							<div className="w-24 h-24 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
								<span className="text-4xl">🧘</span>
							</div>
							<h2 className="text-3xl font-bold mb-4">Prepare for Reset</h2>
							<p className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto">
								You've organized your thoughts. Now let's reset your mental state with a 
								proven breathing technique that activates your parasympathetic nervous system.
							</p>
						</div>

						<div className="bg-gray-900 rounded-lg p-8 mb-8 max-w-2xl mx-auto">
							<h3 className="text-xl font-bold mb-4">The 3-Breath Reset</h3>
							<div className="space-y-4 text-left">
								<div className="flex items-center">
									<div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-4">
										<span className="text-white font-bold">1</span>
									</div>
									<span>Breathe in slowly for 3 seconds</span>
								</div>
								<div className="flex items-center">
									<div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center mr-4">
										<span className="text-white font-bold">2</span>
									</div>
									<span>Hold your breath for 2 seconds</span>
								</div>
								<div className="flex items-center">
									<div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-4">
										<span className="text-white font-bold">3</span>
									</div>
									<span>Breathe out slowly for 10 seconds</span>
								</div>
							</div>
							<p className="text-sm text-gray-400 mt-4">
								Repeat this cycle 3 times to fully activate your relaxation response.
							</p>
						</div>

						{reflectionSummary && (
							<div className="bg-gray-900 rounded-lg p-6 mb-8 max-w-2xl mx-auto text-left">
								<h3 className="text-sm uppercase tracking-widest text-gray-500 mb-2">
									Your last reflection
								</h3>
								<p className="text-gray-200 whitespace-pre-wrap leading-relaxed">
									{reflectionSummary.length > 320
										? `${reflectionSummary.slice(0, 320)}...`
										: reflectionSummary}
								</p>
								<p className="text-sm text-gray-500 mt-3">
									Let these thoughts settle while you reset your nervous system. You can always revisit them later.
								</p>
							</div>
						)}

						<button
							onClick={startBreathing}
							className="bg-purple-600 text-white font-bold py-4 px-8 rounded-lg text-xl hover:bg-purple-700 transition-colors"
						>
							Start Breathing Exercise
						</button>
						<button
							onClick={skipBreathing}
							className="block mx-auto text-gray-400 hover:text-white transition-colors mt-4"
						>
							Skip breathing and jump to flow
						</button>
					</div>
				)}

				{phase === 'breathing' && (
					<div className="text-center py-16">
						<div className="mb-8">
							<h2 className="text-3xl font-bold mb-4">Breathe with the Circle</h2>
							<p className="text-lg text-gray-400 mb-8">
								Follow the circle's movement. {breathCount + 1} of 3 cycles complete.
							</p>
						</div>

						{/* Breathing Circle */}
						<div className="flex justify-center items-center mb-8">
							<div
								className={`${getCircleColor()} rounded-full transition-all duration-1000 ease-in-out flex items-center justify-center text-black font-bold text-2xl`}
								style={{
									width: getCircleSize(),
									height: getCircleSize()
								}}
							>
								{timeRemaining}
							</div>
						</div>

						{/* Instructions */}
						<div className="mb-8">
							<h3 className="text-2xl font-bold mb-2">
								{breathingSequence.find(seq => seq.phase === breathPhase)?.instruction}
							</h3>
							<div className="text-4xl font-mono font-bold text-gray-300">
								{timeRemaining}
							</div>
						</div>

						{/* Progress */}
						<div className="w-full max-w-md mx-auto">
							<div className="flex justify-between text-sm text-gray-400 mb-2">
								<span>Cycle {breathCount + 1} of 3</span>
								<span>{breathPhase.charAt(0).toUpperCase() + breathPhase.slice(1)}</span>
							</div>
							<div className="w-full bg-gray-800 rounded-full h-2">
								<div 
									className="bg-purple-500 h-2 rounded-full transition-all duration-1000"
									style={{ 
										width: `${((breathCount * 3 + (3 - timeRemaining)) / 9) * 100}%` 
									}}
								/>
							</div>
						</div>
						<button
							onClick={skipBreathing}
							className="mt-10 text-gray-400 hover:text-white transition-colors"
						>
							Skip to flow state
						</button>
					</div>
				)}

				{phase === 'complete' && (
					<div className="text-center py-16">
						<div className="mb-8">
							<div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
								<span className="text-4xl">✨</span>
							</div>
							<h2 className="text-3xl font-bold mb-4">Reset Complete!</h2>
							<p className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto">
								Your parasympathetic nervous system is now activated. You've successfully 
								cleared your mental RAM and reset your cognitive state. Ready to enter flow?
							</p>
						</div>

						<div className="bg-gray-900 rounded-lg p-8 mb-8 max-w-2xl mx-auto">
							<h3 className="text-xl font-bold mb-4">What You've Accomplished</h3>
							<div className="space-y-2 text-left">
								<div className="flex items-center text-green-400">
									<span className="mr-2">✅</span>
									<span>Cleared mental clutter through brain dump</span>
								</div>
								<div className="flex items-center text-green-400">
									<span className="mr-2">✅</span>
									<span>Organized thoughts into actionable categories</span>
								</div>
								<div className="flex items-center text-green-400">
									<span className="mr-2">✅</span>
									<span>Activated relaxation response through breathing</span>
								</div>
								<div className="flex items-center text-green-400">
									<span className="mr-2">✅</span>
									<span>Reset your cognitive state for optimal focus</span>
								</div>
							</div>
						</div>

						{reflectionSummary && (
							<div className="bg-gray-900 rounded-lg p-6 mb-8 max-w-2xl mx-auto text-left">
								<h3 className="text-sm uppercase tracking-widest text-gray-500 mb-2">
									What you captured afterwards
								</h3>
								<p className="text-gray-200 whitespace-pre-wrap leading-relaxed">
									{reflectionSummary.length > 320
										? `${reflectionSummary.slice(0, 320)}...`
										: reflectionSummary}
								</p>
							</div>
						)}

						<button
							onClick={handleComplete}
							className="bg-white text-black font-bold py-4 px-8 rounded-lg text-xl hover:bg-gray-100 transition-colors"
						>
							Enter Flow State
						</button>
					</div>
				)}
			</div>
		</div>
	);
}
