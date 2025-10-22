import { whopSdk } from "@/lib/whop-sdk";
import { headers } from "next/headers";
import Link from "next/link";

export default async function DashboardPage({
	params,
}: {
	params: Promise<{ companyId: string }>;
}) {
	// The headers contains the user token
	const headersList = await headers();

	// The companyId is a path param
	const { companyId } = await params;

	// The user token is in the headers
	const { userId } = await whopSdk.verifyUserToken(headersList);

	const result = await whopSdk.access.checkIfUserHasAccessToCompany({
		userId,
		companyId,
	});

	const user = await whopSdk.users.getUser({ userId });
	const company = await whopSdk.companies.getCompany({ companyId });

	// Either: 'admin' | 'no_access';
	// 'admin' means the user is an admin of the company, such as an owner or moderator
	// 'no_access' means the user is not an authorized member of the company
	const { accessLevel } = result;

	return (
		<div className="min-h-screen bg-black text-white">
			{/* Header */}
			<div className="border-b border-gray-800 p-4">
				<div className="max-w-6xl mx-auto">
					<h1 className="text-2xl font-bold mb-2">Brain Dump Dashboard</h1>
					<p className="text-gray-400">
						Welcome back, {user.name}! Manage your cognitive load and maintain flow state.
					</p>
				</div>
			</div>

			<div className="max-w-6xl mx-auto p-4">
				{/* Quick Actions */}
				<div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
					<Link
						href="/brain-dump"
						className="bg-green-900/20 border border-green-500 rounded-lg p-6 hover:bg-green-900/30 transition-colors"
					>
						<div className="text-center">
							<div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
								<span className="text-2xl">🧠</span>
							</div>
							<h3 className="font-bold text-green-400 mb-2">Brain Dump</h3>
							<p className="text-sm text-gray-400">Clear mental clutter</p>
						</div>
					</Link>

					<Link
						href="/flow"
						className="bg-blue-900/20 border border-blue-500 rounded-lg p-6 hover:bg-blue-900/30 transition-colors"
					>
						<div className="text-center">
							<div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
								<span className="text-2xl">⚡</span>
							</div>
							<h3 className="font-bold text-blue-400 mb-2">Flow Mode</h3>
							<p className="text-sm text-gray-400">Enter focused work</p>
						</div>
					</Link>

					<Link
						href="/reset"
						className="bg-purple-900/20 border border-purple-500 rounded-lg p-6 hover:bg-purple-900/30 transition-colors"
					>
						<div className="text-center">
							<div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
								<span className="text-2xl">🧘</span>
							</div>
							<h3 className="font-bold text-purple-400 mb-2">Reset</h3>
							<p className="text-sm text-gray-400">Breathing exercise</p>
						</div>
					</Link>

					<Link
						href="/organize"
						className="bg-yellow-900/20 border border-yellow-500 rounded-lg p-6 hover:bg-yellow-900/30 transition-colors"
					>
						<div className="text-center">
							<div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
								<span className="text-2xl">📋</span>
							</div>
							<h3 className="font-bold text-yellow-400 mb-2">Organize</h3>
							<p className="text-sm text-gray-400">Categorize thoughts</p>
						</div>
					</Link>
				</div>

				{/* Cognitive Load Maintenance */}
				<div className="bg-gray-900 rounded-lg p-6 mb-8">
					<h2 className="text-xl font-bold mb-4">Cognitive Load Maintenance</h2>
					<div className="grid md:grid-cols-3 gap-6">
						<div>
							<h3 className="font-semibold text-green-400 mb-2">Daily Reset</h3>
							<p className="text-sm text-gray-400 mb-4">
								Perform the Mental RAM Reset daily to maintain optimal cognitive performance.
							</p>
							<div className="space-y-2">
								<div className="flex items-center text-sm">
									<span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
									<span>Clear working memory</span>
								</div>
								<div className="flex items-center text-sm">
									<span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
									<span>Close open loops</span>
								</div>
								<div className="flex items-center text-sm">
									<span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
									<span>Eliminate need to remember</span>
								</div>
							</div>
						</div>

						<div>
							<h3 className="font-semibold text-blue-400 mb-2">Flow Sessions</h3>
							<p className="text-sm text-gray-400 mb-4">
								Track your focused work sessions and flow state achievements.
							</p>
							<div className="text-2xl font-bold text-blue-400 mb-2">0</div>
							<div className="text-sm text-gray-400">Sessions today</div>
						</div>

						<div>
							<h3 className="font-semibold text-purple-400 mb-2">Mental Clarity</h3>
							<p className="text-sm text-gray-400 mb-4">
								Monitor your cognitive load and stress levels throughout the day.
							</p>
							<div className="text-2xl font-bold text-purple-400 mb-2">Optimal</div>
							<div className="text-sm text-gray-400">Current state</div>
						</div>
					</div>
				</div>

				{/* Recent Activity */}
				<div className="bg-gray-900 rounded-lg p-6">
					<h2 className="text-xl font-bold mb-4">Recent Activity</h2>
					<div className="space-y-4">
						<div className="flex items-center justify-between py-2 border-b border-gray-800">
							<div className="flex items-center">
								<div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
								<span className="text-sm">Welcome to Brain Dump!</span>
							</div>
							<span className="text-xs text-gray-400">Just now</span>
						</div>
						<div className="text-center py-8 text-gray-500">
							<p>Complete your first brain dump to see activity here</p>
						</div>
					</div>
				</div>

				{/* User Info */}
				<div className="mt-8 p-4 bg-gray-800 rounded-lg">
					<div className="text-sm text-gray-400">
						<p>User: <strong className="text-white">{user.name}</strong> (@{user.username})</p>
						<p>Company: <strong className="text-white">{company.title}</strong></p>
						<p>Access Level: <strong className="text-white">{accessLevel}</strong></p>
					</div>
				</div>
			</div>
		</div>
	);
}
