'use server';

/**
 * @fileOverview A flow to integrate live data for research reports.
 *
 * - generateReportWithLiveData - A function that generates a research report using live data.
 * - GenerateReportWithLiveInput - The input type for the generateReportWithLiveData function.
 * - GenerateReportWithLiveOutput - The return type for the generateReportWithLiveData function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateReportWithLiveInputSchema = z.object({
  question: z.string().describe('The research question to answer.'),
  liveData: z.string().describe('Fresh, live data to incorporate into the report.'),
  uploadedFiles: z.array(z.string()).optional().describe('List of file names uploaded by the user')
});
export type GenerateReportWithLiveInput = z.infer<typeof GenerateReportWithLiveInputSchema>;

const GenerateReportWithLiveOutputSchema = z.object({
  report: z.string().describe('The generated research report with citations.'),
  sources: z.array(z.string()).describe('The sources used to generate the report.'),
});
export type GenerateReportWithLiveOutput = z.infer<typeof GenerateReportWithLiveOutputSchema>;

export async function generateReportWithLiveData(input: GenerateReportWithLiveInput): Promise<GenerateReportWithLiveOutput> {
  return generateReportWithLiveDataFlow(input);
}

const generateReportWithLiveDataPrompt = ai.definePrompt({
  name: 'generateReportWithLiveDataPrompt',
  input: {schema: GenerateReportWithLiveInputSchema},
  output: {schema: GenerateReportWithLiveOutputSchema},
  prompt: `You are a research assistant. Generate a report to answer the user's question using the provided live data and any relevant information from the uploaded files.

Question: {{{question}}}

Live Data: {{{liveData}}}

Uploaded Files: {{#each uploadedFiles}}{{{this}}} {{/each}}

Format the report with headings and citations. Return the report and a list of sources used.`,
});

const generateReportWithLiveDataFlow = ai.defineFlow(
  {
    name: 'generateReportWithLiveDataFlow',
    inputSchema: GenerateReportWithLiveInputSchema,
    outputSchema: GenerateReportWithLiveOutputSchema,
  },
  async input => {
    const {output} = await generateReportWithLiveDataPrompt(input);
    return output!;
  }
);
