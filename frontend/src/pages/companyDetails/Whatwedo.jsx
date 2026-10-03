import React, { useEffect } from 'react'
import { Container, Row, Col, Card } from 'react-bootstrap';
import { FaChalkboardTeacher, FaBrain, FaCalculator, FaBookOpen, FaClipboardList, FaStar } from 'react-icons/fa';

const services = [
    {
        title: "Interactive Learning",
        description: "Our unique and extremely interactive approach for the overall mental development of children.",
        icon: <FaChalkboardTeacher />
    },
    {
        title: "Step-by-Step Guidance",
        description: "Classes provide a step-by-step approach aimed at guiding students in visualizing the Abacus in mind.",
        icon: <FaBrain />
    },
    {
        title: "Faster Calculations",
        description: "Students learn to calculate sums faster than a calculator!",
        icon: <FaCalculator />
    },
    {
        title: "Modern Teaching Methods",
        description: "We standardize and modernize the teachers' training to ensure the best learning experience.",
        icon: <FaBookOpen />
    },
    {
        title: "Comprehensive Curriculum",
        description: "We cover Addition, Subtraction, Multiplication, Division, and more.",
        icon: <FaClipboardList />
    },
    {
        title: "Advanced Topics",
        description: "Fractions, Percentages, Square Roots, and other advanced topics are also included.",
        icon: <FaStar />
    },
];


export default function Whatwedo() {
    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])
    return (
        <div>
            

            {/* what we do page content */}
            <div className="whatwedo">
                <Container className="mt-5">
                    <h2 className="text-left whatwedo-tittle mb-4">What We Do</h2>
                    <p className="text-left summary mb-4">
                        At MathGuruAbacus, we are dedicated to enhancing children's cognitive abilities through innovative learning methods. Our programs focus on interactive learning, step-by-step guidance, and a comprehensive curriculum designed to foster a love for learning and improve mental agility.
                    </p>
                    <Row className="justify-content-center">
                        {services.map((service, index) => (
                            <Col md={4} key={index} className="mb-4">
                                <Card className="service-card">
                                    <Card.Body>
                                        <Card.Title>
                                            {service.icon} {service.title}
                                        </Card.Title>
                                        <Card.Text>{service.description}</Card.Text>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </Container>
            </div>

            {/* what we do page end */}
        </div>
    )
}
