import Link from "next/link";
import { headers } from "next/headers";
import { whopSdk } from "@/lib/whop-sdk";

export default async function CompanyDashboard({
	params,
}: {
	params: Promise<{ companyId: string }>;
}) {
	const headersList = await headers();
	const { companyId } = await params;

	const { userId } = await whopSdk.verifyUserToken(headersList);
	const access = await whopSdk.access.checkIfUserHasAccessToCompany({
		userId,
		companyId,
	});

	const user = await whopSdk.users.getUser({ userId });
	const company = await whopSdk.companies.getCompany({ companyId });

	return (
		<div className="min-h-screen bg-gradient-to-br from-[#020617] via-[#0f172a] to-[#111827] text-white">
			<div className="mx-auto w-full max-w-6xl px-6 py-12 sm:px-10 lg:px-14">
				<header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
					<div>
						<div className="text-xs uppercase tracking-[0.3em] text-cyan-200">Lock-In Admin</div>
						<h1 className="mt-3 text-4xl font-semibold text-white">{company.title}</h1>
						<p className="mt-2 max-w-2xl text-base text-slate-300">
							Welcome back, {user.name}. Review member access and direct your community toward deep focus sessions.
						</p>
					</div>
					<span className="rounded-full border border-white/20 px-4 py-1.5 text-xs font-semibold text-slate-200">
						Access level: {access.accessLevel}
					</span>
				</header>

				<section className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
					<Link
						href="/lock-in"
						className="rounded-3xl border border-white/10 bg-white/5 p-6 transition hover:border-white/30"
					>
						<div className="text-xs uppercase tracking-[0.3em] text-slate-400">Guide</div>
						<div className="mt-3 text-xl font-semibold text-white">Start Lock-In</div>
						<p className="mt-2 text-sm text-slate-300">Lead creators through intention, stress, and guardrails.</p>
					</Link>
					<Link
						href="/focus"
						className="rounded-3xl border border-white/10 bg-white/5 p-6 transition hover:border-white/30"
					>
						<div className="text-xs uppercase tracking-[0.3em] text-slate-400">Sprint</div>
						<div className="mt-3 text-xl font-semibold text-white">Resume Focus</div>
						<p className="mt-2 text-sm text-slate-300">Drop directly into the active lock-in session.</p>
					</Link>
					<Link
						href="/logs"
						className="rounded-3xl border border-white/10 bg-white/5 p-6 transition hover:border-white/30"
					>
						<div className="text-xs uppercase tracking-[0.3em] text-slate-400">Archive</div>
						<div className="mt-3 text-xl font-semibold text-white">Session Logs</div>
						<p className="mt-2 text-sm text-slate-300">Review reflection summaries and completion streaks.</p>
					</Link>
					<Link
						href="/dashboard"
						className="rounded-3xl border border-white/10 bg-white/5 p-6 transition hover:border-white/30"
					>
						<div className="text-xs uppercase tracking-[0.3em] text-slate-400">Insights</div>
						<div className="mt-3 text-xl font-semibold text-white">Personal Dashboard</div>
						<p className="mt-2 text-sm text-slate-300">View guided answers and patterns of your focus practice.</p>
					</Link>
				</section>

				<section className="mt-12 grid gap-6 lg:grid-cols-3">
					<div className="rounded-3xl border border-white/10 bg-white/5 p-6">
						<div className="text-xs uppercase tracking-[0.3em] text-slate-400">Community Tips</div>
						<ul className="mt-4 space-y-2 text-sm text-slate-300">
							<li>Encourage members to capture a Lock-In before co-working calls.</li>
							<li>Share guardrail best practices to reduce distraction triggers.</li>
							<li>Use reflections to celebrate specific shipped outcomes.</li>
						</ul>
					</div>
					<div className="rounded-3xl border border-white/10 bg-white/5 p-6">
						<div className="text-xs uppercase tracking-[0.3em] text-slate-400">Your Profile</div>
						<p className="mt-4 text-sm text-slate-300">
							<span className="font-semibold text-white">{user.name}</span> (@{user.username})
						</p>
						<p className="mt-2 text-sm text-slate-300">Company ID: {companyId}</p>
					</div>
					<div className="rounded-3xl border border-white/10 bg-white/5 p-6">
						<div className="text-xs uppercase tracking-[0.3em] text-slate-400">Access Notes</div>
						<p className="mt-4 text-sm text-slate-300">
							Users marked as <span className="font-semibold text-white">admin</span> can manage company level integrations and lock-in experiences.
						</p>
					</div>
				</section>
			</div>
		</div>
	);
}
