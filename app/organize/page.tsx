'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface ThoughtItem {
	id: string;
	text: string;
	category: 'do-now' | 'schedule' | 'delete' | 'delegate' | 'uncategorized';
}

export default function OrganizePage() {
	const [thoughts, setThoughts] = useState<ThoughtItem[]>([]);
	const [draggedItem, setDraggedItem] = useState<string | null>(null);
	const router = useRouter();

	useEffect(() => {
		// Get brain dump content from localStorage
		if (typeof window !== 'undefined') {
			const content = localStorage.getItem('brainDumpContent');
			if (content) {
				// Split content into individual thoughts/items
				const items = content
					.split(/[.\n!?]/)
					.map((item, index) => ({
						id: `thought-${index}`,
						text: item.trim(),
						category: 'uncategorized' as const
					}))
					.filter(item => item.text.length > 3); // Filter out very short items
				
				setThoughts(items);
			}
		}
	}, []);

	const handleDragStart = (e: React.DragEvent, itemId: string) => {
		setDraggedItem(itemId);
		e.dataTransfer.effectAllowed = 'move';
	};

	const handleDragOver = (e: React.DragEvent) => {
		e.preventDefault();
		e.dataTransfer.dropEffect = 'move';
	};

	const handleDrop = (e: React.DragEvent, category: ThoughtItem['category']) => {
		e.preventDefault();
		if (draggedItem) {
			setThoughts(prev => 
				prev.map(item => 
					item.id === draggedItem 
						? { ...item, category }
						: item
				)
			);
			setDraggedItem(null);
		}
	};

	const getCategoryStats = () => {
		const stats = {
			'do-now': thoughts.filter(t => t.category === 'do-now').length,
			'schedule': thoughts.filter(t => t.category === 'schedule').length,
			'delete': thoughts.filter(t => t.category === 'delete').length,
			'delegate': thoughts.filter(t => t.category === 'delegate').length,
			'uncategorized': thoughts.filter(t => t.category === 'uncategorized').length
		};
		return stats;
	};

	const stats = getCategoryStats();
	const totalThoughts = thoughts.length;
	const categorizedCount = totalThoughts - stats.uncategorized;
	const progressPercent =
		totalThoughts === 0 ? 0 : (categorizedCount / totalThoughts) * 100;
	const allCategorized = stats.uncategorized === 0;

	const handleComplete = () => {
		// Store organized thoughts
		if (typeof window !== 'undefined') {
			localStorage.setItem('organizedThoughts', JSON.stringify(thoughts));
		}
		router.push('/reset');
	};

	return (
		<div className="min-h-screen bg-black text-white">
			{/* Header */}
			<div className="border-b border-gray-800 p-4">
				<div className="max-w-6xl mx-auto">
					<h1 className="text-2xl font-bold mb-2">Organize Your RAM</h1>
					<p className="text-gray-400">
						Drag each thought into one of four categories. This is Step 2 of the Mental RAM Reset.
					</p>
				</div>
			</div>

			<div className="max-w-6xl mx-auto p-4">
				{/* Progress */}
				<div className="mb-8">
					<div className="flex justify-between items-center mb-2">
							<span className="text-sm text-gray-400">Organization Progress</span>
							<span className="text-sm text-gray-400">
								{categorizedCount} / {thoughts.length} categorized
							</span>
						</div>
						<div className="w-full bg-gray-800 rounded-full h-2">
							<div 
								className="bg-green-500 h-2 rounded-full transition-all duration-300"
								style={{ width: `${progressPercent}%` }}
							/>
					</div>
				</div>

				{/* Categories */}
				<div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
					{/* Do Now */}
					<div
						className="bg-green-900/20 border-2 border-green-500 rounded-lg p-4 min-h-64"
						onDragOver={handleDragOver}
						onDrop={(e) => handleDrop(e, 'do-now')}
					>
						<div className="text-center mb-4">
							<div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-2">
								<span className="text-xl">⚡</span>
							</div>
							<h3 className="font-bold text-green-400">Do Now</h3>
							<p className="text-sm text-gray-400">Under 2 minutes</p>
							<div className="text-2xl font-bold text-green-400 mt-2">{stats['do-now']}</div>
						</div>
						<div className="space-y-2">
							{thoughts.filter(t => t.category === 'do-now').map(item => (
								<div key={item.id} className="bg-green-900/30 p-2 rounded text-sm">
									{item.text}
								</div>
							))}
						</div>
					</div>

					{/* Schedule */}
					<div
						className="bg-blue-900/20 border-2 border-blue-500 rounded-lg p-4 min-h-64"
						onDragOver={handleDragOver}
						onDrop={(e) => handleDrop(e, 'schedule')}
					>
						<div className="text-center mb-4">
							<div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-2">
								<span className="text-xl">📅</span>
							</div>
							<h3 className="font-bold text-blue-400">Schedule</h3>
							<p className="text-sm text-gray-400">Plan for later</p>
							<div className="text-2xl font-bold text-blue-400 mt-2">{stats.schedule}</div>
						</div>
						<div className="space-y-2">
							{thoughts.filter(t => t.category === 'schedule').map(item => (
								<div key={item.id} className="bg-blue-900/30 p-2 rounded text-sm">
									{item.text}
								</div>
							))}
						</div>
					</div>

					{/* Delete */}
					<div
						className="bg-red-900/20 border-2 border-red-500 rounded-lg p-4 min-h-64"
						onDragOver={handleDragOver}
						onDrop={(e) => handleDrop(e, 'delete')}
					>
						<div className="text-center mb-4">
							<div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-2">
								<span className="text-xl">🗑️</span>
							</div>
							<h3 className="font-bold text-red-400">Delete</h3>
							<p className="text-sm text-gray-400">Not important</p>
							<div className="text-2xl font-bold text-red-400 mt-2">{stats.delete}</div>
						</div>
						<div className="space-y-2">
							{thoughts.filter(t => t.category === 'delete').map(item => (
								<div key={item.id} className="bg-red-900/30 p-2 rounded text-sm">
									{item.text}
								</div>
							))}
						</div>
					</div>

					{/* Delegate */}
					<div
						className="bg-yellow-900/20 border-2 border-yellow-500 rounded-lg p-4 min-h-64"
						onDragOver={handleDragOver}
						onDrop={(e) => handleDrop(e, 'delegate')}
					>
						<div className="text-center mb-4">
							<div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-2">
								<span className="text-xl">👥</span>
							</div>
							<h3 className="font-bold text-yellow-400">Delegate</h3>
							<p className="text-sm text-gray-400">Ask someone else</p>
							<div className="text-2xl font-bold text-yellow-400 mt-2">{stats.delegate}</div>
						</div>
						<div className="space-y-2">
							{thoughts.filter(t => t.category === 'delegate').map(item => (
								<div key={item.id} className="bg-yellow-900/30 p-2 rounded text-sm">
									{item.text}
								</div>
							))}
						</div>
					</div>
				</div>

				{/* Uncategorized Items */}
				{stats.uncategorized > 0 && (
					<div className="mb-8">
						<h3 className="text-xl font-bold mb-4 text-gray-300">Drag these items to categories:</h3>
						<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
							{thoughts.filter(t => t.category === 'uncategorized').map(item => (
								<div
									key={item.id}
									draggable
									onDragStart={(e) => handleDragStart(e, item.id)}
									className="bg-gray-800 border border-gray-600 rounded-lg p-4 cursor-move hover:bg-gray-700 transition-colors"
								>
									{item.text}
								</div>
							))}
						</div>
					</div>
				)}

				{/* Complete Button */}
				{allCategorized && (
					<div className="text-center">
						<button
							onClick={handleComplete}
							className="bg-white text-black font-bold py-4 px-8 rounded-lg text-xl hover:bg-gray-100 transition-colors"
						>
							Complete Organization
						</button>
						<p className="text-gray-400 mt-4">
							Great! All thoughts are organized. Now let's reset your mental state.
						</p>
					</div>
				)}
			</div>
		</div>
	);
}
