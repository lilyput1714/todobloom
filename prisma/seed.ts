import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Clear existing data
  await prisma.todo.deleteMany();

  // Create sample todos
  const sampleTodos = [
    {
      text: 'Explore Todo Bloom features',
      completed: false,
      order: 0,
    },
    {
      text: 'Drag and drop to reorder',
      completed: false,
      order: 1,
    },
    {
      text: 'Mark a task as complete',
      completed: true,
      completedAt: new Date(),
      order: 2,
    },
    {
      text: 'Submit project proposal',
      completed: false,
      dueDate: new Date(new Date().setDate(new Date().getDate() - 1)),
      order: 3,
    },
  ];

  for (const todo of sampleTodos) {
    await prisma.todo.create({
      data: todo,
    });
  }

  console.log('✅ Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
