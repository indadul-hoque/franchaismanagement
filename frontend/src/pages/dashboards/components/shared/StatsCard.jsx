import React from 'react';
import PropTypes from 'prop-types';

const StatsCard = ({ title, value, icon: Icon, increase, color }) => {
  return (
    <div className="stats-card">
      <div className="stats-content">
        <h3 className="stats-title">{title}</h3>
        <div className="stats-value">
          <h2>{value}</h2>
          <div className="stats-icon" style={{ backgroundColor: color }}>
            <Icon size={24} />
          </div>
        </div>
        <p className="stats-increase">{increase}% increase</p>
      </div>
    </div>
  );
};

StatsCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  icon: PropTypes.elementType.isRequired,
  increase: PropTypes.number.isRequired,
  color: PropTypes.string.isRequired,
};

export default StatsCard;  // Ensure default export
