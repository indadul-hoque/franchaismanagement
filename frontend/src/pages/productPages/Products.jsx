import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import toast from "react-hot-toast";
import axios from "axios";
import { FaShoppingCart, FaBolt } from "react-icons/fa";
import { useAuth } from "../../context/AuthProvider.jsx";
import { currentConfig } from "../../utils";

const API_URL = currentConfig.API_URL;

export default function Products() {
  const [cart, setCart] = useState([]);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  // Fetch products from backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${API_URL}/products/getAllProducts`);
        if (Array.isArray(response.data)) {
          setProducts(response.data);
        } else if (Array.isArray(response.data.products)) {
          setProducts(response.data.products);
        } else {
          console.error("Unexpected API response:", response.data);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        toast.error("Failed to load products");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Load cart from localStorage
  useEffect(() => {
    window.scrollTo(0, 0);
    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(savedCart);
  }, []);

  // Add to cart logic
  const addToCart = (product) => {
    if (!isAuthenticated) {
      toast.error("Please login to add items to your cart.");
      navigate("/login");
      return;
    }

    const currentCart = JSON.parse(localStorage.getItem("cart")) || [];
    const existingItem = currentCart.find((item) => item.id === product._id);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      currentCart.push({
        id: product._id,
        name: product.name,
        image: product.image[0]?.url || "",
        price: product.price,
        quantity: 1,
        color: product.color || "silver",
      });
    }

    localStorage.setItem("cart", JSON.stringify(currentCart));
    setCart(currentCart);
    toast.success(`${product.name} added to cart!`);
  };

  const handleBuyNow = (product) => {
    if (!isAuthenticated) {
      toast.error("Please login to place an order.");
      navigate("/login");
      return;
    }
    localStorage.removeItem("buyNowProduct");
    localStorage.setItem(
      "buyNowProduct",
      JSON.stringify({
        id: product._id,
        name: product.name,
        image: product.image[0]?.url || "",
        price: product.price,
        quantity: 1,
        color: product.color || "silver",
      }),
    );
    navigate("/placeOrder");
  };

  return (
    <div
      className="container py-5"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      {/* Page Header */}
      <div className="mb-5 text-center">
        <span className="text-uppercase text-muted tracking-wider small fw-bold mb-2 d-inline-block">
          Marketplace
        </span>
        <h2 className="fw-bold text-dark">Explore Our Materials</h2>
        <div
          className="mx-auto bg-dark rounded-pill"
          style={{ width: "50px", height: "3px" }}
        ></div>
      </div>

      {isLoading ? (
        /* Modern Minimalist Loading Spinner */
        <div className="d-flex flex-column justify-content-center align-items-center py-5 my-5">
          <div
            className="spinner-border text-dark mb-3"
            role="status"
            style={{ width: "2.5rem", height: "2.5rem" }}
          >
            <span className="visually-hidden">Loading...</span>
          </div>
          <span className="text-secondary fw-medium fs-6">
            Curating marketplace items...
          </span>
        </div>
      ) : (
        <Row xs={1} sm={2} lg={3} xl={4} className="g-4">
          {products.map((product) => (
            <Col key={product._id}>
              <div className="h-100 bg-white rounded-4 overflow-hidden border p-3 d-flex flex-column justify-content-between transition-all shadow-sm card-hover">
                {/* Product Image Wrapper */}
                <Link
                  to={`/productDetails/${encodeURIComponent(product.name)}/${encodeURIComponent(product.image[0]?.url || "")}/${product.price}`}
                  className="d-block bg-light rounded-3 mb-3 p-3 text-center position-relative overflow-hidden"
                  style={{ height: "200px" }}
                >
                  {product.image?.length > 0 && (
                    <img
                      src={product.image[0].url}
                      alt={product.name}
                      className="img-fluid h-100 object-fit-contain mix-blend-multiply transition-transform duration-300 img-scale"
                    />
                  )}
                </Link>

                {/* Product Info & Action Block */}
                <div className="d-flex flex-column flex-grow-1">
                  <Link
                    to={`/productDetails/${encodeURIComponent(product.name)}/${encodeURIComponent(product.image[0]?.url || "")}/${product.price}`}
                    className="text-decoration-none mb-1"
                  >
                    <h6 className="fw-bold text-dark text-truncate mb-1 card-title-link">
                      {product.name}
                    </h6>
                  </Link>

                  <div className="mb-3">
                    <span className="fs-5 fw-extrabold text-dark">
                      ₹
                      {product.price.toLocaleString("en-IN", {
                        minimumFractionDigits: 2,
                      })}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="d-flex flex-column gap-2 mt-auto">
                    <button
                      onClick={() => addToCart(product)}
                      className="btn btn-outline-dark btn-sm py-2 fw-semibold rounded-3 d-flex align-items-center justify-content-center gap-2 transition-all"
                    >
                      <FaShoppingCart size={13} />
                      Add to Cart
                    </button>

                    <button
                      onClick={() => handleBuyNow(product)}
                      className="btn btn-primary btn-sm py-2 fw-semibold rounded-3 d-flex align-items-center justify-content-center gap-2 transition-all"
                    >
                      <FaBolt size={13} />
                      Buy Now
                    </button>
                  </div>
                </div>
              </div>
            </Col>
          ))}
        </Row>
      )}

      {/* Micro-styles injected inline to guarantee crisp e-commerce layout behaviors */}
      <style>{`
                .card-hover {
                    transition: transform 0.25s ease, box-shadow 0.25s ease;
                }
                .card-hover:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 .5rem 1.5rem rgba(0,0,0,.08)!important;
                    border-color: #212529 !important;
                }
                .card-title-link {
                    transition: color 0.2s ease;
                }
                .card-title-link:hover {
                    color: #4f46e5 !important;
                }
                .img-scale {
                    transition: transform 0.3s ease;
                }
                .card-hover:hover .img-scale {
                    transform: scale(1.06);
                }
            `}</style>
    </div>
  );
}
