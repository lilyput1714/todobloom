import TodoList from '@/components/todo/todo-list';

export default function Home() {
  return (
    <main className="flex min-h-screen w-full flex-col items-center bg-background p-4 sm:p-8">
      <div className="w-full max-w-2xl">
        <header className="text-center mb-8">
          <h1 className="text-5xl font-bold font-headline text-primary">Todo Bloom</h1>
          <p className="text-muted-foreground mt-2">Blossom your productivity, one task at a time.</p>
        </header>
        <div className="w-full">
            <TodoList />
        </div>
      </div>
    </main>
  );
}
