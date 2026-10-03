import Courses from "../models/courses.model.js";
import mongoose from "mongoose";

// --- Helper to calculate metrics ---
const calculateMetrics = (curriculum) => {
  let totalLessonsCount = 0;
  let totalMinutes = 0;

  if (curriculum && Array.isArray(curriculum)) {
    curriculum.forEach((moduleItem) => {
      if (moduleItem.lessons && Array.isArray(moduleItem.lessons)) {
        totalLessonsCount += moduleItem.lessons.length;
        totalMinutes += moduleItem.lessons.reduce(
          (acc, current) => acc + (current.durationInMins || 0),
          0,
        );
      }
    });
  }

  const totalHours =
    totalMinutes > 0 ? parseFloat((totalMinutes / 60).toFixed(1)) : 0;

  return { totalHours, totalLessonsCount };
};

// ==========================================
// ADD COURSE
// ==========================================
export const addCourse = async (req, res) => {
  try {
    const {
      courseTitle,
      instructorName,
      courseLevel,
      courseDescription,
      shortSummary,
      pricing,
      curriculum,
      learningObjectives,
      targetedAudience,
      thumbnailUrl,
      promoVideoUrl,
      status,
      targetAgeGroup,
      category,
      supervisionRequired,
      isInstructorBackgroundChecked,
    } = req.body;

    // 1. Operational Safeguards
    if (
      !courseTitle ||
      !instructorName ||
      !courseDescription ||
      !pricing?.basePrice
    ) {
      return res.status(400).json({
        message:
          "Crucial operational keys (Title, Instructor, Description, Base Price) are missing.",
      });
    }

    // 2. Metrics Calculation
    const { totalHours, totalLessonsCount } = calculateMetrics(curriculum);

    // 3. Assemble New Course Instance
    const newCourse = new Courses({
      courseTitle,
      instructorName,
      courseLevel,
      courseDescription,
      shortSummary,
      thumbnailUrl: thumbnailUrl || "",
      promoVideoUrl: promoVideoUrl || "",
      status: status || "Draft",
      learningObjectives: learningObjectives || [],
      targetedAudience: targetedAudience || [],

      targetAgeGroup: targetAgeGroup || { minAge: 5, maxAge: 15 },
      category: category || "General",
      supervisionRequired: Boolean(supervisionRequired),
      isInstructorBackgroundChecked: Boolean(isInstructorBackgroundChecked),

      pricing: {
        basePrice: Number(pricing.basePrice),
        discountedPrice: Number(pricing.discountedPrice || 0),
        currency: pricing.currency || "INR",
      },
      metrics: {
        totalHours,
        totalLessonsCount,
      },
      curriculum: curriculum || [],
    });

    // Run schema hooks (slug creation)
    await newCourse.validate();

    // Check slug collision
    const checkSlugExist = await Courses.findOne({ slug: newCourse.slug });
    if (checkSlugExist) {
      newCourse.slug = `${newCourse.slug}-${Math.floor(1000 + Math.random() * 9000)}`;
    }

    await newCourse.save();

    return res.status(201).json({
      message: "Course initialized and saved successfully.",
      course: newCourse,
    });
  } catch (error) {
    console.error("Course Addition Failure:", error);
    return res.status(500).json({
      error: "Failed to create course.",
      technicalDetails: error.message,
    });
  }
};

// ==========================================
// GET ALL COURSES (WITH FILTERS)
// ==========================================
export const allCourse = async (req, res) => {
  try {
    const { category, age, status } = req.query;
    let query = {};

    if (category) query.category = category;
    if (status) query.status = status;

    if (age) {
      query["targetAgeGroup.minAge"] = { $lte: Number(age) };
      query["targetAgeGroup.maxAge"] = { $gte: Number(age) };
    }

    const all_courses = await Courses.find(query).sort({ createdAt: -1 });

    // FIX: Return empty array with 200 status instead of 404 error
    return res.status(200).json({
      courses: all_courses,
      totalCourses: all_courses.length,
      message: `Successfully fetched ${all_courses.length} courses.`,
    });
  } catch (error) {
    return res.status(500).json({
      error: "An error occurred while fetching courses.",
      details: error.message,
    });
  }
};

// ==========================================
// UPDATE COURSE
// ==========================================
export const updateCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      courseTitle,
      instructorName,
      courseLevel,
      category,
      courseDescription,
      shortSummary,
      thumbnailUrl,
      promoVideoUrl,
      status,
      pricing, // FIX: Receive pricing object
      targetAgeGroup, // FIX: Receive targetAgeGroup object
      supervisionRequired,
      isInstructorBackgroundChecked,
      learningObjectives,
      targetedAudience,
      curriculum,
    } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid course ID format" });
    }

    const existingCourse = await Courses.findById(id);
    if (!existingCourse) {
      return res.status(404).json({ error: "Course not found" });
    }

    // Recalculate metrics
    const { totalHours, totalLessonsCount } = calculateMetrics(curriculum);

    // Build normalized update payload
    const updatePayload = {
      courseTitle,
      instructorName,
      courseLevel,
      category,
      courseDescription,
      shortSummary,
      thumbnailUrl,
      promoVideoUrl,
      status,
      supervisionRequired: Boolean(supervisionRequired),
      isInstructorBackgroundChecked: Boolean(isInstructorBackgroundChecked),
      learningObjectives,
      targetedAudience,
      curriculum,
      metrics: {
        totalHours,
        totalLessonsCount,
      },
    };

    // Safely apply pricing updates
    if (pricing) {
      updatePayload.pricing = {
        basePrice: Number(
          pricing.basePrice ?? existingCourse.pricing.basePrice,
        ),
        discountedPrice: Number(
          pricing.discountedPrice ?? existingCourse.pricing.discountedPrice,
        ),
        currency: pricing.currency || existingCourse.pricing.currency,
      };
    }

    // Safely apply age group updates
    if (targetAgeGroup) {
      updatePayload.targetAgeGroup = {
        minAge: Number(
          targetAgeGroup.minAge ?? existingCourse.targetAgeGroup.minAge,
        ),
        maxAge: Number(
          targetAgeGroup.maxAge ?? existingCourse.targetAgeGroup.maxAge,
        ),
      };
    }

    const updatedCourse = await Courses.findByIdAndUpdate(id, updatePayload, {
      new: true,
      runValidators: true,
    });

    return res.status(200).json({
      message: "Course updated successfully",
      course: updatedCourse,
    });
  } catch (error) {
    console.error("Error updating course:", error);
    return res.status(500).json({
      error: "Internal server error",
      details: error.message,
    });
  }
};

// ==========================================
// UPDATE COURSE STATUS
// ==========================================
export const updateCourseStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid course ID format" });
    }

    const validStatus = ["Draft", "Published", "Archived"];
    if (!validStatus.includes(status)) {
      return res.status(400).json({ error: "Invalid status value" });
    }

    const updatedCourse = await Courses.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true },
    );

    if (!updatedCourse) {
      return res.status(404).json({ error: "Course not found" });
    }

    return res.status(200).json({
      message: "Course status updated successfully",
      course: updatedCourse,
    });
  } catch (error) {
    console.error("Error updating course status:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// ==========================================
// DELETE COURSE
// ==========================================
export const deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid course ID format" });
    }

    const deletedCourse = await Courses.findByIdAndDelete(id);
    if (!deletedCourse) {
      return res.status(404).json({ error: "Course not found" });
    }

    return res.json({ message: "Course deleted successfully", deletedCourse });
  } catch (error) {
    console.error("Error deleting course:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
