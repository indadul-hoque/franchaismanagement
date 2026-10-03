import React, { useState, useEffect } from "react";
import { MdDelete, MdEdit, MdLocationOn, MdStorefront, MdEmail, MdPhone, MdPerson, MdInfo } from "react-icons/md";
import { FaPlus, FaCodeBranch } from "react-icons/fa6";
import toast from "react-hot-toast";
import axios from "axios";
import { currentConfig } from "../../../../../utils";

const API_URL = currentConfig.API_URL;

// Match the structural states available in the Mongoose Schema Enum
const STATUS_OPTIONS = ["Under Construction", "Active", "Inactive", "Closed"];

export default function BranchesDashboard() {
  // State for Franchises Context
  const [franchises, setFranchises] = useState([]);
  const [selectedFranchiseId, setSelectedFranchiseId] = useState("");
  const [isFranchisesLoading, setIsFranchisesLoading] = useState(true);

  // State for Listing (Set to false initially since we wait for an explicit user selection)
  const [branches, setBranches] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Helper utility to turn flat address string fields back into readable blocks for display rendering
  const formatFullAddress = (loc) => {
    if (!loc) return "No Address Provided";
    return `${loc.addressLine || ""}, ${loc.city || ""}, ${loc.state || ""} ${loc.postalCode || ""}`.trim().replace(/^,\s*|,\s*$/, "");
  };

  // State for Adding Modal & Form
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addForm, setAddForm] = useState({ 
    franchiseId: "",
    branchName: "", 
    status: "Under Construction",
    // Contact sub-object fields
    email: "",
    phone: "",
    managerName: "",
    // Location sub-object fields
    addressLine: "",
    city: "",
    state: "",
    postalCode: "",
    longitude: "0",
    latitude: "0"
  });
  const [isAdding, setIsAdding] = useState(false);

  // State for Editing Modal & Form
  const [editBranch, setEditBranch] = useState(null);
  const [editForm, setEditForm] = useState({
    branchName: "",
    status: "Under Construction",
    email: "",
    phone: "",
    managerName: "",
    addressLine: "",
    city: "",
    state: "",
    postalCode: "",
    longitude: "0",
    latitude: "0"
  });
  const [isEditing, setIsEditing] = useState(false);

  // Fetch initial franchises list
  useEffect(() => {
    fetchFranchises();
  }, []);

  // Fetch branches when filter scope changes
  useEffect(() => {
    if (selectedFranchiseId) {
      fetchBranches(selectedFranchiseId);
    } else {
      setBranches([]);
    }
  }, [selectedFranchiseId]);

  const fetchFranchises = async () => {
    try {
      setIsFranchisesLoading(true);
      const response = await axios.get(`${API_URL}/franchises/getAllFranchises`); 
      const franchiseData = response.data.data || [];
      setFranchises(franchiseData);
      
      // Kept empty intentionally so user is forced to select an item explicitly
    } catch (error) {
      console.error("Error fetching franchises:", error);
      toast.error("Failed to load franchises list.");
    } finally {
      setIsFranchisesLoading(false);
    }
  };

  const fetchBranches = async (franchiseId) => {
    try {
      setIsLoading(true);
      setError("");
      const response = await axios.get(`${API_URL}/branches/branch/${franchiseId}`);
      setBranches(response.data.data || []);
    } catch (error) {
      setError("Failed to load branches for this franchise.");
      toast.error("Failed to load branches.");
      console.error("Error fetching branches:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Open & setup creation form modal
  const openAddModal = () => {
    setAddForm({
      franchiseId: selectedFranchiseId,
      branchName: "",
      status: "Under Construction",
      email: "",
      phone: "",
      managerName: "",
      addressLine: "",
      city: "",
      state: "",
      postalCode: "",
      longitude: "0",
      latitude: "0"
    });
    setIsAddModalOpen(true);
  };

  const closeAddModal = () => {
    setIsAddModalOpen(false);
  };

  const handleAddChange = (e) => {
    const { name, value } = e.target;
    setAddForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (!addForm.franchiseId) {
      toast.error("Please assign a target franchise destination.");
      return;
    }

    // Construct request payload to match Mongoose deep nesting structure exactly
    const payload = {
      franchiseId: addForm.franchiseId,
      branchName: addForm.branchName.trim(),
      status: addForm.status,
      contact: {
        email: addForm.email.trim() || undefined,
        phone: addForm.phone.trim() || undefined,
        managerName: addForm.managerName.trim() || undefined,
      },
      location: {
        addressLine: addForm.addressLine.trim(),
        city: addForm.city.trim(),
        state: addForm.state.trim(),
        postalCode: addForm.postalCode.trim(),
        coordinates: {
          type: "Point",
          coordinates: [parseFloat(addForm.longitude) || 0, parseFloat(addForm.latitude) || 0] // [longitude, latitude]
        }
      }
    };

    setIsAdding(true);
    try {
      await axios.post(
        `${API_URL}/branches/addbranch`,
        payload,
        { headers: { "Content-Type": "application/json" } }
      );
      toast.success("Branch added successfully!");
      closeAddModal();
      
      if (addForm.franchiseId === selectedFranchiseId) {
        fetchBranches(selectedFranchiseId);
      } else {
        setSelectedFranchiseId(addForm.franchiseId);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add branch");
    } finally {
      setIsAdding(false);
    }
  };

  // Handle Delete
  const handleDelete = async (branchId) => {
    if (!window.confirm("Are you sure you want to delete this branch?")) return;

    try {
      await axios.delete(`${API_URL}/branches/deletebranch/${branchId}`);
      setBranches((prev) => prev.filter((branch) => branch._id !== branchId));
      toast.success("Branch deleted successfully!");
    } catch (error) {
      console.error("Delete Error:", error);
      toast.error("Failed to delete branch.");
    }
  };

  // Handle Edit Actions
  const openEditModal = (branch) => {
    setEditBranch(branch);
    setEditForm({
      branchName: branch.branchName || "",
      status: branch.status || "Under Construction",
      email: branch.contact?.email || "",
      phone: branch.contact?.phone || "",
      managerName: branch.contact?.managerName || "",
      addressLine: branch.location?.addressLine || "",
      city: branch.location?.city || "",
      state: branch.location?.state || "",
      postalCode: branch.location?.postalCode || "",
      longitude: branch.location?.coordinates?.coordinates?.[0]?.toString() || "0",
      latitude: branch.location?.coordinates?.coordinates?.[1]?.toString() || "0",
    });
  };

  const closeEditModal = () => {
    setEditBranch(null);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setIsEditing(true);

    const payload = {
      branchName: editForm.branchName.trim(),
      status: editForm.status,
      contact: {
        email: editForm.email.trim() || undefined,
        phone: editForm.phone.trim() || undefined,
        managerName: editForm.managerName.trim() || undefined,
      },
      location: {
        addressLine: editForm.addressLine.trim(),
        city: editForm.city.trim(),
        state: editForm.state.trim(),
        postalCode: editForm.postalCode.trim(),
        coordinates: {
          type: "Point",
          coordinates: [parseFloat(editForm.longitude) || 0, parseFloat(editForm.latitude) || 0]
        }
      }
    };

    try {
      const response = await axios.put(
        `${API_URL}/branches/updatebranch/${editBranch._id}`,
        payload
      );

      // Reassemble final response to map accurately back inside memory view states
      const updatedData = response.data.data || { 
        ...editBranch, 
        ...payload,
        contact: { ...payload.contact },
        location: { 
          ...payload.location,
          coordinates: { type: "Point", coordinates: payload.location.coordinates }
        }
      };

      setBranches((prev) =>
        prev.map((branch) =>
          branch._id === editBranch._id ? updatedData : branch
        )
      );
      toast.success("Branch updated successfully!");
      closeEditModal();
    } catch (error) {
      console.error("Update Error:", error);
      toast.error(error.response?.data?.message || "Failed to update branch.");
    } finally {
      setIsEditing(false);
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "Active": return "bg-success";
      case "Inactive": return "bg-secondary";
      case "Under Construction": return "bg-warning text-dark";
      case "Closed": return "bg-danger";
      default: return "bg-light text-dark";
    }
  };

  return (
    <div className="container-fluid py-4 px-4" style={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}>
      {/* Header section */}
      <div className="d-flex align-items-center mb-4 pb-3 border-bottom">
        <div className="bg-primary text-white p-3 rounded-3 shadow-sm me-3">
          <FaCodeBranch size={24} />
        </div>
        <div>
          <h2 className="fw-bold mb-0 text-dark">Branch Management</h2>
          <p className="text-muted mb-0">
            Create, view, modify, and coordinate corporate infrastructure networks.
          </p>
        </div>
      </div>

      <div className="row">
        <div className="col-12">
          <div className="card border-0 shadow-sm rounded-3">
            <div className="card-body p-4">
              
              <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4 pb-3 border-bottom">
                <div>
                  <h5 className="card-title fw-bold mb-0">Active Infrastructure</h5>
                  {branches.length > 0 && (
                    <span className="badge bg-light text-primary border border-primary-subtle px-2.5 py-1.5 mt-1.5 rounded-pill fw-semibold">
                      Total: {branches.length} Location{branches.length > 1 ? "s" : ""}
                    </span>
                  )}
                </div>

                <div className="d-flex flex-wrap align-items-center gap-3">
                  <div className="d-flex align-items-center" style={{ minWidth: "260px" }}>
                    <span className="me-2 text-secondary fw-semibold small d-flex align-items-center gap-1 flex-shrink-0">
                      <MdStorefront size={18} className="text-primary" /> Franchise Filter:
                    </span>
                    <select
                      className="form-select border-2 fw-medium text-dark bg-white"
                      value={selectedFranchiseId}
                      onChange={(e) => setSelectedFranchiseId(e.target.value)}
                      disabled={isFranchisesLoading}
                    >
                      {isFranchisesLoading ? (
                        <option value="">Loading corporate entities...</option>
                      ) : (
                        <>
                          <option value="">-- Choose a Franchise --</option>
                          {franchises.map((f) => (
                            <option key={f._id} value={f._id}>
                              {f.businessDetails.legalName || "Unnamed Entity"}
                            </option>
                          ))}
                        </>
                      )}
                    </select>
                  </div>

                  <button
                    onClick={openAddModal}
                    className="btn btn-primary fw-bold d-flex align-items-center gap-2 shadow-sm"
                  >
                    <FaPlus size={14} /> Add New Branch
                  </button>
                </div>
              </div>

              {error && (
                <div className="alert alert-danger border-0 shadow-sm d-flex align-items-center" role="alert">
                  {error}
                </div>
              )}

              {/* Dynamic State Evaluation Layout Engine */}
              {!selectedFranchiseId ? (
                <div className="text-center py-5 my-4">
                  <div className="text-muted opacity-50 mb-3">
                    <MdStorefront size={48} className="text-primary" />
                  </div>
                  <h6 className="fw-bold text-secondary">No Franchise Selected</h6>
                  <p className="text-muted small max-w-sm mx-auto">
                    Please choose a franchise organization from the dropdown filter menu above to view its infrastructure network branches.
                  </p>
                </div>
              ) : isLoading ? (
                <div className="d-flex flex-column justify-content-center align-items-center py-5 my-4">
                  <div className="spinner-border text-primary mb-3" style={{ width: "3rem", height: "3rem" }} role="status" />
                  <span className="text-muted fw-medium">Syncing branch records...</span>
                </div>
              ) : branches.length > 0 ? (
                <div className="table-responsive align-middle">
                  <table className="table table-hover mb-0 custom-table">
                    <thead>
                      <tr className="table-light border-0">
                        <th className="py-3 px-4 rounded-start text-uppercase tracking-wider text-secondary fw-bold small" style={{ width: "25%" }}>
                          Branch Detail
                        </th>
                        <th className="py-3 text-uppercase tracking-wider text-secondary fw-bold small" style={{ width: "15%" }}>
                          Status
                        </th>
                        <th className="py-3 text-uppercase tracking-wider text-secondary fw-bold small" style={{ width: "25%" }}>
                          Management & Contact
                        </th>
                        <th className="py-3 text-uppercase tracking-wider text-secondary fw-bold small" style={{ width: "20%" }}>
                          Physical Address
                        </th>
                        <th className="py-3 px-4 rounded-end text-end text-uppercase tracking-wider text-secondary fw-bold small" style={{ width: "15%" }}>
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {branches.map((branch) => (
                        <tr key={branch._id} className="border-bottom align-middle">
                          <td className="py-3 px-4 fw-bold text-dark">
                            {branch.branchName}
                          </td>
                          <td className="py-3">
                            <span className={`badge ${getStatusBadgeClass(branch.status)} rounded-pill px-3 py-2 fw-semibold`}>
                              {branch.status}
                            </span>
                          </td>
                          <td className="py-3 small text-secondary">
                            <div><strong>Mgr:</strong> {branch.contact?.managerName || "Not Assigned"}</div>
                            {branch.contact?.phone && <div><strong>Ph:</strong> {branch.contact.phone}</div>}
                            {branch.contact?.email && <div className="text-truncate" style={{ maxWidth: "180px" }}><strong>Email:</strong> {branch.contact.email}</div>}
                          </td>
                          <td className="py-3 text-muted small">
                            <div className="d-flex align-items-start gap-1">
                              <MdLocationOn className="text-primary opacity-75 mt-0.5 flex-shrink-0" size={16} />
                              <div>
                                <div>{formatFullAddress(branch.location)}</div>
                                {branch.location?.coordinates?.coordinates && (
                                  <span className="text-muted border border-light-subtle rounded px-1 py-0.5 bg-light extra-small text-nowrap" style={{ fontSize: '10px' }}>
                                    Geo: {branch.location.coordinates.coordinates.join(", ")}
                                  </span>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-end">
                            <div className="d-inline-flex gap-2">
                              <button
                                className="btn btn-sm btn-light border p-2 rounded-2 text-primary hover-shadow transition-all"
                                title="Edit parameters"
                                onClick={() => openEditModal(branch)}
                              >
                                <MdEdit size={16} />
                              </button>
                              <button
                                className="btn btn-sm btn-light border p-2 rounded-2 text-danger hover-shadow transition-all"
                                title="Terminate records"
                                onClick={() => handleDelete(branch._id)}
                              >
                                <MdDelete size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-5 my-4">
                  <div className="text-muted opacity-50 mb-3"><FaCodeBranch size={48} /></div>
                  <h6 className="fw-bold text-secondary">No Branches Found</h6>
                  <p className="text-muted small max-w-sm mx-auto">
                    No registered infrastructure workspaces found under this franchise. Click "Add New Branch" to register one.
                  </p>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>

      {/* Structured ADD New Branch Overlay Modal */}
      {isAddModalOpen && (
        <>
          <div className="modal-backdrop fade show" style={{ backdropFilter: "blur(4px)", backgroundColor: "rgba(15, 23, 42, 0.3)" }}></div>
          <div className="modal fade show d-block overflow-y-auto" tabIndex="-1" role="dialog">
            <div className="modal-dialog modal-dialog-centered modal-lg" role="document">
              <div className="modal-content border-0 shadow-lg rounded-3">
                <form onSubmit={handleAddSubmit}>
                  <div className="modal-header border-bottom-0 pt-4 px-4 pb-2">
                    <h5 className="modal-title fw-bold text-dark d-flex align-items-center gap-2">
                      <FaPlus size={16} className="text-primary" /> Register New Branch
                    </h5>
                    <button type="button" className="btn-close shadow-none" onClick={closeAddModal}></button>
                  </div>
                  
                  <div className="modal-body px-4 py-3">
                    <h6 className="fw-bold text-primary mb-3 d-flex align-items-center gap-1">
                      <MdStorefront /> 1. Operational Overview
                    </h6>
                    <div className="row g-3 mb-4">
                      <div className="col-md-6">
                        <label className="form-label fw-semibold text-secondary small">Assign Franchise Association *</label>
                        <select className="form-select border-2" name="franchiseId" value={addForm.franchiseId} onChange={handleAddChange} required>
                          <option value="">-- Choose Target Franchise Scope --</option>
                          {franchises.map((f) => (
                            <option key={f._id} value={f._id}>{f.businessDetails.legalName}</option>
                          ))}
                        </select>
                      </div>
                      <div className="col-md-6">
                        <label className="form-label fw-semibold text-secondary small">Branch Title/Designation *</label>
                        <input type="text" className="form-control border-2" name="branchName" placeholder="e.g., Regional Base East" value={addForm.branchName} onChange={handleAddChange} required />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label fw-semibold text-secondary small">Operational Status *</label>
                        <select className="form-select border-2" name="status" value={addForm.status} onChange={handleAddChange} required>
                          {STATUS_OPTIONS.map(opt => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <h6 className="fw-bold text-primary mb-3 d-flex align-items-center gap-1">
                      <MdPerson /> 2. Site Management Contact (Optional)
                    </h6>
                    <div className="row g-3 mb-4">
                      <div className="col-md-4">
                        <label className="form-label fw-semibold text-secondary small">Manager Full Name</label>
                        <input type="text" className="form-control border-2" name="managerName" placeholder="John Doe" value={addForm.managerName} onChange={handleAddChange} />
                      </div>
                      <div className="col-md-4">
                        <label className="form-label fw-semibold text-secondary small">Contact Phone Number</label>
                        <input type="text" className="form-control border-2" name="phone" placeholder="+1-555-0100" value={addForm.phone} onChange={handleAddChange} />
                      </div>
                      <div className="col-md-4">
                        <label className="form-label fw-semibold text-secondary small">Contact Email Address</label>
                        <input type="email" className="form-control border-2" name="email" placeholder="manager@site.com" value={addForm.email} onChange={handleAddChange} />
                      </div>
                    </div>

                    <h6 className="fw-bold text-primary mb-3 d-flex align-items-center gap-1">
                      <MdLocationOn /> 3. Structural Location Data
                    </h6>
                    <div className="row g-3">
                      <div className="col-12">
                        <label className="form-label fw-semibold text-secondary small">Street / Address Line *</label>
                        <input type="text" className="form-control border-2" name="addressLine" placeholder="123 Main St, Suite 400" value={addForm.addressLine} onChange={handleAddChange} required />
                      </div>
                      <div className="col-md-4">
                        <label className="form-label fw-semibold text-secondary small">City *</label>
                        <input type="text" className="form-control border-2" name="city" placeholder="Berhampore" value={addForm.city} onChange={handleAddChange} required />
                      </div>
                      <div className="col-md-4">
                        <label className="form-label fw-semibold text-secondary small">State / Region *</label>
                        <input type="text" className="form-control border-2" name="state" placeholder="West Bengal" value={addForm.state} onChange={handleAddChange} required />
                      </div>
                      <div className="col-md-4">
                        <label className="form-label fw-semibold text-secondary small">Postal / ZIP Code *</label>
                        <input type="text" className="form-control border-2" name="postalCode" placeholder="742101" value={addForm.postalCode} onChange={handleAddChange} required />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label fw-semibold text-secondary small">Geo Longitude (X-Axis) *</label>
                        <input type="number" step="any" className="form-control border-2" name="longitude" value={addForm.longitude} onChange={handleAddChange} required />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label fw-semibold text-secondary small">Geo Latitude (Y-Axis) *</label>
                        <input type="number" step="any" className="form-control border-2" name="latitude" value={addForm.latitude} onChange={handleAddChange} required />
                      </div>
                    </div>
                  </div>

                  <div className="modal-footer border-top-0 pb-4 px-4 pt-2 gap-2">
                    <button type="button" className="btn btn-light fw-semibold border px-4" onClick={closeAddModal}>Cancel</button>
                    <button type="submit" className="btn btn-primary fw-bold px-4 shadow-sm" disabled={isAdding}>
                      {isAdding ? <div className="spinner-border spinner-border-sm text-light" role="status" /> : "Save Workspace"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Styled EDIT Branch Overlay Modal */}
      {editBranch && (
        <>
          <div className="modal-backdrop fade show" style={{ backdropFilter: "blur(4px)", backgroundColor: "rgba(15, 23, 42, 0.3)" }}></div>
          <div className="modal fade show d-block overflow-y-auto" tabIndex="-1" role="dialog">
            <div className="modal-dialog modal-dialog-centered modal-lg" role="document">
              <div className="modal-content border-0 shadow-lg rounded-3">
                <form onSubmit={handleEditSubmit}>
                  <div className="modal-header border-bottom-0 pt-4 px-4 pb-2">
                    <h5 className="modal-title fw-bold text-dark">Modify Branch Properties</h5>
                    <button type="button" className="btn-close shadow-none" onClick={closeEditModal}></button>
                  </div>
                  
                  <div className="modal-body px-4 py-3">
                    <h6 className="fw-bold text-primary mb-3 d-flex align-items-center gap-1"><MdInfo /> 1. Core Profile</h6>
                    <div className="row g-3 mb-4">
                      <div className="col-md-6">
                        <label className="form-label fw-semibold text-secondary small">Branch Designation *</label>
                        <input type="text" className="form-control border-2" name="branchName" value={editForm.branchName} onChange={handleEditChange} required />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label fw-semibold text-secondary small">Operational Status *</label>
                        <select className="form-select border-2" name="status" value={editForm.status} onChange={handleEditChange} required>
                          {STATUS_OPTIONS.map(opt => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <h6 className="fw-bold text-primary mb-3 d-flex align-items-center gap-1"><MdPerson /> 2. Management Contact</h6>
                    <div className="row g-3 mb-4">
                      <div className="col-md-4">
                        <label className="form-label fw-semibold text-secondary small">Manager Name</label>
                        <input type="text" className="form-control border-2" name="managerName" value={editForm.managerName} onChange={handleEditChange} />
                      </div>
                      <div className="col-md-4">
                        <label className="form-label fw-semibold text-secondary small">Phone</label>
                        <input type="text" className="form-control border-2" name="phone" value={editForm.phone} onChange={handleEditChange} />
                      </div>
                      <div className="col-md-4">
                        <label className="form-label fw-semibold text-secondary small">Email</label>
                        <input type="email" className="form-control border-2" name="email" value={editForm.email} onChange={handleEditChange} />
                      </div>
                    </div>

                    <h6 className="fw-bold text-primary mb-3 d-flex align-items-center gap-1"><MdLocationOn /> 3. Geographic & Physical Data</h6>
                    <div className="row g-3">
                      <div className="col-12">
                        <label className="form-label fw-semibold text-secondary small">Street Address *</label>
                        <input type="text" className="form-control border-2" name="addressLine" value={editForm.addressLine} onChange={handleEditChange} required />
                      </div>
                      <div className="col-md-4">
                        <label className="form-label fw-semibold text-secondary small">City *</label>
                        <input type="text" className="form-control border-2" name="city" value={editForm.city} onChange={handleEditChange} required />
                      </div>
                      <div className="col-md-4">
                        <label className="form-label fw-semibold text-secondary small">State *</label>
                        <input type="text" className="form-control border-2" name="state" value={editForm.state} onChange={handleEditChange} required />
                      </div>
                      <div className="col-md-4">
                        <label className="form-label fw-semibold text-secondary small">Postal Code *</label>
                        <input type="text" className="form-control border-2" name="postalCode" value={editForm.postalCode} onChange={handleEditChange} required />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label fw-semibold text-secondary small">Longitude *</label>
                        <input type="number" step="any" className="form-control border-2" name="longitude" value={editForm.longitude} onChange={handleEditChange} required />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label fw-semibold text-secondary small">Latitude *</label>
                        <input type="number" step="any" className="form-control border-2" name="latitude" value={editForm.latitude} onChange={handleEditChange} required />
                      </div>
                    </div>
                  </div>
                  
                  <div className="modal-footer border-top-0 pb-4 px-4 pt-2 gap-2">
                    <button type="button" className="btn btn-light fw-semibold border px-4" onClick={closeEditModal}>Discard</button>
                    <button type="submit" className="btn btn-primary fw-bold px-4 shadow-sm" disabled={isEditing}>
                      {isEditing ? <div className="spinner-border spinner-border-sm text-light" role="status" /> : "Apply Adjustments"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}