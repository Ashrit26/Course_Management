import CourseInput from "views/CourseForm.js"

import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Routes, Navigate, useNavigate } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.css";
import "assets/scss/paper-dashboard.scss?v=1.3.0";
import "assets/demo/demo.css";
import "perfect-scrollbar/css/perfect-scrollbar.css";

import AdminLayout from "layouts/Admin.js";

// New component for the login page
function LoginPage() {
    const navigate = useNavigate();

    const handleAdminLogin = () => {
        // Redirect to admin dashboard
        navigate("/admin/dashboard", { replace: true });
    };

    const handleStudentLogin = () => {
        // Redirect to student course input page
        navigate("/admin/courseInput", { replace: true });
    };

    return (
        <div className="container-fluid mt-5">
            <div className="row justify-content-center">
                <div className="col-md-4">
                    <div className="card">
                        <div className="card-body">
                            <h2 className="card-title text-center mb-4">Login</h2>
                            <button className="btn btn-primary btn-block mb-3" onClick={handleAdminLogin}>
                                Admin Login
                            </button>
                            <button className="btn btn-success btn-block" onClick={handleStudentLogin}>
                                Student Login
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
    <BrowserRouter>
        <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/admin/*" element={<AdminLayout />} />
            <Route path="/courseInput" element={<CourseInput />} />
            {/* Redirect to login page if no matching route */}
            <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
    </BrowserRouter>
);


