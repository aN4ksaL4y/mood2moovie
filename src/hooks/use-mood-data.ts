'use client';

import { useState, useEffect, useCallback } from 'react';
import type { MoodEntry } from '@/lib/types';

const STORAGE_KEY = 'reflectflow-mood-history';

export function useMoodData() {
  const [moodHistory, setMoodHistory] = useState<MoodEntry[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const storedData = window.localStorage.getItem(STORAGE_KEY);
      if (storedData) {
        setMoodHistory(JSON.parse(storedData));
      }
    } catch (error) {
      console.error('Failed to load mood data from localStorage', error);
    }
    setIsLoaded(true);
  }, []);

  const addMoodEntry = useCallback((newEntry: Omit<MoodEntry, 'id' | 'date'>) => {
    const entry: MoodEntry = {
      ...newEntry,
      id: new Date().toISOString(),
      date: new Date().toISOString(),
    };

    setMoodHistory(prevHistory => {
      const updatedHistory = [entry, ...prevHistory];
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedHistory));
      } catch (error) {
        console.error('Failed to save mood data to localStorage', error);
      }
      return updatedHistory;
    });
  }, []);

  return { moodHistory, addMoodEntry, isLoaded };
}
