import { z } from "zod";

// Schema for flight search
export const listFlightsSchema = z.object({
  origin: z.string().describe("Origin airport code (e.g., CNF, GRU)"),
  destination: z.string().describe("Destination airport code (e.g., SFO, LAX)"),
  departDate: z.string().describe("Departure date in YYYY-MM-DD format"),
  returnDate: z
    .string()
    .optional()
    .describe(
      "Return date in YYYY-MM-DD format (optional for one-way flights)",
    ),
  adults: z.number().min(1).max(9).describe("Number of adults (1-9)"),
  directOnly: z
    .boolean()
    .optional()
    .describe("Direct flights only (optional, default false)"),
  withBaggage: z
    .boolean()
    .optional()
    .describe("Include baggage (optional, default false)"),
  cheapestOnly: z
    .boolean()
    .optional()
    .describe("Show cheapest flights only (optional, default false)"),
});

// Schema for flight booking
export const bookFlightSchema = z.object({
  itineraryId: z.string().describe("Itinerary ID of the flight to be booked"),
  passenger: z
    .object({
      fullName: z.string().describe("Full name of the passenger"),
      email: z.string().email().describe("Email address of the passenger"),
    })
    .describe("Main passenger information"),
});

// Schema for flight cancellation
export const cancelFlightSchema = z.object({
  pnr: z.string().describe("PNR code of the booking to be cancelled"),
});

// Response schema for flight search
export const flightSegmentSchema = z.object({
  carrier: z.string(),
  flightNumber: z.string(),
  from: z.string(),
  to: z.string(),
  depTime: z.string(),
  arrTime: z.string(),
  durationMin: z.number(),
});

export const flightItinerarySchema = z.object({
  itineraryId: z.string(),
  airline: z.string(),
  outbound: z.array(flightSegmentSchema),
  inbound: z.array(flightSegmentSchema).optional(),
  stops: z.number(),
  baggageIncluded: z.boolean(),
  totalPrice: z.number(),
  currency: z.string(),
});

// Response schema for flight booking
export const bookFlightResponseSchema = z.object({
  pnr: z.string(),
  status: z.literal("TICKETED"),
  total: z.number(),
  passenger: z.object({
    fullName: z.string(),
    email: z.string(),
  }),
  itineraryId: z.string(),
  createdAt: z.string(),
});

// Response schema for flight cancellation
export const cancelFlightResponseSchema = z.object({
  pnr: z.string(),
  status: z.literal("CANCELED"),
  canceledAt: z.string(),
});

// AI parameter extraction schemas
export const flightSearchExtractionSchema = z.object({
  origin: z.string().describe("Origin city or airport"),
  destination: z.string().describe("Destination city or airport"),
  departDate: z
    .string()
    .optional()
    .describe("Departure date in YYYY-MM-DD format"),
  returnDate: z
    .string()
    .optional()
    .describe("Return date in YYYY-MM-DD format"),
  adults: z.number().optional().describe("Number of adult passengers"),
  directOnly: z.boolean().optional().describe("Preference for direct flights"),
  withBaggage: z.boolean().optional().describe("Include baggage"),
  cheapestOnly: z
    .boolean()
    .optional()
    .describe("Search for cheapest flights only"),
});

export const flightBookingExtractionSchema = z.object({
  itineraryId: z.string().describe("Itinerary ID of the flight to be booked"),
  fullName: z.string().describe("Full name of the passenger"),
  email: z.string().describe("Email address of the passenger"),
});

export const flightCancellationExtractionSchema = z.object({
  pnr: z.string().describe("PNR code of the booking to be cancelled"),
});
