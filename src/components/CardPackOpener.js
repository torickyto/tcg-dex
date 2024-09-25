import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import monsterData from '../data/monsterData';
import './CardPackOpener.css';

const packTypes = {
  starter: { name: "Starter Pack", cardCount: 5, rarityDistribution: { common: 0.7, legendary: 0.3}, color: '#4CAF50' },
  pulse: { name: "Pulse Pack", cardCount: 5, rarityDistribution: { common: 0.6, uncommon: 0.3, rare: 0.09, legendary: 0.01 }, color: '#2196F3' },
  royal: { name: "Royal Pack", cardCount: 5, rarityDistribution: { uncommon: 0.5, rare: 0.4, legendary: 0.1 }, color: '#FFC107' },
  legendary: { name: "Legendary Pack", cardCount: 3, rarityDistribution: { rare: 0.7, legendary: 0.3 }, color: '#9C27B0' }
};

const CardPackOpener = ({ isOpen, onClose, onCardOpened }) => {
  const [currentPackType, setCurrentPackType] = useState(null);
  const [isSelectingPack, setIsSelectingPack] = useState(true);
  const [cards, setCards] = useState([]);
  const [revealedCards, setRevealedCards] = useState([]);
  const [isFlipping, setIsFlipping] = useState([]);
  const cardRefs = useRef([]);

  useEffect(() => {
    if (isOpen) {
      setIsSelectingPack(true);
      setCurrentPackType(null);
      setCards([]);
      setRevealedCards([]);
      setIsFlipping([]);
    }
  }, [isOpen]);

  const selectPack = (packType) => {
    setCurrentPackType(packType);
    setIsSelectingPack(false);
    const pack = packTypes[packType];
    const openedCards = [];
    for (let i = 0; i < pack.cardCount; i++) {
      const rarity = selectRarity(pack.rarityDistribution);
      const card = selectCardByRarity(rarity, packType);
      if (card) openedCards.push(card);
    }
    setCards(openedCards);
    setRevealedCards(new Array(openedCards.length).fill(false));
    setIsFlipping(new Array(openedCards.length).fill(false));
  };

  const selectRarity = (distribution) => {
    const rand = Math.random();
    let cumulativeProbability = 0;
    for (const [rarity, probability] of Object.entries(distribution)) {
      cumulativeProbability += probability;
      if (rand <= cumulativeProbability) return rarity;
    }
    return Object.keys(distribution)[0];
  };

  const selectCardByRarity = (rarity, packType) => {
    const eligibleCards = monsterData.flatMap(monster => 
      (monster.cards || []).filter(card => 
        card.rarity === rarity && 
        card.packAppearance.includes(packType)
      ).map(card => ({...card, monsterId: monster.id}))
    );
    if (eligibleCards.length === 0) return null;
    return eligibleCards[Math.floor(Math.random() * eligibleCards.length)];
  };

  const handleCardFlip = (index) => {
    if (!revealedCards[index] && !isFlipping[index]) {
      const newRevealedCards = [...revealedCards];
      const newIsFlipping = [...isFlipping];
      newRevealedCards[index] = true;
      newIsFlipping[index] = true;
      setRevealedCards(newRevealedCards);
      setIsFlipping(newIsFlipping);
      onCardOpened(cards[index]);

      setTimeout(() => {
        const updatedIsFlipping = [...newIsFlipping];
        updatedIsFlipping[index] = false;
        setIsFlipping(updatedIsFlipping);
      }, 600); // Match this with your CSS transition time
    }
  };

  const handleCardRotation = (event, index) => {
    if (revealedCards[index] && !isFlipping[index]) {
      const card = cardRefs.current[index];
      const rect = card.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * 15;
      const rotateY = ((centerX - x) / centerX) * 15;
      
      card.style.transform = `perspective(1000px) rotateY(180deg) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
      
      const shine = card.querySelector('.card-shine');
      if (shine) {
        const moveX = ((x - centerX) / centerX) * 150;
        const moveY = ((y - centerY) / centerY) * 150;
        shine.style.backgroundPosition = `${moveX}% ${moveY}%`;
      }
    }
  };

  const resetCardRotation = (index) => {
    if (cardRefs.current[index] && revealedCards[index] && !isFlipping[index]) {
      const card = cardRefs.current[index];
      card.style.transform = 'perspective(1000px) rotateY(180deg)';
      const shine = card.querySelector('.card-shine');
      if (shine) {
        shine.style.backgroundPosition = '50% 50%';
      }
    }
  };

  const allCardsRevealed = revealedCards.every(card => card);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="card-pack-opener"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="card-pack-content"
          >
            {isSelectingPack ? (
              <>
                <h2 className="pack-selection-title">Select a Pack</h2>
                <div className="pack-selection-grid">
                  {Object.entries(packTypes).map(([type, pack]) => (
                    <motion.button
                      key={type}
                      onClick={() => selectPack(type)}
                      className="pack-button"
                      style={{ backgroundColor: pack.color }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <span className="pack-name">{pack.name}</span>
                      <span className="pack-card-count">{pack.cardCount} cards</span>
                    </motion.button>
                  ))}
                </div>
              </>
            ) : (
              <>
                <h2 className="pack-name">{packTypes[currentPackType].name}</h2>
                <div className="cards-spread">
                  {cards.map((card, index) => (
                    <motion.div
                      key={index}
                      className={`card-container ${revealedCards[index] ? 'revealed' : ''}`}
                      onClick={() => handleCardFlip(index)}
                      onMouseMove={(e) => handleCardRotation(e, index)}
                      onMouseLeave={() => resetCardRotation(index)}
                      initial={{ opacity: 0, y: 50 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div
                        ref={el => cardRefs.current[index] = el}
                        className={`card ${revealedCards[index] ? 'revealed' : ''} ${isFlipping[index] ? 'flipping' : ''}`}
                      >
                        <div className="card-face card-back">
                          <img src="/images/cards/cardback1.png" alt="Card Back" />
                        </div>
                        <div className="card-face card-front">
                          <img src={card.image} alt={card.name} />
                          <div className={`card-shine ${card.rarity === 'legendary' ? 'holographic' : ''}`}></div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
                {allCardsRevealed && (
                  <button className="close-pack-button" onClick={onClose}>Close Pack</button>
                )}
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CardPackOpener;