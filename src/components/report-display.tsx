'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import type { FormState } from '@/app/actions';
import { Bot, Link as LinkIcon, AlertCircle, FileText, ListChecks, Link } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface ReportDisplayProps {
  state: FormState;
  isSubmitting: boolean;
}

const WelcomeState = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-8">
      <Bot size={48} className="text-primary mb-6" />
      <h2 className="text-2xl font-bold font-headline mb-2">Welcome to Synapse AI</h2>
      <p className="text-muted-foreground max-w-md">
        Your generated report will appear here. Fill out the form to the left to start your first research task.
      </p>
    </div>
  );
};

const LoadingState = () => (
  <div className="p-6">
    <div className="flex items-center gap-3 mb-6">
        <Skeleton className="h-8 w-8 rounded-full" />
        <Skeleton className="h-6 w-48" />
    </div>
    <Skeleton className="h-6 w-3/4 mb-4" />
    <Skeleton className="h-4 w-full mb-2" />
    <Skeleton className="h-4 w-full mb-2" />
    <Skeleton className="h-4 w-5/6 mb-6" />
    <Skeleton className="h-6 w-1/2 mb-4" />
    <Skeleton className="h-4 w-full mb-2" />
    <Skeleton className="h-4 w-full mb-6" />
    <Skeleton className="h-6 w-1/3 mb-4" />
     <div className="space-y-2">
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-full" />
    </div>
  </div>
);

const renderContent = (text: string) => {
  if (!text) return null;

  const blocks = text.split('\n\n');

  return blocks.map((block, index) => {
    block = block.trim();
    if (block.startsWith('## ')) {
      return (
        <h2 key={index} className="text-2xl font-bold mt-6 mb-3 font-headline" dangerouslySetInnerHTML={{ __html: block.substring(3).replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
      );
    }
    if (block.startsWith('# ')) {
        return (
          <h1 key={index} className="text-3xl font-bold mt-8 mb-4 font-headline" dangerouslySetInnerHTML={{ __html: block.substring(2).replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
        );
    }
    if (block.startsWith('- ') || block.startsWith('* ')) {
      const listItems = block.split('\n').map((item, itemIndex) => (
        <li key={itemIndex} dangerouslySetInnerHTML={{ __html: item.substring(2).replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
      ));
      return <ul key={index} className="list-disc list-inside space-y-2 my-4 pl-4">{listItems}</ul>;
    }
    return (
      <p key={index} className="mb-4 leading-relaxed" dangerouslySetInnerHTML={{ __html: block.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
    );
  });
};

const ReportState: React.FC<{ report: string; keypoints: string[]; sources: string[] }> = ({ report, keypoints, sources }) => (
  <>
    <CardHeader>
      <CardTitle className="flex items-center gap-3 text-2xl font-headline">
        <Bot className="text-primary" />
        Generated Report
      </CardTitle>
    </CardHeader>
    <CardContent className="prose prose-sm max-w-none">
      <Tabs defaultValue="report">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="report"><FileText className="mr-2" /> Report</TabsTrigger>
          <TabsTrigger value="keypoints"><ListChecks className="mr-2" /> Key Points</TabsTrigger>
          <TabsTrigger value="sources"><Link className="mr-2" /> Sources</TabsTrigger>
        </TabsList>
        <TabsContent value="report" className="mt-4">
            <div>
              {renderContent(report)}
            </div>
        </TabsContent>
        <TabsContent value="keypoints" className="mt-4">
          {keypoints && keypoints.length > 0 && (
            <div>
              <ul className="space-y-3 list-disc list-inside">
                {keypoints.map((point, index) => (
                  <li key={index}>{point}</li>
                ))}
              </ul>
            </div>
          )}
        </TabsContent>
        <TabsContent value="sources" className="mt-4">
          {sources && sources.length > 0 && (
            <div>
              <ul className="space-y-2">
                {sources.map((source, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <LinkIcon className="h-4 w-4 text-accent flex-shrink-0" />
                    <a
                      href={source}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline break-all text-sm"
                    >
                      {source}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </CardContent>
  </>
);


export const ReportDisplay: React.FC<ReportDisplayProps> = ({ state, isSubmitting }) => {
  return (
    <Card className="h-full">
      <div className="h-full overflow-y-auto">
        {isSubmitting ? (
          <LoadingState />
        ) : state.error ? (
          <div className="p-8">
             <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Report Generation Failed</AlertTitle>
                <AlertDescription>
                  {state.error}
                </AlertDescription>
              </Alert>
          </div>
        ) : state.report && state.sources && state.keypoints ? (
          <ReportState report={state.report} keypoints={state.keypoints} sources={state.sources} />
        ) : (
          <WelcomeState />
        )}
      </div>
    </Card>
  );
};
