import React, { useRef, useMemo } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { TextureLoader } from 'three/src/loaders/TextureLoader';
import * as THREE from 'three';

const BattleBoard = () => {
  const boardRef = useRef();
  const playerGraveyardRef = useRef();
  const enemyGraveyardRef = useRef();
  
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

  return (
    <group ref={boardRef} position={[0, 4, -3]} rotation={[0.3, 0, 0]}>
      {/* steel table */}
      <mesh position={[0, -0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[25, 15]} />
        <primitive object={steelMaterial} />
      </mesh>

      {/* Main board */}
      <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <boxGeometry args={[18, 13, 0.7]} />
        <primitive object={boardMaterial} />
      </mesh>

      {/* Center symbol */}
      <mesh position={[0, 0.71, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[1.2, 32]} />
        <meshStandardMaterial map={symbolTexture} transparent />
      </mesh>

      {/* Player areas */}
      {[-4, 4].map((z, index) => (
        <group key={index} position={[0, 0.71, z]}>
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[16, 3.5]} />
            <meshStandardMaterial color={index === 0 ? '#b71c1c' : '#0d47a1'} transparent opacity={0.5} />
          </mesh>
          {/* Card slots */}
          {[-6.4, -3.2, 0, 3.2, 6.4].map((x, slotIndex) => (
            <mesh key={slotIndex} position={[x, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <planeGeometry args={[2.4, 3.3]} />
              <meshBasicMaterial color="#ffffff" opacity={0.15} transparent />
            </mesh>
          ))}
        </group>
      ))}

      {/* Deck stacks */}
      {createDeckStack([-10.7, 0, 4.8])}
      {createDeckStack([10.7, 0, -4.5])}

      {/* Graveyards */}
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

      {/* Lights */}
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 8, 5]} intensity={0.7} castShadow />
      <pointLight position={[0, 3, 0]} intensity={0.4} color="#ffffff" />
    </group>
  );
};

export default BattleBoard;