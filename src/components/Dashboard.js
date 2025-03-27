import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./Header"; // Import Header component

const Dashboard = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState({ username: "", role: "" });
    const [cartCount, setCartCount] = useState(0); // Only for customers

    useEffect(() => {
        const token = localStorage.getItem("token");
        const storedUsername = localStorage.getItem("username");
        const storedRole = localStorage.getItem("role");

        if (!token || !storedUsername || !storedRole) {
            navigate("/login");
            return;
        }

        setUser({ username: storedUsername, role: storedRole });

        // Simulating cart count (fetch from API in real case)
        if (storedRole === "customer") {
            setCartCount(3); // Example value for cart count
        }
    }, [navigate]);

    return (
        <div className="dashboard-container">
            {/* Pass cartCount only if role is "customer" */}
            <Header cartCount={user.role === "customer" ? cartCount : null} />

            <main>
                <h2>Welcome, {user.username || "Loading..."}</h2>
                <p>Role: {user.role || "Loading..."}</p>

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
            <li>Search for products</li>
            <li>Add items to Cart</li>
            <li>Checkout Process</li>
            <li>View Order Summary Before Checkout</li>
            <li>Validations rule that customers cannot add items to cart or check out if not registered</li>
        </ul>
    </div>
);

const EmployeeDashboard = () => (
    <div>
        <h3>Employee Dashboard</h3>
        <ul>
            <li>Manage Product(CRUD)</li>
            <li>View and monitor checkout transactions</li>
            
        </ul>
    </div>
);

export default Dashboard;
