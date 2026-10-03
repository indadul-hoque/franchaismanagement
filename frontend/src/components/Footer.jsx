import React from "react";
import { Link } from "react-router-dom";
import {
  FaArrowRightLong,
  FaFacebookF,
  FaInstagram,
  FaYoutube,
  FaPhone,
  FaEnvelope,
} from "react-icons/fa6";

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      style={{
        backgroundColor: "#0f172a",
        color: "#94a3b8",
        fontFamily: "system-ui, -apple-system, sans-serif",
        borderTop: "1px solid rgba(255, 255, 255, 0.05)",
      }}
    >
      {/* Main Footer Content */}
      <div className="py-5" style={{ paddingBottom: "3rem" }}>
        <div className="container">
          <div className="row g-4 justify-content-between">
            {/* Column 1: Brand & About */}
            <div className="col-xl-4 col-lg-5">
              <div className="mb-4">
                <span
                  className="text-dark fw-extrabold"
                  style={{ fontSize: "1.5rem", letterSpacing: "-0.5px" }}
                >
                  Bright
                  <span className="text-primary position-relative px-0.5">
                    Up
                    <span
                      className="position-absolute bottom-0 start-0 w-100 bg-primary opacity-20 rounded-pill"
                      style={{ height: "4px" }}
                    ></span>
                  </span>
                </span>
                <p
                  className="small lh-bleed pe-xl-4"
                  style={{
                    color: "#cbd5e1",
                    fontSize: "0.95rem",
                    lineHeight: "1.6",
                  }}
                >
                  Empowering young minds with ultimate mental arithmetic
                  strategies, advanced abacus skills, and conceptual
                  mathematics.
                </p>
              </div>

              {/* Interactive Social Media Icons Row */}
              <div className="d-flex gap-2 mt-4">
                <a
                  href="https://www.facebook.com/profile.php?id=61566500032820"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="d-flex align-items-center justify-content-center rounded-circle text-white shared-social-btn"
                  style={{
                    width: "38px",
                    height: "38px",
                    background: "rgba(255,255,255,0.06)",
                    transition: "0.2s",
                  }}
                >
                  <FaFacebookF size={16} />
                </a>
                <a
                  href="https://www.youtube.com/@mathguruabacusho"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="d-flex align-items-center justify-content-center rounded-circle text-white shared-social-btn"
                  style={{
                    width: "38px",
                    height: "38px",
                    background: "rgba(255,255,255,0.06)",
                    transition: "0.2s",
                  }}
                >
                  <FaYoutube size={16} />
                </a>
                <a
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="d-flex align-items-center justify-content-center rounded-circle text-white shared-social-btn"
                  style={{
                    width: "38px",
                    height: "38px",
                    background: "rgba(255,255,255,0.06)",
                    transition: "0.2s",
                  }}
                >
                  <FaInstagram size={16} />
                </a>
              </div>
            </div>

            {/* Column 2: Quick Links */}
            <div className="col-xl-2 col-lg-2 col-md-4 col-sm-6">
              <h6
                className="text-white fw-semibold text-uppercase tracking-wider mb-4"
                style={{ fontSize: "0.85rem", letterSpacing: "1px" }}
              >
                Quick Links
              </h6>
              <ul className="list-unstyled d-flex flex-column gap-2">
                {[
                  { to: "/about", label: "About Us" },
                  { to: "/contact", label: "Contact Us" },
                  { to: "/buymaterials", label: "Buy Materials" },
                ].map((link, idx) => (
                  <li key={`qk-${idx}`}>
                    <Link
                      to={link.to}
                      className="text-decoration-none d-inline-flex align-items-center gap-2 footer-hover-link"
                      style={{
                        color: "#94a3b8",
                        fontSize: "0.95rem",
                        transition: "0.2s",
                      }}
                    >
                      <FaArrowRightLong
                        size={12}
                        className="link-arrow"
                        style={{
                          opacity: 0,
                          transition: "0.2s",
                          color: "#6366f1",
                        }}
                      />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3: Explore */}
            <div className="col-xl-2 col-lg-2 col-md-4 col-sm-6">
              <h6
                className="text-white fw-semibold text-uppercase tracking-wider mb-4"
                style={{ fontSize: "0.85rem", letterSpacing: "1px" }}
              >
                Explore
              </h6>
              <ul className="list-unstyled d-flex flex-column gap-2">
                {[
                  { to: "#", label: "Privacy Policy" },
                  { to: "#", label: "Terms & Conditions" },
                  { to: "#", label: "FAQ" },
                ].map((link, idx) => (
                  <li key={`exp-${idx}`}>
                    <Link
                      to={link.to}
                      className="text-decoration-none d-inline-flex align-items-center gap-2 footer-hover-link"
                      style={{
                        color: "#94a3b8",
                        fontSize: "0.95rem",
                        transition: "0.2s",
                      }}
                    >
                      <FaArrowRightLong
                        size={12}
                        className="link-arrow"
                        style={{
                          opacity: 0,
                          transition: "0.2s",
                          color: "#6366f1",
                        }}
                      />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 4: Contact Infobox */}
            <div className="col-xl-3 col-lg-3 col-md-4">
              <h6
                className="text-white fw-semibold text-uppercase tracking-wider mb-4"
                style={{ fontSize: "0.85rem", letterSpacing: "1px" }}
              >
                Get In Touch
              </h6>
              <div className="d-flex flex-column gap-3">
                <a
                  href="mailto:rabinsahaknd1@gmail.com"
                  className="text-decoration-none d-flex align-items-start gap-3 text-muted footer-contact-card"
                >
                  <span
                    className="d-flex align-items-center justify-content-center rounded"
                    style={{
                      width: "32px",
                      height: "32px",
                      backgroundColor: "rgba(255,255,255,0.04)",
                      flexShrink: 0,
                    }}
                  >
                    <FaEnvelope style={{ color: "#cbd5e1" }} size={14} />
                  </span>
                  <div className="d-flex flex-column">
                    <span
                      className="text-white-50 small"
                      style={{ fontSize: "0.75rem" }}
                    >
                      Email Support
                    </span>
                    <span
                      style={{
                        color: "#cbd5e1",
                        fontSize: "0.9rem",
                        wordBreak: "break-all",
                      }}
                    >
                      rabinsahaknd1@gmail.com
                    </span>
                  </div>
                </a>

                <a
                  href="tel:+919735233808"
                  className="text-decoration-none d-flex align-items-start gap-3 text-muted footer-contact-card"
                >
                  <span
                    className="d-flex align-items-center justify-content-center rounded"
                    style={{
                      width: "32px",
                      height: "32px",
                      backgroundColor: "rgba(255,255,255,0.04)",
                      flexShrink: 0,
                    }}
                  >
                    <FaPhone style={{ color: "#cbd5e1" }} size={14} />
                  </span>
                  <div className="d-flex flex-column">
                    <span
                      className="text-white-50 small"
                      style={{ fontSize: "0.75rem" }}
                    >
                      Call Toll-Free
                    </span>
                    <span style={{ color: "#cbd5e1", fontSize: "0.9rem" }}>
                      +91 9735 2338 08
                    </span>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright Row Partition */}
      <div
        style={{
          backgroundColor: "#020617",
          borderTop: "1px solid rgba(255, 255, 255, 0.03)",
        }}
      >
        <div className="container py-3 d-flex flex-column flex-md-row justify-content-between align-items-center gap-2 text-center text-md-start">
          <p className="mb-0 small" style={{ color: "#64748b" }}>
            © {currentYear} MathGuru-Abacus. All Rights Reserved.
          </p>
          <p
            className="mb-0 small"
            style={{ color: "#475569", fontSize: "0.8rem" }}
          >
            Designed for next-level continuous education.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
