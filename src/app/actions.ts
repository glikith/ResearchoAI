'use server';

import { generateResearchReport } from '@/ai/flows/generate-research-report';
import { z } from 'zod';

export interface FormState {
  report: string | null;
  keypoints: string[] | null;
  sources: string[] | null;
  error: string | null;
}

const formSchema = z.object({
  question: z.string(),
  files: z.array(z.string()),
});

async function fileToDataURI(file: File) {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  return `data:${file.type};base64,${buffer.toString('base64')}`;
}

export async function generateReportAction(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  try {
    const question = formData.get('question') as string;
    const files = formData.getAll('files') as File[];

    const fileDataURIs = await Promise.all(
        files.filter(file => file.name).map(file => fileToDataURI(file))
    );

    const validatedFields = formSchema.safeParse({
      question: question,
      files: fileDataURIs,
    });

    if (!validatedFields.success) {
      return {
        ...prevState,
        report: null,
        keypoints: null,
        sources: null,
        error: 'Invalid input.',
      };
    }

    const output = await generateResearchReport({
      question: validatedFields.data.question,
      uploadedFiles: validatedFields.data.files,
    });

    if (!output) {
      return {
        ...prevState,
        report: null,
        keypoints: null,
        sources: null,
        error: 'The AI failed to generate a report.',
      };
    }

    return {
      report: output.report,
      keypoints: output.keypoints,
      sources: output.sources,
      error: null,
    };
  } catch (error) {
    console.error('Error generating report:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return {
      ...prevState,
      report: null,
      keypoints: null,
      sources: null,
      error: `An unexpected error occurred: ${errorMessage}`,
    };
  }
}
