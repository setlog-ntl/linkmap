import { z } from 'zod';

export const costReportSchema = z.object({
  project_id: z.string().uuid(),
});

export type CostReportInput = z.infer<typeof costReportSchema>;
