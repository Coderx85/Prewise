import { db, User, usersTable } from '@/lib';
import { APIErrorResponse, APIResponse } from '@/types';
import { NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';

export async function POST(
  req: Request
): Promise<NextResponse<APIResponse<User> | APIErrorResponse>> {
  try {
    const body = await req.json();

    if (
      !body?.data?.id ||
      !body?.data?.email_addresses?.[0]?.email_address ||
      !body?.data?.first_name
    ) {
      return NextResponse.json({
        error: 'Missing required fields',
        success: false,
        timestamp: new Date().toISOString(),
        statusCode: 400,
      });
    }

    const id = body.data.id;
    const email = body.data.email_addresses[0].email_address;
    const name = `${body.data.first_name} ${body.data.last_name || ''}`.trim();
    const createdAt = body.data.created_at;
    const updatedAt = body.data.updated_at;

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
    const [updatedUser] = await db
      .update(usersTable)
      .set({
        name,
        email,
        updatedAt: new Date(updatedAt),
      })
      .where(eq(usersTable.id, id))
      .returning();

    // Fetch the updated user data
    return NextResponse.json({
      data: updatedUser,
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
