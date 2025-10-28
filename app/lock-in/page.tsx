'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { saveIntake, type IntakeAnswers } from '@/lib/lockin-intake';
import { startSession, useFocusSession } from '@/lib/focus-session';

type StepKey = keyof Pick<
	IntakeAnswers,
	'q1_mind' | 'q2_stress' | 'q3_hour_goal' | 'q4_definition' | 'q5_distractions' | 'q6_avoid_plan'
>;

const STORAGE_KEY = 'lockin:intake:draft';

const steps: { key: StepKey; title: string; description: string; placeholder: string }[] = [
	{
		key: 'q1_mind',
		title: "What's pulling at your attention?",
		description: 'Name the loudest thoughts so you can park them.',
		placeholder: 'Stream your thoughts here...',
	},
	{
		key: 'q2_stress',
		title: "What's stressing you out?",
		description: 'Identifying pressure points deflates them.',
		placeholder: 'Stressors, triggers, or open loops...',
	},
	{
		key: 'q3_hour_goal',
		title: 'What do you want to achieve this sprint?',
		description: 'Define the outcome that would feel like momentum.',
		placeholder: 'Ship the landing page hero copy...',
	},
	{
		key: 'q4_definition',
		title: 'What does “done” look like?',
		description: 'Clarify the observable finish line.',
		placeholder: 'Copy drafted, reviewed, and pasted into Webflow...',
	},
	{
		key: 'q5_distractions',
		title: 'What could derail you?',
		description: 'List the obvious sabotages before they appear.',
		placeholder: 'Slack, phone, random tabs...',
	},
	{
		key: 'q6_avoid_plan',
		title: 'How will you stay locked in?',
		description: 'Create the micro-rules that protect your focus.',
		placeholder: 'Mute Slack, phone in another room, ambient playlist...',
	},
];

const defaultAnswers: Record<StepKey, string> = {
	q1_mind: '',
	q2_stress: '',
	q3_hour_goal: '',
	q4_definition: '',
	q5_distractions: '',
	q6_avoid_plan: '',
};

