import React, { useState } from 'react';
import MonsterDex from './components/MonsterDex';
import ThemeToggle from './components/ThemeToggle';
import BattleScene from './components/Battlefield/BattleScene';
import './App.css';

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isBattleMode, setIsBattleMode] = useState(false);

  return (
    <div className={`app ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
      <div className="app-background"></div>
      <ThemeToggle isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
      {!isBattleMode && (
        <>
          <MonsterDex />
          <button 
            className="battle-button" 
            onClick={() => setIsBattleMode(true)}
          >
            3D Battle Simulation
          </button>
        </>
      )}
      {isBattleMode && (
        <BattleScene onClose={() => setIsBattleMode(false)} />
      )}
    </div>
  );
}

export default App;