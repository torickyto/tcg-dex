import React from 'react';
import './ThemeToggle.css';

function ThemeToggle({ isDarkMode, setIsDarkMode }) {
  return (
    <button 
      className="theme-toggle" 
      onClick={() => setIsDarkMode(!isDarkMode)}
    >
      {isDarkMode ? '☀️' : '🌙'}
    </button>
  );
}

export default ThemeToggle;