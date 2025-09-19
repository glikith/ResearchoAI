import { AppHeader } from '@/components/app-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Check, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function CreditsPage() {
  const plans = [
    { name: 'Free', price: '₹0', credits: '50 credits' },
    { name: 'Pro', price: '₹199', credits: '300 credits' },
    { name: 'Premium', price: '₹499', credits: '900 credits' },
  ];

  const features = [
    { feature: 'Monthly reports (credits)', free: '50', pro: '300', premium: '900' },
    { feature: 'Priority report generation', free: <Minus className="h-5 w-5 text-muted-foreground mx-auto" />, pro: 'Standard', premium: 'High' },
    { feature: 'File upload limit', free: '10 MB', pro: '50 MB', premium: '200 MB' },
    { feature: 'Saved projects/folders', free: '5', pro: '25', premium: 'Unlimited' },
    { feature: 'Team collaboration', free: <Minus className="h-5 w-5 text-muted-foreground mx-auto" />, pro: '3 members', premium: '10 members' },
    { feature: 'API access', free: <Minus className="h-5 w-5 text-muted-foreground mx-auto" />, pro: 'Optional add-on', premium: <Check className="h-5 w-5 text-green-500 mx-auto" /> },
    { feature: 'Support', free: 'Community only', pro: 'Email (24 hr)', premium: 'Priority chat/email (8 hr)' },
    { feature: 'Usage analytics / advanced export', free: <Minus className="h-5 w-5 text-muted-foreground mx-auto" />, pro: <Minus className="h-5 w-5 text-muted-foreground mx-auto" />, premium: <Check className="h-5 w-5 text-green-500 mx-auto" /> },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <AppHeader />
      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        <div className="max-w-5xl mx-auto space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Plan Recap</CardTitle>
              <CardDescription>
                Choose the plan that fits your research needs.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tier</TableHead>
                    <TableHead>Price (₹ / month)</TableHead>
                    <TableHead>Credits</TableHead>
                    <TableHead />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {plans.map((plan) => (
                    <TableRow key={plan.name}>
                      <TableCell className="font-medium">{plan.name}</TableCell>
                      <TableCell>{plan.price}</TableCell>
                      <TableCell>{plan.credits}</TableCell>
                      <TableCell className="text-right">
                        <Button variant={plan.name === 'Pro' ? 'default' : 'outline'}>
                          {plan.name === 'Free' ? 'Current Plan' : 'Upgrade'}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Feature Comparison</CardTitle>
              <CardDescription>
                See what each plan has to offer.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[30%]">Feature</TableHead>
                    <TableHead className="text-center">Free</TableHead>
                    <TableHead className="text-center">Pro</TableHead>
                    <TableHead className="text-center">Premium</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {features.map(({ feature, free, pro, premium }) => (
                    <TableRow key={feature}>
                      <TableCell className="font-medium">{feature}</TableCell>
                      <TableCell className="text-center">{free}</TableCell>
                      <TableCell className="text-center">{pro}</TableCell>
                      <TableCell className="text-center">{premium}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
