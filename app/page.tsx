export default function Page() {
	return (
		<div className="min-h-screen bg-black text-white flex items-center justify-center">
			<div className="text-center">
				<h1 className="text-6xl font-bold mb-4">Brain Dump</h1>
				<p className="text-xl text-gray-300 mb-8">Clear Your Mind, Unlock Your Flow</p>
				<a
					href="/brain-dump"
					className="bg-white text-black font-bold py-4 px-8 rounded-lg text-xl hover:bg-gray-100 transition-colors"
				>
					Start Brain Dump
				</a>
			</div>
		</div>
	);
}