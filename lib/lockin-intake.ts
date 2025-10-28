export type IntakeAnswers = {
    id: string;
    createdAt: number;
    // We never show raw answers to user later; stored for reflection comparison only
    q1_mind: string; // what's on your mind right now
    q2_stress: string; // what's been stressing you
    q3_hour_goal: string; // what do you want to accomplish in the next hour
    q4_definition: string; // how does that look
    q5_distractions: string; // what could distract you
    q6_avoid_plan: string; // what are you going to do to avoid distractions
    // Future prompts can be added here
};

const KEY = 'lockin:intakes';

export function saveIntake(answers: Omit<IntakeAnswers, 'id' | 'createdAt'>): IntakeAnswers {
    const record: IntakeAnswers = {
        id: randomId(),
        createdAt: Date.now(),
        ...answers,
    };
    const all = getAllIntakes();
    all.unshift(record);
    setAllIntakes(all);
    return record;
}

export function getIntake(id: string): IntakeAnswers | null {
    return getAllIntakes().find((x) => x.id === id) ?? null;
}

export function getAllIntakes(): IntakeAnswers[] {
    if (typeof window === 'undefined') return [];
    try {
        const raw = localStorage.getItem(KEY);
        return raw ? (JSON.parse(raw) as IntakeAnswers[]) : [];
    } catch {
        return [];
    }
}

function setAllIntakes(items: IntakeAnswers[]) {
    if (typeof window === 'undefined') return;
    localStorage.setItem(KEY, JSON.stringify(items));
}

function randomId(): string {
    if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
        // @ts-ignore
        return crypto.randomUUID();
    }
    return Math.random().toString(36).slice(2) + Date.now().toString(36);
}


