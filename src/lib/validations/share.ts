import { z } from 'zod';

export const toggleShareSchema = z.object({
  enabled: z.boolean(),
});
