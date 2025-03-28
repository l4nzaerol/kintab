import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";

const OrdersTable = () => {
    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [orderItems, setOrderItems] = useState([]);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [dateError, setDateError] = useState("");

    useEffect(() => {
        fetchOrders();
    }, []);

    useEffect(() => {
        if (!startDate || !endDate || dateError) {
            setFilteredOrders(orders);
            return;
        }

        const start = new Date(startDate).setHours(0, 0, 0, 0);
        const end = new Date(endDate).setHours(23, 59, 59, 999);

        const filtered = orders.filter((order) => {
            const orderDate = new Date(order.checkout_date).getTime();
            return orderDate >= start && orderDate <= end;
        });

        setFilteredOrders(filtered);
    }, [startDate, endDate, orders, dateError]);

    const fetchOrders = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get("http://localhost:8000/api/orders", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setOrders(response.data);
            setFilteredOrders(response.data);
        } catch (error) {
            console.error("Error fetching orders:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleStartDateChange = (e) => {
        const newStartDate = e.target.value;
        setStartDate(newStartDate);

        if (endDate && newStartDate > endDate) {
            setDateError("Start date cannot be later than end date.");
        } else {
            setDateError("");
        }
    };

    const handleEndDateChange = (e) => {
        const newEndDate = e.target.value;
        setEndDate(newEndDate);

        if (startDate && newEndDate < startDate) {
            setDateError("End date cannot be earlier than start date.");
        } else {
            setDateError("");
        }
    };

    const fetchOrderItems = async (orderId) => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get(`http://localhost:8000/api/orders/${orderId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            setOrderItems(response.data.items || []);
        } catch (error) {
            console.error("Error fetching order items:", error);
        }
    };

    const handleRowClick = (order) => {
        setSelectedOrder(order);
        fetchOrderItems(order.id);
        setShowModal(true);
    };

    return (
        <div>
            <h4>Orders</h4>

            {/* Date Filter Inputs */}
            <div className="mb-3">
                <h4>Filter</h4>
                <label>Start Date:</label>
                <input 
                    type="date" 
                    className="form-control" 
                    value={startDate} 
                    onChange={handleStartDateChange} 
                />

                <label className="mt-2">End Date:</label>
                <input 
                    type="date" 
                    className="form-control" 
                    value={endDate} 
                    onChange={handleEndDateChange} 
                    min={startDate} // Prevents selecting an earlier end date
                />

                {dateError && <p className="text-danger mt-2">{dateError}</p>}
            </div>

            {loading ? (
                <p>Loading orders...</p>
            ) : (
                <table className="table table-bordered">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Total Price</th>
                            <th>Checkout Date</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredOrders.map((order) => (
                            <tr key={order.id} onClick={() => handleRowClick(order)} style={{ cursor: "pointer" }}>
                                <td>{order.id}</td>
                                <td>₱{order.total_price}</td>
                                <td>{order.checkout_date ? new Date(order.checkout_date).toLocaleString() : "N/A"}</td>
                                <td>{order.status}</td>
                                <td>
                                    {order.status !== "completed" && (
                                        <button className="btn btn-warning btn-sm" onClick={(e) => { e.stopPropagation(); }}>
                                            Mark as Complete
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {/* Order Items Modal */}
            {showModal && selectedOrder && (
                <div className="modal show d-block" tabIndex="-1">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Order #{selectedOrder.id} Details</h5>
                                <button type="button" className="close" onClick={() => setShowModal(false)}>
                                    &times;
                                </button>
                            </div>
                            <div className="modal-body">
                                <p><strong>Total Price:</strong> ${selectedOrder.total_price}</p>
                                <p><strong>Checkout Date:</strong> {selectedOrder.checkout_date ? new Date(selectedOrder.checkout_date).toLocaleString() : "N/A"}</p>
                                <p><strong>Status:</strong> {selectedOrder.status}</p>
                                <h5>Order Items</h5>
                                {orderItems.length > 0 ? (
                                    <ul>
                                        {orderItems.map((item) => (
                                            <li key={item.id}>{item.product?.name || "Unknown Product"} - {item.quantity} x ${item.price}</li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p>No items found.</p>
                                )}
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-secondary" onClick={() => setShowModal(false)}>
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrdersTable;
