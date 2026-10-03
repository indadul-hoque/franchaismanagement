import React, { useState, useEffect } from "react";
import { MdDelete, MdSearch, MdClear } from "react-icons/md";
import toast from "react-hot-toast";
import { useAuth } from "../../../../../context/AuthProvider";

export default function AllStudents() {
  const { students, fetchAllStudents, deleteStudent } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch students on mount
  useEffect(() => {
    const loadStudents = async () => {
      try {
        setLoading(true);
        await fetchAllStudents();
      } catch (error) {
        setError("Failed to load students profile list.");
        console.error("Fetch Students Error:", error);
      } finally {
        setLoading(false);
      }
    };

    loadStudents();
  }, [fetchAllStudents]);

  // Function to handle student deletion
  const handleDelete = async (studentId) => {
    if (
      !window.confirm(
        "Are you sure you want to completely remove this student record?",
      )
    )
      return;

    try {
      await deleteStudent(studentId);
      toast.success("Student registry deleted successfully!");
    } catch (error) {
      console.error("Delete Error:", error);
      toast.error("Failed to delete student records.");
    }
  };

  // Filter students based on search query (matches name or branch)
  const filteredStudents = students.filter((student) => {
    const name = student.studentName?.toLowerCase() || "";
    const branch = student.branch?.toLowerCase() || "general core";
    const query = searchQuery.toLowerCase();
    return name.includes(query) || branch.includes(query);
  });

  return (
    <div className="container-fluid py-4" style={{ maxWidth: "1200px" }}>
      {/* Dynamic Structural Style Configurations */}
      <style>{`
        .custom-card {
          background: #ffffff;
          border: 1px solid rgba(0, 0, 0, 0.05);
          border-radius: 16px;
          box-shadow: 0 4px 20px -2px rgba(0, 0, 0, 0.03);
          overflow: hidden;
        }
        .custom-table th {
          background-color: #f8fafc !important;
          color: #64748b !important;
          font-weight: 600;
          text-transform: uppercase;
          font-size: 0.75rem;
          letter-spacing: 0.05em;
          padding: 1rem 1.5rem !important;
          border-bottom: 1px solid #edf2f7;
        }
        .custom-table td {
          padding: 1.1rem 1.5rem !important;
          vertical-align: middle;
          color: #334155;
          font-size: 0.9rem;
          border-bottom: 1px solid #f1f5f9;
        }
        .custom-table tr:last-child td {
          border-bottom: none;
        }
        .custom-table tr {
          transition: background-color 0.2s ease;
        }
        .custom-table tr:hover {
          background-color: #f8fafc;
        }
        .btn-action-delete {
          width: 36px;
          height: 36px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 10px;
          background: #fff5f5;
          color: #ef4444;
          border: 1px solid #fee2e2;
          transition: all 0.2s ease;
        }
        .btn-action-delete:hover {
          background: #ef4444;
          color: #ffffff;
          box-shadow: 0 4px 12px rgba(239, 68, 68, 0.2);
          transform: translateY(-1px);
        }
        .badge-branch {
          background-color: #e0f2fe;
          color: #0369a1;
          font-weight: 500;
          padding: 0.35rem 0.75rem;
          border-radius: 8px;
          font-size: 0.8rem;
          display: inline-block;
        }
        .empty-state {
          padding: 4rem 2rem;
          text-align: center;
          background: #ffffff;
          border-radius: 16px;
          border: 1px dashed #e2e8f0;
        }
        .search-container {
          position: relative;
          max-width: 400px;
          width: 100%;
        }
        .search-icon {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: #94a3b8;
        }
        .clear-icon-btn {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: #94a3b8;
          padding: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }
        .clear-icon-btn:hover {
          color: #64748b;
        }
        .search-input {
          padding-left: 40px !important;
          padding-right: 36px !important;
          border-radius: 10px;
          border: 1px solid #cbd5e1;
          font-size: 0.9rem;
          height: 42px;
          transition: all 0.2s;
        }
        .search-input:focus {
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
        }
      `}</style>

      {/* Header Metric Bar */}
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-3 mb-4">
        <div>
          <h3 className="fw-bold text-dark mb-1">All Enrolled Students</h3>
          <p className="text-muted small mb-0">
            Manage student profiles, allocations, and administrative records.
          </p>
        </div>
        {!loading && students.length > 0 && (
          <div className="bg-white border rounded-3 px-3 py-2 shadow-sm d-flex align-items-center">
            <span className="text-secondary small fw-medium me-2">
              {searchQuery ? "Matches:" : "Total Directory:"}
            </span>
            <span className="badge bg-primary rounded-pill px-2.5 py-1.5 fw-semibold">
              {searchQuery ? filteredStudents.length : students.length}
            </span>
          </div>
        )}
      </div>

      {error && (
        <div
          className="alert alert-danger d-flex align-items-center border-0 rounded-3 shadow-sm mb-4"
          role="alert"
        >
          <span className="small fw-medium">{error}</span>
        </div>
      )}

      {/* Search Input Bar (Shown only when there are base records available) */}
      {!loading && students.length > 0 && (
        <div className="mb-4 d-flex justify-content-start">
          <div className="search-container">
            <MdSearch size={20} className="search-icon" />
            <input
              type="text"
              className="form-control search-input"
              placeholder="Search by student name or branch..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                className="clear-icon-btn"
                onClick={() => setSearchQuery("")}
                title="Clear search"
              >
                <MdClear size={18} />
              </button>
            )}
          </div>
        </div>
      )}

      {loading ? (
        /* Modern Skeleton Loader */
        <div className="custom-card p-4">
          <div className="placeholder-glow">
            <div
              className="placeholder col-12 mb-3 rounded"
              style={{ height: "45px", backgroundColor: "#f1f5f9" }}
            ></div>
            <div
              className="placeholder col-12 mb-2 rounded"
              style={{ height: "55px", opacity: 0.8 }}
            ></div>
            <div
              className="placeholder col-12 mb-2 rounded"
              style={{ height: "55px", opacity: 0.6 }}
            ></div>
            <div
              className="placeholder col-12 rounded"
              style={{ height: "55px", opacity: 0.4 }}
            ></div>
          </div>
        </div>
      ) : students.length > 0 ? (
        filteredStudents.length > 0 ? (
          /* Data Presentation Layout Table Card */
          <div className="custom-card">
            <div className="table-responsive">
              <table className="table custom-table mb-0">
                <thead>
                  <tr>
                    <th>Student Name</th>
                    <th>Assigned Branch</th>
                    <th>Admission Date</th>
                    <th className="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.map((student) => (
                    <tr key={student._id}>
                      <td>
                        <div className="d-flex align-items-center">
                          <div
                            className="rounded-circle bg-light d-flex align-items-center justify-content-center fw-bold text-primary me-3 shadow-sm"
                            style={{
                              width: "38px",
                              height: "38px",
                              minWidth: "38px",
                              fontSize: "0.9rem",
                              backgroundColor: "#f0fdf4",
                            }}
                          >
                            {student.studentName
                              ? student.studentName.charAt(0).toUpperCase()
                              : "?"}
                          </div>
                          <span className="fw-semibold text-dark">
                            {student.studentName}
                          </span>
                        </div>
                      </td>
                      <td>
                        <span className="badge-branch">
                          {student.branch || "General Core"}
                        </span>
                      </td>
                      <td>
                        <span className="text-secondary">
                          {student.addmissionDate
                            ? new Date(
                                student.addmissionDate,
                              ).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              })
                            : "Pending Entry"}
                        </span>
                      </td>
                      <td className="text-end">
                        <button
                          className="btn btn-action-delete"
                          onClick={() => handleDelete(student._id)}
                          title="Delete Profile Entry"
                        >
                          <MdDelete size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          /* Zero Results Search State */
          <div className="empty-state">
            <div className="text-muted mb-3" style={{ fontSize: "2.5rem" }}>
              🔍
            </div>
            <h5 className="fw-semibold text-dark mb-1">No Matching Results</h5>
            <p
              className="text-muted small mx-auto mb-0"
              style={{ maxWidth: "340px" }}
            >
              We couldn't find any student matching "
              <strong>{searchQuery}</strong>". Check your spelling or clear the
              filter.
            </p>
          </div>
        )
      ) : (
        /* Contemporary Empty Workspace State */
        <div className="empty-state">
          <div className="text-muted mb-3" style={{ fontSize: "2.5rem" }}>
            📭
          </div>
          <h5 className="fw-semibold text-dark mb-1">
            No Active Records Found
          </h5>
          <p
            className="text-muted small mx-auto mb-0"
            style={{ maxWidth: "340px" }}
          >
            There are currently no students matching this collection directory
            sequence. New records will appear here automatically.
          </p>
        </div>
      )}
    </div>
  );
}
