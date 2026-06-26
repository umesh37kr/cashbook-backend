import { z } from "zod";

const entryTypeSchema = z.enum(["cash_in", "cash_out"]);
const paymentModeSchema = z.enum(["cash", "online"]);
const dateSchema = z.coerce.date();

export const createEntrySchema = z.object({
  type: entryTypeSchema,
  amount: z.number().positive(),
  entryDate: dateSchema,
  remark: z.string().trim().max(500).optional(),
  category: z.string().trim().max(80).optional(),
  paymentMode: paymentModeSchema,
});

export const updateEntrySchema = z
  .object({
    type: entryTypeSchema.optional(),
    amount: z.number().positive().optional(),
    entryDate: dateSchema.optional(),
    remark: z.string().trim().max(500).optional(),
    category: z.string().trim().max(80).optional(),
    paymentMode: paymentModeSchema.optional(),
  })
  .refine((payload) => Object.keys(payload).length > 0, {
    message: "At least one field is required",
  });

export const entryFilterSchema = z.object({
  search: z.string().trim().optional(),
  type: entryTypeSchema.optional(),
  paymentMode: paymentModeSchema.optional(),
  category: z.string().trim().optional(),
  fromDate: dateSchema.optional(),
  toDate: dateSchema.optional(),
});
