'use client';

import * as React from 'react';
import Link from 'next/link';
import { Film } from 'lucide-react';

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex h-16 items-center border-b px-4 lg:px-6">
        <Link
          href="/"
          className="flex items-center gap-2 font-semibold"
        >
          <Film className="h-6 w-6 text-primary" />
          <span className="font-headline text-lg">Mood2Movie</span>
        </Link>
      </header>
      <main className="flex-1 overflow-y-auto p-4 lg:p-6">{children}</main>
    </div>
  );
}
