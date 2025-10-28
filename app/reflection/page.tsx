'use client';

import { Suspense, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getLog, addOrUpdateLog } from '@/lib/lockin-logs';
import { getIntake } from '@/lib/lockin-intake';

function ReflectionContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const sessionId = searchParams.get('sessionId') ?? '';
    const log = useMemo(() => (sessionId ? getLog(sessionId) : null), [sessionId]);
    const intake = useMemo(() => (log?.intakeId ? getIntake(log.intakeId) : null), [log?.intakeId]);

    const [summary, setSummary] = useState(() => log?.reflection?.summary ?? '');
    const [distractions, setDistractions] = useState(() => log?.reflection?.distractionsNoted ?? '');
    const [nextStep, setNextStep] = useState(() => log?.reflection?.nextStep ?? '');

    const alignmentScore = useMemo(() => {
        if (!intake || !summary) return undefined;
        // Naive alignment heuristic: length and shared word count
        try {
            const goal = (intake.q3_hour_goal || intake.q4_definition || '').toLowerCase();
            const got = summary.toLowerCase();
            if (!goal || !got) return undefined;
            const goalWords = new Set(goal.split(/[^a-z0-9]+/).filter(Boolean));
            const gotWords = new Set(got.split(/[^a-z0-9]+/).filter(Boolean));
            const intersect = [...goalWords].filter((w) => gotWords.has(w)).length;
            const denom = Math.max(1, goalWords.size);
            return Math.round(Math.min(100, (intersect / denom) * 100));
        } catch {
            return undefined;
        }
    }, [intake, summary]);

    const handleSave = () => {
        if (!log) {
            router.push('/lock-in');
            return;
        }
        addOrUpdateLog({
            ...log,
            reflection: {
                summary,
                distractionsNoted: distractions || undefined,
                nextStep: nextStep || undefined,
                createdAt: Date.now(),
            },
            insights: {
                alignmentScore,
                notes: alignmentScore !== undefined ? `Estimated alignment with intent: ${alignmentScore}%` : undefined,
            },
        });
        router.push('/logs');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#020617] via-[#0f172a] to-[#111827] text-white">
            <div className="mx-auto w-full max-w-4xl px-6 py-12 sm:px-10 lg:px-12">
                <header className="flex flex-col gap-3 border-b border-white/10 pb-6 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <div className="text-xs uppercase tracking-[0.3em] text-cyan-200">Integration</div>
                        <h1 className="mt-3 text-4xl font-semibold text-white">Lock-In Reflection</h1>
                        <p className="mt-2 max-w-2xl text-base text-slate-300">
                            Compare your intentions with what actually happened to build pattern awareness.
                        </p>
                    </div>
                    {alignmentScore !== undefined && (
                        <span className="rounded-full border border-cyan-400/40 px-4 py-1.5 text-sm font-semibold text-cyan-200">
                            Alignment {alignmentScore}%
                        </span>
                    )}
                </header>

                {intake && (
                    <section className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-6 text-sm text-slate-200">
                        <div className="text-xs uppercase tracking-[0.3em] text-slate-400">Your Intent Snapshot</div>
                        <div className="mt-4 grid gap-4 sm:grid-cols-2">
                            {(intake.q3_hour_goal || intake.q4_definition) && (
                                <div>
                                    <h3 className="text-sm font-semibold text-white">Sprint Target</h3>
                                    <p className="mt-1 text-slate-200">{intake.q3_hour_goal || intake.q4_definition}</p>
                                </div>
                            )}
                            {intake.q5_distractions && (
                                <div>
                                    <h3 className="text-sm font-semibold text-white">Expected Friction</h3>
                                    <p className="mt-1 text-slate-200">{intake.q5_distractions}</p>
                                </div>
                            )}
                            {intake.q6_avoid_plan && (
                                <div>
                                    <h3 className="text-sm font-semibold text-white">Protection Plan</h3>
                                    <p className="mt-1 text-slate-200">{intake.q6_avoid_plan}</p>
                                </div>
                            )}
                        </div>
                    </section>
                )}

                <section className="mt-10 space-y-8">
                    <div className="rounded-3xl border border-white/10 bg-slate-950/60 p-6 shadow-inner shadow-black/40 backdrop-blur">
                        <h2 className="text-lg font-semibold text-white">What actually happened?</h2>
                        <p className="mt-1 text-sm text-slate-400">
                            Capture the highlights, shipped work, and any key learnings from the sprint.
                        </p>
                        <textarea
                            value={summary}
                            onChange={(e) => setSummary(e.target.value)}
                            placeholder="I drafted three hero variations, aligned with yesterday's research, and queued feedback..."
                            className="mt-4 w-full min-h-[180px] rounded-2xl border border-transparent bg-slate-900/70 p-5 text-base text-slate-100 shadow-inner shadow-black/40 outline-none ring-2 ring-inset ring-white/10 transition focus:ring-cyan-400/60"
                        />
                    </div>

                    <div className="grid gap-6 lg:grid-cols-2">
                        <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
                            <h2 className="text-lg font-semibold text-white">What tried to pull you away?</h2>
                            <p className="mt-1 text-sm text-slate-400">
                                Logging friction builds awareness and resilience for the next lock-in.
                            </p>
                            <textarea
                                value={distractions}
                                onChange={(e) => setDistractions(e.target.value)}
                                placeholder="Slack pings, urge to tweak color palette, DM from cofounder..."
                                className="mt-4 w-full min-h-[140px] rounded-2xl border border-transparent bg-slate-900/70 p-5 text-base text-slate-100 shadow-inner shadow-black/40 outline-none ring-2 ring-inset ring-white/10 transition focus:ring-cyan-400/60"
                            />
                        </div>

                        <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
                            <h2 className="text-lg font-semibold text-white">What’s your next micro step?</h2>
                            <p className="mt-1 text-sm text-slate-400">
                                Define the smallest meaningful move to keep momentum alive.
                            </p>
                            <input
                                value={nextStep}
                                onChange={(e) => setNextStep(e.target.value)}
                                placeholder="Share final copy doc with design partner..."
                                className="mt-4 w-full rounded-2xl border border-transparent bg-slate-900/70 p-4 text-base text-slate-100 outline-none ring-2 ring-inset ring-white/10 transition focus:ring-cyan-400/60"
                            />
                        </div>
                    </div>
                </section>

                <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 text-sm text-slate-300 sm:flex-row">
                    <button
                        type="button"
                        onClick={() => router.push('/focus')}
                        className="rounded-full border border-white/20 px-5 py-2 font-semibold text-slate-200 transition hover:border-white/40"
                    >
                        Back to Focus
                    </button>
                    <button
                        type="button"
                        onClick={handleSave}
                        disabled={!summary.trim()}
                        className={`rounded-full px-6 py-2 font-semibold ${
                            summary.trim()
                                ? 'bg-cyan-400 text-slate-900 shadow-lg shadow-cyan-400/40 transition hover:bg-cyan-300'
                                : 'bg-white/10 text-slate-400 cursor-not-allowed'
                        }`}
                    >
                        Save Reflection
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function ReflectionPage() {
    return (
        <Suspense
            fallback={
                <div className="min-h-screen bg-black text-white flex items-center justify-center">
                    <div className="text-gray-400 text-sm uppercase tracking-widest">Loading reflection...</div>
                </div>
            }
        >
            <ReflectionContent />
        </Suspense>
    );
}
