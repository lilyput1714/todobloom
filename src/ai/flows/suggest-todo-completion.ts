'use server';

/**
 * @fileOverview A smart todo completion suggestion AI agent.
 *
 * - suggestTodoCompletion - A function that suggests completions for a todo item description.
 * - SuggestTodoCompletionInput - The input type for the suggestTodoCompletion function.
 * - SuggestTodoCompletionOutput - The return type for the suggestTodoCompletion function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestTodoCompletionInputSchema = z.object({
  partialDescription: z
    .string()
    .describe('The partial description of the todo item to complete.'),
});
export type SuggestTodoCompletionInput = z.infer<typeof SuggestTodoCompletionInputSchema>;

const SuggestTodoCompletionOutputSchema = z.object({
  completion: z
    .string()
    .describe('The suggested completion for the todo item description.'),
});
export type SuggestTodoCompletionOutput = z.infer<typeof SuggestTodoCompletionOutputSchema>;

export async function suggestTodoCompletion(
  input: SuggestTodoCompletionInput
): Promise<SuggestTodoCompletionOutput> {
  return suggestTodoCompletionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestTodoCompletionPrompt',
  input: {schema: SuggestTodoCompletionInputSchema},
  output: {schema: SuggestTodoCompletionOutputSchema},
  prompt: `You are a helpful assistant that suggests completions for todo item descriptions.

  Suggest a completion for the following partial description:

  {{partialDescription}}

  Completion: `,
});

const suggestTodoCompletionFlow = ai.defineFlow(
  {
    name: 'suggestTodoCompletionFlow',
    inputSchema: SuggestTodoCompletionInputSchema,
    outputSchema: SuggestTodoCompletionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
