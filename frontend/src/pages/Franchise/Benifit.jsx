import React, { useEffect } from 'react'
import { FaBriefcase, FaUserTie, FaHome, FaBook, FaChalkboardTeacher, FaBullhorn, FaRegIdBadge, FaCertificate } from 'react-icons/fa';

export default function Benifit() {
    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    const benefits = [
        { icon: <FaBriefcase />, title: "Established Brand", description: "We give a Business opportunity with an Established Brand Name in the field of Abacus." },
        { icon: <FaUserTie />, title: "Be Your Own Boss", description: "We inspire you to become your own BOSS." },
        { icon: <FaHome />, title: "Work From Home", description: "Learn easily and earn from home." },
        { icon: <FaBook />, title: "Detailed Manuals", description: "We provide detailed manuals for franchise and place a Trusted Business Model for the Franchise." },
        { icon: <FaChalkboardTeacher />, title: "Training Support", description: "We give complete training support to teachers." },
        { icon: <FaBullhorn />, title: "Digital Marketing Support", description: "Digital marketing support and lead generation support." },
        { icon: <FaRegIdBadge />, title: "Registration & IDs", description: "We generate facilities of online registration, I-card and Certificate." },
        { icon: <FaCertificate />, title: "Promotional Material", description: "Provides banners, prospectus, leaflets, books, and promotional material." }
    ];
    return (
        <div className="container mt-5">
            {/* Header Section */}
            <header className="text-center courseHeader mb-5">
                <h1 className="display-4 courseH1">Math Guru Franchise Benefits</h1>
                <p className="lead coursePara">Unlock a world of opportunities with our established brand in Abacus learning.</p>
            </header>
            <div className="row">
                {benefits.map((benefit, index) => (
                    <div className="col-md-6 mb-4" key={index}>
                        <div className="card shadow-sm h-100">
                            <div className="card-body d-flex align-items-start">
                                <div className="me-3 franchiseIcon" style={{ fontSize: '2rem' }}>
                                    {benefit.icon}
                                </div>
                                <div>
                                    <h5 className="card-title text-dark">{benefit.title}</h5>
                                    <p className="card-text text-muted">{benefit.description}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
