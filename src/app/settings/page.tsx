'use client';

import { AppHeader } from '@/components/app-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useTheme } from 'next-themes';

const AppFooter = () => (
    <footer className="border-t border-gray-800 py-6">
        <div className="container mx-auto px-6 text-center text-gray-500">
            <p className="text-lg font-semibold mb-2">Team Code Blooded</p>
            <p className="text-gray-400">Ashritha - Likith - Pravin - Raghu - Samhitha - Sreeja</p>
            <p className="text-sm mt-2">© 2025 Researcho AI. All Rights Reserved.</p>
        </div>
    </footer>
);

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex flex-col min-h-screen">
      <AppHeader />
      <main className="flex-1 p-4 sm:p-6 lg:p-8 pt-24">
        <div className="max-w-3xl mx-auto">
          <Card className="card-bg border border-gray-800">
            <CardHeader>
              <CardTitle className="gradient-text">Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <Label htmlFor="dark-mode" className="flex flex-col gap-1">
                  <span>Dark Mode</span>
                  <span className="text-sm text-muted-foreground">
                    Enable or disable dark mode.
                  </span>
                </Label>
                <Switch
                  id="dark-mode"
                  checked={theme === 'dark'}
                  onCheckedChange={(checked) => {
                    setTheme(checked ? 'dark' : 'light');
                  }}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="notifications" className="flex flex-col gap-1">
                  <span>Email Notifications</span>
                  <span className="text-sm text-muted-foreground">
                    Receive email notifications for generated reports.
                  </span>
                </Label>
                <Switch id="notifications" />
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <AppFooter />
    </div>
  );
}