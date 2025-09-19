'use server';

/**
 * @fileOverview An AI agent that generates a structured, evidence-based report with citations,
 * incorporating information from uploaded files.
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
});
export type GenerateResearchReportInput = z.infer<
  typeof GenerateResearchReportInputSchema
>;

const GenerateResearchReportOutputSchema = z.object({
  report: z.string().describe('The generated research report.'),
  keypoints: z.array(z.string()).describe('A list of key points from the report.'),
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
    input: { schema: GenerateResearchReportInputSchema },
    output: { schema: GenerateResearchReportOutputSchema },
    prompt: `You are a research assistant who generates structured, evidence-based reports with citations.

Answer the following question, incorporating information from the uploaded files.
- Generate a full report.
- Extract the key points from the report.
- Cite your sources.

Question: {{{question}}}

{{#if uploadedFiles}}
Uploaded Files Context:
{{#each uploadedFiles}}
- {{media url=this}}
{{/each}}
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
    const { output } = await reportGenerationPrompt(input);

    if (!output) {
      throw new Error("The AI failed to generate a report.");
    }
    
    return {
        ...output
    };
  }
);
