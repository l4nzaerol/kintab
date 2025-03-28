import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import EmployeeProductsTable from "./EmployeeProductsTable";
import OrdersTable from "./OrdersTable";
import axios from "axios";

const EmployeeDashboard = () => {
    const [view, setView] = useState("products");
    const [showAddModal, setShowAddModal] = useState(false);
    const [newProduct, setNewProduct] = useState({ name: "", description: "", price: "", stock: "", image: "" });
    const [loading, setLoading] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewProduct({ ...newProduct, [name]: value });
    };

    const handleAddProduct = async () => {
        setLoading(true);
        const token = localStorage.getItem("token");
        try {
            await axios.post("http://localhost:8000/api/products", newProduct, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setShowAddModal(false);
            setNewProduct({ name: "", description: "", price: "", stock: "", image: "" });
        } catch (error) {
            console.error("Error adding product:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h3>Employee Dashboard</h3>
                {view === "products" && (
                    <button className="btn btn-success" onClick={() => setShowAddModal(true)}>Add Product</button>
                )}
            </div>
            <div className="btn-group mb-3">
                <button className={`btn ${view === "products" ? "btn-primary" : "btn-outline-primary"}`} onClick={() => setView("products")}>
                    Products
                </button>
                <button className={`btn ${view === "orders" ? "btn-secondary" : "btn-outline-secondary"}`} onClick={() => setView("orders")}>
                    Orders
                </button>
            </div>
            <div className="card p-3">
                {view === "products" ? <EmployeeProductsTable /> : <OrdersTable />}
            </div>

            {/* Add Product Modal */}
            {showAddModal && (
                <div className="modal show d-block" tabIndex="-1">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Add Product</h5>
                                <button type="button" className="btn-close" onClick={() => setShowAddModal(false)}></button>
                            </div>
                            <div className="modal-body">
                                <input type="text" className="form-control mb-2" name="name" value={newProduct.name} onChange={handleInputChange} placeholder="Name" />
                                <input type="text" className="form-control mb-2" name="description" value={newProduct.description} onChange={handleInputChange} placeholder="Description" />
                                <input type="number" className="form-control mb-2" name="price" value={newProduct.price} onChange={handleInputChange} placeholder="Price" />
                                <input type="number" className="form-control mb-2" name="stock" value={newProduct.stock} onChange={handleInputChange} placeholder="Stock" />
                                <input type="text" className="form-control mb-2" name="image" value={newProduct.image} onChange={handleInputChange} placeholder="Image URL" />
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-secondary" onClick={() => setShowAddModal(false)}>Cancel</button>
                                <button className="btn btn-primary" onClick={handleAddProduct} disabled={loading}>
                                    {loading ? "Adding..." : "Add Product"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EmployeeDashboard;
