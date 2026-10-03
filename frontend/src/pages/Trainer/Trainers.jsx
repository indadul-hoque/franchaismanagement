import React, { useEffect, useState } from 'react'
import { Modal, Button } from "react-bootstrap";

export default function Trainers() {
  const [trainers] = useState([
    {
      id: 1,
      name: "John Doe",
      expertise: "Math Trainer",
      bio: "Experienced math trainer with 10+ years of teaching.",
      image: "/teacher1.jpg",
      contact: "johndoe@example.com",
    },
    {
      id: 2,
      name: "Jane Smith",
      expertise: "Science Trainer",
      bio: "Science enthusiast with a passion for teaching physics and chemistry.",
      image: "/teacher1.jpg",
      contact: "janesmith@example.com",
    },
    {
      id: 3,
      name: "Jane Smith",
      expertise: "Science Trainer",
      bio: "Science enthusiast with a passion for teaching physics and chemistry.",
      image: "/teacher1.jpg",
      contact: "janesmith@example.com",
    },
    // Add more trainers as needed
  ]);

  const [selectedTrainer, setSelectedTrainer] = useState(null);

  const handleCardClick = (trainer) => {
    setSelectedTrainer(trainer);
  };

  const handleClose = () => {
    setSelectedTrainer(null);
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Our Trainers</h1>
      <div className="row">
        {trainers.map((trainer) => (
          <div key={trainer.id} className="col-md-4 mb-4">
            <div
              className="card h-100"
              onClick={() => handleCardClick(trainer)}
              style={{ cursor: "pointer" }}
            >
              <img
                src={trainer.image}
                className="card-img-top"
                alt={trainer.name}
              />
              <div className="card-body">
                <h5 className="card-title">{trainer.name}</h5>
                <p className="card-text">{trainer.expertise}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal for showing trainer details */}
      {selectedTrainer && (
        <Modal show={true} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>{selectedTrainer.name}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <img
              src={selectedTrainer.image}
              alt={selectedTrainer.name}
              className="img-fluid mb-3"
            />
            <h5>Expertise: {selectedTrainer.expertise}</h5>
            <p>{selectedTrainer.bio}</p>
            <p>Contact: {selectedTrainer.contact}</p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
};

