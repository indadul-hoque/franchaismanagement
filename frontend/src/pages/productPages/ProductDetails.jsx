import React, { useState, useEffect } from "react";
import {
  FaStar,
  FaStarHalfAlt,
  FaTruck,
  FaUndo,
  FaShieldAlt,
  FaPlus,
  FaMinus,
} from "react-icons/fa";
import { useParams, useNavigate } from "react-router-dom";
import Accordion from "react-bootstrap/Accordion";
import { useAuth } from "../../context/AuthProvider";

const ProductDetails = () => {
  const [selectedColor, setSelectedColor] = useState("silver");
  const [quantity, setQuantity] = useState(1);
  const { productName, productImage, price } = useParams();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const decodedProductName = decodeURIComponent(productName);
  const decodedProductImage = decodeURIComponent(productImage);
  const productPrice = parseFloat(price);

  useEffect(() => {
    localStorage.removeItem("buyNowProduct");
  }, []);

  const handleQuantityChange = (type) => {
    if (type === "dec" && quantity > 1) setQuantity((prev) => prev - 1);
    if (type === "inc" && quantity < 5) setQuantity((prev) => prev + 1);
  };

  const addToCart = () => {
    if (!isAuthenticated) {
      alert("Please login to add items to your cart.");
      navigate("/login");
      return;
    }

    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existingItem = cart.find((item) => item.name === decodedProductName);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.push({
        name: decodedProductName,
        image: decodedProductImage,
        price: productPrice,
        quantity: quantity,
        color: selectedColor,
      });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    alert(`${decodedProductName} added to cart!`);
  };

  const handleBuyNow = () => {
    if (!isAuthenticated) {
      alert("Please login to your account!");
      navigate("/login");
      return;
    }

    const product = {
      name: decodedProductName,
      image: decodedProductImage,
      price: productPrice,
      quantity: quantity,
      color: selectedColor,
    };
    localStorage.setItem("buyNowProduct", JSON.stringify(product));
    navigate("/placeOrder");
  };

  return (
    <div
      className="container py-5"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      <div className="row g-5">
        {/* Left Side: Modern Image Gallery */}
        <div className="col-lg-6">
          <div className="sticky-top" style={{ top: "2rem" }}>
            <div
              className="bg-light rounded-4 overflow-hidden border mb-3 p-4 d-flex align-items-center justify-content-center"
              style={{ minHeight: "450px" }}
            >
              <img
                src={decodedProductImage}
                className="img-fluid object-fit-contain mix-blend-multiply"
                alt={decodedProductName}
                style={{
                  maxHeight: "400px",
                  transition: "transform 0.3s ease",
                }}
              />
            </div>
            {/* Thumbnails */}
            <div className="row g-2">
              {[1, 2, 3, 4].map((_, index) => (
                <div className="col-3" key={index}>
                  <div
                    className={`p-2 border rounded-3 text-center cursor-pointer bg-light ${index === 0 ? "border-dark border-2" : "opacity-75"}`}
                    style={{ cursor: "pointer" }}
                  >
                    <img
                      src={decodedProductImage}
                      className="img-fluid mix-blend-multiply"
                      style={{ maxHeight: "60px" }}
                      alt={`View ${index + 1}`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Clean Typography & Modern UI Controls */}
        <div className="col-lg-6">
          <div className="ps-lg-4">
            {/* Premium Breadcrumb Tag / Collection */}
            <span className="text-uppercase text-muted tracking-wider small fw-bold mb-2 d-inline-block">
              Premium Collection
            </span>

            <h1
              className="fw-bold text-dark lh-sm mb-3"
              style={{ fontSize: "2.25rem" }}
            >
              {decodedProductName}
            </h1>

            {/* Rating block */}
            <div className="d-flex align-items-center mb-4">
              <div className="text-warning me-2 d-flex gap-1 small">
                {[...Array(4)].map((_, i) => (
                  <FaStar key={i} />
                ))}
                <FaStarHalfAlt />
              </div>
              <span className="text-secondary small fw-medium">
                (128 verified reviews)
              </span>
            </div>

            {/* Modernized Pricing Layout */}
            <div className="d-flex align-items-baseline gap-3 p-3 bg-light rounded-3 mb-4">
              <span className="fs-2 fw-extrabold text-dark">
                ₹
                {productPrice.toLocaleString("en-IN", {
                  minimumFractionDigits: 2,
                })}
              </span>
              <span className="text-muted text-decoration-line-through fs-5">
                ₹
                {(productPrice * 1.25).toLocaleString("en-IN", {
                  minimumFractionDigits: 2,
                })}
              </span>
              <span className="badge rounded-pill bg-danger px-3 py-2 fw-semibold small">
                SAVE 25%
              </span>
            </div>

            <p className="text-secondary mb-4 leading-relaxed fs-6">
              Timeless elegance meets modern functionality. Meticulously
              engineered for those who appreciate premium quality and
              sophisticated performance day in and day out.
            </p>

            <hr className="text-muted opacity-25 my-4" />

            {/* Premium Color Selection circles or elegant tags */}
            <div className="mb-4">
              <h6 className="fw-bold text-dark mb-3">Select Finish</h6>
              <div className="d-flex gap-2">
                {["silver", "gold", "black"].map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setSelectedColor(color)}
                    className={`btn px-4 py-2 text-capitalize rounded-pill fw-medium transition-all ${
                      selectedColor === color
                        ? "btn-dark shadow-sm"
                        : "btn-outline-secondary opacity-75"
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

            {/* Clean Quantity Counter UI */}
            <div className="mb-4">
              <h6 className="fw-bold text-dark mb-3">Quantity</h6>
              <div
                className="d-flex align-items-center border rounded-3 bg-light"
                style={{ width: "fit-content" }}
              >
                <button
                  className="btn border-0 px-3 py-2 text-secondary"
                  onClick={() => handleQuantityChange("dec")}
                >
                  <FaMinus size={12} />
                </button>
                <span
                  className="px-3 fw-bold text-dark text-center"
                  style={{ minWidth: "40px" }}
                >
                  {quantity}
                </span>
                <button
                  className="btn border-0 px-3 py-2 text-secondary"
                  onClick={() => handleQuantityChange("inc")}
                >
                  <FaPlus size={12} />
                </button>
              </div>
            </div>

            {/* Prominent Action Buttons */}
            <div className="d-flex flex-column gap-2 mb-5">
              <button
                className="btn btn-primary btn-lg py-3 fw-bold rounded-3 shadow-sm transition-all"
                onClick={handleBuyNow}
                style={{ fontSize: "1.05rem" }}
              >
                Buy It Now
              </button>
              <button
                className="btn btn-outline-dark btn-lg py-3 fw-bold rounded-3 transition-all"
                onClick={addToCart}
                style={{ fontSize: "1.05rem" }}
              >
                Add to Cart
              </button>
            </div>

            {/* Clean Minimalist Details Accordion */}
            <section className="mb-5">
              <Accordion flush className="border-top border-bottom">
                <Accordion.Item eventKey="0" className="border-0">
                  <Accordion.Header className="fw-bold py-1">
                    Specifications & Details
                  </Accordion.Header>
                  <Accordion.Body className="text-secondary pb-4 pt-2">
                    <div className="row g-2 fs-6">
                      <div className="col-6">
                        <strong>Type:</strong> Premium Edition
                      </div>
                      <div className="col-6">
                        <strong>Ideal For:</strong> Unisex
                      </div>
                      <div className="col-6">
                        <strong>With Rain Cover:</strong> Yes
                      </div>
                      <div className="col-6">
                        <strong>Color Code:</strong>{" "}
                        {selectedColor.toUpperCase()}
                      </div>
                    </div>
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
            </section>

            {/* Trust & Reassurance Badges */}
            <div className="bg-light p-4 rounded-4 border">
              <div className="row g-3">
                <div className="col-md-4 d-flex align-items-center gap-3">
                  <div
                    className="p-2 bg-white rounded-circle shadow-sm text-primary d-flex align-items-center justify-content-center"
                    style={{ width: "40px", height: "40px" }}
                  >
                    <FaTruck />
                  </div>
                  <div>
                    <p className="mb-0 fw-bold small text-dark">
                      Free Shipping
                    </p>
                    <span className="text-muted" style={{ fontSize: "11px" }}>
                      On orders over ₹500
                    </span>
                  </div>
                </div>
                <div className="col-md-4 d-flex align-items-center gap-3">
                  <div
                    className="p-2 bg-white rounded-circle shadow-sm text-primary d-flex align-items-center justify-content-center"
                    style={{ width: "40px", height: "40px" }}
                  >
                    <FaUndo />
                  </div>
                  <div>
                    <p className="mb-0 fw-bold small text-dark">
                      30-Day Returns
                    </p>
                    <span className="text-muted" style={{ fontSize: "11px" }}>
                      Hassle-free policy
                    </span>
                  </div>
                </div>
                <div className="col-md-4 d-flex align-items-center gap-3">
                  <div
                    className="p-2 bg-white rounded-circle shadow-sm text-primary d-flex align-items-center justify-content-center"
                    style={{ width: "40px", height: "40px" }}
                  >
                    <FaShieldAlt />
                  </div>
                  <div>
                    <p className="mb-0 fw-bold small text-dark">
                      2-Year Warranty
                    </p>
                    <span className="text-muted" style={{ fontSize: "11px" }}>
                      100% Guaranteed
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
