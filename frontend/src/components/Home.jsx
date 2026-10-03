import { Link } from "react-router-dom";
import { GoPeople } from "react-icons/go";
import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { FaBoxOpen, FaPlay } from "react-icons/fa";
import Hero from "./Hero.jsx";
import {
  FaGraduationCap,
  FaRocket,
  FaCheckCircle,
  FaUser,
  FaPhoneAlt,
  FaBook,
} from "react-icons/fa";
import Classes from "./CoursesSlider.jsx";
import About from "../pages/companyDetails/About.jsx";

import { currentConfig } from "../utils.js";

const API_URL = currentConfig.API_URL;

axios.defaults.withCredentials = true;

function Home() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    program: "",
    name: "",
    phone: "",
  });
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${API_URL}/products/getAllProducts`);
        if (Array.isArray(response.data)) {
          setProducts(response.data);
        } else if (Array.isArray(response.data.products)) {
          setProducts(response.data.products);
        }
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching products:", error);
        toast.error("Failed to load products");
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.program || !formData.name || !formData.phone) {
      return toast.error("Please fill out all fields");
    }
    setIsSending(true);

    try {
      const response = await axios.get(`${API_URL}/users/sendWhatsappMessage`, {
        params: formData,
        withCredentials: true,
      });

      if (response.data.response.success) {
        toast.success("WhatsApp message sent successfully!");
        setFormData({ program: "", name: "", phone: "" });
        window.scrollTo(0, 0);
      } else {
        toast.error("Failed to send WhatsApp message");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to send message! Try again");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <>
      {/* Hero Header Section */}
      <section className="bg-light bg-opacity-50 pb-5">
        <div className="container-fluid p-0 mb-5">
          <Hero />
        </div>

        <div className="container">
          {/* Dynamic Catchy Banner Sub-Header */}
          <div
            className="text-center mx-auto mb-5 p-4 rounded-4 bg-white shadow-sm border border-light"
            style={{ maxWidth: "850px" }}
          >
            <span className="badge bg-primary bg-opacity-10 text-primary px-3 py-2 rounded-pill mb-2 fw-semibold">
              <FaGraduationCap className="me-2" /> Live Interactive Learning
            </span>
            <h1
              className="fw-black text-dark tracking-tight mb-2"
              style={{ fontWeight: "800", fontSize: "2.2rem" }}
            >
              Start Your Child’s Journey Today –
              <span className="text-success ms-2 position-relative d-inline-block">
                Book a Free Live Class
              </span>
              <FaRocket className="ms-2 text-warning" />
            </h1>
            <p
              className="text-muted fs-6 mx-auto mb-0"
              style={{ maxWidth: "600px" }}
            >
              Interactive premium courses designed explicitly to ignite raw
              creativity, core mathematical logic, and lifelong learning
              confidence.
            </p>
          </div>

          {/* Core Interactive Presentation Row */}
          <div className="row g-4 align-items-stretch">
            {/* Media & Stats Container Column */}
            <div className="col-lg-6 d-flex flex-column justify-content-between">
              {/* Modern Video Card Player */}
              <div
                className="position-relative overflow-hidden rounded-4 shadow-sm border border-light flex-grow-1 mb-4 bg-dark"
                style={{ minHeight: "260px" }}
              >
                {!isPlaying ? (
                  <div
                    className="w-100 h-100 position-relative group"
                    onClick={() => setIsPlaying(true)}
                    style={{ cursor: "pointer" }}
                  >
                    <img
                      src="/video-thumb.jpg"
                      alt="Video Preview Presentation"
                      className="w-100 h-100 position-absolute top-0 start-0"
                      style={{ objectFit: "cover", opacity: "0.85" }}
                    />
                    {/* Glassmorphism Centered Play Overlay Ring */}
                    <div
                      className="position-absolute top-5 start-5 translate-middle bg-white text-primary rounded-circle d-flex align-items-center justify-content-center shadow-lg transform-scale-up"
                      style={{
                        width: "64px",
                        height: "64px",
                        top: "50%",
                        left: "50%",
                        zIndex: 3,
                      }}
                    >
                      <FaPlay size={20} className="ms-1" />
                    </div>
                  </div>
                ) : (
                  <iframe
                    width="100%"
                    height="100%"
                    src="https://www.youtube.com/embed/mAmRhpnZlyc?autoplay=1"
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-100 h-100 border-0"
                  ></iframe>
                )}
              </div>

              {/* Grid Metric Analytical Stats Cards Box */}
              <div className="row g-3">
                {[
                  { value: "4+", label: "Premium Courses" },
                  { value: "10+", label: "Expert Trainers" },
                  { value: "50+", label: "Learning Modules" },
                ].map((stat, i) => (
                  <div key={i} className="col-4">
                    <div className="bg-white border border-light p-3 rounded-4 shadow-sm text-center h-100">
                      <h3
                        className="fw-extrabold text-primary mb-0"
                        style={{ fontWeight: "800" }}
                      >
                        {stat.value}
                      </h3>
                      <p className="text-secondary small fw-medium mb-0 mt-1">
                        {stat.label}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Premium Dynamic Reservation Contact Form Card Box */}
            <div className="col-lg-6">
              <div className="bg-white border border-light p-4 p-md-5 rounded-4 shadow-sm h-100 position-relative overflow-hidden">
                <div
                  className="position-absolute bg-primary opacity-10 rounded-circle"
                  style={{
                    width: "200px",
                    height: "200px",
                    right: "-80px",
                    top: "-80px",
                  }}
                ></div>

                <h3 className="fw-bold text-dark mb-2">Claim Your Seat</h3>
                <p className="text-muted small mb-4">
                  Provide details accurately below to schedule an invitation
                  directly over WhatsApp channels instantly.
                </p>

                <form onSubmit={handleSubmit} className="position-relative">
                  {/* Dropdown Topic Selection Item block */}
                  <div className="mb-3">
                    <label className="form-label text-dark small fw-semibold d-flex align-items-center gap-2">
                      <FaBook className="text-muted" size={13} /> Your Topic of
                      Interest *
                    </label>
                    <select
                      className="form-select border-light-subtle bg-light bg-opacity-25 py-2.5 rounded-3"
                      id="program"
                      value={formData.program}
                      onChange={handleChange}
                      style={{ fontSize: "0.95rem" }}
                    >
                      <option value="">Select Target Program Menu</option>
                      <option value="Abacus">Abacus Mathematics</option>
                      <option value="Kids English">Kids Spoken English</option>
                      <option value="Vedic Math">
                        Vedic Mental Arithmetic
                      </option>
                      <option value="Handwriting">Creative Handwriting</option>
                    </select>
                  </div>

                  {/* Student/Parent Full Name Field block input */}
                  <div className="mb-3">
                    <label className="form-label text-dark small fw-semibold d-flex align-items-center gap-2">
                      <FaUser className="text-muted" size={13} /> Full Name
                    </label>
                    <input
                      type="text"
                      className="form-control border-light-subtle bg-light bg-opacity-25 py-2.5 rounded-3"
                      id="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter parent or student name"
                      style={{ fontSize: "0.95rem" }}
                    />
                  </div>

                  {/* Student/Parent Mobile Phone Parameter Field input */}
                  <div className="mb-4">
                    <label className="form-label text-dark small fw-semibold d-flex align-items-center gap-2">
                      <FaPhoneAlt className="text-muted" size={13} /> Contact
                      Number
                    </label>
                    <input
                      type="tel"
                      className="form-control border-light-subtle bg-light bg-opacity-25 py-2.5 rounded-3"
                      id="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Enter mobile number"
                      style={{ fontSize: "0.95rem" }}
                    />
                  </div>

                  {/* Main Action Trigger Interactive Button */}
                  <button
                    type="submit"
                    className="btn btn-primary w-100 py-3 rounded-pill fw-bold text-white shadow d-flex align-items-center justify-content-center gap-2 mb-3"
                    disabled={isSending}
                    style={{
                      background: "linear-gradient(45deg, #0d6efd, #0a58ca)",
                      border: "none",
                    }}
                  >
                    {isSending ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm"
                          role="status"
                          aria-hidden="true"
                        ></span>
                        <span>Scheduling System Links...</span>
                      </>
                    ) : (
                      <>
                        <FaCheckCircle /> Book Free Live Class Now
                      </>
                    )}
                  </button>

                  {/* Micro Metadata Helper Row Information anchors */}
                  <div className="d-flex justify-content-between align-items-center border-top border-light pt-3 small">
                    <span className="text-danger fw-semibold d-flex align-items-center gap-2">
                      <GoPeople className="animate-pulse" size={16} /> Limited
                      Open Slots Available
                    </span>
                    <span className="text-muted">
                      Existing User?{" "}
                      <Link
                        to="/login"
                        className="text-primary fw-semibold text-decoration-none"
                      >
                        Login Here
                      </Link>
                    </span>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Structured Comprehensive Profile/About Section Components Grid */}
      <section className="py-5 bg-white">
        <div className="container px-md-4">
          <About />
        </div>
      </section>

      {/* Specialized Carousel Academic Dynamic Cards Modules Slider wrapper */}
      <section className="bg-light bg-opacity-50 py-2">
        <Classes />
      </section>

      {/* Dynamic Digital Product Grid Store Section Frame */}
      <section className="py-5 bg-white">
        <div className="container">
          <div className="text-center mb-5">
            <span className="badge bg-success bg-opacity-10 text-success px-3 py-2 rounded-pill mb-2 fw-semibold">
              Academic Toolkits
            </span>
            <h2 className="fw-bold text-dark mb-1">
              Buy Our Official Learning Products
            </h2>
            <p className="text-muted small">
              Equip your child with specialized kits curated directly by top
              global certified trainers.
            </p>
            <div
              className="bg-primary rounded-pill mx-auto mt-2"
              style={{ width: "40px", height: "4px" }}
            ></div>
          </div>

          {isLoading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading components...</span>
              </div>
              <p className="text-muted mt-2 small">
                Synchronizing current global catalog inventory...
              </p>
            </div>
          ) : (
            <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4 justify-content-center">
              {products.map((product) => (
                <div key={product._id} className="col">
                  <div
                    className="card h-100 border-0 shadow-sm rounded-4 overflow-hidden position-relative bg-white border border-light transition-all transform-hover-top"
                    style={{ transition: "all 0.3s ease" }}
                  >
                    {/* Media Display Container Window box item image frame */}
                    {product.image && product.image.length > 0 && (
                      <div
                        className="bg-light p-3 d-flex align-items-center justify-content-center overflow-hidden position-relative"
                        style={{ height: "190px" }}
                      >
                        <img
                          src={product.image[0].url}
                          alt={product.name}
                          className="w-100 h-100"
                          style={{ objectFit: "contain" }}
                        />
                      </div>
                    )}

                    {/* Meta Card Description Content layout details metadata block */}
                    <div className="card-body d-flex flex-column justify-content-between p-3">
                      <div>
                        <h6
                          className="card-title fw-bold text-dark text-truncate mb-1"
                          title={product.name}
                        >
                          {product.name}
                        </h6>
                        <p
                          className="text-primary fw-extrabold fs-5 mb-3"
                          style={{ fontWeight: "800" }}
                        >
                          ₹{product.price}
                        </p>
                      </div>

                      <Link
                        to={`/productDetails/${encodeURIComponent(product.name)}/${encodeURIComponent(product.image[0]?.url || "")}/${product.price}`}
                        className="btn btn-outline-primary d-flex align-items-center justify-content-center gap-2 py-2 rounded-pill fw-semibold small w-100"
                        style={{ fontSize: "0.85rem" }}
                      >
                        <FaBoxOpen size={14} /> See Product Details
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}

export default Home;
