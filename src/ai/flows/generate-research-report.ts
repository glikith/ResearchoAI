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
    console.log(`Fetching data from ${input.url}...`);
    try {
        const response = await fetch(input.url);
        if (!response.ok) {
            return `Failed to fetch data from ${input.url}. Status: ${response.statusText}`;
        }
        const text = await response.text();
        // Let's return a snippet for brevity in the prompt
        return text.slice(0, 5000);
    } catch (e: any) {
        return `An error occurred while fetching data from ${input.url}: ${e.message}`;
    }
  }
);

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
      liveData = await fetchDataTool({ url: input.liveDataUrl });
    }

    const { output } = await reportGenerationPrompt({
        question: input.question,
        uploadedFiles: input.uploadedFiles,
        liveData,
    });

    if (!output) {
      throw new Error("The AI failed to generate a report.");
    }

    let sources = [];
    if (input.liveDataUrl) {
      sources.push(input.liveDataUrl);
    }
    // Note: We can't get filenames from data URIs here.
    // A more robust solution might involve passing file metadata separately.
    
    return {
        ...output,
        sources: output.sources.concat(sources),
    };
  }
);
