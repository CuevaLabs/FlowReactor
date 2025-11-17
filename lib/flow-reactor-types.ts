// lib/flow-reactor-types.ts

export enum FlowType {
  TYPE_A = 'TYPE_A', // Overthinker / Noisy Mind
  TYPE_B = 'TYPE_B', // Momentum Type
  TYPE_C = 'TYPE_C', // Purpose-Driven
  TYPE_D = 'TYPE_D', // Structure / Clarity
  TYPE_E = 'TYPE_E', // Distraction-Prone
}

export type FlowTypeLabel = {
  key: FlowType;
  label: string;
  description: string;
};

export const FLOW_TYPE_OPTIONS: FlowTypeLabel[] = [
  {
    key: FlowType.TYPE_A,
    label: 'Noisy mind',
    description: 'Overthinker / Noisy Mind',
  },
  {
    key: FlowType.TYPE_B,
    label: 'Trouble starting',
    description: 'Momentum Type',
  },
  {
    key: FlowType.TYPE_C,
    label: 'Lack of motivation',
    description: 'Purpose-Driven',
  },
  {
    key: FlowType.TYPE_D,
    label: 'Feeling overwhelmed',
    description: 'Structure / Clarity',
  },
  {
    key: FlowType.TYPE_E,
    label: 'Easy to get distracted',
    description: 'Distraction-Prone',
  },
];

export type ReactorQuestion = {
  key: string;
  title: string;
  description: string;
  placeholder: string;
};

export type FlowQuestionSet = {
  flowType: FlowType;
  questions: ReactorQuestion[];
};

export const FLOW_QUESTION_SETS: Record<FlowType, FlowQuestionSet> = {
  [FlowType.TYPE_A]: {
    flowType: FlowType.TYPE_A,
    questions: [
      {
        key: 'q1_noise',
        title: "What's loud in your mind right now?",
        description: 'Name what you notice so we can shape the session around it.',
        placeholder: 'Let it spill here...',
      },
      {
        key: 'q2_ignore',
        title: 'What can you safely ignore during this session?',
        description: 'Drop the noise in here so it stops looping.',
        placeholder: 'List thoughts you're shelving...',
      },
      {
        key: 'q3_focus',
        title: "What's the one thing that matters most right now?",
        description: 'State the outcome that would feel like momentum.',
        placeholder: 'The single most important thing...',
      },
    ],
  },
  [FlowType.TYPE_B]: {
    flowType: FlowType.TYPE_B,
    questions: [
      {
        key: 'q1_first_action',
        title: "What's the first action you can take in the next 30 seconds?",
        description: 'Identify the smallest, immediate step.',
        placeholder: 'Open the file, write one sentence, make one call...',
      },
      {
        key: 'q2_next_step',
        title: "What's the next step right after that?",
        description: 'Build momentum with a clear sequence.',
        placeholder: 'Then I'll...',
      },
      {
        key: 'q3_progress',
        title: 'What will count as progress today?',
        description: 'Define what success looks like for this session.',
        placeholder: 'Draft completed, outline finished, first version done...',
      },
    ],
  },
  [FlowType.TYPE_C]: {
    flowType: FlowType.TYPE_C,
    questions: [
      {
        key: 'q1_why',
        title: 'Why does this matter today?',
        description: 'Connect to your deeper purpose.',
        placeholder: 'Because it will help me...',
      },
      {
        key: 'q2_outcome',
        title: 'What outcome would feel meaningful?',
        description: 'Visualize the impact you want to create.',
        placeholder: 'I want to feel... or achieve...',
      },
      {
        key: 'q3_small_step',
        title: "What's the smallest step that moves you toward that?",
        description: 'Break it down to the most actionable move.',
        placeholder: 'Just...',
      },
    ],
  },
  [FlowType.TYPE_D]: {
    flowType: FlowType.TYPE_D,
    questions: [
      {
        key: 'q1_simple',
        title: "What's the simplest version of this task?",
        description: 'Strip away complexity to find the core.',
        placeholder: 'At its essence, this is just...',
      },
      {
        key: 'q2_steps',
        title: 'Break it into 2–3 steps.',
        description: 'Create a clear, manageable structure.',
        placeholder: 'Step 1: ... Step 2: ... Step 3: ...',
      },
      {
        key: 'q3_start',
        title: 'Which step will you start with?',
        description: 'Choose your entry point.',
        placeholder: 'I'll begin with...',
      },
    ],
  },
  [FlowType.TYPE_E]: {
    flowType: FlowType.TYPE_E,
    questions: [
      {
        key: 'q1_derails',
        title: 'What usually derails your focus?',
        description: 'Identify your biggest distraction triggers.',
        placeholder: 'Phone, chat, snacks, doomscrolling...',
      },
      {
        key: 'q2_block',
        title: 'How will you block that for this session?',
        description: 'Set the rules that keep you honest.',
        placeholder: 'Mute notifications, door closed, playlist ready...',
      },
      {
        key: 'q3_first_thing',
        title: "What's the first thing you'll do once distractions are blocked?",
        description: 'Define your immediate action once guardrails are up.',
        placeholder: 'I'll immediately...',
      },
    ],
  },
};

export function getQuestionSetForFlowType(flowType: FlowType): FlowQuestionSet {
  return FLOW_QUESTION_SETS[flowType];
}

