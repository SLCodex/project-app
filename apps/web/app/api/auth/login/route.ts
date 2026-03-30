import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { signJwt } from '@/lib/jwt';
import { loginSchema } from '@/lib/validation';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const { email, password } = parsed.data;

    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        password: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'Invalid credentials.' }, { status: 401 });
    }

    const passwordMatches = await bcrypt.compare(password, user.password);

    if (!passwordMatches) {
      return NextResponse.json({ error: 'Invalid credentials.' }, { status: 401 });
    }

    const token = signJwt({ userId: user.id, email: user.email });

    return NextResponse.json({ token, user: { id: user.id, email: user.email } });
  } catch {
    return NextResponse.json({ error: 'Unable to login.' }, { status: 500 });
  }
}
