import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import ProductCatalog from "./ProductCatalog";

const CustomerDashboard = () => {
    const [products, setProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const response = await axios.get("http://localhost:8000/api/products");
            setProducts(response.data);
        } catch (error) {
            console.error("Error fetching products:", error);
        } finally {
            setLoading(false);
        }
    };

    const filteredProducts = products.filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h3>Customer Dashboard</h3>
            </div>

            {/* Search Bar */}
            <input
                type="text"
                className="form-control mb-3"
                placeholder="Search for a product..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />

            {/* Product Catalog */}
            <div className="card p-3">
                {loading ? <p>Loading products...</p> : <ProductCatalog products={filteredProducts} />}
            </div>
        </div>
    );
};

export default CustomerDashboard;
