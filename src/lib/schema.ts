import {
  boolean,
  pgTable,
  text,
  timestamp,
  jsonb,
  integer,
} from 'drizzle-orm/pg-core';

// Users table definition
export const usersTable = pgTable('users', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at'),
});

// Interviews table definition
export const interviewsTable = pgTable('interviews', {
  id: text('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => usersTable.id, { onDelete: 'cascade' }),
  role: text('role').notNull(),
  type: text('type').notNull(),
  techstack: text('techstack').array().notNull(),
  level: text('level').notNull(),
  questions: text('questions').array().notNull(),
  transcript: jsonb('transcript').array(),
  finalized: boolean('finalized').default(false),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at'),
});

// Feedback table definition
export type CategoryScore = {
  name: string;
  score: number;
  comment: string;
};

export const feedbackTable = pgTable('feedback', {
  id: text('id').primaryKey(),
  interviewId: text('interview_id')
    .notNull()
    .references(() => interviewsTable.id, { onDelete: 'cascade' }),
  userId: text('user_id')
    .notNull()
    .references(() => usersTable.id, { onDelete: 'cascade' }),
  totalScore: integer('total_score').notNull(),
  categoryScores: jsonb('category_scores').$type<CategoryScore[]>().notNull(),
  strengths: text('strengths').array(),
  areasForImprovement: text('areas_for_improvement').array(),
  finalAssessment: text('final_assessment').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at'),
});

// Type definitions
export type User = typeof usersTable.$inferSelect;
export type Interview = typeof interviewsTable.$inferSelect;
export type Feedback = typeof feedbackTable.$inferSelect;
