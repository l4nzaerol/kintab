import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Login.css";

const Login = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        try {
            const response = await axios.post("http://127.0.0.1:8000/api/login", formData);
            localStorage.setItem("token", response.data.token);
            localStorage.setItem("username", response.data.user.name);
            localStorage.setItem("role", response.data.user.role);  
            navigate("/dashboard");
        } catch (err) {
            setError(err.response?.data?.message || "Login failed");
        }
    };

    return (
        <div className="login-background d-flex justify-content-center align-items-center">
            <div className="login-card card p-4 shadow-lg">
                <h2 className="text-center mb-3">Login</h2>
                {error && <p className="alert alert-danger">{error}</p>}
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <input 
                            type="email" 
                            name="email" 
                            placeholder="Email" 
                            value={formData.email} 
                            onChange={handleChange} 
                            required 
                            className="form-control"
                        />
                    </div>
                    <div className="mb-3">
                        <input 
                            type="password" 
                            name="password" 
                            placeholder="Password" 
                            value={formData.password} 
                            onChange={handleChange} 
                            required 
                            className="form-control"
                        />
                    </div>
                    <button type="submit" className="btn btn-primary w-100">Login</button>
                </form>
                <p className="text-center mt-3">
                    Don't have an account? <Link to="/register">Register here</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
