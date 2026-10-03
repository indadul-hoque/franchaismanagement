import React, { useState, lazy, Suspense } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import { Route, Routes, useLocation, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import ProtectedRoute from "./ProtectRoute";
import { useAuth } from "./context/AuthProvider";
import { roleMeta } from "./config/navigation";

// ── Static / Always-loaded Components ──────────────────────────────────────
import NavBar from "./components/NavBar";
import Home from "./components/Home";
import Footer from "./components/Footer";
import NotFound from "./components/NotFound";
import Cart from "./pages/cart/Cart";
import Hero from "./components/Hero";

// ── Lazy: Public Pages ──────────────────────────────────────────────────────
const About = lazy(() => import("./pages/companyDetails/About"));
const Whatwedo = lazy(() => import("./pages/companyDetails/Whatwedo"));
const Contact = lazy(() => import("./pages/companyDetails/Contact"));
const Courses = lazy(() => import("./pages/courses/Courses"));
const CourseDetails = lazy(() => import("./pages/courses/CourseDetails"));
const Benifit = lazy(() => import("./pages/Franchise/Benifit"));
const Criteria = lazy(() => import("./pages/Franchise/Criteria"));
const BecomeTrainer = lazy(() => import("./pages/Trainer/BecomeTrainer"));
const Trainers = lazy(() => import("./pages/Trainer/Trainers"));
const Products = lazy(() => import("./pages/productPages/Products"));
const ProductDetails = lazy(
  () => import("./pages/productPages/ProductDetails"),
);
const FeeForm = lazy(() => import("./pages/feesCollection/FeeForm"));
const PaymentPage = lazy(() => import("./pages/payments/PaymentPage"));
const PlaceOrder = lazy(() => import("./pages/order/PlaceOrder"));
const ProductPaymentForm = lazy(
  () => import("./pages/feesCollection/ProductPaymentForm"),
);

// ── Lazy: Auth Pages ────────────────────────────────────────────────────────
const Login = lazy(() => import("./pages/Authentications/Login"));
const Register = lazy(() => import("./pages/Authentications/Register"));

// ── Lazy: Shared Dashboard Layout (NEW) ────────────────────────────────────
const DashboardLayout = lazy(() => import("./layouts/DashboardLayout"));

// ── Lazy: Role-Shared Dashboard Overview ───────────────────────────────────
const DashboardOverview = lazy(
  () => import("./pages/dashboards/DashboardOverview"),
);

// ── Lazy: ADMIN & FRANCHISE Pages ──────────────────────────────────────────
const ControlPanel = lazy(
  () => import("./pages/dashboards/components/admin/controlPanel/ControlPanel"),
);
const Franchises = lazy(
  () => import("./pages/dashboards/components/admin/franchises/Franchises"),
);
const AllBranches = lazy(
  () => import("./pages/dashboards/components/admin/branch/AllBranches"),
);
const AllCourse = lazy(
  () => import("./pages/dashboards/components/admin/courseSubTab/AllCourse"),
);
const StudentAdmission = lazy(
  () =>
    import("./pages/dashboards/components/admin/studentSubTab/StudentAdmission"),
);
const AllStudents = lazy(
  () => import("./pages/dashboards/components/admin/studentSubTab/AllStudents"),
);
const AllProducts = lazy(
  () => import("./pages/dashboards/components/admin/products/AllProducts"),
);
const AllStaff = lazy(
  () => import("./pages/dashboards/components/admin/staffSubTab/AllStaff"),
);
const EnrolledStudents = lazy(
  () => import("./pages/dashboards/components/shared/EnrolledStudents"),
);
const Allapproval = lazy(
  () => import("./pages/dashboards/components/admin/approvals/Allapproval"),
);
const Payout = lazy(
  () => import("./pages/dashboards/components/admin/manageFinance/Payout"),
);
const SupportTicket = lazy(
  () =>
    import("./pages/dashboards/components/admin/supportTicket/SupportTicket"),
);

// ── Lazy: STUDENT Pages ─────────────────────────────────────────────────────
const MyCourses = lazy(
  () => import("./pages/dashboards/components/student/Mycourses"),
);
const Downloads = lazy(
  () => import("./pages/dashboards/components/student/Downloads"),
);
const FeesHistory = lazy(
  () => import("./pages/dashboards/components/student/FeesHistory"),
);
const StudyMatOrder = lazy(
  () => import("./pages/dashboards/components/student/StudyMatOrder"),
);
const OrderHistory = lazy(
  () => import("./pages/dashboards/components/student/OrderHistory"),
);

// ── Lazy: Placeholder ───────────────────────────────────────────────────────
const ComingSoon = lazy(() => import("./pages/common/ComingSoon"));

// ─────────────────────────────────────────────────────────────────────────────
// Paths where the public NavBar/Footer should be hidden
const DASHBOARD_PREFIXES = ["/admin", "/franchise", "/student"];
const AUTH_PATHS = [
  "/login",
  "/register",
  "/franchise-registraion",
  "/franchise-login",
];

function App() {
  const location = useLocation();
  const { isAuthenticated, userRole } = useAuth();

  // Hide the public NavBar/Footer inside any dashboard namespace or on auth pages
  const hideNavbarFooter =
    DASHBOARD_PREFIXES.some((p) => location.pathname.startsWith(p)) ||
    AUTH_PATHS.includes(location.pathname);

  // Cart state
  const [cartItems, setCartItems] = useState([]);
  const addToCart = (item) => setCartItems((prev) => [...prev, item]);

  // Determine the home URL for the logged-in user's role
  const roleHome = roleMeta[userRole]?.home || "/login";

  return (
    <div>
      {!hideNavbarFooter && <NavBar />}

      <Suspense
        fallback={
          <div className="d-flex justify-content-center align-items-center vh-100">
            <div className="spinner-grow text-primary" role="status" />
          </div>
        }
      >
        <Routes>
          {/* ── Public Routes ──────────────────────────────────────────── */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/whatwedo" element={<Whatwedo />} />
          <Route path="/hero" element={<Hero />} />

          {/* Franchise Info */}
          <Route path="/benifit" element={<Benifit />} />
          <Route path="/criteria" element={<Criteria />} />

          {/* Trainers */}
          <Route path="/becomeatrainer" element={<BecomeTrainer />} />
          <Route path="/become-trainer" element={<BecomeTrainer />} />
          <Route path="/trainers" element={<Trainers />} />

          {/* Shop */}
          <Route
            path="/products"
            element={<Products addToCart={addToCart} />}
          />
          <Route path="/cart" element={<Cart cartItems={cartItems} />} />
          <Route
            path="/productDetails/:productName/:productImage/:price"
            element={<ProductDetails />}
          />
          <Route path="/productDetails" element={<ProductDetails />} />

          {/* Courses */}
          <Route path="/courses" element={<Courses />} />
          <Route path="/courses/:courseId" element={<CourseDetails />} />

          {/* Payments */}
          <Route path="/payment" element={<PaymentPage />} />
          <Route path="/feesForm" element={<FeeForm />} />
          <Route path="/placeOrder" element={<PlaceOrder />} />
          <Route path="/productPaymentForm" element={<ProductPaymentForm />} />

          {/* ── Auth Routes ────────────────────────────────────────────── */}
          <Route
            path="/login"
            element={
              isAuthenticated ? <Navigate to={roleHome} replace /> : <Login />
            }
          />
          <Route
            path="/register"
            element={
              isAuthenticated ? (
                <Navigate to={roleHome} replace />
              ) : (
                <Register />
              )
            }
          />

          {/* ── Legacy redirects ──────────────────────────────────────── */}
          <Route
            path="/dashboard"
            element={
              isAuthenticated ? (
                <Navigate to={roleHome} replace />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
            path="/admin-dashboard"
            element={<Navigate to="/admin/dashboard" replace />}
          />
          <Route
            path="/student-dashboard"
            element={<Navigate to="/student/dashboard" replace />}
          />
          <Route
            path="/franchise-dashboard"
            element={<Navigate to="/franchise/dashboard" replace />}
          />

          {/* ══════════════════════════════════════════════════════════════
              ADMIN Dashboard — /admin/*
          ══════════════════════════════════════════════════════════════ */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<DashboardOverview />} />
            <Route path="courses" element={<AllCourse />} />
            <Route path="franchises" element={<Franchises />} />
            <Route path="students" element={<AllStudents />} />
            <Route path="admissions" element={<StudentAdmission />} />
            <Route path="enrolled" element={<EnrolledStudents />} />
            <Route path="products" element={<AllProducts />} />
            <Route path="branches" element={<AllBranches />} />
            <Route path="control-panel" element={<ControlPanel />} />
            <Route path="approvals" element={<Allapproval />} />
            <Route path="financials" element={<Payout />} />
            <Route path="support" element={<SupportTicket />} />

            {/* Remaining Stubs */}
            <Route
              path="franchises"
              element={
                <ComingSoon
                  title="Franchises"
                  description="Manage all franchise partners from this section."
                />
              }
            />

            <Route
              path="support"
              element={
                <ComingSoon
                  title="Support Tickets"
                  description="View and respond to support requests from students and franchises."
                />
              }
            />
          </Route>

          {/* ══════════════════════════════════════════════════════════════
              FRANCHISE Dashboard — /franchise/*
          ══════════════════════════════════════════════════════════════ */}
          <Route
            path="/franchise"
            element={
              <ProtectedRoute allowedRoles={["franchise"]}>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<DashboardOverview />} />
            <Route path="admissions" element={<StudentAdmission />} />
            <Route path="students" element={<AllStudents />} />
            <Route path="enrolled" element={<EnrolledStudents />} />
            <Route path="courses" element={<AllCourse />} />
            <Route path="branches" element={<AllBranches />} />
            <Route path="staff" element={<AllStaff />} />
            <Route
              path="batches"
              element={
                <ComingSoon
                  title="Batches & Schedules"
                  description="Manage class batches, timing, and batch assignments."
                />
              }
            />
            <Route
              path="billing"
              element={
                <ComingSoon
                  title="Local Financials"
                  description="View fee collections, pending invoices, and financial reports for your franchise."
                />
              }
            />
          </Route>

          {/* ══════════════════════════════════════════════════════════════
              STUDENT Dashboard — /student/*
          ══════════════════════════════════════════════════════════════ */}
          <Route
            path="/student"
            element={
              <ProtectedRoute allowedRoles={["student"]}>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<DashboardOverview />} />
            <Route path="courses" element={<MyCourses />} />
            <Route path="assignments" element={<Downloads />} />
            <Route path="fees" element={<FeesHistory />} />
            <Route path="studymat" element={<StudyMatOrder />} />
            <Route path="orders" element={<OrderHistory />} />
            <Route
              path="live"
              element={
                <ComingSoon
                  title="Live Classes"
                  description="Join your scheduled live sessions with instructors in real time."
                  badge="Live"
                />
              }
            />
            <Route
              path="progress"
              element={
                <ComingSoon
                  title="Progress & Grades"
                  description="View your assessment scores, course completion, and grade reports."
                />
              }
            />
          </Route>

          {/* ── 404 Catch-all ──────────────────────────────────────────── */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>

      <Toaster position="top-right" />
      {!hideNavbarFooter && <Footer />}
    </div>
  );
}

export default App;
