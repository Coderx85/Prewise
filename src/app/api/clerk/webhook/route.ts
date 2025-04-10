import { db, usersTable } from '@/lib';
import { NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (
      !body?.data?.id ||
      !body?.data?.email_addresses?.[0]?.email_address ||
      !body?.data?.first_name
    ) {
      return '';
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
