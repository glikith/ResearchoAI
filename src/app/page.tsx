'use client';

import React, { useState, useEffect, useTransition, useActionState } from 'react';
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
import { Rocket, Bot, FileText, BarChart3, UploadCloud } from 'lucide-react';

const formSchema = z.object({
  question: z.string().min(10, 'Your question must be at least 10 characters.'),
  files: z.any().optional(),
  liveDataUrl: z.string().url('Please enter a valid URL.').optional().or(z.literal('')),
});

type FormValues = z.infer<typeof formSchema>;

export default function Home() {
  const [questionsAsked, setQuestionsAsked] = useState(0);
  const [reportsGenerated, setReportsGenerated] = useState(0);
  const [fileNames, setFileNames] = useState<string[]>([]);
  const [isPending, startTransition] = useTransition();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      question: '',
      liveDataUrl: '',
    },
  });
  
  const { toast } = useToast();

  const initialState: FormState = {
    report: null,
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
    setQuestionsAsked((prev) => prev + 1);
    const formData = new FormData();
    formData.append('question', data.question);
    formData.append('liveDataUrl', data.liveDataUrl || '');
    if (data.files && data.files.length > 0) {
      for (let i = 0; i < data.files.length; i++) {
        formData.append('files', data.files[i]);
      }
    }
    startTransition(() => {
      formAction(formData);
    });
  };
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const names = Array.from(event.target.files).map(file => file.name);
      setFileNames(names);
    }
  };


  return (
    <main className="min-h-full p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-8 h-full">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-8">
          <div className="flex items-center gap-3">
            <Bot size={36} className="text-primary" />
            <div>
              <h1 className="text-2xl font-bold font-headline text-foreground">Research Pilot</h1>
              <p className="text-muted-foreground">Your AI-powered research assistant</p>
            </div>
          </div>

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

                  <FormField
                    control={form.control}
                    name="liveDataUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Live Data URL (Optional)</FormLabel>
                        <FormControl>
                          <Input type="url" placeholder="https://example.com/live-data-feed" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button type="submit" className="w-full" disabled={form.formState.isSubmitting || isPending}>
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
                <p className="text-sm text-muted-foreground">Credits Used</p>
                <p className="text-2xl font-bold">{questionsAsked}</p>
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
          <ReportDisplay state={state} isSubmitting={form.formState.isSubmitting || isPending} />
        </div>
      </div>
    </main>
  );
}
