import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { MdOutlineAddCircle, MdBorderColor } from "react-icons/md";
import { PiStudentBold } from "react-icons/pi";
import { LuLogOut, LuGitBranchPlus, LuChevronDown } from "react-icons/lu";
import {
  FaThLarge,
  FaBook,
  FaBookOpen,
  FaUsers,
  FaChalkboardTeacher,
  FaBuilding,
  FaFileDownload,
  FaHistory,
} from "react-icons/fa";
import { IoPersonAdd } from "react-icons/io5";
import { FiMenu, FiX } from "react-icons/fi";
import toast from "react-hot-toast";
import { useAuth } from "../../../../context/AuthProvider";

const UnifiedSidebar = () => {
  const { logout, userRole } = useAuth();
  const navigate = useNavigate();
  const [subbarVisibility, setSubbarVisibility] = useState({
    branches: false,
    courses: false,
    students: false,
  });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Get appropriate user info from local storage
  const user =
    JSON.parse(
      localStorage.getItem(userRole === "student" ? "student" : "admin"),
    ) || {};
  const userName =
    user.firstName || (userRole === "student" ? "Student" : "Admin");
  const userEmail =
    user.email ||
    (userRole === "student" ? "student@platform.com" : "admin@platform.com");

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    setTimeout(() => {
      navigate("/");
    }, 1500);
  };

  const toggleSubbar = (section) => {
    setSubbarVisibility((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (
        isSidebarOpen &&
        !e.target.closest(".custom-sidebar") &&
        !e.target.closest(".hamburger-btn")
      ) {
        setIsSidebarOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [isSidebarOpen]);

  const getNavLinkClass = ({ isActive }) => {
    return `d-flex align-items-center gap-3 px-3 py-2.5 rounded-3 mb-1 text-decoration-none border-0 w-100 text-start btn border-0 outline-none shadow-none style-none transition-all ${
      isActive
        ? "bg-primary text-white shadow-sm fw-medium"
        : "text-secondary bg-transparent hover-bg-light"
    }`;
  };

  const getSubNavLinkClass = ({ isActive }) => {
    return `d-flex align-items-center gap-2 px-3 py-2 rounded-3 mb-1 text-decoration-none border-0 w-100 text-start btn border-0 outline-none shadow-none style-none transition-all ${
      isActive
        ? "text-primary bg-primary-subtle fw-medium"
        : "text-muted bg-transparent hover-bg-light"
    }`;
  };

  return (
    <>
      <div
        className="d-md-none bg-white border-bottom px-3 py-2 d-flex align-items-center justify-content-between position-fixed top-0 start-0 w-100"
        style={{ zIndex: 999, height: "60px" }}
      >
        <div className="fw-bold text-dark fs-5">Dashboard</div>
        <button
          className="btn btn-light border-0 p-2 hamburger-btn d-flex align-items-center justify-content-center rounded-3"
          onClick={() => setIsSidebarOpen(true)}
        >
          <FiMenu size={22} className="text-dark" />
        </button>
      </div>

      {isSidebarOpen && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-md-none"
          style={{
            backgroundColor: "rgba(0,0,0,0.4)",
            zIndex: 1040,
            backdropFilter: "blur(4px)",
          }}
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <aside
        className={`custom-sidebar border-end d-flex flex-column bg-white position-fixed top-0 start-0 h-100 p-3`}
        style={{ width: "260px", zIndex: 1050 }}
      >
        <div className="d-flex align-items-center justify-content-between px-2 py-3 mb-3 border-bottom">
          <div className="d-flex align-items-center gap-2">
            <div
              className="bg-primary rounded-3 text-white d-flex align-items-center justify-content-center fw-bold"
              style={{ width: "32px", height: "32px" }}
            >
              M
            </div>
            <span className="fw-bold text-dark fs-5 tracking-tight">
              MathGuru
            </span>
          </div>
          <button
            className="btn btn-light d-md-none border-0 rounded-circle p-2 d-flex align-items-center justify-content-center"
            onClick={() => setIsSidebarOpen(false)}
          >
            <FiX size={18} />
          </button>
        </div>

        <nav className="flex-grow-1 overflow-y-auto px-1 custom-scrollbar">
          <NavLink
            to="/dashboard"
            end
            className={getNavLinkClass}
            onClick={() => setIsSidebarOpen(false)}
          >
            <FaThLarge size={18} />
            <span className="fs-6">Dashboard</span>
          </NavLink>

          {(userRole === "admin" || userRole === "franchise") && (
            <>
              <NavLink
                to="/dashboard/products"
                className={getNavLinkClass}
                onClick={() => setIsSidebarOpen(false)}
              >
                <MdOutlineAddCircle size={18} />
                <span className="fs-6">Upload Product</span>
              </NavLink>

              <div>
                <button
                  type="button"
                  className="btn border-0 outline-none shadow-none d-flex align-items-center justify-content-between px-3 py-2.5 text-secondary w-100 mb-1 hover-bg-light transition-all text-start"
                  onClick={() => toggleSubbar("branches")}
                >
                  <div className="d-flex align-items-center gap-3">
                    <LuGitBranchPlus size={18} />
                    <span className="fs-6">Branch</span>
                  </div>
                  <LuChevronDown
                    size={16}
                    style={{
                      transition: "transform 0.2s",
                      transform: subbarVisibility.branches
                        ? "rotate(180deg)"
                        : "rotate(0)",
                    }}
                  />
                </button>
                <div
                  className={`ps-4 overflow-hidden transition-all ${subbarVisibility.branches ? "d-block mt-1 mb-2" : "d-none"}`}
                >
                  <NavLink
                    to="/dashboard/add-branch"
                    className={getSubNavLinkClass}
                    onClick={() => setIsSidebarOpen(false)}
                  >
                    <MdOutlineAddCircle size={14} />{" "}
                    <span style={{ fontSize: "0.9rem" }}>Add Branch</span>
                  </NavLink>
                  <NavLink
                    to="/dashboard/all-branches"
                    className={getSubNavLinkClass}
                    onClick={() => setIsSidebarOpen(false)}
                  >
                    <FaBuilding size={14} />{" "}
                    <span style={{ fontSize: "0.9rem" }}>All Branches</span>
                  </NavLink>
                </div>
              </div>

              <div>
                <button
                  type="button"
                  className="btn border-0 outline-none shadow-none d-flex align-items-center justify-content-between px-3 py-2.5 text-secondary w-100 mb-1 hover-bg-light transition-all text-start"
                  onClick={() => toggleSubbar("courses")}
                >
                  <div className="d-flex align-items-center gap-3">
                    <FaBook size={18} />
                    <span className="fs-6">Courses</span>
                  </div>
                  <LuChevronDown
                    size={16}
                    style={{
                      transition: "transform 0.2s",
                      transform: subbarVisibility.courses
                        ? "rotate(180deg)"
                        : "rotate(0)",
                    }}
                  />
                </button>
                <div
                  className={`ps-4 overflow-hidden transition-all ${subbarVisibility.courses ? "d-block mt-1 mb-2" : "d-none"}`}
                >
                  <NavLink
                    to="/dashboard/add-course"
                    className={getSubNavLinkClass}
                    onClick={() => setIsSidebarOpen(false)}
                  >
                    <MdOutlineAddCircle size={14} />{" "}
                    <span style={{ fontSize: "0.9rem" }}>Add Courses</span>
                  </NavLink>
                  <NavLink
                    to="/dashboard/all-courses"
                    className={getSubNavLinkClass}
                    onClick={() => setIsSidebarOpen(false)}
                  >
                    <FaBookOpen size={14} />{" "}
                    <span style={{ fontSize: "0.9rem" }}>All Courses</span>
                  </NavLink>
                </div>
              </div>

              <div>
                <button
                  type="button"
                  className="btn border-0 outline-none shadow-none d-flex align-items-center justify-content-between px-3 py-2.5 text-secondary w-100 mb-1 hover-bg-light transition-all text-start"
                  onClick={() => toggleSubbar("students")}
                >
                  <div className="d-flex align-items-center gap-3">
                    <FaUsers size={18} />
                    <span className="fs-6">Students</span>
                  </div>
                  <LuChevronDown
                    size={16}
                    style={{
                      transition: "transform 0.2s",
                      transform: subbarVisibility.students
                        ? "rotate(180deg)"
                        : "rotate(0)",
                    }}
                  />
                </button>
                <div
                  className={`ps-4 overflow-hidden transition-all ${subbarVisibility.students ? "d-block mt-1 mb-2" : "d-none"}`}
                >
                  <NavLink
                    to="/dashboard/student-admission"
                    className={getSubNavLinkClass}
                    onClick={() => setIsSidebarOpen(false)}
                  >
                    <IoPersonAdd size={14} />{" "}
                    <span style={{ fontSize: "0.9rem" }}>Admission Form</span>
                  </NavLink>
                  <NavLink
                    to="/dashboard/all-students"
                    className={getSubNavLinkClass}
                    onClick={() => setIsSidebarOpen(false)}
                  >
                    <FaChalkboardTeacher size={14} />{" "}
                    <span style={{ fontSize: "0.9rem" }}>All Students</span>
                  </NavLink>
                </div>
              </div>

              <NavLink
                to="/dashboard/enrolled-students"
                className={getNavLinkClass}
                onClick={() => setIsSidebarOpen(false)}
              >
                <PiStudentBold size={18} />
                <span className="fs-6">Enrolled Students</span>
              </NavLink>
            </>
          )}

          {userRole === "student" && (
            <>
              <NavLink
                to="/dashboard/my-courses"
                className={getNavLinkClass}
                onClick={() => setIsSidebarOpen(false)}
              >
                <FaBookOpen size={18} />
                <span className="fs-6">My Courses</span>
              </NavLink>
              <NavLink
                to="/dashboard/downloads"
                className={getNavLinkClass}
                onClick={() => setIsSidebarOpen(false)}
              >
                <FaFileDownload size={18} />
                <span className="fs-6">Downloads</span>
              </NavLink>
              <NavLink
                to="/dashboard/fees-history"
                className={getNavLinkClass}
                onClick={() => setIsSidebarOpen(false)}
              >
                <FaHistory size={18} />
                <span className="fs-6">Fees History</span>
              </NavLink>
              <NavLink
                to="/dashboard/studymat-order"
                className={getNavLinkClass}
                onClick={() => setIsSidebarOpen(false)}
              >
                <MdBorderColor size={18} />
                <span className="fs-6">Studymat Order</span>
              </NavLink>
              <NavLink
                to="/dashboard/order-history"
                className={getNavLinkClass}
                onClick={() => setIsSidebarOpen(false)}
              >
                <FaHistory size={18} />
                <span className="fs-6">Order History</span>
              </NavLink>
            </>
          )}
        </nav>

        <div className="mt-auto border-top pt-3 bg-white">
          <div className="d-flex align-items-center gap-2 p-2 rounded-3 bg-light mb-2">
            <div
              className="bg-secondary rounded-circle text-white d-flex align-items-center justify-content-center fw-medium text-uppercase"
              style={{ width: "38px", height: "38px", minWidth: "38px" }}
            >
              {userName.charAt(0)}
            </div>
            <div
              className="overflow-hidden text-start"
              style={{ lineHeight: "1.2" }}
            >
              <div
                className="fw-semibold text-dark text-truncate"
                style={{ fontSize: "0.85rem" }}
              >
                Hi, {userName}
              </div>
              <div
                className="text-muted text-truncate"
                style={{ fontSize: "0.75rem" }}
              >
                {userEmail}
              </div>
            </div>
          </div>

          <button
            type="button"
            className="btn btn-link w-100 d-flex align-items-center justify-content-center gap-2 text-danger text-decoration-none py-2 rounded-3 border-0 transition-all hover-bg-danger-subtle fw-medium shadow-none outline-none"
            onClick={handleLogout}
            style={{ fontSize: "0.95rem" }}
          >
            <LuLogOut size={16} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
      <style>{`
                .hover-bg-light:hover { background-color: #f8f9fa !important; color: #212529 !important; }
                .hover-bg-danger-subtle:hover { background-color: #f8d7da !important; color: #842029 !important; }
                .transition-all { transition: all 0.2s ease-in-out; }
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #e0e0e0; border-radius: 4px; }
                @media (max-width: 767.98px) {
                    .custom-sidebar {
                        transform: ${isSidebarOpen ? "translateX(0)" : "translateX(-100%)"};
                        transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    }
                }
                @media (min-width: 768px) {
                    .custom-sidebar { transform: translateX(0) !important; position: fixed !important; }
                }
            `}</style>
    </>
  );
};
export default UnifiedSidebar;
