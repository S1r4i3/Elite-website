import { z } from "zod";
import { serviceOptions, customerTypeOptions } from "@/lib/services";

const serviceValues = serviceOptions.map((o) => o.value) as [string, ...string[]];
const customerValues = customerTypeOptions.map((o) => o.value) as [string, ...string[]];

export const taxYearOptions = (() => {
  const now = new Date().getFullYear();
  const years = [now, now - 1, now - 2, now - 3, now - 4].map(String);
  return [...years, "Multiple years", "Not applicable"];
})();

export const leadSchema = z.object({
  firstName: z.string().trim().min(1, "Please enter your first name").max(60),
  lastName: z.string().trim().min(1, "Please enter your last name").max(60),
  email: z.string().trim().email("Please enter a valid email address").max(120),
  phone: z
    .string()
    .trim()
    .min(7, "Please enter a valid phone number")
    .max(25)
    .regex(/^[+()\-.\s\d]+$/, "Please enter a valid phone number"),
  service: z.enum(serviceValues, { error: "Please choose a service" }),
  customerType: z.enum(customerValues, { error: "Please choose a customer type" }),
  taxYear: z.string().trim().min(1, "Please choose a tax year").max(30),
  message: z.string().trim().max(2000, "Please keep your message under 2,000 characters").optional().or(z.literal("")),
  documentIds: z.array(z.string().uuid()).max(10).optional(),
  source: z.string().max(120).optional(),
  estimate: z.record(z.string(), z.any()).optional(),
  /** Honeypot — must stay empty */
  website: z.string().max(0).optional().or(z.literal("")),
});

export type LeadInput = z.input<typeof leadSchema>;
export type LeadData = z.output<typeof leadSchema>;

export const estimateSchema = z.object({
  employmentType: z.enum(["w2", "1099", "self-employed", "business-owner"]),
  income: z.coerce.number().min(0).max(100_000_000),
  withheld: z.coerce.number().min(0).max(100_000_000),
  filingStatus: z.enum(["single", "mfj", "hoh", "mfs"]),
  dependents: z.coerce.number().int().min(0).max(20),
  estimatedPayments: z.coerce.number().min(0).max(100_000_000).optional(),
});

export { UPLOAD_LIMITS, acceptedExtensions } from "./upload";
