import React, { useEffect, useState } from "react";
import { FaTrash, FaHeart, FaMinus, FaPlus, FaArrowLeft } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

export default function Cart() {
  const [cart, setCart] = useState([]);
  const [showDeliveryTime, setShowDeliveryTime] = useState(true);
  const navigate = useNavigate();

  // Load cart from localStorage on mount
  useEffect(() => {
    localStorage.removeItem("buyNowProduct");
    const savedCart = JSON.parse(localStorage.getItem("cart"));
    if (savedCart) {
      setCart(savedCart);
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (cart.length > 0) {
      localStorage.setItem("cart", JSON.stringify(cart));
      setShowDeliveryTime(true);
    } else {
      localStorage.removeItem("cart");
      setShowDeliveryTime(false);
    }
  }, [cart]);

  // Update quantity
  const updateQuantity = (id, increment) => {
    setCart((prevCart) =>
      prevCart
        .map((item) =>
          item.id === id
            ? { ...item, quantity: Math.max(1, item.quantity + increment) }
            : item,
        )
        .filter((item) => item.quantity > 0),
    );
  };

  // Remove item
  const removeItem = (id) => {
    const updatedCart = cart.filter((item) => item.id !== id);
    setCart(updatedCart);
  };

  const totalPrice = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );

  return (
    <div
      className="container py-5"
      style={{ fontFamily: "'Inter', sans-serif", maxWidth: "1200px" }}
    >
      {/* Header Title & Back Button Block */}
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-3 mb-5">
        <div>
          <span className="text-uppercase text-muted tracking-wider small fw-bold mb-1 d-inline-block">
            Shopping Bag
          </span>
          <h2 className="fw-bold text-dark m-0">Your Cart</h2>
        </div>
        {/* Modern Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="btn btn-outline-dark rounded-3 px-3 py-2 fw-medium small d-flex align-items-center gap-2 transition-all"
        >
          <FaArrowLeft size={12} /> Go Back
        </button>
      </div>

      {cart.length === 0 ? (
        /* Elegant Minimal Empty State */
        <div className="text-center py-5 border rounded-4 bg-light shadow-sm">
          <p className="text-secondary fs-5 mb-4">
            Your shopping cart is currently empty.
          </p>
          <Link
            to="/products"
            className="btn btn-primary px-4 py-2.5 fw-semibold rounded-3 shadow-sm transition-all text-decoration-none"
          >
            <FaArrowLeft className="me-2 small" size={12} /> Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="row g-4">
          {/* Left Side: Product List Deck */}
          <div className="col-lg-8">
            <div className="bg-white rounded-4 border p-4 shadow-sm mb-4">
              <div className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom">
                <h5 className="fw-bold text-dark m-0">Items Deck</h5>
                <span className="badge bg-light text-dark border px-3 py-2 rounded-pill fw-medium">
                  {cart.length} Product(s)
                </span>
              </div>

              <div className="d-flex flex-column gap-4">
                {cart.map((item, index) => (
                  <div key={item.id || index}>
                    <div className="row align-items-center g-3">
                      {/* Product Image Wrapper */}
                      <div className="col-md-3 text-center text-md-start">
                        <div
                          className="bg-light rounded-3 p-2 border text-center d-inline-flex align-items-center justify-content-center overflow-hidden"
                          style={{ width: "110px", height: "110px" }}
                        >
                          <img
                            src={item.image}
                            className="img-fluid object-fit-contain mix-blend-multiply"
                            alt={item.name}
                            style={{ maxHeight: "100%" }}
                          />
                        </div>
                      </div>

                      {/* Product Metadata Descriptions */}
                      <div className="col-md-4">
                        <h6 className="fw-bold text-dark mb-1 text-truncate">
                          {item.name}
                        </h6>
                        <div className="d-flex flex-wrap gap-2 text-muted small mb-3">
                          <span>
                            Finish:{" "}
                            <strong className="text-dark text-capitalize">
                              {item.color}
                            </strong>
                          </span>
                          {item.size && (
                            <span>
                              | Size:{" "}
                              <strong className="text-dark">{item.size}</strong>
                            </span>
                          )}
                        </div>

                        {/* Micro Action Controls */}
                        <div className="d-flex gap-2">
                          <button
                            onClick={() => removeItem(item.id)}
                            className="btn btn-link text-danger p-0 border-0 text-decoration-none small d-flex align-items-center gap-1 opacity-75 hover-opacity-100"
                            title="Remove item"
                          >
                            <FaTrash size={12} />{" "}
                            <span style={{ fontSize: "13px" }}>Remove</span>
                          </button>
                          <span className="text-muted opacity-25">|</span>
                          <button
                            className="btn btn-link text-secondary p-0 border-0 text-decoration-none small d-flex align-items-center gap-1 opacity-75 hover-opacity-100"
                            title="Move to wishlist"
                          >
                            <FaHeart size={12} />{" "}
                            <span style={{ fontSize: "13px" }}>Wishlist</span>
                          </button>
                        </div>
                      </div>

                      {/* Quantity Incrementor */}
                      <div className="col-md-3 d-flex justify-content-md-center justify-content-start">
                        <div
                          className="d-flex align-items-center border rounded-3 bg-light"
                          style={{ width: "fit-content" }}
                        >
                          <button
                            className="btn border-0 px-2.5 py-1.5 text-secondary"
                            onClick={() => updateQuantity(item.id, -1)}
                          >
                            <FaMinus size={10} />
                          </button>
                          <span
                            className="px-2.5 fw-bold text-dark text-center small"
                            style={{ minWidth: "35px" }}
                          >
                            {item.quantity}
                          </span>
                          <button
                            className="btn border-0 px-2.5 py-1.5 text-secondary"
                            onClick={() => updateQuantity(item.id, 1)}
                          >
                            <FaPlus size={10} />
                          </button>
                        </div>
                      </div>

                      {/* Dynamic Total Price Per Item Group */}
                      <div className="col-md-2 text-md-end text-start">
                        <span className="fw-extrabold text-dark d-block">
                          ₹
                          {(item.price * item.quantity).toLocaleString(
                            "en-IN",
                            { minimumFractionDigits: 2 },
                          )}
                        </span>
                        {item.quantity > 1 && (
                          <span
                            className="text-muted small"
                            style={{ fontSize: "11px" }}
                          >
                            ₹{item.price.toLocaleString("en-IN")} each
                          </span>
                        )}
                      </div>
                    </div>
                    {index < cart.length - 1 && (
                      <hr className="text-muted opacity-25 my-4" />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Delivery Estimated Alert Block */}
            {showDeliveryTime && (
              <div className="bg-light rounded-4 border p-3 shadow-sm d-flex align-items-center gap-3">
                <div
                  className="p-2.5 bg-white rounded-circle border shadow-sm text-secondary d-flex align-items-center justify-content-center"
                  style={{ width: "40px", height: "40px" }}
                >
                  🚚
                </div>
                <div>
                  <h6
                    className="fw-bold text-dark mb-0.5"
                    style={{ fontSize: "14px" }}
                  >
                    Expected Standard Dispatch Timeline
                  </h6>
                  <span className="text-secondary small">
                    Delivery will arrive securely within 3 - 5 business
                    operating days.
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Right Side: Sticky Checkout Summary Workspace Panel */}
          <div className="col-lg-4">
            <div className="sticky-top" style={{ top: "2rem" }}>
              <div className="bg-white rounded-4 border p-4 shadow-sm">
                <h5 className="fw-bold text-dark mb-4">Summary</h5>

                <ul className="list-group list-group-flush mb-4">
                  <li className="list-group-item d-flex justify-content-between border-0 px-0 py-2 bg-transparent text-secondary small">
                    <span>Gross Product Value</span>
                    <span className="fw-medium text-dark">
                      ₹
                      {totalPrice.toLocaleString("en-IN", {
                        minimumFractionDigits: 2,
                      })}
                    </span>
                  </li>
                  <li className="list-group-item d-flex justify-content-between border-0 px-0 py-2 bg-transparent text-secondary small mb-2">
                    <span>Logistics Handling</span>
                    <span className="text-success fw-bold">FREE</span>
                  </li>
                  <li className="list-group-item d-flex justify-content-between border-top px-0 pt-3 pb-1 bg-transparent fw-bold text-dark fs-5">
                    <span>Total Payable</span>
                    <span>
                      ₹
                      {totalPrice.toLocaleString("en-IN", {
                        minimumFractionDigits: 2,
                      })}
                    </span>
                  </li>
                </ul>

                <Link to="/placeOrder" className="text-decoration-none">
                  <button
                    className="btn btn-primary btn-lg w-100 py-3 fw-bold rounded-3 shadow-sm transition-all"
                    style={{ fontSize: "1rem" }}
                  >
                    Proceed to Place Order
                  </button>
                </Link>

                <div className="text-center mt-3">
                  <span
                    className="text-muted opacity-70 small"
                    style={{ fontSize: "11px" }}
                  >
                    Taxes and processing fees configured inside checkout.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
                .hover-opacity-100:hover {
                    opacity: 1 !important;
                }
            `}</style>
    </div>
  );
}
