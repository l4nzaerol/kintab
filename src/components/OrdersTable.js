import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";

const OrdersTable = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await axios.get("http://localhost:8000/api/orders", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setOrders(response.data);
            } catch (error) {
                console.error("Error fetching orders:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    const handleUpdateStatus = (order) => {
        setSelectedOrder(order);
        setShowModal(true);
    };

    const confirmUpdateStatus = async () => {
        try {
            const token = localStorage.getItem("token");
            await axios.put(
                `http://localhost:8000/api/orders/${selectedOrder.id}`,
                { status: selectedOrder.status === "pending" ? "completed" : "pending" },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setOrders(orders.map(order => order.id === selectedOrder.id ? { ...order, status: selectedOrder.status === "pending" ? "completed" : "pending" } : order));
            setShowModal(false);
        } catch (error) {
            console.error("Error updating order status:", error);
        }
    };

    return (
        <div>
            <h4>Orders</h4>
            {loading ? (
                <p>Loading orders...</p>
            ) : (
                <table className="table table-bordered">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Customer</th>
                            <th>Total Price</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order) => (
                            <tr key={order.id}>
                                <td>{order.id}</td>
                                <td>{order.user.username}</td>
                                <td>${order.total_price}</td>
                                <td>{order.status}</td>
                                <td>
                                    <button className="btn btn-warning btn-sm" onClick={() => handleUpdateStatus(order)}>
                                        Change Status
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {/* Status Change Modal */}
            {showModal && (
                <div className="modal show d-block" tabIndex="-1">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Confirm Status Change</h5>
                                <button type="button" className="close" onClick={() => setShowModal(false)}>&times;</button>
                            </div>
                            <div className="modal-body">
                                <p>Are you sure you want to change the order status?</p>
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                                <button className="btn btn-primary" onClick={confirmUpdateStatus}>Confirm</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrdersTable;
