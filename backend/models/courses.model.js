import mongoose from "mongoose";

const lessonSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  durationInMins: { type: Number, default: 0 },
  isFreePreview: { type: Boolean, default: false },
  // Optional: Highlight material parents need to prepare ahead of time
  materialsNeeded: [{ type: String }],
});

const moduleSchema = new mongoose.Schema({
  moduleName: { type: String, required: true, trim: true },
  description: { type: String, trim: true },
  lessons: [lessonSchema],
});

const courseSchema = new mongoose.Schema(
  {
    courseTitle: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    instructorName: {
      type: String,
      required: true,
      trim: true,
    },
    isInstructorBackgroundChecked: {
      type: Boolean,
      default: false,
    },
    courseLevel: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced", "All Levels"],
      default: "All Levels",
    },

    // --- NEW: Kids Specific Target Data ---
    targetAgeGroup: {
      minAge: { type: Number, default: 5, min: 0 },
      maxAge: { type: Number, default: 15, max: 18 },
    },
    category: {
      type: String,
      enum: [
        "Coding & Tech",
        "Arts & Crafts",
        "Math & Logic",
        "Languages",
        "Science",
        "Music",
        "General",
      ],
      default: "General",
    },
    supervisionRequired: {
      type: Boolean,
      default: false, // Useful for hands-on activities or experiments
    },
    // ------------------------------------

    status: {
      type: String,
      enum: ["Draft", "Published", "Archived"],
      default: "Draft",
    },
    thumbnailUrl: { type: String, default: "" },
    promoVideoUrl: { type: String, default: "" },

    // Fixed typo: maxlength
    shortSummary: { type: String, maxlength: 160 },
    courseDescription: { type: String, required: true },

    learningObjectives: [{ type: String }],
    targetedAudience: [{ type: String }], // e.g., ["Beginner coders aged 8-12", "Parents looking for STEM activities"]

    pricing: {
      basePrice: { type: Number, required: true, min: 0 },
      discountedPrice: { type: Number, default: 0, min: 0 },
      currency: { type: String, default: "INR" },
    },

    metrics: {
      totalHours: { type: Number, default: 0 },
      totalLessonsCount: { type: Number, default: 0 },
    },

    curriculum: [moduleSchema],
  },
  { timestamps: true },
);

courseSchema.pre("validate", function (next) {
  if (this.courseTitle && !this.slug) {
    this.slug = this.courseTitle
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  }
  next();
});

export default mongoose.models.Courses ||
  mongoose.model("Courses", courseSchema);
