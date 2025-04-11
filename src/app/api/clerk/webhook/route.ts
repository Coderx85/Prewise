import { db, usersTable } from '@/lib';
import { NextRequest, NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { data } = body;
    console.log(
      `
      Clerk webhook received:: \n
      Email Address: ${body.data.email_addresses[0].email_address} \n
      Name: ${body.data.full_name} \n
      UserName: ${body.data.user_name}}\n
      Clerk ID: ${body.data.id}
      `
    );

    if (
      !data?.id ||
      !data?.email_addresses?.[0]?.email_address ||
      !data?.first_name
    ) {
      return new NextResponse('Missing required fields', { status: 400 });
    }

    const id = data.id;
    const email = data.email_addresses[0].email_address;
    const name = `${data.first_name} ${data.last_name || ''}`.trim();
    const createdAt = new Date(data.created_at);
    const updatedAt = new Date(data.updated_at);

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
