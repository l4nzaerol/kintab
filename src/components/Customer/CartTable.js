import React, { useState, useEffect } from "react";
import axios from "axios";

const CartTable = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showSummary, setShowSummary] = useState(false);
  const [contact, setContact] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [checkoutStep, setCheckoutStep] = useState(1);
  const [address, setAddress] = useState("");

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("User not authenticated.");

        const response = await axios.get("http://localhost:8000/api/cart", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setCartItems(response.data || []);
      } catch (err) {
        setError("Failed to load cart items.");
      } finally {
        setLoading(false);
      }
    };

    fetchCartItems();
  }, []);

  const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleCheckout = async () => {
    if (!address.trim()) {
        alert("Please enter your address.");
        return;
    }
    if (!contact.trim()) {
        alert("Please enter your contact number.");
        return;
    }
    if (!paymentMethod) {
        alert("Please select a payment method.");
        return;
    }

    try {
        const token = localStorage.getItem("token");
        if (!token) {
            alert("User not authenticated.");
            return;
        }

        const response = await axios.post(
            "http://localhost:8000/api/checkout",
            { address, contact, paymentMethod }, // Sending data for simulation
            { headers: { Authorization: `Bearer ${token}` } }
        );

        if (response.status === 200) {
            alert("Checkout successful! Order ID: " + response.data.order_id);
            setCartItems([]); // Clear the cart in frontend
            setShowSummary(false);
            setCheckoutStep(1);

            // Reset form fields (since it's a simulation)
            setAddress("");
            setContact("");
            setPaymentMethod("");
        } else {
            alert(response.data.message || "Failed to checkout.");
        }
    } catch (error) {
        console.error("Checkout error:", error);
        alert(error.response?.data?.message || "An error occurred during checkout.");
    }
};



  if (loading) return <p>Loading cart...</p>;
  if (error) return <p className="text-danger">{error}</p>;

  return (
    <div>
      <h5>Total Items in Cart: {totalQuantity}</h5>
      <table className="table">
        <thead>
          <tr>
            <th>Product</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {cartItems.length > 0 ? (
            cartItems.map((item) => (
              <tr key={item.id}>
                <td>{item.name}</td>
                <td>₱{item.price}</td>
                <td>{item.quantity}</td>
                <td>₱{item.price * item.quantity}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" style={{ textAlign: "center" }}>
                Your cart is empty.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {cartItems.length > 0 && (
        <button
          className="btn btn-primary mt-3"
          onClick={() => setShowSummary(true)}
        >
          Checkout
        </button>
      )}

      {showSummary && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Order Summary</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowSummary(false)}
                ></button>
              </div>
              <div className="modal-body">
                {checkoutStep === 1 ? (
                  <>
                    <p>Total Quantity: {totalQuantity}</p>
                    <p>Total Price: ₱{totalPrice}</p>
                  </>
                ) : (
                  <>
                    <label>Enter Address:</label>
                    <input
                      type="text"
                      className="form-control mb-2"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Enter your address"
                      required
                    />

                    <label>Contact Number:</label>
                    <input
                      type="text"
                      className="form-control mb-2"
                      value={contact}
                      onChange={(e) => setContact(e.target.value)}
                      placeholder="Enter your contact number"
                      required
                    />

                    <label>Payment Method:</label>
                    <select
                      className="form-control mb-2"
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      required
                    >
                      <option value="" disabled>Select a payment method</option>
                      <option value="Gcash">Gcash</option>
                      <option value="Maya">Maya</option>
                      <option value="Credit/Debit Card">Credit/Debit Card</option>
                    </select>
                  </>
                )}
              </div>
              <div className="modal-footer">
                {checkoutStep === 1 ? (
                  <button
                    className="btn btn-primary"
                    onClick={() => setCheckoutStep(2)}
                  >
                    Next
                  </button>
                ) : (
                  <button className="btn btn-success" onClick={handleCheckout}>
                    Checkout
                  </button>
                )}
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowSummary(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );


};

export default CartTable;
