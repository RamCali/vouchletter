import { BIAS_DICTIONARY } from "@/components/studio/BiasHighlighter";

// Types
type LetterTone = "WARM" | "ACADEMIC" | "ADVOCACY";
type LetterAngle = "RESILIENCE" | "STEM" | "COMMUNITY";

interface Student {
  firstName: string;
  lastName: string;
  grade: number;
  gpa: number | null;
}

interface BragSheet {
  threeWords: string[];
  intellectualSpark: string | null;
  struggleStory: string | null;
  leadershipMoment: string | null;
  keyAnecdotes: { title: string; description: string }[] | null;
  counselorRating: string | null;
  transcriptNotes: string | null;
  activities: { name: string; role: string; years: number; description: string }[] | null;
  awards: { name: string; year: number; description: string }[] | null;
}

interface GenerationContext {
  student: Student;
  bragSheet: BragSheet;
  tone: LetterTone;
  angle: LetterAngle;
}

// Tone descriptions for the AI
const TONE_INSTRUCTIONS: Record<LetterTone, string> = {
  WARM: `Write in a warm, personal tone. Use first-person perspective ("I have had the pleasure...").
Include personal observations and emotional connections. Make the reader feel they know this student.`,

  ACADEMIC: `Write in a formal, academic tone. Focus on intellectual achievements and academic potential.
Use precise language and specific metrics. Emphasize scholarly contributions and research potential.`,

  ADVOCACY: `Write with strong advocacy. This letter should leave no doubt about the student's exceptional qualities.
Use superlatives appropriately and make a compelling case. Emphasize unique circumstances and potential.`,
};

// Angle focus areas
const ANGLE_INSTRUCTIONS: Record<LetterAngle, string> = {
  RESILIENCE: `Focus on the student's ability to overcome challenges. Highlight growth, perseverance,
and transformation. Use the struggle story as a central narrative element.`,

  STEM: `Emphasize technical abilities, analytical thinking, and scientific contributions.
Highlight research, projects, and quantitative achievements. Use specific technical accomplishments.`,

  COMMUNITY: `Focus on leadership, service, and impact on others. Highlight how the student
has improved their community and mentored peers. Emphasize collaborative abilities.`,
};

// Format counselor rating for letter
function formatCounselorRating(rating: string | null): string {
  const labels: Record<string, string> = {
    TOP_1_PERCENT: "top 1% of students I have counseled in my career",
    TOP_5_PERCENT: "top 5% of students I have worked with",
    TOP_10_PERCENT: "top 10% of students in their class",
    TOP_25_PERCENT: "top quarter of their graduating class",
    TOP_50_PERCENT: "above average among their peers",
  };
  return rating ? labels[rating] || "a strong student" : "a notable student";
}

// Build the bias avoidance instruction
function buildBiasAvoidanceInstruction(): string {
  const biasWords = Object.keys(BIAS_DICTIONARY).slice(0, 10).join(", ");
  return `IMPORTANT: Avoid potentially biased language. Do NOT use words like: ${biasWords}.
Instead, use specific, achievement-focused language that demonstrates rather than describes.`;
}

/**
 * Builds the system prompt for letter generation
 */
export function buildSystemPrompt(): string {
  return `You are an expert college counselor writing recommendation letters for college applications.

Your letters should:
- Be 400-500 words (3-4 paragraphs)
- Include specific examples and anecdotes, not generic praise
- Feel authentic and personal, as if written by the counselor
- Follow FERPA guidelines (no sensitive medical/legal information)
- Be appropriate for college admissions committees

${buildBiasAvoidanceInstruction()}

Structure:
1. Opening: Establish relationship and context
2. Body (1-2 paragraphs): Specific stories and achievements
3. Closing: Clear ranking/recommendation and future potential`;
}

/**
 * Builds the user prompt with all context for a specific letter
 */
export function buildUserPrompt(context: GenerationContext): string {
  const { student, bragSheet, tone, angle } = context;

  // Compile activities into readable format
  const activitiesText = bragSheet.activities
    ?.map((a) => `- ${a.name}: ${a.role} (${a.years} year${a.years !== 1 ? "s" : ""})`)
    .join("\n") || "No activities listed";

  // Compile awards
  const awardsText = bragSheet.awards
    ?.map((a) => `- ${a.name} (${a.year})`)
    .join("\n") || "No awards listed";

  // Compile anecdotes
  const anecdotesText = bragSheet.keyAnecdotes
    ?.map((a) => `${a.title}: ${a.description}`)
    .join("\n\n") || "";

  return `Write a recommendation letter for ${student.firstName} ${student.lastName}.

=== STUDENT PROFILE ===
Name: ${student.firstName} ${student.lastName}
Grade: ${student.grade}
GPA: ${student.gpa?.toFixed(2) || "N/A"}
Counselor Ranking: ${formatCounselorRating(bragSheet.counselorRating)}

=== THE HOOK (What makes them memorable) ===
Three Words: ${bragSheet.threeWords.join(", ")}
Intellectual Spark: ${bragSheet.intellectualSpark || "Not provided"}

=== THE PROOF (Stories that demonstrate character) ===
Struggle Story: ${bragSheet.struggleStory || "Not provided"}

Leadership Moment: ${bragSheet.leadershipMoment || "Not provided"}

Key Anecdotes:
${anecdotesText || "None provided"}

=== ACADEMIC CONTEXT ===
Transcript Notes: ${bragSheet.transcriptNotes || "Not provided"}

Activities:
${activitiesText}

Awards:
${awardsText}

=== LETTER REQUIREMENTS ===
Tone: ${tone}
${TONE_INSTRUCTIONS[tone]}

Angle: ${angle}
${ANGLE_INSTRUCTIONS[angle]}

Write the letter now. Focus on specific stories and achievements. Make it authentic and compelling.`;
}

/**
 * Example of the full prompt structure for reference
 */
export function getExamplePrompt(): { system: string; user: string } {
  return {
    system: buildSystemPrompt(),
    user: buildUserPrompt({
      student: {
        firstName: "Example",
        lastName: "Student",
        grade: 12,
        gpa: 3.85,
      },
      bragSheet: {
        threeWords: ["curious", "resilient", "leader"],
        intellectualSpark: "Obsessed with robotics",
        struggleStory: "Overcame funding challenges",
        leadershipMoment: "Led the robotics team",
        keyAnecdotes: [{ title: "Server Room", description: "Debugged complex issue" }],
        counselorRating: "TOP_5_PERCENT",
        transcriptNotes: "Strong STEM focus",
        activities: [{ name: "Robotics", role: "Captain", years: 4, description: "Led team" }],
        awards: [{ name: "Regional Champion", year: 2024, description: "" }],
      },
      tone: "WARM",
      angle: "STEM",
    }),
  };
}
