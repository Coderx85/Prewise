import { db, usersTable } from '@/lib';
import { NextRequest, NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { data } = body;

    const {
      id,
      full_name,
      user_name,
      email_addresses,
      first_name,
      last_name,
      created_at,
      updated_at,
    } = data;

    const email = email_addresses?.[0]?.email_address;

    console.log(`
      Clerk webhook received:
      Email Address: ${email}
      Name: ${full_name}
      Username: ${user_name}
      Clerk ID: ${id}
    `);

    // Validate required fields
    if (!id || !email || !first_name) {
      return new NextResponse('Missing required fields', { status: 400 });
    }

    const name = `${first_name} ${last_name || ''}`.trim();

    // Check if user already exists
    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, id))
      .execute();

    if (!user) {
      await db.insert(usersTable).values({
        id,
        name,
        email,
        createdAt: new Date(created_at),
        updatedAt: new Date(updated_at),
      });

      return new NextResponse('User created successfully', { status: 201 });
    }

    // No change needed
    if (user.name === name && user.email === email) {
      return new NextResponse('User already exists', { status: 200 });
    }

    // Update user info
    await db
      .update(usersTable)
      .set({
        name,
        email,
        updatedAt: new Date(updated_at),
      })
      .where(eq(usersTable.id, id));

    return new NextResponse('User updated successfully', { status: 200 });
  } catch (error: unknown) {
    console.error('Webhook error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
