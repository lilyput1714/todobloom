'use server';

import { suggestTodoCompletion } from '@/ai/flows/suggest-todo-completion';

export async function suggestCompletionAction(partialDescription: string): Promise<string> {
  if (!partialDescription) {
    return '';
  }

  try {
    const result = await suggestTodoCompletion({ partialDescription });
    return result.completion;
  } catch (error) {
    console.error('Error suggesting completion:', error);
    // Silently fail, as this is an enhancement not a critical feature.
    return '';
  }
}
