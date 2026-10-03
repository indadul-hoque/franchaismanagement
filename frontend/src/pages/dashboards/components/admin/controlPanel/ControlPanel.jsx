import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import {
  FaThLarge,
  FaUserPlus,
  FaUsers,
  FaCalendarAlt,
  FaAward,
  FaDollarSign,
  FaCodeBranch,
  FaBookOpen,
  FaSlidersH,
  FaMapMarkerAlt,
  FaPlus,
  FaSpinner,
} from "react-icons/fa";

import { currentConfig } from "../../../../../utils";

const API_URL = currentConfig.API_URL;

const INITIAL_MODULES_CONFIG = {
  "/franchise/dashboard": {
    label: "Dashboard",
    enabled: false,
    icon: FaThLarge,
    color: "#0d6efd",
  },
  "/franchise/admissions": {
    label: "Admissions",
    enabled: false,
    icon: FaUserPlus,
    color: "#198754",
  },
  "/franchise/students": {
    label: "Students",
    enabled: false,
    icon: FaUsers,
    color: "#0dcaf0",
  },
  "/franchise/batches": {
    label: "Batches",
    enabled: false,
    icon: FaCalendarAlt,
    color: "#fd7e14",
  },
  "/franchise/staff": {
    label: "Staff",
    enabled: false,
    icon: FaAward,
    color: "#6f42c1",
  },
  "/franchise/billing": {
    label: "Finance",
    enabled: false,
    icon: FaDollarSign,
    color: "#ffc107",
  },
  "/franchise/branches": {
    label: "Branches",
    enabled: false,
    icon: FaCodeBranch,
    color: "#d63384",
  },
  "/franchise/courses": {
    label: "Courses",
    enabled: false,
    icon: FaBookOpen,
    color: "#20c997",
  },
};

