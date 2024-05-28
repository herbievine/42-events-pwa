import { z } from "zod";

export const notificationSchema = z.object({
  user_id: z.number(),
  event_id: z.number(),
  has_read: z.boolean(),
  created_at: z.coerce.date(),
  deleted_at: z.coerce.date().optional(),
});

export type Event = z.infer<typeof notificationSchema>;
