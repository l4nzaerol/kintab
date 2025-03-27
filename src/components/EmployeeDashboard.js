import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import ProductsTable from "./EmployeeProductsTable";
import OrdersTable from "./OrdersTable";

const EmployeeDashboard = () => {
    const [view, setView] = useState("products");

    return (
        <div className="container mt-4">
            <h3>Employee Dashboard</h3>
            <div className="btn-group mb-3">
                <button className={`btn ${view === "products" ? "btn-primary" : "btn-outline-primary"}`} onClick={() => setView("products")}>
                    Products
                </button>
                <button className={`btn ${view === "orders" ? "btn-secondary" : "btn-outline-secondary"}`} onClick={() => setView("orders")}>
                    Orders
                </button>
            </div>
            <div className="card p-3">
                {view === "products" ? <ProductsTable /> : <OrdersTable />}
            </div>
        </div>
    );
};

export default EmployeeDashboard;