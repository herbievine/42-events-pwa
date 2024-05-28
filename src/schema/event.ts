import { z } from "zod";

export const eventSchema = z.object({
  event_id: z.number(),
  name: z.string(),
  description: z.string(),
  location: z.string().optional(),
  type: z.string().optional(),
  attendees: z.number().optional(),
  max_attendees: z.number().optional(),
  begin_at: z.coerce.date(),
  end_at: z.coerce.date(),
  campus_ids: z.array(z.number()),
  cursus_ids: z.array(z.number()),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date(),
});

export type Event = z.infer<typeof eventSchema>;

export const eventSchemaWithRead = eventSchema.extend({
  has_read: z.boolean(),
});

export type EventWithRead = z.infer<typeof eventSchemaWithRead>;
