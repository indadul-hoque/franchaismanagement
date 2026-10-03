import React from "react";
import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";

export default function ClassesSlider() {
  const navigate = useNavigate();

  const classesData = [
    {
      img: "/01.webp",
      title: "Abacus",
      desc: "Boost your child's math skills and concentration through fun abacus-based learning.",
      age: "5-12 years",
      weekly: "5 Days",
      time: "1 Hour",
    },
    {
      img: "/01.webp",
      title: "Kids English",
      desc: "Enhance your child's vocabulary, grammar, and communication skills with engaging activities.",
      age: "5-12 years",
      weekly: "5 Days",
      time: "1 Hour",
    },
    {
      img: "/01.webp",
      title: "Vedic Math",
      desc: "Master quick and easy calculation techniques with ancient Vedic math tricks.",
      age: "8-14 years",
      weekly: "5 Days",
      time: "1 Hour",
    },
    {
      img: "/01.webp",
      title: "Handwriting",
      desc: "Improve handwriting speed, style, and neatness through structured practice sessions.",
      age: "6-14 years",
      weekly: "5 Days",
      time: "1 Hour",
    },
  ];

  // Component-specific configuration parameters eliminating any reliance on external CSS loaders
  const styles = {
    sectionBackground: {
      background: "linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%)",
    },
    subtitleTypography: {
      fontFamily: "'Pacifico', cursive",
      fontSize: "1.4rem",
      letterSpacing: "0.5px",
    },
    cardWrapper: {
      backgroundColor: "#ffffff",
      borderRadius: "20px",
      transition:
        "transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s ease",
    },
    imageContainer: {
      height: "200px",
      borderRadius: "20px 20px 0 0",
      overflow: "hidden",
    },
  };

  return (
    <>
      {/* Global Inline Override Injection to style the dynamic Swiper Carousel arrows perfectly */}
      <style>
        {`
          .custom-class-swiper .swiper-button-next,
          .custom-class-swiper .swiper-button-prev {
            color: #ff9248 !important;
            background: rgba(255, 255, 255, 0.9);
            width: 44px;
            height: 44px;
            border-radius: 50%;
            box-shadow: 0 4px 12px rgba(0,0,0,0.08);
          }
          .custom-class-swiper .swiper-button-next:after,
          .custom-class-swiper .swiper-button-prev:after {
            font-size: 16px !important;
            font-weight: 800;
          }
          .custom-class-swiper .swiper-button-next:hover,
          .custom-class-swiper .swiper-button-prev:hover {
            background: #ffffff;
            transform: scale(1.05);
          }
        `}
      </style>

      <section
        className="py-5 overflow-hidden"
        style={styles.sectionBackground}
      >
        <div className="container py-4 text-center">
          {/* Section Header Layout */}
          <div className="mb-5 mx-auto" style={{ maxWidth: "650px" }}>
            <span
              className="text-primary d-inline-block mb-2 fw-semibold"
              style={styles.subtitleTypography}
            >
              Our Premium Courses
            </span>
            <h2
              className="fw-black text-dark tracking-tight mb-0"
              style={{
                fontWeight: "800",
                fontSize: "2.3rem",
                letterSpacing: "-0.5px",
              }}
            >
              We Meet Kids At Their Level <br />
              Regardless Of Their Age
            </h2>
            <div
              className="bg-primary rounded-pill mx-auto mt-3"
              style={{ width: "45px", height: "4px" }}
            ></div>
          </div>

          {/* Swiper Slider Wrapper Context */}
          <div className="px-1 px-md-3">
            <Swiper
              modules={[Navigation]}
              spaceBetween={24}
              slidesPerView={3}
              navigation
              loop={true}
              className="custom-class-swiper py-4"
              breakpoints={{
                0: { slidesPerView: 1, spaceBetween: 16 },
                768: { slidesPerView: 2, spaceBetween: 20 },
                992: { slidesPerView: 3, spaceBetween: 24 },
              }}
            >
              {classesData.map((item, index) => (
                <SwiperSlide key={index} className="h-auto">
                  <div
                    className="card border-0 shadow-sm h-100 position-relative border border-light"
                    style={styles.cardWrapper}
                  >
                    {/* Course Media Frame */}
                    <div
                      className="position-relative w-100"
                      style={styles.imageContainer}
                    >
                      <img
                        src={item.img}
                        alt={item.title}
                        className="w-100 h-100"
                        style={{ objectFit: "cover" }}
                      />
                      {/* Gradient Ambient Overlay masking the bottom edge */}
                      <div
                        className="position-absolute bottom-0 start-0 w-100 h-25"
                        style={{
                          background:
                            "linear-gradient(to top, rgba(0,0,0,0.15), transparent)",
                        }}
                      ></div>
                    </div>

                    {/* Course Summary Content Body */}
                    <div className="card-body d-flex flex-column justify-content-between p-4 text-start">
                      <div>
                        <h5
                          className="fw-bold text-dark mb-2 text-decoration-none"
                          style={{
                            cursor: "pointer",
                            fontSize: "1.25rem",
                            transition: "color 0.2s",
                          }}
                          onClick={() => navigate("/courses")}
                          onMouseEnter={(e) =>
                            (e.target.style.color = "#ff9248")
                          }
                          onMouseLeave={(e) =>
                            (e.target.style.color = "#212529")
                          }
                        >
                          {item.title}
                        </h5>
                        <p
                          className="text-secondary small lh-base mb-4"
                          style={{ minHeight: "60px" }}
                        >
                          {item.desc}
                        </p>
                      </div>

                      {/* Micro Metric Parametric Data Grid Footer */}
                      <div className="d-flex align-items-center justify-content-between pt-3 border-top border-light-subtle bg-light bg-opacity-20 rounded-3 px-2 py-1">
                        <div className="text-center flex-grow-1">
                          <span
                            className="d-block text-muted fw-bold text-uppercase mb-1"
                            style={{
                              fontSize: "0.65rem",
                              letterSpacing: "0.5px",
                            }}
                          >
                            Age Group
                          </span>
                          <span
                            className="fw-semibold text-dark"
                            style={{ fontSize: "0.82rem" }}
                          >
                            {item.age}
                          </span>
                        </div>

                        <div
                          className="bg-light-subtle opacity-50"
                          style={{ width: "1px", height: "24px" }}
                        ></div>

                        <div className="text-center flex-grow-1">
                          <span
                            className="d-block text-muted fw-bold text-uppercase mb-1"
                            style={{
                              fontSize: "0.65rem",
                              letterSpacing: "0.5px",
                            }}
                          >
                            Schedule
                          </span>
                          <span
                            className="fw-semibold text-dark"
                            style={{ fontSize: "0.82rem" }}
                          >
                            {item.weekly}
                          </span>
                        </div>

                        <div
                          className="bg-light-subtle opacity-50"
                          style={{ width: "1px", height: "24px" }}
                        ></div>

                        <div className="text-center flex-grow-1">
                          <span
                            className="d-block text-muted fw-bold text-uppercase mb-1"
                            style={{
                              fontSize: "0.65rem",
                              letterSpacing: "0.5px",
                            }}
                          >
                            Duration
                          </span>
                          <span
                            className="fw-semibold text-dark"
                            style={{ fontSize: "0.82rem" }}
                          >
                            {item.time}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </section>
    </>
  );
}
