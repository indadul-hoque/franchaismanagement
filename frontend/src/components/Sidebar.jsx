import React, { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi";
import { LuLogOut } from "react-icons/lu";
import { navigationConfig, roleMeta } from "../config/navigation";

const Sidebar = ({ role, userEmail, onLogout }) => {
  const location = useLocation();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Resolve nav items and role metadata from config
  const navItems = navigationConfig[role] || [];
  const meta = roleMeta[role] || roleMeta.student;

  // Derive a friendly display name from the email
  const userName = (userEmail || "").split("@")[0] || "User";

  // Auto-close the mobile drawer when route changes
  useEffect(() => {
    setIsMobileOpen(false);
  }, [location.pathname]);

  // Close drawer when clicking outside
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (
        isMobileOpen &&
        !e.target.closest(".edu-sidebar") &&
        !e.target.closest(".hamburger-toggle")
      ) {
        setIsMobileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [isMobileOpen]);

  return (
    <>
      {/* ─── Mobile Top Bar (Only on sm screens) ─────────────────── */}
      <div
        className="d-flex d-md-none align-items-center justify-content-between bg-white border-bottom px-3 position-fixed top-0 start-0 w-100"
        style={{ height: "60px", zIndex: 998 }}
      >
        <div className="d-flex align-items-center gap-2">
          <div
            className="rounded-3 text-white d-flex align-items-center justify-content-center fw-black"
            style={{
              width: "30px",
              height: "30px",
              backgroundColor: meta.color,
              fontSize: "13px",
            }}
          >
            E
          </div>
          <span className="fw-bold text-dark">EduSathi</span>
        </div>
        <button
          className="btn btn-light border-0 p-2 hamburger-toggle"
          onClick={() => setIsMobileOpen(true)}
        >
          <FiMenu size={22} />
        </button>
      </div>

      {/* ─── Mobile Backdrop ──────────────────────────────────────── */}
      {isMobileOpen && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-md-none"
          style={{
            backgroundColor: "rgba(15,23,42,0.4)",
            zIndex: 1040,
            backdropFilter: "blur(4px)",
          }}
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* ─── Sidebar Panel ────────────────────────────────────────── */}
      <aside
        className={`edu-sidebar d-flex flex-column bg-white border-end position-fixed top-0 start-0 h-100${isMobileOpen ? " edu-sidebar--open" : ""}`}
        style={{ width: "260px", zIndex: 1050 }}
      >
        {/* Brand Header */}
        <div className="px-4 py-4 border-bottom d-flex align-items-center justify-content-between flex-shrink-0">
          <div className="d-flex align-items-center gap-3">
            <div
              className="rounded-3 text-white d-flex align-items-center justify-content-center fw-black"
              style={{
                width: "38px",
                height: "38px",
                backgroundColor: meta.color,
                fontSize: "16px",
              }}
            >
              E
            </div>
            <div>
              <p
                className="fw-bold text-dark mb-0 lh-1"
                style={{ fontSize: "15px" }}
              >
                EduSathi
              </p>
              {/* Color-coded Role Badge */}
              <span
                className="badge rounded-pill mt-1 d-inline-block"
                style={{
                  fontSize: "10px",
                  fontWeight: 700,
                  backgroundColor: meta.bg,
                  color: meta.color,
                  letterSpacing: "0.5px",
                }}
              >
                {meta.label}
              </span>
            </div>
          </div>
          {/* Close button — only visible on mobile */}
          <button
            className="btn btn-light d-md-none border-0 p-2 rounded-circle"
            onClick={() => setIsMobileOpen(false)}
          >
            <FiX size={16} />
          </button>
        </div>

        {/* ─── Navigation Links ──────────────────────────────────── */}
        <nav className="flex-grow-1 px-2 py-3" style={{ overflowY: "auto" }}>
          <ul className="list-unstyled mb-0">
            {navItems.map((item) => {
              const Icon = item.icon;
              // Active state: exact match OR starts with path (for nested pages)
              const isActive =
                location.pathname === item.path ||
                location.pathname.startsWith(item.path + "/");

              return (
                <li key={item.path} className="mb-1">
                  <NavLink
                    to={item.path}
                    end={item.path.endsWith("/dashboard")}
                    style={{ textDecoration: "none" }}
                  >
                    {({ isActive: navActive }) => (
                      <div
                        className="d-flex align-items-center gap-3 px-3 py-2 rounded-3 edu-nav-item"
                        style={{
                          backgroundColor: navActive
                            ? meta.color
                            : "transparent",
                          color: navActive ? "#fff" : "#64748b",
                          fontSize: "13.5px",
                          fontWeight: navActive ? 600 : 400,
                          transition: "all 0.18s ease",
                          cursor: "pointer",
                        }}
                        data-bg={navActive ? "" : meta.bg}
                        data-active={navActive ? "1" : "0"}
                      >
                        {/* Nav Icon */}
                        <Icon
                          size={16}
                          style={{
                            opacity: navActive ? 1 : 0.65,
                            flexShrink: 0,
                          }}
                        />

                        {/* Nav Label */}
                        <span className="flex-grow-1">{item.label}</span>

                        {/* Optional badge (e.g. "Live") */}
                        {item.badge && (
                          <span
                            className="badge rounded-pill"
                            style={{
                              fontSize: "9px",
                              fontWeight: 700,
                              backgroundColor: navActive
                                ? "rgba(255,255,255,0.25)"
                                : meta.bg,
                              color: navActive ? "#fff" : meta.color,
                              letterSpacing: "0.3px",
                            }}
                          >
                            {item.badge}
                          </span>
                        )}
                      </div>
                    )}
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* ─── Profile + Logout Footer ───────────────────────────── */}
        <div className="border-top px-3 py-3 flex-shrink-0">
          {/* Profile Row */}
          <div className="d-flex align-items-center gap-2 p-2 rounded-3 bg-light mb-2">
            <div
              className="rounded-circle text-white d-flex align-items-center justify-content-center fw-bold text-uppercase flex-shrink-0"
              style={{
                width: "36px",
                height: "36px",
                backgroundColor: meta.color,
                fontSize: "13px",
                minWidth: "36px",
              }}
            >
              {userName.charAt(0)}
            </div>
            <div className="overflow-hidden">
              <div
                className="fw-semibold text-dark text-truncate"
                style={{ fontSize: "12.5px", lineHeight: 1.3 }}
              >
                {userName}
              </div>
              <div
                className="text-muted text-truncate"
                style={{ fontSize: "11px" }}
              >
                {userEmail}
              </div>
            </div>
          </div>

          {/* Logout Button */}
          <button
            className="btn w-100 d-flex align-items-center justify-content-center gap-2 text-danger border-0 rounded-3 py-2 fw-medium edu-logout-btn"
            style={{ fontSize: "13.5px" }}
            onClick={onLogout}
          >
            <LuLogOut size={15} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* ─── Scoped Styles ─────────────────────────────────────────── */}
      <style>{`
        /* Mobile: hidden by default, slides in when --open */
        @media (max-width: 767.98px) {
          .edu-sidebar {
            transform: translateX(-100%);
            transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          }
          .edu-sidebar.edu-sidebar--open {
            transform: translateX(0);
          }
        }

        /* Desktop: always visible */
        @media (min-width: 768px) {
          .edu-sidebar {
            transform: translateX(0) !important;
          }
        }

        /* Hover effect on non-active nav items */
        .edu-nav-item:hover {
          background-color: var(--edu-sidebar-hover-bg, #f1f5f9) !important;
          color: #334155 !important;
        }

        /* Logout hover */
        .edu-logout-btn:hover {
          background-color: #fef2f2 !important;
        }

        /* Custom scrollbar for nav */
        .edu-sidebar nav::-webkit-scrollbar { width: 3px; }
        .edu-sidebar nav::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 4px; }
      `}</style>
    </>
  );
};

export default Sidebar;
