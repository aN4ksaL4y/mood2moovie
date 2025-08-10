'use server';

/**
 * @fileOverview Provides a movie recommendation based on a mood.
 *
 * - generateMovieRecommendation - A function to generate a movie recommendation.
 * - MovieRecommendationInput - The input type for the generateMovieRecommendation function.
 * - MovieRecommendationOutput - The return type for the generateMovieRecommendation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const MovieRecommendationInputSchema = z.object({
  mood: z
    .string()
    .describe(
      'The mood of the user.'
    ),
});
export type MovieRecommendationInput = z.infer<typeof MovieRecommendationInputSchema>;

const MovieRecommendationOutputSchema = z.object({
    title: z.string().describe("The title of the recommended movie."),
    reason: z.string().describe("A short reason why this movie is recommended for the mood."),
});
export type MovieRecommendationOutput = z.infer<typeof MovieRecommendationOutputSchema>;

export async function generateMovieRecommendation(
  input: MovieRecommendationInput
): Promise<MovieRecommendationOutput> {
  return movieRecommendationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'movieRecommendationPrompt',
  input: {schema: MovieRecommendationInputSchema},
  output: {schema: MovieRecommendationOutputSchema},
  prompt: `You are a movie expert. Based on the user's mood, recommend a single movie that would be a good fit. Provide the movie title and a short, compelling reason.

Mood: {{{mood}}}
`,
});

const movieRecommendationFlow = ai.defineFlow(
  {
    name: 'movieRecommendationFlow',
    inputSchema: MovieRecommendationInputSchema,
    outputSchema: MovieRecommendationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
