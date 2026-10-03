import React, { useState, useEffect, Suspense, lazy } from "react";
import { Row, Col, Card } from "react-bootstrap";
import { useAuth } from "../../context/AuthProvider";
import axios from "axios";
import { FaUsers, FaChartLine, FaShoppingCart } from "react-icons/fa";
import { SiCoursera } from "react-icons/si";
import { v4 as uuidv4 } from "uuid";
import { PDFDownloadLink } from "@react-pdf/renderer";
import Invoice from "./components/shared/Invoice";
import { FaTimes } from "react-icons/fa";
import { currentConfig } from "../../utils";

const API_URL = currentConfig.API_URL;

const TopperList = lazy(() => import("./components/shared/ToppersList"));

export default function DashboardOverview() {
  const { userRole, students } = useAuth();
  const [totalStudents, setTotalStudents] = useState(0);
  const [totalCourses, setTotalCourses] = useState(0);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    amount: "",
    purpose: "",
  });
  const [isGenerated, setIsGenerated] = useState(false);
  const [errors, setErrors] = useState({});
  const [transaction, setTransaction] = useState(null);
  const [isDownloaded, setIsDownloaded] = useState(false);

  useEffect(() => {
    if (userRole === "admin" || userRole === "franchise") {
      axios
        .get(`${API_URL}/admission/getAllAdmitedStudents`)
        .then((res) => setTotalStudents(res.data.length))
        .catch(console.error);
      axios
        .get(`${API_URL}/courses/allCourse`) // Using LOCAL_BACKEND_URL based on previous file
        .then((res) => setTotalCourses(res.data.totalCourses))
        .catch(console.error);
    }
  }, [userRole]);

  if (userRole === "student") {
    return (
      <Row className="g-3 mt-3">
        <Col xs={12}>
          <Card className="border-0 shadow-sm p-4">
            <h1>Welcome, {students?.studentName || "Student"}! 👋</h1>
            <p>Your enrolled courses and progress overview.</p>
          </Card>
        </Col>
      </Row>
    );
  }

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (
      !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formData.email)
    )
      newErrors.email = "Invalid email";
    if (!formData.amount || formData.amount <= 0)
      newErrors.amount = "Invalid amount";
    if (!formData.purpose) newErrors.purpose = "Purpose is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const newTransaction = {
        ...formData,
        id: uuidv4(),
        date: new Date().toISOString(),
        amount: parseFloat(formData.amount),
      };
      setTransaction(newTransaction);
      setIsDownloaded(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handlePay = (student) => {
    setSelectedStudent(student);
    setFormData({
      name: student.studentName || "",
      email: student.email || "",
      amount: "",
      purpose: "",
    });
    setErrors({});
    setTransaction(null);
    setIsDownloaded(false);
    setIsGenerated(false);
  };

  const closeModal = () => {
    setSelectedStudent(null);
    setTransaction(null);
    setIsDownloaded(false);
    setIsGenerated(false);
  };

  return (
    <>
      <Row className="g-4">
        <Col xs={12} sm={6} xl={3}>
          <Card
            className="border-0 shadow-sm stat-card bg-white"
            style={{ borderRadius: "16px" }}
          >
            <Card.Body className="p-4">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <span className="text-muted fw-medium small text-uppercase tracking-wider">
                    Total Students
                  </span>
                  <h3 className="fw-bold tracking-tight mb-0 mt-2 text-dark">
                    {totalStudents}
                  </h3>
                </div>
                <div
                  className="icon-box bg-primary-light"
                  style={{
                    backgroundColor: "#eff6ff",
                    width: "48px",
                    height: "48px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "12px",
                  }}
                >
                  <FaUsers style={{ color: "#3b82f6" }} size={22} />
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col xs={12} sm={6} xl={3}>
          <Card
            className="border-0 shadow-sm stat-card bg-white"
            style={{ borderRadius: "16px" }}
          >
            <Card.Body className="p-4">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <span className="text-muted fw-medium small text-uppercase tracking-wider">
                    Revenue
                  </span>
                  <h3 className="fw-bold tracking-tight mb-0 mt-2 text-dark">
                    ₹5,678
                  </h3>
                </div>
                <div
                  className="icon-box bg-success-light"
                  style={{
                    backgroundColor: "#f0fdf4",
                    width: "48px",
                    height: "48px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "12px",
                  }}
                >
                  <FaChartLine style={{ color: "#22c55e" }} size={22} />
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col xs={12} sm={6} xl={3}>
          <Card
            className="border-0 shadow-sm stat-card bg-white"
            style={{ borderRadius: "16px" }}
          >
            <Card.Body className="p-4">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <span className="text-muted fw-medium small text-uppercase tracking-wider">
                    Orders
                  </span>
                  <h3 className="fw-bold tracking-tight mb-0 mt-2 text-dark">
                    567
                  </h3>
                </div>
                <div
                  className="icon-box bg-warning-light"
                  style={{
                    backgroundColor: "#fffbeb",
                    width: "48px",
                    height: "48px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "12px",
                  }}
                >
                  <FaShoppingCart style={{ color: "#eab308" }} size={22} />
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col xs={12} sm={6} xl={3}>
          <Card
            className="border-0 shadow-sm stat-card bg-white"
            style={{ borderRadius: "16px" }}
          >
            <Card.Body className="p-4">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <span className="text-muted fw-medium small text-uppercase tracking-wider">
                    Courses
                  </span>
                  <h3 className="fw-bold tracking-tight mb-0 mt-2 text-dark">
                    {totalCourses}
                  </h3>
                </div>
                <div
                  className="icon-box bg-info-light"
                  style={{
                    backgroundColor: "#f0f9ff",
                    width: "48px",
                    height: "48px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "12px",
                  }}
                >
                  <SiCoursera style={{ color: "#06b6d4" }} size={22} />
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Pure Tailwind wrapper replacing Bootstrap Row/Col layout */}
      <div className="mt-4 grid grid-cols-1 gap-6 w-full px-4 sm:px-0">
        <div className="w-full overflow-hidden">
          <Suspense
            fallback={
              <div className="flex h-56 w-full items-center justify-center rounded-2xl border border-slate-100 bg-white shadow-sm">
                <div className="flex flex-col items-center gap-3">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
                  <p className="text-sm font-medium text-slate-500 tracking-wide">
                    Loading directory...
                  </p>
                </div>
              </div>
            }
          >
            <TopperList handlePay={handlePay} />
          </Suspense>
        </div>
      </div>

      {selectedStudent && (
        <div
          className="custom-modal-overlay"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(15, 23, 42, 0.3)",
            backdropFilter: "blur(8px)",
            zIndex: 1050,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            className="custom-modal-card p-4"
            style={{
              background: "#ffffff",
              borderRadius: "24px",
              width: "460px",
              maxWidth: "92%",
              position: "relative",
            }}
          >
            <button
              onClick={closeModal}
              className="btn btn-link text-muted p-2 position-absolute"
              style={{
                top: "16px",
                right: "16px",
                borderRadius: "50%",
                background: "#f1f5f9",
              }}
            >
              <FaTimes size={16} />
            </button>
            <div className="text-center mt-3 mb-4">
              <h4 className="fw-bold text-dark mb-1">Process Payment</h4>
              <p className="text-muted small mb-0">
                Invoice allocation for {selectedStudent.studentName}
              </p>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label text-secondary small fw-semibold">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  className="form-control"
                  value={formData.name}
                  readOnly
                  style={{ backgroundColor: "#f8fafc" }}
                />
              </div>
              <div className="mb-3">
                <label className="form-label text-secondary small fw-semibold">
                  Email Destination
                </label>
                <input
                  type="email"
                  name="email"
                  className="form-control"
                  value={formData.email}
                  readOnly
                  style={{ backgroundColor: "#f8fafc" }}
                />
              </div>
              <div className="mb-3">
                <label className="form-label text-secondary small fw-semibold">
                  Amount (INR)
                </label>
                <input
                  type="number"
                  name="amount"
                  className={`form-control ${errors.amount ? "is-invalid" : ""}`}
                  placeholder="0.00"
                  value={formData.amount}
                  onChange={handleChange}
                />
                {errors.amount && (
                  <div className="invalid-feedback small mt-1">
                    {errors.amount}
                  </div>
                )}
              </div>
              <div className="mb-4">
                <label className="form-label text-secondary small fw-semibold">
                  Allocation Ledger Purpose
                </label>
                <select
                  name="purpose"
                  className={`form-select ${errors.purpose ? "is-invalid" : ""}`}
                  value={formData.purpose}
                  onChange={handleChange}
                >
                  <option value="">Choose Statement Cause...</option>
                  <option value="Admission">Admission Registration Fee</option>
                  <option value="Monthly">Regular Monthly Cycle Tuition</option>
                  <option value="Exam">Term Assessment Certification</option>
                </select>
                {errors.purpose && (
                  <div className="invalid-feedback small mt-1">
                    {errors.purpose}
                  </div>
                )}
              </div>
              <button
                type="submit"
                className={`btn btn-primary w-100 shadow-sm ${transaction ? "opacity-75" : ""}`}
                disabled={!!transaction}
                style={{
                  padding: "0.75rem",
                  borderRadius: "10px",
                  fontWeight: "600",
                }}
              >
                {isGenerated
                  ? "Statement Allocated"
                  : transaction
                    ? "Processing Entry..."
                    : "Generate Direct Receipt"}
              </button>
            </form>
            {transaction && !isDownloaded && (
              <div className="text-center mt-3">
                <PDFDownloadLink
                  document={<Invoice transaction={transaction} />}
                  fileName={`receipt_${transaction.id}.pdf`}
                  style={{ textDecoration: "none" }}
                >
                  {({ loading, error }) => {
                    if (loading)
                      return (
                        <button
                          className="btn btn-secondary w-100"
                          disabled
                          style={{ padding: "0.75rem", borderRadius: "10px" }}
                        >
                          Assembling PDF Elements...
                        </button>
                      );
                    if (error)
                      return (
                        <span className="text-danger small">
                          Render System Processing Fault
                        </span>
                      );
                    if (!isGenerated) setIsGenerated(true);
                    return (
                      <button
                        className="btn btn-success w-100 shadow-sm text-white"
                        style={{
                          backgroundColor: "#10b981",
                          borderColor: "#10b981",
                          padding: "0.75rem",
                          borderRadius: "10px",
                          fontWeight: "600",
                        }}
                        onClick={() =>
                          setTimeout(() => {
                            setIsDownloaded(true);
                            closeModal();
                          }, 800)
                        }
                      >
                        Download Document Receipt
                      </button>
                    );
                  }}
                </PDFDownloadLink>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
