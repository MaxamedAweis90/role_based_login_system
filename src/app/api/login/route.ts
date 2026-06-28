import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { signJWT } from '@/lib/jwt';
import { RowDataPacket } from 'mysql2';

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      );
    }

    // Query the database for the user
    const [rows] = await pool.execute<RowDataPacket[]>(
      'SELECT id, username, password, role FROM users WHERE username = ?',
      [username]
    );

    if (rows.length === 0) {
      return NextResponse.json(
        { error: 'Invalid username or password' },
        { status: 401 }
      );
    }

    const user = rows[0];

    // Password validation (plain-text as requested)
    if (user.password !== password) {
      return NextResponse.json(
        { error: 'Invalid username or password' },
        { status: 401 }
      );
    }

    // Generate JWT token containing username and role
    const token = signJWT({
      id: user.id,
      username: user.username,
      role: user.role,
    });

    // Create the response and set HTTP-only cookie
    const response = NextResponse.json({
      success: true,
      username: user.username,
      role: user.role,
    });

    response.cookies.set({
      name: 'auth_token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 3600, // 1 hour in seconds
      path: '/',
    });

    return response;
  } catch (error: any) {
    console.error('Login API error:', error);
    return NextResponse.json(
      { error: 'Internal server error. Please try again later.' },
      { status: 500 }
    );
  }
}
