'use client';

import React, { useState, useEffect, useActionState, useTransition } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { generateReportAction, type FormState } from '@/app/actions';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ReportDisplay } from '@/components/report-display';
import { useToast } from '@/hooks/use-toast';
import { Rocket, FileText, BarChart3, UploadCloud } from 'lucide-react';
import { AppHeader } from '@/components/app-header';

const formSchema = z.object({
  question: z.string().min(10, 'Your question must be at least 10 characters.'),
  files: z.any().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const Footer = () => (
  <footer className="bg-background border-t py-4">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-muted-foreground">
      <p className="font-bold">Team Code Blooded</p>
      <p>Ashritha - Likith - Pravin - Raghu - Samhitha - Sreeja</p>
    </div>
  </footer>
);


export default function Home() {
  const [creditsLeft, setCreditsLeft] = useState(25);
  const [reportsGenerated, setReportsGenerated] = useState(0);
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
    const files = data.files ? Array.from(data.files) : [];
    let creditsToDeduct = 1; // Direct text summary
    if (files.length === 1) {
      creditsToDeduct = 2; // Single document
    } else if (files.length > 1) {
      creditsToDeduct = 5; // Multiple documents
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
      const formData = new FormData();
      formData.append('question', data.question);
      if (data.files && data.files.length > 0) {
        for (let i = 0; i < data.files.length; i++) {
          formData.append('files', data.files[i]);
        }
      }
      formAction(formData);
      setCreditsLeft(prev => prev - creditsToDeduct);
    });
  };
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const names = Array.from(event.target.files).map(file => file.name);
      setFileNames(names);
    }
  };


  return (
    <div className='flex flex-col min-h-screen'>
      <AppHeader />
      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-8 h-full">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="text-primary" />
                  New Report
                </CardTitle>
                <CardDescription>
                  Ask a question, provide sources, and get a structured report.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onFormSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="question"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Research Question</FormLabel>
                          <FormControl>
                            <Textarea placeholder="e.g., What are the latest trends in renewable energy?" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="files"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Upload Sources (Optional)</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <UploadCloud className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                              <Input type="file" multiple className="pl-10" onChange={(e) => {
                                  field.onChange(e.target.files);
                                  handleFileChange(e);
                              }} />
                            </div>
                          </FormControl>
                          {fileNames.length > 0 && <p className="text-xs text-muted-foreground mt-2 font-code">{fileNames.join(', ')}</p>}
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Button type="submit" className="w-full" disabled={isPending}>
                      <Rocket />
                      Generate Report
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="text-accent" />
                  Usage Statistics
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-4 text-center">
                <div className="bg-muted/50 p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground">Credits Left</p>
                  <p className="text-2xl font-bold">{creditsLeft}</p>
                </div>
                <div className="bg-muted/50 p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground">Reports Generated</p>
                  <p className="text-2xl font-bold">{reportsGenerated}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-3">
            <ReportDisplay state={state} isSubmitting={isPending} />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}