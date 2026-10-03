import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthProvider";
import {
  FaBookOpen,
  FaGraduationCap,
  FaArrowRight,
  FaClock,
  FaUserTie,
  FaWallet,
} from "react-icons/fa";

export default function Courses() {
  // 1. Pull loadingCourses alongside the courses array from your Auth context
  const { courses, loadingCourses } = useAuth();

  // Modern component style configuration mirroring elite ed-tech presentation standards
  const styles = {
    cardWrapper: {
      backgroundColor: "#ffffff",
      borderRadius: "24px",
      transition: "all 0.35s cubic-bezier(0.16, 1, 0.3, 1)",
    },
    imageFrame: {
      height: "220px",
      overflow: "hidden",
      borderRadius: "24px 24px 0 0",
      backgroundColor: "#f8fafc",
    },
    actionButton: {
      fontSize: "0.85rem",
      borderRadius: "100px",
      transition: "all 0.25s ease",
      fontWeight: "700",
    },
  };

  // 2. Display an intentional loading state instead of falling back to the "No Courses Configured" screen prematurely
  if (loadingCourses) {
    return (
      <div
        className="d-flex flex-column justify-content-center align-items-center bg-light bg-opacity-25"
        style={{ minHeight: "85vh" }}
      >
        <div
          className="spinner-border text-primary mb-3"
          role="status"
          style={{ width: "3rem", height: "3rem" }}
        >
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="text-secondary small fw-medium">
          Hydrating Academic Syllabus Matrix...
        </p>
      </div>
    );
  }

  return (
    <section
      className="py-5 bg-light bg-opacity-25"
      style={{ minHeight: "85vh", fontFamily: "'Inter', sans-serif" }}
    >
      <div className="container py-4">
        {/* Modern Dynamic Section Identity Title */}
        <div className="text-center mb-5 mx-auto" style={{ maxWidth: "650px" }}>
          <span
            className="badge bg-primary bg-opacity-10 text-primary px-3 py-2 rounded-pill mb-2 fw-semibold"
            style={{ fontSize: "0.8rem" }}
          >
            <FaGraduationCap className="me-2" /> Academic Curriculums
          </span>
          <h1
            className="fw-black text-dark tracking-tight mb-2"
            style={{
              fontWeight: "800",
              fontSize: "2.5rem",
              letterSpacing: "-0.5px",
            }}
          >
            Explore Our Specialized Courses
          </h1>
          <p className="text-muted small mb-0">
            Empower your child with industry-standard, creative modules curated
            specifically by global certified mental mathematics and spoken
            language expert trainers.
          </p>
          <div
            className="bg-primary rounded-pill mx-auto mt-3"
            style={{ width: "45px", height: "4px" }}
          ></div>
        </div>

        {/* Main Dynamic Academic Listing System */}
        <div className="row g-4 justify-content-center">
          {courses && courses.length > 0 ? (
            courses.map((course, index) => (
              <div
                className="col-10 col-sm-6 col-md-4 d-flex"
                key={course._id || index}
              >
                <div
                  className="card border-0 shadow-sm position-relative border border-light w-100"
                  style={styles.cardWrapper}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-6px)";
                    e.currentTarget.style.boxShadow =
                      "0 20px 40px rgba(13, 110, 253, 0.08)";
                    const btn = e.currentTarget.querySelector(".cta-btn");
                    if (btn) {
                      btn.style.backgroundColor = "#0d6efd";
                      btn.style.color = "#ffffff";
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "none";
                    e.currentTarget.style.boxShadow = "none";
                    const btn = e.currentTarget.querySelector(".cta-btn");
                    if (btn) {
                      btn.style.backgroundColor = "transparent";
                      btn.style.color = "#0d6efd";
                    }
                  }}
                >
                  {/* Visual Representation Frame Box Image container */}
                  <div
                    className="position-relative w-100"
                    style={styles.imageFrame}
                  >
                    <img
                      src={course.thumbnailUrl || course.image || "./03.webp"}
                      className="w-100 h-100"
                      style={{ objectFit: "cover" }}
                      alt={
                        course.courseTitle ||
                        "Academic course image illustration layout"
                      }
                    />
                    {/* Level Badge Overlay */}
                    <div className="position-absolute top-0 start-0 m-3">
                      <span
                        className="badge bg-dark bg-opacity-75 text-white px-2.5 py-1.5 rounded-3 text-uppercase fw-bold"
                        style={{
                          fontSize: "0.65rem",
                          letterSpacing: "0.5px",
                          backdropFilter: "blur(8px)",
                        }}
                      >
                        {course.courseLevel || "All Levels"}
                      </span>
                    </div>
                  </div>

                  {/* Core Content Information Block */}
                  <div className="card-body d-flex flex-column justify-content-between p-4">
                    <div>
                      {/* Sub-Metric Badges */}
                      <div className="d-flex align-items-center gap-2 mb-2">
                        <span
                          className="text-primary small d-flex align-items-center gap-1 bg-light px-2 py-1 rounded-2"
                          style={{ fontSize: "0.75rem", fontWeight: "600" }}
                        >
                          <FaUserTie size={11} />{" "}
                          {course.instructorName || "Staff"}
                        </span>
                        {course.metrics?.totalHours ? (
                          <span
                            className="text-secondary small d-flex align-items-center gap-1 bg-light px-2 py-1 rounded-2"
                            style={{ fontSize: "0.75rem", fontWeight: "600" }}
                          >
                            <FaClock size={11} /> {course.metrics.totalHours}{" "}
                            hrs
                          </span>
                        ) : null}
                      </div>

                      {/* Course Title matching backend schemas */}
                      <h5
                        className="fw-bold text-dark mb-2 text-truncate"
                        title={course.courseTitle}
                        style={{ fontSize: "1.25rem", letterSpacing: "-0.3px" }}
                      >
                        {course.courseTitle}
                      </h5>

                      {/* Description Strategy fallback */}
                      <p
                        className="text-secondary small lh-base mb-3"
                        style={{
                          display: "-webkit-box",
                          WebkitLineClamp: "3",
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                          minHeight: "60px",
                        }}
                      >
                        {course.shortSummary ||
                          course.courseDescription ||
                          "No detailed analytical description has been cataloged for this premium subject course segment module yet."}
                      </p>

                      {/* Dynamic Pricing Layout */}
                      <div className="mb-3 d-flex align-items-center gap-2">
                        <FaWallet className="text-muted" size={13} />
                        <span
                          className="fw-extrabold text-primary fw-bold"
                          style={{ fontSize: "1.1rem" }}
                        >
                          ₹
                          {course.pricing?.discountedPrice ||
                            course.pricing?.basePrice ||
                            course.price}
                        </span>
                        {course.pricing?.discountedPrice > 0 &&
                          course.pricing?.basePrice !==
                            course.pricing?.discountedPrice && (
                            <span className="text-muted text-decoration-line-through small">
                              ₹{course.pricing?.basePrice}
                            </span>
                          )}
                      </div>
                    </div>

                    {/* Navigation Route target via Dynamic DB _id mapping token path */}
                    <Link
                      to={`/courses/${course._id}`}
                      className="btn btn-outline-primary cta-btn d-flex align-items-center justify-content-center gap-2 py-2.5 text-decoration-none w-100 mt-auto"
                      style={styles.actionButton}
                    >
                      <span>Learn Syllabus Architecture</span>
                      <FaArrowRight size={12} />
                    </Link>
                  </div>
                </div>
              </div>
            ))
          ) : (
            /* Graceful Empty Placeholder Layout block - Only visible when loading state completes and database is completely empty */
            <div className="col-12 text-center py-5">
              <div
                className="bg-white rounded-4 shadow-sm border border-light p-5 mx-auto"
                style={{ maxWidth: "450px" }}
              >
                <div
                  className="bg-light rounded-circle p-3 text-muted d-inline-flex align-items-center justify-content-center mb-3"
                  style={{ width: "60px", height: "60px" }}
                >
                  <FaBookOpen size={26} />
                </div>
                <h5 className="fw-bold text-dark mb-1">
                  No Academic Courses Configured
                </h5>
                <p className="text-secondary small mb-0">
                  Our digital administrative systems are updating current
                  semester listings. Please check back shortly.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
