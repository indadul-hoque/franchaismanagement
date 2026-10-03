import { useAuth } from "../../context/AuthProvider";
import { Link, useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import {
  FaAngleLeft,
  FaEye,
  FaEyeSlash,
  FaLock,
  FaEnvelope,
  FaUserShield,
} from "react-icons/fa6";

export default function Login() {
  const [formData, setFormData] = useState({
    role: "",
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { setIsAuthenticated, login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const { role, email, password } = formData;

    if (!role || !email || !password) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setIsLoading(true);

    try {
      const data = await login(formData);
      setIsAuthenticated(true);

      toast.success(data.message || "Logged in successfully");
      setFormData({ role: "", email: "", password: "" });

      if (role === "admin") navigate("/admin-dashboard");
      else if (role === "franchise") navigate("/franchise-dashboard");
      else if (role === "student") navigate("/student-dashboard");
      else if (role === "guest") navigate("/");
    } catch (e) {
      console.log(e);
      const errorMessage =
        e.data?.message ||
        e.data?.error ||
        "Invalid credentials. Please try again.";

      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
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
            {/* Left Side: Form */}
            <div className="col-lg-6 p-4 p-sm-5 d-flex flex-column justify-content-center">
              {/* Back to Home Button */}
              <div className="mb-4">
                <Link
                  to="/"
                  className="text-decoration-none d-inline-flex align-items-center gap-2 text-muted fw-medium small hover-primary"
                  style={{ transition: "0.2s" }}
                >
                  <FaAngleLeft /> Back to home
                </Link>
              </div>

              {/* Header Text */}
              <div className="mb-4 text-start">
                <div className="d-flex align-items-center gap-2 mb-2">
                  <span style={{ fontSize: "1.5rem" }}>👋</span>
                  <span
                    className="text-uppercase fw-bold tracking-wider text-muted small"
                    style={{ letterSpacing: "1px" }}
                  >
                    Welcome back
                  </span>
                </div>
                <h2
                  className="fw-bold text-dark"
                  style={{ fontSize: "2rem", letterSpacing: "-0.5px" }}
                >
                  Login to Account
                </h2>
                <p className="text-muted small">
                  Please enter your credentials to access your portal.
                </p>
              </div>

              {/* Form elements */}
              <form onSubmit={handleLogin} className="needs-validation">
                {/* Role Selection */}
                <div className="mb-3">
                  <label className="form-label small fw-semibold text-secondary">
                    Sign in as
                  </label>
                  <div
                    className="input-group input-group-lg border rounded-3 overflow-hidden bg-light"
                    style={{ transition: "0.3s" }}
                  >
                    <span className="input-group-text bg-transparent border-0 text-muted ps-3 pe-2">
                      <FaUserShield size={18} />
                    </span>
                    <select
                      name="role"
                      className="form-select bg-transparent border-0 ps-2 py-3 shadow-none text-dark"
                      value={formData.role}
                      onChange={handleChange}
                      disabled={isLoading}
                      required
                      style={{ fontSize: "1rem", cursor: "pointer" }}
                    >
                      <option value="" disabled>
                        Select your workspace role
                      </option>
                      <option value="admin">Admin</option>
                      <option value="franchise">Franchise</option>
                      <option value="student">Student</option>
                      <option value="guest">Guest</option>
                    </select>
                  </div>
                </div>

                {/* Email Field */}
                <div className="mb-3">
                  <label className="form-label small fw-semibold text-secondary">
                    Email Address
                  </label>
                  <div className="input-group input-group-lg border rounded-3 overflow-hidden bg-light">
                    <span className="input-group-text bg-transparent border-0 text-muted ps-3 pe-2">
                      <FaEnvelope size={16} />
                    </span>
                    <input
                      type="email"
                      name="email"
                      className="form-control bg-transparent border-0 ps-2 py-3 shadow-none text-dark"
                      placeholder="name@company.com"
                      value={formData.email}
                      onChange={handleChange}
                      disabled={isLoading}
                      required
                      style={{ fontSize: "1rem" }}
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="mb-4">
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <label className="form-label small fw-semibold text-secondary mb-0">
                      Password
                    </label>
                    <Link
                      to="/forgot-password"
                      className="text-decoration-none small fw-medium"
                      style={{ color: "#4f46e5" }}
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <div className="input-group input-group-lg border rounded-3 overflow-hidden bg-light">
                    <span className="input-group-text bg-transparent border-0 text-muted ps-3 pe-2">
                      <FaLock size={16} />
                    </span>
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      className="form-control bg-transparent border-0 ps-2 py-3 shadow-none text-dark"
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={handleChange}
                      disabled={isLoading}
                      required
                      style={{ fontSize: "1rem" }}
                    />
                    <button
                      type="button"
                      className="btn border-0 text-muted px-3 d-flex align-items-center"
                      onClick={() => setShowPassword(!showPassword)}
                      tabIndex="-1"
                    >
                      {showPassword ? (
                        <FaEyeSlash size={18} />
                      ) : (
                        <FaEye size={18} />
                      )}
                    </button>
                  </div>
                </div>

                {/* Submit Action */}
                <button
                  type="submit"
                  className="btn btn-lg w-100 py-3 fw-semibold border-0 text-white d-flex align-items-center justify-content-center gap-2 shadow-sm"
                  disabled={isLoading}
                  style={{
                    background:
                      "linear-gradient(135deg, #4f46e5 0%, #3730a3 100%)",
                    borderRadius: "12px",
                    transition: "all 0.2s ease",
                    fontSize: "1.05rem",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.95")}
                  onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
                >
                  {isLoading ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm"
                        role="status"
                        aria-hidden="true"
                      ></span>
                      <span>Authenticating...</span>
                    </>
                  ) : (
                    "Sign In to Account"
                  )}
                </button>
              </form>

              {/* Footer Redirection */}
              <div className="text-center mt-4">
                <p className="text-muted small mb-0">
                  Don't have an account yet?{" "}
                  <Link
                    to="/register"
                    className="fw-semibold text-decoration-none"
                    style={{ color: "#4f46e5" }}
                  >
                    Create one here
                  </Link>
                </p>
              </div>
            </div>

            {/* Right Side: Showcase Panel (Visible on Desktop) */}
            <div
              className="col-lg-6 d-none d-lg-flex flex-column justify-content-between p-5 position-relative"
              style={{
                background: "linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)",
                backgroundImage:
                  "radial-gradient(at 0% 0%, rgba(79, 70, 229, 0.4) 0, transparent 50%), radial-gradient(at 100% 100%, rgba(99, 102, 241, 0.2) 0, transparent 50%)",
                color: "#ffffff",
              }}
            >
              {/* Top Brand Tag */}
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

              {/* Main Headline Body */}
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
                    color: "transparent", // Fallback for unsupported browsers
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

              {/* Footer Meta Details */}
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
