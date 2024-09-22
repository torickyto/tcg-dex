import React from 'react';
import './Header.css';

function Header() {
  return (
    <header className="header">
      <div className="header-content">
        <h1>Monster Dex</h1>
        <div className="search-bar">
          <input type="text" placeholder="Search monsters..." />
          <button>Search</button>
        </div>
      </div>
    </header>
  );
}

export default Header;