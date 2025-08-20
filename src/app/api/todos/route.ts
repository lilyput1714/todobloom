import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { z } from 'zod';

const createTodoSchema = z.object({
  text: z.string().min(1, 'Text is required'),
  dueDate: z.string().optional(),
});

export async function GET() {
  try {
    const todos = await prisma.todo.findMany({
      orderBy: [
        { completed: 'asc' },
        { order: 'asc' },
        { createdAt: 'desc' }
      ],
    });
    
    return NextResponse.json(todos);
  } catch (error) {
    console.error('Error fetching todos:', error);
    return NextResponse.json(
      { error: 'Failed to fetch todos' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { text, dueDate } = createTodoSchema.parse(body);
    
    // Get the highest order value for new todos
    const maxOrder = await prisma.todo.aggregate({
      _max: { order: true },
      where: { completed: false }
    });
    
    const newOrder = (maxOrder._max.order ?? -1) + 1;
    
    const todo = await prisma.todo.create({
      data: {
        text,
        dueDate: dueDate ? new Date(dueDate) : null,
        order: newOrder,
      },
    });
    
    return NextResponse.json(todo, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      );
    }
    
    console.error('Error creating todo:', error);
    return NextResponse.json(
      { error: 'Failed to create todo' },
      { status: 500 }
    );
  }
}
