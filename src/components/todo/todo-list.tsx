'use client';

import { useState, useMemo, useRef } from 'react';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import TodoInput from './todo-input';
import TodoItem from './todo-item';
import type { Todo } from '@/lib/types';
import { Card, CardContent } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '../ui/button';
import { Download, Filter, ArrowDownUp, X, Loader2 } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Calendar } from '../ui/calendar';
import { format, isSameDay } from 'date-fns';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { useTodos } from '@/hooks/use-todos';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function TodoList() {
  const { todos, loading, error, addTodo, toggleTodo, deleteTodo, updateTodoOrder } = useTodos();
  const [todoToDelete, setTodoToDelete] = useState<string | null>(null);
  const [filterDate, setFilterDate] = useState<Date | undefined>();
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const completedListRef = useRef<HTMLDivElement>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleAddTodo = async (text: string, dueDate?: Date) => {
    try {
      await addTodo(text, dueDate);
    } catch (error) {
      console.error('Failed to add todo:', error);
    }
  };

  const handleToggleTodo = async (id: string) => {
    try {
      await toggleTodo(id);
    } catch (error) {
      console.error('Failed to toggle todo:', error);
    }
  };

  const requestDeleteTodo = (id: string) => {
    setTodoToDelete(id);
  };
  
  const confirmDeleteTodo = async () => {
    if (todoToDelete) {
      try {
        await deleteTodo(todoToDelete);
        setTodoToDelete(null);
      } catch (error) {
        console.error('Failed to delete todo:', error);
      }
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = todos.findIndex(item => item.id === active.id);
      const newIndex = todos.findIndex(item => item.id === over.id);
      
      if (oldIndex !== -1 && newIndex !== -1) {
        const reorderedTodos = arrayMove(todos, oldIndex, newIndex);
        
        // Update the order in the database for each affected todo
        const activeTodo = todos[oldIndex];
        if (activeTodo && !activeTodo.completed) {
          try {
            await updateTodoOrder(activeTodo.id, newIndex);
          } catch (error) {
            console.error('Failed to update todo order:', error);
          }
        }
      }
    }
  };

  const downloadPdf = () => {
    const pdf = new jsPDF('p', 'pt', 'a4');
    const pageTitle = `Completed Tasks - ${format(filterDate || new Date(), 'PPP')}`;
    
    pdf.setFontSize(18);
    pdf.text(pageTitle, 40, 60);

    const tableHeaders = ['Time', 'Task'];
    const tableData = completedTodos.map(todo => [
      todo.completedAt ? format(new Date(todo.completedAt), 'p') : 'N/A',
      todo.text,
    ]);

    let startY = 90;
    const startX = 40;
    const rowHeight = 25;
    const colWidths = [100, 400];
    
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    
    // Draw table headers
    tableHeaders.forEach((header, i) => {
        pdf.text(header, startX + colWidths.slice(0, i).reduce((a, b) => a + b, 0), startY);
    });
    
    pdf.setLineWidth(1);
    pdf.line(startX, startY + 10, startX + colWidths.reduce((a, b) => a + b, 0), startY + 10);

    startY += 25;
    
    pdf.setFont('helvetica', 'normal');

    // Draw table rows
    tableData.forEach((row, rowIndex) => {
        let currentY = startY + (rowIndex * rowHeight);
        
        row.forEach((cell, colIndex) => {
            const textLines = pdf.splitTextToSize(cell, colWidths[colIndex] - 10); // -10 for padding
            pdf.text(textLines, startX + colWidths.slice(0, colIndex).reduce((a, b) => a + b, 0), currentY);
        });
    });

    pdf.save(`completed-tasks-${format(new Date(), 'yyyy-MM-dd')}.pdf`);
  };
  
  const activeTodos = todos.filter(t => !t.completed);
  
  const completedTodos = useMemo(() => {
    let filtered = todos.filter(t => t.completed);

    if (filterDate) {
        filtered = filtered.filter(t => t.completedAt && isSameDay(new Date(t.completedAt), filterDate));
    }
    
    return filtered.sort((a, b) => {
        const dateA = a.completedAt ? new Date(a.completedAt).getTime() : 0;
        const dateB = b.completedAt ? new Date(b.completedAt).getTime() : 0;
        return sortOrder === 'desc' ? dateB - dateA : dateA - dateB; 
    });

  }, [todos, filterDate, sortOrder]);


  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading todos...</span>
      </div>
    );
  }

  if (error) {
    return (
      <Alert className="mb-4">
        <AlertDescription>
          Error loading todos: {error}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <>
      <TodoInput onAddTodo={handleAddTodo} />
        <Tabs defaultValue="active" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>
          <TabsContent value="active">
            <Card>
                <CardContent className="p-4">
                    {activeTodos.length > 0 ? (
                        <DndContext
                            sensors={sensors}
                            collisionDetection={closestCenter}
                            onDragEnd={handleDragEnd}
                        >
                            <SortableContext items={activeTodos} strategy={verticalListSortingStrategy}>
                                <div className="space-y-3">
                                {activeTodos.map(todo => (
                                    <TodoItem
                                        key={todo.id}
                                        todo={todo}
                                        onToggle={handleToggleTodo}
                                        onDelete={requestDeleteTodo}
                                    />
                                ))}
                                </div>
                            </SortableContext>
                        </DndContext>
                    ) : (
                        <div className="text-center py-10 text-muted-foreground">
                            <p className="font-semibold">All clear!</p>
                            <p>Add a new task to get started.</p>
                        </div>
                    )}
                </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="completed">
           <Card>
                <CardContent className="p-4">
                    <div className="flex flex-wrap gap-2 items-center mb-4">
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button variant="outline" className="gap-2">
                                    <Filter className="h-4 w-4" />
                                    <span>{filterDate ? format(filterDate, 'PPP') : 'Filter by Date'}</span>
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                                <Calendar
                                mode="single"
                                selected={filterDate}
                                onSelect={setFilterDate}
                                initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                         {filterDate && (
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setFilterDate(undefined)}>
                                <X className="h-4 w-4"/>
                            </Button>
                         )}

                        <Button variant="outline" className="gap-2" onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}>
                            <ArrowDownUp className="h-4 w-4" />
                            <span>Sort by Time ({sortOrder === 'desc' ? 'Newest' : 'Oldest'})</span>
                        </Button>
                        <Button variant="outline" className="gap-2" onClick={downloadPdf}>
                            <Download className="h-4 w-4" />
                            <span>Download PDF</span>
                        </Button>
                    </div>

                    <div ref={completedListRef} className="bg-background p-4 rounded-lg">
                        {completedTodos.length > 0 ? (
                            <div className="space-y-3">
                            {completedTodos.map(todo => (
                                <TodoItem
                                    key={todo.id}
                                    todo={todo}
                                    onToggle={handleToggleTodo}
                                    onDelete={requestDeleteTodo}
                                />
                            ))}
                            </div>
                        ) : (
                            <div className="text-center py-10 text-muted-foreground">
                                <p className="font-semibold">No completed tasks yet.</p>
                                <p>{filterDate ? "Try a different date or clear the filter." : "Get something done!"}</p>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
          </TabsContent>
        </Tabs>


      <AlertDialog open={!!todoToDelete} onOpenChange={(open) => !open && setTodoToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your todo item.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setTodoToDelete(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteTodo}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
