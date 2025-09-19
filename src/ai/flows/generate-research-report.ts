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

const reportGenerationPrompt = ai.definePrompt({
    name: 'reportGenerationPrompt',
    input: { schema: z.object({
        question: z.string(),
        uploadedFiles: z.array(z.string()).optional(),
        liveData: z.string().optional(),
    })},
    output: { schema: GenerateResearchReportOutputSchema },
    prompt: `You are a research assistant who generates structured, evidence-based reports with citations.

Answer the following question, incorporating information from uploaded files and live data sources.
Cite your sources.

Question: {{{question}}}

{{#if uploadedFiles}}
Uploaded Files Context:
{{#each uploadedFiles}}
- {{media url=this}}
{{/each}}
{{/if}}

{{#if liveData}}
Live Data Context:
{{{liveData}}}
{{/if}}
`,
});


const generateResearchReportFlow = ai.defineFlow(
  {
    name: 'generateResearchReportFlow',
    inputSchema: GenerateResearchReportInputSchema,
    outputSchema: GenerateResearchReportOutputSchema,
  },
  async (input) => {
    let liveData: string | undefined;
    if (input.liveDataUrl) {
        try {
            const response = await fetch(input.liveDataUrl);
            if (!response.ok) {
                liveData = `Failed to fetch data from ${input.liveDataUrl}. Status: ${response.statusText}`;
            } else {
                const text = await response.text();
                // Let's return a snippet for brevity in the prompt
                liveData = text.slice(0, 5000);
            }
        } catch (e: any) {
            liveData = `An error occurred while fetching data from ${input.liveDataUrl}: ${e.message}`;
        }
    }

    const { output } = await reportGenerationPrompt({
        question: input.question,
        uploadedFiles: input.uploadedFiles,
        liveData,
    });

    if (!output) {
      throw new Error("The AI failed to generate a report.");
    }

    let sources = output.sources || [];
    if (input.liveDataUrl) {
      // Avoid adding duplicate sources if the AI already cited it.
      if (!sources.includes(input.liveDataUrl)) {
        sources.push(input.liveDataUrl);
      }
    }
    
    return {
        ...output,
        sources: sources,
    };
  }
);
