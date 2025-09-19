'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

export function AppHeader() {
  const pathname = usePathname();
  const navLinks = [
    { href: '/main', label: 'Dashboard' },
    { href: '/features', label: 'Features' },
    { href: '/credits', label: 'Pricing' },
    { href: '/settings', label: 'Settings' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black bg-opacity-50 backdrop-blur-lg">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
            <Link href="/" className="flex items-center space-x-2 group">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-indigo-400 group-hover:text-purple-400 transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.898 20.624L16.5 21.75l-.398-1.126a3.375 3.375 0 00-2.456-2.456L12.5 18l1.126-.398a3.375 3.375 0 002.456-2.456L16.5 14.25l.398 1.126a3.375 3.375 0 002.456 2.456L20.5 18l-1.126.398a3.375 3.375 0 00-2.456 2.456z" />
                </svg>
                <span className="text-xl font-bold gradient-text">Researcho AI</span>
            </Link>
            <nav className="hidden md:flex space-x-8">
                {navLinks.map(link => (
                    <Link key={link.href} href={link.href} className={cn(
                        "hover:text-indigo-400 transition-colors duration-300",
                        pathname === link.href ? "text-purple-400 font-semibold" : "text-gray-200"
                    )}>
                        {link.label}
                    </Link>
                ))}
            </nav>
            <div className="flex items-center space-x-4">
                <Button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors duration-300">
                    Login
                </Button>
                <Button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors duration-300">
                    Sign Up
                </Button>
            </div>
        </div>
    </header>
  );
}