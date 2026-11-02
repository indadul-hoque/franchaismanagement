import Courses from "../models/courses.model.js";
import ApiError from "../utils/ApiError.js";

export const calculateMetrics = (curriculum) => {
  let totalLessonsCount = 0;
  let totalMinutes = 0;

  if (curriculum && Array.isArray(curriculum)) {
    curriculum.forEach((moduleItem) => {
      if (moduleItem.lessons && Array.isArray(moduleItem.lessons)) {
        totalLessonsCount += moduleItem.lessons.length;
        totalMinutes += moduleItem.lessons.reduce(
          (acc, current) => acc + (current.durationInMins || 0),
          0
        );
      }
    });
  }

  const totalHours =
    totalMinutes > 0 ? parseFloat((totalMinutes / 60).toFixed(1)) : 0;

  return { totalHours, totalLessonsCount };
};

export const createCourse = async (data) => {
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
  } = data;

  if (
    !courseTitle ||
    !instructorName ||
    !courseDescription ||
    !pricing?.basePrice
  ) {
    throw new ApiError(
      400,
      "Crucial operational keys (Title, Instructor, Description, Base Price) are missing."
    );
  }

  const { totalHours, totalLessonsCount } = calculateMetrics(curriculum);

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

  await newCourse.validate();

  const checkSlugExist = await Courses.findOne({ slug: newCourse.slug });
  if (checkSlugExist) {
    newCourse.slug = `${newCourse.slug}-${Math.floor(1000 + Math.random() * 9000)}`;
  }

  await newCourse.save();
  return newCourse;
};

export const getAllCourses = async ({ category, age, status }) => {
  const query = {};

  if (category) query.category = category;
  if (status) query.status = status;

  if (age) {
    query["targetAgeGroup.minAge"] = { $lte: Number(age) };
    query["targetAgeGroup.maxAge"] = { $gte: Number(age) };
  }

  return await Courses.find(query).sort({ createdAt: -1 });
};

export const updateCourseById = async (id, data) => {
  const existingCourse = await Courses.findById(id);
  if (!existingCourse) {
    throw new ApiError(404, "Course not found");
  }

  const { totalHours, totalLessonsCount } = calculateMetrics(data.curriculum);

  const updatePayload = {
    ...data,
    supervisionRequired: Boolean(data.supervisionRequired),
    isInstructorBackgroundChecked: Boolean(data.isInstructorBackgroundChecked),
    metrics: {
      totalHours,
      totalLessonsCount,
    },
  };

  if (data.pricing) {
    updatePayload.pricing = {
      basePrice: Number(data.pricing.basePrice ?? existingCourse.pricing.basePrice),
      discountedPrice: Number(data.pricing.discountedPrice ?? existingCourse.pricing.discountedPrice),
      currency: data.pricing.currency || existingCourse.pricing.currency,
    };
  }

  if (data.targetAgeGroup) {
    updatePayload.targetAgeGroup = {
      minAge: Number(data.targetAgeGroup.minAge ?? existingCourse.targetAgeGroup.minAge),
      maxAge: Number(data.targetAgeGroup.maxAge ?? existingCourse.targetAgeGroup.maxAge),
    };
  }

  return await Courses.findByIdAndUpdate(id, updatePayload, {
    new: true,
    runValidators: true,
  });
};

export const updateCourseStatusById = async (id, status) => {
  const validStatus = ["Draft", "Published", "Archived"];
  if (!validStatus.includes(status)) {
    throw new ApiError(400, "Invalid status value");
  }

  const updatedCourse = await Courses.findByIdAndUpdate(
    id,
    { status },
    { new: true, runValidators: true }
  );

  if (!updatedCourse) {
    throw new ApiError(404, "Course not found");
  }

  return updatedCourse;
};

export const deleteCourseById = async (id) => {
  const deletedCourse = await Courses.findByIdAndDelete(id);
  if (!deletedCourse) {
    throw new ApiError(404, "Course not found");
  }
  return deletedCourse;
};

export default {
  calculateMetrics,
  createCourse,
  getAllCourses,
  updateCourseById,
  updateCourseStatusById,
  deleteCourseById,
};

