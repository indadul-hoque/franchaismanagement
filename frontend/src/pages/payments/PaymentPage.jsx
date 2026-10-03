// PaymentPage.jsx
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import toast from 'react-hot-toast';

const PaymentPage = () => {
    const navigate = useNavigate();
    const { state } = useLocation();
    const { courseId, courseName } = state || {};

    const handlePaymentSubmit = (e) => {
        e.preventDefault();
        // Add your payment processing logic here
        toast.success("Payment successful!");
        navigate('/enrollment-confirmation', { state: { courseId, courseName } });
    };

    return (
        <div className="container mt-5">
            <div className="card shadow-lg">
                <div className="card-header bg-primary text-white">
                    <h2 className="mb-0">Complete Your Enrollment</h2>
                </div>
                <div className="card-body">
                    <div className="row">
                        {/* Course Summary */}
                        <div className="col-md-6 mb-4">
                            <h3>Course Details</h3>
                            <div className="card">
                                <div className="card-body">
                                    <h5 className="card-title">{courseName}</h5>
                                    <p className="card-text">
                                        <strong>Course ID:</strong> {courseId}<br/>
                                        <strong>Price:</strong> ₹999/month
                                    </p>
                                    <ul className="list-group list-group-flush">
                                        <li className="list-group-item">✔ Lifetime access</li>
                                        <li className="list-group-item">✔ Certificate of completion</li>
                                        <li className="list-group-item">✔ 24/7 support</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Payment Form */}
                        <div className="col-md-6">
                            <h3>Payment Information</h3>
                            <form onSubmit={handlePaymentSubmit}>
                                <div className="mb-3">
                                    <label className="form-label">Card Number</label>
                                    <input type="text" className="form-control" placeholder="4242 4242 4242 4242" required />
                                </div>
                                
                                <div className="row mb-3">
                                    <div className="col-md-6">
                                        <label className="form-label">Expiry Date</label>
                                        <input type="text" className="form-control" placeholder="MM/YY" required />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label">CVC</label>
                                        <input type="text" className="form-control" placeholder="123" required />
                                    </div>
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Card Holder Name</label>
                                    <input type="text" className="form-control" placeholder="John Doe" required />
                                </div>

                                <div className="d-grid gap-2">
                                    <button type="submit" className="btn btn-primary btn-lg">
                                        Pay ₹999 Now
                                    </button>
                                    <button 
                                        type="button" 
                                        className="btn btn-outline-secondary"
                                        onClick={() => navigate(-1)}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentPage;