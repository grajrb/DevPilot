import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  const token = cookies().get('devpilot_token')?.value;

  if (!token) {
    return NextResponse.json({ user: null }, { status: 200 });
  }

  try {
    const res = await fetch(`${process.env.PLATFORM_URL}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    const data = await res.json();
    return NextResponse.json({ user: data.user });
  } catch {
    return NextResponse.json({ user: null }, { status: 200 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

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

    cookies().set('devpilot_token', data.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });

    return NextResponse.json({ user: data.user });
  } catch {
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  cookies().delete('devpilot_token');
  return NextResponse.json({ success: true });
}
