import React, { useState, useEffect } from 'react';
import MonsterList from './MonsterList';
import MonsterDetail from './MonsterDetail';
import SearchBar from './SearchBar';
import ThemeToggle from './ThemeToggle';
import TypeChart from './TypeChart';
import CardPackOpener from './CardPackOpener';
import monsterData from '../data/monsterData';
import { AnimatePresence, motion } from 'framer-motion';
import { BookOpen, Package } from 'lucide-react';
import './MonsterDex.css';

function MonsterDex() {
  const [monsters, setMonsters] = useState([]);
  const [selectedMonster, setSelectedMonster] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isTypeChartOpen, setIsTypeChartOpen] = useState(false);
  const [isPackOpenerOpen, setIsPackOpenerOpen] = useState(false);

  useEffect(() => {
    setMonsters(monsterData);
    if (monsterData.length > 0) {
      setSelectedMonster(monsterData[0]);
    }
  }, []);

  const filteredMonsters = monsters.filter(monster =>
    monster.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCardOpened = (card) => {
    console.log("Opened card:", card);
    // TODO: Update the user's collection
  };

  return (
    <div className={`monster-dex ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
      <div className="monster-dex-content">
        <div className="sidebar">
          <SearchBar setSearchTerm={setSearchTerm} />
          <MonsterList 
            monsters={filteredMonsters} 
            setSelectedMonster={setSelectedMonster}
            selectedMonster={selectedMonster}
          />
        </div>
        <div className="main-content">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedMonster ? selectedMonster.id : 'empty'}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="monster-detail-container"
            >
              {selectedMonster && (
                <MonsterDetail 
                  monster={selectedMonster} 
                  allMonsters={monsters}
                  setSelectedMonster={setSelectedMonster}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <ThemeToggle isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
      
      <div className="action-buttons">
        <button className="action-button" onClick={() => setIsTypeChartOpen(true)}>
          <BookOpen size={24} />
          <span>Type Chart</span>
        </button>
        <button className="action-button" onClick={() => setIsPackOpenerOpen(true)}>
          <Package size={24} />
          <span>Open Packs</span>
        </button>
      </div>

      <TypeChart isOpen={isTypeChartOpen} onClose={() => setIsTypeChartOpen(false)} />

      <CardPackOpener
        isOpen={isPackOpenerOpen}
        onClose={() => setIsPackOpenerOpen(false)}
        onCardOpened={handleCardOpened}
      />
    </div>
  );
}

export default MonsterDex;