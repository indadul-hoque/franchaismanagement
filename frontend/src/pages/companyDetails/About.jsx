import React, { useEffect } from "react";
import { FaBullseye, FaEye, FaPhoneAlt } from "react-icons/fa";

export default function About() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Encapsulated UI config object to avoid global leakage & eliminate external stylesheet coupling
  const styles = {
    badgeTypography: {
      fontFamily: "'Pacifico', cursive",
      fontSize: "1.4rem",
      letterSpacing: "0.5px",
    },
    cardDecoration: {
      backgroundColor: "#ffffff",
      border: "1px solid #f1f5f9",
      borderRadius: "16px",
      padding: "24px",
      transition: "all 0.3s ease",
    },
    avatarFrame: {
      width: "56px",
      height: "56px",
      objectFit: "cover",
      border: "2px solid #e2e8f0",
    },
    pulseTrigger: {
      width: "48px",
      height: "48px",
      backgroundColor: "#eaf2fe",
      color: "#1f68ee",
      transition: "transform 0.2s ease",
    },
  };

  return (
    <section className="position-relative py-5 m-5 shadow-sm rounded-4 overflow-hidden bg-white">
      {/* Subtle Aesthetic Background Glow Elements */}
      <div
        className="position-absolute bg-primary opacity-5 rounded-circle"
        style={{ width: "400px", height: "400px", top: "-10%', left: '-10%" }}
      ></div>
      <div
        className="position-absolute bg-warning opacity-5 rounded-circle"
        style={{ width: "300px", height: "300px", bottom: "-5%", right: "-5%" }}
      ></div>

      <div className="container position-relative">
        <div className="row align-items-center g-5">
          {/* Left Frame Visual Asset Section */}
          <div className="col-lg-6">
            <div className="position-relative p-2 p-md-4">
              {/* Decorative Frame Grid Accents */}
              <div
                className="position-absolute bg-warning opacity-10 rounded-4"
                style={{
                  top: "0",
                  left: "0",
                  width: "90%",
                  height: "95%",
                  zIndex: 1,
                  transform: "rotate(-3deg)",
                }}
              ></div>

              {/* Primary Visual Element Container */}
              <div
                className="position-relative overflow-hidden rounded-4 shadow-lg border border-light"
                style={{ zIndex: 2 }}
              >
                <img
                  src="/05.webp"
                  alt="Children studying abacus mathematics metrics"
                  className="img-fluid w-100"
                  style={{ objectFit: "cover", minHeight: "360px" }}
                />
              </div>

              {/* floating micro stats showcase banner element overlay */}
              <div
                className="position-absolute bg-white p-3 rounded-4 shadow border border-light d-flex align-items-center gap-3"
                style={{
                  bottom: "0",
                  right: "8%",
                  zIndex: 3,
                  maxWidth: "220px",
                }}
              >
                <div
                  className="bg-success bg-opacity-10 text-success rounded-circle p-2 d-flex align-items-center justify-content-center"
                  style={{ width: "42px", height: "42px" }}
                >
                  <span className="fw-black fs-5" style={{ fontWeight: "900" }}>
                    99%
                  </span>
                </div>
                <div>
                  <h6 className="mb-0 fw-bold text-dark small">Success Rate</h6>
                  <span
                    className="text-muted small"
                    style={{ fontSize: "0.75rem" }}
                  >
                    Parent Satisfaction
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Corporate Narrative Content Section */}
          <div className="col-lg-6">
            <div className="ps-lg-3">
              {/* Elegant Section Top Identity Hook Header */}
              <span
                className="text-primary d-inline-block mb-2 fw-semibold"
                style={styles.badgeTypography}
              >
                About Our Academy
              </span>

              <h2
                className="fw-black text-dark mb-3"
                style={{
                  fontWeight: "800",
                  fontSize: "2.3rem",
                  letterSpacing: "-0.5px",
                }}
              >
                Welcome To MathGuru Abacus <br /> For Your Child
              </h2>

              <p
                className="text-secondary mb-4 leading-relaxed"
                style={{ fontSize: "1.05rem" }}
              >
                At MathGuru Abacus, we turn standard quantitative learning
                branches into a fun, tactile developmental adventure! Through
                the refined methodology of abacus tracking modules, we
                systematically help children build razor-sharp computational
                speed, accelerate visualization memory matrices, and unlock
                authentic academic potential inside an encouraging community
                hub.
              </p>

              {/* Split Feature Grid Panels */}
              <div className="row g-3 mb-4">
                {/* Mission Highlight Card Module */}
                <div className="col-sm-6">
                  <div
                    className="shadow-sm h-100"
                    style={styles.cardDecoration}
                  >
                    <div
                      className="bg-primary bg-opacity-10 text-primary rounded-3 d-flex align-items-center justify-content-center mb-3"
                      style={{ width: "46px", height: "46px" }}
                    >
                      <FaBullseye size={22} />
                    </div>
                    <h5
                      className="fw-bold text-dark mb-2"
                      style={{ fontSize: "1.1rem" }}
                    >
                      Our Mission
                    </h5>
                    <p className="text-muted small mb-0 lh-base">
                      To spark a lifelong obsession for math by converting
                      linear metrics into confidence-building games via modern
                      abacus modules.
                    </p>
                  </div>
                </div>

                {/* Vision Highlight Card Module */}
                <div className="col-sm-6">
                  <div
                    className="shadow-sm h-100"
                    style={styles.cardDecoration}
                  >
                    <div
                      className="bg-warning bg-opacity-10 text-warning rounded-3 d-flex align-items-center justify-content-center mb-3"
                      style={{ width: "46px", height: "46px" }}
                    >
                      <FaEye size={22} />
                    </div>
                    <h5
                      className="fw-bold text-dark mb-2"
                      style={{ fontSize: "1.1rem" }}
                    >
                      Our Vision
                    </h5>
                    <p className="text-muted small mb-0 lh-base">
                      To cultivate the next generation of creative
                      problem-solvers and self-assured critical thinkers through
                      playful visual arithmetic spaces.
                    </p>
                  </div>
                </div>
              </div>

              {/* Premium Footnote Executive & Support Communication Board */}
              <div className="d-flex flex-wrap align-items-center justify-content-between pt-4 border-top border-light-subtle gap-3">
                {/* Founder Corporate Snapshot Wrapper */}
                <div className="d-flex align-items-center gap-3">
                  <img
                    src="/Support.png"
                    alt="Rabin Saha - Executive Academic Director"
                    className="rounded-circle shadow-sm border"
                    style={styles.avatarFrame}
                  />
                  <div>
                    <h6
                      className="mb-0 fw-bold text-dark"
                      style={{ fontSize: "1rem" }}
                    >
                      Rabin Saha
                    </h6>
                    <span
                      className="text-muted small"
                      style={{ fontSize: "0.85rem" }}
                    >
                      Co-Founder & Director
                    </span>
                  </div>
                </div>

                {/* Instant Telephony Hotline Node Module */}
                <div className="d-flex align-items-center gap-3 bg-light bg-opacity-50 px-3 py-2 rounded-pill border border-light">
                  <div
                    className="rounded-circle d-flex align-items-center justify-content-center shadow-sm"
                    style={styles.pulseTrigger}
                  >
                    <FaPhoneAlt size={14} />
                  </div>
                  <div>
                    <span
                      className="text-muted d-block"
                      style={{
                        fontSize: "0.75rem",
                        fontWeight: "500",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                      }}
                    >
                      Corporate Support
                    </span>
                    <a
                      href="tel:+2085550112"
                      className="fw-bold text-dark text-decoration-none"
                      style={{ fontSize: "0.95rem" }}
                    >
                      +208-555-0112
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
