import { Link, useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import {
  FaAngleLeft,
  FaEye,
  FaEyeSlash,
  FaLock,
  FaEnvelope,
  FaPhone,
  FaUser,
} from "react-icons/fa6";

import { useAuth } from "../../context/AuthProvider";

export default function Register() {
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    const cleanedPhone = formData.phone.replace(/\D/g, "");
    if (cleanedPhone.length !== 10) {
      toast.error("Phone number must be exactly 10 digits.");
      setLoading(false);
      return;
    }

    try {
      const data = await register({ ...formData, phone: cleanedPhone });
      console.log(data);
      toast.success(data.message);

      setFormData({
        firstName: "",
        lastName: "",
        phone: "",
        email: "",
        password: "",
      });

      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      console.error(
        "Registration Error:",
        error.response?.data?.message || error.message,
      );
      toast.error(
        error.response?.data?.message || "An unexpected error occurred.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="login-page-wrapper"
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem 1rem",
      }}
    >
      <div className="container" style={{ maxWidth: "1100px" }}>
        <div
          className="card border-0 shadow-lg overflow-hidden"
          style={{ borderRadius: "24px", background: "#ffffff" }}
        >
          <div className="row g-0">
            {/* Left Side: Form Elements */}
            <div className="col-lg-6 p-4 p-sm-5 d-flex flex-column justify-content-center">
              {/* Back Link */}
              <div className="mb-4">
                <Link
                  to="/"
                  className="text-decoration-none d-inline-flex align-items-center gap-2 text-muted fw-medium small hover-primary"
                  style={{ transition: "0.2s" }}
                >
                  <FaAngleLeft /> Back to home
                </Link>
              </div>

              {/* Title Section */}
              <div className="mb-4 text-start">
                <div className="d-flex align-items-center gap-2 mb-2">
                  <span style={{ fontSize: "1.5rem" }}>🚀</span>
                  <span
                    className="text-uppercase fw-bold tracking-wider text-muted small"
                    style={{ letterSpacing: "1px" }}
                  >
                    Get Started
                  </span>
                </div>
                <h2
                  className="fw-bold text-dark"
                  style={{ fontSize: "2rem", letterSpacing: "-0.5px" }}
                >
                  Create an account
                </h2>
                <p className="text-muted small">
                  Fill out the credentials below to setup your profile
                  workspace.
                </p>
              </div>

              <form onSubmit={handleRegister} className="needs-validation">
                {/* First and Last Name Grid */}
                <div className="row g-3 mb-3">
                  <div className="col-sm-6">
                    <label className="form-label small fw-semibold text-secondary">
                      First Name
                    </label>
                    <div className="input-group border rounded-3 overflow-hidden bg-light">
                      <span className="input-group-text bg-transparent border-0 text-muted ps-3 pe-2">
                        <FaUser size={14} />
                      </span>
                      <input
                        type="text"
                        name="firstName"
                        className="form-control bg-transparent border-0 ps-2 py-2.5 shadow-none text-dark"
                        placeholder="John"
                        required
                        value={formData.firstName}
                        onChange={handleChange}
                        disabled={loading}
                      />
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <label className="form-label small fw-semibold text-secondary">
                      Last Name
                    </label>
                    <div className="input-group border rounded-3 overflow-hidden bg-light">
                      <span className="input-group-text bg-transparent border-0 text-muted ps-3 pe-2">
                        <FaUser size={14} />
                      </span>
                      <input
                        type="text"
                        name="lastName"
                        className="form-control bg-transparent border-0 ps-2 py-2.5 shadow-none text-dark"
                        placeholder="Doe"
                        required
                        value={formData.lastName}
                        onChange={handleChange}
                        disabled={loading}
                      />
                    </div>
                  </div>
                </div>

                {/* Phone Input */}
                <div className="mb-3">
                  <label className="form-label small fw-semibold text-secondary">
                    Phone Number
                  </label>
                  <div className="input-group border rounded-3 overflow-hidden bg-light">
                    <span className="input-group-text bg-transparent border-0 text-muted ps-3 pe-2">
                      <FaPhone size={14} />
                    </span>
                    <input
                      type="tel"
                      name="phone"
                      className="form-control bg-transparent border-0 ps-2 py-2.5 shadow-none text-dark"
                      placeholder="10-digit mobile number"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      disabled={loading}
                    />
                  </div>
                </div>

                {/* Email Input */}
                <div className="mb-3">
                  <label className="form-label small fw-semibold text-secondary">
                    Email Address
                  </label>
                  <div className="input-group border rounded-3 overflow-hidden bg-light">
                    <span className="input-group-text bg-transparent border-0 text-muted ps-3 pe-2">
                      <FaEnvelope size={14} />
                    </span>
                    <input
                      type="email"
                      name="email"
                      className="form-control bg-transparent border-0 ps-2 py-2.5 shadow-none text-dark"
                      placeholder="name@example.com"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      disabled={loading}
                    />
                  </div>
                </div>

                {/* Password Input */}
                <div className="mb-4">
                  <label className="form-label small fw-semibold text-secondary">
                    Password
                  </label>
                  <div className="input-group border rounded-3 overflow-hidden bg-light">
                    <span className="input-group-text bg-transparent border-0 text-muted ps-3 pe-2">
                      <FaLock size={14} />
                    </span>
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      className="form-control bg-transparent border-0 ps-2 py-2.5 shadow-none text-dark"
                      placeholder="Create safe secure password"
                      required
                      value={formData.password}
                      onChange={handleChange}
                      disabled={loading}
                    />
                    <button
                      type="button"
                      className="btn border-0 text-muted px-3 d-flex align-items-center"
                      onClick={() => setShowPassword(!showPassword)}
                      tabIndex="-1"
                    >
                      {showPassword ? (
                        <FaEyeSlash size={16} />
                      ) : (
                        <FaEye size={16} />
                      )}
                    </button>
                  </div>
                </div>

                {/* Submit Action Block */}
                <button
                  type="submit"
                  className="btn btn-lg w-100 py-2.5 fw-semibold border-0 text-white d-flex align-items-center justify-content-center gap-2 shadow-sm"
                  disabled={loading}
                  style={{
                    background:
                      "linear-gradient(135deg, #4f46e5 0%, #3730a3 100%)",
                    borderRadius: "12px",
                    transition: "all 0.2s ease",
                    fontSize: "1rem",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.95")}
                  onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
                >
                  {loading ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm"
                        role="status"
                        aria-hidden="true"
                      ></span>
                      <span>Creating Profile...</span>
                    </>
                  ) : (
                    "Register & Create Account"
                  )}
                </button>
              </form>

              {/* Login Redirection link */}
              <div className="text-center mt-4">
                <p className="text-muted small mb-0">
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="fw-semibold text-decoration-none"
                    style={{ color: "#4f46e5" }}
                  >
                    Sign In
                  </Link>
                </p>
              </div>
            </div>

            {/* Right Side: Shared Showcase Panel */}
            <div
              className="col-lg-6 d-none d-lg-flex flex-column justify-content-between p-5 position-relative"
              style={{
                background: "linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)",
                backgroundImage:
                  "radial-gradient(at 0% 0%, rgba(79, 70, 229, 0.4) 0, transparent 50%), radial-gradient(at 100% 100%, rgba(99, 102, 241, 0.2) 0, transparent 50%)",
                color: "#ffffff",
              }}
            >
              <div
                className="d-flex align-items-center gap-2"
                style={{ opacity: 0.85 }}
              >
                <img
                  src="/mic-speaker.png"
                  alt="Platform Icon"
                  style={{
                    width: "32px",
                    height: "32px",
                    objectFit: "contain",
                  }}
                />
                <span
                  className="fw-bold text-uppercase small"
                  style={{ letterSpacing: "1px", color: "#ffffff" }}
                >
                  Educate Portal
                </span>
              </div>

              <div className="my-auto py-5">
                <h1
                  className="fw-bold lh-base mb-3"
                  style={{
                    fontSize: "2.5rem",
                    letterSpacing: "-1px",
                    background:
                      "linear-gradient(135deg, #ffffff 30%, #7dd3fc 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                    color: "transparent",
                  }}
                >
                  Empowering the next generation of learners.
                </h1>
                <p
                  className="lead fs-6 fw-normal"
                  style={{ color: "#cbd5e1", lineHeight: "1.6" }}
                >
                  Access customized administration frameworks, global franchise
                  tools, and immersive digital learning modules instantly.
                </p>
              </div>

              <div
                className="d-flex justify-content-between pt-3 small"
                style={{
                  borderTop: "1px solid rgba(255, 255, 255, 0.15)",
                  color: "#94a3b8",
                }}
              >
                <span>© 2026 Educate Inc.</span>
                <span>Privacy & Terms</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
