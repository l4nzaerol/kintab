import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");

    useEffect(() => {
        const token = localStorage.getItem("token");
        const storedUsername = localStorage.getItem("username");

        if (!token || !storedUsername) {
            navigate("/login");
            return;
        }

        setUsername(storedUsername); // Get username from localStorage
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        navigate("/login");
    };

    return (
        <div className="dashboard-container">
            <header className="dashboard-header">
                <h2>Welcome, {username || "Loading..."}</h2>
                <button onClick={handleLogout} className="logout-button">Logout</button>
            </header>
            <main>
                <p>This is your dashboard content.</p>
            </main>
        </div>
    );
};

export default Dashboard;
