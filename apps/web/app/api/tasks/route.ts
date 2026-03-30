import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromAuthHeader } from '@/lib/auth';
import { createTaskSchema } from '@/lib/validation';

export async function GET(request: NextRequest) {
  const user = getUserFromAuthHeader(request);

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const tasks = await prisma.task.findMany({
    where: { userId: user.userId },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json(tasks);
}

export async function POST(request: NextRequest) {
  const user = getUserFromAuthHeader(request);

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const parsed = createTaskSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const task = await prisma.task.create({
      data: {
        title: parsed.data.title,
        userId: user.userId,
      },
    });

    return NextResponse.json(task, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Unable to create task.' }, { status: 500 });
  }
}
