import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";

const isAuthenticated = () => !!localStorage.getItem("token");
const getUserRole = () => localStorage.getItem("role");

function App() {
    return (
        <Router>
            <Routes>
                {/* Public Routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Protected Route for Dashboard with Role-Based Content */}
                <Route
                    path="/dashboard"
                    element={
                        isAuthenticated() ? (
                            <Dashboard role={getUserRole()} />
                        ) : (
                            <Navigate to="/login" />
                        )
                    }
                />

                {/* Redirect unknown routes to login */}
                <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
        </Router>
    );
}

export default App;
