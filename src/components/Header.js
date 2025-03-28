import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Navbar, Nav, Button, Badge, Container } from "react-bootstrap";
import { ShoppingCart, User } from "lucide-react";

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

        fetchCartCount();
        const interval = setInterval(fetchCartCount, 1000);
 
         return () => clearInterval(interval); // Cleanup on unmount
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        localStorage.removeItem("role");
        navigate("/login");
    };

    return (
        <Navbar bg="dark" variant="dark" expand="lg" className="shadow-lg p-3 mb-3 rounded" style={{ background: "linear-gradient(90deg, #2b2d42, #43465c)" }}>
            <Container>
                <Navbar.Brand href="/dashboard" className="text-light fw-bold">SmartShop</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                    </Nav>
                    <Nav className="align-items-center">
                        <span className="text-light me-3">
                            <User size={18} className="me-1" />{username}
                        </span>
                        {role === "customer" && (
                            <Button variant="outline-light" className="d-flex align-items-center me-2" onClick={() => navigate("/cart")}> 
                                <ShoppingCart size={20} />
                                <Badge bg="danger" className="ms-1">{cartCount}</Badge>
                            </Button>
                        )}
                        <Button variant="outline-danger" onClick={handleLogout}>
                            Logout
                        </Button>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default Header;
