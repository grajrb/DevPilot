import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  // Return current user from session cookie
  const token = cookies().get('devpilot_token')?.value;

  if (!token) {
    return NextResponse.json({ user: null }, { status: 200 });
  }

  try {
    // Verify token with platform backend
    const res = await fetch(`${process.env.PLATFORM_URL}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
      throw new Error('Invalid token');
    }

    const data = await res.json();
    return NextResponse.json({ user: data.user });
  } catch (error) {
    return NextResponse.json({ user: null }, { status: 200 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Authenticate with platform backend
    const res = await fetch(`${process.env.PLATFORM_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      const error = await res.json();
      return NextResponse.json(
        { message: error.message || 'Login failed' },
        { status: res.status }
      );
    }

    const data = await res.json();

    // Set cookie
    cookies().set('devpilot_token', data.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    return NextResponse.json({ user: data.user, token: data.token });
  } catch (error) {
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
