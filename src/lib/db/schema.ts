import {
  pgTable,
  text,
  timestamp,
  boolean,
  uuid,
  varchar,
  pgEnum,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Enums
export const studentRatingEnum = pgEnum("student_rating", [
  "top_1_percent",
  "top_5_percent",
  "top_10_percent",
  "average",
]);

export const letterStatusEnum = pgEnum("letter_status", [
  "draft",
  "in_progress",
  "review",
  "final",
  "sent",
]);

// Users table (synced with Clerk)
export const users = pgTable("users", {
  id: text("id").primaryKey(), // Clerk user ID
  email: varchar("email", { length: 255 }).notNull().unique(),
  firstName: varchar("first_name", { length: 100 }),
  lastName: varchar("last_name", { length: 100 }),
  imageUrl: text("image_url"),
  role: varchar("role", { length: 50 }).default("counselor").notNull(),
  schoolName: varchar("school_name", { length: 255 }),
  schoolDistrict: varchar("school_district", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Students table
export const students = pgTable("students", {
  id: uuid("id").defaultRandom().primaryKey(),
  counselorId: text("counselor_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  firstName: varchar("first_name", { length: 100 }).notNull(),
  lastName: varchar("last_name", { length: 100 }).notNull(),
  email: varchar("email", { length: 255 }),
  gradeLevel: varchar("grade_level", { length: 20 }),
  gpa: varchar("gpa", { length: 10 }),
  intendedMajor: varchar("intended_major", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Brag Sheets table
export const bragSheets = pgTable("brag_sheets", {
  id: uuid("id").defaultRandom().primaryKey(),
  studentId: uuid("student_id")
    .references(() => students.id, { onDelete: "cascade" })
    .notNull(),
  counselorId: text("counselor_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),

  // The Hook - Theme & Narrative
  threeWords: text("three_words"),
  intellectualSpark: text("intellectual_spark"),
  unseenFactor: text("unseen_factor"),

  // The Proof - Academic & Extracurricular
  struggleStory: text("struggle_story"),
  leadershipMoment: text("leadership_moment"),
  classroomInteraction: text("classroom_interaction"),

  // Counselor Metadata (hidden from students)
  studentRating: studentRatingEnum("student_rating"),
  isFirstGenLowIncome: boolean("is_first_gen_low_income").default(false),
  counselorNotes: text("counselor_notes"),

  // Status tracking
  currentStep: varchar("current_step", { length: 20 }).default("1"),
  isComplete: boolean("is_complete").default(false),
  completedAt: timestamp("completed_at"),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Letters table
export const letters = pgTable("letters", {
  id: uuid("id").defaultRandom().primaryKey(),
  studentId: uuid("student_id")
    .references(() => students.id, { onDelete: "cascade" })
    .notNull(),
  counselorId: text("counselor_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  bragSheetId: uuid("brag_sheet_id").references(() => bragSheets.id, {
    onDelete: "set null",
  }),

  // Letter content
  title: varchar("title", { length: 255 }),
  content: text("content"),
  tone: varchar("tone", { length: 50 }), // e.g., "formal", "warm", "enthusiastic"
  wordCount: varchar("word_count", { length: 10 }),

  // Status and versioning
  status: letterStatusEnum("status").default("draft").notNull(),
  version: varchar("version", { length: 10 }).default("1"),

  // Deadlines
  dueDate: timestamp("due_date"),
  targetSchool: varchar("target_school", { length: 255 }),

  // AI generation metadata
  aiModel: varchar("ai_model", { length: 100 }),
  promptUsed: text("prompt_used"),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Counselor metadata/settings table
export const counselorSettings = pgTable("counselor_settings", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull()
    .unique(),

  // Default letter preferences
  defaultTone: varchar("default_tone", { length: 50 }).default("warm"),
  defaultWordCount: varchar("default_word_count", { length: 10 }).default("500"),
  signatureBlock: text("signature_block"),

  // School info for letter generation
  schoolName: varchar("school_name", { length: 255 }),
  counselorTitle: varchar("counselor_title", { length: 255 }),
  yearsExperience: varchar("years_experience", { length: 10 }),

  // FERPA settings
  ferpaEnabled: boolean("ferpa_enabled").default(true),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Relations
export const usersRelations = relations(users, ({ many, one }) => ({
  students: many(students),
  bragSheets: many(bragSheets),
  letters: many(letters),
  settings: one(counselorSettings),
}));

export const studentsRelations = relations(students, ({ one, many }) => ({
  counselor: one(users, {
    fields: [students.counselorId],
    references: [users.id],
  }),
  bragSheets: many(bragSheets),
  letters: many(letters),
}));

export const bragSheetsRelations = relations(bragSheets, ({ one, many }) => ({
  student: one(students, {
    fields: [bragSheets.studentId],
    references: [students.id],
  }),
  counselor: one(users, {
    fields: [bragSheets.counselorId],
    references: [users.id],
  }),
  letters: many(letters),
}));

export const lettersRelations = relations(letters, ({ one }) => ({
  student: one(students, {
    fields: [letters.studentId],
    references: [students.id],
  }),
  counselor: one(users, {
    fields: [letters.counselorId],
    references: [users.id],
  }),
  bragSheet: one(bragSheets, {
    fields: [letters.bragSheetId],
    references: [bragSheets.id],
  }),
}));

export const counselorSettingsRelations = relations(counselorSettings, ({ one }) => ({
  user: one(users, {
    fields: [counselorSettings.userId],
    references: [users.id],
  }),
}));

// Type exports for use in the application
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type Student = typeof students.$inferSelect;
export type NewStudent = typeof students.$inferInsert;

export type BragSheet = typeof bragSheets.$inferSelect;
export type NewBragSheet = typeof bragSheets.$inferInsert;

export type Letter = typeof letters.$inferSelect;
export type NewLetter = typeof letters.$inferInsert;

export type CounselorSettings = typeof counselorSettings.$inferSelect;
export type NewCounselorSettings = typeof counselorSettings.$inferInsert;
