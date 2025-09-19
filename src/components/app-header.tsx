'use client';

import { Bot, Home, Menu, Settings, CreditCard } from 'lucide-react';
import Link from 'next/link';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';

export function AppHeader() {
  return (
    <header className="bg-background border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <Bot size={28} className="text-primary" />
            <h1 className="text-xl font-bold font-headline text-foreground">
              Research Pilot
            </h1>
          </div>
          <div className="hidden md:block">
            {/* Desktop menu can go here if needed */}
          </div>
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Menu</SheetTitle>
                </SheetHeader>
                <nav className="mt-8 flex flex-col gap-4">
                  <Link href="/" className="flex items-center gap-3 p-2 rounded-md hover:bg-muted">
                    <Home size={20} />
                    <span>Home</span>
                  </Link>
                  <Link href="/credits" className="flex items-center gap-3 p-2 rounded-md hover:bg-muted">
                    <CreditCard size={20} />
                    <span>Credits</span>
                  </Link>
                  <Link href="/settings" className="flex items-center gap-3 p-2 rounded-md hover:bg-muted">
                    <Settings size={20} />
                    <span>Settings</span>
                  </Link>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
