import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { PDFDownloadLink } from "@react-pdf/renderer";
import {
  FaArrowLeft,
  FaCheckCircle,
  FaWallet,
  FaCreditCard,
  FaUniversity,
  FaTruck,
} from "react-icons/fa";
import { v4 as uuidv4 } from "uuid";
import Invoice from "../payments/Invoice";

const ProductPaymentForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    paymentMode: "",
  });

  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [transaction, setTransaction] = useState(null);
  const [isDownloaded, setIsDownloaded] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);

  useEffect(() => {
    const storedOrder = JSON.parse(localStorage.getItem("orderDetails"));
    if (storedOrder) {
      setOrderDetails(storedOrder);
      setFormData((prev) => ({
        ...prev,
        name: storedOrder.address.name || "",
        email: "",
        paymentMode: "",
      }));
    }
  }, []);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (
      !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formData.email)
    )
      newErrors.email = "Invalid email address";
    if (!formData.paymentMode)
      newErrors.paymentMode = "Please select a payment mode";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm() && orderDetails) {
      const newTransaction = {
        ...formData,
        id: uuidv4().substring(0, 8).toUpperCase(), // Clean short order token ID
        date: new Date().toISOString(),
        amount: orderDetails.totalPayable,
        productName: orderDetails.cart.map((item) => item.name).join(", "),
        items: orderDetails.cart,
        shippingAddress: orderDetails.address,
      };
      setTransaction(newTransaction);
      setIsDownloaded(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Real-time micro-validation fixes
    if (name === "name" && !value.trim()) {
      setErrors((prev) => ({ ...prev, name: "Name is required" }));
    } else if (
      name === "email" &&
      !/^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/.test(value)
    ) {
      setErrors((prev) => ({ ...prev, email: "Invalid email address" }));
    } else {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handlePaymentModeSelect = (mode) => {
    setFormData((prev) => ({ ...prev, paymentMode: mode }));
    setErrors((prev) => ({ ...prev, paymentMode: "" }));
  };

  const handleDownload = () => {
    setTimeout(() => {
      setTransaction(null);
      setIsDownloaded(true);
      setFormData({ name: "", email: "", paymentMode: "" });
      navigate("/products");
    }, 1200);
  };

  if (!orderDetails) {
    return (
      <div className="container d-flex justify-content-center align-items-center min-vh-50 py-5">
        <div className="spinner-border text-dark" role="status">
          <span className="visually-hidden">Loading order details...</span>
        </div>
      </div>
    );
  }

  return (
    <div
      className="container py-5"
      style={{ fontFamily: "'Inter', sans-serif", maxWidth: "1100px" }}
    >
      {/* Dynamic Navigation Link */}
      <Link
        to="/placeOrder"
        className="text-decoration-none text-secondary small fw-medium d-inline-flex align-items-center gap-2 mb-4 group-hover-back"
      >
        <FaArrowLeft size={12} /> Return to Order Summary
      </Link>

      <div className="row g-5">
        {/* Left Column: Interactive Payment Setup Gateway */}
        <div className="col-lg-7">
          <div className="bg-white rounded-4 border p-4 shadow-sm position-relative">
            {/* Success Slate Cover Layer */}
            {transaction && !isDownloaded && (
              <div
                className="position-absolute top-0 start-0 w-100 h-100 bg-white rounded-4 d-flex flex-column align-items-center justify-content-center p-4 text-center setup-overlay animate-fade-in"
                style={{ zIndex: 10 }}
              >
                <FaCheckCircle
                  className="text-success mb-3 animate-scale-up"
                  size={56}
                />
                <h4 className="fw-bold text-dark mb-1">
                  Order Authored Successfully!
                </h4>
                <p className="text-secondary small mb-4 px-4">
                  Transaction ID:{" "}
                  <strong className="text-dark">#{transaction.id}</strong>.
                  Ready to download your formal invoice receipt.
                </p>
                <PDFDownloadLink
                  document={<Invoice transaction={transaction} />}
                  fileName={`Receipt_${transaction.id}.pdf`}
                  className="btn btn-primary btn-lg py-3 px-5 rounded-3 fw-bold shadow-sm border-0"
                  onClick={handleDownload}
                >
                  {({ loading }) =>
                    loading
                      ? "Generating Invoice PDF..."
                      : "Download Invoice Receipt"
                  }
                </PDFDownloadLink>
              </div>
            )}

            <h4 className="fw-bold text-dark mb-4">Secure Checkout Payment</h4>

            <form onSubmit={handleSubmit}>
              {/* Name field */}
              <div className="mb-4">
                <label className="form-label small fw-semibold text-secondary">
                  Cardholder / Payer Name
                </label>
                <input
                  type="text"
                  name="name"
                  className={`form-control py-2.5 rounded-3 border bg-light custom-input ${errors.name ? "border-danger is-invalid" : ""}`}
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter full name"
                />
                {errors.name && (
                  <div className="invalid-feedback small fw-medium">
                    {errors.name}
                  </div>
                )}
              </div>

              {/* Email field */}
              <div className="mb-4">
                <label className="form-label small fw-semibold text-secondary">
                  Billing Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  className={`form-control py-2.5 rounded-3 border bg-light custom-input ${errors.email ? "border-danger is-invalid" : ""}`}
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@example.com"
                />
                {errors.email && (
                  <div className="invalid-feedback small fw-medium">
                    {errors.email}
                  </div>
                )}
              </div>

              {/* Payment Mode grid selection */}
              <div className="mb-5">
                <label className="form-label small fw-semibold text-secondary mb-3">
                  Select Preferred Payment Method
                </label>
                <div className="row g-3">
                  {[
                    { id: "UPI", label: "UPI / QR", icon: <FaWallet /> },
                    {
                      id: "Credit/Debit Card",
                      label: "Cards",
                      icon: <FaCreditCard />,
                    },
                    {
                      id: "Net Banking",
                      label: "Net Banking",
                      icon: <FaUniversity />,
                    },
                    { id: "Cash on Delivery", label: "COD", icon: <FaTruck /> },
                  ].map((mode) => (
                    <div className="col-6" key={mode.id}>
                      <div
                        onClick={() => handlePaymentModeSelect(mode.id)}
                        className={`p-3 border rounded-3 d-flex align-items-center gap-3 cursor-pointer mode-card transition-all ${
                          formData.paymentMode === mode.id
                            ? "border-dark bg-dark text-white"
                            : "bg-light text-dark"
                        }`}
                        style={{ cursor: "pointer" }}
                      >
                        <span
                          className={
                            formData.paymentMode === mode.id
                              ? "text-white"
                              : "text-secondary"
                          }
                        >
                          {mode.icon}
                        </span>
                        <span className="small fw-bold">{mode.label}</span>
                      </div>
                    </div>
                  ))}
                </div>
                {errors.paymentMode && (
                  <div className="text-danger small fw-medium mt-2">
                    {errors.paymentMode}
                  </div>
                )}
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-lg w-100 py-3 fw-bold rounded-3 shadow-sm transition-all"
                disabled={!!transaction}
              >
                Authorize Payment — ₹
                {orderDetails.totalPayable.toLocaleString("en-IN")}
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Statement Overview */}
        <div className="col-lg-5">
          <div
            className="bg-light rounded-4 border p-4 sticky-top shadow-sm"
            style={{ top: "2rem" }}
          >
            <h5 className="fw-bold text-dark mb-4">Statement Overview</h5>

            {/* List of items inside order details cart wrapper */}
            <div className="d-flex flex-column gap-3 mb-4 max-h-box overflow-auto pr-1">
              {orderDetails.cart.map((item, idx) => (
                <div
                  key={idx}
                  className="d-flex align-items-center justify-content-between p-2.5 bg-white rounded-3 border border-light-subtle"
                >
                  <div className="min-w-0 flex-grow-1 ps-2">
                    <h6 className="small fw-bold text-dark text-truncate mb-0">
                      {item.name}
                    </h6>
                    <span
                      className="text-muted small"
                      style={{ fontSize: "11px" }}
                    >
                      Qty: {item.quantity}
                    </span>
                  </div>
                  <span className="small fw-bold text-dark px-2">
                    ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                  </span>
                </div>
              ))}
            </div>

            <hr className="text-muted opacity-25 my-3" />

            {/* Structured calculation breakdown layout elements */}
            <div className="d-flex flex-column gap-2 mb-4">
              <div className="d-flex justify-content-between small text-secondary">
                <span>Items Subtotal</span>
                <span className="fw-medium text-dark">
                  ₹{orderDetails.totalPrice.toLocaleString("en-IN")}
                </span>
              </div>
              <div className="d-flex justify-content-between small text-secondary">
                <span>Shipping Processing</span>
                <span className="text-success fw-bold">FREE</span>
              </div>
              <div className="d-flex justify-content-between small text-secondary">
                <span>Operations Base Fee</span>
                <span className="fw-medium text-dark">
                  ₹{orderDetails.platformFee.toFixed(2)}
                </span>
              </div>
              <div className="d-flex justify-content-between border-top pt-3 mt-2 fw-bold text-dark fs-5">
                <span>Total Due</span>
                <span>
                  ₹
                  {orderDetails.totalPayable.toLocaleString("en-IN", {
                    minimumFractionDigits: 2,
                  })}
                </span>
              </div>
            </div>

            {/* Secure payment shield metadata label */}
            <div className="bg-white rounded-3 p-3 text-center border">
              <span
                className="text-muted small d-block"
                style={{ fontSize: "11px" }}
              >
                🔒 256-bit SSL encrypted validation pipeline protocol guarantees
                payment authenticity.
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Embedded inline modern styles overrides */}
      <style>{`
        .custom-input:focus {
          background-color: #ffffff !important;
          border-color: #212529 !important;
          box-shadow: none !important;
        }
        .mode-card {
          transition: border-color 0.2s ease, background-color 0.2s ease;
        }
        .mode-card:hover {
          border-color: #212529;
        }
        .group-hover-back:hover {
          color: #000000 !important;
        }
        .animate-fade-in {
          animation: fadeIn 0.25s ease-out forwards;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default ProductPaymentForm;
