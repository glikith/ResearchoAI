'use server';

import { generateResearchReport } from '@/ai/flows/generate-research-report';
import { z } from 'zod';

export interface FormState {
  report: string | null;
  sources: string[] | null;
  error: string | null;
}

const formSchema = z.object({
  question: z.string(),
  files: z.array(z.string()),
  liveDataUrl: z.string().optional(),
});

export async function generateReportAction(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  try {
    const question = formData.get('question') as string;
    const files = formData.getAll('files') as File[];
    const liveDataUrl = formData.get('liveDataUrl') as string;

    const fileNames = files.map((file) => file.name).filter(name => name);

    const validatedFields = formSchema.safeParse({
      question: question,
      files: fileNames,
      liveDataUrl: liveDataUrl,
    });

    if (!validatedFields.success) {
      return {
        ...prevState,
        report: null,
        sources: null,
        error: 'Invalid input.',
      };
    }

    const { output } = await generateResearchReport({
      question: validatedFields.data.question,
      uploadedFiles: validatedFields.data.files,
      liveDataUrl: validatedFields.data.liveDataUrl,
    });

    if (!output) {
      return {
        ...prevState,
        report: null,
        sources: null,
        error: 'The AI failed to generate a report.',
      };
    }

    return {
      report: output.report,
      sources: output.sources,
      error: null,
    };
  } catch (error) {
    console.error('Error generating report:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return {
      ...prevState,
      report: null,
      sources: null,
      error: `An unexpected error occurred: ${errorMessage}`,
    };
  }
}
