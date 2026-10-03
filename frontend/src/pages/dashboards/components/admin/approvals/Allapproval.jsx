import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaBuilding,
  FaMapMarkerAlt,
  FaEnvelope,
  FaPhoneAlt,
  FaCalendarAlt,
  FaUser,
  FaInbox,
  FaHistory,
  FaSearch,
  FaChevronRight,
  FaTimes,
  FaFileContract,
  FaDollarSign,
  FaPercent,
  FaEye,
  FaSpinner
} from "react-icons/fa";
import axios from "axios";
import { currentConfig } from "../../../../../utils";

const API_URL = currentConfig.API_URL;

export default function Allapproval() {
  // Toggles between 'Applied' (Pending Verification) and 'history' (Resolution History)
  const [activeTab, setActiveTab] = useState("Applied"); 
  const [searchQuery, setSearchQuery] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");
  const [selectedFranchise, setSelectedFranchise] = useState(null);

  // Core API State Management
  const [approvalsList, setApprovalsList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // ── 1. CORE DATA FETCH ENGINE ────────────────────────────
  const fetchFranchiseData = async () => {
    setIsLoading(true);
    try {
      let statusParam = activeTab;

      // If viewing history, pull terminal status string conditions matching your Mongoose configuration parameters
      if (activeTab === "history") {
        statusParam = "Approved,Rejected,Suspended,Terminated";
      }
      
      // Axios request invocation
      const response = await axios.get(`${API_URL}/franchises/getAllFranchiseByStatus/${statusParam}`);
      
      // Axios automatically passes the parsed body under the .data key. 
      // Your backend returns your array wrapped inside a secondary data key: { data: [...] }
      const rawRecords = response.data?.data || [];
      const fetchedRecords = Array.isArray(rawRecords) ? rawRecords : [];
      
      // Cleanly maps MongoDB model architecture to client UI state mapping
      const normalizedRecords = fetchedRecords.map((item) => ({
        id: item._id || item.id,
        brandName: item.brandName || "N/A",
        owner: {
          firstName: item.owner?.firstName || "",
          lastName: item.owner?.lastName || "",
          email: item.owner?.email || "",
          phone: item.owner?.phone || "",
          taxId: item.owner?.taxId || "N/A"
        },
        businessDetails: {
          legalName: item.businessDetails?.legalName || "N/A",
          tradeName: item.businessDetails?.tradeName || "N/A",
          incorporationType: item.businessDetails?.incorporationType || "N/A"
        },
        location: {
          addressLine1: item.location?.addressLine1 || "",
          addressLine2: item.location?.addressLine2 || "",
          city: item.location?.city || "",
          state: item.location?.state || "",
          postalCode: item.location?.postalCode || "",
          country: item.location?.country || "US",
          coordinates: item.location?.coordinates || { type: "Point", coordinates: [0, 0] }
        },
        agreement: {
          // Fallback parsing handles native MongoDB ISO strings safely
          signedDate: item.agreement?.signedDate ? new Date(item.agreement.signedDate).toLocaleDateString() : "N/A",
          expiryDate: item.agreement?.expiryDate ? new Date(item.agreement.expiryDate).toLocaleDateString() : "N/A",
          initialFeePaid: item.agreement?.initialFeePaid || 0,
          royaltyPercentage: item.agreement?.royaltyPercentage || 0,
          marketingFeePercentage: item.agreement?.marketingFeePercentage || 0,
          contractDocumentUrl: item.agreement?.contractDocumentUrl || ""
        },
        compliance: {
          isBackgroundCheckPassed: item.compliance?.isBackgroundCheckPassed || false,
          insuranceExpiryDate: item.compliance?.insuranceExpiryDate || null,
          lastInspectionDate: item.compliance?.lastInspectionDate || null
        },
        notes: item.notes || "",
        status: item.status // 'Applied', 'Approved', 'Suspended', etc.
      }));

      setApprovalsList(normalizedRecords);
    } catch (error) {
      console.error("Fetch Execution Error:", error.response?.data || error.message);
      toast.error("Could not synchronize data with server records.");
      setApprovalsList([]); // Gracefully clear view state on critical runtime failure
    } finally {
      setIsLoading(false);
    }
  };

  // Re-fetch records whenever active status viewport parameters toggle
  useEffect(() => {
    fetchFranchiseData();
  }, [activeTab]);

  // ── 2. PROCESS ACTION DISPATCHER ──────────────────────────
  const processApproval = async (id, actionString) => {
    const targetStatus = actionString === "approved" ? "Approved" : "Rejected";

    try {
      const response = await axios.patch(`${API_URL}/franchises/franchiseStatusUpdate/${id}`, 
        { status: targetStatus },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true
        }
      );

      // Check for any successful HTTP status code (200, 201, 204)
      if (response.status === 200 || response.status === 201 || response.status === 204) {
        toast.success(`Registration updated to: ${targetStatus}`);
        
        // Close modal view and hot-reload database tracking records
        setSelectedFranchise(null);
        fetchFranchiseData();
      } else {
        // If it's a 3xx, 4xx, or 5xx that didn't throw an Axios error
        throw new Error(response.data?.message || `Server returned status status code: ${response.status}`);
      }
    } catch (err) {
      // Print what the backend actually sent back to help pinpoint validation errors
      console.error("Status Change Error Context:", err.response?.data || err.message);
      
      const serverFeedback = err.response?.data?.message || err.message;
      toast.error(`Failed to update status: ${serverFeedback}`);
    }
  };

  // ── 3. SEARCH OPERATIONS TRACKING HANDLERS ────────────────
  const handleSearchTrigger = () => {
    setAppliedSearch(searchQuery);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setAppliedSearch("");
  };

  // ── 4. EXPLORATORY FILTER COMPILATION ──────────────────────
  const filteredRequests = approvalsList.filter((item) => {
    if (!appliedSearch.trim()) return true;

    const searchLower = appliedSearch.toLowerCase();
    const fullName = `${item.owner.firstName} ${item.owner.lastName}`.toLowerCase();
    
    return (
      (item.brandName || "").toLowerCase().includes(searchLower) ||
      fullName.includes(searchLower) ||
      (item.location?.city || "").toLowerCase().includes(searchLower) ||
      (item.id || "").toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="container-fluid py-5 bg-light-smooth min-vh-100">
      {/* Hero Header Banner */}
      <div className="card border-0 rounded-4 shadow-sm mb-4 bg-white overflow-hidden position-relative">
        <div className="accent-glow-strip"></div>
        <div className="card-body p-4">
          <div className="d-flex align-items-center gap-3">
            <div className="p-3 bg-dark text-white rounded-3 shadow-sm d-flex align-items-center justify-content-center">
              <FaBuilding size={24} />
            </div>
            <div>
              <h3 className="fw-black text-dark mb-1 tracking-tight">Registration Gatekeeper</h3>
              <p className="text-muted mb-0 small">Review, verify, and authenticate incoming nested franchise entity records.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Controls Bar */}
      <div className="card border-0 rounded-4 shadow-sm p-3 mb-4 bg-white">
        <div className="row g-3 align-items-center">
          <div className="col-12 col-lg-6">
            <div className="d-inline-flex p-1.5 bg-light rounded-3 w-100 w-sm-auto">
              <button
                className={`btn btn-sm rounded-2 border-0 fw-bold px-3 py-2 transition-all d-flex align-items-center gap-2 justify-content-center ${activeTab === "Applied" ? "bg-white text-dark shadow-sm" : "text-secondary"}`}
                onClick={() => setActiveTab("Applied")}
              >
                <FaInbox size={13} className={activeTab === "Applied" ? "text-primary" : ""} />
                Pending Verification
              </button>
              <button
                className={`btn btn-sm rounded-2 border-0 fw-bold px-3 py-2 transition-all d-flex align-items-center gap-2 justify-content-center ${activeTab === "history" ? "bg-white text-dark shadow-sm" : "text-secondary"}`}
                onClick={() => setActiveTab("history")}
              >
                <FaHistory size={13} className={activeTab === "history" ? "text-success" : ""} />
                Resolution History
              </button>
            </div>
          </div>

          <div className="col-12 col-lg-6">
            <div className="input-group">
              <div className="position-relative flex-grow-1">
                <input
                  type="text"
                  className="form-control border-light-subtle rounded-start-3 ps-5 pe-4 py-2 text-sm search-input-field w-100"
                  placeholder="Search by brand name, owner, ID or city..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearchTrigger()}
                  style={{ borderTopRightRadius: 0, borderBottomRightRadius: 0 }}
                />
                <div className="position-absolute top-50 start-0 translate-middle-y ps-3 text-muted pointer-events-none" style={{ zIndex: 5 }}>
                  <FaSearch size={14} />
                </div>
                {searchQuery && (
                  <button type="button" className="position-absolute top-50 end-0 translate-middle-y border-0 bg-transparent pe-3 text-muted" style={{ zIndex: 5 }} onClick={handleClearSearch}>
                    <FaTimes size={12} />
                  </button>
                )}
              </div>
              <button className="btn btn-dark px-4 fw-bold text-sm rounded-end-3" type="button" onClick={handleSearchTrigger}>Search</button>
            </div>
          </div>
        </div>
      </div>

      {appliedSearch && (
        <div className="mb-3 d-flex align-items-center gap-2">
          <span className="text-muted small">Showing results for:</span>
          <span className="badge bg-dark-subtle text-dark border px-2.5 py-1.5 rounded-3 font-monospace d-inline-flex align-items-center gap-2 small">
            "{appliedSearch}"
            <FaTimes className="cursor-pointer text-secondary" onClick={handleClearSearch} size={10} />
          </span>
        </div>
      )}

      {/* ── CONDITIONAL RENDER CORE VIEW DATA STRIP ─────────────────────── */}
      {isLoading ? (
        <div className="col-12 text-center py-5">
          <FaSpinner size={32} className="text-dark animate-spin mb-2" />
          <p className="text-muted small">Loading documents from registration database...</p>
        </div>
      ) : filteredRequests.length === 0 ? (
        <div className="col-12">
          <div className="card text-center border-0 rounded-4 shadow-sm py-5 bg-white">
            <div className="card-body py-4">
              <div className="text-muted mb-3 opacity-20"><FaBuilding size={48} /></div>
              <h5 className="fw-bold text-dark mb-1">No Results Tracked</h5>
              <p className="text-muted small mb-0">We couldn't locate any records matching your confirmed parameters.</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="row g-3">
          {filteredRequests.map((request) => (
            <div className="col-12" key={request.id}>
              <div 
                className="card border rounded-4 shadow-sm bg-white overflow-hidden registration-row-card transition-all cursor-pointer"
                onClick={() => setSelectedFranchise(request)}
              >
                <div className="card-body p-4">
                  <div className="row align-items-center g-3">
                    <div className="col-12 col-md-5 col-xl-4">
                      <div className="d-flex align-items-center gap-3">
                        <div className="avatar-brand-icon bg-primary bg-opacity-10 text-primary rounded-3 d-flex align-items-center justify-content-center border border-primary-subtle border-opacity-20 fw-bold font-monospace">
                          {request.brandName.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div className="d-flex align-items-center gap-2 flex-wrap mb-1">
                            <h5 className="fw-bold text-dark mb-0 tracking-tight">{request.brandName}</h5>
                            <span className="badge font-monospace font-weight-normal text-muted bg-light border px-2 py-0.5 rounded-3 text-xs">
                              {request.id ? request.id.slice(-6) : "N/A"}
                            </span>
                          </div>
                          <div className="text-muted text-sm d-flex align-items-center gap-1.5">
                            <FaUser size={10} className="text-secondary" />
                            <span>Owner: <strong className="text-dark fw-semibold">{request.owner.firstName} {request.owner.lastName}</strong></span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="col-6 col-md-3 col-xl-3 border-start-md ps-md-4">
                      <small className="text-muted d-block font-monospace text-uppercase x-small">Operational Hub</small>
                      <span className="text-dark fw-bold text-sm d-flex align-items-center gap-1.5 mt-1">
                        <FaMapMarkerAlt className="text-danger" size={12} /> {request.location.city || "N/A"}, {request.location.state || ""}
                      </span>
                    </div>

                    <div className="col-6 col-md-2 col-xl-2">
                      <small className="text-muted d-block font-monospace text-uppercase x-small">Submission Date</small>
                      <span className="text-dark fw-bold text-sm d-flex align-items-center gap-1.5 mt-1">
                        <FaCalendarAlt className="text-primary" size={11} /> {request.agreement.signedDate}
                      </span>
                    </div>

                    <div className="col-12 col-md-2 col-xl-3 d-flex justify-content-md-end align-items-center" onClick={(e) => e.stopPropagation()}>
                      {request.status === "Applied" ? (
                        <button 
                          className="btn btn-dark btn-sm fw-bold rounded-3 px-3 py-2 text-xs d-flex align-items-center gap-1.5 shadow-sm"
                          onClick={() => setSelectedFranchise(request)}
                        >
                          <FaEye size={12} /> Inspect Request
                        </button>
                      ) : (
                        <div>
                          {request.status === "Approved" ? (
                            <span className="badge-premium bg-success-premium text-success"><FaCheckCircle size={12} className="me-1" /> Approved</span>
                          ) : (
                            <span className="badge-premium bg-danger-premium text-danger"><FaTimesCircle size={12} className="me-1" /> Denied</span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── HIGH VALUE DETAILED DISCOVERY INSPECTOR MODAL ─────────────────── */}
      {selectedFranchise && (
        <>
          <div className="modal-backdrop fade show" style={{ backdropFilter: "blur(4px)", backgroundColor: "rgba(15, 23, 42, 0.25)" }} onClick={() => setSelectedFranchise(null)}></div>
          <div className="modal fade show d-block overflow-y-auto" tabIndex="-1" role="dialog">
            <div className="modal-dialog modal-dialog-centered modal-lg" role="document">
              <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
                
                <div className="modal-header bg-dark text-white border-0 px-4 py-3.5 d-flex align-items-center justify-content-between">
                  <div className="d-flex align-items-center gap-2.5">
                    <FaBuilding size={18} className="text-primary-subtle" />
                    <div>
                      <h5 className="modal-title fw-bold mb-0 text-white tracking-tight">{selectedFranchise.brandName}</h5>
                      <span className="text-white-50 font-monospace extra-small px-2 py-0.5 rounded bg-white bg-opacity-10 border border-white border-opacity-10">{selectedFranchise.id}</span>
                    </div>
                  </div>
                  <button type="button" className="btn-close btn-close-white shadow-none" onClick={() => setSelectedFranchise(null)}></button>
                </div>

                <div className="modal-body p-4 bg-light-smooth">
                  
                  {/* Section 1: Business Profile & Legal Entities */}
                  <div className="card border-0 shadow-sm rounded-3 mb-3 p-3 bg-white">
                    <h6 className="fw-bold text-dark border-bottom pb-2 mb-2.5 d-flex align-items-center gap-2 text-sm">
                      <FaUser className="text-primary" size={13} /> Corporate Identity & Proprietor Details
                    </h6>
                    <div className="row g-3">
                      <div className="col-md-6 col-12">
                        <label className="text-muted d-block font-monospace text-uppercase extra-small mb-0.5">Legal Business Entity Name</label>
                        <span className="text-dark fw-bold text-sm">{selectedFranchise.businessDetails.legalName}</span>
                      </div>
                      <div className="col-md-3 col-6">
                        <label className="text-muted d-block font-monospace text-uppercase extra-small mb-0.5">Trade Name</label>
                        <span className="text-dark fw-semibold text-sm">{selectedFranchise.businessDetails.tradeName}</span>
                      </div>
                      <div className="col-md-3 col-6">
                        <label className="text-muted d-block font-monospace text-uppercase extra-small mb-0.5">Incorporation Profile</label>
                        <span className="badge bg-secondary bg-opacity-10 text-secondary fw-bold rounded-2 text-xs py-1 px-2">{selectedFranchise.businessDetails.incorporationType}</span>
                      </div>
                      <div className="col-md-4 col-12 border-top pt-2.5 mt-2.5">
                        <label className="text-muted d-block font-monospace text-uppercase extra-small mb-0.5">Authorized Proprietor</label>
                        <span className="text-dark fw-bold text-sm">{selectedFranchise.owner.firstName} {selectedFranchise.owner.lastName}</span>
                      </div>
                      <div className="col-md-4 col-6 border-top pt-2.5 mt-2.5">
                        <label className="text-muted d-block font-monospace text-uppercase extra-small mb-0.5">Tax Identification Code</label>
                        <span className="text-dark font-monospace fw-semibold text-sm">{selectedFranchise.owner.taxId}</span>
                      </div>
                      <div className="col-md-4 col-6 border-top pt-2.5 mt-2.5">
                        <label className="text-muted d-block font-monospace text-uppercase extra-small mb-0.5">Contact Line</label>
                        <span className="text-dark d-block text-xs font-semibold"><FaPhoneAlt size={10} className="text-muted me-1" /> {selectedFranchise.owner.phone}</span>
                        <span className="text-muted d-block text-xs text-truncate"><FaEnvelope size={10} className="text-muted me-1" /> {selectedFranchise.owner.email}</span>
                      </div>
                    </div>
                  </div>

                  {/* Section 2: Precise Address Metrics */}
                  <div className="card border-0 shadow-sm rounded-3 mb-3 p-3 bg-white">
                    <h6 className="fw-bold text-dark border-bottom pb-2 mb-2.5 d-flex align-items-center gap-2 text-sm">
                      <FaMapMarkerAlt className="text-danger" size={13} /> Registered Hub Location Parameters
                    </h6>
                    <div className="row g-3">
                      <div className="col-md-8 col-12">
                        <label className="text-muted d-block font-monospace text-uppercase extra-small mb-0.5">Physical Address Lines</label>
                        <span className="text-dark text-sm fw-medium d-block">{selectedFranchise.location.addressLine1}</span>
                        {selectedFranchise.location.addressLine2 && <span className="text-muted text-xs d-block">{selectedFranchise.location.addressLine2}</span>}
                      </div>
                      <div className="col-md-4 col-12">
                        <label className="text-muted d-block font-monospace text-uppercase extra-small mb-0.5">Region Metadata</label>
                        <span className="text-dark fw-semibold text-sm d-block">{selectedFranchise.location.city}, {selectedFranchise.location.state}</span>
                        <span className="text-muted text-xs font-monospace">{selectedFranchise.location.postalCode} | {selectedFranchise.location.country}</span>
                      </div>
                      <div className="col-12 border-top pt-2 mt-2 bg-light rounded-2 p-2">
                        <span className="text-secondary extra-small font-monospace text-uppercase d-block mb-1">Geospatial Coordinates [Lng, Lat]</span>
                        <div className="d-flex gap-4 font-monospace text-xs text-dark fw-bold">
                          <span>Longitude (X): <span className="text-primary">{selectedFranchise.location.coordinates?.coordinates[0] || 0}</span></span>
                          <span>Latitude (Y): <span className="text-primary">{selectedFranchise.location.coordinates?.coordinates[1] || 0}</span></span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Section 3: Legal Agreement & Commercial Parameters */}
                  <div className="card border-0 shadow-sm rounded-3 mb-3 p-3 bg-white">
                    <h6 className="fw-bold text-dark border-bottom pb-2 mb-2.5 d-flex align-items-center gap-2 text-sm">
                      <FaFileContract className="text-success" size={13} /> Legal Agreement & Revenue Splitting Terms
                    </h6>
                    <div className="row g-3">
                      <div className="col-md-4 col-6">
                        <label className="text-muted d-block font-monospace text-uppercase extra-small mb-0.5"><FaDollarSign size={10} /> Initial Franchise Fee</label>
                        <span className="text-dark fw-black text-sm">₹{Number(selectedFranchise.agreement.initialFeePaid).toLocaleString('en-IN')}</span>
                      </div>
                      <div className="col-md-4 col-6">
                        <label className="text-muted d-block font-monospace text-uppercase extra-small mb-0.5"><FaPercent size={10} /> Royalty Demand Share</label>
                        <span className="text-dark fw-bold text-sm">{selectedFranchise.agreement.royaltyPercentage}% of Gross</span>
                      </div>
                      <div className="col-md-4 col-12">
                        <label className="text-muted d-block font-monospace text-uppercase extra-small mb-0.5"><FaPercent size={10} /> Marketing Budget Share</label>
                        <span className="text-dark fw-semibold text-sm">{selectedFranchise.agreement.marketingFeePercentage}%</span>
                      </div>
                      <div className="col-md-4 col-6 border-top pt-2.5 mt-2.5">
                        <label className="text-muted d-block font-monospace text-uppercase extra-small mb-0.5">Signing Execution Date</label>
                        <span className="text-dark text-sm fw-medium">{selectedFranchise.agreement.signedDate}</span>
                      </div>
                      <div className="col-md-4 col-6 border-top pt-2.5 mt-2.5">
                        <label className="text-muted d-block font-monospace text-uppercase extra-small mb-0.5">Contract Expiry Boundary</label>
                        <span className="text-danger text-sm fw-bold">{selectedFranchise.agreement.expiryDate}</span>
                      </div>
                      <div className="col-md-4 col-12 border-top pt-2.5 mt-2.5">
                        <label className="text-muted d-block font-monospace text-uppercase extra-small mb-0.5">Contract Record</label>
                        {selectedFranchise.agreement.contractDocumentUrl ? (
                          <a href={selectedFranchise.agreement.contractDocumentUrl} target="_blank" rel="noreferrer" className="btn btn-xs btn-outline-primary py-0.5 px-2 font-sans fw-bold rounded text-xs mt-0.5 d-inline-flex align-items-center gap-1">
                            View Executed PDF
                          </a>
                        ) : (
                          <span className="text-muted text-xs italic">No document file attached</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {selectedFranchise.notes && (
                    <div className="bg-warning bg-opacity-10 border border-warning-subtle rounded-3 p-3">
                      <span className="text-warning-dark fw-bold text-xs font-monospace d-block text-uppercase mb-1">Administrative Submission Notes</span>
                      <p className="text-dark small mb-0 font-medium">{selectedFranchise.notes}</p>
                    </div>
                  )}

                </div>

                <div className="modal-footer bg-white border-top p-3 d-flex justify-content-between align-items-center">
                  <div>
                    <span className="text-muted extra-small">Current Status:</span>
                    <span className={`badge ms-1.5 rounded-pill px-2.5 py-1 text-xs fw-semibold ${selectedFranchise.status === 'Applied' ? 'bg-warning text-dark' : selectedFranchise.status === 'Approved' ? 'bg-success text-white' : 'bg-danger text-white'}`}>
                      {selectedFranchise.status ? selectedFranchise.status.toUpperCase() : "UNKNOWN"}
                    </span>
                  </div>
                  
                  <div className="d-flex gap-2">
                    <button type="button" className="btn btn-light border btn-sm px-3 fw-bold rounded-3 text-secondary" onClick={() => setSelectedFranchise(null)}>Close</button>
                    {selectedFranchise.status === "Applied" && (
                      <>
                        <button
                          className="btn btn-danger btn-sm px-3 fw-bold rounded-3"
                          onClick={() => processApproval(selectedFranchise.id, "rejected")}
                        >
                          Decline Request
                        </button>
                        <button
                          className="btn btn-dark btn-sm px-3.5 fw-bold rounded-3 shadow-sm d-flex align-items-center gap-1"
                          onClick={() => processApproval(selectedFranchise.id, "approved")}
                        >
                          Approve Registration <FaChevronRight size={10} />
                        </button>
                      </>
                    )}
                  </div>
                </div>

              </div>
            </div>
          </div>
        </>
      )}

      <style>{`
        .bg-light-smooth { background-color: #f8fafc; }
        .fw-black { font-weight: 800; }
        .tracking-tight { letter-spacing: -0.025em; }
        .x-small { font-size: 0.65rem; letter-spacing: 0.05em; font-weight: 600; }
        .extra-small { font-size: 0.7rem; font-weight: 500; }
        .text-xs { font-size: 0.775rem; }
        .text-sm { font-size: 0.85rem; }
        .gap-1.5 { gap: 0.35rem; }
        .gap-2.5 { gap: 0.65rem; }
        .px-3.5 { padding-left: 1.15rem; padding-right: 1.15rem; }
        .py-3.5 { padding-top: 0.85rem; padding-bottom: 0.85rem; }
        .mb-2.5 { margin-bottom: 0.65rem; }
        .pt-2.5 { padding-top: 0.65rem; }
        .mt-2.5 { margin-top: 0.65rem; }
        .cursor-pointer { cursor: pointer; }
        .text-warning-dark { color: #854d0e; }
        
        .animate-spin {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .accent-glow-strip {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(90deg, #0d6efd 0%, #10b981 100%);
        }

        .avatar-brand-icon {
          width: 44px;
          height: 44px;
          flex-shrink: 0;
          font-size: 1.05rem;
        }

        .transition-all { transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1); }
        
        .search-input-field:focus {
          border-color: #cbd5e1 !important;
          box-shadow: none !important;
        }

        .registration-row-card {
          border-color: #e2e8f0 !important;
        }
        .registration-row-card:hover {
          transform: translateY(-1.5px);
          box-shadow: 0 10px 25px rgba(15, 23, 42, 0.05) !important;
          border-color: #cbd5e1 !important;
        }

        .badge-premium {
          display: inline-flex;
          align-items: center;
          padding: 0.4rem 0.75rem;
          font-size: 0.75rem;
          font-weight: 700;
          border-radius: 50px;
        }
        .bg-success-premium { background-color: #edfbf4; border: 1px solid #d1f5e3; }
        .bg-danger-premium { background-color: #fef3f3; border: 1px solid #fee2e2; }

        .btn-xs {
          padding: 0.2rem 0.4rem;
          font-size: 0.725rem;
        }

        @media(min-width: 768px) {
          .border-start-md { border-left: 1px solid #e2e8f0 !important; }
        }
      `}</style>
    </div>
  );
}