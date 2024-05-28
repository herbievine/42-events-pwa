import { z } from "zod";

export const userSchema = z.object({
  user_id: z.number(),
  login: z.string(),
  image_url: z.string(),
  campus_ids: z.array(z.number()),
  primary_campus_id: z.number(),
  last_seen: z.coerce.date(),
});
