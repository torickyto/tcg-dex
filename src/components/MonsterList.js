import React from 'react';
import './MonsterList.css';

function MonsterList({ monsters, setSelectedMonster, selectedMonster }) {
  const getTypeBackgroundClass = (types) => {
    if (types.length === 1) {
      return `type-${types[0].toLowerCase()}`;
    } else if (types.length === 2) {
      return 'type-gradient';
    }
    return '';
  };

  const getTypeBackgroundStyle = (types) => {
    if (types.length === 2) {
      const colorMap = {
        pulse: 'rgba(240, 228, 67, 0.2)',
        void: 'rgba(120, 207, 223, 0.2)',
        gravity: 'rgba(200, 165, 255, 0.2)',
        chrono: 'rgba(94, 218, 160, 0.3)',
        death: 'rgba(175, 154, 154, 0.4)',
        royal: 'rgba(241, 172, 23, 0.3)',
      };
      return {
        '--color1': colorMap[types[0].toLowerCase()],
        '--color2': colorMap[types[1].toLowerCase()],
      };
    }
    return {};
  };

  return (
    <div className="monster-list">
      {monsters.map((monster) => (
        <div
          key={monster.id}
          className={`monster-item ${getTypeBackgroundClass(monster.types)} ${selectedMonster?.id === monster.id ? 'selected' : ''}`}
          style={getTypeBackgroundStyle(monster.types)}
          onClick={() => setSelectedMonster(monster)}
        >
          <div className="monster-item-content">
            <img src={monster.image} alt={monster.name} className="monster-thumbnail" />
            <div className="monster-item-info">
              <span className="monster-name">{monster.name}</span>
              <span className="monster-number">No. {String(monster.id).padStart(3, '0')}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default MonsterList;