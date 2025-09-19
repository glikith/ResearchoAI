'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Bot, ArrowRight } from 'lucide-react';

export default function WelcomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
      <div className="text-center space-y-6">
        <div className="inline-block p-4 bg-primary/10 rounded-full">
          <Bot size={48} className="text-primary" />
        </div>
        <h1 className="text-5xl font-bold font-headline text-foreground">
          Welcome to Synapse AI
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Your intelligent research assistant. Upload documents, ask complex questions, and get structured, evidence-based reports in seconds.
        </p>
        <Button asChild size="lg">
          <Link href="/main">
            Get Started <ArrowRight className="ml-2" />
          </Link>
        </Button>
      </div>
       <footer className="absolute bottom-4 text-center text-sm text-muted-foreground">
        <p className="font-bold">Team Code Blooded</p>
        <p>Ashritha - Likith - Pravin - Raghu - Samhitha - Sreeja</p>
      </footer>
    </div>
  );
}
