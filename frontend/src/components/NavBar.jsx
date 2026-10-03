import { Link, useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthProvider";
import {
  FaFacebook,
  FaYoutube,
  FaEnvelope,
  FaMapMarkerAlt,
  FaShoppingCart,
  FaUser,
  FaSignOutAlt,
  FaThLarge,
} from "react-icons/fa";
import {
  Container,
  Navbar,
  Nav,
  Button,
  NavDropdown,
  Dropdown,
} from "react-bootstrap";
import toast from "react-hot-toast";
import OffcanvasMenu from "./Offcanvusmenubar";

function NavBar() {
  const { isAuthenticated, logout, userRole, user } = useAuth();
  const [firstInitial, setFirstInitial] = useState("U");
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.firstName) {
      setFirstInitial(user.firstName.charAt(0).toUpperCase());
    } else {
      setFirstInitial("U");
    }
  }, [user, isAuthenticated]);
  const handleLogout = () => {
    logout();
    toast.success("Logout Successfully");
    setTimeout(() => navigate("/login"), 1500);
  };

  return (
    <>
      {/* Top Info Bar - Auto Hidden on Mobile/Tablets */}
      <div className="bg-dark text-light py-2 d-none d-md-block border-bottom border-light border-opacity-10 small">
        <Container className="d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center gap-4 text-white-50">
            <span className="d-flex align-items-center gap-2">
              <FaMapMarkerAlt className="text-primary opacity-75" /> 6391 Elgin
              St. Celina, USA
            </span>
            <span className="d-flex align-items-center gap-2">
              <FaEnvelope className="text-primary opacity-75" />{" "}
              info@example.com
            </span>
          </div>
          <div className="d-flex align-items-center gap-3">
            <span className="text-white-50">Follow Us:</span>
            <a
              href="https://www.facebook.com/profile.php?id=61566500032820"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white-50 link-primary transition"
            >
              <FaFacebook size={14} />
            </a>
            <a
              href="https://www.youtube.com/@mathguruabacusho"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white-50 link-danger transition"
            >
              <FaYoutube size={14} />
            </a>
          </div>
        </Container>
      </div>

      {/* Main Glassmorphism Navbar */}
      <Navbar
        expand="lg"
        bg="white"
        sticky="top"
        className="shadow-sm py-2 border-bottom border-light"
        style={{
          background: "rgba(255, 255, 255, 0.85)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
        }}
      >
        <Container className="d-flex align-items-center justify-content-between flex-nowrap">
          {/* Brand Logo & Name */}
          <Navbar.Brand
            as={Link}
            to="/"
            className="d-flex align-items-center gap-2 py-1 me-auto"
          >
            <div
              className="d-inline-flex flex-column align-items-start lh-1 select-none"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
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
              <span
                className="text-muted text-uppercase tracking-widest fw-bold mt-1"
                style={{ fontSize: "9px", letterSpacing: "2px" }}
              >
                Learning
              </span>
            </div>
          </Navbar.Brand>

          {/* Desktop Links Tree (Centered) - Stripped natively on md/sm */}
          <Navbar.Collapse
            id="main-navbar"
            className="justify-content-center d-none d-lg-flex"
          >
            <Nav className="gap-1 fw-medium align-items-center">
              <Nav.Link
                as={Link}
                to="/"
                className="px-3 py-2 text-secondary link-primary rounded-3"
              >
                Home
              </Nav.Link>
              <Nav.Link
                as={Link}
                to="/about"
                className="px-3 py-2 text-secondary link-primary rounded-3"
              >
                About Us
              </Nav.Link>
              <Nav.Link
                as={Link}
                to="/courses"
                className="px-3 py-2 text-secondary link-primary rounded-3"
              >
                Courses
              </Nav.Link>

              {/* Franchise Dropdown */}
              <NavDropdown
                title="Franchise"
                id="franchise-dropdown"
                className="px-1 py-1"
              >
                <NavDropdown.Item
                  as={Link}
                  to="/franchise/benefits"
                  className="py-2 px-3 rounded-2 text-secondary small"
                >
                  Benefits
                </NavDropdown.Item>
                <NavDropdown.Item
                  as={Link}
                  to="/franchise/criteria"
                  className="py-2 px-3 rounded-2 text-secondary small"
                >
                  Criteria
                </NavDropdown.Item>
                <NavDropdown.Item
                  as={Link}
                  to="/franchise/registration"
                  className="py-2 px-3 rounded-2 text-secondary small"
                >
                  Registration
                </NavDropdown.Item>
              </NavDropdown>

              {/* Trainer Dropdown */}
              <NavDropdown
                title="Trainer"
                id="trainer-dropdown"
                className="px-1 py-1"
              >
                <NavDropdown.Item
                  as={Link}
                  to="/trainer/become"
                  className="py-2 px-3 rounded-2 text-secondary small"
                >
                  Become a Trainer
                </NavDropdown.Item>
                <NavDropdown.Item
                  as={Link}
                  to="/trainer/certified"
                  className="py-2 px-3 rounded-2 text-secondary small"
                >
                  Our Certified Trainer
                </NavDropdown.Item>
              </NavDropdown>

              <Nav.Link
                as={Link}
                to="/products"
                className="px-3 py-2 text-secondary link-primary rounded-3"
              >
                Study Materials
              </Nav.Link>
              <Nav.Link
                as={Link}
                to="/contact"
                className="px-3 py-2 text-secondary link-primary rounded-3"
              >
                Contact Us
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>

          {/* Action Interface Area */}
          <div className="d-flex align-items-center gap-2 gap-sm-3">
            {/* Shopping Cart Button */}
            <Link
              to="/cart"
              className="position-relative d-flex align-items-center justify-content-center text-dark bg-light rounded-circle border shadow-sm"
              style={{
                width: "38px",
                height: "38px",
                transition: "transform 0.2s",
              }}
            >
              <FaShoppingCart style={{ fontSize: "1.05rem" }} />
              <span
                className="position-absolute p-1 bg-primary rounded-circle border border-white"
                style={{
                  top: "4px",
                  right: "4px",
                  width: "8px",
                  height: "8px",
                }}
              />
            </Link>

            {/* Account Management Router - DESKTOP ONLY */}
            <div className="d-none d-lg-flex align-items-center">
              {!isAuthenticated ? (
                <Button
                  as={Link}
                  to="/login"
                  className="btn btn-primary px-4 py-2 rounded-pill fw-semibold shadow-sm text-nowrap"
                  style={{ fontSize: "0.85rem", letterSpacing: "0.1px" }}
                >
                  Login
                </Button>
              ) : (
                <Dropdown align="end">
                  <Dropdown.Toggle
                    id="dropdown-user-account"
                    className="btn btn-primary border-0 rounded-circle d-flex align-items-center justify-content-center fw-bold shadow-sm"
                    style={{ width: "38px", height: "38px", padding: 0 }}
                  >
                    {firstInitial}
                  </Dropdown.Toggle>
                  <Dropdown.Menu
                    className="shadow border-0 mt-2 p-2 rounded-3"
                    style={{ minWidth: "170px" }}
                  >
                    {/* Added Dashboard Item */}
                    {userRole !== "guest" && (
                      <Dropdown.Item
                        as={Link}
                        to="/dashboard" // Update this path if your route relies on a specific role like /admin/dashboard
                        className="py-2 px-3 rounded-2 text-secondary d-flex align-items-center gap-2 small"
                      >
                        <FaThLarge className="opacity-75" /> Dashboard
                      </Dropdown.Item>
                    )}

                    <Dropdown.Item
                      as={Link}
                      to="/profile"
                      className="py-2 px-3 rounded-2 text-secondary d-flex align-items-center gap-2 small"
                    >
                      <FaUser className="opacity-75" /> Profile
                    </Dropdown.Item>
                    <Dropdown.Divider className="my-1 opacity-50" />
                    <Dropdown.Item
                      onClick={handleLogout}
                      className="py-2 px-3 rounded-2 text-danger d-flex align-items-center gap-2 small"
                    >
                      <FaSignOutAlt /> Logout
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              )}
            </div>

            {/* Mobile/Tablet Drawer Activation Hub */}
            <div className="d-lg-none">
              <OffcanvasMenu />
            </div>
          </div>
        </Container>
      </Navbar>
    </>
  );
}

export default NavBar;
