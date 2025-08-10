'use client';

import { useState, useTransition } from 'react';
import { format } from 'date-fns';
import { Sparkles, Loader2, Send } from 'lucide-react';
import type { Mood, MoodOption, MoodEntry } from '@/lib/types';
import { useMoodData } from '@/hooks/use-mood-data';
import { getJournalingPromptAction } from '@/lib/actions';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from './ui/skeleton';

const moodOptions: MoodOption[] = [
  { mood: 'Happy', emoji: '😊', value: 5 },
  { mood: 'Excited', emoji: '🤩', value: 5 },
  { mood: 'Proud', emoji: '🥳', value: 5 },
  { mood: 'Grateful', emoji: '🙏', value: 4 },
  { mood: 'Calm', emoji: '😌', value: 4 },
  { mood: 'Content', emoji: '🙂', value: 4 },
  { mood: 'Sad', emoji: '😢', value: 2 },
  { mood: 'Tired', emoji: '😴', value: 2 },
  { mood: 'Anxious', emoji: '😟', value: 1 },
  { mood: 'Angry', emoji: '😠', value: 1 },
  { mood: 'Stressed', emoji: '😫', value: 1 },
];

export function DashboardClient() {
  const { moodHistory, addMoodEntry, isLoaded } = useMoodData();
  const [selectedMood, setSelectedMood] = useState<MoodOption | null>(null);
  const [journalText, setJournalText] = useState('');
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleGetPrompt = () => {
    startTransition(async () => {
      const result = await getJournalingPromptAction(moodHistory);
      if ('prompt' in result) {
        setJournalText(result.prompt);
      } else {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: result.error,
        });
      }
    });
  };

  const handleSaveEntry = () => {
    if (!selectedMood) return;
    addMoodEntry({
      mood: selectedMood.mood,
      emoji: selectedMood.emoji,
      journal: journalText,
      value: selectedMood.value,
    });
    toast({
      title: 'Entry Saved',
      description: `Your mood has been logged as ${selectedMood.mood}.`,
    });
    setSelectedMood(null);
    setJournalText('');
  };

  const todayEntry = moodHistory.find(
    (entry) => format(new Date(entry.date), 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')
  );

  return (
    <div className="flex flex-col gap-6">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="font-headline">How are you feeling today?</CardTitle>
          <CardDescription>Select a mood to log your entry.</CardDescription>
        </CardHeader>
        <CardContent>
          {todayEntry ? (
            <div className="text-center p-8 rounded-lg bg-muted/50">
              <p className="text-4xl">{todayEntry.emoji}</p>
              <p className="mt-2 text-lg font-medium">You've already logged your mood today as <span className="font-bold text-primary">{todayEntry.mood}</span>.</p>
              <p className="text-muted-foreground mt-1">Come back tomorrow to log again!</p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {moodOptions.map((option) => (
                  <Button
                    key={option.mood}
                    variant="outline"
                    className={cn(
                      'flex flex-col h-24 gap-2 text-lg rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg',
                      selectedMood?.mood === option.mood
                        ? 'bg-primary/20 border-primary ring-2 ring-primary'
                        : ''
                    )}
                    onClick={() => setSelectedMood(option)}
                  >
                    <span className="text-4xl">{option.emoji}</span>
                    <span>{option.mood}</span>
                  </Button>
                ))}
              </div>
              {selectedMood && (
                <Card className="bg-background/50 animate-in fade-in-50">
                  <CardContent className="p-4">
                    <div className="space-y-2">
                       <Textarea
                        placeholder={`Tell us more about why you're feeling ${selectedMood.mood.toLowerCase()}...`}
                        value={journalText}
                        onChange={(e) => setJournalText(e.target.value)}
                        className="min-h-[120px] resize-none"
                      />
                      <div className="flex justify-between items-center gap-2 flex-wrap">
                        <Button variant="ghost" size="sm" onClick={handleGetPrompt} disabled={isPending}>
                          {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                          {isPending ? 'Generating...' : 'Journaling Prompt'}
                        </Button>
                        <Button onClick={handleSaveEntry}>
                          <Send className="mr-2 h-4 w-4" />
                          Save Entry
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Recent Entries</CardTitle>
          <CardDescription>A look at your last few mood logs.</CardDescription>
        </CardHeader>
        <CardContent>
          { !isLoaded ? (
            <div className="space-y-4">
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
            </div>
          ) : moodHistory.length > 0 ? (
            <ul className="space-y-4">
              {moodHistory.slice(0, 5).map((entry) => (
                <li key={entry.id} className="flex items-start gap-4 p-4 rounded-lg border bg-background/50">
                  <span className="text-3xl mt-1">{entry.emoji}</span>
                  <div className="flex-1">
                    <p className="font-semibold">{entry.mood}</p>
                    <p className="text-sm text-muted-foreground">{format(new Date(entry.date), 'MMMM d, yyyy - h:mm a')}</p>
                    {entry.journal && <p className="mt-2 text-sm">{entry.journal}</p>}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center text-muted-foreground py-8">No entries yet. Log your mood to get started!</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
