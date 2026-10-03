import React from 'react';
import { Link } from 'react-router-dom';
import { FaHardHat } from 'react-icons/fa';

/**
 * ComingSoon — Placeholder for pages not yet implemented.
 * Accepts an optional `title` and `description` prop.
 */
const ComingSoon = ({ title = 'Coming Soon', description = 'This section is under active development.' }) => {
  return (
    <div
      className="d-flex flex-column align-items-center justify-content-center text-center rounded-4 bg-white border shadow-sm"
      style={{ minHeight: '60vh', padding: '3rem 2rem' }}
    >
      <div
        className="rounded-circle d-flex align-items-center justify-content-center mb-4"
        style={{ width: '72px', height: '72px', backgroundColor: '#eff6ff' }}
      >
        <FaHardHat size={30} style={{ color: '#3b82f6' }} />
      </div>
      <h4 className="fw-bold text-dark mb-2">{title}</h4>
      <p className="text-muted mb-4" style={{ maxWidth: '360px', fontSize: '14px' }}>
        {description} Check back soon — we're building something great here.
      </p>
      <Link
        to=".."
        relative="path"
        className="btn btn-outline-primary rounded-3 px-4"
        style={{ fontSize: '13.5px' }}
      >
        ← Go Back
      </Link>
    </div>
  );
};

export default ComingSoon;
