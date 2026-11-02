import { z } from 'zod';

export const franchiseRegisterInputValidator = z.object({
  body: z.object({
    brandName: z.string().trim().min(1, "Brand name is required"),
    
    // Flat Owner fields matching the form input
    firstName: z.string().trim().min(1, "Owner first name is required"),
    lastName: z.string().trim().min(1, "Owner last name is required"),
    email: z.string().trim().email("Invalid email address format"),
    phone: z.string().trim().min(7, "Phone number is too short"),
    taxId: z.string().trim().min(1, "Tax ID is required"),
    
    // Flat Business details
    legalName: z.string().trim().min(1, "Legal name is required"),
    tradeName: z.string().trim().min(1, "Trade name is required"),
    incorporationType: z.enum(['LLC', 'Corporation', 'Partnership', 'Sole Proprietorship', 'Other']),
    
    // Flat Location fields
    addressLine1: z.string().trim().min(1, "Address is required"),
    addressLine2: z.string().trim().optional(),
    city: z.string().trim().min(1, "City is required"),
    state: z.string().trim().min(1, "State is required"),
    postalCode: z.string().trim().min(1, "Postal code is required"),
    country: z.string().trim().default('US'),
    
    // Geospatial values mapped flat
    longitude: z.coerce.number().min(-180).max(180),
    latitude: z.coerce.number().min(-90).max(90),
    
    // Flat Contract/Agreement Details
    signedDate: z.coerce.date(),
    expiryDate: z.coerce.date(),
    initialFeePaid: z.coerce.number().nonnegative(),
    royaltyPercentage: z.coerce.number().min(0).max(100),
    marketingFeePercentage: z.coerce.number().min(0).max(100).optional().default(0),
    contractDocumentUrl: z.string().url().optional(), // Added to fully support schema option
    
    password: z.string().min(8, "Password must be at least 8 characters long"),
  })
});