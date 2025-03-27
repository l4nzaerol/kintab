import React from "react";
import { useNavigate } from "react-router-dom";

const Header = ({ cartCount }) => {
    const navigate = useNavigate();
    const username = localStorage.getItem("username") || "Guest";
    const role = localStorage.getItem("role") || "User";

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
            {role === "customer" && cartCount > 0 && (
                <div style={styles.cart}>
                    <span style={styles.cartCount}>{cartCount}</span>
                </div>
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
        display: "inline-block",
    },
    cartCount: {
        position: "absolute",
        top: "-5px",
        right: "-5px",
        backgroundColor: "red",
        color: "white",
        borderRadius: "50%",
        width: "20px",
        height: "20px",
        textAlign: "center",
        fontSize: "12px",
    },
};

export default Header;
