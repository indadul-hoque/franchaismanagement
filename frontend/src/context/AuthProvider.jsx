import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
} from "react";
import axiosInstance from "../utils/axiosInstance";

// Create Context
const AuthContext = createContext();

// Custom hook to use AuthContext
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [user, setUser] = useState(null);

  const [courses, setCourses] = useState([]);
  const [franchiseeCenters, setFranchiseeCenters] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [students, setStudents] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState([]); // New state for enrolled courses

  // Check authentication status
  const checkAuthStatus = useCallback(async () => {
    try {
      const response = await axiosInstance.get("/users/profile");
      setIsAuthenticated(true);
      setUser(response.data);
      setUserRole(response.data.role);
    } catch (error) {
      setIsAuthenticated(false);
      setUserRole(null);

      setStudents([]);
      setCourses([]);
      setEnrolledCourses([]);
    }
  }, []);

  // Fetch courses from API
  const fetchCourses = useCallback(async () => {
    try {
      setLoadingCourses(true); // Start loading state before network trip
      const response = await axiosInstance.get(`/courses/allCourse`);
      const targetData = response.data?.courses || response.data;

      if (targetData && Array.isArray(targetData)) {
        setCourses(targetData);
      }
    } catch (error) {
      console.error("Fetch Courses Error:", error);
    } finally {
      setLoadingCourses(false); // 🔥 Turn off loading when request finishes
    }
  }, []);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  // Fetch all students
  const fetchAllStudents = useCallback(async () => {
    try {
      const response = await axiosInstance.get(
        `/admission/getAllAdmitedStudents`,
      );
      if (Array.isArray(response.data)) {
        setStudents(response.data);
      } else {
        console.error("Invalid student data format:", response.data);
        setStudents([]);
      }
    } catch (error) {
      console.error("Fetch Students Error:", error);
      setStudents([]);
    }
  }, []);

  // Fetch enrolled courses for the logged-in user
  const fetchEnrolledCourses = useCallback(async () => {
    try {
      const response = await axiosInstance.get("/enrollment/my-courses");

      if (Array.isArray(response.data)) {
        setEnrolledCourses(response.data);
      } else {
        setEnrolledCourses([]);
      }
    } catch (error) {
      console.error(error);
      setEnrolledCourses([]);
    }
  }, []);

  // Delete student
  const deleteStudent = async (studentId) => {
    if (!window.confirm("Are you sure you want to delete this student?"))
      return;

    try {
      await axiosInstance.delete(
        `/admission/deleteAdmitedStudent/${studentId}`,
      );
      setStudents((prevStudents) =>
        prevStudents.filter((student) => student._id !== studentId),
      );
    } catch (error) {
      console.error("Delete Student Error:", error);
    }
  };

  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchCourses();
      fetchAllStudents();
      fetchEnrolledCourses(); // Fetch enrolled courses when authenticated
    }
  }, [isAuthenticated, fetchCourses, fetchAllStudents, fetchEnrolledCourses]);

  // Login function
  const login = async ({ email, password, role }) => {
    const response = await axiosInstance.post("/users/login", {
      email,
      password,
      role,
    });

    await checkAuthStatus();

    await fetchCourses();
    await fetchAllStudents();
    await fetchEnrolledCourses();
    return response.data;
  };

  // Register function
  const register = async ({ firstName, lastName, phone, email, password }) => {
    const response = await axiosInstance.post("/users/register", {
      firstName,
      lastName,
      phone,
      email,
      password,
    });
    return response.data;
  };
  // Logout function
  const logout = async () => {
    try {
      await axiosInstance.get("/users/logout");
    } catch (err) {
      console.error(err);
    }

    setIsAuthenticated(false);
    setUserRole(null);

    setStudents([]);
    setCourses([]);
    setEnrolledCourses([]);
  };
  const fetchFranchiseeCenters = async () => {
    try {
      const response = await axiosInstance.get("/franchises/getAllFranchises");

      const rawData = response.data;
      const arrayData = Array.isArray(rawData)
        ? rawData
        : rawData?.data || rawData?.franchises || [];

      // 3. Set the state
      setFranchiseeCenters(arrayData);

      return response.data;
    } catch (err) {
      console.log("Something went wrong when fetching the data", err);
      setFranchiseeCenters([]);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        setIsAuthenticated,
        isAuthenticated,
        franchiseeCenters,
        fetchFranchiseeCenters,
        user,
        userRole,
        students,
        courses,
        loadingCourses,
        enrolledCourses, // Provide enrolled courses to the context
        login,
        register,
        logout,
        fetchCourses,
        fetchAllStudents,
        fetchEnrolledCourses,
        deleteStudent,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
