import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { signJwt } from '@/lib/jwt';
import { registerSchema } from '@/lib/validation';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const { email, password } = parsed.data;

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: 'Email already registered.' }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
      select: {
        id: true,
        email: true,
      },
    });

    const token = signJwt({ userId: user.id, email: user.email });

    return NextResponse.json({ token, user }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Unable to register user.' }, { status: 500 });
  }
}
