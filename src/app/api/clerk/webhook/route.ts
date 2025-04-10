import { db, User, usersTable } from '@/lib';
import { APIErrorResponse, APIResponse } from '@/types';
import { NextRequest, NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';

export async function GET(
  req: NextRequest
): Promise<NextResponse<APIResponse<User> | APIErrorResponse>> {
  try {
    const body = await req.json();
    const { id, name, email, createdAt, updatedAt } = body.data;

    if (!id || !name || !email) {
      return NextResponse.json({
        error: 'Missing required fields',
        success: false,
        timestamp: new Date().toISOString(),
        statusCode: 400,
      });
    }

    // Check if the user already exists in the database
    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, id))
      .execute();

    // Check if user exists in the database
    if (!user) {
      const [newUser] = await db
        .insert(usersTable)
        .values({
          id,
          name,
          email,
          createdAt: new Date(createdAt),
          updatedAt: new Date(updatedAt),
        })
        .returning();

      return NextResponse.json({
        data: newUser,
        message: 'User created successfully',
        success: true,
        timestamp: new Date().toISOString(),
        statusCode: 201,
      });
    }

    // Check previous user data and update if necessary
    if (user.name === name && user.email === email) {
      return NextResponse.json({
        data: user,
        message: 'No changes made',
        success: true,
        timestamp: new Date().toISOString(),
        statusCode: 200,
      });
    }

    // update user if they exist
    await db
      .update(usersTable)
      .set({
        name,
        email,
        updatedAt: new Date(updatedAt),
      })
      .where(eq(usersTable.id, id))
      .execute();

    // Fetch the updated user data
    return NextResponse.json({
      data: user,
      message: 'User updated successfully',
      success: true,
      timestamp: new Date().toISOString(),
      statusCode: 200,
    });
  } catch (error: unknown) {
    return NextResponse.json({
      error:
        error instanceof Error ? error.message : 'An unknown error occurred',
      success: false,
      timestamp: new Date().toISOString(),
      statusCode: 500,
    });
  }
}
