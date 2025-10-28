'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getSession, endSession, pauseSession, resumeSession, type FocusSession } from '@/lib/focus-session';

const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
};

export default function FocusOverlay() {
    const router = useRouter();
    const [session, setSession] = useState<FocusSession | null>(null);
    const [now, setNow] = useState<number>(Date.now());

    useEffect(() => {
        setSession(getSession());
        const onStorage = (e: StorageEvent) => {
            if (!e.key || e.key === 'focusSession') setSession(getSession());
        };
        window.addEventListener('storage', onStorage);
        const tick = setInterval(() => setNow(Date.now()), 1000);
        return () => {
            window.removeEventListener('storage', onStorage);
            clearInterval(tick);
        };
    }, []);

    const remaining = useMemo(() => {
        if (!session) return 0;
        if (session.paused) return session.remaining ?? 0;
        return Math.max(0, Math.floor((session.endAt - now) / 1000));
    }, [session, now]);

    useEffect(() => {
        if (session && !session.paused && remaining <= 0) {
            endSession();
            setSession(null);
        }
    }, [session, remaining]);

    if (!session) return null;

    return (
        <div className="fixed bottom-4 right-4 z-[1000]">
            <div className="bg-gray-900/95 border border-gray-700 rounded-xl shadow-lg p-3 flex items-center gap-3">
                <div className="text-right">
                    <div className="text-xl font-mono font-bold text-green-400">{formatTime(remaining)}</div>
                    <div className="text-[10px] uppercase tracking-widest text-gray-500 text-right">
                        {session.paused ? 'Paused' : 'Focusing'}
                    </div>
                </div>
                <div className="max-w-[220px] truncate text-gray-200" title={session.target}>
                    {session.target}
                </div>
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={() => (session.paused ? resumeSession() : pauseSession())}
                        className="px-2 py-1 rounded-md border border-gray-700 text-sm text-gray-200 hover:border-gray-500"
                    >
                        {session.paused ? 'Resume' : 'Pause'}
                    </button>
                    <button
                        type="button"
                        onClick={() => router.push('/focus')}
                        className="px-2 py-1 rounded-md bg-white text-black text-sm font-semibold hover:bg-gray-100"
                    >
                        Open
                    </button>
                    <button
                        type="button"
                        onClick={() => endSession()}
                        className="px-2 py-1 rounded-md bg-red-600 text-white text-sm hover:bg-red-700"
                    >
                        End
                    </button>
                </div>
            </div>
        </div>
    );
}


