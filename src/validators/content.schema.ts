import { z } from "zod";

export const createContentSchema = z.object({
  type: z.enum(["document", "tweet", "youtube", "link"]),
  link: z.string().url(),
  title: z.string().min(3),
  tags: z.array(z.string()).optional(),
});
