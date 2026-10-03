import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaSearch, FaBell, FaChevronDown } from "react-icons/fa";
import { useAuth } from "../../../../context/AuthProvider";

const UnifiedHeader = () => {
    const [showDropdown, setShowDropdown] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const navigate = useNavigate();
    const { logout, userRole } = useAuth();

    // Get appropriate user info from local storage
    const user = JSON.parse(localStorage.getItem(userRole === 'student' ? 'student' : 'admin')) || {};
    const userName = user.firstName || (userRole === 'student' ? 'Student' : 'Admin');

    const toggleDropdown = (e) => {
        e.stopPropagation();
        setShowDropdown((prev) => !prev);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!event.target.closest(".dropdown-container")) {
                setShowDropdown(false);
            }
        };
        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/search?query=${searchQuery}`);
        }
    };

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    return (
        <header className="navbar navbar-expand px-4 py-3 border-bottom sticky-top bg-white" style={{ backdropFilter: "blur(8px)", backgroundColor: "rgba(255, 255, 255, 0.95)", borderColor: "#eaeaea" }}>
            <div className="container-fluid p-0 d-flex align-items-center justify-content-between">
                <div className="d-flex align-items-center flex-grow-1">
                    <form onSubmit={handleSearch} className="position-relative w-100" style={{ maxWidth: "320px" }}>
                        <span className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" style={{ zIndex: 5 }}>
                            <FaSearch size={14} />
                        </span>
                        <input
                            type="text"
                            className="form-control ps-5 py-2 border-0 bg-light rounded-3"
                            placeholder="Search everything..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={{ fontSize: "0.9rem", boxShadow: "none", transition: "all 0.2s ease", backgroundColor: "#f4f5f7" }}
                            onFocus={(e) => (e.target.style.backgroundColor = "#edf0f5")}
                            onBlur={(e) => (e.target.style.backgroundColor = "#f4f5f7")}
                        />
                    </form>
                </div>

                <div className="d-flex align-items-center gap-3">
                    <button className="btn btn-icon btn-light rounded-circle border-0 position-relative p-2" style={{ backgroundColor: "#f4f5f7", width: "40px", height: "40px" }}>
                        <FaBell className="text-secondary" />
                        <span className="position-absolute top-0 start-100 translate-middle p-1 bg-danger border border-light rounded-circle" style={{ marginTop: "8px", marginLeft: "-8px" }}>
                            <span className="visually-hidden">New alerts</span>
                        </span>
                    </button>

                    <div className="position-relative dropdown-container">
                        <div className="d-flex align-items-center p-1 pe-2 rounded-pill bg-light" onClick={toggleDropdown} style={{ cursor: "pointer", transition: "background-color 0.2s ease", userSelect: "none", backgroundColor: "#f4f5f7", gap: "8px" }}>
                            <div className="bg-secondary text-white rounded-circle d-flex justify-content-center align-items-center" style={{ width: "34px", height: "34px", fontSize: "16px", fontWeight: "bold" }}>
                                {userName.charAt(0)}
                            </div>
                            <div className="d-none d-md-block text-start" style={{ lineHeight: "1.2" }}>
                                <div className="fw-semibold text-dark" style={{ fontSize: "0.85rem" }}>{userName}</div>
                                <div className="text-muted text-capitalize" style={{ fontSize: "0.75rem" }}>{userRole}</div>
                            </div>
                            <FaChevronDown className="text-muted ms-1 d-none d-sm-block" size={10} />
                        </div>

                        {showDropdown && (
                            <div className="position-absolute bg-white border rounded-3 shadow-lg p-2 mt-2" style={{ top: "100%", right: 0, minWidth: "180px", zIndex: 1050, borderColor: "#f0f0f0", animation: "fadeIn 0.15s ease-out" }}>
                                <Link to="/dashboard" className="text-decoration-none">
                                    <button className="btn btn-link dropdown-item text-start rounded-2 py-2 px-3 text-dark border-0 style-none" style={{ fontSize: "0.9rem" }}>
                                        Home Dashboard
                                    </button>
                                </Link>
                                <hr className="my-1 text-muted" />
                                <button className="btn btn-link dropdown-item text-start rounded-2 py-2 px-3 text-danger border-0 style-none" onClick={handleLogout} style={{ fontSize: "0.9rem" }}>
                                    Sign Out
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default UnifiedHeader;
