import React, { useState, useEffect } from 'react';
import MonsterList from './MonsterList';
import MonsterDetail from './MonsterDetail';
import SearchBar from './SearchBar';
import ThemeToggle from './ThemeToggle';
import TypeChart from './TypeChart';
import monsterData from '../data/monsterData';
import { AnimatePresence, motion } from 'framer-motion';
import { BookOpen } from 'lucide-react';
import './MonsterDex.css';

function MonsterDex() {
  const [monsters, setMonsters] = useState([]);
  const [selectedMonster, setSelectedMonster] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isTypeChartOpen, setIsTypeChartOpen] = useState(false);

  useEffect(() => {
    setMonsters(monsterData);
    if (monsterData.length > 0) {
      setSelectedMonster(monsterData[0]);
    }
  }, []);

  const filteredMonsters = monsters.filter(monster =>
    monster.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
      <button className="type-chart-button" onClick={() => setIsTypeChartOpen(true)}>
        <BookOpen size={24} />
        <span>Type Chart</span>
      </button>
      <TypeChart isOpen={isTypeChartOpen} onClose={() => setIsTypeChartOpen(false)} />
    </div>
  );
}

export default MonsterDex;