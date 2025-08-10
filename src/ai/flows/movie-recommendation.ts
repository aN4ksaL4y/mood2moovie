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
    imdbId: z.string().describe("The IMDB ID of the recommended movie (e.g., 'tt0111161')."),
    reason: z.string().describe("A short, casual, and friendly reason in Indonesian why this movie is recommended for the mood."),
    trailerUrl: z.string().url().describe("The YouTube URL for the movie's trailer."),
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
  prompt: `You are a movie expert. Based on the user's mood, recommend a single Hollywood movie that would be a good fit. Provide the movie title, its IMDB ID, a short, compelling, and casual reason in Indonesian, and a valid YouTube URL for its official trailer.

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
