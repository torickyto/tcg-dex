import React, { useState, useCallback, useRef } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import CardInfoTooltip from './CardInfoTooltip';
import './Battle.css';

const Battle = ({ onClose }) => {
  const [playerHand, setPlayerHand] = useState([
    { id: 'card-1', name: 'Plasmew', image: '/images/cards/1_base.png', stats: { attack: 30, defense: 20 }, effect: "When Plasmew is summoned, you may draw 1 card. Once per turn, you can discard 1 card to increase Plasmew's attack by 10 until the end of your turn." },
    { id: 'card-2', name: 'Felazor', image: '/images/cards/2_base.png', stats: { attack: 45, defense: 25 }, effect: "When Felazor attacks, flip a coin. If heads, this attack deals 10 additional damage. If tails, your opponent discards 1 card from their hand." },
    { id: 'card-3', name: 'Starlynx', image: '/images/cards/3_holo.png', stats: { attack: 65, defense: 35 }, effect: "Once per turn, when Starlynx attacks, you may choose to have it attack twice. If you do, flip a coin after the second attack. If tails, Starlynx cannot attack during your next turn." },
    { id: 'card-4', name: 'Nihiliz', image: '/images/cards/4_base.png', stats: { attack: 25, defense: 25 }, effect: "When Nihiliz is summoned, your opponent's active monster loses 10 attack until the end of their next turn. This effect can only be used once per game." },
    { id: 'card-5', name: 'Neantile', image: '/images/cards/5_base.png', stats: { attack: 35, defense: 35 }, effect: "Once per turn, you can make Neantile invulnerable to attacks until your next turn. If you do, Neantile cannot attack during your next turn." },
    { id: 'card-6', name: 'Guignoleon', image: '/images/cards/6_base.png', stats: { attack: 50, defense: 50 }, effect: "When Guignoleon is summoned, you may swap the attack and defense of all monsters on the field until the end of your next turn. This effect can only be used once per game." },
    { id: 'card-7', name: 'Nebulith', image: '/images/cards/7_base.png', stats: { attack: 20, defense: 30 }, effect: "When Nebulith is attacked, flip a coin. If heads, reduce the incoming damage by 10." },
  ]);

  const [playerField, setPlayerField] = useState([]);
  const [opponentField] = useState([
    { id: 'card-10', name: 'Miteor', image: '/images/cards/10_base.png', stats: { attack: 15, defense: 30 }, effect: "When Miteor defeats an opponent's monster, it absorbs 50% of that monster's max HP, permanently increasing its own stats." },
  ]);

  const [hoveredCard, setHoveredCard] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [summoningCard, setSummoningCard] = useState(null);
  const summoningRef = useRef(null);

  const onDragEnd = (result) => {
    const { source, destination } = result;

    if (!destination) {
      return;
    }

    const reorder = (list, startIndex, endIndex) => {
      const result = Array.from(list);
      const [removed] = result.splice(startIndex, 1);
      result.splice(endIndex, 0, removed);
      return result;
    };

    if (source.droppableId === 'player-hand' && destination.droppableId === 'player-field') {
      if (playerField.length < 3) {
        const newPlayerHand = Array.from(playerHand);
        const [movedCard] = newPlayerHand.splice(source.index, 1);
        setSummoningCard(movedCard);
        setPlayerHand(newPlayerHand);
        
        setTimeout(() => {
          setPlayerField((prevField) => {
            const newField = [...prevField, movedCard];
            setTimeout(() => {
              const cardElement = document.querySelector(`[data-card-id="${movedCard.id}"]`);
              if (cardElement) {
                cardElement.classList.add('card-landed');
                setTimeout(() => cardElement.classList.remove('card-landed'), 300);
              }
            }, 50);
            return newField;
          });
          setSummoningCard(null);
        }, 1500); 
      }
    } else if (source.droppableId === 'player-field' && destination.droppableId === 'player-hand') {
      const newPlayerField = Array.from(playerField);
      const [movedCard] = newPlayerField.splice(source.index, 1);
      const newPlayerHand = Array.from(playerHand);
      newPlayerHand.splice(destination.index, 0, movedCard);
      setPlayerHand(newPlayerHand);
      setPlayerField(newPlayerField);
    }
  };

  const handleMouseEnter = useCallback((card, event) => {
    setHoveredCard(card);
    setMousePosition({ x: event.clientX, y: event.clientY });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setHoveredCard(null);
  }, []);

  const handleMouseMove = useCallback((event) => {
    if (hoveredCard) {
      setMousePosition({ x: event.clientX, y: event.clientY });
    }
  }, [hoveredCard]);

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="battle-screen" onMouseMove={handleMouseMove}>
        <div className="battle-content">
          <button className="battle-close-button" onClick={onClose}>
            <X size={24} />
          </button>
          <div className="battle-opponent-area">
            <div className="battle-field">
              <h3>Opponent Field</h3>
              {opponentField.map((card) => (
                <div 
                  key={card.id} 
                  className="battle-card"
                  onMouseEnter={(e) => handleMouseEnter(card, e)}
                  onMouseLeave={handleMouseLeave}
                >
                  <img src={card.image} alt={card.name} />
                </div>
              ))}
            </div>
          </div>
          <div className="battle-player-area">
            <Droppable droppableId="player-field" direction="horizontal">
              {(provided, snapshot) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className={`battle-field ${snapshot.isDraggingOver ? 'dragging-over' : ''}`}
                >
                  <h3>Your Field</h3>
                  {playerField.map((card, index) => (
                    <Draggable key={card.id} draggableId={card.id} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={`battle-card ${snapshot.isDragging ? 'is-dragging' : ''}`}
                          style={{
                            ...provided.draggableProps.style,
                            transition: snapshot.isDropAnimating
                              ? 'all 0.3s cubic-bezier(.2,1,.1,1)'
                              : provided.draggableProps.style.transition,
                          }}
                          onMouseEnter={(e) => handleMouseEnter(card, e)}
                          onMouseLeave={handleMouseLeave}
                        >
                          <img src={card.image} alt={card.name} />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
          <Droppable droppableId="player-hand" direction="horizontal">
            {(provided, snapshot) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className={`battle-hand ${snapshot.isDraggingOver ? 'dragging-over' : ''}`}
              >
                <h3>Your Hand</h3>
                {playerHand.map((card, index) => (
                  <Draggable key={card.id} draggableId={card.id} index={index}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className={`battle-card ${snapshot.isDragging ? 'is-dragging' : ''}`}
                        style={{
                          ...provided.draggableProps.style,
                          transition: snapshot.isDropAnimating
                            ? 'all 0.3s cubic-bezier(.2,1,.1,1)'
                            : provided.draggableProps.style.transition,
                        }}
                        onMouseEnter={(e) => handleMouseEnter(card, e)}
                        onMouseLeave={handleMouseLeave}
                      >
                        <img src={card.image} alt={card.name} />
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </div>
        <AnimatePresence>
          {hoveredCard && (
            <CardInfoTooltip card={hoveredCard} position={mousePosition} />
          )}
          {summoningCard && (
            <motion.div
              className="summoning-animation"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                className={`summoning-card ${summoningCard.image.includes('holo') ? 'holographic' : ''}`}
                initial={{ scale: 0.5, y: 300, rotateY: 0 }}
                animate={{
                  scale: [0.5, 1.2, 1.2, 0.8],
                  y: [300, 0, 0, 100],
                  rotateY: [0, 360, 720, 1080],
                }}
                exit={{ scale: 0.5, y: 300, rotateY: 180 }}
                transition={{
                  duration: 1.5,
                  times: [0, 0.4, 0.6, 1],
                  ease: "easeInOut",
                }}
              >
                <img src={summoningCard.image} alt={summoningCard.name} />
                <div className="summoning-shine"></div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </DragDropContext>
  );
};

export default Battle;