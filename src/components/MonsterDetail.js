import React, { useState, useEffect } from 'react';
import { ChevronRight } from 'lucide-react';
import './MonsterDetail.css';

function MonsterDetail({ monster, allMonsters, setSelectedMonster }) {
  const [expandedCard, setExpandedCard] = useState(null);
  const [isOverlayActive, setIsOverlayActive] = useState(false);
  const [evolutionLine, setEvolutionLine] = useState([]);
  const [baseCardExists, setBaseCardExists] = useState(false);
  const [holoCardExists, setHoloCardExists] = useState(false);

  const stats = monster.stats || {
    attack: 1000,
    defense: 1000,
    level: 4
  };

  useEffect(() => {
    const getBaseForm = (currentMonster) => {
      if (!currentMonster.prevForm) {
        return currentMonster;
      }
      const prevMonster = allMonsters.find(m => m.id === currentMonster.prevForm);
      return getBaseForm(prevMonster);
    };

    const buildEvolutionLine = (baseMonster, line = []) => {
      line.push(baseMonster);
      if (baseMonster.nextForm) {
        const nextMonster = allMonsters.find(m => m.id === baseMonster.nextForm);
        return buildEvolutionLine(nextMonster, line);
      }
      return line;
    };

    const baseForm = getBaseForm(monster);
    const fullLine = buildEvolutionLine(baseForm);
    setEvolutionLine(fullLine);

    // Check if card images exist
    const checkImageExists = (url) => {
      return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve(true);
        img.onerror = () => resolve(false);
        img.src = url;
      });
    };

    checkImageExists(`/images/cards/${monster.id}_base.png`).then(setBaseCardExists);
    checkImageExists(`/images/cards/${monster.id}_holo.png`).then(setHoloCardExists);
  }, [monster, allMonsters]);

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

  const handleCardClick = (cardType) => {
    if (expandedCard === cardType) {
      setIsOverlayActive(false);
      setTimeout(() => setExpandedCard(null), 300);
    } else {
      setExpandedCard(cardType);
      setTimeout(() => setIsOverlayActive(true), 50);
    }
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
          <div className="monster-cards-container">
            <div className="monster-cards">
              {baseCardExists && (
                <img 
                  src={`/images/cards/${monster.id}_base.png`} 
                  alt={`${monster.name} Base Card`} 
                  className={`monster-card ${expandedCard === 'base' ? 'expanded' : ''}`}
                  onClick={() => handleCardClick('base')}
                />
              )}
              {holoCardExists && (
                <img 
                  src={`/images/cards/${monster.id}_holo.png`} 
                  alt={`${monster.name} Holo Card`} 
                  className={`monster-card ${expandedCard === 'holo' ? 'expanded' : ''}`}
                  onClick={() => handleCardClick('holo')}
                />
              )}
            </div>
          </div>
        </div>
        <div className="monster-right-column">
          <div className="evolution-chain">
            {evolutionLine.map((evoMonster, index) => (
              <React.Fragment key={evoMonster.id}>
                {index > 0 && (
                  <div className="evolution-arrow-container">
                    <ChevronRight className="evolution-arrow" />
                    <div className="evolution-condition">
                      {evoMonster.evolutionCondition || "Unknown condition"}
                    </div>
                  </div>
                )}
                <div
                  className={`evolution-item ${evoMonster.id === monster.id ? 'current' : ''}`}
                  onClick={() => setSelectedMonster(evoMonster)}
                >
                  <div className="evolution-content">
                    <img src={evoMonster.image} alt={evoMonster.name} />
                    <span>{evoMonster.name}</span>
                  </div>
                </div>
              </React.Fragment>
            ))}
          </div>
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
      {expandedCard && (
        <div 
          className={`expanded-card-overlay ${isOverlayActive ? 'active' : ''}`} 
          onClick={() => handleCardClick(expandedCard)}
        >
          <img 
            src={`/images/cards/${monster.id}_${expandedCard}.png`} 
            alt={`${monster.name} ${expandedCard.charAt(0).toUpperCase() + expandedCard.slice(1)} Card`} 
            className="expanded-card-image"
          />
        </div>
      )}
    </div>
  );
}

export default MonsterDetail;