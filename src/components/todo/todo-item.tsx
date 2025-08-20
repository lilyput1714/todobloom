'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { format, isPast } from 'date-fns';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { GripVertical, Trash2, Clock } from 'lucide-react';
import type { Todo } from '@/lib/types';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';

type TodoItemProps = {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
};

export default function TodoItem({ todo, onToggle, onDelete }: TodoItemProps) {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: todo.id, disabled: todo.completed });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 'auto',
  };

  const isOverdue = isClient && todo.dueDate && !todo.completed ? isPast(new Date(todo.dueDate)) : false;

  const DragHandle = !todo.completed && isClient ? (
    <div {...attributes} {...listeners} className="cursor-grab p-2">
      <GripVertical className="h-5 w-5 text-muted-foreground" />
    </div>
  ) : (
    <div className="p-2 w-9 h-9"></div>
  );

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={cn(
        'flex items-center gap-3 p-3 transition-all',
        isDragging ? 'shadow-2xl scale-105' : 'shadow-md',
        todo.completed ? '' : 'touch-none',
        isOverdue && 'bg-yellow-100 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800/20',
        'todo-item'
      )}
      data-completed={todo.completed}
    >
      {DragHandle}
      <Checkbox
        id={`todo-${todo.id}`}
        checked={todo.completed}
        onCheckedChange={() => onToggle(todo.id)}
        className="h-6 w-6 rounded-full"
        aria-labelledby={`todo-text-${todo.id}`}
      />
      <div className="flex-grow">
        <label
          htmlFor={`todo-${todo.id}`}
          id={`todo-text-${todo.id}`}
          className={cn(
            'flex-grow text-foreground transition-all',
            todo.completed && 'line-through text-muted-foreground opacity-70'
          )}
        >
          {todo.text}
        </label>
         <div className="text-xs text-muted-foreground mt-1 flex items-center gap-2">
            {todo.dueDate && (
                <p className={cn("flex items-center gap-1", isOverdue && 'text-yellow-700 dark:text-yellow-400 font-medium')}>
                    <Clock className="h-3 w-3" />
                    Due: {isClient ? format(new Date(todo.dueDate), "MMM d, yyyy 'at' p") : ""}
                </p>
            )}
            {todo.completed && todo.completedAt && (
                <p>
                    Completed: {isClient ? format(new Date(todo.completedAt), "MMM d, yyyy 'at' h:mm a") : ""}
                </p>
            )}
         </div>
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onDelete(todo.id)}
        className="text-muted-foreground hover:text-destructive rounded-full"
        aria-label={`Delete todo: ${todo.text}`}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </Card>
  );
}
