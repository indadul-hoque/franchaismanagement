import React, { useEffect, useState } from "react";
import axios from "axios";
import { MdDelete } from "react-icons/md";

import { currentConfig } from "../../../../utils";

const API_URL = currentConfig.API_URL;

export default function EnrolledCourses() {
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [totalEnrollments, setTotalEnrollments] = useState(0);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAllEnrolledCourses = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/enrollcourse/allenrolledcourse`,
        );

        console.log("Fetched Enrollments:", response.data);

        if (Array.isArray(response.data)) {
          setEnrolledCourses(response.data);
          setTotalEnrollments(response.data.length);
        } else {
          setError("API did not return an array.");
        }
      } catch (error) {
        setError("Failed to fetch enrolled courses.");
        console.error("Fetch Error:", error);
      }
    };

    fetchAllEnrolledCourses();
  }, []);

  const handleDelete = async (enrollmentId) => {
    console.log("Attempting to delete Enrollment:", enrollmentId); // Debugging log

    if (!enrollmentId) {
      console.error("Invalid enrollmentId");
      return;
    }

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this enrollment?",
    );
    if (!confirmDelete) return;

    try {
      const response = await axios.delete(
        `${API_URL}/enrollcourse/deletestudentenrollment/${enrollmentId}`,
      );

      console.log("Delete Response:", response.data);

      // Update state to remove the deleted enrollment
      setEnrolledCourses((prevCourses) =>
        prevCourses.filter((enrollment) => enrollment._id !== enrollmentId),
      );
      setTotalEnrollments((prev) => prev - 1);
    } catch (error) {
      console.error(
        "Failed to delete enrollment:",
        error.response?.data || error.message,
      );
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">All Enrolled Courses</h2>
      <p>Total Enrollments: {totalEnrollments}</p>
      {error && <p className="text-danger">{error}</p>}

      {enrolledCourses.length > 0 ? (
        <div className="table-container">
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Student Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Course Title</th>
                  <th>Duration</th>
                  <th>Payment Method</th>
                  <th>Payment Status</th>
                  <th>Enrollment Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {enrolledCourses.map((enrollment) => (
                  <tr key={enrollment._id}>
                    <td>
                      {enrollment.studentId
                        ? `${enrollment.studentId.firstName} ${enrollment.studentId.lastName}`
                        : "N/A"}
                    </td>
                    <td>{enrollment.studentId?.email || "N/A"}</td>
                    <td>{enrollment.studentId?.phone || "N/A"}</td>
                    <td>{enrollment.courseId?.courseTittle || "N/A"}</td>
                    <td>{enrollment.courseId?.duration || "N/A"}</td>
                    <td>{enrollment.paymentMethod}</td>
                    <td>{enrollment.paymentStatus}</td>
                    <td>
                      {new Date(enrollment.enrolledAt).toLocaleDateString()}
                    </td>
                    <td>
                      {enrollment._id && (
                        <button
                          className="btn mx-3"
                          onClick={() => handleDelete(enrollment._id)}
                        >
                          <MdDelete size={20} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <p>No enrollments available.</p>
      )}
    </div>
  );
}
