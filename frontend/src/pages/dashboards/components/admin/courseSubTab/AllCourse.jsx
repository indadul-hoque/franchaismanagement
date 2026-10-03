import React, { useState, useEffect } from "react";
import {
  MdDelete,
  MdSearch,
  MdEdit,
  MdClear,
  MdBook,
  MdPerson,
  MdAdd,
  MdFormatListBulleted,
  MdVerifiedUser,
  MdSchool,
  MdCheckCircle,
  MdDrafts,
  MdCategory,
  MdOutlineClass,
} from "react-icons/md";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "../../../../../context/AuthProvider";
import { currentConfig } from "../../../../../utils";
import AddCourseForm from "./AddCourseForm";

const API_URL = currentConfig.API_URL;

export default function AllCourse() {
  const { isAuthenticated, fetchCourses, courses = [] } = useAuth();

  const [activeTab, setActiveTab] = useState("list");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [isDeletingId, setIsDeletingId] = useState(null);
  const [updatingStatusId, setUpdatingStatusId] = useState(null);
  const [selectedCourseForEdit, setSelectedCourseForEdit] = useState(null);

  useEffect(() => {
    if (isAuthenticated && typeof fetchCourses === "function") {
      fetchCourses();
    }
  }, [isAuthenticated]);

  const handleOpenAdd = () => {
    setSelectedCourseForEdit(null);
    setActiveTab("add");
  };

  const handleEditCourse = (course) => {
    setSelectedCourseForEdit(course);
    setActiveTab("add");
  };

  const handleFormSuccess = () => {
    if (typeof fetchCourses === "function") fetchCourses();
    setActiveTab("list");
  };

  const handleStatusUpdate = async (courseId, newStatus) => {
    setUpdatingStatusId(courseId);
    try {
      await axios.put(`${API_URL}/courses/updateCourseStatus/${courseId}`, {
        status: newStatus,
      });
      toast.success(`Status updated to ${newStatus}`);
      if (typeof fetchCourses === "function") fetchCourses();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update status.");
    } finally {
      setUpdatingStatusId(null);
    }
  };

  const handleDeleteCourse = async (courseId) => {
    if (!window.confirm("Are you sure you want to delete this course?")) return;
    setIsDeletingId(courseId);
    try {
      await axios.delete(`${API_URL}/courses/deleteCourse/${courseId}`);
      toast.success("Course deleted successfully!");
      if (typeof fetchCourses === "function") fetchCourses();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete course.");
    } finally {
      setIsDeletingId(null);
    }
  };

  // Metrics calculation
  const totalPublished = courses.filter((c) => c.status === "Published").length;
  const totalDrafts = courses.filter((c) => c.status === "Draft").length;
  const categoriesCount = new Set(courses.map((c) => c.category || "General"))
    .size;

  // Search & Filter
  const filteredCourses = courses.filter((course) => {
    const title = course.courseTitle?.toLowerCase() || "";
    const instructor = course.instructorName?.toLowerCase() || "";
    const category = course.category?.toLowerCase() || "";
    const query = searchQuery.toLowerCase();

    const matchesQuery =
      title.includes(query) ||
      instructor.includes(query) ||
      category.includes(query);

    const matchesStatus =
      statusFilter === "ALL" || course.status === statusFilter;

    return matchesQuery && matchesStatus;
  });

  if (!isAuthenticated) {
    return (
      <div className="container py-5 text-center">
        <div className="alert alert-warning border-0 rounded-4 shadow-sm d-inline-block px-4 py-3">
          <strong>Authentication Required:</strong> Please log in to access the
          Course Registry.
        </div>
      </div>
    );
  }

  return (
    <div
      className="container-fluid py-4 px-md-5"
      style={{ maxWidth: "1380px" }}
    >
      {/* Page Header */}
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
        {/* Left Title Section */}
        <div className="d-flex align-items-center gap-3">
          <div className="p-2.5 bg-primary bg-opacity-10 text-primary rounded-3 d-flex align-items-center justify-content-center">
            <MdSchool size={28} />
          </div>
          <div>
            <h3 className="fw-bold text-dark mb-0 fs-4">Course Registry</h3>
            <p className="text-muted small mb-0">
              Manage course curriculum, monitor status, and configure pricing
              structures.
            </p>
          </div>
        </div>

        {/* Tab Switcher - Using Bootstrap Segmented Grouping */}
        <div className="bg-light p-1 rounded-3 border d-inline-flex align-items-center gap-1 shadow-sm">
          <button
            type="button"
            className={`btn btn-sm px-3 py-1.5 fw-medium d-inline-flex align-items-center gap-2 rounded-2 transition-all ${
              activeTab === "list"
                ? "btn-white bg-white text-primary shadow-sm"
                : "btn-light text-secondary border-0"
            }`}
            onClick={() => setActiveTab("list")}
          >
            <MdFormatListBulleted size={17} />
            <span className="text-nowrap">Catalog Directory</span>
          </button>

          <button
            type="button"
            className={`btn btn-sm px-3 py-1.5 fw-medium d-inline-flex align-items-center gap-2 rounded-2 transition-all ${
              activeTab === "add"
                ? selectedCourseForEdit
                  ? "btn-warning bg-warning text-dark shadow-sm"
                  : "btn-white bg-white text-primary shadow-sm"
                : "btn-light text-secondary border-0"
            }`}
            onClick={handleOpenAdd}
          >
            {selectedCourseForEdit ? <MdEdit size={16} /> : <MdAdd size={18} />}
            <span className="text-nowrap">
              {selectedCourseForEdit ? "Edit Course" : "Add Course"}
            </span>
          </button>
        </div>
      </div>

      {activeTab === "list" ? (
        <>
          {/* Quick Metrics Cards */}
          <div className="row g-3 mb-4">
            <div className="col-6 col-md-3">
              <div className="card border-0 shadow-sm rounded-4 p-3 bg-white">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <span className="text-muted small fw-medium d-block mb-1">
                      Total Courses
                    </span>
                    <h4 className="fw-bold mb-0 text-dark">{courses.length}</h4>
                  </div>
                  <div className="p-2 bg-light text-primary rounded-3">
                    <MdOutlineClass size={22} />
                  </div>
                </div>
              </div>
            </div>

            <div className="col-6 col-md-3">
              <div className="card border-0 shadow-sm rounded-4 p-3 bg-white">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <span className="text-muted small fw-medium d-block mb-1">
                      Published
                    </span>
                    <h4 className="fw-bold mb-0 text-success">
                      {totalPublished}
                    </h4>
                  </div>
                  <div className="p-2 bg-success bg-opacity-10 text-success rounded-3">
                    <MdCheckCircle size={22} />
                  </div>
                </div>
              </div>
            </div>

            <div className="col-6 col-md-3">
              <div className="card border-0 shadow-sm rounded-4 p-3 bg-white">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <span className="text-muted small fw-medium d-block mb-1">
                      Drafts
                    </span>
                    <h4 className="fw-bold mb-0 text-warning">{totalDrafts}</h4>
                  </div>
                  <div className="p-2 bg-warning bg-opacity-10 text-warning rounded-3">
                    <MdDrafts size={22} />
                  </div>
                </div>
              </div>
            </div>

            <div className="col-6 col-md-3">
              <div className="card border-0 shadow-sm rounded-4 p-3 bg-white">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <span className="text-muted small fw-medium d-block mb-1">
                      Categories
                    </span>
                    <h4 className="fw-bold mb-0 text-info">
                      {categoriesCount}
                    </h4>
                  </div>
                  <div className="p-2 bg-info bg-opacity-10 text-info rounded-3">
                    <MdCategory size={22} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Search & Filter Bar */}
          <div className="card border-0 shadow-sm rounded-4 p-3 mb-4 bg-white">
            <div className="row g-2 align-items-center">
              <div className="col-md-8">
                <div className="search-input-wrapper">
                  <MdSearch size={20} className="search-icon-left text-muted" />
                  <input
                    type="text"
                    className="form-control border-0 bg-light rounded-3 ps-5 py-2"
                    placeholder="Search courses by title, instructor, or category..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  {searchQuery && (
                    <button
                      className="btn border-0 text-muted p-0 clear-search-btn"
                      onClick={() => setSearchQuery("")}
                    >
                      <MdClear size={18} />
                    </button>
                  )}
                </div>
              </div>

              {/* Status Filter Buttons */}
              <div className="col-md-4 d-flex justify-content-md-end gap-1">
                {["ALL", "Published", "Draft", "Archived"].map((st) => (
                  <button
                    key={st}
                    onClick={() => setStatusFilter(st)}
                    className={`btn btn-sm rounded-3 px-3 py-1.5 fw-medium ${
                      statusFilter === st
                        ? "btn-dark shadow-sm"
                        : "btn-light text-secondary"
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Course Table / Cards */}
          <div className="card border-0 shadow-sm rounded-4 bg-white overflow-hidden">
            {filteredCourses.length === 0 ? (
              <div className="text-center py-5 px-3">
                <div className="p-3 bg-light text-secondary rounded-circle d-inline-block mb-3">
                  <MdBook size={32} />
                </div>
                <h5 className="fw-bold text-dark">
                  No courses match your filter
                </h5>
                <p className="text-muted small mb-3">
                  Try adjusting your search keywords or clear your active status
                  filter.
                </p>
                <button
                  className="btn btn-primary rounded-3 px-4 py-2 fw-medium shadow-sm"
                  onClick={handleOpenAdd}
                >
                  <MdAdd size={18} className="me-1" /> Add New Course
                </button>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table align-middle custom-modern-table mb-0">
                  <thead>
                    <tr>
                      <th className="ps-4">Course Details</th>
                      <th>Category & Level</th>
                      <th>Target Age</th>
                      <th>Pricing</th>
                      <th>Status</th>
                      <th className="text-end pe-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCourses.map((course) => {
                      const isDiscounted =
                        course.pricing?.discountedPrice &&
                        course.pricing?.discountedPrice <
                          course.pricing?.basePrice;

                      return (
                        <tr key={course._id} className="table-row-hover">
                          <td className="ps-4 py-3">
                            <div className="d-flex align-items-center gap-3">
                              {course.thumbnailUrl ? (
                                <img
                                  src={course.thumbnailUrl}
                                  alt={course.courseTitle}
                                  className="rounded-3 object-fit-cover border"
                                  style={{ width: "48px", height: "48px" }}
                                />
                              ) : (
                                <div
                                  className="rounded-3 bg-primary bg-opacity-10 text-primary d-flex align-items-center justify-content-center"
                                  style={{
                                    width: "48px",
                                    height: "48px",
                                    flexShrink: 0,
                                  }}
                                >
                                  <MdBook size={22} />
                                </div>
                              )}
                              <div>
                                <span className="fw-bold text-dark d-block mb-0 font-heading">
                                  {course.courseTitle}
                                </span>
                                <span className="text-muted small d-inline-flex align-items-center gap-1 mt-0.5">
                                  <MdPerson size={14} /> {course.instructorName}
                                  {course.isInstructorBackgroundChecked && (
                                    <MdVerifiedUser
                                      size={14}
                                      className="text-success"
                                      title="Verified Instructor"
                                    />
                                  )}
                                </span>
                              </div>
                            </div>
                          </td>

                          <td>
                            <div className="d-flex flex-column gap-1 align-items-start">
                              <span className="badge bg-light text-dark border px-2.5 py-1 rounded-2 font-mono">
                                {course.category || "General"}
                              </span>
                              <span className="badge bg-secondary bg-opacity-10 text-secondary px-2 py-0.5 rounded-2 small">
                                {course.courseLevel || "All Levels"}
                              </span>
                            </div>
                          </td>

                          <td>
                            <span className="fw-medium text-dark">
                              {course.targetAgeGroup?.minAge ?? 5} -{" "}
                              {course.targetAgeGroup?.maxAge ?? 15}
                            </span>
                            <span className="text-muted small ms-1">Yrs</span>
                          </td>

                          <td>
                            <div className="d-flex flex-column">
                              <span className="fw-bold text-dark">
                                ₹
                                {Number(
                                  isDiscounted
                                    ? course.pricing.discountedPrice
                                    : course.pricing?.basePrice || 0,
                                ).toLocaleString("en-IN")}
                              </span>
                              {isDiscounted && (
                                <span className="text-muted text-decoration-line-through x-small">
                                  ₹
                                  {Number(
                                    course.pricing.basePrice,
                                  ).toLocaleString("en-IN")}
                                </span>
                              )}
                            </div>
                          </td>

                          <td>
                            <select
                              className={`status-pill-select ${course.status?.toLowerCase() || "draft"}`}
                              value={course.status || "Draft"}
                              disabled={updatingStatusId === course._id}
                              onChange={(e) =>
                                handleStatusUpdate(course._id, e.target.value)
                              }
                            >
                              <option value="Draft">Draft</option>
                              <option value="Published">Published</option>
                              <option value="Archived">Archived</option>
                            </select>
                          </td>

                          <td className="text-end pe-4">
                            <div className="d-inline-flex gap-1">
                              <button
                                className="btn btn-sm btn-icon-action btn-outline-light-custom text-dark"
                                onClick={() => handleEditCourse(course)}
                                title="Edit Course"
                              >
                                <MdEdit size={16} />
                              </button>
                              <button
                                className="btn btn-sm btn-icon-action btn-outline-danger-custom"
                                onClick={() => handleDeleteCourse(course._id)}
                                disabled={isDeletingId === course._id}
                                title="Delete Course"
                              >
                                <MdDelete size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      ) : (
        <AddCourseForm
          editData={selectedCourseForEdit}
          onSuccess={handleFormSuccess}
          onCancel={() => setActiveTab("list")}
        />
      )}
    </div>
  );
}
