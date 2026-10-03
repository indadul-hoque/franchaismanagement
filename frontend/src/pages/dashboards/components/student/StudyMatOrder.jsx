import React from "react";
import { Table, Button } from "react-bootstrap";

const studyMaterialOrders = [
  { id: "#1001", date: "2024-03-10", name: "Math Workbook", quantity: 1, price: "$25", status: "Shipped", download: "" },
  { id: "#1002", date: "2024-02-20", name: "Science Guide", quantity: 2, price: "$40", status: "Delivered", download: "/materials/science-guide.pdf" },
  { id: "#1003", date: "2024-01-15", name: "English Grammar", quantity: 1, price: "$20", status: "Pending", download: "" },
];

export default function StudyMaterialOrders() {
  return (
    <div className="container mt-4">
      <h2 className="mb-4">Study Material Orders</h2>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Order Date</th>
            <th>Material Name</th>
            <th>Quantity</th>
            <th>Price</th>
            <th>Status</th>
            <th>Download</th>
          </tr>
        </thead>
        <tbody>
          {studyMaterialOrders.map((order) => (
            <tr key={order.id}>
              <td>{order.id}</td>
              <td>{order.date}</td>
              <td>{order.name}</td>
              <td>{order.quantity}</td>
              <td>{order.price}</td>
              <td>
                <span className={`badge bg-${order.status === "Delivered" ? "success" : order.status === "Shipped" ? "primary" : "warning"}`}>
                  {order.status}
                </span>
              </td>
              <td>
                {order.download ? (
                  <Button variant="outline-primary" size="sm" href={order.download} download>
                    Download
                  </Button>
                ) : (
                  <span className="text-muted">N/A</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}
