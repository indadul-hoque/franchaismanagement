import React, { useState, useEffect } from "react";
import {
  FaMapMarkerAlt,
  FaShoppingBag,
  FaCreditCard,
  FaPencilAlt,
} from "react-icons/fa";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function PlaceOrder() {
  const [cart, setCart] = useState([]);
  const [isBuyNow, setIsBuyNow] = useState(false);
  const [address, setAddress] = useState(null);
  const [editingAddress, setEditingAddress] = useState(false);
  const [newAddress, setNewAddress] = useState({
    name: "",
    phone: "",
    addressLine: "",
    city: "",
    state: "",
    pincode: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    const buyNowProduct = JSON.parse(localStorage.getItem("buyNowProduct"));
    const savedCart = JSON.parse(localStorage.getItem("cart"));
    const savedAddress = JSON.parse(localStorage.getItem("shippingAddress"));

    if (buyNowProduct) {
      setCart([buyNowProduct]);
      setIsBuyNow(true);
    } else if (savedCart && savedCart.length > 0) {
      setCart(savedCart);
      setIsBuyNow(false);
    }

    if (savedAddress) {
      setAddress(savedAddress);
      setNewAddress(savedAddress); // Initialize form fields with saved values
    }
  }, []);

  const handleAddressChange = (e) => {
    setNewAddress({ ...newAddress, [e.target.name]: e.target.value });
  };

  const saveAddress = () => {
    // Basic form validation
    if (
      !newAddress.name ||
      !newAddress.phone ||
      !newAddress.addressLine ||
      !newAddress.city ||
      !newAddress.state ||
      !newAddress.pincode
    ) {
      toast.error("Please fill in all address fields.");
      return;
    }
    setAddress(newAddress);
    localStorage.setItem("shippingAddress", JSON.stringify(newAddress));
    setEditingAddress(false);
    toast.success("Delivery address updated.");
  };

  const handleContinue = () => {
    if (!address) {
      toast.error("Please complete and save your delivery address.");
      return;
    }

    toast.success("Proceeding to payment...");

    const orderDetails = {
      cart,
      address,
      totalPayable,
      totalPrice,
      platformFee,
    };

    localStorage.setItem("orderDetails", JSON.stringify(orderDetails));

    if (isBuyNow) {
      localStorage.removeItem("buyNowProduct");
    } else {
      localStorage.removeItem("cart");
    }

    navigate("/productPaymentForm");
  };

  const totalPrice = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );
  const platformFee = 3;
  const totalPayable = totalPrice + platformFee;

  return (
    <div
      className="container py-5"
      style={{ fontFamily: "'Inter', sans-serif", maxWidth: "1200px" }}
    >
      {/* Header */}
      <div className="mb-5">
        <span className="text-uppercase text-muted tracking-wider small fw-bold mb-1 d-inline-block">
          Secure Checkout
        </span>
        <h2 className="fw-bold text-dark m-0">Review and Place Order</h2>
      </div>

      <div className="row g-4">
        {/* Left Column: Checkout Actions */}
        <div className="col-lg-8">
          {/* Step 1: Delivery Address */}
          <div className="bg-white rounded-4 border p-4 mb-4 shadow-sm position-relative">
            <div className="d-flex align-items-center gap-3 mb-4">
              <div
                className="bg-light text-dark rounded-circle d-flex align-items-center justify-content-center fw-bold fs-6"
                style={{ width: "32px", height: "32px" }}
              >
                01
              </div>
              <h5 className="fw-bold text-dark m-0 d-flex align-items-center gap-2">
                <FaMapMarkerAlt className="text-secondary" size={16} /> Delivery
                Address
              </h5>
            </div>

            {editingAddress || !address ? (
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label small fw-semibold text-secondary">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={newAddress.name}
                    onChange={handleAddressChange}
                    className="form-control rounded-3 py-2 bg-light border-0"
                    placeholder="John Doe"
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label small fw-semibold text-secondary">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    name="phone"
                    value={newAddress.phone}
                    onChange={handleAddressChange}
                    className="form-control rounded-3 py-2 bg-light border-0"
                    placeholder="e.g. +91 XXXXX XXXXX"
                  />
                </div>
                <div className="col-12">
                  <label className="form-label small fw-semibold text-secondary">
                    Street Address
                  </label>
                  <input
                    type="text"
                    name="addressLine"
                    value={newAddress.addressLine}
                    onChange={handleAddressChange}
                    className="form-control rounded-3 py-2 bg-light border-0"
                    placeholder="Apartment, suite, unit, building, floor, etc."
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label small fw-semibold text-secondary">
                    City
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={newAddress.city}
                    onChange={handleAddressChange}
                    className="form-control rounded-3 py-2 bg-light border-0"
                    placeholder="City"
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label small fw-semibold text-secondary">
                    State
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={newAddress.state}
                    onChange={handleAddressChange}
                    className="form-control rounded-3 py-2 bg-light border-0"
                    placeholder="State"
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label small fw-semibold text-secondary">
                    Pincode
                  </label>
                  <input
                    type="text"
                    name="pincode"
                    value={newAddress.pincode}
                    onChange={handleAddressChange}
                    className="form-control rounded-3 py-2 bg-light border-0"
                    placeholder="XXXXXX"
                  />
                </div>
                <div className="col-12 mt-4 text-end">
                  <button
                    className="btn btn-dark px-4 py-2 fw-semibold rounded-3 shadow-sm transition-all"
                    onClick={saveAddress}
                  >
                    Save Delivery Profile
                  </button>
                </div>
              </div>
            ) : (
              <div className="d-flex justify-content-between align-items-start p-3 bg-light rounded-3 border">
                <div>
                  <h6 className="fw-bold text-dark mb-1">{address.name}</h6>
                  <p className="text-secondary small mb-2">{address.phone}</p>
                  <p className="text-dark small mb-0 leading-relaxed">
                    {address.addressLine}, {address.city}, {address.state} —{" "}
                    <strong className="text-secondary">
                      {address.pincode}
                    </strong>
                  </p>
                </div>
                <button
                  className="btn btn-outline-dark btn-sm rounded-2 d-flex align-items-center gap-1 py-1 px-3 fw-medium transition-all"
                  onClick={() => setEditingAddress(true)}
                >
                  <FaPencilAlt size={11} /> Change
                </button>
              </div>
            )}
          </div>

          {/* Step 2: Order Summary */}
          <div className="bg-white rounded-4 border p-4 shadow-sm">
            <div className="d-flex align-items-center gap-3 mb-4">
              <div
                className="bg-light text-dark rounded-circle d-flex align-items-center justify-content-center fw-bold fs-6"
                style={{ width: "32px", height: "32px" }}
              >
                02
              </div>
              <h5 className="fw-bold text-dark m-0 d-flex align-items-center gap-2">
                <FaShoppingBag className="text-secondary" size={16} /> Order
                Summary
              </h5>
            </div>

            {cart.length === 0 ? (
              <div className="text-center py-4 text-secondary small">
                Your bag is currently empty.
              </div>
            ) : (
              <div className="d-flex flex-column gap-3">
                {cart.map((item, idx) => (
                  <div
                    key={idx}
                    className="d-flex align-items-center p-3 bg-light rounded-3 border gap-3 transition-all hover-subtle"
                  >
                    <div
                      className="bg-white rounded-2 overflow-hidden border d-flex align-items-center justify-content-center p-1"
                      style={{
                        width: "70px",
                        height: "70px",
                        minWidth: "70px",
                      }}
                    >
                      <img
                        src={
                          item.image[0]?.url ||
                          item.image ||
                          "https://via.placeholder.com/70"
                        }
                        alt={item.name}
                        className="img-fluid object-fit-contain mix-blend-multiply"
                        style={{ maxHeight: "100%" }}
                      />
                    </div>
                    <div className="flex-grow-1 min-w-0">
                      <h6 className="fw-bold text-dark mb-1 text-truncate">
                        {item.name}
                      </h6>
                      <div className="d-flex align-items-center gap-3 text-secondary small">
                        <span>
                          Qty:{" "}
                          <strong className="text-dark">{item.quantity}</strong>
                        </span>
                        {item.color && (
                          <span>
                            Finish:{" "}
                            <strong className="text-dark text-capitalize">
                              {item.color}
                            </strong>
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-end">
                      <span className="fw-bold text-dark d-block">
                        ₹
                        {(item.price * item.quantity).toLocaleString("en-IN", {
                          minimumFractionDigits: 2,
                        })}
                      </span>
                      <span
                        className="text-muted small"
                        style={{ fontSize: "11px" }}
                      >
                        ₹{item.price.toLocaleString("en-IN")} each
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Sticky Summary Panel */}
        <div className="col-lg-4">
          <div className="sticky-top" style={{ top: "2rem" }}>
            <div className="bg-white rounded-4 border p-4 shadow-sm">
              <h5 className="fw-bold text-dark mb-4 d-flex align-items-center gap-2">
                <FaCreditCard className="text-secondary" size={16} /> Payment
                Summary
              </h5>

              <ul className="list-group list-group-flush mb-4">
                <li className="list-group-item d-flex justify-content-between border-0 px-0 py-2 bg-transparent text-secondary small">
                  <span>
                    Subtotal ({cart.length} item{cart.length !== 1 && "s"})
                  </span>
                  <span className="fw-medium text-dark">
                    ₹
                    {totalPrice.toLocaleString("en-IN", {
                      minimumFractionDigits: 2,
                    })}
                  </span>
                </li>
                <li className="list-group-item d-flex justify-content-between border-0 px-0 py-2 bg-transparent text-secondary small">
                  <span>Shipping & Handling</span>
                  <span className="text-success fw-semibold">FREE</span>
                </li>
                <li className="list-group-item d-flex justify-content-between border-0 px-0 py-2 bg-transparent text-secondary small mb-2">
                  <span>Platform Operations Fee</span>
                  <span className="fw-medium text-dark">
                    ₹{platformFee.toFixed(2)}
                  </span>
                </li>
                <li className="list-group-item d-flex justify-content-between border-top px-0 pt-3 pb-1 bg-transparent fw-bold text-dark fs-5">
                  <span>Total Due</span>
                  <span>
                    ₹
                    {totalPayable.toLocaleString("en-IN", {
                      minimumFractionDigits: 2,
                    })}
                  </span>
                </li>
              </ul>

              <button
                className="btn btn-primary btn-lg w-100 py-3 fw-bold rounded-3 shadow-sm transition-all"
                style={{ fontSize: "1rem" }}
                onClick={handleContinue}
              >
                Continue to Payment
              </button>

              <div className="text-center mt-3">
                <span
                  className="text-muted opacity-70 small"
                  style={{ fontSize: "11px" }}
                >
                  🔒 Secure Multi-Layer Checkout Interface
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Embedded visual utilities for clean modern alignment */}
      <style>{`
        .hover-subtle:hover {
          border-color: #cbd5e1 !important;
          background-color: #f8fafc !important;
        }
        .leading-relaxed {
          line-height: 1.6;
        }
      `}</style>
    </div>
  );
}
