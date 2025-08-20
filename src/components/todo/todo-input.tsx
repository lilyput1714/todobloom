'use client';

import { useState, useRef, useTransition, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Sparkles, Calendar as CalendarIcon, X } from 'lucide-react';
import { suggestCompletionAction } from '@/app/actions';
import { cn } from '@/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { Label } from '../ui/label';

type TodoInputProps = {
  onAddTodo: (text: string, dueDate?: Date) => void;
};

export default function TodoInput({ onAddTodo }: TodoInputProps) {
  const [newTodo, setNewTodo] = useState('');
  const [suggestion, setSuggestion] = useState('');
  const [dueDate, setDueDate] = useState<Date | undefined>();
  const [isPending, startTransition] = useTransition();
  const suggestionTimeout = useRef<NodeJS.Timeout | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNewTodo(value);
    setSuggestion(''); // Clear previous suggestion

    if (suggestionTimeout.current) {
      clearTimeout(suggestionTimeout.current);
    }

    if (value.length > 3) {
      suggestionTimeout.current = setTimeout(() => {
        startTransition(async () => {
          const result = await suggestCompletionAction(value);
          if (result) {
            setSuggestion(result);
          }
        });
      }, 500); // Debounce for 500ms
    }
  };

  const clearState = () => {
    setNewTodo('');
    setSuggestion('');
    setDueDate(undefined);
    if (suggestionTimeout.current) clearTimeout(suggestionTimeout.current);
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTodo.trim()) {
      onAddTodo(newTodo.trim(), dueDate);
      clearState();
    }
  };
  
  const handleSuggestionClick = () => {
    onAddTodo(`${newTodo}${suggestion}`, dueDate);
    clearState();
  }
  
  const handleTimeChange = (type: 'hours' | 'minutes', value: string) => {
    if (!dueDate) return;
    const newDate = new Date(dueDate);
    const numericValue = parseInt(value, 10);

    if (isNaN(numericValue)) return;

    if (type === 'hours') {
        if (numericValue >= 0 && numericValue < 24) {
            newDate.setHours(numericValue);
        }
    } else if (type === 'minutes') {
        if (numericValue >= 0 && numericValue < 60) {
            newDate.setMinutes(numericValue);
        }
    }
    setDueDate(newDate);
  }

  return (
    <div className="relative mb-6">
      <form onSubmit={handleSubmit} className="flex gap-2 items-center">
        <Input
          type="text"
          value={newTodo}
          onChange={handleInputChange}
          placeholder="What needs to be done?"
          className="flex-grow text-base"
          aria-label="New todo input"
        />
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              size="icon"
              className={cn(
                "w-10 h-10 shrink-0",
                !dueDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="h-5 w-5" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            {dueDate && (
              <div className="p-4 border-b">
                <div className="flex items-center gap-2">
                  <div>
                    <Label htmlFor="hours" className="text-xs">Hours</Label>
                    <Input id="hours" type="number" min="0" max="23" 
                           value={dueDate.getHours().toString().padStart(2, '0')}
                           onChange={e => handleTimeChange('hours', e.target.value)}
                           className="w-20 h-9"
                    />
                  </div>
                  <div>
                    <Label htmlFor="minutes" className="text-xs">Minutes</Label>
                    <Input id="minutes" type="number" min="0" max="59"
                           value={dueDate.getMinutes().toString().padStart(2, '0')}
                           onChange={e => handleTimeChange('minutes', e.target.value)}
                           className="w-20 h-9"
                     />
                  </div>
                </div>
              </div>
            )}
            <Calendar
              mode="single"
              selected={dueDate}
              onSelect={(date) => {
                  const newDate = date || new Date();
                  const oldHours = dueDate?.getHours() ?? 12;
                  const oldMinutes = dueDate?.getMinutes() ?? 0;
                  newDate.setHours(oldHours);
                  newDate.setMinutes(oldMinutes);
                  setDueDate(newDate);
              }}
              initialFocus
            />
          </PopoverContent>
        </Popover>
        <Button type="submit" size="icon" aria-label="Add todo">
          <Plus className="h-5 w-5" />
        </Button>
      </form>
       {dueDate && (
        <div className="text-sm mt-2 flex items-center">
          <span className="text-muted-foreground mr-2">Due: {format(dueDate, "PPP p")}</span>
           <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full" onClick={() => setDueDate(undefined)}>
              <X className="h-4 w-4" />
           </Button>
        </div>
      )}
      { (isPending || suggestion) && (
        <div className="absolute top-full left-0 right-0 mt-2 z-10">
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-start p-3 h-auto bg-card border shadow-lg text-left text-muted-foreground",
              isPending && 'animate-pulse'
            )}
            onClick={handleSuggestionClick}
            disabled={isPending || !suggestion}
            aria-live="polite"
          >
            <Sparkles className="mr-2 h-4 w-4 text-accent-foreground/80 shrink-0" />
            {isPending ? "Thinking..." : (
                <p>
                    <span className="text-foreground">{newTodo}</span>
                    <span className="text-primary font-semibold">{suggestion}</span>
                </p>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
