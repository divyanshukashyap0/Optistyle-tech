import React, { useEffect, useState } from "react";

const MyOrders = () => {
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    const data = localStorage.getItem("myOrders");
    if (data) setOrders(JSON.parse(data));
  }, []);

  if (orders.length === 0) {
    return <p>No orders yet</p>;
  }

  return (
    <div>
      <h2>My Orders</h2>

      {orders.map((o, i) => (
        <div key={i}>
          <p>Invoice: {o.invoiceNumber}</p>
          <p>Total: ₹{o.totalAmount}</p>
          <a href={o.invoiceUrl} target="_blank">
            Download Invoice
          </a>
        </div>
      ))}
    </div>
  );
};

export default MyOrders;
