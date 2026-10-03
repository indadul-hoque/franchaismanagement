import React, { useState } from "react";
import { Card } from "react-bootstrap";

const files = [
  { id: 1, name: "Course Material.pdf", type: "PDF", url: "/files/course-material.pdf" },
  { id: 2, name: "Assignment 1.docx", type: "DOCX", url: "/files/assignment1.docx" },
  { id: 3, name: "Payment Receipt.pdf", type: "PDF", url: "/files/receipt.pdf" },
];

export default function DownloadComponent() {
  const [search, setSearch] = useState("");

  const filteredFiles = files.filter((file) =>
    file.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Downloads</h2>
      <input
        type="text"
        className="form-control mb-3"
        placeholder="Search files..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      {filteredFiles.map((file) => (
        <Card key={file.id} className="mb-2 p-2">
          <Card.Body className="d-flex justify-content-between align-items-center">
            <div>
              <p className="mb-1 font-weight-bold">{file.name}</p>
              <p className="text-muted small">{file.type}</p>
            </div>
            <a href={file.url} className="btn btn-outline-primary" download>
              Download
            </a>
          </Card.Body>
        </Card>
      ))}
    </div>
  );
}
