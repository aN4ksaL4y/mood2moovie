'use server';

import { generateJournalingPrompt } from '@/ai/flows/journal-prompt';
import type { MoodEntry } from './types';

export async function getJournalingPromptAction(
  moodHistory: MoodEntry[]
): Promise<{ prompt: string } | { error: string }> {
  try {
    if (moodHistory.length === 0) {
      return { prompt: "What's on your mind today?" };
    }

    const moodSummary = moodHistory
      .slice(0, 7) // Use recent history
      .reduce((acc, entry) => {
        acc[entry.mood] = (acc[entry.mood] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

    const moodHistoryString = Object.entries(moodSummary)
      .map(([mood, count]) => `${count} day(s) feeling ${mood}`)
      .join(', ');

    const result = await generateJournalingPrompt({
      moodHistory: `Recent moods: ${moodHistoryString}.`,
    });

    if (result.prompt) {
      return { prompt: result.prompt };
    } else {
      return { error: 'Could not generate a prompt. Please try again.' };
    }
  } catch (error) {
    console.error(error);
    return { error: 'An unexpected error occurred while generating the prompt.' };
  }
}
