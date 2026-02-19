import { z } from 'zod';

export const envDoctorSchema = z.object({
  project_id: z.string().uuid(),
});
