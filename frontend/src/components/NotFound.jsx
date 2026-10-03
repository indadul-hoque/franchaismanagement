import React, { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaArrowLeft, FaHome } from "react-icons/fa";

export default function NotFound() {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div
      className="container d-flex align-items-center justify-content-center min-vh-100 position-relative overflow-hidden"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      {/* Decorative Ambient Background Glow Elements */}
      <div
        className="position-absolute bg-secondary opacity-10 rounded-circle filter-blur"
        style={{
          width: "300px",
          height: "300px",
          top: "10%",
          left: "15%",
          filter: "blur(80px)",
        }}
      />
      <div
        className="position-absolute bg-dark opacity-10 rounded-circle filter-blur"
        style={{
          width: "400px",
          height: "400px",
          bottom: "10%",
          right: "10%",
          filter: "blur(100px)",
        }}
      />

      {/* Main Card Console Container */}
      <div className="text-center position-relative z-1 px-4">
        {/* Giant 404 Display Row */}
        <h1
          className="fw-black text-dark m-0 d-flex justify-content-center align-items-center select-none"
          style={{
            fontSize: "calc(6rem + 4vw)",
            letterSpacing: "-0.05em",
            lineHeight: 1,
          }}
        >
          4
          <span
            className="d-inline-block text-white bg-dark mx-2 rounded-4 border shadow-sm"
            style={{
              width: "0.85em",
              height: "0.85em",
              lineHeight: "0.78em",
              transform: "rotate(-8deg)",
              fontSize: "0.8em",
            }}
          >
            0
          </span>
          4
        </h1>

        {/* Informational Text Stack */}
        <h4 className="fw-bold text-dark mt-4 mb-2 fs-3">Lost in Transit</h4>
        <p
          className="text-secondary small mb-5 mx-auto"
          style={{ maxWidth: "380px", lineHeight: 1.6 }}
        >
          The link you requested might be broken, or the underlying material
          resource profile has been migrated elsewhere.
        </p>

        {/* Action Controls Tray */}
        <div className="d-flex flex-column flex-sm-row justify-content-center align-items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="btn btn-outline-dark btn-lg w-100 w-sm-auto px-4 py-2.5 rounded-3 fw-medium small d-inline-flex align-items-center justify-content-center gap-2 transition-all shadow-sm"
            style={{ fontSize: "0.9rem" }}
          >
            <FaArrowLeft size={11} /> Step Backward
          </button>

          <Link
            to="/"
            className="btn btn-dark btn-lg w-100 w-sm-auto px-4 py-2.5 rounded-3 fw-bold small d-inline-flex align-items-center justify-content-center gap-2 transition-all shadow-sm text-decoration-none"
            style={{ fontSize: "0.9rem" }}
          >
            <FaHome size={13} /> Home Dashboard
          </Link>
        </div>

        {/* Minimal Footer Signature Tag */}
        <div className="mt-5 pt-4 opacity-50">
          <span
            className="text-uppercase text-muted tracking-wider fw-bold"
            style={{ fontSize: "10px" }}
          >
            Error Reference Code: HTTP_404_NOT_FOUND
          </span>
        </div>
      </div>
    </div>
  );
}
