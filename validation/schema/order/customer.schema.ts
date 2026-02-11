
import { z } from "zod";

export const orderSchema = z.object({
  customerName: z.string().min(1, "Name is required"),
  address: z.string().min(15, "Address must be at least 5 characters").max(60, "Address must be at less then 30 characters"),
  phone: z
    .string()
    .regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian phone number"),
});


export type OrderFormValues = z.infer<typeof orderSchema>;
