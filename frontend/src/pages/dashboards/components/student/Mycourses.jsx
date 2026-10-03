import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { currentConfig } from "../../../../utils";

const API_URL = currentConfig.API_URL;

export default function EnrolledCourses() {
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStudentEnrollments = async () => {
      try {
        // Get logged-in student from localStorage
        const student = JSON.parse(localStorage.getItem("student"));

        if (!student || !student._id) {
          setError("Student data is missing. Please log in again.");
          return;
        }

        // Fetch only enrollments of the logged-in student
        const response = await axios.get(
          `${API_URL}/enrollcourse/enrolled/${student._id}`,
          {
            headers: { Authorization: `Bearer ${localStorage.getItem("jwt")}` },
          },
        );

        console.log("Fetched Enrollments:", response.data);

        if (Array.isArray(response.data) && response.data.length > 0) {
          setEnrolledCourses(response.data);
        } else {
          setEnrolledCourses([]); // No enrollments for this student
        }
      } catch (error) {
        setError("Failed to fetch enrolled courses.");
        console.error("Fetch Error:", error);
      }
    };

    fetchStudentEnrollments();
  }, []);

  const handlePayment = (courseId) => {
    navigate(`/payment/${courseId}`); // Redirect to payment page
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">My Enrolled Courses</h2>

      {error && <p className="text-danger">{error}</p>}

      {enrolledCourses.length > 0 ? (
        <div className="table-responsive">
          <table className="table table-bordered">
            <thead className="thead-dark">
              <tr>
                <th>#</th>
                <th>Course Name</th>
                <th>Enrollment Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {enrolledCourses.map((enrollment, index) => (
                <tr key={enrollment._id}>
                  <td>{index + 1}</td>
                  <td>{enrollment.courseTitle || "N/A"}</td>
                  <td>
                    {new Date(enrollment.enrolledAt).toLocaleDateString()}
                  </td>
                  <td>
                    <button
                      className="btn btn-primary"
                      onClick={() => handlePayment(enrollment.courseId?._id)}
                    >
                      Pay Now
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>No enrolled courses found.</p>
      )}
    </div>
  );
}
