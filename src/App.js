import React, { useState } from 'react';
import MonsterDex from './components/MonsterDex';
import ThemeToggle from './components/ThemeToggle';
import './App.css';

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  return (
    <div className={`app ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
      <div className="app-background"></div>
      <ThemeToggle isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
      <MonsterDex />
    </div>
  );
}

export default App;