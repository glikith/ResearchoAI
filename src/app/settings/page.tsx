import { AppHeader } from '@/components/app-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

export default function SettingsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <AppHeader />
      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        <div className="max-w-3xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <Label htmlFor="dark-mode" className="flex flex-col gap-1">
                  <span>Dark Mode</span>
                  <span className="text-sm text-muted-foreground">
                    Enable or disable dark mode.
                  </span>
                </Label>
                <Switch id="dark-mode" />
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
    </div>
  );
}
