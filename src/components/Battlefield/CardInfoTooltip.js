import React from 'react';
import { motion } from 'framer-motion';
import './CardInfoTooltip.css';

const CardInfoTooltip = ({ card, position }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      className="card-info-tooltip"
      style={{
        left: position.x,
        top: position.y - 10,
        transform: 'translate(-50%, -100%)',
      }}
    >
      <div className="card-info-content">
        <h3 className="card-info-name">{card.name}</h3>
        <div className="card-info-stats">
          <span className="card-info-pwr">PWR: {card.stats.attack}</span>
          <span className="card-info-hp">HP: {card.stats.defense}</span>
        </div>
        <p className="card-info-effect">{card.effect}</p>
      </div>
    </motion.div>
  );
};

export default CardInfoTooltip;