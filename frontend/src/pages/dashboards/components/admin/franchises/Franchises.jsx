import React, { useState, useMemo, useEffect } from "react";
import {
  FiPlus,
  FiSearch,
  FiHome,
  FiCheckCircle,
  FiClock,
  FiSlash,
  FiEye,
  FiEdit,
  FiTrash2,
  FiShield,
  FiAlertTriangle,
  FiFolder,
} from "react-icons/fi";
import FranchiseRegistration from "./FranchiseRegistration";
import { useAuth } from "../../../../../context/AuthProvider";

export default function Franchises() {
  const { fetchFranchiseeCenters, franchiseeCenters = [] } = useAuth();
  // Safely guard against initial undefined context state
  const centersList = useMemo(
    () => (Array.isArray(franchiseeCenters) ? franchiseeCenters : []),
    [franchiseeCenters],
  );

  // Filters & Sorting State
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [cityFilter, setCityFilter] = useState("All");
  const [sortBy, setSortBy] = useState("newest");

  // Modal Control States
  const [showFormModal, setShowFormModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedFranchise, setSelectedFranchise] = useState(null);
  const [formMode, setFormMode] = useState("add");

  useEffect(() => {
    fetchFranchiseeCenters();
  }, []);

  // Unique Cities list for filtering
  const cities = useMemo(() => {
    return Array.from(
      new Set(centersList.map((item) => item.location?.city).filter(Boolean)),
    );
  }, [centersList]);

  // Filter and Sort Logic
  const filteredFranchises = useMemo(() => {
    return centersList
      .filter((item) => {
        const matchesSearch =
          item.brandName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          `${item.owner?.firstName} ${item.owner?.lastName}`
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          item.owner?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.businessDetails?.legalName
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase());

        const matchesStatus =
          statusFilter === "All" || item.status === statusFilter;
        const matchesCity =
          cityFilter === "All" || item.location?.city === cityFilter;
        return matchesSearch && matchesStatus && matchesCity;
      })
      .sort((a, b) => {
        if (sortBy === "newest")
          return new Date(b.createdAt) - new Date(a.createdAt);
        if (sortBy === "oldest")
          return new Date(a.createdAt) - new Date(b.createdAt);
        if (sortBy === "brand")
          return (a.brandName || "").localeCompare(b.brandName || "");
        return 0;
      });
  }, [centersList, searchTerm, statusFilter, cityFilter, sortBy]);

  // Statistics Computations
  const stats = useMemo(() => {
    const total = centersList.length;
    const active = centersList.filter((f) => f.status === "Active").length;
    const pending = centersList.filter((f) =>
      ["Applied", "Pending", "Under Construction"].includes(f.status),
    ).length;
    const suspended = centersList.filter((f) =>
      ["Suspended", "Terminated"].includes(f.status),
    ).length;
    return { total, active, pending, suspended };
  }, [centersList]);

  const handleResetFilters = () => {
    setSearchTerm("");
    setStatusFilter("All");
    setCityFilter("All");
    setSortBy("newest");
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "Active":
      case "Approved":
        return "bg-success-subtle text-success border-success-subtle";
      case "Suspended":
      case "Terminated":
        return "bg-danger-subtle text-danger border-danger-subtle";
      default:
        return "bg-secondary-subtle text-secondary border-secondary-subtle";
    }
  };

  // Modal Handlers
  const handleOpenAddModal = () => {
    setSelectedFranchise(null);
    setFormMode("add");
    setShowFormModal(true);
  };

  const handleOpenEditModal = (item) => {
    setSelectedFranchise(item);
    setFormMode("edit");
    setShowFormModal(true);
  };

  const handleOpenViewModal = (item) => {
    setSelectedFranchise(item);
    setShowViewModal(true);
  };

  const handleOpenDeleteModal = (item) => {
    setSelectedFranchise(item);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    // Refresh list from context after deletion logic runs
    await fetchFranchiseeCenters();
    setShowDeleteModal(false);
    setSelectedFranchise(null);
  };

  // Callback passed to FranchiseFormModal
  const handleFormSave = async () => {
    // Refresh list from backend after submit completes
    await fetchFranchiseeCenters();
    setShowFormModal(false);
  };

  return (
    <div className="bg-light min-vh-100 py-4 px-3 px-md-4 font-sans">
      <div className="container-fluid max-w-7xl mx-auto">
        {/* --- 1. Header --- */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
          <div>
            <h1 className="h3 fw-bold text-dark mb-1">Franchises Registry</h1>
            <p className="text-muted small mb-0">
              Manage franchise agreements, locations, and compliance tracking.
            </p>
          </div>
          <button
            onClick={handleOpenAddModal}
            className="btn btn-primary btn-sm rounded-3 fw-medium d-flex align-items-center gap-2 px-3 py-2 shadow-sm"
          >
            <FiPlus className="fs-6" />
            <span>Register New Franchise</span>
          </button>
        </div>

        {/* --- 2. Stats --- */}
        <div className="row g-3 mb-4">
          <div className="col-12 col-sm-6 col-xl-3">
            <div className="card border-0 shadow-sm rounded-4 h-100">
              <div className="card-body p-3 d-flex justify-content-between align-items-center">
                <div>
                  <span className="text-uppercase text-muted fw-semibold fs-7">
                    Total Registered
                  </span>
                  <h3 className="fw-bold my-1 text-dark">{stats.total}</h3>
                  <small className="text-muted">
                    Total franchises in system
                  </small>
                </div>
                <div className="rounded-3 bg-primary bg-opacity-10 text-primary p-3">
                  <FiHome className="fs-3" />
                </div>
              </div>
            </div>
          </div>

          <div className="col-12 col-sm-6 col-xl-3">
            <div className="card border-0 shadow-sm rounded-4 h-100">
              <div className="card-body p-3 d-flex justify-content-between align-items-center">
                <div>
                  <span className="text-uppercase text-muted fw-semibold fs-7">
                    Active Operational
                  </span>
                  <h3 className="fw-bold my-1 text-dark">{stats.active}</h3>
                  <small className="text-success fw-medium d-flex align-items-center gap-1">
                    <FiCheckCircle /> Active status
                  </small>
                </div>
                <div className="rounded-3 bg-success bg-opacity-10 text-success p-3">
                  <FiCheckCircle className="fs-3" />
                </div>
              </div>
            </div>
          </div>

          <div className="col-12 col-sm-6 col-xl-3">
            <div className="card border-0 shadow-sm rounded-4 h-100">
              <div className="card-body p-3 d-flex justify-content-between align-items-center">
                <div>
                  <span className="text-uppercase text-muted fw-semibold fs-7">
                    Onboarding
                  </span>
                  <h3 className="fw-bold my-1 text-dark">{stats.pending}</h3>
                  <small className="text-warning fw-medium d-flex align-items-center gap-1">
                    <FiClock /> Approved
                  </small>
                </div>
                <div className="rounded-3 bg-warning bg-opacity-10 text-warning p-3">
                  <FiClock className="fs-3" />
                </div>
              </div>
            </div>
          </div>

          <div className="col-12 col-sm-6 col-xl-3">
            <div className="card border-0 shadow-sm rounded-4 h-100">
              <div className="card-body p-3 d-flex justify-content-between align-items-center">
                <div>
                  <span className="text-uppercase text-muted fw-semibold fs-7">
                    Suspended / Terminated
                  </span>
                  <h3 className="fw-bold my-1 text-dark">{stats.suspended}</h3>
                  <small className="text-danger fw-medium d-flex align-items-center gap-1">
                    <FiSlash /> Action required
                  </small>
                </div>
                <div className="rounded-3 bg-danger bg-opacity-10 text-danger p-3">
                  <FiSlash className="fs-3" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* --- 3. Filters --- */}
        <div className="card border-0 shadow-sm rounded-4 mb-4">
          <div className="card-body p-3">
            <div className="row g-2 align-items-center">
              <div className="col-12 col-md-5">
                <div className="input-group input-group-sm">
                  <span className="input-group-text bg-white border-end-0 text-muted rounded-start-3">
                    <FiSearch />
                  </span>
                  <input
                    type="text"
                    className="form-control border-start-0 rounded-end-3 py-2 shadow-none"
                    placeholder="Search by brand, owner, email, or legal name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              <div className="col-6 col-md-2">
                <select
                  value={cityFilter}
                  onChange={(e) => setCityFilter(e.target.value)}
                  className="form-select form-select-sm py-2 rounded-3 shadow-none text-secondary"
                >
                  <option value="All">All Cities</option>
                  {cities.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-6 col-md-2">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="form-select form-select-sm py-2 rounded-3 shadow-none text-secondary"
                >
                  <option value="All">All Statuses</option>
                  <option value="Approved">Approved</option>
                  <option value="Active">Active</option>
                  <option value="Suspended">Suspended</option>
                  <option value="Terminated">Terminated</option>
                </select>
              </div>

              <div className="col-12 col-md-3 d-flex gap-2">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="form-select form-select-sm py-2 rounded-3 shadow-none text-secondary"
                >
                  <option value="newest">Newest Signed</option>
                  <option value="oldest">Oldest Signed</option>
                  <option value="brand">Brand A-Z</option>
                </select>

                {(searchTerm ||
                  statusFilter !== "All" ||
                  cityFilter !== "All" ||
                  sortBy !== "newest") && (
                  <button
                    onClick={handleResetFilters}
                    className="btn btn-link btn-sm text-primary text-nowrap px-1"
                  >
                    Reset
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* --- 4. Main Table --- */}
        <div className="card border-0 shadow-sm rounded-4 overflow-hidden mb-4">
          {filteredFranchises.length === 0 ? (
            <div className="p-5 text-center my-4">
              <FiFolder className="fs-1 text-muted mb-2" />
              <h5 className="fw-bold text-dark mt-2">
                No Franchise Records Found
              </h5>
              <p className="text-muted small">
                Try tweaking your search parameters or register a new franchise.
              </p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="bg-light text-muted uppercase fs-7 fw-semibold border-bottom">
                  <tr>
                    <th className="py-3 px-4">Brand & Legal Entity</th>
                    <th className="py-3 px-4">Owner Contact</th>
                    <th className="py-3 px-4">Location</th>
                    <th className="py-3 px-4">Royalty / Marketing</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-end">Actions</th>
                  </tr>
                </thead>
                <tbody className="table-group-divider">
                  {filteredFranchises.map((item) => (
                    <tr key={item._id}>
                      <td className="py-3 px-4">
                        <div className="fw-bold text-dark">
                          {item.brandName}
                        </div>
                        <div className="text-muted fs-7">
                          {item.businessDetails?.legalName} (
                          {item.businessDetails?.incorporationType})
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="fw-medium text-dark">
                          {item.owner?.firstName} {item.owner?.lastName}
                        </div>
                        <div className="text-muted fs-7">
                          {item.owner?.email}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-dark">
                          {item.location?.city}, {item.location?.state}
                        </div>
                        <div className="text-muted fs-7">
                          {item.location?.addressLine1}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-dark fw-semibold">
                          Royalty: {item.agreement?.royaltyPercentage}%
                        </div>
                        <div className="text-muted fs-7">
                          Mktg: {item.agreement?.marketingFeePercentage}%
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`badge rounded-pill px-3 py-2 fw-medium border ${getStatusBadge(item.status)}`}
                        >
                          ● {item.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-end text-nowrap">
                        <div className="d-inline-flex gap-1">
                          <button
                            type="button"
                            onClick={() => handleOpenViewModal(item)}
                            className="btn btn-sm btn-outline-secondary border-0 p-2 d-inline-flex align-items-center justify-content-center"
                            title="View Profile"
                          >
                            <FiEye className="fs-6" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleOpenEditModal(item)}
                            className="btn btn-sm btn-outline-primary border-0 p-2 d-inline-flex align-items-center justify-content-center"
                            title="Edit Record"
                          >
                            <FiEdit className="fs-6" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleOpenDeleteModal(item)}
                            className="btn btn-sm btn-outline-danger border-0 p-2 d-inline-flex align-items-center justify-content-center"
                            title="Delete Record"
                          >
                            <FiTrash2 className="fs-6" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* --- REUSABLE FORM MODAL COMPONENT --- */}
      <FranchiseRegistration
        isOpen={showFormModal}
        mode={formMode}
        initialData={selectedFranchise}
        onClose={() => setShowFormModal(false)}
        onSubmit={handleFormSave}
      />

      {/* --- DETAIL VIEW MODAL --- */}
      {showViewModal && selectedFranchise && (
        <div
          className="modal fade show d-block bg-dark bg-opacity-50"
          tabIndex="-1"
        >
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content border-0 rounded-4 shadow">
              <div className="modal-header border-bottom">
                <div>
                  <h5 className="modal-title fw-bold">
                    {selectedFranchise.brandName}
                  </h5>
                  <span className="text-muted fs-7">
                    {selectedFranchise.businessDetails?.legalName}
                  </span>
                </div>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowViewModal(false)}
                ></button>
              </div>
              <div className="modal-body p-4">
                <div className="row g-4">
                  <div className="col-md-6">
                    <h6 className="fw-bold text-muted fs-7 text-uppercase">
                      Owner Details
                    </h6>
                    <p className="mb-1">
                      <strong>Name:</strong>{" "}
                      {selectedFranchise.owner?.firstName}{" "}
                      {selectedFranchise.owner?.lastName}
                    </p>
                    <p className="mb-1">
                      <strong>Email:</strong> {selectedFranchise.owner?.email}
                    </p>
                    <p className="mb-1">
                      <strong>Phone:</strong> {selectedFranchise.owner?.phone}
                    </p>
                    <p className="mb-1">
                      <strong>Tax ID:</strong> {selectedFranchise.owner?.taxId}
                    </p>
                  </div>
                  <div className="col-md-6">
                    <h6 className="fw-bold text-muted fs-7 text-uppercase">
                      Agreement Specs
                    </h6>
                    <p className="mb-1">
                      <strong>Initial Fee:</strong> $
                      {selectedFranchise.agreement?.initialFeePaid?.toLocaleString()}
                    </p>
                    <p className="mb-1">
                      <strong>Royalty:</strong>{" "}
                      {selectedFranchise.agreement?.royaltyPercentage}%
                    </p>
                    <p className="mb-1">
                      <strong>Marketing Fee:</strong>{" "}
                      {selectedFranchise.agreement?.marketingFeePercentage}%
                    </p>
                    <p className="mb-1">
                      <strong>Expiry:</strong>{" "}
                      {selectedFranchise.agreement?.expiryDate?.split("T")[0]}
                    </p>
                  </div>
                  <div className="col-12">
                    <h6 className="fw-bold text-muted fs-7 text-uppercase">
                      GeoJSON Coordinates
                    </h6>
                    <p className="mb-0 font-monospace fs-7">
                      Lng:{" "}
                      {
                        selectedFranchise.location?.coordinates
                          ?.coordinates?.[0]
                      }
                      , Lat:{" "}
                      {
                        selectedFranchise.location?.coordinates
                          ?.coordinates?.[1]
                      }
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- DELETE CONFIRMATION MODAL --- */}
      {showDeleteModal && selectedFranchise && (
        <div
          className="modal fade show d-block bg-dark bg-opacity-50"
          tabIndex="-1"
        >
          <div className="modal-dialog modal-dialog-centered modal-sm">
            <div className="modal-content border-0 rounded-4 shadow text-center p-3">
              <div className="rounded-circle bg-danger bg-opacity-10 text-danger p-3 d-inline-flex mx-auto mb-2">
                <FiAlertTriangle className="fs-3" />
              </div>
              <h6 className="fw-bold text-dark mb-1">Delete Franchise?</h6>
              <p className="text-muted fs-7 mb-3">
                Remove <strong>{selectedFranchise.brandName}</strong> from
                database?
              </p>
              <div className="d-flex justify-content-center gap-2">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="btn btn-light btn-sm rounded-3 w-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  className="btn btn-danger btn-sm rounded-3 w-50"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .fs-7 { font-size: 0.8rem; }
      `}</style>
    </div>
  );
}
