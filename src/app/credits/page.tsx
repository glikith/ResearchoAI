import { AppHeader } from '@/components/app-header';
import { Button } from '@/components/ui/button';

const AppFooter = () => (
    <footer className="border-t border-gray-800 py-6">
        <div className="container mx-auto px-6 text-center text-gray-500">
            <p className="text-lg font-semibold mb-2">Team Code Blooded</p>
            <p className="text-gray-400">Ashritha - Likith - Pravin - Raghu - Samhitha - Sreeja</p>
            <p className="text-sm mt-2">© 2025 Researcho AI. All Rights Reserved.</p>
        </div>
    </footer>
);

export default function CreditsPage() {
  const creditCosts = [
      { credits: '1 Credit', description: 'Direct text summary' },
      { credits: '2 Credits', description: 'Single document summary' },
      { credits: '5 Credits', description: 'Multiple documents summary' },
  ];

  const plans = [
      { name: 'Free', price: '₹0', credits: '50 Credits / daily', buttonText: 'Current Plan', variant: 'outline' },
      { name: 'Pro', price: '₹199', credits: '300 Credits', subtext: '/ month', buttonText: 'Upgrade to Pro', variant: 'default', featured: true },
      { name: 'Ultra', price: '₹999', credits: '1000 Credits', subtext: '/ month', buttonText: 'Go Ultra', variant: 'outline' },
  ];

  const features = [
    { feature: 'Monthly reports (credits)', free: '50 (daily)', pro: '300', ultra: '1000' },
    { feature: 'Priority report generation', free: '—', pro: '✔ (Standard)', ultra: '✔ (High)' },
    { feature: 'File upload limit', free: '10 MB', pro: '50 MB', ultra: '200 MB' },
    { feature: 'Saved projects/folders', free: '5', pro: '25', ultra: 'Unlimited' },
    { feature: 'Team collaboration', free: '—', pro: '3 members', ultra: '10 members' },
    { feature: 'API access', free: '—', pro: 'Optional add-on', ultra: 'Included' },
    { feature: 'Support', free: 'Community only', pro: 'Email (24 hr)', ultra: 'Priority chat/email (8 hr)' },
    { feature: 'Usage analytics / advanced export', free: '—', pro: '✔', ultra: '✔' },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <AppHeader />
      <main className="flex-1 pt-24">
        <section id="pricing" className="py-20">
             <div className="max-w-7xl mx-auto text-center">
                <h2 className="text-4xl font-bold mb-4 gradient-text">Flexible Plans for Every Need</h2>
                <p className="text-gray-400 text-lg mb-8">Start for free and scale as you grow. Our credit system ensures you only pay for what you use.</p>
                 
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto mb-12 text-left">
                    {creditCosts.map(cost => (
                        <div key={cost.credits} className="card-bg border border-gray-800 p-4 rounded-lg">
                          <p className="font-bold text-white">{cost.credits}</p>
                          <p className="text-sm text-gray-400">{cost.description}</p>
                        </div>
                    ))}
                 </div>
                 
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-16">
                     {plans.map(plan => (
                        <div key={plan.name} className={`card-bg p-8 rounded-lg ${plan.featured ? 'border-2 border-indigo-500 transform scale-105' : 'border border-gray-800'}`}>
                          <h3 className={`text-2xl font-bold ${plan.featured ? 'gradient-text' : 'text-white'}`}>{plan.name}</h3>
                          <p className="text-5xl font-extrabold text-white my-4">{plan.price}<span className="text-lg font-medium text-gray-400">{plan.subtext}</span></p>
                          <p className="text-lg font-medium text-gray-400">{plan.credits}</p>
                          <Button className={`w-full mt-6 font-semibold py-2 rounded-lg transition-colors ${plan.featured ? 'bg-indigo-600 text-white hover:bg-indigo-700' : 'bg-gray-700 text-white hover:bg-gray-600'}`}>{plan.buttonText}</Button>
                        </div>
                     ))}
                 </div>
                 
                 <h3 className="text-3xl font-bold text-center mb-8 text-white">Feature Comparison</h3>
                 <div className="card-bg border border-gray-800 rounded-lg overflow-hidden">
                     <table className="w-full text-left">
                        <thead className="bg-gray-900">
                          <tr>
                            <th className="p-4 font-semibold">Feature</th>
                            <th className="p-4 font-semibold text-center">Free</th>
                            <th className="p-4 font-semibold text-center">Pro</th>
                            <th className="p-4 font-semibold text-center">Ultra</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800">
                          {features.map(f => (
                            <tr key={f.feature}>
                              <td className="p-4">{f.feature}</td>
                              <td className={`p-4 text-center ${f.free === '—' ? 'text-gray-500' : ''}`}>{f.free}</td>
                              <td className={`p-4 text-center ${f.pro.startsWith('✔') ? 'text-green-400' : ''}`}>{f.pro}</td>
                              <td className={`p-4 text-center ${f.ultra.startsWith('✔') ? 'text-green-400' : ''}`}>{f.ultra}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                 </div>
             </div>
        </section>
      </main>
      <AppFooter />
    </div>
  );
}