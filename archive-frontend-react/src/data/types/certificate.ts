import { z } from 'zod';

export interface Field {
  key: string;
  label: string;
  type: 'text' | 'textarea' | 'date';
  required: boolean;
}

export interface CustomField {
  key: string;
  label: string;
  type: 'text' | 'textarea' | 'date';
  value: string;
}

export const customFieldSchema = z.object({
  key: z.string().min(1),
  label: z.string().min(1),
  type: z.enum(['text', 'textarea', 'date']),
  value: z.string(),
});

export const certificateFormSchema = z.object({
  templateId: z.string().min(1, 'Template requis'),
  customFields: z.array(customFieldSchema).min(1, 'Au moins un champ requis'),
});

export type CertificateFormData = z.infer<typeof certificateFormSchema>;
