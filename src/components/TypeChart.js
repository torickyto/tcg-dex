import React, { useState } from 'react';
import { X } from 'lucide-react';
import './TypeChart.css';

const typeColors = {
  pulse: '#f0e443',
  void: '#78cfdf',
  gravity: '#c8a5ff',
  chrono: '#9df0c0',
  death: '#af9a9a',
  royal: '#ffbd07',
  parasite: '#e77272',
  primal: '#d39f75',
  nature: '#7cba6d',
  magic: '#f259ff'
};

const typeEffectiveness = {
  pulse: { strong: ['void', 'parasite'], weak: ['gravity', 'magic'] },
  void: { strong: ['gravity', 'nature'], weak: ['pulse', 'magic'] },
  gravity: { strong: ['pulse', 'primal'], weak: ['void', 'magic'] },
  chrono: { strong: ['royal', 'primal'], weak: ['death', 'nature', 'parasite'] },
  death: { strong: ['chrono', 'parasite', 'primal'], weak: ['void', 'nature'] },
  royal: { strong: ['death'], weak: ['chrono', 'parasite', 'primal'] },
  parasite: { strong: ['nature', 'primal'], weak: ['pulse', 'death'] },
  primal: { strong: ['nature', 'royal'], weak: ['parasite'] },
  nature: { strong: ['death', 'parasite'], weak: ['parasite', 'primal', 'magic'] },
  magic: { strong: ['nature', 'void', 'gravity', 'pulse'], weak: ['royal', 'primal', 'chrono'] }
};

function TypeChart({ isOpen, onClose }) {
    const types = Object.keys(typeEffectiveness);
  
    const getEffectivenessClass = (effectiveness) => {
      if (effectiveness === '2x') return 'super-effective';
      if (effectiveness === '0.5x') return 'not-very-effective';
      return 'neutral';
    };
  
    return (
      <>
        {isOpen && (
          <div className="type-chart-overlay">
            <div className="type-chart-content">
              <button className="close-button" onClick={onClose}>
                <X size={24} />
              </button>
              <h2>Type Effectiveness Chart</h2>
              <div className="type-chart-grid">
                <div className="type-chart-header">
                  <div className="type-chart-cell corner-cell">Atk \ Def</div>
                  {types.map(type => (
                    <div key={type} className="type-chart-cell type-header" style={{ backgroundColor: typeColors[type] }}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </div>
                  ))}
                </div>
                {types.map(attackType => (
                  <div key={attackType} className="type-chart-row">
                    <div className="type-chart-cell type-header" style={{ backgroundColor: typeColors[attackType] }}>
                      {attackType.charAt(0).toUpperCase() + attackType.slice(1)}
                    </div>
                    {types.map(defenseType => {
                      const effectiveness = typeEffectiveness[attackType].strong.includes(defenseType) ? '2x' :
                                            typeEffectiveness[attackType].weak.includes(defenseType) ? '0.5x' : '1x';
                      return (
                        <div key={defenseType} className={`type-chart-cell ${getEffectivenessClass(effectiveness)}`}>
                          {effectiveness}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </>
    );
  }
  
  export default TypeChart;