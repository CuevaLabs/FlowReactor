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

    const [summary, setSummary] = useState('');
    const [distractions, setDistractions] = useState('');
    const [nextStep, setNextStep] = useState('');

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
        <div className="min-h-screen bg-black text-white">
            <div className="border-b border-gray-800 p-4">
                <div className="max-w-3xl mx-auto">
                    <h1 className="text-2xl font-bold">Reflection</h1>
                    <p className="text-gray-400">Close the loop and grow your awareness.</p>
                </div>
            </div>

            <div className="max-w-3xl mx-auto p-4 space-y-8">
                <section className="bg-gray-900 border border-gray-800 rounded-lg p-6 space-y-4">
                    <h2 className="text-lg font-semibold">What happened?</h2>
                    <textarea
                        value={summary}
                        onChange={(e) => setSummary(e.target.value)}
                        placeholder="Describe what you accomplished or learned."
                        className="w-full min-h-[140px] bg-black border border-gray-700 rounded-lg p-4 text-gray-100 focus:outline-none focus:border-green-400"
                    />
                    {alignmentScore !== undefined && (
                        <div className="text-sm text-gray-400">Estimated alignment with your intent: <span className="text-green-400 font-semibold">{alignmentScore}%</span></div>
                    )}
                </section>

                <section className="bg-gray-900 border border-gray-800 rounded-lg p-6 space-y-4">
                    <h2 className="text-lg font-semibold">What tried to pull you away?</h2>
                    <textarea
                        value={distractions}
                        onChange={(e) => setDistractions(e.target.value)}
                        placeholder="Noting distractions builds awareness."
                        className="w-full min-h-[100px] bg-black border border-gray-700 rounded-lg p-4 text-gray-100 focus:outline-none focus:border-green-400"
                    />
                </section>

                <section className="bg-gray-900 border border-gray-800 rounded-lg p-6 space-y-4">
                    <h2 className="text-lg font-semibold">What’s the next small step?</h2>
                    <input
                        value={nextStep}
                        onChange={(e) => setNextStep(e.target.value)}
                        placeholder="One concrete action to keep momentum."
                        className="w-full bg-black border border-gray-700 rounded-lg p-3 text-gray-100 focus:outline-none focus:border-green-400"
                    />
                </section>

                <div className="flex items-center justify-end">
                    <button
                        type="button"
                        onClick={handleSave}
                        disabled={!summary.trim()}
                        className={`px-6 py-3 rounded-lg font-bold ${summary.trim() ? 'bg-white text-black hover:bg-gray-100' : 'bg-gray-700 text-gray-400 cursor-not-allowed'}`}
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

