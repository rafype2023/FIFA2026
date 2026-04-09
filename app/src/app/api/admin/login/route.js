import { NextResponse } from 'next/server';

export async function POST(request) {
  const { code } = await request.json();

  if (!process.env.FIFACODE) {
    return NextResponse.json({ message: 'FIFACODE not configured on server.' }, { status: 500 });
  }

  if (code === process.env.FIFACODE) {
    const response = NextResponse.json({ success: true });
    response.cookies.set('fifaAdmin', process.env.FIFACODE, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 8, // 8 hours
      path: '/',
    });
    return response;
  }

  return NextResponse.json({ success: false, message: 'Código incorrecto.' }, { status: 401 });
}
