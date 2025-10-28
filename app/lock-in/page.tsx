'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { saveIntake, type IntakeAnswers } from '@/lib/lockin-intake';
import { startSession } from '@/lib/focus-session';

type StepKey = keyof Pick<
    IntakeAnswers,
    'q1_mind' | 'q2_stress' | 'q3_hour_goal' | 'q4_definition' | 'q5_distractions' | 'q6_avoid_plan'
>;

const steps: { key: StepKey; title: string; placeholder: string }[] = [
    { key: 'q1_mind', title: "What's on your mind right now?", placeholder: "Write freely..." },
    { key: 'q2_stress', title: "What's been stressing you?", placeholder: "Be honest, name it..." },
    { key: 'q3_hour_goal', title: "What do you want to accomplish in the next hour?", placeholder: "One clear objective..." },
    { key: 'q4_definition', title: "How does finishing that look?", placeholder: "Define 'done'..." },
    { key: 'q5_distractions', title: "What could distract you?", placeholder: "List likely distractions..." },
    { key: 'q6_avoid_plan', title: "What will you do to avoid distractions?", placeholder: "Your plan to stay locked in..." },
];

export default function LockInPage() {
    const router = useRouter();
    const [cursor, setCursor] = useState<number>(0);
    const [answers, setAnswers] = useState<Record<StepKey, string>>({
        q1_mind: '',
        q2_stress: '',
        q3_hour_goal: '',
        q4_definition: '',
        q5_distractions: '',
        q6_avoid_plan: '',
    });
    const [length, setLength] = useState<number>(25);

    const step = steps[cursor];
    const progress = useMemo(() => Math.round(((cursor) / steps.length) * 100), [cursor]);

    const goNext = () => setCursor((i) => Math.min(i + 1, steps.length - 1));
    const goBack = () => setCursor((i) => Math.max(i - 1, 0));

    const handleChange = (value: string) => {
        setAnswers((prev) => ({ ...prev, [step.key]: value }));
    };

    const canContinue = (answers[step.key] ?? '').trim().length > 0;

    const handleStart = () => {
        // Save intake (we never show raw answers later)
        const record = saveIntake({
            q1_mind: answers.q1_mind,
            q2_stress: answers.q2_stress,
            q3_hour_goal: answers.q3_hour_goal,
            q4_definition: answers.q4_definition,
            q5_distractions: answers.q5_distractions,
            q6_avoid_plan: answers.q6_avoid_plan,
        });

        const target = answers.q3_hour_goal.trim().length > 0
            ? answers.q3_hour_goal.trim()
            : answers.q4_definition.trim().length > 0
                ? answers.q4_definition.trim()
                : 'Focused work';

        startSession(target, length, record.id);
        router.push('/focus');
    };

    return (
        <div className="min-h-screen bg-black text-white">
            <div className="border-b border-gray-800 p-4">
                <div className="max-w-3xl mx-auto flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">Lock-In</h1>
                        <p className="text-gray-400">Guide your mind. Block distractions. Do the work.</p>
                    </div>
                    <div className="text-right">
                        <div className="text-sm text-gray-500 uppercase tracking-widest">Preparation</div>
                        <div className="text-3xl font-bold text-green-400">{progress}%</div>
                    </div>
                </div>
            </div>

            <div className="max-w-3xl mx-auto p-4">
                <div className="mb-8">
                    <h2 className="text-xl font-semibold mb-2">{step.title}</h2>
                    <textarea
                        value={answers[step.key]}
                        onChange={(e) => handleChange(e.target.value)}
                        className="w-full min-h-[140px] bg-black border border-gray-700 rounded-lg p-4 text-gray-100 focus:outline-none focus:border-green-400"
                        placeholder={step.placeholder}
                    />
                </div>

                <div className="flex items-center justify-between mb-10">
                    <div className="flex gap-2">
                        {steps.map((_, i) => (
                            <div
                                key={i}
                                className={`h-1 w-10 rounded ${i <= cursor ? 'bg-green-500' : 'bg-gray-800'}`}
                            />
                        ))}
                    </div>

                    <div className="flex items-center gap-3">
                        {[15, 25, 45].map((m) => (
                            <button
                                key={m}
                                type="button"
                                onClick={() => setLength(m)}
                                className={`px-3 py-1 rounded-full border text-sm ${length === m ? 'border-green-500 bg-green-500 text-black font-semibold' : 'border-gray-700 text-gray-300 hover:border-gray-500'}`}
                            >
                                {m}m
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex items-center justify-between">
                    <button
                        type="button"
                        onClick={goBack}
                        disabled={cursor === 0}
                        className={`px-4 py-2 rounded-lg border ${cursor === 0 ? 'border-gray-800 text-gray-600 cursor-not-allowed' : 'border-gray-700 text-gray-300 hover:border-gray-500'}`}
                    >
                        Back
                    </button>

                    {cursor < steps.length - 1 ? (
                        <button
                            type="button"
                            onClick={goNext}
                            disabled={!canContinue}
                            className={`px-6 py-3 rounded-lg font-bold ${canContinue ? 'bg-white text-black hover:bg-gray-100' : 'bg-gray-700 text-gray-400 cursor-not-allowed'}`}
                        >
                            Continue
                        </button>
                    ) : (
                        <button
                            type="button"
                            onClick={handleStart}
                            disabled={!canContinue}
                            className={`px-6 py-3 rounded-lg font-bold ${canContinue ? 'bg-white text-black hover:bg-gray-100' : 'bg-gray-700 text-gray-400 cursor-not-allowed'}`}
                        >
                            Start Lock-In
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}


