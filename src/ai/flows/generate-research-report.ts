'use server';

/**
 * @fileOverview An AI agent that generates a structured, evidence-based report with citations,
 * incorporating information from uploaded files and live data sources.
 *
 * - generateResearchReport - A function that handles the research report generation process.
 * - GenerateResearchReportInput - The input type for the generateResearchReport function.
 * - GenerateResearchReportOutput - The return type for the generateResearchReport function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateResearchReportInputSchema = z.object({
  question: z.string().describe('The research question to answer.'),
  uploadedFiles: z
    .array(z.string())
    .optional()
    .describe('A list of data URIs of uploaded files to use as context.'),
  liveDataUrl: z
    .string()
    .optional()
    .describe('A URL to fetch live data from.'),
});
export type GenerateResearchReportInput = z.infer<
  typeof GenerateResearchReportInputSchema
>;

const GenerateResearchReportOutputSchema = z.object({
  report: z.string().describe('The generated research report.'),
  sources: z.array(z.string()).describe('A list of cited sources.'),
});
export type GenerateResearchReportOutput = z.infer<
  typeof GenerateResearchReportOutputSchema
>;

export async function generateResearchReport(
  input: GenerateResearchReportInput
): Promise<GenerateResearchReportOutput> {
  return generateResearchReportFlow(input);
}

const fetchDataTool = ai.defineTool({
  name: 'fetchData',
  description: 'Fetches data from a given URL.',
  inputSchema: z.object({
    url: z.string().describe('The URL to fetch data from.'),
  }),
  outputSchema: z.string(),
},
async (input) => {
    // In a real application, this would fetch data from the URL.
    // For now, it returns a placeholder.
    return `Data fetched from ${input.url}`;
  }
);

const generateResearchReportPrompt = ai.definePrompt({
  name: 'generateResearchReportPrompt',
  input: {schema: GenerateResearchReportInputSchema},
  output: {schema: GenerateResearchReportOutputSchema},
  tools: [fetchDataTool],
  prompt: `You are a research assistant who generates structured, evidence-based reports with citations.

  Answer the following question, incorporating information from uploaded files and live data sources.
  Cite your sources.

  Question: {{{question}}}

  {{#if uploadedFiles}}
  Uploaded Files:
  {{#each uploadedFiles}}
  - {{media url=this}}
  {{/each}}
  {{/if}}

  {{#if liveDataUrl}}
  You can use the fetchData tool to get live data from the following URL: {{{liveDataUrl}}}
  {{/if}}
  `,
});

const generateResearchReportFlow = ai.defineFlow(
  {
    name: 'generateResearchReportFlow',
    inputSchema: GenerateResearchReportInputSchema,
    outputSchema: GenerateResearchReportOutputSchema,
  },
  async input => {
    const {output} = await generateResearchReportPrompt(input);
    return output!;
  }
);
