'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const SETTINGS_KEY = 'reflectflow-settings';

interface Settings {
  remindersEnabled: boolean;
  reminderTime: string;
}

export function SettingsClient() {
  const [settings, setSettings] = useState<Settings>({
    remindersEnabled: false,
    reminderTime: '19:00',
  });
  const [isLoaded, setIsLoaded] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    try {
      const storedSettings = window.localStorage.getItem(SETTINGS_KEY);
      if (storedSettings) {
        setSettings(JSON.parse(storedSettings));
      }
    } catch (error) {
      console.error('Failed to load settings from localStorage', error);
    }
    setIsLoaded(true);
  }, []);

  const handleSave = () => {
    try {
      window.localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
      toast({
        title: 'Settings Saved',
        description: 'Your reminder preferences have been updated.',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Could not save settings.',
      });
    }
  };

  if (!isLoaded) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Logging Reminders</CardTitle>
          <CardDescription>Customize your mood logging notifications.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
           <div className="h-10 w-full rounded-md bg-muted animate-pulse" />
           <div className="h-10 w-full rounded-md bg-muted animate-pulse" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Logging Reminders</CardTitle>
        <CardDescription>
          Customize your mood logging notifications. (Note: This is a UI demonstration and does not send real notifications).
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between space-x-2 rounded-lg border p-4">
          <Label htmlFor="reminders-enabled" className="flex flex-col space-y-1">
            <span>Enable Reminders</span>
            <span className="font-normal leading-snug text-muted-foreground">
              Receive a daily reminder to log your mood.
            </span>
          </Label>
          <Switch
            id="reminders-enabled"
            checked={settings.remindersEnabled}
            onCheckedChange={(checked) => setSettings(s => ({ ...s, remindersEnabled: checked }))}
          />
        </div>
        
        {settings.remindersEnabled && (
          <div className="space-y-2 animate-in fade-in-50">
            <Label htmlFor="reminder-time">Reminder Time</Label>
            <Select
              value={settings.reminderTime}
              onValueChange={(value) => setSettings(s => ({...s, reminderTime: value}))}
            >
              <SelectTrigger id="reminder-time" className="w-[180px]">
                <SelectValue placeholder="Select a time" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="09:00">9:00 AM</SelectItem>
                <SelectItem value="12:00">12:00 PM</SelectItem>
                <SelectItem value="15:00">3:00 PM</SelectItem>
                <SelectItem value="18:00">6:00 PM</SelectItem>
                <SelectItem value="21:00">9:00 PM</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        <Button onClick={handleSave}>Save Preferences</Button>
      </CardContent>
    </Card>
  );
}