export default function LockInPage() {
	const router = useRouter();
	const [cursor, setCursor] = useState<number>(0);
	const [answers, setAnswers] = useState<Record<StepKey, string>>(defaultAnswers);
	const [length, setLength] = useState<number>(() => {
		if (typeof window === 'undefined') return 25;
		try {
			const stored = window.localStorage.getItem('focusSessionLength');
			return stored ? Number.parseInt(stored, 10) || 25 : 25;
		} catch {
			return 25;
		}
	});
	const activeSession = useFocusSession();
	const [draftLoaded, setDraftLoaded] = useState<boolean>(false);

	const step = steps[cursor];
	const progress = useMemo(() => Math.round(((cursor + 1) / steps.length) * 100), [cursor]);

	useEffect(() => {
		if (typeof window === 'undefined') return;

		try {
			const draftRaw = window.localStorage.getItem(STORAGE_KEY);
			if (draftRaw) {
				const parsed = JSON.parse(draftRaw) as Record<StepKey, string>;
				setAnswers({ ...defaultAnswers, ...parsed });
			}
		} catch {
			// ignore corrupted draft or blocked storage
		} finally {
			setDraftLoaded(true);
		}
	}, []);

	useEffect(() => {
		if (typeof window === 'undefined') return;
		try {
			window.localStorage.setItem('focusSessionLength', String(length));
		} catch {
			// ignore storage errors
		}
	}, [length]);

	useEffect(() => {
		if (!draftLoaded || typeof window === 'undefined') return;
		try {
			window.localStorage.setItem(STORAGE_KEY, JSON.stringify(answers));
		} catch {
			// storage might be blocked; ignore
		}
	}, [answers, draftLoaded]);

	const goNext = () => setCursor((index) => Math.min(index + 1, steps.length - 1));
	const goBack = () => setCursor((index) => Math.max(index - 1, 0));

	const handleChange = (value: string) => {
		setAnswers((prev) => ({ ...prev, [step.key]: value }));
	};

	const canContinue = (answers[step.key] ?? '').trim().length > 0;

	const handleStart = () => {
		const record = saveIntake({
			q1_mind: answers.q1_mind,
			q2_stress: answers.q2_stress,
			q3_hour_goal: answers.q3_hour_goal,
			q4_definition: answers.q4_definition,
			q5_distractions: answers.q5_distractions,
			q6_avoid_plan: answers.q6_avoid_plan,
		});

		const target =
			answers.q3_hour_goal.trim().length > 0
				? answers.q3_hour_goal.trim()
				: answers.q4_definition.trim().length > 0
					? answers.q4_definition.trim()
					: 'Focused work';

		startSession(target, length, record.id);
		if (typeof window !== 'undefined') {
			try {
				window.localStorage.removeItem(STORAGE_KEY);
			} catch {
				// ignore storage errors
			}
		}
		router.push('/focus');
	};

	if (!draftLoaded) {
		return (
			<div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#020617] via-[#0f172a] to-[#111827] text-slate-200">
				<div className="text-sm uppercase tracking-[0.3em] text-slate-400">Preparing flow...</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-[#020617] via-[#0f172a] to-[#111827] text-white">
			<div className="mx-auto flex w-full max-w-5xl flex-col gap-10 px-6 py-12 sm:px-10 lg:px-12">
				<header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
					<div>
						<h1 className="text-3xl font-semibold text-white sm:text-4xl">Guided Lock-In</h1>
						<p className="mt-2 max-w-2xl text-base text-slate-300">
							We capture the noise, align on the target, design guardrails, and launch focus.
						</p>
					</div>
					<div className="rounded-full border border-cyan-400/40 bg-cyan-500/10 px-5 py-2 text-sm font-semibold text-cyan-200">
						Preparation {progress}%
					</div>
				</header>

				{activeSession && (
					<div className="rounded-3xl border border-cyan-400/40 bg-cyan-500/10 p-6 text-cyan-100 backdrop-blur">
						<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
							<div>
								<div className="text-xs uppercase tracking-[0.3em] text-cyan-200">
									Ongoing Session
								</div>
								<div className="mt-2 text-2xl font-semibold text-white">{activeSession.target}</div>
								<div className="mt-1 text-sm text-cyan-100/80">
									Started at {new Date(activeSession.startAt).toLocaleTimeString()} •{' '}
									{activeSession.lengthMinutes} minute sprint
								</div>
							</div>
							<div className="flex flex-col gap-2 sm:flex-row sm:items-center">
								<button
									type="button"
									onClick={() => router.push('/focus')}
									className="inline-flex items-center justify-center rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
								>
									Resume Focus
								</button>
								<button
									type="button"
									onClick={() => router.push('/focus')}
									className="inline-flex items-center justify-center rounded-full border border-white/30 px-4 py-2 text-sm font-semibold text-white/90 transition hover:border-white/60"
								>
									View Session Details
								</button>
							</div>
						</div>
					</div>
				)}

				<section className="flex flex-col gap-10 rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-lg sm:p-10">
					<div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
						<div>
							<div className="text-sm uppercase tracking-[0.3em] text-slate-400">
								Step {cursor + 1} of {steps.length}
							</div>
							<h2 className="mt-2 text-3xl font-semibold text-white">{step.title}</h2>
							<p className="mt-3 max-w-lg text-base text-slate-300">{step.description}</p>
						</div>
						<div className="flex flex-wrap gap-2">
							{[20, 30, 45, 60].map((minutes) => (
								<button
									key={minutes}
									type="button"
									onClick={() => setLength(minutes)}
									className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
										length === minutes
											? 'bg-cyan-400 text-slate-900 shadow-md shadow-cyan-400/40'
											: 'border border-white/20 text-slate-200 hover:border-white/40'
									}`}
								>
									{minutes}m
								</button>
							))}
						</div>
					</div>

					<div>
						<textarea
							value={answers[step.key]}
							onChange={(event) => handleChange(event.target.value)}
							className="w-full min-h-[220px] rounded-2xl border border-transparent bg-slate-950/60 p-5 text-base text-slate-100 shadow-inner shadow-black/40 outline-none ring-2 ring-inset ring-white/10 transition focus:ring-cyan-400/60"
							placeholder={step.placeholder}
						/>
					</div>

					<div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
						<div className="flex flex-1 items-center gap-2">
							{steps.map((_, index) => (
								<div
									key={index}
									className={`h-2 flex-1 rounded-full ${
										index <= cursor ? 'bg-cyan-400' : 'bg-slate-700/60'
									}`}
								/>
							))}
						</div>
						<div className="flex items-center gap-3">
							<button
								type="button"
								onClick={goBack}
								disabled={cursor === 0}
								className={`rounded-full border border-white/20 px-5 py-2 text-sm font-semibold text-slate-200 transition ${
									cursor === 0 ? 'cursor-not-allowed opacity-50' : 'hover:border-white/40'
								}`}
							>
								Back
							</button>
							{cursor < steps.length - 1 ? (
								<button
									type="button"
									onClick={goNext}
									disabled={!canContinue}
									className={`rounded-full px-6 py-2 text-sm font-semibold transition ${
										canContinue
											? 'bg-white text-slate-900 hover:bg-slate-100'
											: 'bg-white/10 text-slate-400 cursor-not-allowed'
									}`}
								>
									Continue
								</button>
							) : (
								<button
									type="button"
									onClick={handleStart}
									disabled={!canContinue}
									className={`rounded-full px-6 py-2 text-sm font-semibold transition ${
										canContinue
											? 'bg-cyan-400 text-slate-900 shadow-lg shadow-cyan-400/40 hover:bg-cyan-300'
											: 'bg-white/10 text-slate-400 cursor-not-allowed'
									}`}
								>
									Start Session
								</button>
							)}
						</div>
					</div>
				</section>
			</div>
		</div>
	);
}
