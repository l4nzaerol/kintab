import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";  // Import Login component
import Register from "./components/Register"; // Import Register component
import Dashboard from "./components/Dashboard"; // Import Dashboard component

const isAuthenticated = () => {
    return !!localStorage.getItem("token"); // Check if token exists
};

function App() {
    return (
        <Router>
            <Routes>
                {/* Public Routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Protected Route for Dashboard */}
                <Route
                    path="/dashboard"
                    element={isAuthenticated() ? <Dashboard /> : <Navigate to="/login" />}
                />

                {/* Redirect unknown routes to login */}
                <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
        </Router>
    );
}

export default App;
