'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FlowType, FLOW_TYPE_OPTIONS } from '@/lib/flow-reactor-types';
import { setUserFlowType } from '@/lib/flow-type-storage';

export default function OnboardingPage() {
  const router = useRouter();
  const [selectedType, setSelectedType] = useState<FlowType | null>(null);

  const handleContinue = () => {
    if (!selectedType) return;
    setUserFlowType(selectedType);
    router.push('/reactor');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#020617] via-[#0f172a] to-[#111827] text-white">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-10 px-6 py-12 sm:px-10 lg:px-12">
        <header className="text-center">
          <div className="text-xs uppercase tracking-[0.3em] text-cyan-200">
            Flow Reactor Setup
          </div>
          <h1 className="mt-3 text-4xl font-semibold text-white">
            Select Your Reactor Type
          </h1>
          <p className="mt-2 max-w-2xl mx-auto text-base text-slate-300">
            What usually blocks you from getting into flow? We'll personalize your ignition sequence.
          </p>
        </header>

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FLOW_TYPE_OPTIONS.map((option) => (
            <button
              key={option.key}
              type="button"
              onClick={() => setSelectedType(option.key)}
              className={`rounded-3xl border p-6 text-left transition ${
                selectedType === option.key
                  ? 'border-cyan-400 bg-cyan-500/10 shadow-lg shadow-cyan-400/20'
                  : 'border-white/10 bg-white/5 hover:border-white/20'
              }`}
            >
              <div className="text-xs uppercase tracking-[0.3em] text-slate-400">
                {option.label}
              </div>
              <div className="mt-2 text-lg font-semibold text-white">
                {option.description}
              </div>
            </button>
          ))}
        </section>

        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleContinue}
            disabled={!selectedType}
            className={`rounded-full px-7 py-2 text-sm font-semibold transition ${
              selectedType
                ? 'bg-cyan-400 text-slate-900 shadow-lg shadow-cyan-400/40 hover:bg-cyan-300'
                : 'bg-white/10 text-slate-400 cursor-not-allowed'
            }`}
          >
            Enter the Reactor
          </button>
        </div>
      </div>
    </div>
  );
}

