import React, { useEffect, useState } from "react";
import { currentConfig } from "../../utils";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthProvider";
import { useNavigate, useParams } from "react-router-dom"; // Hook reads router tokens
import axios from "axios";
import {
  FaCheckCircle,
  FaGraduationCap,
  FaBookmark,
  FaRegClock,
  FaWallet,
  FaArrowRight,
  FaShieldAlt,
  FaLock,
  FaArrowLeft,
  FaUserTie,
  FaBookOpen,
  FaPlayCircle,
} from "react-icons/fa";

const API_URL = currentConfig.API_URL;

const CourseDetails = () => {
  const { courseId } = useParams();
  const { isAuthenticated, courses, loadingCourses } = useAuth();
  const navigate = useNavigate();

  const [isEnrolled, setIsEnrolled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [matchedCourse, setMatchedCourse] = useState(null);
  const [activeModule, setActiveModule] = useState(0);

  useEffect(() => {
    // 2. Wait until the Auth context finishes downloading your database entries
    if (loadingCourses || !courses || courses.length === 0) {
      return;
    }

    // 3. FIX: Match the exact _id from the URL string parameter against your schema records
    const course = courses.find((c) => c._id === courseId);
    setMatchedCourse(course);

    // If data is fetched completely but this specific ID doesn't exist, stop loading spinner fallbacks
    if (!course) {
      setLoading(false);
      return;
    }

    // Stop early if no student is actively authenticated to bypass profile checks
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }

    const fetchEnrollmentStatus = async () => {
      try {
        const student = JSON.parse(localStorage.getItem("student"));
        if (!student || !student._id) {
          setLoading(false);
          return;
        }

        const response = await axios.get(
          `${API_URL}/enrollcourse/enrolled/${student._id}`,
          {
            headers: { Authorization: `Bearer ${localStorage.getItem("jwt")}` },
          },
        );
        const enrolledCourses = response.data || [];
        const alreadyEnrolled = enrolledCourses.some(
          (ec) => ec.courseId?._id === course._id,
        );
        setIsEnrolled(alreadyEnrolled);
      } catch (error) {
        console.error(
          "Error looking up enrollment metadata validation rows:",
          error,
        );
      } finally {
        setLoading(false);
      }
    };

    fetchEnrollmentStatus();
  }, [isAuthenticated, courses, loadingCourses, courseId]); // React runtime hook observation matrix dependencies

  const handleEnroll = async () => {
    if (!isAuthenticated) {
      toast.error("Please log in to enroll in this course.");
      navigate("/login");
      return;
    }

    try {
      const student = JSON.parse(localStorage.getItem("student"));
      if (!student || !student._id) {
        toast.error("Student data is missing. Please log in again.");
        return;
      }

      if (!matchedCourse || !matchedCourse._id) {
        toast.error("Course details context could not be parsed.");
        return;
      }

      const requestBody = {
        studentId: student._id,
        courseId: matchedCourse._id,
        courseTitle: matchedCourse.courseTitle,
      };

      const response = await axios.post(
        `${API_URL}/enrollcourse/enroll`,
        requestBody,
        { headers: { Authorization: `Bearer ${localStorage.getItem("jwt")}` } },
      );

      if (
        response.status === 201 ||
        response.data.message === "Enrollment successful"
      ) {
        toast.success(
          "Enrollment request submitted! Visit our center to complete setup.",
        );
        setIsEnrolled(true);
      }
    } catch (error) {
      console.error("Enrollment Error:", error.response?.data || error);
      toast.error(error.response?.data?.message || "Enrollment failed.");
    }
  };

  // Modern UI conditional render sequence handling context synchronization windows
  if (loadingCourses || (loading && !matchedCourse)) {
    return (
      <div
        className="d-flex justify-content-center align-items-center bg-white"
        style={{ minHeight: "100vh" }}
      >
        <div
          className="spinner-border text-primary"
          role="status"
          style={{ width: "3rem", height: "3rem" }}
        >
          <span className="visually-hidden">
            Syncing Syllabus Architecture...
          </span>
        </div>
      </div>
    );
  }

  if (!matchedCourse) {
    return (
      <div className="container py-5 text-center" style={{ minHeight: "80vh" }}>
        <h3 className="text-dark fw-bold mb-2">Course Track Unresolved</h3>
        <p className="text-muted small mb-4">
          The profile key requested does not map to any live academic system
          configurations.
        </p>
        <button
          className="btn btn-primary px-4 rounded-pill fw-bold btn-sm shadow-sm"
          onClick={() => navigate("/courses")}
        >
          Return to Matrix List Layout
        </button>
      </div>
    );
  }

  return (
    <div
      className="bg-light bg-opacity-50 py-5"
      style={{ minHeight: "100vh", fontFamily: "'Inter', sans-serif" }}
    >
      <div className="container">
        {/* Navigation Action */}
        <div className="mb-4">
          <button
            onClick={() => navigate(-1)}
            className="btn btn-link text-secondary text-decoration-none d-inline-flex align-items-center gap-2 p-0 fw-semibold"
          >
            <FaArrowLeft size={12} /> Back to Dashboard
          </button>
        </div>

        {/* Hero Course Header */}
        <div
          className="bg-dark text-white rounded-4 p-4 p-md-5 shadow-lg mb-5 position-relative overflow-hidden"
          style={{
            background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
          }}
        >
          <div className="row align-items-center">
            <div className="col-lg-8">
              <span
                className="badge bg-primary px-3 py-2 rounded-pill fw-bold text-uppercase mb-3"
                style={{ fontSize: "0.75rem", letterSpacing: "1px" }}
              >
                <FaGraduationCap className="me-2" /> {matchedCourse.courseLevel}
              </span>
              <h1 className="display-5 fw-extrabold tracking-tight mb-3 text-white">
                {matchedCourse.courseTitle}
              </h1>
              <p className="text-info fs-6 mb-4" style={{ maxWidth: "800px" }}>
                {matchedCourse.shortSummary}
              </p>

              <div className="d-flex flex-wrap gap-4 align-items-center text-light-subtle">
                <div className="d-flex align-items-center gap-2">
                  <FaUserTie className="text-primary" />
                  <span className="small fw-medium">
                    Instructor: <strong>{matchedCourse.instructorName}</strong>
                  </span>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <FaBookOpen className="text-success" />
                  <span className="small fw-medium">
                    {matchedCourse.metrics?.totalLessonsCount || 0} Modules &
                    Lessons
                  </span>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <FaRegClock className="text-warning" />
                  <span className="small fw-medium">
                    {matchedCourse.metrics?.totalHours || 0} Total Hours
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Split Details Section */}
        <div className="row g-5 align-items-start">
          {/* Main Content Area */}
          <div className="col-lg-8">
            {/* About Course */}
            <div className="bg-white border-0 rounded-4 p-4 shadow-sm mb-4">
              <h4 className="fw-bold text-dark mb-3 d-flex align-items-center gap-2">
                <FaBookmark className="text-primary" size={18} /> About This
                Curriculum Track
              </h4>
              <p
                className="text-secondary lh-lg mb-0"
                style={{ fontSize: "0.975rem" }}
              >
                {matchedCourse.courseDescription}
              </p>
            </div>

            {/* Learning Objectives Matrix */}
            {matchedCourse.learningObjectives?.length > 0 && (
              <div className="bg-white border-0 rounded-4 p-4 shadow-sm mb-4">
                <h4 className="fw-bold text-dark mb-4 d-flex align-items-center gap-2">
                  <FaCheckCircle className="text-success" size={18} /> What You
                  Will Master
                </h4>
                <div className="row g-3">
                  {matchedCourse.learningObjectives.map((obj, i) => (
                    <div key={i} className="col-md-6">
                      <div className="d-flex align-items-start gap-3">
                        <FaCheckCircle
                          className="text-success mt-1 flex-shrink-0"
                          size={16}
                        />
                        <span className="text-secondary small fw-medium">
                          {obj}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Interactive Curriculum Modules Accordion */}
            {matchedCourse.curriculum?.length > 0 && (
              <div className="bg-white border-0 rounded-4 p-4 shadow-sm mb-4">
                <h4 className="fw-bold text-dark mb-2">
                  Curriculum Architecture
                </h4>
                <p className="text-muted small mb-4">
                  Explore our step-by-step modular progression roadmap.
                </p>

                <div className="accordion border-0" id="curriculumAccordion">
                  {matchedCourse.curriculum.map((module, idx) => (
                    <div
                      className="accordion-item border-light-subtle rounded-3 mb-3 overflow-hidden shadow-sm"
                      key={module._id || idx}
                    >
                      <h2 className="accordion-header">
                        <button
                          className={`accordion-button fw-bold text-dark d-flex justify-content-between align-items-center py-3 ${activeModule !== idx ? "collapsed" : ""}`}
                          type="button"
                          onClick={() =>
                            setActiveModule(activeModule === idx ? null : idx)
                          }
                          style={{
                            backgroundColor:
                              activeModule === idx ? "#f8fafc" : "#ffffff",
                          }}
                        >
                          <div className="text-start">
                            <span className="text-primary d-block small mb-1">
                              MODULE {idx + 1}
                            </span>
                            {module.moduleName}
                          </div>
                        </button>
                      </h2>
                      <div
                        className={`accordion-collapse collapse ${activeModule === idx ? "show" : ""}`}
                      >
                        <div className="accordion-body bg-white border-top border-light-subtle">
                          {module.description && (
                            <p className="text-muted small mb-3 italic">
                              {module.description}
                            </p>
                          )}

                          <div className="d-grid gap-2">
                            {module.lessons?.map((lesson, lIdx) => (
                              <div
                                key={lesson._id || lIdx}
                                className="d-flex justify-content-between align-items-center p-2.5 rounded-3 bg-light bg-opacity-70 border border-light-subtle transition-all"
                              >
                                <div className="d-flex align-items-center gap-3">
                                  <FaPlayCircle
                                    size={16}
                                    className={
                                      lesson.isFreePreview
                                        ? "text-primary"
                                        : "text-muted"
                                    }
                                  />
                                  <span className="text-dark small fw-medium">
                                    {lesson.title}
                                  </span>
                                </div>
                                <div className="d-flex align-items-center gap-3">
                                  <span className="text-muted small">
                                    {lesson.durationInMins} mins
                                  </span>
                                  {lesson.isFreePreview && (
                                    <span className="badge bg-success-subtle text-success border border-success-subtle px-2 py-1 rounded">
                                      Preview
                                    </span>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Floating Sidebar Container */}
          <div className="col-lg-4">
            <div
              className="bg-white border-0 shadow-sm p-4 rounded-4"
              style={{ position: "sticky", top: "24px", zIndex: 10 }}
            >
              <h5 className="fw-bold text-dark mb-3">
                Program Tuition Structure
              </h5>

              {/* Professional Variable Pricing Grid */}
              <div className="p-4 rounded-4 bg-primary bg-opacity-5 border border-primary-subtle mb-4 text-center">
                <span className="text-muted d-block small mb-1 fw-medium">
                  Special Admittance Offer
                </span>
                <div className="d-flex align-items-center justify-content-center gap-2 mb-2">
                  <span
                    className="text-warning fw-extrabold fs-2"
                    style={{ fontWeight: "800" }}
                  >
                    ₹
                    {matchedCourse.pricing?.discountedPrice ||
                      matchedCourse.pricing?.basePrice}
                  </span>
                  {matchedCourse.pricing?.discountedPrice > 0 &&
                    matchedCourse.pricing?.basePrice !==
                      matchedCourse.pricing?.discountedPrice && (
                      <span className="text-muted text-decoration-line-through small fw-medium">
                        ₹{matchedCourse.pricing?.basePrice}
                      </span>
                    )}
                </div>
                <span className="badge bg-white text-primary border border-primary-subtle px-2.5 py-1.5 rounded-pill fw-semibold small">
                  Currency Mode: {matchedCourse.pricing?.currency || "INR"}
                </span>
              </div>

              {/* Utility Metric Rows */}
              <div className="d-grid gap-3 mb-4 border-top pt-3 text-secondary small">
                <div className="d-flex align-items-center justify-content-between">
                  <div className="d-flex align-items-center gap-2">
                    <FaRegClock className="text-muted" />{" "}
                    <span>Total Time Investment</span>
                  </div>
                  <strong className="text-dark">
                    {matchedCourse.metrics?.totalHours || 0} Hours
                  </strong>
                </div>
                <div className="d-flex align-items-center justify-content-between">
                  <div className="d-flex align-items-center gap-2">
                    <FaShieldAlt className="text-muted" />{" "}
                    <span>Credential Type</span>
                  </div>
                  <strong className="text-dark">Global Accreditation</strong>
                </div>
              </div>

              {/* Dynamic Action Trigger */}
              <button
                className={`btn btn-lg w-100 py-3 rounded-pill fw-bold shadow-sm d-flex align-items-center justify-content-center gap-2 ${isEnrolled ? "btn-success text-white" : "btn-primary text-white"}`}
                onClick={handleEnroll}
                disabled={isEnrolled || loading}
                style={
                  !isEnrolled
                    ? {
                        background:
                          "linear-gradient(135deg, #0d6efd 0%, #0a58ca 100%)",
                        border: "none",
                      }
                    : {}
                }
              >
                {loading ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm"
                      role="status"
                    ></span>
                    <span>Synchronizing Context...</span>
                  </>
                ) : isEnrolled ? (
                  <>
                    <FaLock size={13} /> Enrolled
                  </>
                ) : (
                  <>
                    <span>Enroll Now</span>
                    <FaArrowRight size={13} />
                  </>
                )}
              </button>

              <p
                className="text-center text-muted mt-3 mb-0"
                style={{ fontSize: "0.75rem", lineHeight: "1.4" }}
              >
                *Enrollment processing requires administrative seat
                authorization matrix mappings at physical hubs.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;
