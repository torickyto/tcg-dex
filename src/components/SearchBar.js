import React from 'react';
import { Search } from 'lucide-react';
import './SearchBar.css';

function SearchBar({ setSearchTerm }) {
  return (
    <div className="search-bar">
      <Search className="search-icon" />
      <input 
        type="text" 
        placeholder="Search creatures..." 
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </div>
  );
}

export default SearchBar;