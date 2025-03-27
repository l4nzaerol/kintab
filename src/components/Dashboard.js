import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./Header";
import EmployeeDashboard from "./EmployeeDashboard";

const Dashboard = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState({ username: "", role: "" });
    const [cartCount, setCartCount] = useState(0);

    useEffect(() => {
        const token = localStorage.getItem("token");
        const storedUsername = localStorage.getItem("username");
        const storedRole = localStorage.getItem("role");

        if (!token || !storedUsername || !storedRole) {
            navigate("/login");
            return;
        }

        setUser({ username: storedUsername, role: storedRole });

        if (storedRole === "customer") {
            setCartCount(3);
        }
    }, [navigate]);

    return (
        <div className="dashboard-container">
            <Header cartCount={user.role === "customer" ? cartCount : null} />

            <main>
                <h2>Welcome, {user.username || "Loading..."}</h2>
                <p>Role: {user.role || "Loading..."}</p>

                {user.role === "employee" ? (
                    <EmployeeDashboard />
                ) : (
                    <p>Loading content...</p>
                )}
            </main>
        </div>
    );
};

export default Dashboard;
