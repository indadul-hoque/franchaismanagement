import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import {
  FaEnvelope,
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaPaperPlane,
} from "react-icons/fa";

export default function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const onSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(event.target);
    formData.append("access_key", "150cee43-4e8a-4e8a-8278-f76d59c1c8e4");

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Message dispatched successfully!");
        event.target.reset();
      } else {
        console.error("Submission Error", data);
        toast.error(data.message || "Failed to deliver message. Please retry.");
      }
    } catch (error) {
      console.error("Network Error", error);
      toast.error("Network disruption encountered.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="container py-5 mt-4"
      style={{ fontFamily: "'Inter', sans-serif", maxWidth: "1200px" }}
    >
      {/* Header Track */}
      <div className="text-center mb-5">
        <span className="text-uppercase text-muted tracking-wider small fw-bold mb-2 d-inline-block">
          Connect With Us
        </span>
        <h2 className="fw-bold text-dark m-0">Let's Start a Conversation</h2>
        <p
          className="text-secondary small mt-2 mx-auto"
          style={{ maxWidth: "500px" }}
        >
          Have questions or feedback? Drop us a line below and our dedicated
          support desk will get back to you shortly.
        </p>
      </div>

      {/* Main Interactive Grid */}
      <div className="bg-white rounded-4 border overflow-hidden shadow-sm">
        <div className="row g-0">
          {/* Left Column: Form & Company Coordinates */}
          <div className="col-lg-7 p-4 p-md-5">
            <div className="mb-4">
              <h4 className="fw-bold text-dark mb-1">Send a Message</h4>
              <p className="text-muted small">
                Required fields are safely validated in real-time.
              </p>
            </div>

            <form onSubmit={onSubmit}>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label small fw-semibold text-secondary">
                    Your Name
                  </label>
                  <input
                    type="text"
                    className="form-control py-2.5 rounded-3 bg-light border-0 custom-field"
                    name="name"
                    required
                    placeholder="John Doe"
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label small fw-semibold text-secondary">
                    Email Address
                  </label>
                  <input
                    type="email"
                    className="form-control py-2.5 rounded-3 bg-light border-0 custom-field"
                    name="email"
                    required
                    placeholder="john@example.com"
                  />
                </div>
                <div className="col-12">
                  <label className="form-label small fw-semibold text-secondary">
                    Subject Topic
                  </label>
                  <input
                    type="text"
                    className="form-control py-2.5 rounded-3 bg-light border-0 custom-field"
                    name="subject"
                    required
                    placeholder="How can our teams assist you?"
                  />
                </div>
                <div className="col-12">
                  <label className="form-label small fw-semibold text-secondary">
                    Detailed Message
                  </label>
                  <textarea
                    className="form-control py-2.5 rounded-3 bg-light border-0 custom-field"
                    name="message"
                    required
                    rows="4"
                    placeholder="Type your message transcript here..."
                    style={{ resize: "none" }}
                  ></textarea>
                </div>
                <div className="col-12 mt-4">
                  <button
                    className="btn btn-primary btn-lg w-100 py-3 fw-bold rounded-3 shadow-sm d-flex align-items-center justify-content-center gap-2 transition-all"
                    type="submit"
                    disabled={isSubmitting}
                  >
                    <FaPaperPlane size={14} />
                    {isSubmitting ? "Dispatching Message..." : "Send Message"}
                  </button>
                </div>
              </div>
            </form>

            <hr className="text-muted opacity-25 my-5" />

            {/* Real-world Interactive Metadata Anchors */}
            <div className="row g-4">
              <div className="col-md-4 d-flex align-items-start gap-3">
                <FaEnvelope className="text-secondary mt-1" size={16} />
                <div>
                  <h6 className="fw-bold text-dark mb-0.5 small">
                    Email Support
                  </h6>
                  <span className="text-muted small">desk@company.com</span>
                </div>
              </div>
              <div className="col-md-4 d-flex align-items-start gap-3">
                <FaPhoneAlt className="text-secondary mt-1" size={16} />
                <div>
                  <h6 className="fw-bold text-dark mb-0.5 small">
                    Call Direct
                  </h6>
                  <span className="text-muted small">+1 (555) 019-2834</span>
                </div>
              </div>
              <div className="col-md-4 d-flex align-items-start gap-3">
                <FaMapMarkerAlt className="text-secondary mt-1" size={16} />
                <div>
                  <h6 className="fw-bold text-dark mb-0.5 small">
                    Headquarters
                  </h6>
                  <span className="text-muted small">Silicon Valley, CA</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Clean Minimalist Map Embed */}
          <div
            className="col-lg-5 bg-light position-relative border-start"
            style={{ minHeight: "450px" }}
          >
            <div className="w-100 h-100 position-absolute top-0 start-0">
              <iframe
                className="w-100 h-100 border-0 greyscale-map"
                src="https://maps.google.com/maps?q=Silicon%20Valley&t=&z=13&ie=UTF8&iwloc=&output=embed"
                allowFullScreen=""
                loading="lazy"
                title="HQ Location Map"
              ></iframe>
            </div>
          </div>
        </div>
      </div>

      {/* Injected style tokens for focus rings and subtle mapping adjustments */}
      <style>{`
                .custom-field:focus {
                    background-color: #ffffff !important;
                    border: 1px solid #212529 !important;
                    box-shadow: none !important;
                }
                .greyscale-map {
                    filter: grayscale(100%) contrast(105%) opacity(90%);
                    transition: filter 0.3s ease;
                }
                .greyscale-map:hover {
                    filter: grayscale(0%) contrast(100%) opacity(100%);
                }
            `}</style>
    </div>
  );
}
