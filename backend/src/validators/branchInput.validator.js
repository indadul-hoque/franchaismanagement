import { z } from 'zod';

export const branchInputValidator = z.object({
  body: z.object({
    franchiseId: z.string().trim().min(1, "Franchise ID is required"),
    branchName: z.string().trim().min(1, "Branch name is required"),
    
    // Limits inputs cleanly to your production model enum options
    status: z.enum(["Active", "Inactive", "Under Construction", "Closed"]).default("Under Construction"),
    
    contact: z.object({
      email: z.string().trim().email("Invalid email address format"),
      phone: z.string().trim().min(1, "Phone number is required"),
      managerName: z.string().trim().min(1, "Manager name is required"),
    }),
    
    location: z.object({
      addressLine: z.string().trim().min(1, "Address is required"),
      city: z.string().trim().min(1, "City is required"),
      state: z.string().trim().min(1, "State is required"),
      postalCode: z.string().trim().min(1, "Postal code is required"),
      
      coordinates: z.object({
        type: z.literal('Point').default('Point'),
        // Fixed: Correctly matches an array containing exactly 2 numbers [longitude, latitude]
        coordinates: z.array(z.coerce.number()).length(2, "Coordinates must contain exactly [longitude, latitude]")
      })
    })
  })
});