export default function ControlPanel() {
  const [selectedTarget, setSelectedTarget] = useState("");
  const [franchiseData, setFranchiseData] = useState([]);
  const [fetchingFranchises, setFetchingFranchises] = useState(false);
  const [loadingConfig, setLoadingConfig] = useState(false);
  const [saving, setSaving] = useState(false);

  const [franchiseFeatures, setFranchiseFeatures] = useState(
    INITIAL_MODULES_CONFIG,
  );

  // 1. Fetch Franchises
  useEffect(() => {
    const fetchFranchises = async () => {
      setFetchingFranchises(true);
      try {
        const response = await axios.get(
          `${API_URL}/franchises/getAllFranchises`,
        );
        const franchises = response.data?.data || response.data || [];
        setFranchiseData(franchises);
      } catch (error) {
        console.error("Error fetching franchises:", error);
        toast.error("Failed to load franchises list.");
      } finally {
        setFetchingFranchises(false);
      }
    };

    fetchFranchises();
  }, []);

  // Target Metadata Helper
  const getTargetMetadata = (targetId) => {
    if (!targetId) return null;

    for (const franchise of franchiseData) {
      const fId = franchise._id || franchise.id;

      if (fId === targetId) {
        return {
          targetId: fId,
          targetType: "franchise",
          franchiseId: fId,
          branchId: null,
        };
      }

      if (Array.isArray(franchise.branches)) {
        const branch = franchise.branches.find(
          (b) => (b._id || b.id) === targetId,
        );
        if (branch) {
          const bId = branch._id || branch.id;
          return {
            targetId: bId,
            targetType: "branch",
            franchiseId: fId,
            branchId: bId,
          };
        }
      }
    }
    return null;
  };

  // -------------------------------------------------------------
  // UPDATED: Fetch Existing Module Permissions Call
  // -------------------------------------------------------------
  const fetchModulePermissions = async (targetId) => {
    if (!targetId) {
      setFranchiseFeatures(INITIAL_MODULES_CONFIG);
      return;
    }

    const meta = getTargetMetadata(targetId);
    if (!meta) return;

    setLoadingConfig(true);
    try {
      const response = await axios.get(
        `${API_URL}/modules/${meta.targetType}/${meta.targetId}`,
      );

      const savedModules = response.data?.data?.modules;

      if (savedModules && Array.isArray(savedModules)) {
        setFranchiseFeatures((prev) => {
          const updated = { ...INITIAL_MODULES_CONFIG };
          savedModules.forEach((mod) => {
            if (updated[mod.path]) {
              updated[mod.path] = {
                ...updated[mod.path],
                enabled: mod.enabled,
              };
            }
          });
          return updated;
        });

        toast.success("Loaded existing permissions", { icon: "🏢" });
      }
    } catch (error) {
      setFranchiseFeatures(INITIAL_MODULES_CONFIG);
      if (error.response?.status === 404) {
        toast("No permissions saved yet. Displaying default setup.", {
          icon: "ℹ️",
        });
      } else {
        toast.error("Failed to fetch module permissions.");
      }
    } finally {
      setLoadingConfig(false);
    }
  };

  const handleTargetChange = (e) => {
    const value = e.target.value;
    setSelectedTarget(value);
    fetchModulePermissions(value);
  };

  const toggleFeature = (targetPath) => {
    setFranchiseFeatures((prev) => ({
      ...prev,
      [targetPath]: { ...prev[targetPath], enabled: !prev[targetPath].enabled },
    }));
  };

  // Create Module API Call (Untouched)
  const handleCreateModule = async () => {
    if (!selectedTarget) {
      return toast.error("Please select a franchise or branch first!");
    }

    const meta = getTargetMetadata(selectedTarget);
    if (!meta) {
      return toast.error("Invalid target selection.");
    }

    const modulesArray = Object.entries(franchiseFeatures).map(
      ([path, data]) => ({
        path,
        moduleName: data.label,
        enabled: data.enabled,
      }),
    );

    const payload = {
      targetType: meta.targetType,
      franchiseId: meta.franchiseId,
      branchId: meta.branchId,
      modules: modulesArray,
    };

    setSaving(true);
    try {
      const response = await axios.post(
        `${API_URL}/modules/create-modules`,
        payload,
      );
      toast.success(response.data?.message || "Module created successfully!");
    } catch (error) {
      console.error("Create Module Error:", error);
      toast.error(error.response?.data?.message || "Failed to create module.");
    } finally {
      setSaving(false);
    }
  };

  const totalEnabled = Object.values(franchiseFeatures).filter(
    (f) => f.enabled,
  ).length;

  return (
    <div className="container py-4 bg-light min-vh-100">
      {/* HEADER BAR */}
      <div className="card border-0 shadow-sm mb-4 bg-white">
        <div className="card-body p-3 d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
          <div className="d-flex align-items-center gap-3">
            <div className="p-2.5 bg-primary text-white rounded-3">
              <FaSlidersH size={20} />
            </div>
            <div>
              <h4 className="fw-bold mb-0">Module Access Control</h4>
              <p className="text-muted small mb-0">
                Configure and create module access permissions.
              </p>
            </div>
          </div>

          <div className="d-flex align-items-center gap-2">
            <button
              className="btn btn-primary fw-bold px-4 d-flex align-items-center gap-2"
              onClick={handleCreateModule}
              disabled={saving || !selectedTarget || loadingConfig}
            >
              {saving ? (
                <FaSpinner className="spinner-border spinner-border-sm" />
              ) : (
                <FaPlus size={14} />
              )}
              {saving ? " Updating..." : "Update Modules"}
            </button>
          </div>
        </div>
      </div>

      {/* DROPDOWN & SUMMARY ROW */}
      <div className="card border-0 shadow-sm mb-4 bg-white p-3">
        <div className="row align-items-center g-3">
          <div className="col-12 col-md-7">
            <label className="form-label small fw-bold text-muted text-uppercase mb-1">
              Select Franchise / Branch
            </label>
            <div className="position-relative">
              <select
                className="form-select ps-5 fw-medium"
                value={selectedTarget}
                onChange={handleTargetChange}
                disabled={fetchingFranchises || loadingConfig}
              >
                <option value="">
                  {fetchingFranchises
                    ? "Loading franchises..."
                    : "-- Select Target --"}
                </option>

                {!fetchingFranchises &&
                  franchiseData.map((franchise) => {
                    const franchiseVal = franchise._id || franchise.id;
                    return (
                      <React.Fragment key={franchiseVal}>
                        <option value={franchiseVal} className="fw-bold">
                          🏢{" "}
                          {franchise.businessDetails?.legalName ||
                            "Unnamed Franchise"}
                        </option>

                        {Array.isArray(franchise.branches) &&
                          franchise.branches.map((branch) => {
                            const branchVal = branch._id || branch.id;
                            return (
                              <option key={branchVal} value={branchVal}>
                                &nbsp;&nbsp;&nbsp;&nbsp;└─ 📍{" "}
                                {branch.name ||
                                  branch.branchName ||
                                  "Unnamed Branch"}
                              </option>
                            );
                          })}
                      </React.Fragment>
                    );
                  })}
              </select>
              <div className="position-absolute top-50 start-0 translate-middle-y ps-3 text-muted">
                {fetchingFranchises ? (
                  <FaSpinner className="spinner-border spinner-border-sm" />
                ) : (
                  <FaMapMarkerAlt size={15} />
                )}
              </div>
            </div>
          </div>

          <div className="col-12 col-md-5 d-flex justify-content-md-end gap-2">
            <span className="badge bg-success-subtle text-success border border-success-subtle px-3 py-2 fw-medium">
              Enabled: {totalEnabled}
            </span>
            <span className="badge bg-secondary-subtle text-secondary border border-secondary-subtle px-3 py-2 fw-medium">
              Disabled: {Object.keys(franchiseFeatures).length - totalEnabled}
            </span>
          </div>
        </div>
      </div>

      {/* MODULE CARDS LIST */}
      <div className="card border-0 shadow-sm bg-white p-4">
        <h6 className="fw-bold mb-3 text-dark">Available Modules</h6>
        {loadingConfig ? (
          <div className="text-center py-5">
            <FaSpinner className="spinner-border text-primary mb-2" />
            <p className="text-muted small">Loading permissions...</p>
          </div>
        ) : (
          <div className="row g-3">
            {Object.entries(franchiseFeatures).map(([path, data]) => {
              const IconComponent = data.icon;
              return (
                <div key={path} className="col-12 col-lg-6">
                  <div className="d-flex align-items-center justify-content-between p-3 border rounded-3 bg-white shadow-sm h-100">
                    <div className="d-flex align-items-center gap-3">
                      <div
                        className="p-2 rounded d-flex align-items-center justify-content-center"
                        style={{
                          backgroundColor: data.enabled
                            ? `${data.color}18`
                            : "#f8f9fa",
                        }}
                      >
                        <IconComponent
                          size={18}
                          style={{
                            color: data.enabled ? data.color : "#adb5bd",
                          }}
                        />
                      </div>
                      <div>
                        <span
                          className={`fw-semibold d-block ${!data.enabled ? "text-muted" : ""}`}
                        >
                          {data.label}
                        </span>
                        <code className="text-muted small">{path}</code>
                      </div>
                    </div>

                    <div className="form-check form-switch m-0">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        role="switch"
                        checked={data.enabled}
                        onChange={() => toggleFeature(path)}
                        style={{
                          width: "2.2em",
                          height: "1.1em",
                          cursor: "pointer",
                        }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
