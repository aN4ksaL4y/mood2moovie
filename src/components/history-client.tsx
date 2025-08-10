'use client';

import { useMemo } from 'react';
import { useMoodData } from '@/hooks/use-mood-data';
import { format } from 'date-fns';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from './ui/skeleton';

export function HistoryClient() {
  const { moodHistory, isLoaded } = useMoodData();

  const chartData = useMemo(() => {
    if (!moodHistory) return [];
    // Get last 30 days of data
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentHistory = moodHistory
      .filter(entry => new Date(entry.date) > thirtyDaysAgo)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    // Group by day
    const groupedByDay = recentHistory.reduce((acc, entry) => {
        const day = format(new Date(entry.date), 'MMM d');
        if (!acc[day]) {
            acc[day] = { date: day, entries: [] };
        }
        acc[day].entries.push(entry);
        return acc;
    }, {} as Record<string, { date: string; entries: typeof moodHistory }>);

    return Object.values(groupedByDay).map(dayData => {
        const avgValue = dayData.entries.reduce((sum, e) => sum + e.value, 0) / dayData.entries.length;
        return {
            date: dayData.date,
            mood: Math.round(avgValue)
        }
    });

  }, [moodHistory]);

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Mood Trends</CardTitle>
          <CardDescription>Your mood fluctuations over the last 30 days.</CardDescription>
        </CardHeader>
        <CardContent>
          {!isLoaded ? (
             <Skeleton className="h-[350px] w-full" />
          ) : moodHistory.length > 0 ? (
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid vertical={false} strokeDasharray="3 3" />
                  <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} fontSize={12} />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    domain={[0, 5]}
                    ticks={[1, 2, 3, 4, 5]}
                    tickFormatter={(value) => ['Anxious', 'Sad', 'Calm', 'Happy', 'Excited'][value-1]}
                  />
                  <Tooltip
                    cursor={{ fill: 'hsl(var(--accent) / 0.2)' }}
                    content={<ChartTooltipContent
                      formatter={(value, name) => (
                        <div className="flex flex-col">
                           <span className="font-semibold text-foreground">Mood Level: {value}</span>
                        </div>
                      )}
                      labelClassName="font-bold text-lg"
                    />}
                  />
                  <Bar dataKey="mood" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">Not enough data to display trends. Keep logging your mood!</p>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">All Entries</CardTitle>
          <CardDescription>A complete log of your mood history.</CardDescription>
        </CardHeader>
        <CardContent>
          {!isLoaded ? (
            <div className="space-y-4">
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
            </div>
          ) : moodHistory.length > 0 ? (
            <ul className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
              {moodHistory.map((entry) => (
                <li key={entry.id} className="flex items-start gap-4 p-4 rounded-lg border bg-background/50">
                  <span className="text-3xl mt-1">{entry.emoji}</span>
                  <div className="flex-1">
                    <p className="font-semibold">{entry.mood}</p>
                    <p className="text-sm text-muted-foreground">{format(new Date(entry.date), 'MMMM d, yyyy - h:mm a')}</p>
                    {entry.journal && <p className="mt-2 text-sm whitespace-pre-wrap">{entry.journal}</p>}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center text-muted-foreground py-8">No entries yet. Your history will appear here.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
