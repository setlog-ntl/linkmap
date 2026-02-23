import { z } from 'zod';

export const aiQuickEditSchema = z.object({
  questionId: z.string().min(1).max(100),
  templateSlug: z.string().min(1),
  targetModuleId: z.string().min(1),
  targetFields: z.array(z.string()).min(1).max(5),
  currentValues: z.record(z.string(), z.unknown()),
  fieldHints: z
    .array(
      z.object({
        key: z.string(),
        type: z.string(),
        options: z
          .array(z.object({ value: z.string(), label: z.string() }))
          .optional(),
      })
    )
    .optional(),
  inlinePolish: z.boolean().optional(),
});

export type AiQuickEditRequest = z.infer<typeof aiQuickEditSchema>;
