import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Header = () => {
    const navigate = useNavigate();
    const username = localStorage.getItem("username") || "Guest";
    const role = localStorage.getItem("role") || "User";
    const [cartCount, setCartCount] = useState(0);

    useEffect(() => {
        const fetchCartCount = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) throw new Error("User not authenticated.");

                const response = await axios.get("http://localhost:8000/api/cart", {
                    headers: { Authorization: `Bearer ${token}` },
                });

                const totalItems = response.data.reduce((sum, item) => sum + item.quantity, 0);
                setCartCount(totalItems);
            } catch (err) {
                console.error("Failed to fetch cart count:", err);
            }
        };

        // Fetch cart count every 0.5 seconds
        const interval = setInterval(fetchCartCount, 500);

        return () => clearInterval(interval); // Cleanup on unmount
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        localStorage.removeItem("role");
        navigate("/login");
    };

    return (
        <header style={styles.header}>
            <h1>My React App</h1>
            <div style={styles.userInfo}>
                <p>Welcome, {username} ({role})</p>
                <button onClick={handleLogout} style={styles.logoutButton}>Logout</button>
            </div>
            
            {/* Show cart only for customers */}
            {role === "customer" && (
                <button style={styles.cart} onClick={() => navigate("/cart")}>
                    🛒 <span style={styles.cartCount}>{cartCount}</span>
                </button>
            )}
        </header>
    );
};

const styles = {
    header: {
        backgroundColor: "#333",
        color: "white",
        padding: "15px",
        textAlign: "center",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
    },
    userInfo: {
        display: "flex",
        alignItems: "center",
        gap: "10px",
    },
    logoutButton: {
        backgroundColor: "#ff4d4d",
        color: "white",
        border: "none",
        padding: "8px 12px",
        cursor: "pointer",
        borderRadius: "5px",
    },
    cart: {
        position: "relative",
        display: "flex",
        alignItems: "center",
        gap: "5px",
        background: "none",
        border: "none",
        cursor: "pointer",
        color: "white",
        fontSize: "18px",
    },
    cartCount: {
        backgroundColor: "red",
        color: "white",
        borderRadius: "50%",
        padding: "5px 10px",
        fontSize: "14px",
        fontWeight: "bold",
    },
};

export default Header;
