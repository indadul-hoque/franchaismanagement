import React, { useState } from "react";
import toast from "react-hot-toast";
import {
  FaTicketAlt,
  FaSearch,
  FaTimes,
  FaGraduationCap, // Changed from FaUserGrad
  FaBuilding,
  FaCodeBranch,
  FaExclamationCircle,
  FaCheckCircle,
  FaClock,
  FaComments,
  FaFilter,
  FaUser,
  FaFolder,
} from "react-icons/fa";

export default function SupportTicket() {
  const [searchQuery, setSearchQuery] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");
  const [userTypeFilter, setUserTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // Core Mock Datasets mapping realistic system cross-tier ticket matrices
  const [ticketsList, setTicketsList] = useState([
    {
      id: "TCK-4091-ST",
      senderName: "Rahul Verma",
      senderRole: "student",
      senderMeta: "Batch: M2-Fullstack • North Campus",
      category: "LMS Portal Issue",
      subject:
        "Unable to submit module assignment 4—throwing 502 Bad Gateway error",
      priority: "high",
      createdDate: "2026-07-17 09:30 AM",
      status: "open",
    },
    {
      id: "TCK-8821-BR",
      senderName: "East Corporate Node Office",
      senderRole: "branch",
      senderMeta: "Managed by Amit Sharma (Coordinator)",
      category: "Biometric Integration",
      subject:
        "Attendance hardware logs fail to sync with database servers automatically",
      priority: "critical",
      createdDate: "2026-07-16 04:15 PM",
      status: "open",
    },
    {
      id: "TCK-1102-FR",
      senderName: "Quantum Digital Academy",
      senderRole: "franchise",
      senderMeta: "Proprietor: Ananya Iyer",
      category: "Billing & Royalty Escrow",
      subject:
        "Disbursal gateway failing to extract invoice receipts for last batch payouts",
      priority: "high",
      createdDate: "2026-07-16 11:00 AM",
      status: "pending",
    },
    {
      id: "TCK-0551-ST",
      senderName: "Priyanka Das",
      senderRole: "student",
      senderMeta: "Batch: UIUX-09 • West Campus",
      category: "Profile Credentialing",
      subject:
        "Email verification link expires within 1 minute instead of standard 24 hours",
      priority: "medium",
      createdDate: "2026-07-15 02:20 PM",
      status: "resolved",
    },
  ]);

  const handleUpdateStatus = (id, newStatus) => {
    setTicketsList((prev) =>
      prev.map((ticket) =>
        ticket.id === id ? { ...ticket, status: newStatus } : ticket,
      ),
    );
    if (newStatus === "resolved") {
      toast.success(`Ticket ${id} has been marked as completed.`);
    } else {
      toast(`Ticket ${id} status updated to pending operations.`, {
        icon: "⏳",
      });
    }
  };

  const handleSearchTrigger = () => {
    setAppliedSearch(searchQuery);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setAppliedSearch("");
  };

  // Advanced Multi-Tier Filter Pipeline
  const filteredTickets = ticketsList.filter((ticket) => {
    const matchesUserType =
      userTypeFilter === "all" || ticket.senderRole === userTypeFilter;
    const matchesStatus =
      statusFilter === "all" || ticket.status === statusFilter;

    if (!appliedSearch.trim()) return matchesUserType && matchesStatus;

    const searchLower = appliedSearch.toLowerCase();
    return (
      matchesUserType &&
      matchesStatus &&
      (ticket.senderName.toLowerCase().includes(searchLower) ||
        ticket.subject.toLowerCase().includes(searchLower) ||
        ticket.category.toLowerCase().includes(searchLower) ||
        ticket.id.toLowerCase().includes(searchLower))
    );
  });

  // Dynamic Operational Analytics Counters
  const countOpen = ticketsList.filter((t) => t.status === "open").length;
  const countPending = ticketsList.filter((t) => t.status === "pending").length;

  return (
    <div className="container-fluid py-5 bg-ticket-smooth min-vh-100">
      {/* ── CENTRALIZED BANNER HEADER ──────────────────────────── */}
      <div className="card border-0 rounded-4 shadow-sm mb-4 bg-white overflow-hidden position-relative">
        <div className="accent-glow-strip"></div>
        <div className="card-body p-4">
          <div className="d-flex align-items-center gap-3">
            <div className="p-3 bg-dark text-white rounded-3 shadow-sm d-flex align-items-center justify-content-center">
              <FaTicketAlt size={24} />
            </div>
            <div>
              <h3 className="fw-black text-dark mb-1 tracking-tight">
                System Resolution Desk
              </h3>
              <p className="text-muted mb-0 small">
                Moderate infrastructure reports, verify user platform
                roadblocks, and dispatch support diagnostics cross-network.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── FILTER & METRICS COUNTER GRID ────────────────────── */}
      <div className="row g-3 mb-4">
        {["all", "franchise", "branch", "student"].map((role) => {
          const count = ticketsList.filter(
            (t) => role === "all" || t.senderRole === role,
          ).length;
          return (
            <div className="col-6 col-md-3" key={role}>
              <div
                className={`card border-0 rounded-4 shadow-sm p-3 cursor-pointer transition-all role-filter-card ${
                  userTypeFilter === role
                    ? "bg-dark text-white"
                    : "bg-white text-dark"
                }`}
                onClick={() => setUserTypeFilter(role)}
              >
                <div className="d-flex align-items-center justify-content-between">
                  <div className="d-flex align-items-center gap-2">
                    {role === "all" && (
                      <FaTicketAlt className="text-primary text-sm" />
                    )}
                    {role === "franchise" && (
                      <FaBuilding className="text-success text-sm" />
                    )}
                    {role === "branch" && (
                      <FaCodeBranch className="text-info text-sm" />
                    )}
                    {role === "student" && (
                      <FaGraduationCap className="text-warning text-sm" />
                    )}{" "}
                    <span className="text-xs fw-bold text-capitalize">
                      {role === "all" ? "All Tiers" : `${role}s`}
                    </span>
                  </div>
                  <span
                    className={`badge rounded-pill font-monospace text-xs ${userTypeFilter === role ? "bg-white text-dark" : "bg-light text-muted border"}`}
                  >
                    {count}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── CORE CONTROL ACTION BOX: FILTERS + EXPLICIT SEARCH ── */}
      <div className="card border-0 rounded-4 shadow-sm p-3 mb-4 bg-white">
        <div className="row g-3 align-items-center">
          {/* Status Segment Filters */}
          <div className="col-12 col-xl-6">
            <div className="d-flex flex-wrap gap-1.5 p-1 bg-light rounded-3 d-inline-flex w-100 w-sm-auto">
              {[
                { id: "all", label: "All Records" },
                { id: "open", label: `Active Open (${countOpen})` },
                { id: "pending", label: `Pending Ops (${countPending})` },
                { id: "resolved", label: "Archived Resolved" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  className={`btn btn-sm rounded-2 border-0 fw-bold px-3 py-1.5 text-xs transition-all ${
                    statusFilter === tab.id
                      ? "bg-white text-dark shadow-sm"
                      : "text-secondary"
                  }`}
                  onClick={() => setStatusFilter(tab.id)}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Explicit Search Bar Component Container */}
          <div className="col-12 col-xl-6">
            <div className="input-group">
              <div className="position-relative flex-grow-1">
                <input
                  type="text"
                  className="form-control border-light-subtle rounded-start-3 ps-5 pe-4 py-2 text-sm ticket-search-input w-100"
                  placeholder="Search context text, category keywords or ticket IDs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSearchTrigger();
                  }}
                  style={{
                    borderTopRightRadius: 0,
                    borderBottomRightRadius: 0,
                  }}
                />
                <div
                  className="position-absolute top-50 start-0 translate-middle-y ps-3 text-muted pointer-events-none"
                  style={{ zIndex: 5 }}
                >
                  <FaSearch size={13} />
                </div>
                {searchQuery && (
                  <button
                    type="button"
                    className="position-absolute top-50 end-0 translate-middle-y border-0 bg-transparent pe-3 text-muted"
                    style={{ zIndex: 5 }}
                    onClick={handleClearSearch}
                  >
                    <FaTimes size={12} />
                  </button>
                )}
              </div>
              <button
                className="btn btn-dark px-4 fw-bold text-sm rounded-end-3"
                type="button"
                onClick={handleSearchTrigger}
              >
                Search
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Target Search Tag Status Notification */}
      {appliedSearch && (
        <div className="mb-3 d-flex align-items-center gap-2">
          <span className="text-muted small">Active Query Target:</span>
          <span className="badge bg-dark-subtle text-dark border px-2.5 py-1.5 rounded-3 font-monospace d-inline-flex align-items-center gap-2 small">
            "{appliedSearch}"
            <FaTimes
              className="cursor-pointer text-secondary"
              onClick={handleClearSearch}
              size={10}
            />
          </span>
        </div>
      )}

      {/* ── TICKETS MAIN FLOW LAYOUT ─────────────────────────── */}
      <div className="row g-3">
        {filteredTickets.length === 0 ? (
          <div className="col-12">
            <div className="card text-center border-0 rounded-4 shadow-sm py-5 bg-white">
              <div className="card-body py-4">
                <div className="text-muted mb-3 opacity-20">
                  <FaTicketAlt size={48} />
                </div>
                <h5 className="fw-bold text-dark mb-1">Incident Board Clear</h5>
                <p className="text-muted small mb-0">
                  No network tickets match this specific architectural sorting
                  state context loop.
                </p>
              </div>
            </div>
          </div>
        ) : (
          filteredTickets.map((ticket) => (
            <div className="col-12" key={ticket.id}>
              <div className="card border rounded-4 shadow-sm bg-white overflow-hidden ticket-item-card transition-all">
                <div className="card-body p-4">
                  <div className="row align-items-start g-3">
                    {/* Left Column: Role Indicator Profile Node */}
                    <div className="col-12 col-md-3">
                      <div className="d-flex align-items-center gap-2.5 mb-2">
                        {ticket.senderRole === "franchise" && (
                          <span
                            className="role-pillar bg-success"
                            title="Franchise Account"
                          ></span>
                        )}
                        {ticket.senderRole === "branch" && (
                          <span
                            className="role-pillar bg-info"
                            title="Branch Area Account"
                          ></span>
                        )}
                        {ticket.senderRole === "student" && (
                          <span
                            className="role-pillar bg-warning"
                            title="Student User Profile"
                          ></span>
                        )}

                        <span
                          className={`badge font-monospace text-uppercase x-small px-2 py-1 rounded tracking-wide ${
                            ticket.senderRole === "franchise"
                              ? "bg-success bg-opacity-10 text-success border border-success-subtle"
                              : ticket.senderRole === "branch"
                                ? "bg-info bg-opacity-10 text-info border border-info-subtle"
                                : "bg-warning bg-opacity-10 text-warning border border-warning-subtle"
                          }`}
                        >
                          {ticket.senderRole} Source
                        </span>

                        <code className="text-muted font-monospace small ms-auto bg-light border px-1.5 rounded">
                          {ticket.id}
                        </code>
                      </div>

                      <h6 className="text-dark fw-bold mb-0 text-sm tracking-tight d-flex align-items-center gap-1.5">
                        <FaUser size={10} className="text-secondary" />{" "}
                        {ticket.senderName}
                      </h6>
                      <small className="text-muted d-block text-truncate text-xs mt-1">
                        {ticket.senderMeta}
                      </small>
                    </div>

                    {/* Middle Column: Detailed Core Query Narrative */}
                    <div className="col-12 col-md-6 border-start-md ps-md-4 border-end-md pe-md-4">
                      <div className="d-flex align-items-center gap-2 mb-1.5 flex-wrap">
                        <span className="badge bg-light text-dark border font-weight-semibold text-xs d-inline-flex align-items-center gap-1">
                          <FaFolder size={10} className="text-secondary" />{" "}
                          {ticket.category}
                        </span>
                        <span
                          className={`priority-dot-badge text-xs px-2 ${
                            ticket.priority === "critical"
                              ? "text-danger bg-danger bg-opacity-10"
                              : ticket.priority === "high"
                                ? "text-warning bg-warning bg-opacity-10"
                                : "text-secondary bg-light"
                          }`}
                        >
                          ● {ticket.priority} matrix
                        </span>
                      </div>

                      <p className="text-dark fw-semibold text-sm mb-2 line-height-base">
                        {ticket.subject}
                      </p>

                      <div className="text-muted font-monospace x-small d-flex align-items-center gap-1.5">
                        <FaClock size={10} /> Dispatched: {ticket.createdDate}
                      </div>
                    </div>

                    {/* Right Column: Dynamic Status Indicators & Trigger Controls */}
                    <div className="col-12 col-md-3 d-flex flex-md-column justify-content-between align-items-md-end h-100 gap-3 text-md-end ms-auto">
                      <div>
                        {ticket.status === "open" && (
                          <span className="badge-ticket-status bg-ticket-open text-danger">
                            <FaExclamationCircle size={11} className="me-1" />{" "}
                            Active Unresolved
                          </span>
                        )}
                        {ticket.status === "pending" && (
                          <span className="badge-ticket-status bg-ticket-pending text-warning">
                            <FaClock size={11} className="me-1" /> In
                            Diagnostics
                          </span>
                        )}
                        {ticket.status === "resolved" && (
                          <span className="badge-ticket-status bg-ticket-resolved text-success">
                            <FaCheckCircle size={11} className="me-1" /> Closed
                            / Resolved
                          </span>
                        )}
                      </div>

                      {ticket.status !== "resolved" ? (
                        <div className="d-inline-flex gap-1.5 mt-md-2">
                          {ticket.status === "open" && (
                            <button
                              type="button"
                              className="btn btn-sm btn-white border text-xs px-2.5 py-1.5 fw-bold rounded-2 transition-all"
                              onClick={() =>
                                handleUpdateStatus(ticket.id, "pending")
                              }
                            >
                              Hold Ops
                            </button>
                          )}
                          <button
                            type="button"
                            className="btn btn-sm btn-dark text-white fw-bold text-xs px-3 py-1.5 rounded-2 d-flex align-items-center gap-1.5 shadow-xs transition-all hover-lift"
                            onClick={() =>
                              handleUpdateStatus(ticket.id, "resolved")
                            }
                          >
                            <FaCheckCircle size={11} /> Resolve
                          </button>
                        </div>
                      ) : (
                        <span className="text-muted text-xs font-monospace d-inline-flex align-items-center gap-1">
                          <FaComments size={12} /> Log Logged
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Styled Scoping Layout Infrastructure */}
      <style>{`
        .bg-ticket-smooth { background-color: #f8fafc; }
        .fw-black { font-weight: 800; }
        .tracking-tight { letter-spacing: -0.025em; }
        .x-small { font-size: 0.65rem; letter-spacing: 0.05em; font-weight: 700; }
        .text-xs { font-size: 0.775rem; }
        .text-sm { font-size: 0.85rem; }
        .gap-1.5 { gap: 0.35rem; }
        .gap-2.5 { gap: 0.65rem; }
        .cursor-pointer { cursor: pointer; }
        .shadow-xs { box-shadow: 0 1px 2px rgba(0,0,0,0.05); }
        .line-height-base { line-height: 1.45; }

        .accent-glow-strip {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(90deg, #6366f1 0%, #3b82f6 100%);
        }

        .role-filter-card {
          border: 1px solid #e2e8f0 !important;
        }
        .role-filter-card:hover {
          transform: translateY(-2px);
        }

        .ticket-search-input:focus {
          border-color: #cbd5e1 !important;
          box-shadow: none !important;
        }

        .btn-white {
          background-color: #ffffff;
          border-color: #e2e8f0;
          color: #475569;
        }
        .btn-white:hover {
          background-color: #f8fafc;
          border-color: #cbd5e1;
        }

        /* Ticket Meta Indicators */
        .role-pillar {
          width: 6px;
          height: 14px;
          border-radius: 10px;
          display: inline-block;
        }

        .ticket-item-card {
          border-color: #f1f5f9 !important;
        }
        .ticket-item-card:hover {
          border-color: #cbd5e1 !important;
          box-shadow: 0 10px 25px rgba(0,0,0,0.03) !important;
        }

        .priority-dot-badge {
          font-weight: 700;
          border-radius: 4px;
          text-transform: uppercase;
          font-size: 0.65rem !important;
          letter-spacing: 0.02em;
        }

        .badge-ticket-status {
          display: inline-flex;
          align-items: center;
          padding: 0.35rem 0.65rem;
          font-size: 0.75rem;
          font-weight: 700;
          border-radius: 6px;
        }
        .bg-ticket-open { background-color: #fef2f2; border: 1px solid #fee2e2; }
        .bg-ticket-pending { background-color: #fffbeb; border: 1px solid #fef3c7; }
        .bg-ticket-resolved { background-color: #f0fdf4; border: 1px solid #dcfce7; }

        .transition-all { transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1); }
        .hover-lift:hover { transform: translateY(-1px); }

        @media(min-width: 768px) {
          .border-start-md { border-left: 1px solid #f1f5f9 !important; }
          .border-end-md { border-right: 1px solid #f1f5f9 !important; }
        }
      `}</style>
    </div>
  );
}
