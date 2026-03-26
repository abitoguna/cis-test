import { z } from "zod"

export const AddressSchema = z.object({
  street: z.string(),
  city: z.string(),
  state: z.string(),
  postalCode: z.string(),
  country: z.string(),
})

export const PackageSchema = z.object({
  weight: z.number().positive(),
  length: z.number(),
  width: z.number(),
  height: z.number(),
  unit: z.enum(["metric", "imperial"]),
})

export const RateRequestSchema = z.object({
  origin: AddressSchema,
  destination: AddressSchema,
  packages: z.array(PackageSchema),
})