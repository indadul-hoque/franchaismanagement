import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";
import { Offcanvas, Nav, Button } from "react-bootstrap";
import {
  FaBars,
  FaHome,
  FaInfoCircle,
  FaGraduationCap,
  FaBookOpen,
  FaPhoneAlt,
  FaUser,
  FaSignOutAlt,
  FaSignInAlt,
  FaHandshake,
  FaChalkboardTeacher,
  FaMapMarkerAlt,
  FaTimes,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";
import toast from "react-hot-toast";

const OffcanvasMenu = () => {
  const [show, setShow] = useState(false);
  const { isAuthenticated, logout } = useAuth();
  const [firstInitial, setFirstInitial] = useState("U");
  const navigate = useNavigate();

  // Sub-menu toggle states
  const [franchiseOpen, setFranchiseOpen] = useState(false);
  const [trainerOpen, setTrainerOpen] = useState(false);

  const toggleMenu = () => {
    setShow(!show);
    // Reset dropdown states when menu toggles close
    if (show) {
      setFranchiseOpen(false);
      setTrainerOpen(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      const storedStudent = JSON.parse(localStorage.getItem("student"));
      if (storedStudent?.firstName) {
        setFirstInitial(storedStudent.firstName.charAt(0).toUpperCase());
      }
    }
  }, [isAuthenticated]);

  const handleLogout = () => {
    toggleMenu();
    logout();
    toast.success("Logout Successfully");
    setTimeout(() => navigate("/login"), 1500);
  };

  const styles = {
    mobileLink: {
      display: "flex",
      alignItems: "center",
      gap: "12px",
      padding: "12px 14px",
      color: "#475569",
      textDecoration: "none",
      fontWeight: "500",
      fontSize: "0.95rem",
      borderRadius: "8px",
      backgroundColor: "#f8f9fa",
    },
    dropdownTrigger: {
      display: "flex",
      alignItems: "center",
      justifyContent: "between",
      width: "100%",
      border: "none",
      outline: "none",
      gap: "12px",
      padding: "12px 14px",
      color: "#475569",
      fontWeight: "500",
      fontSize: "0.95rem",
      borderRadius: "8px",
      backgroundColor: "#f8f9fa",
      textAlign: "left",
    },
    subMenuContainer: {
      overflow: "hidden",
      transition: "all 0.3s ease-in-out",
      backgroundColor: "#f1f5f9",
      borderRadius: "8px",
    },
    subLink: {
      padding: "10px 16px",
      fontSize: "0.9rem",
      color: "#64748b",
      textDecoration: "none",
      display: "block",
      fontWeight: "500",
    },
  };

  return (
    <>
      {/* Menu Trigger Hamburger Button */}
      <button
        className="btn btn-light rounded-circle d-flex align-items-center justify-content-center p-0 shadow-sm border border-light"
        onClick={toggleMenu}
        style={{ width: "38px", height: "38px" }}
        aria-label="Toggle Navigation"
      >
        <FaBars size={16} className="text-dark" />
      </button>

      {/* Slide-out Sidebar Drawer */}
      <Offcanvas
        show={show}
        onHide={toggleMenu}
        placement="end"
        className="border-0 shadow-lg"
        style={{ maxWidth: "290px" }}
      >
        {/* Header Row */}
        <div className="d-flex justify-content-between align-items-center px-4 py-3 border-bottom border-light bg-white">
          <div className="d-flex align-items-center gap-2">
            <img
              src="https://i.ibb.co/bmN4W3k/logo.png"
              alt="logo"
              height="30"
              style={{ objectFit: "contain" }}
            />
            <span
              className="text-dark"
              style={{
                letterSpacing: "-0.5px",
                fontWeight: "800",
                fontSize: "1.3rem",
              }}
            >
              Kids<span className="text-primary">a</span>
            </span>
          </div>
          <button
            className="btn p-0 d-flex align-items-center justify-content-center rounded-circle border-0"
            onClick={toggleMenu}
            style={{
              width: "32px",
              height: "32px",
              backgroundColor: "#f8f9fa",
              color: "#64748b",
            }}
          >
            <FaTimes size={14} />
          </button>
        </div>

        {/* Navigation Body Scroller */}
        <Offcanvas.Body className="d-flex flex-column justify-content-between p-3 bg-white">
          <nav className="w-100">
            <Nav className="flex-column gap-2">
              <Link to="/" onClick={toggleMenu} style={styles.mobileLink}>
                <FaHome className="text-primary" size={16} /> Home
              </Link>

              <Link to="/about" onClick={toggleMenu} style={styles.mobileLink}>
                <FaInfoCircle className="text-primary" size={16} /> About Us
              </Link>

              <Link
                to="/courses"
                onClick={toggleMenu}
                style={styles.mobileLink}
              >
                <FaGraduationCap className="text-primary" size={16} /> Courses
              </Link>

              {/* 1. FRANCHISE DROPDOWN TAB */}
              <div>
                <button
                  onClick={() => setFranchiseOpen(!franchiseOpen)}
                  style={{
                    ...styles.dropdownTrigger,
                    backgroundColor: franchiseOpen ? "#e2e8f0" : "#f8f9fa",
                    color: franchiseOpen ? "#0d6efd" : "#475569",
                  }}
                >
                  <div className="d-flex align-items-center gap-2 me-auto">
                    <FaHandshake
                      className={
                        franchiseOpen ? "text-primary" : "text-secondary"
                      }
                      size={16}
                    />
                    <span>Franchise</span>
                  </div>
                  {franchiseOpen ? (
                    <FaChevronUp size={12} />
                  ) : (
                    <FaChevronDown size={12} />
                  )}
                </button>

                {franchiseOpen && (
                  <div
                    className="mt-1 d-flex flex-column"
                    style={styles.subMenuContainer}
                  >
                    <Link
                      to="/franchise/benefits"
                      onClick={toggleMenu}
                      style={styles.subLink}
                      className="border-bottom border-white border-opacity-50"
                    >
                      Benefits
                    </Link>
                    <Link
                      to="/franchise/criteria"
                      onClick={toggleMenu}
                      style={styles.subLink}
                      className="border-bottom border-white border-opacity-50"
                    >
                      Criteria
                    </Link>
                    <Link
                      to="/franchise/registration"
                      onClick={toggleMenu}
                      style={styles.subLink}
                    >
                      Registration
                    </Link>
                  </div>
                )}
              </div>

              {/* 2. TRAINER DROPDOWN TAB */}
              <div>
                <button
                  onClick={() => setTrainerOpen(!trainerOpen)}
                  style={{
                    ...styles.dropdownTrigger,
                    backgroundColor: trainerOpen ? "#e2e8f0" : "#f8f9fa",
                    color: trainerOpen ? "#0d6efd" : "#475569",
                  }}
                >
                  <div className="d-flex align-items-center gap-2 me-auto">
                    <FaChalkboardTeacher
                      className={
                        trainerOpen ? "text-primary" : "text-secondary"
                      }
                      size={16}
                    />
                    <span>Trainer</span>
                  </div>
                  {trainerOpen ? (
                    <FaChevronUp size={12} />
                  ) : (
                    <FaChevronDown size={12} />
                  )}
                </button>

                {trainerOpen && (
                  <div
                    className="mt-1 d-flex flex-column"
                    style={styles.subMenuContainer}
                  >
                    <Link
                      to="/trainer/become"
                      onClick={toggleMenu}
                      style={styles.subLink}
                      className="border-bottom border-white border-opacity-50"
                    >
                      Become a Trainer
                    </Link>
                    <Link
                      to="/trainer/certified"
                      onClick={toggleMenu}
                      style={styles.subLink}
                    >
                      Our Certified Trainer
                    </Link>
                  </div>
                )}
              </div>

              <Link
                to="/studymaterials"
                onClick={toggleMenu}
                style={styles.mobileLink}
              >
                <FaBookOpen className="text-primary" size={16} /> Study
                Materials
              </Link>

              <Link
                to="/contact"
                onClick={toggleMenu}
                style={styles.mobileLink}
              >
                <FaPhoneAlt className="text-primary" size={16} /> Contact Us
              </Link>
            </Nav>

            <hr className="my-3 text-muted opacity-25" />

            {/* Micro Info Contact Block */}
            <div
              className="text-secondary small px-3 py-2 rounded-3"
              style={{ backgroundColor: "#fafafa" }}
            >
              <h6
                className="fw-bold text-dark mb-1 text-uppercase"
                style={{ fontSize: "0.7rem", letterSpacing: "0.5px" }}
              >
                Contact Info
              </h6>
              <p
                className="d-flex align-items-center gap-2 text-muted mb-0"
                style={{ fontSize: "0.8rem" }}
              >
                <FaMapMarkerAlt className="text-primary opacity-75" size={12} />{" "}
                6391 Elgin St. Celina, USA
              </p>
            </div>
          </nav>

          {/* Bottom Sticky User Account Actions Section */}
          <div className="w-100 pt-3 border-top border-light mt-3">
            {!isAuthenticated ? (
              <Button
                as={Link}
                to="/login"
                onClick={toggleMenu}
                className="btn btn-primary w-100 py-2.5 rounded-pill fw-bold shadow-sm d-flex align-items-center justify-content-center gap-2"
                style={{
                  fontSize: "0.9rem",
                  border: "none",
                  background: "linear-gradient(45deg, #0d6efd, #0a58ca)",
                }}
              >
                <FaSignInAlt /> Login
              </Button>
            ) : (
              <div className="d-flex flex-column gap-2 w-100">
                <div className="d-flex align-items-center gap-3 p-2 bg-light rounded-3 mb-1 border border-light">
                  <div
                    className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center fw-bold shadow-sm"
                    style={{
                      width: "36px",
                      height: "36px",
                      fontSize: "0.9rem",
                    }}
                  >
                    {firstInitial}
                  </div>
                  <span className="fw-semibold text-dark small">
                    Welcome Back!
                  </span>
                </div>

                <Button
                  as={Link}
                  to="/profile"
                  onClick={toggleMenu}
                  variant="outline-secondary"
                  className="w-100 py-2 rounded-pill d-flex align-items-center justify-content-center gap-2 fw-medium text-secondary small"
                >
                  <FaUser size={12} /> View Profile
                </Button>
                <Button
                  onClick={handleLogout}
                  variant="link"
                  className="text-danger text-decoration-none py-1 fw-bold d-flex align-items-center justify-content-center gap-2 small"
                >
                  <FaSignOutAlt /> Sign Out
                </Button>
              </div>
            )}
          </div>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};

export default OffcanvasMenu;
