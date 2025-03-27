import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState({ username: "", role: "" });

    useEffect(() => {
        const token = localStorage.getItem("token");
        const storedUsername = localStorage.getItem("username");
        const storedRole = localStorage.getItem("role");

        if (!token || !storedUsername || !storedRole) {
            navigate("/login");
            return;
        }

        setUser({ username: storedUsername, role: storedRole });
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        localStorage.removeItem("role");
        navigate("/login");
    };

    return (
        <div className="dashboard-container">
            <header className="dashboard-header">
                <h2>Welcome, {user.username || "Loading..."}</h2>
                <p>Role: {user.role || "Loading..."}</p>
                <button onClick={handleLogout} className="logout-button">Logout</button>
            </header>
            <main>
                {user.role === "customer" ? (
                    <CustomerDashboard />
                ) : user.role === "employee" ? (
                    <EmployeeDashboard />
                ) : (
                    <p>Loading content...</p>
                )}
            </main>
        </div>
    );
};

const CustomerDashboard = () => (
    <div>
        <h3>Customer Dashboard</h3>
        <ul>
            <li>View Products</li>
            <li>Manage Cart</li>
            <li>Track Orders</li>
            <li>Update Profile</li>
        </ul>
    </div>
);

const EmployeeDashboard = () => (
    <div>
        <h3>Employee Dashboard</h3>
        <ul>
            <li>Manage Inventory</li>
            <li>Process Orders</li>
            <li>View Customer Inquiries</li>
            <li>Update Order Status</li>
        </ul>
    </div>
);

export default Dashboard;
