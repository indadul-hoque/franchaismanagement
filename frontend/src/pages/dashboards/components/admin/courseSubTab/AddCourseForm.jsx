import React, { useState } from "react";
import {
  MdBook,
  MdPerson,
  MdCategory,
  MdLayers,
  MdPublishedWithChanges,
  MdCurrencyRupee,
  MdDescription,
  MdAdd,
  MdDelete,
  MdVerifiedUser,
  MdOndemandVideo,
  MdImage,
  MdOutlineCheckCircle,
  MdOutlineArrowBack,
  MdFolder,
  MdPlayLesson,
} from "react-icons/md";
import { FaGraduationCap } from "react-icons/fa";
import axios from "axios";
import toast from "react-hot-toast";
import { currentConfig } from "../../../../../utils";

const API_URL = currentConfig.API_URL;

const INITIAL_FORM_STATE = {
  _id: null,
  courseTitle: "",
  instructorName: "",
  courseLevel: "Beginner",
  category: "Coding & Tech",
  courseDescription: "",
  shortSummary: "",
  thumbnailUrl: "",
  promoVideoUrl: "",
  status: "Draft",
  basePrice: "",
  discountedPrice: "",
  minAge: 7,
  maxAge: 12,
  supervisionRequired: false,
  isInstructorBackgroundChecked: false,
  learningObjectives: [""],
  targetedAudience: [""],
  curriculum: [
    {
      moduleName: "",
      description: "",
      lessons: [{ title: "", durationInMins: 10, isFreePreview: false }],
    },
  ],
};

