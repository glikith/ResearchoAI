'use client';

import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import type { FormState } from '@/app/actions';
import { Link as LinkIcon, AlertCircle, FileText, ListChecks } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface ReportDisplayProps {
  state: FormState;
  isSubmitting: boolean;
}

const WelcomeState = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-8 bg-gray-800 rounded-lg">
      <h2 className="text-lg font-semibold mb-2">Generated Report</h2>
      <p className="text-muted-foreground text-sm max-w-md">
        Your report will appear here once generated.
      </p>
    </div>
  );
};

const LoadingState = () => (
  <div className="p-6 bg-gray-800 rounded-lg">
    <div className="flex items-center gap-3 mb-6">
        <Skeleton className="h-8 w-8 rounded-full" />
        <Skeleton className="h-6 w-48" />
    </div>
    <Skeleton className="h-6 w-3/4 mb-4" />
    <Skeleton className="h-4 w-full mb-2" />
    <Skeleton className="h-4 w-full mb-2" />
    <Skeleton className="h-4 w-5/6 mb-6" />
  </div>
);

const renderContent = (text: string) => {
  if (!text) return null;

  const processLine = (line: string) => {
    // Bold
    line = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    return line;
  };

  const blocks = text.split('\n\n');
  return blocks.map((block, index) => {
    block = block.trim();

    if (block.startsWith('## ')) {
      return <h2 key={index} className="text-2xl font-bold mt-6 mb-3" dangerouslySetInnerHTML={{ __html: processLine(block.substring(3)) }} />;
    }
    if (block.startsWith('# ')) {
        return <h1 key={index} className="text-3xl font-bold mt-8 mb-4" dangerouslySetInnerHTML={{ __html: processLine(block.substring(2)) }} />;
    }
    if (block.startsWith('- ') || block.startsWith('* ')) {
      const listItems = block.split('\n').map((item, itemIndex) => {
        const content = item.substring(item.startsWith('- ') ? 2 : 2); // Handles both '- ' and '* '
        return <li key={itemIndex} dangerouslySetInnerHTML={{ __html: processLine(content) }} />;
      });
      return <ul key={index} className="list-disc list-inside space-y-2 my-4 pl-4">{listItems}</ul>;
    }
    return <p key={index} className="mb-4 leading-relaxed" dangerouslySetInnerHTML={{ __html: processLine(block) }} />;
  });
};

const ReportState: React.FC<{ report: string; keypoints: string[]; sources: string[] }> = ({ report, keypoints, sources }) => (
  <div className="bg-gray-800 rounded-lg p-1">
      <Tabs defaultValue="report" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-gray-900">
          <TabsTrigger value="report" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white"><FileText className="mr-2 h-4 w-4" /> Report</TabsTrigger>
          <TabsTrigger value="keypoints" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white"><ListChecks className="mr-2 h-4 w-4" /> Key Points</TabsTrigger>
          <TabsTrigger value="sources" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white"><LinkIcon className="mr-2 h-4 w-4" /> Sources</TabsTrigger>
        </TabsList>
        <div className="p-4 max-h-[400px] overflow-y-auto">
            <TabsContent value="report">
                {renderContent(report)}
            </TabsContent>
            <TabsContent value="keypoints">
              {keypoints && keypoints.length > 0 && (
                <ul className="space-y-3 list-disc list-inside">
                  {keypoints.map((point, index) => (
                    <li key={index}>{point}</li>
                  ))}
                </ul>
              )}
            </TabsContent>
            <TabsContent value="sources">
              {sources && sources.length > 0 && (
                <ul className="space-y-2">
                  {sources.map((source, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <LinkIcon className="h-4 w-4 text-indigo-400 flex-shrink-0" />
                      <a href={source} target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline break-all text-sm">
                        {source}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </TabsContent>
        </div>
      </Tabs>
  </div>
);


export const ReportDisplay: React.FC<ReportDisplayProps> = ({ state, isSubmitting }) => {
    if (isSubmitting) {
      return <LoadingState />;
    }
    if (state.error) {
      return (
        <div className="p-8 bg-gray-800 rounded-lg">
           <div className="border-l-4 border-red-500 bg-red-900/20 p-4 rounded-r-lg">
              <AlertCircle className="h-5 w-5 text-red-500 inline-block mr-2" />
              <span className="font-semibold">Report Generation Failed:</span> {state.error}
            </div>
        </div>
      );
    }
    if (state.report && state.keypoints && state.sources) {
      return <ReportState report={state.report} keypoints={state.keypoints} sources={state.sources} />;
    }
    return <WelcomeState />;
};
