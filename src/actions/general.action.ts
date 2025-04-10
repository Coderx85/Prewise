'use server';

import { generateObject } from 'ai';
import { google } from '@ai-sdk/google';
import { desc, eq, and, ne } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';

import { feedbackSchema } from '@/constants';
import { db, feedbackTable, interviewsTable } from '@/lib';
import type { Interview, Feedback } from '@/lib/schema';
import {
  CreateFeedbackParams,
  GetFeedbackByInterviewIdParams,
  GetLatestInterviewsParams,
} from '@/types';

export async function createFeedback(params: CreateFeedbackParams) {
  const { interviewId, userId, transcript, feedbackId } = params;

  try {
    const formattedTranscript = transcript
      .map(
        (sentence: { role: string; content: string }) =>
          `- ${sentence.role}: ${sentence.content}\n`
      )
      .join('');

    const { object } = await generateObject({
      model: google('gemini-2.0-flash-001', {
        structuredOutputs: false,
      }),
      schema: feedbackSchema,
      prompt: `
        You are an AI interviewer analyzing a mock interview. Your task is to evaluate the candidate based on structured categories. Be thorough and detailed in your analysis. Don't be lenient with the candidate. If there are mistakes or areas for improvement, point them out.
        Transcript:
        ${formattedTranscript}

        Please score the candidate from 0 to 100 in the following areas. Do not add categories other than the ones provided:
        - **Communication Skills**: Clarity, articulation, structured responses.
        - **Technical Knowledge**: Understanding of key concepts for the role.
        - **Problem-Solving**: Ability to analyze problems and propose solutions.
        - **Cultural & Role Fit**: Alignment with company values and job role.
        - **Confidence & Clarity**: Confidence in responses, engagement, and clarity.
      `,
      system: 'You are a professional interviewer analyzing a mock interview.',
    });
    const feedback = {
      id: uuidv4(),
      interviewId,
      userId,
      totalScore: object.totalScore,
      categoryScores: object.categoryScores,
      strengths: object.strengths,
      areasForImprovement: object.areasForImprovement,
      finalAssessment: object.finalAssessment,
    };

    let result;

    if (feedbackId) {
      // Update existing feedback
      await db
        .update(feedbackTable)
        .set(feedback)
        .where(eq(feedbackTable.id, feedbackId))
        .execute();
      result = { id: feedbackId };
    } else {
      // Insert new feedback
      const [insertedFeedback] = await db
        .insert(feedbackTable)
        .values(feedback)
        .returning()
        .execute();
      result = insertedFeedback;
    }

    return { success: true, feedbackId: result.id };
  } catch (error) {
    console.error('Error saving feedback:', error);
    return { success: false };
  }
}

export async function getInterviewById(id: string): Promise<Interview | null> {
  const [interview] = await db
    .select()
    .from(interviewsTable)
    .where(eq(interviewsTable.id, id))
    .execute();

  return interview || null;
}

export async function getFeedbackByInterviewId(
  params: GetFeedbackByInterviewIdParams
): Promise<Feedback | null> {
  const { interviewId, userId } = params;

  const [feedback] = await db
    .select()
    .from(feedbackTable)
    .where(
      and(
        eq(feedbackTable.interviewId, interviewId),
        eq(feedbackTable.userId, userId)
      )
    )
    .execute();

  return feedback || null;
}

export async function getLatestInterviews(
  params: GetLatestInterviewsParams
): Promise<Interview[] | null> {
  const { userId, limit = 20 } = params;

  const interviews = await db
    .select()
    .from(interviewsTable)
    .where(
      and(
        eq(interviewsTable.finalized, true),
        ne(interviewsTable.userId, userId)
      )
    )
    .orderBy(desc(interviewsTable.createdAt))
    .limit(limit)
    .execute();

  return interviews;
}

export async function getInterviewsByUserId(
  userId: string
): Promise<Interview[] | null> {
  const interviews = await db
    .select()
    .from(interviewsTable)
    .where(eq(interviewsTable.userId, userId))
    .orderBy(desc(interviewsTable.createdAt))
    .execute();

  return interviews;
}
