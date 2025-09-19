'use client';

import React, { useState, useEffect, useActionState, useTransition } from 'react';
import Link from 'next/link';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { generateReportAction, type FormState } from '@/app/actions';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ReportDisplay } from '@/components/report-display';
import { useToast } from '@/hooks/use-toast';
import { AppHeader } from '@/components/app-header';

const formSchema = z.object({
  question: z.string().min(10, 'Your question must be at least 10 characters.'),
  files: z.any().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const AppFooter = () => (
    <footer className="border-t border-gray-800 py-6">
        <div className="container mx-auto px-6 text-center text-gray-500">
            <p className="text-lg font-semibold mb-2">Team Code Blooded</p>
            <p className="text-gray-400">Ashritha - Likith - Pravin - Raghu - Samhitha - Sreeja</p>
            <p className="text-sm mt-2">© 2025 Researcho AI. All Rights Reserved.</p>
        </div>
    </footer>
);


export default function Home() {
  const [creditsLeft, setCreditsLeft] = useState(50);
  const [reportsGenerated, setReportsGenerated] = useState(0);
  const [filesUploaded, setFilesUploaded] = useState(0);
  const [fileNames, setFileNames] = useState<string[]>([]);
  const [isPending, startTransition] = useTransition();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      question: '',
    },
  });
  
  const { toast } = useToast();

  const initialState: FormState = {
    report: null,
    keypoints: null,
    sources: null,
    error: null,
  };

  const [state, formAction] = useActionState(generateReportAction, initialState);

  useEffect(() => {
    if (state.error) {
      toast({
        variant: 'destructive',
        title: 'An error occurred',
        description: state.error,
      });
    }
    if (state.report) {
      setReportsGenerated((prev) => prev + 1);
    }
  }, [state, toast]);
  
  const onFormSubmit = (data: FormValues) => {
    const formData = new FormData();
    formData.append('question', data.question);
    const files = data.files ? Array.from(data.files) : [];
    
    if (files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        formData.append('files', files[i]);
      }
    }

    let creditsToDeduct = 1;
    if (files.length === 1) {
      creditsToDeduct = 2;
    } else if (files.length > 1) {
      creditsToDeduct = 5;
    }

    if (creditsLeft < creditsToDeduct) {
      toast({
        variant: 'destructive',
        title: 'Not enough credits',
        description: `You need ${creditsToDeduct} credits for this action, but you only have ${creditsLeft}.`,
      });
      return;
    }
    
    startTransition(() => {
      formAction(formData);
      setCreditsLeft(prev => prev - creditsToDeduct);
      setFilesUploaded(prev => prev + files.length);
    });
  };
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const currentFiles = Array.from(event.target.files);
      const names = currentFiles.map(file => file.name);
      setFileNames(names);
      form.setValue('files', currentFiles);
    }
  };

  return (
    <div className='flex flex-col min-h-screen'>
      <AppHeader />
      <main className="flex-1 pt-24">
        <section id="dashboard" className="py-20">
             <div className="max-w-6xl mx-auto">
                <h2 className="text-4xl font-bold text-center mb-4 gradient-text">Your Research Dashboard</h2>
                <p className="text-center text-gray-400 text-lg mb-16 max-w-3xl mx-auto">A clean, professional interface to manage your research, track usage, and monitor your credits.</p>
                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                    <div>
                         <div className="card-bg border border-gray-800 rounded-lg p-8 mb-8">
                             <h3 className="text-2xl font-bold text-white mb-6">Dashboard Preview</h3>
                             <div className="mb-6"><h4 className="text-lg font-semibold text-gray-300 mb-3">Recent Reports</h4>
                                <ReportDisplay state={state} isSubmitting={isPending} />
                             </div>
                             <div className="grid grid-cols-1 gap-4">
                                 <div className="text-center p-4 bg-gray-800 rounded-lg"><p className="text-2xl font-bold text-green-400" id="creditsRemaining">{creditsLeft}</p><p className="text-sm text-gray-400">Credits Left Today</p></div>
                             </div>
                         </div>
                    </div>
                     <div className="space-y-6">
                         <div className="card-bg border border-gray-800 rounded-lg p-6">
                             <h3 className="text-xl font-bold text-white mb-4">Quick Research</h3>
                             <form onSubmit={form.handleSubmit(onFormSubmit)} className="space-y-4">
                               <div className="mb-4">
                                 <label className="block text-sm font-medium text-gray-300 mb-2">Your Question</label>
                                 <Input {...form.register('question')} placeholder="e.g., What are the latest trends in AI research?" className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"/>
                                 <FormMessage>{form.formState.errors.question?.message}</FormMessage>
                                </div>
                               <div className="mb-4">
                                 <label className="block text-sm font-medium text-gray-300 mb-2">Upload Documents (PDF, DOC)</label>
                                 <div className="upload-zone text-center cursor-pointer" onClick={() => document.getElementById('fileInput')?.click()}>
                                    <div className="p-8">
                                      <svg className="w-12 h-12 text-indigo-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
                                      <p className="text-gray-400 mb-2">Drag & drop files here or click to browse</p>
                                      <p className="text-sm text-gray-500">Supports multiple PDF/DOC files</p>
                                    </div>
                                    <Input type="file" id="fileInput" multiple accept=".pdf,.doc,.docx" className="hidden" onChange={handleFileChange} />
                                 </div>
                                  <div className="mt-4 space-y-2">
                                    {fileNames.length > 0 ? (
                                      fileNames.map(name => <p key={name} className="text-sm text-gray-400">{name}</p>)
                                    ) : (
                                      <p className="text-sm text-gray-400">No files uploaded</p>
                                    )}
                                 </div>
                                </div>
                                <div className="flex space-x-4">
                                  <Button type="submit" disabled={isPending} className="flex-1 bg-indigo-600 text-white font-semibold py-3 rounded-lg hover:bg-indigo-700 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed">
                                    {isPending ? 'Generating...' : 'Generate Report'}
                                    </Button>
                                </div>
                              </form>
                         </div>
                         <div className="card-bg border border-gray-800 rounded-lg p-4 text-center">
                          <p className="text-sm text-gray-400 mb-2">Daily 50 credits | <Link href="/credits" className="text-indigo-400 hover:text-indigo-300">Upgrade for more</Link></p>
                         </div>
                     </div>
                 </div>
             </div>
        </section>
      </main>
      <AppFooter />
    </div>
  );
}

const FormMessage = ({ children }: { children?: React.ReactNode }) => {
    if (!children) return null;
    return <p className="text-sm font-medium text-red-500 mt-1">{children}</p>
}
