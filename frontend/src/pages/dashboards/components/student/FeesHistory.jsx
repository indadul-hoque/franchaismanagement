import React from "react";
import { Table, Button } from "react-bootstrap";

const feesHistory = [
  { id: "#001", date: "2024-03-01", amount: "$200", method: "Credit Card", status: "Paid", receipt: "/receipts/001.pdf" },
  { id: "#002", date: "2024-02-15", amount: "$180", method: "UPI", status: "Paid", receipt: "/receipts/002.pdf" },
  { id: "#003", date: "2024-01-10", amount: "$200", method: "Bank Transfer", status: "Pending", receipt: "" },
];

export default function FeesHistory() {
  return (
    <div className="container mt-4">
      <h2 className="mb-4">Fees History</h2>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Payment ID</th>
            <th>Date</th>
            <th>Amount</th>
            <th>Method</th>
            <th>Status</th>
            <th>Receipt</th>
          </tr>
        </thead>
        <tbody>
          {feesHistory.map((payment) => (
            <tr key={payment.id}>
              <td>{payment.id}</td>
              <td>{payment.date}</td>
              <td>{payment.amount}</td>
              <td>{payment.method}</td>
              <td>
                <span className={`badge bg-${payment.status === "Paid" ? "success" : "warning"}`}>
                  {payment.status}
                </span>
              </td>
              <td>
                {payment.receipt ? (
                  <Button variant="outline-primary" size="sm" href={payment.receipt} download>
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
