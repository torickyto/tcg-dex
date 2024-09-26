import React, { useState, useEffect, useCallback, useRef } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import monsterData from '../../data/monsterData';
import CardInfoTooltip from './CardInfoTooltip';
import './Battle.css';

const Battle = ({ onClose }) => {
  const getCardData = (cardId) => {
    for (const monster of monsterData) {
      const card = monster.cards.find(c => c.id === cardId);
      if (card) {
        return {
          id: card.id,
          name: monster.name,
          image: card.image,
          stats: monster.stats,
          effect: monster.effect
        };
      }
    }
    console.warn(`Card with id ${cardId} not found in monsterData`);
    return null;
  };

  const initialPlayerHandIds = ['mortibane_holo', 'usurpent_reverse_holo', 'starlynx_holo', 'nihiliz_base', 'neantile_base', 'guignoleon_base', 'mortibane_reverse_holo'];
  const initialPlayerHand = initialPlayerHandIds.map(getCardData).filter(Boolean);

  const [playerHand, setPlayerHand] = useState(initialPlayerHand);
  const [playerField, setPlayerField] = useState([]);
  
  const [opponentField] = useState([
    getCardData('miteor_base'),
    getCardData('mortibane_base')
  ].filter(Boolean));

  const [hoveredCard, setHoveredCard] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [summoningCard, setSummoningCard] = useState(null);
  const [summoningPosition, setSummoningPosition] = useState({ x: 0, y: 0 });
  const [isSummoning, setIsSummoning] = useState(false);
  const [isDrawingInitialHand, setIsDrawingInitialHand] = useState(true);
  const [drawnCards, setDrawnCards] = useState([]);

  const fieldRef = useRef(null);
  const deckRef = useRef(null);
  const handRef = useRef(null);

  useEffect(() => {
    if (isDrawingInitialHand) {
      drawInitialHand();
    }
  }, [isDrawingInitialHand]);

  const drawInitialHand = () => {
    const drawNextCard = (index) => {
      if (index >= initialPlayerHand.length) {
        setIsDrawingInitialHand(false);
        setPlayerHand(initialPlayerHand);
        return;
      }

      const card = initialPlayerHand[index];
      setDrawnCards(prev => [...prev, card]);

      setTimeout(() => drawNextCard(index + 1), 200);
    };

    drawNextCard(0);
  };

  const isHolographic = (cardImage) => {
    return cardImage.includes('holo') || cardImage.includes('reverse');
  };


  const onDragEnd = (result) => {
    const { source, destination } = result;

    if (!destination) {
      return;
    }

    if (source.droppableId === 'player-hand' && destination.droppableId === 'player-field') {
      if (playerField.length < 3) {
        const newPlayerHand = Array.from(playerHand);
        const [movedCard] = newPlayerHand.splice(source.index, 1);
        setPlayerHand(newPlayerHand);
        
        const fieldRect = fieldRef.current.getBoundingClientRect();
        const dropX = destination.index * (fieldRect.width / 3) + (fieldRect.width / 6);
        const dropY = fieldRect.top + (fieldRect.height / 2);
        
        setSummoningPosition({ x: dropX, y: dropY });
        setSummoningCard(movedCard);
        setIsSummoning(true);
        
        setTimeout(() => {
          setPlayerField((prevField) => {
            const newField = [...prevField];
            newField.splice(destination.index, 0, movedCard);
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
          setIsSummoning(false);
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
    if (!isSummoning) {
      setHoveredCard(card);
      setMousePosition({ x: event.clientX, y: event.clientY });
    }
  }, [isSummoning]);

  const handleMouseLeave = useCallback(() => {
    if (!isSummoning) {
      setHoveredCard(null);
    }
  }, [isSummoning]);

  const handleMouseMove = useCallback((event) => {
    if (hoveredCard && !isSummoning) {
      setMousePosition({ x: event.clientX, y: event.clientY });
    }
  }, [hoveredCard, isSummoning]);

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
                  ref={(el) => {
                    provided.innerRef(el);
                    fieldRef.current = el;
                  }}
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
                          className={`battle-card ${snapshot.isDragging ? 'is-dragging' : ''} ${isHolographic(card.image) ? 'holographic' : ''}`}
                          data-card-id={card.id}
                          style={{
                            ...provided.draggableProps.style,
                            transition: snapshot.isDropAnimating
                              ? 'all 0.3s cubic-bezier(.2,1,.1,1)'
                              : provided.draggableProps.style.transition,
                            pointerEvents: isSummoning ? 'none' : 'auto',
                          }}
                          onMouseEnter={(e) => handleMouseEnter(card, e)}
                          onMouseLeave={handleMouseLeave}
                        >
                          <img src={card.image} alt={card.name} />
                          {isHolographic(card.image) && <div className="card-shine"></div>}
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
                        className={`battle-card ${snapshot.isDragging ? 'is-dragging' : ''} ${isHolographic(card.image) ? 'holographic' : ''}`}
                        style={{
                          ...provided.draggableProps.style,
                          transition: snapshot.isDropAnimating
                            ? 'all 0.3s cubic-bezier(.2,1,.1,1)'
                            : provided.draggableProps.style.transition,
                          pointerEvents: isSummoning ? 'none' : 'auto',
                        }}
                        onMouseEnter={(e) => handleMouseEnter(card, e)}
                        onMouseLeave={handleMouseLeave}
                      >
                        <img src={card.image} alt={card.name} />
                        {isHolographic(card.image) && <div className="card-shine"></div>}
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
          {hoveredCard && !isSummoning && (
            <CardInfoTooltip card={hoveredCard} position={mousePosition} />
          )}
          {summoningCard && (
            <motion.div
              className="summoning-animation"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              style={{
                position: 'fixed',
                left: summoningPosition.x,
                top: summoningPosition.y,
                transform: 'translate(-50%, -50%)',
              }}
            >
              <motion.div
                className={`summoning-card ${isHolographic(summoningCard.image) ? 'holographic' : ''}`}
                initial={{ scale: 0.5, y: 300, rotateX: 0, rotateY: 0 }}
                animate={{
                  scale: [0.5, 1.2, 1, 1],
                  y: [300, 0, -50, 0],
                  rotateX: [0, -30, -45, 0],
                  rotateY: [0, 15, -180, 0],
                }}
                exit={{ scale: 0.5, y: 300, rotateY: 180 }}
                transition={{
                  duration: 1.5,
                  times: [0, 0.4, 0.7, 1],
                  ease: "easeInOut",
                }}
              >
                <img src={summoningCard.image} alt={summoningCard.name} />
                <motion.div 
                  className="summoning-shine"
                  animate={{
                    opacity: [0, 0.7, 0.5, 0],
                    rotateX: [-10, 10, -5, 0],
                    rotateY: [-5, 15, -10, 0],
                  }}
                  transition={{
                    duration: 1.5,
                    times: [0, 0.4, 0.7, 1],
                    ease: "easeInOut",
                  }}
                ></motion.div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </DragDropContext>
  );
};

export default Battle;