import React, { useEffect, useState } from 'react'

export default function BecomeTrainer() {
    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        phone: "",
        dob: "",
        expertise: "",
        experience: "",
        days: [],
        resume: null,
        profilePicture: null,
        address: "",
        agreeTerms: false,
    });

    const handleChange = (e) => {
        const { name, value, type, checked, files } = e.target;
        if (type === "checkbox") {
            setFormData({ ...formData, [name]: checked });
        } else if (type === "file") {
            setFormData({ ...formData, [name]: files[0] });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Form submitted: ", formData);
    };

    return (
        <div className="container mt-5">
            <h1 className="text-center mb-4">Become a Trainer</h1>
            <form onSubmit={handleSubmit}>
                <div className="row">
                    <div className="col-sm-6">
                        <div className="mb-24">
                            <label className="form-label">Full Name</label>
                            <input
                                type="text"
                                name="fullName"
                                className="form-control"
                                value={formData.fullName}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>
                    <div className="col-sm-6">
                        <div className="mb-24">
                            <label className="form-label">Email Address</label>
                            <input
                                type="email"
                                name="email"
                                className="form-control"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-sm-6">
                        <div className="mb-24">
                            <label className="form-label">Phone Number</label>
                            <input
                                type="tel"
                                name="phone"
                                className="form-control"
                                value={formData.phone}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                    <div className="col-sm-6">
                        <div className="mb-24">
                            <label className="form-label">Date of Birth</label>
                            <input
                                type="date"
                                name="dob"
                                className="form-control"
                                value={formData.dob}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                </div>

                <div className="mb-3">
                    <label className="form-label">Expertise</label>
                    <select
                        name="expertise"
                        className="form-select"
                        value={formData.expertise}
                        onChange={handleChange}
                    >
                        <option value="">Select Expertise</option>
                        <option value="Math">Math</option>
                        <option value="Science">Science</option>
                        <option value="English">English</option>
                        <option value="Programming">Programming</option>
                    </select>
                </div>
                <div className="mb-3">
                    <label className="form-label">Years of Experience</label>
                    <input
                        type="number"
                        name="experience"
                        className="form-control"
                        value={formData.experience}
                        onChange={handleChange}
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Resume</label>
                    <input
                        type="file"
                        name="resume"
                        className="form-control"
                        onChange={handleChange}
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Profile Picture</label>
                    <input
                        type="file"
                        name="profilePicture"
                        className="form-control"
                        onChange={handleChange}
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Address</label>
                    <textarea
                        name="address"
                        className="form-control"
                        rows="4"
                        value={formData.address}
                        onChange={handleChange}
                    />
                </div>
                <div className="mb-3 form-check">
                    <input
                        type="checkbox"
                        name="agreeTerms"
                        className="form-check-input"
                        checked={formData.agreeTerms}
                        onChange={handleChange}
                    />
                    <label className="form-check-label">
                        I agree to the terms and conditions
                    </label>
                </div>
                <button type="submit" className="btn trainerSubmitbtn">
                    Submit
                </button>
            </form>
        </div>
    );
};