export default function AddCourseForm({ editData, onSuccess, onCancel }) {
  const [formData, setFormData] = useState(() => {
    if (editData) {
      return {
        _id: editData._id,
        courseTitle: editData.courseTitle || "",
        instructorName: editData.instructorName || "",
        courseLevel: editData.courseLevel || "Beginner",
        category: editData.category || "Coding & Tech",
        courseDescription: editData.courseDescription || "",
        shortSummary: editData.shortSummary || "",
        thumbnailUrl: editData.thumbnailUrl || "",
        promoVideoUrl: editData.promoVideoUrl || "",
        status: editData.status || "Draft",
        basePrice: editData.pricing?.basePrice ?? "",
        discountedPrice: editData.pricing?.discountedPrice ?? "",
        minAge: editData.targetAgeGroup?.minAge ?? 7,
        maxAge: editData.targetAgeGroup?.maxAge ?? 12,
        supervisionRequired: editData.supervisionRequired ?? false,
        isInstructorBackgroundChecked:
          editData.isInstructorBackgroundChecked ?? false,
        learningObjectives: editData.learningObjectives?.length
          ? editData.learningObjectives
          : [""],
        targetedAudience: editData.targetedAudience?.length
          ? editData.targetedAudience
          : [""],
        curriculum: editData.curriculum?.length
          ? editData.curriculum
          : [
              {
                moduleName: "",
                description: "",
                lessons: [
                  { title: "", durationInMins: 10, isFreePreview: false },
                ],
              },
            ],
      };
    }
    return INITIAL_FORM_STATE;
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Input Change Handlers
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Objective & Audience Arrays
  const handleArrayChange = (index, value, field) => {
    const updated = [...formData[field]];
    updated[index] = value;
    setFormData((prev) => ({ ...prev, [field]: updated }));
  };

  const addArrayItem = (field) => {
    setFormData((prev) => ({ ...prev, [field]: [...prev[field], ""] }));
  };

  const removeArrayItem = (index, field) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  // Curriculum Modules & Lessons
  const handleModuleChange = (modIndex, field, value) => {
    const updatedCurriculum = [...formData.curriculum];
    updatedCurriculum[modIndex][field] = value;
    setFormData((prev) => ({ ...prev, curriculum: updatedCurriculum }));
  };

  const addModule = () => {
    setFormData((prev) => ({
      ...prev,
      curriculum: [
        ...prev.curriculum,
        {
          moduleName: "",
          description: "",
          lessons: [{ title: "", durationInMins: 10, isFreePreview: false }],
        },
      ],
    }));
  };

  const removeModule = (modIndex) => {
    setFormData((prev) => ({
      ...prev,
      curriculum: prev.curriculum.filter((_, i) => i !== modIndex),
    }));
  };

  const handleLessonChange = (modIndex, lessIndex, field, value) => {
    const updatedCurriculum = [...formData.curriculum];
    updatedCurriculum[modIndex].lessons[lessIndex][field] = value;
    setFormData((prev) => ({ ...prev, curriculum: updatedCurriculum }));
  };

  const addLesson = (modIndex) => {
    const updatedCurriculum = [...formData.curriculum];
    updatedCurriculum[modIndex].lessons.push({
      title: "",
      durationInMins: 10,
      isFreePreview: false,
    });
    setFormData((prev) => ({ ...prev, curriculum: updatedCurriculum }));
  };

  const removeLesson = (modIndex, lessIndex) => {
    const updatedCurriculum = [...formData.curriculum];
    updatedCurriculum[modIndex].lessons = updatedCurriculum[
      modIndex
    ].lessons.filter((_, i) => i !== lessIndex);
    setFormData((prev) => ({ ...prev, curriculum: updatedCurriculum }));
  };

  // Submission logic
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.courseTitle ||
      !formData.instructorName ||
      !formData.courseDescription ||
      !formData.basePrice
    ) {
      toast.error("Please fill in all mandatory fields (*)");
      return;
    }

    setIsSubmitting(true);

    const payload = {
      courseTitle: formData.courseTitle,
      instructorName: formData.instructorName,
      courseLevel: formData.courseLevel,
      category: formData.category,
      courseDescription: formData.courseDescription,
      shortSummary: formData.shortSummary,
      thumbnailUrl: formData.thumbnailUrl,
      promoVideoUrl: formData.promoVideoUrl,
      status: formData.status,
      supervisionRequired: formData.supervisionRequired,
      isInstructorBackgroundChecked: formData.isInstructorBackgroundChecked,
      targetAgeGroup: {
        minAge: Number(formData.minAge),
        maxAge: Number(formData.maxAge),
      },
      pricing: {
        basePrice: Number(formData.basePrice),
        discountedPrice: Number(formData.discountedPrice || 0),
        currency: "INR",
      },
      learningObjectives: formData.learningObjectives.filter(
        (item) => item.trim() !== "",
      ),
      targetedAudience: formData.targetedAudience.filter(
        (item) => item.trim() !== "",
      ),
      curriculum: formData.curriculum.map((mod) => ({
        ...mod,
        lessons: mod.lessons.map((less) => ({
          ...less,
          durationInMins: Number(less.durationInMins || 0),
        })),
      })),
    };

    try {
      if (formData._id) {
        await axios.put(
          `${API_URL}/courses/updateCourse/${formData._id}`,
          payload,
        );
        toast.success("Course updated successfully!");
      } else {
        await axios.post(`${API_URL}/courses/addCourse`, payload);
        toast.success("Course created successfully!");
      }

      if (typeof onSuccess === "function") onSuccess();
    } catch (error) {
      console.error("Course Save Error:", error);
      toast.error(
        error.response?.data?.message || "Failed to process course submission.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="add-course-container fade-in">
      {/* Form Top Bar */}
      <div className="d-flex align-items-center justify-content-between mb-4 pb-3 border-bottom">
        <div className="d-flex align-items-center gap-3">
          <button
            type="button"
            className="btn btn-light rounded-circle p-2 shadow-sm"
            onClick={onCancel}
          >
            <MdOutlineArrowBack size={20} />
          </button>
          <div>
            <h4 className="fw-bold mb-0 text-dark">
              {formData._id ? "Edit Course" : "Create New Course"}
            </h4>
            <p className="text-muted small mb-0">
              Fill in details, modules, pricing, and age settings.
            </p>
          </div>
        </div>
        <div className="d-flex gap-2">
          <button
            type="button"
            className="btn btn-outline-secondary px-4 rounded-3"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-primary px-4 rounded-3 shadow-sm fw-medium"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting
              ? "Saving..."
              : formData._id
                ? "Update Course"
                : "Save & Publish"}
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="row g-4">
          {/* Section 1: Basic Information */}
          <div className="col-12">
            <div className="card border-0 shadow-sm rounded-4 p-4 bg-white">
              <h6 className="fw-bold text-uppercase text-primary small tracking-wide mb-3">
                1. General Information
              </h6>

              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label font-medium small">
                    Course Title *
                  </label>
                  <div className="input-group modern-input-group">
                    <span className="input-group-text">
                      <MdBook />
                    </span>
                    <input
                      type="text"
                      name="courseTitle"
                      className="form-control"
                      placeholder="e.g. Fun Scratch Coding for Young Innovators"
                      value={formData.courseTitle}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="col-md-6">
                  <label className="form-label font-medium small">
                    Instructor Name *
                  </label>
                  <div className="input-group modern-input-group">
                    <span className="input-group-text">
                      <MdPerson />
                    </span>
                    <input
                      type="text"
                      name="instructorName"
                      className="form-control"
                      placeholder="e.g. Sarah Jenkins"
                      value={formData.instructorName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="col-md-4">
                  <label className="form-label font-medium small">
                    Category
                  </label>
                  <div className="input-group modern-input-group">
                    <span className="input-group-text">
                      <MdCategory />
                    </span>
                    <select
                      name="category"
                      className="form-select"
                      value={formData.category}
                      onChange={handleChange}
                    >
                      <option value="Coding & Tech">Coding & Tech</option>
                      <option value="Arts & Crafts">Arts & Crafts</option>
                      <option value="Math & Logic">Math & Logic</option>
                      <option value="Languages">Languages</option>
                      <option value="Science">Science</option>
                      <option value="Music">Music</option>
                      <option value="General">General</option>
                    </select>
                  </div>
                </div>

                <div className="col-md-4">
                  <label className="form-label font-medium small">
                    Difficulty Level
                  </label>
                  <div className="input-group modern-input-group">
                    <span className="input-group-text">
                      <MdLayers />
                    </span>
                    <select
                      name="courseLevel"
                      className="form-select"
                      value={formData.courseLevel}
                      onChange={handleChange}
                    >
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                      <option value="All Levels">All Levels</option>
                    </select>
                  </div>
                </div>

                <div className="col-md-4">
                  <label className="form-label font-medium small">
                    Publication Status
                  </label>
                  <div className="input-group modern-input-group">
                    <span className="input-group-text">
                      <MdPublishedWithChanges />
                    </span>
                    <select
                      name="status"
                      className="form-select"
                      value={formData.status}
                      onChange={handleChange}
                    >
                      <option value="Draft">Draft</option>
                      <option value="Published">Published</option>
                      <option value="Archived">Archived</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Media & Pricing */}
          <div className="col-12">
            <div className="card border-0 shadow-sm rounded-4 p-4 bg-white">
              <h6 className="fw-bold text-uppercase text-primary small tracking-wide mb-3">
                2. Pricing & Target Group
              </h6>

              <div className="row g-3">
                <div className="col-md-3">
                  <label className="form-label font-medium small">
                    Min Target Age
                  </label>
                  <input
                    type="number"
                    name="minAge"
                    className="form-control modern-field"
                    value={formData.minAge}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-3">
                  <label className="form-label font-medium small">
                    Max Target Age
                  </label>
                  <input
                    type="number"
                    name="maxAge"
                    className="form-control modern-field"
                    value={formData.maxAge}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-3">
                  <label className="form-label font-medium small">
                    Base Price (INR) *
                  </label>
                  <div className="input-group modern-input-group">
                    <span className="input-group-text">
                      <MdCurrencyRupee />
                    </span>
                    <input
                      type="number"
                      name="basePrice"
                      className="form-control"
                      placeholder="1499"
                      value={formData.basePrice}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="col-md-3">
                  <label className="form-label font-medium small">
                    Discounted Price (INR)
                  </label>
                  <div className="input-group modern-input-group">
                    <span className="input-group-text">
                      <MdCurrencyRupee />
                    </span>
                    <input
                      type="number"
                      name="discountedPrice"
                      className="form-control"
                      placeholder="999"
                      value={formData.discountedPrice}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="col-md-6">
                  <label className="form-label font-medium small">
                    Thumbnail Image URL
                  </label>
                  <div className="input-group modern-input-group">
                    <span className="input-group-text">
                      <MdImage />
                    </span>
                    <input
                      type="url"
                      name="thumbnailUrl"
                      className="form-control"
                      placeholder="https://..."
                      value={formData.thumbnailUrl}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="col-md-6">
                  <label className="form-label font-medium small">
                    Promo Video URL
                  </label>
                  <div className="input-group modern-input-group">
                    <span className="input-group-text">
                      <MdOndemandVideo />
                    </span>
                    <input
                      type="url"
                      name="promoVideoUrl"
                      className="form-control"
                      placeholder="https://..."
                      value={formData.promoVideoUrl}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                {/* Safety Toggles */}
                <div className="col-12 mt-3">
                  <div className="p-3 rounded-3 bg-light d-flex flex-wrap gap-4 align-items-center">
                    <div className="form-check form-switch mb-0">
                      <input
                        type="checkbox"
                        id="supervisionRequired"
                        name="supervisionRequired"
                        className="form-check-input"
                        checked={formData.supervisionRequired}
                        onChange={handleChange}
                      />
                      <label
                        htmlFor="supervisionRequired"
                        className="form-check-label text-dark small fw-semibold"
                      >
                        Parental Supervision Required
                      </label>
                    </div>

                    <div className="form-check form-switch mb-0">
                      <input
                        type="checkbox"
                        id="isInstructorBackgroundChecked"
                        name="isInstructorBackgroundChecked"
                        className="form-check-input"
                        checked={formData.isInstructorBackgroundChecked}
                        onChange={handleChange}
                      />
                      <label
                        htmlFor="isInstructorBackgroundChecked"
                        className="form-check-label text-dark small fw-semibold"
                      >
                        Verified / Background Checked Instructor
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Descriptions & Objectives */}
          <div className="col-12">
            <div className="card border-0 shadow-sm rounded-4 p-4 bg-white">
              <h6 className="fw-bold text-uppercase text-primary small tracking-wide mb-3">
                3. Summary & Objectives
              </h6>

              <div className="row g-3">
                <div className="col-12">
                  <label className="form-label font-medium small">
                    Short Summary
                  </label>
                  <input
                    type="text"
                    name="shortSummary"
                    maxLength={160}
                    className="form-control modern-field"
                    placeholder="Brief tagline for course card preview..."
                    value={formData.shortSummary}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-12">
                  <label className="form-label font-medium small">
                    Course Description *
                  </label>
                  <textarea
                    name="courseDescription"
                    className="form-control modern-field"
                    rows={3}
                    placeholder="Comprehensive description of what kids will learn..."
                    value={formData.courseDescription}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Dynamic Learning Objectives */}
                <div className="col-md-6 mt-3">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <label className="form-label font-medium small mb-0">
                      Learning Objectives
                    </label>
                    <button
                      type="button"
                      className="btn btn-sm btn-link text-decoration-none p-0 fw-semibold"
                      onClick={() => addArrayItem("learningObjectives")}
                    >
                      + Add Item
                    </button>
                  </div>
                  {formData.learningObjectives.map((obj, i) => (
                    <div key={i} className="d-flex gap-2 mb-2">
                      <input
                        type="text"
                        className="form-control modern-field"
                        value={obj}
                        onChange={(e) =>
                          handleArrayChange(
                            i,
                            e.target.value,
                            "learningObjectives",
                          )
                        }
                        placeholder={`Objective ${i + 1}`}
                      />
                      {formData.learningObjectives.length > 1 && (
                        <button
                          type="button"
                          className="btn btn-outline-danger btn-sm"
                          onClick={() =>
                            removeArrayItem(i, "learningObjectives")
                          }
                        >
                          <MdDelete />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                {/* Dynamic Target Audience */}
                <div className="col-md-6 mt-3">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <label className="form-label font-medium small mb-0">
                      Target Audience
                    </label>
                    <button
                      type="button"
                      className="btn btn-sm btn-link text-decoration-none p-0 fw-semibold"
                      onClick={() => addArrayItem("targetedAudience")}
                    >
                      + Add Item
                    </button>
                  </div>
                  {formData.targetedAudience.map((aud, i) => (
                    <div key={i} className="d-flex gap-2 mb-2">
                      <input
                        type="text"
                        className="form-control modern-field"
                        value={aud}
                        onChange={(e) =>
                          handleArrayChange(
                            i,
                            e.target.value,
                            "targetedAudience",
                          )
                        }
                        placeholder={`Audience ${i + 1}`}
                      />
                      {formData.targetedAudience.length > 1 && (
                        <button
                          type="button"
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => removeArrayItem(i, "targetedAudience")}
                        >
                          <MdDelete />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Section 4: Curriculum Modules & Lessons */}
          <div className="col-12">
            <div className="card border-0 shadow-sm rounded-4 p-4 bg-white">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h6 className="fw-bold text-uppercase text-primary small tracking-wide mb-0">
                  4. Course Curriculum Structure
                </h6>
                <button
                  type="button"
                  className="btn btn-sm btn-primary rounded-3"
                  onClick={addModule}
                >
                  <MdAdd size={16} /> Add Module
                </button>
              </div>

              {formData.curriculum.map((mod, modIdx) => (
                <div
                  key={modIdx}
                  className="module-card p-3 rounded-3 mb-3 border bg-light-subtle"
                >
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span className="fw-bold text-dark d-flex align-items-center gap-1">
                      <MdFolder className="text-warning" /> Module {modIdx + 1}
                    </span>
                    {formData.curriculum.length > 1 && (
                      <button
                        type="button"
                        className="btn btn-sm text-danger p-0"
                        onClick={() => removeModule(modIdx)}
                      >
                        <MdDelete size={18} />
                      </button>
                    )}
                  </div>

                  <input
                    type="text"
                    className="form-control modern-field mb-2"
                    placeholder="Module Title (e.g. Introduction to Scratch)"
                    value={mod.moduleName}
                    onChange={(e) =>
                      handleModuleChange(modIdx, "moduleName", e.target.value)
                    }
                  />
                  <input
                    type="text"
                    className="form-control modern-field mb-3"
                    placeholder="Module Description"
                    value={mod.description}
                    onChange={(e) =>
                      handleModuleChange(modIdx, "description", e.target.value)
                    }
                  />

                  {/* Lessons */}
                  <div className="ps-3 border-start border-2 border-primary border-opacity-25 ms-2">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span className="small fw-semibold text-muted d-flex align-items-center gap-1">
                        <MdPlayLesson /> Lessons ({mod.lessons.length})
                      </span>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-primary py-0 px-2"
                        onClick={() => addLesson(modIdx)}
                      >
                        + Add Lesson
                      </button>
                    </div>

                    {mod.lessons.map((less, lessIdx) => (
                      <div
                        key={lessIdx}
                        className="row g-2 align-items-center mb-2 bg-white p-2 rounded-2 border"
                      >
                        <div className="col-md-5">
                          <input
                            type="text"
                            className="form-control form-control-sm border-0 bg-transparent"
                            placeholder="Lesson Title"
                            value={less.title}
                            onChange={(e) =>
                              handleLessonChange(
                                modIdx,
                                lessIdx,
                                "title",
                                e.target.value,
                              )
                            }
                          />
                        </div>
                        <div className="col-md-3">
                          <input
                            type="number"
                            className="form-control form-control-sm border-0 bg-transparent"
                            placeholder="Mins"
                            value={less.durationInMins}
                            onChange={(e) =>
                              handleLessonChange(
                                modIdx,
                                lessIdx,
                                "durationInMins",
                                e.target.value,
                              )
                            }
                          />
                        </div>
                        <div className="col-md-3">
                          <div className="form-check form-switch mb-0">
                            <input
                              type="checkbox"
                              className="form-check-input"
                              id={`free-${modIdx}-${lessIdx}`}
                              checked={less.isFreePreview}
                              onChange={(e) =>
                                handleLessonChange(
                                  modIdx,
                                  lessIdx,
                                  "isFreePreview",
                                  e.target.checked,
                                )
                              }
                            />
                            <label
                              className="form-check-label x-small text-muted"
                              htmlFor={`free-${modIdx}-${lessIdx}`}
                            >
                              Free Preview
                            </label>
                          </div>
                        </div>
                        <div className="col-md-1 text-end">
                          {mod.lessons.length > 1 && (
                            <button
                              type="button"
                              className="btn btn-sm text-danger p-0"
                              onClick={() => removeLesson(modIdx, lessIdx)}
                            >
                              <MdDelete size={16} />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Action Footer */}
          <div className="col-12 d-flex justify-content-end gap-3 mt-2">
            <button
              type="button"
              className="btn btn-light px-4 py-2.5 rounded-3 fw-medium"
              onClick={onCancel}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary px-5 py-2.5 rounded-3 fw-medium shadow"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? "Processing..."
                : formData._id
                  ? "Update Course"
                  : "Save Course"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
