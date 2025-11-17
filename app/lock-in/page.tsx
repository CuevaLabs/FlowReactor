'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { saveIntake, type IntakeAnswers } from '@/lib/lockin-intake';
import { startSession, useFocusSession } from '@/lib/focus-session';
import { readJSON, readString, writeJSON, writeString } from '@/lib/safe-storage';

type StepKey = keyof Pick<
	IntakeAnswers,
	'q1_mind' | 'q2_stress' | 'q3_hour_goal' | 'q4_definition' | 'q5_distractions' | 'q6_avoid_plan'
>;

const STORAGE_KEY = 'lockin:intake:draft';

const steps: { key: StepKey; title: string; description: string; placeholder: string }[] = [
	{
		key: 'q1_mind',
		title: "How's your headspace right now?",
		description: 'Name what you notice so we can shape the sprint around it.',
		placeholder: 'Let it spill here...',
	},
	{
		key: 'q2_stress',
		title: 'Anything on your mind you want to park for now?',
		description: 'Drop the noise in here so it stops looping.',
		placeholder: 'List thoughts you’re shelving...',
	},
	{
		key: 'q3_hour_goal',
		title: 'What are you here to get done?',
		description: 'State the outcome that would feel like momentum.',
		placeholder: 'Draft launch email, edit video, finish outline...',
	},
	{
		key: 'q4_definition',
		title: 'What does “done” look like?',
		description: 'Clarify the observable finish line.',
		placeholder: 'Copy drafted, reviewed, and pasted into Webflow...',
	},
	{
		key: 'q5_distractions',
		title: 'What usually pulls you away?',
		description: 'Spot the patterns so you can disarm them.',
		placeholder: 'Phone, chat, snacks, doomscrolling...',
	},
	{
		key: 'q6_avoid_plan',
		title: 'How will you stay locked in?',
		description: 'Set the rules that keep you honest for this sprint.',
		placeholder: 'Mute notifications, door closed, playlist ready...',
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

export default function FlowReactorPage() {
	const router = useRouter();
	const [cursor, setCursor] = useState<number>(0);
	const [answers, setAnswers] = useState<Record<StepKey, string>>(defaultAnswers);
	const [length, setLength] = useState<number>(() => {
		const stored = readString('focusSessionLength');
		const parsed = stored ? Number.parseInt(stored, 10) : Number.NaN;
		return Number.isFinite(parsed) && parsed > 0 ? parsed : 25;
	});
	const activeSession = useFocusSession();
	const [draftLoaded, setDraftLoaded] = useState<boolean>(false);
	const lengthOptions = [20, 30, 45, 60];

	const questionCount = steps.length;
	const totalStages = questionCount + 1; // includes final summary stage
	const isSummary = cursor === questionCount;
	const step = !isSummary ? steps[cursor] : null;
	const progress = useMemo(() => Math.round(((cursor + 1) / totalStages) * 100), [cursor, totalStages]);

	useEffect(() => {
		const draft = readJSON<Record<StepKey, string>>(STORAGE_KEY);
		if (draft) {
			setAnswers({ ...defaultAnswers, ...draft });
		}
		setDraftLoaded(true);
	}, []);

	useEffect(() => {
		writeString('focusSessionLength', String(length));
	}, [length]);

	useEffect(() => {
		if (!draftLoaded) return;
		writeJSON(STORAGE_KEY, answers);
	}, [answers, draftLoaded]);

	const handleContinue = () => {
		if (isSummary) return;
		setCursor((index) => Math.min(index + 1, questionCount));
	};

	const handleChange = (value: string) => {
		if (!step) return;
		setAnswers((prev) => ({ ...prev, [step.key]: value }));
	};

	const canContinue = !isSummary && step ? (answers[step.key] ?? '').trim().length > 0 : false;
	const canStart = length > 0;

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
		writeJSON(STORAGE_KEY, null);
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
							{isSummary ? 'Ready to lock in' : `Step ${cursor + 1} of ${questionCount}`}
						</div>
						<h2 className="mt-2 text-3xl font-semibold text-white">
							{isSummary ? 'Dial in your sprint length' : step?.title}
						</h2>
						<p className="mt-3 max-w-lg text-base text-slate-300">
							{isSummary
								? 'We captured your intent and guardrails. Choose how long you want to stay locked in before you launch.'
								: step?.description}
						</p>
					</div>
					<div className="flex flex-wrap gap-2">
						{Array.from({ length: totalStages }).map((_, index) => (
							<div
								key={index}
								className={`h-2 w-14 rounded-full ${index <= cursor ? 'bg-cyan-400' : 'bg-slate-700/60'}`}
							/>
						))}
					</div>
				</div>

				{!isSummary ? (
					<>
						<textarea
							value={step ? answers[step.key] : ''}
							onChange={(event) => handleChange(event.target.value)}
							className="w-full min-h-[220px] rounded-2xl border border-transparent bg-slate-950/60 p-5 text-base text-slate-100 shadow-inner shadow-black/40 outline-none ring-2 ring-inset ring-white/10 transition focus:ring-cyan-400/60"
							placeholder={step?.placeholder}
						/>

						<div className="flex justify-end">
							<button
								type="button"
								onClick={handleContinue}
								disabled={!canContinue}
								className={`rounded-full px-7 py-2 text-sm font-semibold transition ${
									canContinue
										? 'bg-white text-slate-900 shadow shadow-white/40 hover:bg-slate-100'
										: 'bg-white/10 text-slate-400 cursor-not-allowed'
								}`}
							>
								Continue
							</button>
						</div>
					</>
				) : (
					<div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
						<div className="space-y-6">
							<div className="rounded-3xl border border-white/10 bg-slate-950/60 p-6">
								<div className="text-xs uppercase tracking-[0.3em] text-slate-400">Sprint length</div>
								<p className="mt-3 text-sm text-slate-300">How long are you locking in for this run?</p>
								<div className="mt-4 flex flex-wrap gap-2">
									{lengthOptions.map((minutes) => (
										<button
											key={minutes}
											type="button"
											onClick={() => setLength(minutes)}
											className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
												length === minutes
													? 'bg-cyan-400 text-slate-900 shadow-md shadow-cyan-400/40'
													: 'border border-white/20 text-slate-200 hover:border-white/40'
											}`}
										>
											{minutes} minutes
										</button>
									))}
								</div>
							</div>
							<div className="rounded-3xl border border-white/10 bg-slate-950/60 p-6">
								<div className="text-xs uppercase tracking-[0.3em] text-slate-400">Your plan</div>
								<div className="mt-4 space-y-4 text-sm text-slate-200">
									<div>
										<div className="text-slate-400">Headspace check</div>
										<p className="mt-1 text-base text-white">{answers.q1_mind || '—'}</p>
									</div>
									<div>
										<div className="text-slate-400">What you’re parking</div>
										<p className="mt-1">{answers.q2_stress || '—'}</p>
									</div>
									<div>
										<div className="text-slate-400">Focus for this sprint</div>
										<p className="mt-1 text-base text-white">{answers.q3_hour_goal || '—'}</p>
									</div>
									<div>
										<div className="text-slate-400">What “done” looks like</div>
										<p className="mt-1">{answers.q4_definition || '—'}</p>
									</div>
									<div>
										<div className="text-slate-400">Likely pulls</div>
										<p className="mt-1">{answers.q5_distractions || '—'}</p>
									</div>
									<div>
										<div className="text-slate-400">Guardrails you set</div>
										<p className="mt-1">{answers.q6_avoid_plan || '—'}</p>
									</div>
								</div>
							</div>
						</div>

						<div className="flex justify-end">
							<button
								type="button"
								onClick={handleStart}
								disabled={!canStart}
								className={`rounded-full px-7 py-2 text-sm font-semibold transition ${
									canStart
										? 'bg-cyan-400 text-slate-900 shadow-lg shadow-cyan-400/40 hover:bg-cyan-300'
										: 'bg-white/10 text-slate-400 cursor-not-allowed'
								}`}
							>
								Start Lock-In
							</button>
						</div>
					</div>
				)}
			</section>
			</div>
		</div>
	);
}
