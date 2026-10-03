import React from 'react';
import { Carousel, Button, Container } from 'react-bootstrap';

export default function Hero() {
    return (
        <Carousel interval={3000} pause={true}>
            {/* === Slide 1 === */}
            <Carousel.Item>
                <div className="position-relative">
                    {/* Full width image */}
                    <img
                        className="d-block w-100"
                        src="./slider-1.png"
                        alt="First slide"
                        style={{ height: "100vh", objectFit: "cover" }}
                    />

                    {/* Text content overlay */}
                    <div className="position-absolute top-50 translate-middle text-start text-white px-3" style={{ left: '38%', maxWidth: '800px', transform: 'translate(-50%, -50%)' }}>
                        <p className="text-warning fw-semibold mb-2 fs-5">🎈 Welcome To Kidsa</p>
                        <h1 className="fw-bold display-4 mb-3 text-dark">
                            Trial Nanny Free <br />
                            On <span className="text-warning">First Day.</span>
                        </h1>
                        <p className="text-muted fs-5">
                            A safe and joyful place where kids learn, play, and grow every day.
                            Your child’s happiness and growth is our top priority.
                        </p>
                        <div className="position-absolute d-flex justify-content-start align-items-center mt-4" style={{ left: '18%', transform: 'translate(-50%, -50%)' }}>
                            <Button variant="success" className="px-3 py-2 rounded-pill fw-bold">
                                Learn More →
                            </Button>
                            <Button variant="outline-success" className="px-3 py-2 rounded-pill fw-bold">
                                Join Now →
                            </Button>
                        </div>

                    </div>
                </div>
            </Carousel.Item>

            {/* === Slide 2 === */}
            <Carousel.Item>
                <div className="position-relative">
                    <img
                        className="d-block w-100"
                        src="./slider-2.png"
                        alt="Second slide"
                        style={{ height: "100vh", objectFit: "cover" }}
                    />
                    <div className="position-absolute top-50  translate-middle text-start text-white px-3" style={{ left: '38%', maxWidth: '800px', transform: 'translate(-50%, -50%)' }}>
                        <p className="text-success fw-semibold mb-2 fs-5">🌱 Learning Through Play</p>
                        <h1 className="fw-bold display-4 mb-3 text-success">
                            Grow & Glow <br /> With Confidence
                        </h1>
                        <p className="text-warning fs-5">
                            Watch your child bloom in a vibrant and caring space.
                            We nurture minds through creativity, laughter, and discovery.
                        </p>
                        <div className="position-absolute d-flex justify-content-start align-items-center mt-4" style={{ left: '18%', transform: 'translate(-50%, -50%)' }}>
                            <Button variant="success" className="px-3 py-2 rounded-pill fw-bold">
                                Learn More →
                            </Button>
                            <Button variant="outline-success" className="px-3 py-2 rounded-pill fw-bold">
                                Join Now →
                            </Button>
                        </div>

                    </div>
                </div>
            </Carousel.Item>

            {/* === Slide 3 === */}
            <Carousel.Item>
                <div className="position-relative">
                    <img
                        className="d-block w-100"
                        src="./slider-3.png"
                        alt="Third slide"
                        style={{ height: "100vh", objectFit: "cover" }}
                    />
                    <div className="position-absolute top-50  translate-middle text-start text-white px-3" style={{ left: '38%', maxWidth: '800px', transform: 'translate(-50%, -50%)' }}>
                        <p className="text-primary fw-semibold mb-2 fs-5">📚 Discover the Joy</p>
                        <h1 className="fw-bold display-4 mb-3 text-primary">
                            Education <br /> That Inspires
                        </h1>
                        <p className="text-black fs-5">
                            Our engaging curriculum helps young minds think big.
                            Let your child explore, ask questions, and thrive with confidence.
                        </p>
                        <div className="position-absolute d-flex justify-content-start align-items-center mt-4" style={{ left: '4%', transform: 'translate(-50%, -50%)' }}>
                            <Button variant="outline-success" className="rounded-pill fw-bold">
                                Join Now →
                            </Button>
                        </div>

                    </div>
                </div>
            </Carousel.Item>
        </Carousel>
    );
}
