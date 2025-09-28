import { z } from "zod";

// Schema for hotel search
export const listHotelsSchema = z.object({
  city: z.string().describe("City where to search for hotels"),
  checkin: z.string().describe("Check-in date in YYYY-MM-DD format"),
  checkout: z.string().describe("Check-out date in YYYY-MM-DD format"),
  rooms: z.number().min(1).max(10).describe("Number of rooms (1-10)"),
  withBreakfast: z
    .boolean()
    .optional()
    .describe("Include breakfast (optional, default false)"),
  refundableOnly: z
    .boolean()
    .optional()
    .describe("Only bookings with free cancellation (optional, default false)"),
});

// Response schema for hotel search
export const hotelSchema = z.object({
  hotelId: z.string(),
  name: z.string(),
  nightly: z.number(),
  total: z.number(),
  rating: z.number(),
  policy: z.string(),
  currency: z.string(),
  city: z.string(),
  image: z.string().optional(),
});

// AI parameter extraction schema
export const hotelSearchExtractionSchema = z.object({
  city: z.string().describe("City where to search for hotels"),
  checkin: z.string().optional().describe("Check-in date in YYYY-MM-DD format"),
  checkout: z
    .string()
    .optional()
    .describe("Check-out date in YYYY-MM-DD format"),
  rooms: z.number().optional().describe("Number of desired rooms"),
  withBreakfast: z
    .boolean()
    .optional()
    .describe("Preference for included breakfast"),
  refundableOnly: z
    .boolean()
    .optional()
    .describe("Preference for free cancellation"),
});
