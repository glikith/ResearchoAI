'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { AppHeader } from '@/components/app-header';

const AppFooter = () => (
    <footer className="border-t border-gray-800 py-6">
        <div className="container mx-auto px-6 text-center text-gray-500">
            <p className="text-lg font-semibold mb-2">Team Code Blooded</p>
            <p className="text-gray-400">Ashritha - Likith - Pravin - Raghu - Samhitha - Sreeja</p>
            <p className="text-sm mt-2">© 2025 Researcho AI. All Rights Reserved.</p>
        </div>
    </footer>
);

export default function WelcomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <AppHeader />
      <main className="flex-1">
        <section id="home" className="min-h-screen flex flex-col justify-center items-center text-center">
             <div className="max-w-3xl">
                <h1 className="text-5xl md:text-7xl font-extrabold text-white leading-tight mb-4">
                    Researcho AI
                </h1>
                <p className="text-lg md:text-xl text-gray-400 mb-8">
                    Transform hours of fragmented research into concise, evidence-based reports. Upload files, ask questions, and get instant insights with proper citations.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                    <Button asChild size="lg" className="bg-indigo-600 text-white font-semibold px-8 py-3 rounded-lg hover:bg-indigo-700 transition-transform duration-300 transform hover:scale-105">
                      <Link href="/main">
                        Get Started Free
                      </Link>
                    </Button>
                    <Button variant="outline" size="lg" className="border-indigo-600 text-indigo-400 font-semibold px-8 py-3 rounded-lg hover:bg-indigo-600 hover:text-white transition-transform duration-300 transform hover:scale-105">
                        Watch Demo
                    </Button>
                </div>
                 <div className="flex justify-center items-center space-x-8 text-sm text-gray-500">
                     <div className="flex items-center space-x-2"><div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div><span>Live Updates</span></div>
                     <div className="flex items-center space-x-2"><div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div><span>100% Cited</span></div>
                     <div className="flex items-center space-x-2"><div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div><span>Multi-Source</span></div>
                 </div>
             </div>
        </section>
      </main>
      <AppFooter />
    </div>
  );
}
