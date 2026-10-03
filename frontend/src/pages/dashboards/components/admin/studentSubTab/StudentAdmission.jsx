import React, { useState } from "react";
import { IoPersonAdd } from "react-icons/io5";

import axios from "axios";
import toast from "react-hot-toast";

import { currentConfig } from "../../../../../utils";

const API_URL = currentConfig.API_URL;

export default function StudentAdmission() {
  const [formData, setFormData] = useState({
    studentName: "",
    schoolName: "",
    class: "",
    dateOfBirth: "",
    gender: "",
    age: "",
    hobbies: "",
    fatherName: "",
    fatherOccupation: "",
    motherName: "",
    motherOccupation: "",
    address: "",
    city: "",
    pinCode: "",
    state: "",
    mobileNumber: "",
    whatsAppNumber: "",
    email: "",
    branch: "",
    level: "",
    sourceReference: "",
    addmissionDate: "",
    selectCourse: "",
    courseMode: "",
    monthlyFees: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setFormData({
      studentName: "",
      schoolName: "",
      class: "",
      dateOfBirth: "",
      gender: "",
      age: "",
      hobbies: "",
      fatherName: "",
      fatherOccupation: "",
      motherName: "",
      motherOccupation: "",
      address: "",
      city: "",
      pinCode: "",
      state: "",
      mobileNumber: "",
      whatsAppNumber: "",
      email: "",
      branch: "",
      level: "",
      sourceReference: "",
      addmissionDate: "",
      selectCourse: "",
      courseMode: "",
      monthlyFees: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if any field is empty before submitting
    for (const key in formData) {
      if (formData[key].trim() === "") {
        toast.error(`Please fill in the ${key} field.`);
        return;
      }
    }

    setIsLoading(true);

    try {
      console.log("Submitting FormData:", formData); // Debugging: Check data before sending

      const response = await axios.post(
        `${API_URL}/admission/studentAdmission`,
        formData,
        {
          headers: { "Content-Type": "application/json" },
        },
      );
      toast.success("Student admitted successfully!");
      resetForm();
    } catch (error) {
      console.error(
        "Error admitting student:",
        error.response?.data || error.message,
      );
      toast.error(error.response?.data?.message || "Failed to admit student");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card shadow">
            <div className="card-header bg-primary text-white d-flex align-items-center">
              <IoPersonAdd className="me-2" />
              <h5 className="mb-0">Student Admission Form</h5>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-sm-6">
                    <div className="mb-24">
                      <label htmlFor="studentName" className="form-label">
                        Student Name
                      </label>
                      <div className="input-group">
                        <input
                          type="text"
                          id="studentName"
                          name="studentName"
                          className="form-control"
                          required
                          value={formData.studentName}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="mb-24">
                      <label htmlFor="schoolName" className="form-label">
                        School Name
                      </label>
                      <div className="input-group">
                        <input
                          type="text"
                          id="schoolName"
                          name="schoolName"
                          className="form-control"
                          required
                          value={formData.schoolName}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-sm-6">
                    <div className="mb-24">
                      <label htmlFor="class" className="form-label">
                        Class
                      </label>
                      <div className="input-group">
                        <input
                          type="text"
                          id="class"
                          name="class"
                          className="form-control"
                          required
                          value={formData.class}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="mb-24">
                      <label htmlFor="dateOfBirth" className="form-label">
                        Date of Birth
                      </label>
                      <div className="input-group">
                        <input
                          type="date"
                          id="dateOfBirth"
                          name="dateOfBirth"
                          className="form-control"
                          required
                          value={formData.dateOfBirth}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-sm-6">
                    <div className="mb-24">
                      <div className="mb-3">
                        <label htmlFor="gender" className="form-label">
                          Gender
                        </label>
                        <select
                          id="gender"
                          name="gender"
                          className="form-select"
                          required
                          value={formData.gender}
                          onChange={handleChange}
                        >
                          <option value="">Select Your Gender</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="Other">Others</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="mb-24">
                      <label htmlFor="age" className="form-label">
                        Age
                      </label>
                      <div className="input-group">
                        <input
                          type="number"
                          id="age"
                          name="age"
                          className="form-control"
                          required
                          value={formData.age}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-sm-6">
                    <div className="mb-24">
                      <label htmlFor="hobbies" className="form-label">
                        Hobbies
                      </label>
                      <div className="input-group">
                        <input
                          type="text"
                          id="hobbies"
                          name="hobbies"
                          className="form-control"
                          required
                          value={formData.hobbies}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-sm-6">
                    <div className="mb-24">
                      <label htmlFor="fatherName" className="form-label">
                        Father's Name
                      </label>
                      <div className="input-group">
                        <input
                          type="text"
                          id="fatherName"
                          name="fatherName"
                          className="form-control"
                          required
                          value={formData.fatherName}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="mb-24">
                      <label htmlFor="fatherOccupation" className="form-label">
                        Father's Occupation
                      </label>
                      <div className="input-group">
                        <input
                          type="text"
                          id="fatherOccupation"
                          name="fatherOccupation"
                          className="form-control"
                          required
                          value={formData.fatherOccupation}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-sm-6">
                    <div className="mb-24">
                      <label htmlFor="motherName" className="form-label">
                        Mather's Name
                      </label>
                      <div className="input-group">
                        <input
                          type="text"
                          id="motherName"
                          name="motherName"
                          className="form-control"
                          required
                          value={formData.motherName}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="mb-24">
                      <label htmlFor="motherOccupation" className="form-label">
                        Mother's Occupation
                      </label>
                      <div className="input-group">
                        <input
                          type="text"
                          id="motherOccupation"
                          name="motherOccupation"
                          className="form-control"
                          required
                          value={formData.motherOccupation}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mb-24">
                  <label htmlFor="address" className="form-label">
                    Address
                  </label>
                  <div className="input-group">
                    <textarea
                      id="address"
                      name="address"
                      className="form-control"
                      required
                      value={formData.address}
                      onChange={handleChange}
                      rows={2} // Adjust the number of rows as needed
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="col-sm-6 col-md-4">
                    <div className="mb-24">
                      <label htmlFor="city" className="form-label">
                        City
                      </label>
                      <div className="input-group">
                        <input
                          type="text"
                          id="city"
                          name="city"
                          className="form-control"
                          required
                          value={formData.city}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="col-sm-6 col-md-4">
                    <div className="mb-24">
                      <label htmlFor="pinCode" className="form-label">
                        Pin Code
                      </label>
                      <div className="input-group">
                        <input
                          type="text"
                          id="pinCode"
                          name="pinCode"
                          className="form-control"
                          required
                          value={formData.pinCode}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="col-sm-6 col-md-4">
                    <div className="mb-24">
                      <label htmlFor="state" className="form-label">
                        State
                      </label>
                      <div className="input-group">
                        <input
                          type="text"
                          id="state"
                          name="state"
                          className="form-control"
                          required
                          value={formData.state}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-sm-6">
                    <div className="mb-24">
                      <label htmlFor="mobileNumber" className="form-label">
                        Mobile Number
                      </label>
                      <div className="input-group">
                        <input
                          type="text"
                          id="mobileNumber"
                          name="mobileNumber"
                          className="form-control"
                          required
                          value={formData.mobileNumber}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="mb-24">
                      <label htmlFor="whatsAppNumber" className="form-label">
                        WhatsApp Number
                      </label>
                      <div className="input-group">
                        <input
                          type="text"
                          id="whatsAppNumber"
                          name="whatsAppNumber"
                          className="form-control"
                          required
                          value={formData.whatsAppNumber}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-sm-6">
                    <div className="mb-24">
                      <label htmlFor="email" className="form-label">
                        Email
                      </label>
                      <div className="input-group">
                        <input
                          type="text"
                          id="email"
                          name="email"
                          className="form-control"
                          required
                          value={formData.email}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="mb-24">
                      <div className="mb-3">
                        <label htmlFor="branch" className="form-label">
                          Branch
                        </label>
                        <select
                          id="branch"
                          name="branch"
                          className="form-select"
                          required
                          value={formData.branch}
                          onChange={handleChange}
                        >
                          <option value="">Select a branch</option>
                          <option value="berhampore">Berhampore</option>
                          <option value="cossimbazar">Cossimbazer</option>
                          <option value="lalbagh">Lalbagh</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-sm-6">
                    <div className="mb-24">
                      <label htmlFor="level" className="form-label">
                        Level Start From
                      </label>
                      <div className="input-group">
                        <input
                          type="text"
                          id="level"
                          name="level"
                          className="form-control"
                          required
                          value={formData.level}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="mb-24">
                      <label htmlFor="sourceReference" className="form-label">
                        Source or Reference From
                      </label>
                      <div className="input-group">
                        <input
                          type="text"
                          id="sourceReference"
                          name="sourceReference"
                          className="form-control"
                          required
                          value={formData.sourceReference}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="row mt-4">
                  <div className="col-sm-6">
                    <div className="mb-24">
                      <label htmlFor="addmissionDate" className="form-label">
                        Addmission Date
                      </label>
                      <div className="input-group">
                        <input
                          type="date"
                          id="addmissionDate"
                          name="addmissionDate"
                          className="form-control"
                          required
                          value={formData.addmissionDate}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-sm-6">
                    <div className="mb-24">
                      <div className="mb-3">
                        <label htmlFor="selectCourse" className="form-label">
                          Select Course
                        </label>
                        <select
                          id="selectCourse"
                          name="selectCourse"
                          className="form-select"
                          required
                          value={formData.selectCourse}
                          onChange={handleChange}
                        >
                          <option value="">Select Your Course</option>
                          <option value="abacus">Abacus</option>
                          <option value="vedicmath">Vadic Math</option>
                          <option value="handwritting">Handwritting</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="col-sm-6">
                    <div className="mb-24">
                      <div className="mb-3">
                        <label htmlFor="courseMode" className="form-label">
                          Select course Mode
                        </label>
                        <select
                          id="courseMode"
                          name="courseMode"
                          className="form-select"
                          required
                          value={formData.courseMode}
                          onChange={handleChange}
                        >
                          <option value="">Select Your Mode</option>
                          <option value="online">Online</option>
                          <option value="offline">Offline</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-sm-6">
                    <div className="mb-24">
                      <label htmlFor="level" className="form-label">
                        Level Start From
                      </label>
                      <div className="input-group">
                        <input
                          type="text"
                          id="level"
                          name="level"
                          className="form-control"
                          required
                          value={formData.level}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="mb-24">
                      <label htmlFor="monthlyFees" className="form-label">
                        Munthly Fees
                      </label>
                      <div className="input-group">
                        <input
                          type="number"
                          id="monthlyFees"
                          name="monthlyFees"
                          className="form-control"
                          required
                          value={formData.monthlyFees}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="d-flex justify-content-between mt-3">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={resetForm}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <div
                          className="spinner-border spinner-border-sm text-light me-2"
                          role="status"
                        ></div>
                        Submitting...
                      </>
                    ) : (
                      "Create Course"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
