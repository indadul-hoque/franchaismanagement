import React, { useEffect } from 'react';
import { FaChalkboardTeacher, FaBusinessTime, FaUniversity } from 'react-icons/fa';

export default function Criteria() {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const criteria = [
        {
            title: 'Unit Franchise',
            icon: <FaChalkboardTeacher />,
            description: [
                'Any person in a village or an urban area with one institute of minimum 150 sq ft may become a unit Franchise.',
                'Have passion for teaching/education.',
                'Have capacity to learn and apply new methods of teaching.',
                'Investment range-Rs-10000/- to 20000/-'
            ]
        },
        {
            title: 'City Franchise',
            icon: <FaBusinessTime />,
            description: [
                'A person of a city who has more than one institution of minimum 200 sq ft room each may become a city Franchise.',
                'We will arrange training for three teachers.',
                'A City Franchise must have passion for promoting business.',
                'A City Franchise must have capacity to open new institutions.',
                'Investment range Rs-20000/- to 40000/-'
            ]
        },
        {
            title: 'Master Franchise',
            icon: <FaUniversity />,
            description: [
                'A Master Franchise may start or open a new institution in any area where there is no other branch of Math Guru Abacus.',
                'A Master Franchise may offer franchise to any business personal contacting the head office and he would be given 30% of Franchise fees.',
                'For any new franchise agreement will be made in the Head office.'
            ]
        }
    ];

    return (
        <div className="container mt-5">
            {/* Header Section */}
            <header className="text-center courseHeader mb-5">
                <h1 className="display-4 courseH1">Franchise Criteria</h1>
                <p className="lead coursePara">Explore the different types of franchises we offer and their requirements</p>
            </header>

            {/* Criteria Section */}
            <section>
                <div className="row">
                    {criteria.map((item, index) => (
                        <div key={index} className="col-md-6 col-lg-4 mb-4">
                            <div className="card h-100">
                            <div className="card-header addCard text-white">
                            <div className="mb-3 franchiseIconCriteria">
                                        {item.icon}
                                    </div><h5 className="card-title text-light">{item.title}</h5>
                                </div>
                                <div className="card-body text-center">
                                    <div className="text-center">
                                    
                                    </div>
                                    
                                    <ul className="list-styled text-muted text-start">
                                        {item.description.map((desc, i) => (
                                            <li key={i} className="mb-2">
                                                <span className="font-weight-bold"> </span>{desc}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
