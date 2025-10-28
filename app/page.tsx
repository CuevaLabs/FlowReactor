export default function Page() {
	return (
		<div className="min-h-screen bg-black text-white flex items-center justify-center">
			<div className="text-center">
				<h1 className="text-6xl font-bold mb-4">Lock-In</h1>
				<p className="text-xl text-gray-300 mb-8">Guide your mind. Block distractions. Do the work.</p>
				<a
					href="/lock-in"
					className="bg-white text-black font-bold py-4 px-8 rounded-lg text-xl hover:bg-gray-100 transition-colors"
				>
					Start Lock-In
				</a>
			</div>
		</div>
	);
}