import { z } from "zod";

export const AiSectionsSchema = z.object({
  rebuttal: z.string().optional(),
  improve: z.string().optional(),
  reason: z.string().optional(),
  risk: z.string().optional(),
});

export type AiSectionsJson = z.infer<typeof AiSectionsSchema>;
