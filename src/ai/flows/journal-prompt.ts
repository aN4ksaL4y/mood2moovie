'use server';

/**
 * @fileOverview Provides tailored journaling prompts based on mood history.
 *
 * - generateJournalingPrompt - A function to generate a journal prompt.
 * - JournalingPromptInput - The input type for the generateJournalingPrompt function.
 * - JournalingPromptOutput - The return type for the generateJournalingPrompt function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const JournalingPromptInputSchema = z.object({
  moodHistory: z
    .string()
    .describe(
      'A summary of the users recent mood history, including dates and mood descriptions.'
    ),
});
export type JournalingPromptInput = z.infer<typeof JournalingPromptInputSchema>;

const JournalingPromptOutputSchema = z.object({
  prompt: z.string().describe('A tailored journaling prompt.'),
});
export type JournalingPromptOutput = z.infer<typeof JournalingPromptOutputSchema>;

export async function generateJournalingPrompt(
  input: JournalingPromptInput
): Promise<JournalingPromptOutput> {
  return generateJournalingPromptFlow(input);
}

const prompt = ai.definePrompt({
  name: 'journalingPrompt',
  input: {schema: JournalingPromptInputSchema},
  output: {schema: JournalingPromptOutputSchema},
  prompt: `Based on the user's recent mood history, create a tailored journaling prompt to help them explore their emotions more deeply and gain new insights.

Mood History: {{{moodHistory}}}

Journaling Prompt:`,
});

const generateJournalingPromptFlow = ai.defineFlow(
  {
    name: 'generateJournalingPromptFlow',
    inputSchema: JournalingPromptInputSchema,
    outputSchema: JournalingPromptOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
