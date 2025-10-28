'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
	addOrUpdateLog,
	getLog,
	type SessionLog,
} from '@/lib/lockin-logs';
import { endSession, pauseSession, resumeSession, useFocusSession } from '@/lib/focus-session';

const formatTime = (secs: number) => {
	const minutes = Math.floor(secs / 60);
	const seconds = secs % 60;
	return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

export default function FocusOverlay() {
	const router = useRouter();
	const session = useFocusSession();
	const [now, setNow] = useState<number>(Date.now());
	const finishing = useRef<boolean>(false);

	useEffect(() => {
		const tick = setInterval(() => setNow(Date.now()), 1000);
		return () => clearInterval(tick);
	}, []);

	const remaining = useMemo(() => {
		if (!session) return 0;
		if (session.paused) {
			if (typeof session.remaining === 'number') return Math.max(0, session.remaining);
		}
		return Math.max(0, Math.floor((session.endAt - now) / 1000));
	}, [session, now]);

	useEffect(() => {
		if (!session || session.paused || remaining > 0 || finishing.current) return;

		finishing.current = true;
		const existing = getLog(session.sessionId);
		const payload: SessionLog = {
			sessionId: session.sessionId,
			intakeId: session.intakeId,
			target: session.target,
			startAt: session.startAt,
			endAt: Date.now(),
			lengthMinutes: session.lengthMinutes,
			completed: true,
		};

		if (existing?.reflection) {
			payload.reflection = existing.reflection;
			payload.insights = existing.insights;
		}

	addOrUpdateLog(payload);
	endSession();
		setTimeout(() => {
			router.push(session.intakeId ? `/reflection?sessionId=${session.sessionId}` : '/reflection');
			finishing.current = false;
		}, 0);
	}, [remaining, router, session]);

	if (!session) return null;

	return (
		<div className="fixed bottom-5 right-5 z-[1000] max-w-sm">
			<div className="flex items-center gap-4 rounded-3xl border border-white/15 bg-slate-950/90 px-4 py-3 text-sm text-slate-200 shadow-lg shadow-black/40 backdrop-blur">
				<div className="text-right">
					<div className="font-mono text-2xl font-semibold text-cyan-300">
						{formatTime(remaining)}
					</div>
					<div className="text-[10px] uppercase tracking-[0.3em] text-slate-500">
						{session.paused ? 'Paused' : 'Active'}
					</div>
				</div>
				<div className="min-w-0 flex-1">
					<div className="truncate font-semibold text-white" title={session.target}>
						{session.target}
					</div>
					<div className="text-xs text-slate-400">
						{session.lengthMinutes} min sprint
					</div>
				</div>
				<div className="flex flex-col gap-2">
					<button
						type="button"
						onClick={() => {
							if (!session) return;
							if (session.paused) resumeSession();
							else pauseSession();
						}}
						className="rounded-full border border-white/20 px-3 py-1 text-xs font-semibold text-slate-200 transition hover:border-white/40"
					>
						{session.paused ? 'Resume' : 'Pause'}
					</button>
					<button
						type="button"
						onClick={() => router.push('/focus')}
						className="rounded-full bg-cyan-400 px-3 py-1 text-xs font-semibold text-slate-900 shadow shadow-cyan-400/40 transition hover:bg-cyan-300"
					>
						Open
					</button>
				</div>
			</div>
		</div>
	);
}
