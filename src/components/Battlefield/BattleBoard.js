import React, { useRef, useMemo, useCallback, useState } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { TextureLoader } from 'three/src/loaders/TextureLoader';
import * as THREE from 'three';
import PulsingSlotEffect from './PulsingSlotEffect';

const BattleBoard = ({ hoveredSlot, onCardPlaced }) => {
    const boardRef = useRef();
    const playerGraveyardRef = useRef();
    const enemyGraveyardRef = useRef();
    const [placedCards, setPlacedCards] = useState({});
    const [lastPlacedSlot, setLastPlacedSlot] = useState(null);
  
  // load textures
  const [
    steelTexture,
    boardTexture,
    cardBackTexture,
    symbolTexture,
    vortexTexture
  ] = useLoader(TextureLoader, [
    '/textures/steel.png',
    '/textures/board_texture.png',
    '/images/cards/cardback1.png',
    '/textures/symbol.png',
    '/textures/vortex.png'
  ]);

  // Create materials
  const boardMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    map: boardTexture,
    roughness: 0.7,
    metalness: 0.1
  }), [boardTexture]);

  const steelMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    map: steelTexture,
    roughness: 0.8,
    metalness: 0.2
  }), [steelTexture]);

  const cardMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    map: cardBackTexture,
    roughness: 0.4,
    metalness: 0.3
  }), [cardBackTexture]);

  const vortexMaterial = useMemo(() => new THREE.MeshBasicMaterial({
    map: vortexTexture,
    transparent: true,
    side: THREE.DoubleSide
  }), [vortexTexture]);

  useFrame((state) => { {/*time based animations*/}
    const time = state.clock.getElapsedTime();
    
    // graveyard vortexes 
    if (playerGraveyardRef.current && enemyGraveyardRef.current) {
      playerGraveyardRef.current.rotation.z += 0.005;
      enemyGraveyardRef.current.rotation.z += 0.005;
      playerGraveyardRef.current.material.opacity = 0.7 + Math.sin(time * 2) * 0.1;
      enemyGraveyardRef.current.material.opacity = 0.7 + Math.sin(time * 2) * 0.1;
    }
  });

  const createDeckStack = (position, cardCount = 30) => (
    <group position={position}>
      {[...Array(cardCount)].map((_, index) => (
        <mesh key={index} position={[0, index * 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <boxGeometry args={[2.4, 3.3, 0.01]} />
          <primitive object={cardMaterial} />
        </mesh>
      ))}
    </group>
  );

  const handleCardPlacement = useCallback((slotId, card) => {
    setPlacedCards(prev => ({ ...prev, [slotId]: card }));
    onCardPlaced(slotId, card);
}, [onCardPlaced]);

  const slotPositions = useMemo(() => [
    { x: -6.4, z: 4 },
    { x: -3.2, z: 4 },
    { x: 0, z: 4 },
    { x: 3.2, z: 4 },
    { x: 6.4, z: 4 },
    { x: -6.4, z: -4 },
    { x: -3.2, z: -4 },
    { x: 0, z: -4 },
    { x: 3.2, z: -4 },
    { x: 6.4, z: -4 },
  ], []);

  return (
    <group ref={boardRef} position={[0, 4, -3]} rotation={[0.3, 0, 0]}>
      {/* steel table */}
      <mesh position={[0, -0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[25, 15]} />
        <primitive object={steelMaterial} />
      </mesh>

      {/* main board */}
      <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <boxGeometry args={[18, 13, 0.7]} />
        <primitive object={boardMaterial} />
      </mesh>

      {/* center symbol */}
      <mesh position={[0, 0.71, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[1.2, 32]} />
        <meshStandardMaterial map={symbolTexture} transparent />
      </mesh>

      {/* player areas */}
      {[-4, 4].map((z, playerIndex) => (
                <group key={playerIndex} position={[0, 0.71, z]}>
                    <mesh rotation={[-Math.PI / 2, 0, 0]}>
                        <planeGeometry args={[16, 3.5]} />
                        <meshStandardMaterial color={playerIndex === 0 ? '#b71c1c' : '#0d47a1'} transparent opacity={0.5} />
                    </mesh>
                    {/* card slots */}
                    {slotPositions.filter(slot => slot.z === z).map((slot, slotIndex) => {
                        const slotId = `${playerIndex}-${slotIndex}`;
                        const isOccupied = !!placedCards[slotId];
                        return (
                            <group key={slotIndex}>
                                <mesh position={[slot.x, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                                    <planeGeometry args={[2.4, 3.3]} />
                                    <meshBasicMaterial color="#ffffff" opacity={0.15} transparent />
                                </mesh>
                                {hoveredSlot === slotId && !isOccupied && (
                                    <PulsingSlotEffect position={[slot.x, 0.02, 0]} />
                                )}
                                {isOccupied && (
                                    <mesh 
                                        position={[slot.x, 0.02, 0]} 
                                        rotation={[-Math.PI / 2, 0, 0]}
                                    >
                                        <planeGeometry args={[2.4, 3.3]} />
                                        <meshBasicMaterial map={new THREE.TextureLoader().load(placedCards[slotId].image)} transparent />
                                    </mesh>
                                )}
                            </group>
                        );
                    })}
                </group>
            ))}
      {/* deck stacks */}
      {createDeckStack([-10.7, 0, 4.8])}
      {createDeckStack([10.7, 0, -4.5])}

      {/* graveyards */}
      <group position={[-10.5, 0.2, -4.5]}>
        <mesh ref={playerGraveyardRef} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[3, 3]} />
          <primitive object={vortexMaterial.clone()} />
        </mesh>
      </group>
      <group position={[10.5, 0.2, 4.8]}>
        <mesh ref={enemyGraveyardRef} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[3, 3]} />
          <primitive object={vortexMaterial.clone()} />
        </mesh>
      </group>
      

      {/* lights */}
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 8, 5]} intensity={0.7} castShadow />
      <pointLight position={[0, 3, 0]} intensity={0.4} color="#ffffff" />
    </group>
  );
};

export default BattleBoard;