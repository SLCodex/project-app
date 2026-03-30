import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromAuthHeader } from '@/lib/auth';
import { updateTaskSchema } from '@/lib/validation';

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PUT(request: NextRequest, context: RouteContext) {
  const user = getUserFromAuthHeader(request);

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await context.params;
    const body = await request.json();
    const parsed = updateTaskSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const existingTask = await prisma.task.findFirst({ where: { id, userId: user.userId } });

    if (!existingTask) {
      return NextResponse.json({ error: 'Task not found.' }, { status: 404 });
    }

    const task = await prisma.task.update({
      where: { id },
      data: parsed.data,
    });

    return NextResponse.json(task);
  } catch {
    return NextResponse.json({ error: 'Unable to update task.' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  const user = getUserFromAuthHeader(request);

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await context.params;
    const existingTask = await prisma.task.findFirst({ where: { id, userId: user.userId } });

    if (!existingTask) {
      return NextResponse.json({ error: 'Task not found.' }, { status: 404 });
    }

    await prisma.task.delete({ where: { id } });

    return NextResponse.json({ message: 'Task deleted.' });
  } catch {
    return NextResponse.json({ error: 'Unable to delete task.' }, { status: 500 });
  }
}
