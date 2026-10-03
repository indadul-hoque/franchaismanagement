import React, { useState } from "react";
import toast from "react-hot-toast";
import {
  FaWallet,
  FaArrowAltCircleUp,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaSearch,
  FaTimes,
  FaDownload,
  FaFilter,
  FaBuilding,
  FaUser,
  FaCoins,
} from "react-icons/fa";

export default function Payout() {
  const [searchQuery, setSearchQuery] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Core Mock Datasets mapping realistic system payouts
  const [payoutsList, setPayoutsList] = useState([
    {
      id: "PAY-2091-NX",
      franchiseName: "Apex Tech Training Node",
      proprietor: "Suresh Sharma",
      amount: 45000.0,
      accountDetails: "HDFC Bank •••• 9821",
      requestedDate: "2026-07-15",
      status: "pending",
    },
    {
      id: "PAY-4412-TR",
      franchiseName: "Quantum Digital Academy",
      proprietor: "Ananya Iyer",
      amount: 128500.0,
      accountDetails: "ICICI Bank •••• 4402",
      requestedDate: "2026-07-16",
      status: "pending",
    },
    {
      id: "PAY-1108-MK",
      franchiseName: "Vanguard Global Hub",
      proprietor: "Vikram Malhotra",
      amount: 62000.0,
      accountDetails: "SBI Bank •••• 1189",
      requestedDate: "2026-07-17",
      status: "pending",
    },
    {
      id: "PAY-0881-QP",
      franchiseName: "Horizon Skills Center",
      proprietor: "Rajesh Patel",
      amount: 89700.0,
      accountDetails: "Axis Bank •••• 0551",
      requestedDate: "2026-07-12",
      status: "completed",
    },
    {
      id: "PAY-0552-ZX",
      franchiseName: "Elite Matrix Ground",
      proprietor: "Karan Johar",
      amount: 15400.0,
      accountDetails: "PNB Bank •••• 3310",
      requestedDate: "2026-07-10",
      status: "failed",
    },
  ]);

  const handleProcessPayout = (id, newStatus) => {
    setPayoutsList((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: newStatus } : item,
      ),
    );

    const target = payoutsList.find((item) => item.id === id);
    if (newStatus === "completed") {
      toast.success(
        `Payout of ₹${target.amount.toLocaleString("en-IN")} approved successfully.`,
      );
    } else {
      toast.error(`Payout reference ${id} has been declined.`);
    }
  };

  const handleSearchTrigger = () => {
    setAppliedSearch(searchQuery);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setAppliedSearch("");
  };

  // Filter Engine Pipeline
  const filteredPayouts = payoutsList.filter((item) => {
    const matchesStatus =
      statusFilter === "all" || item.status === statusFilter;

    if (!appliedSearch.trim()) return matchesStatus;

    const searchLower = appliedSearch.toLowerCase();
    return (
      matchesStatus &&
      (item.franchiseName.toLowerCase().includes(searchLower) ||
        item.proprietor.toLowerCase().includes(searchLower) ||
        item.id.toLowerCase().includes(searchLower))
    );
  });

  // Dynamic Financial Metrics Calculators
  const totalProcessed = payoutsList
    .filter((p) => p.status === "completed")
    .reduce((sum, curr) => sum + curr.amount, 0);

  const totalPending = payoutsList
    .filter((p) => p.status === "pending")
    .reduce((sum, curr) => sum + curr.amount, 0);

  return (
    <div className="container-fluid py-5 bg-financial-smooth min-vh-100">
      {/* ── TOP HEADER SECTION ────────────────────────────────── */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <h3 className="fw-black text-dark tracking-tight mb-1">
            Payout Ledger Hub
          </h3>
          <p className="text-muted mb-0 small">
            Disburse earnings allocations, manage network balances, and track
            financial status logs.
          </p>
        </div>
        <button className="btn btn-white border rounded-3 fw-bold text-sm px-3 py-2 d-flex align-items-center gap-2 shadow-xs transition-all hover-lift">
          <FaDownload size={12} className="text-secondary" /> Export Statement
        </button>
      </div>

      {/* ── METRICS DASHBOARD ARCHITECTURE ───────────────────── */}
      <div className="row g-3 mb-4">
        {/* Total Volume Disbursed */}
        <div className="col-12 col-md-4">
          <div className="card border-0 rounded-4 shadow-sm bg-white p-4 position-relative overflow-hidden h-100">
            <div className="position-absolute top-0 end-0 p-3 opacity-10 text-success">
              <FaArrowAltCircleUp size={64} />
            </div>
            <small className="text-muted font-monospace text-uppercase x-small d-block mb-1">
              Settled Transfers
            </small>
            <h3 className="fw-black text-dark mb-1 font-monospace">
              ₹
              {totalProcessed.toLocaleString("en-IN", {
                minimumFractionDigits: 2,
              })}
            </h3>
            <span className="text-xs text-success fw-semibold">
              ✔ Clear ledger points
            </span>
          </div>
        </div>

        {/* Total Volume Processing Pipeline */}
        <div className="col-12 col-md-4">
          <div className="card border-0 rounded-4 shadow-sm bg-white p-4 position-relative overflow-hidden h-100">
            <div className="position-absolute top-0 end-0 p-3 opacity-10 text-warning">
              <FaClock size={64} />
            </div>
            <small className="text-muted font-monospace text-uppercase x-small d-block mb-1">
              Awaiting Authorization
            </small>
            <h3 className="fw-black text-dark mb-1 font-monospace">
              ₹
              {totalPending.toLocaleString("en-IN", {
                minimumFractionDigits: 2,
              })}
            </h3>
            <span className="text-xs text-warning fw-semibold">
              ⚡ Action required below
            </span>
          </div>
        </div>

        {/* Pool Counter Flag */}
        <div className="col-12 col-md-4">
          <div className="card border-0 rounded-4 shadow-sm bg-white p-4 position-relative overflow-hidden h-100">
            <div className="position-absolute top-0 end-0 p-3 opacity-10 text-primary">
              <FaWallet size={64} />
            </div>
            <small className="text-muted font-monospace text-uppercase x-small d-block mb-1">
              Active Batches
            </small>
            <h3 className="fw-black text-dark mb-1 font-monospace">
              {payoutsList.filter((p) => p.status === "pending").length} Nodes
            </h3>
            <span className="text-xs text-muted">
              Awaiting balance draw down settlement
            </span>
          </div>
        </div>
      </div>

      {/* ── SEARCH & FILTER SYSTEM ───────────────────────────── */}
      <div className="card border-0 rounded-4 shadow-sm p-3 mb-4 bg-white">
        <div className="row g-3 align-items-center">
          {/* Status Tab Filters */}
          <div className="col-12 col-xl-6">
            <div className="d-flex flex-wrap gap-1.5 p-1 bg-light rounded-3 d-inline-flex w-100 w-sm-auto">
              {["all", "pending", "completed", "failed"].map((tab) => (
                <button
                  key={tab}
                  className={`btn btn-sm rounded-2 border-0 fw-bold px-3 py-1.5 text-xs text-capitalize transition-all ${
                    statusFilter === tab
                      ? "bg-white text-dark shadow-sm"
                      : "text-secondary"
                  }`}
                  onClick={() => setStatusFilter(tab)}
                >
                  {tab === "all" ? "All Transactions" : tab}
                </button>
              ))}
            </div>
          </div>

          {/* Explicit Intentional Search Component */}
          <div className="col-12 col-xl-6">
            <div className="input-group">
              <div className="position-relative flex-grow-1">
                <input
                  type="text"
                  className="form-control border-light-subtle rounded-start-3 ps-5 pe-4 py-2 text-sm financial-search-input w-100"
                  placeholder="Search by franchise, proprietor or payout token ID..."
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

      {/* Query Status Active Tags */}
      {appliedSearch && (
        <div className="mb-3 d-flex align-items-center gap-2">
          <span className="text-muted small">Filtering token keyword:</span>
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

      {/* ── TRANSACTIONS DATATABLE GRID ──────────────────────── */}
      <div className="card border-0 rounded-4 shadow-sm bg-white overflow-hidden">
        <div className="table-responsive">
          <table className="table align-middle mb-0 custom-financial-table">
            <thead>
              <tr>
                <th className="ps-4 font-monospace text-uppercase text-muted x-small">
                  Transaction ID
                </th>
                <th className="font-monospace text-uppercase text-muted x-small">
                  Recipient/Franchise
                </th>
                <th className="font-monospace text-uppercase text-muted x-small">
                  Date Requested
                </th>
                <th className="font-monospace text-uppercase text-muted x-small">
                  Destination Account
                </th>
                <th className="font-monospace text-uppercase text-muted x-small text-end">
                  Amount
                </th>
                <th className="font-monospace text-uppercase text-muted x-small text-center">
                  Status
                </th>
                <th className="pe-4 font-monospace text-uppercase text-muted x-small text-end">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredPayouts.length === 0 ? (
                <tr>
                  <td
                    colSpan="7"
                    className="text-center py-5 text-muted bg-white"
                  >
                    <div className="opacity-25 mb-2">
                      <FaCoins size={36} />
                    </div>
                    <span className="text-sm fw-medium">
                      No matching payout records located inside this balance
                      filter state.
                    </span>
                  </td>
                </tr>
              ) : (
                filteredPayouts.map((payout) => (
                  <tr key={payout.id}>
                    {/* Token ID */}
                    <td className="ps-4">
                      <code className="font-monospace text-dark bg-light px-2 py-1 border rounded text-xs fw-bold">
                        {payout.id}
                      </code>
                    </td>

                    {/* Enterprise Meta */}
                    <td>
                      <div className="d-flex align-items-center gap-2.5">
                        <div className="p-2 bg-light text-primary rounded-2 d-flex">
                          <FaBuilding size={13} />
                        </div>
                        <div>
                          <div className="text-dark fw-bold text-sm tracking-tight">
                            {payout.franchiseName}
                          </div>
                          <div className="text-muted text-xs d-flex align-items-center gap-1">
                            <FaUser size={10} /> {payout.proprietor}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Date */}
                    <td>
                      <span className="text-secondary text-sm font-monospace">
                        {payout.requestedDate}
                      </span>
                    </td>

                    {/* Bank Coordinates */}
                    <td>
                      <span className="text-dark text-sm fw-medium font-monospace">
                        {payout.accountDetails}
                      </span>
                    </td>

                    {/* Amount */}
                    <td className="text-end">
                      <span className="text-dark fw-black text-sm font-monospace">
                        ₹
                        {payout.amount.toLocaleString("en-IN", {
                          minimumFractionDigits: 2,
                        })}
                      </span>
                    </td>

                    {/* Badge Status */}
                    <td className="text-center">
                      {payout.status === "pending" && (
                        <span className="badge-ledger-pill bg-payout-warning text-warning">
                          Pending Auth
                        </span>
                      )}
                      {payout.status === "completed" && (
                        <span className="badge-ledger-pill bg-payout-success text-success">
                          Settled
                        </span>
                      )}
                      {payout.status === "failed" && (
                        <span className="badge-ledger-pill bg-payout-danger text-danger">
                          Declined
                        </span>
                      )}
                    </td>

                    {/* Action Disbursal System */}
                    <td className="pe-4 text-end">
                      {payout.status === "pending" ? (
                        <div className="d-inline-flex gap-1.5">
                          <button
                            type="button"
                            className="btn btn-sm btn-action-decline border transition-all"
                            onClick={() =>
                              handleProcessPayout(payout.id, "failed")
                            }
                            title="Decline Payout"
                          >
                            <FaTimesCircle size={14} />
                          </button>
                          <button
                            type="button"
                            className="btn btn-sm btn-dark text-white fw-bold text-xs px-2.5 py-1.5 rounded-2 shadow-xs transition-all hover-lift"
                            onClick={() =>
                              handleProcessPayout(payout.id, "completed")
                            }
                          >
                            Approve
                          </button>
                        </div>
                      ) : (
                        <span className="text-muted text-xs font-monospace italic">
                          Processed
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Styled Scoping Layout Overrides */}
      <style>{`
        .bg-financial-smooth { background-color: #f8fafc; }
        .fw-black { font-weight: 800; }
        .tracking-tight { letter-spacing: -0.02em; }
        .x-small { font-size: 0.65rem; letter-spacing: 0.05em; font-weight: 700; }
        .text-xs { font-size: 0.775rem; }
        .text-sm { font-size: 0.85rem; }
        .gap-1.5 { gap: 0.35rem; }
        .gap-2.5 { gap: 0.65rem; }
        .cursor-pointer { cursor: pointer; }
        .shadow-xs { box-shadow: 0 1px 2px rgba(0,0,0,0.05); }

        .btn-white {
          background-color: #ffffff;
          border-color: #e2e8f0;
          color: #334155;
        }
        .btn-white:hover {
          background-color: #f8fafc;
          border-color: #cbd5e1;
        }

        .financial-search-input:focus {
          border-color: #cbd5e1 !important;
          box-shadow: none !important;
        }

        /* High-fidelity table overrides */
        .custom-financial-table thead th {
          background-color: #fafafa;
          border-bottom: 1px solid #f1f5f9;
          padding: 1rem 0.75rem;
        }
        .custom-financial-table tbody td {
          padding: 1.1rem 0.75rem;
          border-bottom: 1px solid #f1f5f9;
        }
        .custom-financial-table tbody tr:hover td {
          background-color: #fcfcfc;
        }

        /* Pill System design variations */
        .badge-ledger-pill {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 0.35rem 0.75rem;
          font-size: 0.75rem;
          font-weight: 700;
          border-radius: 6px;
        }
        .bg-payout-warning { background-color: #fffbeb; border: 1px solid #fef3c7; }
        .bg-payout-success { background-color: #f0fdf4; border: 1px solid #dcfce7; }
        .bg-payout-danger { background-color: #fef2f2; border: 1px solid #fee2e2; }

        .btn-action-decline {
          background-color: #ffffff;
          color: #ef4444;
          border-color: #fee2e2;
          padding: 0.35rem 0.5rem;
          border-radius: 6px;
        }
        .btn-action-decline:hover {
          background-color: #fef2f2;
          border-color: #fca5a5;
        }

        .transition-all { transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1); }
        .hover-lift:hover { transform: translateY(-1px); }
      `}</style>
    </div>
  );
}
