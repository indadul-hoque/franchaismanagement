import React, { useState } from "react";
import { Table, Badge, Pagination } from "react-bootstrap";

const orderHistory = [
  { id: "#2001", date: "2024-03-10", item: "Math Workbook", amount: "$25", status: "Delivered" },
  { id: "#2002", date: "2024-02-20", item: "Science Guide", amount: "$40", status: "Shipped" },
  { id: "#2003", date: "2024-01-15", item: "English Grammar", amount: "$20", status: "Pending" },
  { id: "#2004", date: "2023-12-05", item: "Physics Notes", amount: "$30", status: "Cancelled" },
  { id: "#2005", date: "2023-11-22", item: "Chemistry Workbook", amount: "$35", status: "Delivered" },
  { id: "#2006", date: "2023-10-10", item: "Biology Notes", amount: "$28", status: "Shipped" },
];

export default function OrderHistory() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = orderHistory.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(orderHistory.length / itemsPerPage);

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Order History</h2>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Order Date</th>
            <th>Item</th>
            <th>Amount</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((order) => (
            <tr key={order.id}>
              <td>{order.id}</td>
              <td>{order.date}</td>
              <td>{order.item}</td>
              <td>{order.amount}</td>
              <td>
                <Badge bg={
                  order.status === "Delivered" ? "success" :
                  order.status === "Shipped" ? "primary" :
                  order.status === "Pending" ? "warning" : "danger"
                }>
                  {order.status}
                </Badge>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Pagination className="justify-content-center">
        <Pagination.Prev onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1} />
        {[...Array(totalPages).keys()].map(number => (
          <Pagination.Item key={number + 1} active={number + 1 === currentPage} onClick={() => setCurrentPage(number + 1)}>
            {number + 1}
          </Pagination.Item>
        ))}
        <Pagination.Next onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} />
      </Pagination>
    </div>
  );
}
