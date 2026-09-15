import { z } from "zod";

// Validate public catalog query parameters before they reach a repository or database query.
export const catalogQuerySchema = z.object({
  q: z.string().trim().max(80).optional(),
  category: z.string().trim().max(40).optional(),
  sort: z.enum(["featured", "price-asc", "price-desc"]).default("featured"),
});

