import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import './MonsterDetail.css';

function MonsterDetail({ monster, allMonsters, setSelectedMonster }) {
  const stats = monster.stats || {
    attack: 1000,
    defense: 1000,
    level: 4
  };

  const prevForm = monster.prevForm ? allMonsters.find(m => m.id === monster.prevForm) : null;
  const nextForm = monster.nextForm ? allMonsters.find(m => m.id === monster.nextForm) : null;

  const renderStars = (level) => {
    return '★'.repeat(level);
  };

  const renderStatBar = (value, maxValue = 100, statType) => {
    const percentage = Math.min((value / maxValue) * 100, 100);
    const segments = 20;

    return (
      <div className="stat-bar-container">
        <div className={`stat-bar ${statType}`} style={{ width: `${percentage}%` }}></div>
        <div className="stat-segments">
          {Array.from({ length: segments }, (_, index) => (
            <div key={index} className="stat-segment" />
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="monster-detail">
      <div className="monster-header">
        <div className="name-and-info">
          <div className="name-and-stars">
            <h2 className="monster-nametitle">{monster.name}</h2>
            <div className="monster-stars">{renderStars(stats.level)}</div>
          </div>
          <div className="monster-types">
            {monster.types.map((type, index) => (
              <span key={index} className={`monster-type ${type.toLowerCase()}`}>{type}</span>
            ))}
          </div>
        </div>
        <span className="monster-number">No. {String(monster.id).padStart(3, '0')}</span>
      </div>
      <div className="monster-content">
      <div className="monster-left-column">
        <div className="monster-image-container">
          <img src={monster.image} alt={monster.name} className="monster-image" />
        </div>
        <div className="evolution-chain">
          {prevForm && (
            <div className="evolution-item prev-form" onClick={() => setSelectedMonster(prevForm)}>
              <div className="evolution-content">
                <img src={prevForm.image} alt={prevForm.name} />
                <span>{prevForm.name}</span>
              </div>
              <ChevronLeft className="evolution-arrow" />
            </div>
          )}
          {nextForm && (
            <div className="evolution-item next-form" onClick={() => setSelectedMonster(nextForm)}>
              <ChevronRight className="evolution-arrow" />
              <div className="evolution-content">
                <img src={nextForm.image} alt={nextForm.name} />
                <span>{nextForm.name}</span>
              </div>
            </div>
          )}
        </div>
        </div>
        <div className="monster-right-column">
          <div className="monster-description-box">
            <p>{monster.description}</p>
          </div>
          <div className="monster-stats">
          <div className="stat">
              <div className="stat-header">
                <span className="stat-name">ATK</span>
                <span className="stat-value">{stats.attack}</span>
              </div>
              {renderStatBar(stats.attack, 100, 'attack')}
            </div>
            <div className="stat">
              <div className="stat-header">
                <span className="stat-name">DEF</span>
                <span className="stat-value">{stats.defense}</span>
              </div>
              {renderStatBar(stats.defense, 100, 'defense')}
            </div>
          </div>
          <div className="monster-effect">
            <h3>Effect</h3>
            <p>{monster.effect || "This monster has no effect."}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MonsterDetail;