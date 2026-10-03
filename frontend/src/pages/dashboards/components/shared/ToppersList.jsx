import React, { useState } from "react";
import {
  FaEllipsisV,
  FaSearch,
  FaCreditCard,
  FaCheckCircle,
  FaExclamationCircle,
} from "react-icons/fa";
import { useAuth } from "../../../../context/AuthProvider";

const ToppersList = ({ handlePay }) => {
  const { students = [] } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");

  // Extracts student initials dynamically for a premium visual fallback placeholder
  const getInitials = (name) => {
    if (!name) return "ST";
    return name
      .split(" ")
      .map((word) => word[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  // Filter students by name or branch inline as the user types
  const filteredStudents = students.filter((student) => {
    const nameMatch = student.studentName
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());
    const branchMatch = student.branch
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());
    return nameMatch || branchMatch;
  });

  // Dynamic stats aggregation for the dashboard footer summary
  const totalStudents = students.length;
  const paidCount = students.filter(
    (s) => s.paymentStatus?.toLowerCase() === "paid",
  ).length;
  const pendingCount = totalStudents - paidCount;

  return (
    <div
      className="card border-1 border-light shadow-sm"
      style={{ borderRadius: "16px", overflow: "hidden" }}
    >
      {/* Header / Actions Panel */}
      <div className="card-header bg-white border-bottom border-light p-4">
        <div className="row g-3 align-items-center justify-content-between">
          <div className="col-12 col-md-6">
            <h5
              className="mb-1 fw-bold text-dark"
              style={{ letterSpacing: "-0.5px" }}
            >
              Students Directory
            </h5>
            <p className="text-muted mb-0 small">
              Manage admissions, branch allocation, and account balances
            </p>
          </div>

          {/* Dynamic Filters */}
          <div className="col-12 col-md-5 col-lg-4">
            <div className="d-flex align-items-center gap-2">
              <div
                className="input-group flex-grow-1"
                style={{ borderRadius: "8px", overflow: "hidden" }}
              >
                <span className="input-group-text bg-light border-end-0 text-muted px-3">
                  <FaSearch size={14} />
                </span>
                <input
                  type="text"
                  placeholder="Search by name or branch..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="form-control bg-light border-start-0 py-2 text-dark shadow-none"
                  style={{ fontSize: "14px", border: "1px solid #dee2e6" }}
                />
              </div>
              <button
                type="button"
                className="btn btn-light d-flex align-items-center justify-content-center border"
                style={{ width: "38px", height: "38px", borderRadius: "8px" }}
              >
                <FaEllipsisV className="text-secondary" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Responsive Table Canvas */}
      <div className="table-responsive">
        <table
          className="table table-hover align-middle mb-0"
          style={{ minWidth: "600px" }}
        >
          <thead className="table-light">
            <tr className="border-bottom border-light">
              <th
                className="px-4 py-3 text-secondary text-uppercase fw-semibold"
                style={{ fontSize: "11px", letterSpacing: "0.5px" }}
              >
                Student Profile
              </th>
              <th
                className="px-4 py-3 text-secondary text-uppercase fw-semibold"
                style={{ fontSize: "11px", letterSpacing: "0.5px" }}
              >
                Branch
              </th>
              <th
                className="px-4 py-3 text-secondary text-uppercase fw-semibold"
                style={{ fontSize: "11px", letterSpacing: "0.5px" }}
              >
                Status
              </th>
              <th
                className="px-4 py-3 text-secondary text-uppercase fw-semibold text-end"
                style={{ fontSize: "11px", letterSpacing: "0.5px" }}
              >
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.length > 0 ? (
              filteredStudents.map((student) => {
                const isPaid = student.paymentStatus?.toLowerCase() === "paid";

                return (
                  <tr key={student._id} className="border-bottom border-light">
                    {/* Profile Identity Data */}
                    <td className="px-4 py-3">
                      <div className="d-flex align-items-center gap-3">
                        <div
                          className="d-flex align-items-center justify-content-center rounded-circle fw-bold text-center border"
                          style={{
                            width: "38px",
                            height: "38px",
                            fontSize: "12px",
                            letterSpacing: "0.5px",
                            backgroundColor: isPaid ? "#e8f5e9" : "#fff8e1",
                            color: isPaid ? "#2e7d32" : "#f57f17",
                            borderColor: isPaid ? "#c8e6c9" : "#ffecb3",
                          }}
                        >
                          {getInitials(student.studentName)}
                        </div>
                        <div>
                          <p
                            className="fw-semibold text-dark mb-0"
                            style={{ fontSize: "14px" }}
                          >
                            {student.studentName || "Unnamed Student"}
                          </p>
                          <small
                            className="text-muted font-monospace"
                            style={{ fontSize: "11px" }}
                          >
                            ID:{" "}
                            {student._id
                              ? student._id.slice(-6).toUpperCase()
                              : "N/A"}
                          </small>
                        </div>
                      </div>
                    </td>

                    {/* Assigned Branch Location */}
                    <td className="px-4 py-3">
                      <span
                        className="fw-medium text-secondary"
                        style={{ fontSize: "14px" }}
                      >
                        {student.branch || (
                          <span className="text-muted fst-italic fw-normal">
                            Not Assigned
                          </span>
                        )}
                      </span>
                    </td>

                    {/* Status Dynamic Pill Badges */}
                    <td className="px-4 py-3">
                      <span
                        className={`badge rounded-pill d-inline-flex align-items-center gap-1.5 px-3 py-1.5 fw-bold`}
                        style={{
                          fontSize: "12px",
                          backgroundColor: isPaid ? "#e8f5e9" : "#ffebee",
                          color: isPaid ? "#2e7d32" : "#c62828",
                        }}
                      >
                        {isPaid ? (
                          <>
                            <FaCheckCircle size={12} />
                            Paid
                          </>
                        ) : (
                          <>
                            <FaExclamationCircle
                              size={12}
                              className="text-danger"
                            />
                            Unpaid
                          </>
                        )}
                      </span>
                    </td>

                    {/* Action Engine */}
                    <td className="px-4 py-3 text-end">
                      {isPaid ? (
                        <button
                          disabled
                          className="btn btn-light border px-3 py-1.5 text-muted fw-semibold"
                          style={{
                            fontSize: "12px",
                            borderRadius: "8px",
                            cursor: "not-allowed",
                          }}
                        >
                          Settled
                        </button>
                      ) : (
                        <button
                          onClick={() => handlePay(student)}
                          className="btn btn-primary d-inline-flex align-items-center gap-1.5 px-3 py-1.5 fw-semibold shadow-sm"
                          style={{
                            fontSize: "12px",
                            borderRadius: "8px",
                            backgroundColor: "#4f46e5",
                            borderColor: "#4f46e5",
                          }}
                        >
                          <FaCreditCard size={12} />
                          Collect Fee
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="4" className="px-4 py-5 text-center">
                  <p className="text-muted fw-medium mb-0 small">
                    No student listings matched your criteria.
                  </p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Live Reporting Footer Area */}
      <div
        className="card-footer bg-white border-top border-light px-4 py-3 text-muted"
        style={{ fontSize: "12px" }}
      >
        <div className="row g-2 align-items-center justify-content-between">
          <div className="col-12 col-sm-auto text-center text-sm-start">
            Showing {filteredStudents.length} of {totalStudents} global accounts
          </div>
          <div className="col-12 col-sm-auto d-flex justify-content-center gap-3">
            <span>
              Paid:{" "}
              <strong className="text-success fw-bold">{paidCount}</strong>
            </span>
            <span>
              Pending Balance:{" "}
              <strong className="text-danger fw-bold">{pendingCount}</strong>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ToppersList;
