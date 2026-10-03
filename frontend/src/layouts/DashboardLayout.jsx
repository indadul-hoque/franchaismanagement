import React, { Suspense } from "react";
import { Outlet, Link } from "react-router-dom";
import { Spinner } from "react-bootstrap";
import { FaSearch, FaBell } from "react-icons/fa";
import { useAuth } from "../context/AuthProvider";
import Sidebar from "../components/Sidebar";
import { roleMeta } from "../config/navigation";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const DashboardLayout = () => {
  const { userRole, logout } = useAuth();
  const navigate = useNavigate();

  // Get email from localStorage (stored on login)
  const storedUser = JSON.parse(localStorage.getItem("student") || "{}");
  const userEmail = storedUser.email || "";
  const userName = storedUser.firstName || userEmail.split("@")[0] || "User";

  const meta = roleMeta[userRole] || roleMeta.student;

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    setTimeout(() => navigate("/login"), 1200);
  };

  return (
    <div
      className="d-flex"
      style={{ minHeight: "100vh", backgroundColor: "#f8fafc" }}
    >
      {/* ── Scoped Layout Styles ──────────────────────────────────────── */}
      <style>{`
        /* Content area pushed to the right of sidebar on desktop */
        @media (min-width: 768px) {
          .dashboard-canvas { padding-left: 260px; }
        }
        /* Content area has full width on mobile (sidebar overlays) */
        @media (max-width: 767.98px) {
          .dashboard-canvas { padding-left: 0; padding-top: 60px; }
        }

        /* Top header bar */
        .dashboard-topbar {
          background: rgba(255,255,255,0.96);
          backdrop-filter: blur(10px);
          border-bottom: 1px solid #eef0f3;
          height: 68px;
        }

        /* Main scrollable page area */
        .dashboard-page-area {
          flex: 1;
          overflow-y: auto;
          padding: 1.75rem;
        }

        /* Search input */
        .topbar-search-input {
          background: #f4f6f8;
          border: none;
          border-radius: 10px;
          font-size: 13.5px;
          padding: 0.5rem 1rem 0.5rem 2.5rem;
          transition: background 0.2s;
          outline: none;
          color: #334155;
        }
        .topbar-search-input:focus { background: #e9ecef; }

        /* Notification bell */
        .topbar-bell-btn {
          width: 38px; height: 38px;
          background: #f4f6f8;
          border: none;
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          transition: background 0.2s;
          cursor: pointer;
        }
        .topbar-bell-btn:hover { background: #e2e8f0; }

        /* Page area scrollbar */
        .dashboard-page-area::-webkit-scrollbar { width: 5px; }
        .dashboard-page-area::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 4px; }

        .stat-card {
          transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.25s ease;
          border-radius: 16px !important;
        }
        .stat-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 20px -5px rgba(0,0,0,0.08) !important;
        }
      `}</style>

      {/* ── Sidebar ─────────────────────────────────────────────────── */}
      <Sidebar role={userRole} userEmail={userEmail} onLogout={handleLogout} />

      {/* ── Main Canvas ─────────────────────────────────────────────── */}
      <div className="dashboard-canvas d-flex flex-column w-100">
        {/* Top Header Bar */}
        <header className="dashboard-topbar sticky-top d-flex align-items-center px-4 gap-3">
          {/* Search Box */}
          <div
            className="position-relative flex-grow-1"
            style={{ maxWidth: "360px" }}
          >
            <FaSearch
              size={13}
              className="text-muted position-absolute top-50 translate-middle-y"
              style={{ left: "12px" }}
            />
            <input
              type="text"
              className="topbar-search-input w-100"
              placeholder="Search anything…"
            />
          </div>

          {/* Right-side actions */}
          <div className="d-flex align-items-center gap-3 ms-auto">
            {/* Notification Bell */}
            <button
              className="topbar-bell-btn position-relative"
              title="Notifications"
            >
              <FaBell size={15} className="text-slate-500" />
              {/* Unread dot */}
              <span
                className="position-absolute bg-danger border border-white rounded-circle"
                style={{
                  width: "8px",
                  height: "8px",
                  top: "8px",
                  right: "8px",
                }}
              />
            </button>

            {/* Profile Avatar + Role chip */}
            <Link
              to="/"
              className="d-none d-md-flex align-items-center gap-2 text-decoration-none px-2 py-1 rounded-3 bg-light"
            >
              <div
                className="rounded-circle text-white d-flex align-items-center justify-content-center fw-bold flex-shrink-0"
                style={{
                  width: "32px",
                  height: "32px",
                  backgroundColor: meta.color,
                  fontSize: "13px",
                }}
              >
                {userName.charAt(0).toUpperCase()}
              </div>
              <div className="lh-1">
                <div
                  className="fw-semibold text-dark"
                  style={{ fontSize: "12.5px" }}
                >
                  {userName}
                </div>
                <div
                  className="badge rounded-pill"
                  style={{
                    fontSize: "9px",
                    backgroundColor: meta.bg,
                    color: meta.color,
                    fontWeight: 700,
                  }}
                >
                  {meta.label}
                </div>
              </div>
            </Link>
          </div>
        </header>

        {/* ── Page Content via Outlet ──────────────────────────────── */}
        <main className="dashboard-page-area">
          <Suspense
            fallback={
              <div
                className="d-flex justify-content-center align-items-center"
                style={{ minHeight: "40vh" }}
              >
                <Spinner animation="grow" variant="primary" />
              </div>
            }
          >
            <Outlet />
          </Suspense>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
