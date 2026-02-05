import { z } from "zod";

export const RATING_OPTIONS = [
  { value: "top_1_percent", label: "Top 1% - Exceptional" },
  { value: "top_5_percent", label: "Top 5% - Outstanding" },
  { value: "top_10_percent", label: "Top 10% - Very Good" },
  { value: "average", label: "Average" },
] as const;

export type RatingValue = (typeof RATING_OPTIONS)[number]["value"];

// Student-facing schema (what students fill out)
export const studentBragSheetSchema = z.object({
  // The Hook - Theme & Narrative
  threeWords: z
    .string()
    .min(3, "Please provide at least 3 characters")
    .max(100, "Please keep your response under 100 characters"),
  intellectualSpark: z
    .string()
    .min(50, "Please provide more detail (at least 50 characters)")
    .max(2000, "Please keep your response under 2000 characters"),
  unseenFactor: z
    .string()
    .min(50, "Please provide more detail (at least 50 characters)")
    .max(2000, "Please keep your response under 2000 characters"),

  // The Proof - Academic & Extracurricular
  struggleStory: z
    .string()
    .min(50, "Please provide more detail (at least 50 characters)")
    .max(2000, "Please keep your response under 2000 characters"),
  leadershipMoment: z
    .string()
    .min(50, "Please provide more detail (at least 50 characters)")
    .max(2000, "Please keep your response under 2000 characters"),
  classroomInteraction: z
    .string()
    .min(50, "Please provide more detail (at least 50 characters)")
    .max(2000, "Please keep your response under 2000 characters"),
});

// Counselor metadata schema (hidden from students)
export const counselorMetadataSchema = z.object({
  studentRating: z.enum(["top_1_percent", "top_5_percent", "top_10_percent", "average"]).optional(),
  isFirstGenLowIncome: z.boolean().optional().default(false),
  counselorNotes: z.string().max(2000).optional().default(""),
});

// Complete schema including counselor fields
export const completeBragSheetSchema = studentBragSheetSchema.merge(counselorMetadataSchema);

// Export types - use z.input for form data to allow partial/undefined values
export type StudentBragSheetData = z.infer<typeof studentBragSheetSchema>;
export type CounselorMetadata = z.infer<typeof counselorMetadataSchema>;
export type CompleteBragSheetData = z.infer<typeof completeBragSheetSchema>;

// Form input type (allows undefined values during form entry)
export type CompleteBragSheetInput = z.input<typeof completeBragSheetSchema>;
