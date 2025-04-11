import { db, usersTable } from '@/lib';
import { NextRequest, NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      id,
      email_addresses: email,
      full_name: name,
      createdAt,
      updatedAt,
    } = body?.data || {};

    // Check if the user already exists in the database
    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, id))
      .execute();

    // Check if user exists in the database
    if (!user) {
      await db
        .insert(usersTable)
        .values({
          id,
          name,
          email,
          createdAt: new Date(createdAt),
          updatedAt: new Date(updatedAt),
        })
        .returning();

      return new NextResponse('User created successfully', { status: 201 });
    }

    // Check previous user data and update if necessary
    if (user.name === name && user.email === email) {
      return new NextResponse('User already exists', { status: 200 });
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
      .returning();

    // Fetch the updated user data
    return new NextResponse('User updated successfully', { status: 200 });
  } catch (error: unknown) {
    return new NextResponse(`Internal Server Error:: ${error}`, {
      status: 500,
    });
  }
}
