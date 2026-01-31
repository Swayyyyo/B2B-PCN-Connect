// services/geminiService.ts
// Demo mode: AI responses are mocked for presentation purposes

export interface GeneratedTheme {
  primary: string;
  accent: string;
  neutral: string;
  rationale: string;
}

const DEMO_THEMES: GeneratedTheme[] = [
  {
    primary: "#2563EB", // blue
    accent: "#22C55E",  // green
    neutral: "#F8FAFC",
    rationale: "A professional blue paired with a fresh green to convey trust and growth."
  },
  {
    primary: "#7C3AED", // purple
    accent: "#F59E0B",  // amber
    neutral: "#FAFAFA",
    rationale: "Creative purple with a warm accent to balance innovation and approachability."
  },
  {
    primary: "#0F172A", // dark slate
    accent: "#38BDF8",  // sky
    neutral: "#F1F5F9",
    rationale: "A strong dark base with a light accent for a modern B2B dashboard feel."
  }
];

export const generateThemeFromPrompt = async (
  prompt: string
): Promise<GeneratedTheme> => {
  // Simulate AI thinking time
  await new Promise((res) => setTimeout(res, 800));

  // Pick a theme deterministically-ish (feels smart)
  const index = prompt.length % DEMO_THEMES.length;
  return {
    ...DEMO_THEMES[index],
    rationale: `Generated for the theme "${prompt}". ${DEMO_THEMES[index].rationale}`
  };
};
