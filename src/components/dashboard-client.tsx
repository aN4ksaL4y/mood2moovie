'use client';

import { useState, useTransition } from 'react';
import { Loader2, Clapperboard, Sparkles } from 'lucide-react';
import type { MoodOption } from '@/lib/types';
import { getMovieRecommendationAction } from '@/lib/actions';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';

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

interface MovieRecommendation {
  title: string;
  reason: string;
  imdbId: string;
}

export function DashboardClient() {
  const [selectedMood, setSelectedMood] = useState<MoodOption | null>(null);
  const [recommendation, setRecommendation] = useState<MovieRecommendation | null>(null);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleGetRecommendation = (mood: MoodOption) => {
    setSelectedMood(mood);
    setRecommendation(null);
    startTransition(async () => {
      const result = await getMovieRecommendationAction(mood.mood);
      if ('title' in result) {
        setRecommendation(result as MovieRecommendation);
      } else {
        toast({
          variant: 'destructive',
          title: 'Waduh, error!',
          description: result.error,
        });
      }
    });
  };

  return (
    <div className="flex flex-col gap-6">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="font-headline">Lagi pengen nonton apa, nih?</CardTitle>
          <CardDescription>Pilih mood lo sekarang, biar AI kita yang kasih rekomendasi film.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {moodOptions.map((option) => (
                <Button
                  key={option.mood}
                  variant="outline"
                  className={cn(
                    'flex flex-col h-24 gap-2 text-lg rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg',
                    selectedMood?.mood === option.mood && !isPending
                      ? 'bg-primary/20 border-primary ring-2 ring-primary'
                      : ''
                  )}
                  onClick={() => handleGetRecommendation(option)}
                  disabled={isPending && selectedMood?.mood === option.mood}
                >
                  {isPending && selectedMood?.mood === option.mood ? (
                    <Loader2 className="h-8 w-8 animate-spin" />
                  ) : (
                    <>
                      <span className="text-4xl">{option.emoji}</span>
                      <span>{option.mood}</span>
                    </>
                  )}
                </Button>
              ))}
            </div>

            {isPending && (
              <Card className="bg-background/50 animate-in fade-in-50">
                <CardContent className="p-4">
                  <div className="flex items-center justify-center gap-3 p-8">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                    <p className="text-muted-foreground">Sabar ya, AI lagi nyari film yang pas buat lo...</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {recommendation && !isPending && (
              <Card className="bg-muted/50 animate-in fade-in-50">
                <CardHeader className="flex-row items-start gap-4 space-y-0 pb-2">
                  <Clapperboard className="h-8 w-8 text-primary mt-1" />
                  <div className="flex-1">
                    <div className="flex justify-between items-center">
                       <CardTitle className="font-headline">{recommendation.title}</CardTitle>
                       <Button asChild size="sm">
                          <Link href={`https://www.imdb.com/title/${recommendation.imdbId}`} target="_blank" rel="noopener noreferrer">
                            View on IMDB
                          </Link>
                        </Button>
                    </div>
                    <CardDescription>Cocok banget nih buat yang lagi ngerasa {selectedMood?.mood.toLowerCase()}.</CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="pl-12">{recommendation.reason}</p>
                </CardContent>
              </Card>
            )}
          </div>
        </CardContent>
      </Card>
      
       <Card>
        <CardHeader>
          <CardTitle className="font-headline">Gimana Cara Kerjanya?</CardTitle>
          <CardDescription>Didukung oleh AI canggih dari Google, Gemini.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>
            Jadi gini, pas lo klik mood, pilihan lo dikirim ke AI. AI-nya udah di-briefing buat ngasih saran film yang pas sama perasaan lo.
          </p>
          <p>
            Nanti AI-nya ngasih judul sama alesan singkat, terus kita tampilin deh di layar lo. Keren, kan?
          </p>
        </CardContent>
      </Card>

    </div>
  );
}
