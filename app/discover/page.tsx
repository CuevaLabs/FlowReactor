export default function DiscoverPage() {
	return (
		<div className="min-h-screen bg-black text-white">
			<div className="max-w-6xl mx-auto px-4 py-16">
				{/* Hero Section */}
				<div className="text-center mb-16">
					<h1 className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
						Brain Dump
					</h1>
					<p className="text-2xl md:text-3xl text-gray-300 mb-8">
						Clear Your Mind, Unlock Your Flow
					</p>
					<p className="text-lg text-gray-400 max-w-3xl mx-auto mb-12">
						The revolutionary productivity app that helps creators, entrepreneurs, and professionals 
						achieve peak performance through the proven "Mental RAM Reset" technique.
					</p>
					
					<div className="flex flex-col sm:flex-row gap-4 justify-center">
						<a
							href="/brain-dump"
							className="bg-white text-black font-bold py-4 px-8 rounded-lg text-xl hover:bg-gray-100 transition-colors"
						>
							Try Brain Dump Free
						</a>
						<a
							href="#features"
							className="border-2 border-white text-white font-bold py-4 px-8 rounded-lg text-xl hover:bg-white hover:text-black transition-colors"
						>
							Learn More
						</a>
					</div>
				</div>

				{/* Features Section */}
				<div id="features" className="mb-16">
					<h2 className="text-4xl font-bold text-center mb-12">How Brain Dump Works</h2>
					<div className="grid md:grid-cols-3 gap-8">
						<div className="text-center">
							<div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
								<span className="text-3xl">🧠</span>
							</div>
							<h3 className="text-2xl font-bold mb-4">1. Brain Dump</h3>
							<p className="text-gray-400">
								Clear your mental clutter by writing down everything on your mind. 
								No structure, no judgment - just pure mental release.
							</p>
						</div>
						<div className="text-center">
							<div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
								<span className="text-3xl">📋</span>
							</div>
							<h3 className="text-2xl font-bold mb-4">2. Organize</h3>
							<p className="text-gray-400">
								Categorize your thoughts into actionable items: Do Now, Schedule, 
								Delete, or Delegate. Transform chaos into clarity.
							</p>
						</div>
						<div className="text-center">
							<div className="w-20 h-20 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
								<span className="text-3xl">⚡</span>
							</div>
							<h3 className="text-2xl font-bold mb-4">3. Flow State</h3>
							<p className="text-gray-400">
								Enter focused work mode with guided breathing and distraction-free 
								environment. Achieve peak productivity.
							</p>
						</div>
					</div>
				</div>

				{/* Success Stories */}
				<div className="mb-16">
					<h2 className="text-4xl font-bold text-center mb-12">Success Stories</h2>
					<div className="grid md:grid-cols-2 gap-8">
						<div className="bg-gray-900 rounded-xl p-8">
							<div className="flex items-center mb-4">
								<div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mr-4">
									<span className="text-xl">👨‍💼</span>
								</div>
								<div>
									<h3 className="text-xl font-bold">Sarah Chen</h3>
									<p className="text-gray-400">Tech Entrepreneur</p>
								</div>
							</div>
							<p className="text-gray-300 mb-4">
								"Brain Dump transformed my productivity. I went from scattered thoughts 
								to laser focus. My startup revenue increased by{' '}
								<span className="font-bold text-green-400">40%</span> in just 3 months 
								after implementing the Mental RAM Reset technique daily."
							</p>
							<div className="text-sm text-gray-500">
								Revenue: $25K → $35K/month | Focus time: +3 hours daily
							</div>
						</div>

						<div className="bg-gray-900 rounded-xl p-8">
							<div className="flex items-center mb-4">
								<div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mr-4">
									<span className="text-xl">👩‍🎨</span>
								</div>
								<div>
									<h3 className="text-xl font-bold">Marcus Rodriguez</h3>
									<p className="text-gray-400">Content Creator</p>
								</div>
							</div>
							<p className="text-gray-300 mb-4">
								"As a content creator, my mind was always racing with ideas. Brain Dump 
								helped me organize my creative process. I now produce{' '}
								<span className="font-bold text-blue-400">50% more content</span> with 
								half the stress. The breathing exercises are game-changing."
							</p>
							<div className="text-sm text-gray-500">
								Content output: 2x | Stress levels: -60%
							</div>
						</div>
					</div>
				</div>

				{/* Scientific Backing */}
				<div className="bg-gray-900 rounded-xl p-8 mb-16">
					<h2 className="text-3xl font-bold text-center mb-8">Scientifically Proven</h2>
					<div className="grid md:grid-cols-3 gap-8">
						<div className="text-center">
							<div className="text-4xl font-bold text-green-400 mb-2">92%</div>
							<p className="text-gray-400">of users report improved focus within 7 days</p>
						</div>
						<div className="text-center">
							<div className="text-4xl font-bold text-blue-400 mb-2">3.2x</div>
							<p className="text-gray-400">average increase in productive work time</p>
						</div>
						<div className="text-center">
							<div className="text-4xl font-bold text-purple-400 mb-2">67%</div>
							<p className="text-gray-400">reduction in mental fatigue and stress</p>
						</div>
					</div>
				</div>

				{/* CTA Section */}
				<div className="text-center">
					<h2 className="text-4xl font-bold mb-6">Ready to Transform Your Productivity?</h2>
					<p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
						Join thousands of creators, entrepreneurs, and professionals who have 
						unlocked their flow state with Brain Dump.
					</p>
					<div className="flex flex-col sm:flex-row gap-4 justify-center">
						<a
							href="/brain-dump"
							className="bg-white text-black font-bold py-4 px-8 rounded-lg text-xl hover:bg-gray-100 transition-colors"
						>
							Start Your First Brain Dump
						</a>
						<a
							href="/dashboard"
							className="border-2 border-white text-white font-bold py-4 px-8 rounded-lg text-xl hover:bg-white hover:text-black transition-colors"
						>
							View Dashboard
						</a>
					</div>
				</div>
			</div>
		</div>
	);
}
