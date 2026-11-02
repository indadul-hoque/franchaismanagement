import { z } from "zod";

export const courseInputValidator = z.object({
  params: z
    .object({
      id: z.string().min(1, "Course ID parameter is required").optional(),
    })
    .optional(),
  body: z.object({
    courseTitle: z.string().trim().min(1, "Course title is required"),

    instructorName: z.string().trim().min(1, "Instructor name is required"),

    courseLevel: z
      .enum(["Beginner", "Intermediate", "Advanced", "All Levels"])
      .default("All Levels"),

    category: z
      .enum([
        "Coding & Tech",
        "Arts & Crafts",
        "Math & Logic",
        "Languages",
        "Science",
        "Music",
        "General",
      ])
      .default("General"),

    status: z.enum(["Draft", "Published", "Archived"]).default("Draft"),

    courseDescription: z
      .string()
      .trim()
      .min(1, "Course description is required"),

    shortSummary: z
      .string()
      .trim()
      .max(160, "Short summary must be 160 characters or less")
      .optional(),

    // Pricing Object
    pricing: z.object({
      basePrice: z.coerce
        .number({ invalid_type_error: "Base price must be a number" })
        .min(0, "Base price cannot be negative"),
      discountedPrice: z.coerce
        .number()
        .min(0, "Discounted price cannot be negative")
        .optional()
        .default(0),
      currency: z.string().trim().default("INR"),
    }),

    // Target Age Group
    targetAgeGroup: z
      .object({
        minAge: z.coerce.number().min(0).max(18).optional().default(5),
        maxAge: z.coerce.number().min(0).max(18).optional().default(15),
      })
      .optional(),

    // Boolean Flags
    supervisionRequired: z.boolean().optional().default(false),
    isInstructorBackgroundChecked: z.boolean().optional().default(false),

    // Media Links
    thumbnailUrl: z.string().trim().optional().default(""),
    promoVideoUrl: z.string().trim().optional().default(""),

    // Arrays
    learningObjectives: z.array(z.string().trim()).optional().default([]),
    targetedAudience: z.array(z.string().trim()).optional().default([]),

    // Curriculum Structure (Matched to Mongoose nested schemas)
    curriculum: z
      .array(
        z.object({
          moduleName: z.string().trim().min(1, "Module name is required"),
          description: z.string().trim().optional(),
          lessons: z
            .array(
              z.object({
                title: z.string().trim().min(1, "Lesson title is required"),
                durationInMins: z.coerce.number().min(0).optional().default(0),
                isFreePreview: z.boolean().optional().default(false),
                materialsNeeded: z
                  .array(z.string().trim())
                  .optional()
                  .default([]),
              }),
            )
            .optional()
            .default([]),
        }),
      )
      .optional()
      .default([]),
  }),
});
