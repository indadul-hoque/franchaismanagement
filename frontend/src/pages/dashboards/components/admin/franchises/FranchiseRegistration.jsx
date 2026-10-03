import React, { useState, useEffect } from "react";
import { FiX } from "react-icons/fi";

const defaultForm = {
  brandName: "",
  owner: { firstName: "", lastName: "", email: "", phone: "", taxId: "" },
  businessDetails: { legalName: "", tradeName: "", incorporationType: "LLC" },
  location: {
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "US",
    longitude: 0,
    latitude: 0,
  },
  agreement: {
    signedDate: "",
    expiryDate: "",
    initialFeePaid: 0,
    royaltyPercentage: 5,
    marketingFeePercentage: 2,
    contractDocumentUrl: "",
  },
  status: "Applied",
  compliance: {
    isBackgroundCheckPassed: false,
    insuranceExpiryDate: "",
    lastInspectionDate: "",
  },
  password: "",
};

export default function FranchiseRegistration({
  isOpen,
  mode = "add", // 'add' | 'edit'
  initialData = null,
  onClose,
  onSubmit,
}) {
  const [formData, setFormData] = useState(defaultForm);

  // Sync state when modal opens or initialData changes
  useEffect(() => {
    if (mode === "edit" && initialData) {
      setFormData({
        ...initialData,
        location: {
          ...initialData.location,
          longitude: initialData.location?.coordinates?.coordinates?.[0] || 0,
          latitude: initialData.location?.coordinates?.coordinates?.[1] || 0,
        },
        agreement: {
          ...initialData.agreement,
          signedDate: initialData.agreement?.signedDate
            ? initialData.agreement.signedDate.split("T")[0]
            : "",
          expiryDate: initialData.agreement?.expiryDate
            ? initialData.agreement.expiryDate.split("T")[0]
            : "",
        },
        compliance: {
          ...initialData.compliance,
          insuranceExpiryDate: initialData.compliance?.insuranceExpiryDate
            ? initialData.compliance.insuranceExpiryDate.split("T")[0]
            : "",
          lastInspectionDate: initialData.compliance?.lastInspectionDate
            ? initialData.compliance.lastInspectionDate.split("T")[0]
            : "",
        },
        password: "",
      });
    } else {
      setFormData(defaultForm);
    }
  }, [mode, initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
      location: {
        addressLine1: formData.location.addressLine1,
        addressLine2: formData.location.addressLine2,
        city: formData.location.city,
        state: formData.location.state,
        postalCode: formData.location.postalCode,
        country: formData.location.country || "US",
        coordinates: {
          type: "Point",
          coordinates: [
            Number(formData.location.longitude) || 0,
            Number(formData.location.latitude) || 0,
          ],
        },
      },
    };

    onSubmit(payload);
  };

  return (
    <div
      className="modal fade show d-block bg-dark bg-opacity-50"
      tabIndex="-1"
    >
      <div className="modal-dialog modal-dialog-centered modal-xl">
        <div className="modal-content border-0 rounded-4 shadow">
          <div className="modal-header border-bottom pb-3">
            <h5 className="modal-title fw-bold">
              {mode === "add"
                ? "Register New Franchise"
                : "Edit Franchise Record"}
            </h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
            ></button>
          </div>

          <form onSubmit={handleSubmit}>
            <div
              className="modal-body py-3"
              style={{ maxHeight: "75vh", overflowY: "auto" }}
            >
              {/* --- Section 1: General & Owner --- */}
              <h6 className="fw-bold text-primary mb-3">
                1. Brand & Owner Credentials
              </h6>
              <div className="row g-3 mb-4">
                <div className="col-12 col-md-6">
                  <label className="form-label fs-7 fw-semibold text-secondary">
                    Brand Name *
                  </label>
                  <input
                    type="text"
                    required
                    className="form-control form-control-sm rounded-3"
                    value={formData.brandName}
                    onChange={(e) =>
                      setFormData({ ...formData, brandName: e.target.value })
                    }
                  />
                </div>

                <div className="col-12 col-md-6">
                  <label className="form-label fs-7 fw-semibold text-secondary">
                    Password *
                  </label>
                  <input
                    type="password"
                    required={mode === "add"}
                    placeholder={
                      mode === "edit" ? "Leave blank to keep current" : ""
                    }
                    className="form-control form-control-sm rounded-3"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                  />
                </div>

                <div className="col-12 col-md-3">
                  <label className="form-label fs-7 fw-semibold text-secondary">
                    Owner First Name *
                  </label>
                  <input
                    type="text"
                    required
                    className="form-control form-control-sm rounded-3"
                    value={formData.owner.firstName}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        owner: { ...formData.owner, firstName: e.target.value },
                      })
                    }
                  />
                </div>

                <div className="col-12 col-md-3">
                  <label className="form-label fs-7 fw-semibold text-secondary">
                    Owner Last Name *
                  </label>
                  <input
                    type="text"
                    required
                    className="form-control form-control-sm rounded-3"
                    value={formData.owner.lastName}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        owner: { ...formData.owner, lastName: e.target.value },
                      })
                    }
                  />
                </div>

                <div className="col-12 col-md-3">
                  <label className="form-label fs-7 fw-semibold text-secondary">
                    Owner Email *
                  </label>
                  <input
                    type="email"
                    required
                    className="form-control form-control-sm rounded-3"
                    value={formData.owner.email}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        owner: { ...formData.owner, email: e.target.value },
                      })
                    }
                  />
                </div>

                <div className="col-12 col-md-3">
                  <label className="form-label fs-7 fw-semibold text-secondary">
                    Owner Phone *
                  </label>
                  <input
                    type="text"
                    required
                    className="form-control form-control-sm rounded-3"
                    value={formData.owner.phone}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        owner: { ...formData.owner, phone: e.target.value },
                      })
                    }
                  />
                </div>

                <div className="col-12 col-md-4">
                  <label className="form-label fs-7 fw-semibold text-secondary">
                    Tax ID / EIN *
                  </label>
                  <input
                    type="text"
                    required
                    className="form-control form-control-sm rounded-3"
                    value={formData.owner.taxId}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        owner: { ...formData.owner, taxId: e.target.value },
                      })
                    }
                  />
                </div>

                <div className="col-12 col-md-4">
                  <label className="form-label fs-7 fw-semibold text-secondary">
                    Legal Business Name *
                  </label>
                  <input
                    type="text"
                    required
                    className="form-control form-control-sm rounded-3"
                    value={formData.businessDetails.legalName}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        businessDetails: {
                          ...formData.businessDetails,
                          legalName: e.target.value,
                        },
                      })
                    }
                  />
                </div>

                <div className="col-12 col-md-4">
                  <label className="form-label fs-7 fw-semibold text-secondary">
                    Incorporation Type *
                  </label>
                  <select
                    className="form-select form-select-sm rounded-3"
                    value={formData.businessDetails.incorporationType}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        businessDetails: {
                          ...formData.businessDetails,
                          incorporationType: e.target.value,
                        },
                      })
                    }
                  >
                    <option value="LLC">LLC</option>
                    <option value="Corporation">Corporation</option>
                    <option value="Partnership">Partnership</option>
                    <option value="Sole Proprietorship">
                      Sole Proprietorship
                    </option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              {/* --- Section 2: Geographic Mapping --- */}
              <h6 className="fw-bold text-primary mb-3">
                2. Location & Coordinates
              </h6>
              <div className="row g-3 mb-4">
                <div className="col-12 col-md-6">
                  <label className="form-label fs-7 fw-semibold text-secondary">
                    Address Line 1 *
                  </label>
                  <input
                    type="text"
                    required
                    className="form-control form-control-sm rounded-3"
                    value={formData.location.addressLine1}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        location: {
                          ...formData.location,
                          addressLine1: e.target.value,
                        },
                      })
                    }
                  />
                </div>

                <div className="col-12 col-md-6">
                  <label className="form-label fs-7 fw-semibold text-secondary">
                    Address Line 2
                  </label>
                  <input
                    type="text"
                    className="form-control form-control-sm rounded-3"
                    value={formData.location.addressLine2}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        location: {
                          ...formData.location,
                          addressLine2: e.target.value,
                        },
                      })
                    }
                  />
                </div>

                <div className="col-6 col-md-3">
                  <label className="form-label fs-7 fw-semibold text-secondary">
                    City *
                  </label>
                  <input
                    type="text"
                    required
                    className="form-control form-control-sm rounded-3"
                    value={formData.location.city}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        location: {
                          ...formData.location,
                          city: e.target.value,
                        },
                      })
                    }
                  />
                </div>

                <div className="col-6 col-md-3">
                  <label className="form-label fs-7 fw-semibold text-secondary">
                    State *
                  </label>
                  <input
                    type="text"
                    required
                    className="form-control form-control-sm rounded-3"
                    value={formData.location.state}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        location: {
                          ...formData.location,
                          state: e.target.value,
                        },
                      })
                    }
                  />
                </div>

                <div className="col-6 col-md-3">
                  <label className="form-label fs-7 fw-semibold text-secondary">
                    Postal Code *
                  </label>
                  <input
                    type="text"
                    required
                    className="form-control form-control-sm rounded-3"
                    value={formData.location.postalCode}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        location: {
                          ...formData.location,
                          postalCode: e.target.value,
                        },
                      })
                    }
                  />
                </div>

                <div className="col-6 col-md-3">
                  <label className="form-label fs-7 fw-semibold text-secondary">
                    Country *
                  </label>
                  <input
                    type="text"
                    required
                    className="form-control form-control-sm rounded-3"
                    value={formData.location.country}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        location: {
                          ...formData.location,
                          country: e.target.value,
                        },
                      })
                    }
                  />
                </div>

                <div className="col-6 col-md-3">
                  <label className="form-label fs-7 fw-semibold text-secondary">
                    Longitude *
                  </label>
                  <input
                    type="number"
                    step="any"
                    required
                    className="form-control form-control-sm rounded-3"
                    value={formData.location.longitude}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        location: {
                          ...formData.location,
                          longitude: e.target.value,
                        },
                      })
                    }
                  />
                </div>

                <div className="col-6 col-md-3">
                  <label className="form-label fs-7 fw-semibold text-secondary">
                    Latitude *
                  </label>
                  <input
                    type="number"
                    step="any"
                    required
                    className="form-control form-control-sm rounded-3"
                    value={formData.location.latitude}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        location: {
                          ...formData.location,
                          latitude: e.target.value,
                        },
                      })
                    }
                  />
                </div>
              </div>

              {/* --- Section 3: Agreement Terms --- */}
              <h6 className="fw-bold text-primary mb-3">
                3. Contract Agreement & Status
              </h6>
              <div className="row g-3">
                <div className="col-6 col-md-3">
                  <label className="form-label fs-7 fw-semibold text-secondary">
                    Signed Date *
                  </label>
                  <input
                    type="date"
                    required
                    className="form-control form-control-sm rounded-3"
                    value={formData.agreement.signedDate}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        agreement: {
                          ...formData.agreement,
                          signedDate: e.target.value,
                        },
                      })
                    }
                  />
                </div>

                <div className="col-6 col-md-3">
                  <label className="form-label fs-7 fw-semibold text-secondary">
                    Expiry Date *
                  </label>
                  <input
                    type="date"
                    required
                    className="form-control form-control-sm rounded-3"
                    value={formData.agreement.expiryDate}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        agreement: {
                          ...formData.agreement,
                          expiryDate: e.target.value,
                        },
                      })
                    }
                  />
                </div>

                <div className="col-6 col-md-2">
                  <label className="form-label fs-7 fw-semibold text-secondary">
                    Initial Fee ($) *
                  </label>
                  <input
                    type="number"
                    required
                    className="form-control form-control-sm rounded-3"
                    value={formData.agreement.initialFeePaid}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        agreement: {
                          ...formData.agreement,
                          initialFeePaid: e.target.value,
                        },
                      })
                    }
                  />
                </div>

                <div className="col-6 col-md-2">
                  <label className="form-label fs-7 fw-semibold text-secondary">
                    Royalty (%) *
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    className="form-control form-control-sm rounded-3"
                    value={formData.agreement.royaltyPercentage}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        agreement: {
                          ...formData.agreement,
                          royaltyPercentage: e.target.value,
                        },
                      })
                    }
                  />
                </div>

                <div className="col-6 col-md-2">
                  <label className="form-label fs-7 fw-semibold text-secondary">
                    Marketing Fee (%)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    className="form-control form-control-sm rounded-3"
                    value={formData.agreement.marketingFeePercentage}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        agreement: {
                          ...formData.agreement,
                          marketingFeePercentage: e.target.value,
                        },
                      })
                    }
                  />
                </div>

                <div className="col-12 col-md-6">
                  <label className="form-label fs-7 fw-semibold text-secondary">
                    Status *
                  </label>
                  <select
                    className="form-select form-select-sm rounded-3"
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value })
                    }
                  >
                    <option value="Applied">Applied</option>
                    <option value="Pending">Pending</option>
                    <option value="Approved">Approved</option>
                    <option value="Under Construction">
                      Under Construction
                    </option>
                    <option value="Active">Active</option>
                    <option value="Suspended">Suspended</option>
                    <option value="Terminated">Terminated</option>
                  </select>
                </div>

                <div className="col-12 col-md-6">
                  <label className="form-label fs-7 fw-semibold text-secondary">
                    Background Check
                  </label>
                  <div className="form-check form-switch mt-2">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      checked={formData.compliance.isBackgroundCheckPassed}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          compliance: {
                            ...formData.compliance,
                            isBackgroundCheckPassed: e.target.checked,
                          },
                        })
                      }
                    />
                    <label className="form-check-label fs-7 text-dark">
                      Background Check Passed
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-footer border-top pt-2">
              <button
                type="button"
                className="btn btn-light btn-sm rounded-3"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary btn-sm rounded-3 px-4"
              >
                {mode === "add" ? "Save Record" : "Update Record"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
