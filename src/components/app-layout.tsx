'use client';

import * as React from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { BarChart3, LayoutDashboard, Settings, BotMessageSquare } from 'lucide-react';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const navItems = [
    { href: '/', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/history', label: 'History', icon: BarChart3 },
    { href: '/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarInset>
          <div className="flex h-full flex-col">
            <header className="flex h-14 items-center justify-between border-b px-4 lg:h-[60px] lg:px-6">
              <div className="flex items-center gap-2 font-semibold">
                <BotMessageSquare className="h-6 w-6 text-primary" />
                <span className="font-headline text-lg">ReflectFlow</span>
              </div>
              <div className="md:hidden">
                <SidebarTrigger variant="outline" size="icon" />
              </div>
            </header>
            <main className="flex-1 overflow-y-auto p-4 lg:p-6">{children}</main>
          </div>
        </SidebarInset>
        <SidebarContent className="p-2">
          <SidebarHeader>
            <div className="flex items-center gap-2 font-semibold">
              <BotMessageSquare className="h-6 w-6 text-primary" />
              <span className="font-headline text-lg">ReflectFlow</span>
            </div>
          </SidebarHeader>
          <SidebarMenu>
            {navItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <Link href={item.href} passHref>
                  <SidebarMenuButton
                    as="a"
                    isActive={pathname === item.href}
                    tooltip={item.label}
                  >
                    <item.icon />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
    </SidebarProvider>
  );
}
