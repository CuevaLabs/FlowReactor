'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FlowType, FLOW_TYPE_OPTIONS, getQuestionSetForFlowType } from '@/lib/flow-reactor-types';
import { saveIntake } from '@/lib/flow-reactor-intake';
import { getUserFlowType } from '@/lib/flow-type-storage';
import { startSession, useFlowReactorSession } from '@/lib/flow-reactor-session';

const STORAGE_KEY = 'flowReactor:intake:draft';

export default function ReactorPage() {
  const router = useRouter();
  const [flowType, setFlowType] = useState<FlowType | null>(null);
  const [cursor, setCursor] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [length, setLength] = useState<number>(() => {
    if (typeof window === 'undefined') return 25;
    try {
      const stored = window.localStorage.getItem('flowReactorSessionLength');
      return stored ? Number.parseInt(stored, 10) || 25 : 25;
    } catch {
      return 25;
    }
  });
  const activeSession = useFlowReactorSession();
  const [draftLoaded, setDraftLoaded] = useState<boolean>(false);
  const lengthOptions = [20, 30, 45, 60];

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const userType = getUserFlowType();
    if (!userType) {
      router.push('/onboarding');
      return;
    }
    setFlowType(userType);
  }, [router]);

  const questionSet = flowType ? getQuestionSetForFlowType(flowType) : null;
  const questionCount = questionSet?.questions.length ?? 0;
  const totalStages = questionCount + 1;
  const isSummary = cursor === questionCount;
  const currentQuestion = !isSummary && questionSet ? questionSet.questions[cursor] : null;
  const progress = useMemo(() => Math.round(((cursor + 1) / totalStages) * 100), [cursor, totalStages]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const draftRaw = window.localStorage.getItem(STORAGE_KEY);
      if (draftRaw) {
        const parsed = JSON.parse(draftRaw) as Record<string, string>;
        setAnswers({ ...parsed });
      }
    } catch {
      // ignore corrupted draft
    } finally {
      setDraftLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.setItem('flowReactorSessionLength', String(length));
    } catch {
      // ignore storage errors
    }
  }, [length]);

  useEffect(() => {
    if (!draftLoaded || typeof window === 'undefined') return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(answers));
    } catch {
      // storage might be blocked
    }
  }, [answers, draftLoaded]);

  const handleContinue = () => {
    if (isSummary) return;
    setCursor((index) => Math.min(index + 1, questionCount));
  };

  const handleChange = (value: string, key: string) => {
    setAnswers((prev) => ({ ...prev, [key]: value }));
  };

  const canContinue = !isSummary && currentQuestion
    ? (answers[currentQuestion.key] ?? '').trim().length > 0
    : false;
  const canStart = length > 0 && flowType !== null;

  const handleStart = () => {
    if (!flowType || !questionSet) return;

    const record = saveIntake(flowType, answers);

    const target =
      answers[questionSet.questions[0]?.key ?? '']?.trim().length > 0
        ? answers[questionSet.questions[0]?.key ?? ''].trim()
        : 'Flow activation';

    startSession(target, length, record.id, flowType);
    if (typeof window !== 'undefined') {
      try {
        window.localStorage.removeItem(STORAGE_KEY);
      } catch {
        // ignore storage errors
      }
    }
    router.push('/focus');
  };

  if (!draftLoaded || !flowType || !questionSet) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#020617] via-[#0f172a] to-[#111827] text-slate-200">
        <div className="text-sm uppercase tracking-[0.3em] text-slate-400">
          Preparing ignition sequence...
        </div>
      </div>
    );
  }

  const flowTypeLabel = FLOW_TYPE_OPTIONS.find((o) => o.key === flowType);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#020617] via-[#0f172a] to-[#111827] text-white">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-10 px-6 py-12 sm:px-10 lg:px-12">
        <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-white sm:text-4xl">
              Flow Reactor Ignition
            </h1>
            <p className="mt-2 max-w-2xl text-base text-slate-300">
              Your mental ignition pattern: {flowTypeLabel?.description}
            </p>
          </div>
          <div className="rounded-full border border-cyan-400/40 bg-cyan-500/10 px-5 py-2 text-sm font-semibold text-cyan-200">
            Ignition {progress}%
          </div>
        </header>

        {activeSession && (
          <div className="rounded-3xl border border-cyan-400/40 bg-cyan-500/10 p-6 text-cyan-100 backdrop-blur">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="text-xs uppercase tracking-[0.3em] text-cyan-200">
                  Active Reactor Session
                </div>
                <div className="mt-2 text-2xl font-semibold text-white">{activeSession.target}</div>
                <div className="mt-1 text-sm text-cyan-100/80">
                  Started at {new Date(activeSession.startAt).toLocaleTimeString()} •{' '}
                  {activeSession.lengthMinutes} minute activation
                </div>
              </div>
              <button
                type="button"
                onClick={() => router.push('/focus')}
                className="inline-flex items-center justify-center rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
              >
                Resume Flow
              </button>
            </div>
          </div>
        )}

        <section className="flex flex-col gap-10 rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-lg sm:p-10">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <div className="text-sm uppercase tracking-[0.3em] text-slate-400">
                {isSummary ? 'Ready to activate' : `Step ${cursor + 1} of ${questionCount}`}
              </div>
              <h2 className="mt-2 text-3xl font-semibold text-white">
                {isSummary ? 'Set your activation duration' : currentQuestion?.title}
              </h2>
              <p className="mt-3 max-w-lg text-base text-slate-300">
                {isSummary
                  ? 'Your ignition sequence is complete. Choose your activation duration.'
                  : currentQuestion?.description}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {Array.from({ length: totalStages }).map((_, index) => (
                <div
                  key={index}
                  className={`h-2 w-14 rounded-full ${
                    index <= cursor ? 'bg-cyan-400' : 'bg-slate-700/60'
                  }`}
                />
              ))}
            </div>
          </div>

          {!isSummary ? (
            <>
              <textarea
                value={currentQuestion ? answers[currentQuestion.key] ?? '' : ''}
                onChange={(event) =>
                  currentQuestion && handleChange(event.target.value, currentQuestion.key)
                }
                className="w-full min-h-[220px] rounded-2xl border border-transparent bg-slate-950/60 p-5 text-base text-slate-100 shadow-inner shadow-black/40 outline-none ring-2 ring-inset ring-white/10 transition focus:ring-cyan-400/60"
                placeholder={currentQuestion?.placeholder}
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
                  <div className="text-xs uppercase tracking-[0.3em] text-slate-400">
                    Activation duration
                  </div>
                  <p className="mt-3 text-sm text-slate-300">
                    How long will you stay in the reactor?
                  </p>
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
                  <div className="text-xs uppercase tracking-[0.3em] text-slate-400">
                    Your ignition sequence
                  </div>
                  <div className="mt-4 space-y-4 text-sm text-slate-200">
                    {questionSet.questions.map((q) => (
                      <div key={q.key}>
                        <div className="text-slate-400">{q.title}</div>
                        <p className="mt-1 text-base text-white">{answers[q.key] || '—'}</p>
                      </div>
                    ))}
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
                  Activate Flow Reactor
                </button>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

