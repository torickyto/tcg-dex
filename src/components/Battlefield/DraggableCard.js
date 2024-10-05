import React, { useRef, useState, useCallback, useMemo, useEffect, Suspense } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useSpring, a } from '@react-spring/three';
import Card from './Card';
import ModelHologram from './ModelHologram';

const DraggableCard = ({ card, position, rotation, onHoverSlot, onPlaceCard }) => {
  const meshRef = useRef();
  const [isDragging, setIsDragging] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isPlaced, setIsPlaced] = useState(false);
  const [hoveredSlot, setHoveredSlot] = useState(null);
  const [summonAnimation, setSummonAnimation] = useState(null);
  const dragStart = useRef(new THREE.Vector3());
  const dragOffset = useRef(new THREE.Vector3());
  const originalPosition = useRef(new THREE.Vector3(...position));
  const originalRotation = useRef(new THREE.Euler(...rotation));
  const targetPosition = useRef(new THREE.Vector3());
  
  const { camera, gl } = useThree();



  // reference plane for the gameboard
  const boardPlane = useMemo(() => {
    const normalVector = new THREE.Vector3(0, 1, 0.05).normalize();
    const boardCenter = new THREE.Vector3(0, 7, 6.9);
    return new THREE.Plane(normalVector, -boardCenter.dot(normalVector));
  }, []);

  // spring animations
  const [spring, setSpring] = useSpring(() => ({
    position: position,
    rotation: rotation,
    scale: [1, 1, 1],
    config: { mass: 1, tension: 180, friction: 12 }
  }));

  const slotPositions = useMemo(() => [
    { x: -6.4, z: 4 }, { x: -3.2, z: 4 }, { x: 0, z: 4 }, { x: 3.2, z: 4 }, { x: 6.4, z: 4 },
    { x: -6.4, z: -4 }, { x: -3.2, z: -4 }, { x: 0, z: -4 }, { x: 3.2, z: -4 }, { x: 6.4, z: -4 },
  ], []);

  // check to see if card is over summon slot
  const checkSlotHover = useCallback((position) => {
    const cardX = position[0];
    const cardZ = position[2];
    
    for (let i = 0; i < slotPositions.length; i++) {
      const slot = slotPositions[i];
      if (Math.abs(cardX - slot.x) < 1.2 && Math.abs(cardZ - slot.z) < 1.65) {
        const playerIndex = slot.z > 0 ? 0 : 1;
        const slotIndex = i % 5;
        return `${playerIndex}-${slotIndex}`;
      }
    }
    return null;
  }, [slotPositions]);

  const onPointerDown = useCallback((event) => {
    if (isPlaced) return;
    event.stopPropagation();
    setIsDragging(true);
    const intersection = event.intersections[0];
    if (intersection) {
      dragStart.current.copy(intersection.point);
      dragOffset.current.copy(intersection.point).sub(meshRef.current.position);
    }
    gl.domElement.style.cursor = 'grabbing';
  }, [gl, isPlaced]);

  //placeholder nihiliz model
  const [showModel, setShowModel] = useState(false);
  const [modelPosition, setModelPosition] = useState(position);

  const onPointerUp = useCallback(() => {
    setIsDragging(false);
    gl.domElement.style.cursor = isHovered ? 'pointer' : 'auto';
    
    const hoveredSlot = checkSlotHover(meshRef.current.position.toArray());
    if (hoveredSlot && !isPlaced) {  // set up animation if the card isn't already placed
      setIsPlaced(true);
      onPlaceCard(hoveredSlot, card);
      
      // get exact slot position
      const [playerIndex, slotIndex] = hoveredSlot.split('-').map(Number);
      const slotPosition = slotPositions[playerIndex * 5 + slotIndex];
      
      // summon anim setup
      const startPosition = meshRef.current.position.clone();
      const midPosition = startPosition.clone().add(new THREE.Vector3(0, 8, 0));
      const endPosition = new THREE.Vector3(slotPosition.x, 1.4, slotPosition.z);
      const startRotation = new THREE.Euler().setFromQuaternion(meshRef.current.quaternion);
      const midRotation = new THREE.Euler(Math.PI * 2, 0, 0);
      const endRotation = new THREE.Euler(-Math.PI / 2.5, 0, 0);

      setSummonAnimation({
        startTime: Date.now(),
        duration: 2000,
        startPosition,
        midPosition,
        endPosition,
        startRotation,
        midRotation,
        endRotation
      });
      setTimeout(() => {
        console.log('Showing Nihiliz model');
        setShowModel(true);
        setModelPosition(endPosition.toArray());
      }, 2000);
    } else if (!isPlaced) {
      // spring back to position in hand if card not played
      setSpring({
        position: originalPosition.current.toArray(),
        rotation: [originalRotation.current.x, originalRotation.current.y, originalRotation.current.z],
        scale: [1, 1, 1],
        config: { mass: 1, tension: 180, friction: 12 }
      });
    }
   }, [gl, isHovered, onPlaceCard, setSpring, slotPositions, checkSlotHover, card, isPlaced]);

   const onPointerMove = useCallback((event) => {
    if (isDragging && !isPlaced) {
      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(event.pointer, camera);
      const intersectionPoint = new THREE.Vector3();
      raycaster.ray.intersectPlane(boardPlane, intersectionPoint);

      // new pos
      const newPosition = intersectionPoint.sub(dragOffset.current);

      // drag boundaries
      newPosition.x = Math.max(-16, Math.min(16, newPosition.x));
      newPosition.z = Math.max(-16, Math.min(16, newPosition.z));

      setSpring({
        position: [newPosition.x, newPosition.y, newPosition.z],
        rotation: [-Math.PI / 2.5, 0, 0],
        immediate: true
      });

      const newHoveredSlot = checkSlotHover([newPosition.x, newPosition.y, newPosition.z]);
      setHoveredSlot(newHoveredSlot);
      onHoverSlot(newHoveredSlot);
    }
  }, [isDragging, isPlaced, camera, boardPlane, setSpring, checkSlotHover, onHoverSlot]);

  const onPointerEnter = useCallback(() => {
    if (!isPlaced) {
      setIsHovered(true);
      gl.domElement.style.cursor = 'pointer';
      setSpring({ scale: [1.05, 1.05, 1.05] });
    }
  }, [gl, setSpring, isPlaced]);

  const onPointerLeave = useCallback(() => {
    if (!isPlaced) {
      setIsHovered(false);
      gl.domElement.style.cursor = 'auto';
      if (!isDragging) {
        setSpring({ scale: [1, 1, 1] });
      }
    }
  }, [gl, isDragging, setSpring, isPlaced]);

  useEffect(() => {
    const canvas = gl.domElement;
    canvas.addEventListener('pointerup', onPointerUp);
    canvas.addEventListener('pointerleave', onPointerUp);

    return () => {
      canvas.removeEventListener('pointerup', onPointerUp);
      canvas.removeEventListener('pointerleave', onPointerUp);
    };
  }, [gl, onPointerUp]);

  useFrame(() => {
    if (summonAnimation) {
      const { startTime, duration, startPosition, midPosition, endPosition, startRotation, midRotation, endRotation } = summonAnimation;
      const elapsedTime = Date.now() - startTime;
      const progress = Math.min(elapsedTime / duration, 1);

      // elastic anim easing
      const easeOutElastic = (x) => {
        const c4 = (2 * Math.PI) / 3;
        return x === 0 ? 0 : x === 1 ? 1 : Math.pow(2, -10 * x) * Math.sin((x * 10 - 0.75) * c4) + 1;
      };

      const easedProgress = easeOutElastic(progress);

      let newPosition, newRotation;
      if (progress < 0.5) {
        // card goes up and spins
        newPosition = new THREE.Vector3().lerpVectors(startPosition, midPosition, easedProgress * .3);
        newRotation = new THREE.Euler(
          startRotation.x + (midRotation.x - startRotation.x) * easedProgress * 1,
          startRotation.y + (midRotation.y - startRotation.y) * easedProgress * 5,
          startRotation.z + (midRotation.z - startRotation.z) * easedProgress * .06
        );
      } else {
        // card gets set down
        newPosition = new THREE.Vector3().lerpVectors(midPosition, endPosition, (easedProgress - 0.5) * 2);
        newRotation = new THREE.Euler(
          midRotation.x + (endRotation.x - midRotation.x) * (easedProgress - 0.5) * 2,
          midRotation.y + (endRotation.y - midRotation.y) * (easedProgress - 0.5) * 2,
          midRotation.z + (endRotation.z - midRotation.z) * (easedProgress - 0.5) * 2
        );
      }

      setSpring({
        position: newPosition.toArray(),
        rotation: [newRotation.x, newRotation.y, newRotation.z],
        scale: [1 - 0.1 * Math.sin(progress * Math.PI), 1 - 0.1 * Math.sin(progress * Math.PI), 1],
        immediate: true
      });

      if (progress === 1) {
        setSummonAnimation(null);
      }
    } else if (!isDragging && !isPlaced) {
      setSpring({
        position: originalPosition.current.toArray(),
        rotation: [originalRotation.current.x, originalRotation.current.y, originalRotation.current.z],
        scale: isHovered ? [1.05, 1.05, 1.05] : [1, 1, 1]
      });
    }
  });

  useEffect(() => {
    if (showModel) {
      console.log('showModel is true, Nihiliz model should be visible at position:', modelPosition);
    }
  }, [showModel, modelPosition]);

 return (
    <>
      <a.group 
        ref={meshRef}
        {...spring}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerEnter={onPointerEnter}
        onPointerLeave={onPointerLeave}
      >
        <Card card={card} />
      </a.group>
      {showModel && (card.name === 'Nihiliz' || card.name === 'Starlynx') && (
        <Suspense fallback={null}>
          <ModelHologram
            modelName={card.name.toLowerCase()}
            position={modelPosition}
            playerIndex={hoveredSlot ? parseInt(hoveredSlot.split('-')[0]) : 0}
            color={card.name === 'Nihiliz' ? '0.2, 0.8, 1.0' : '1.0, 0.5, 0.7'}
          />
        </Suspense>
      )}
    </>
  );
};

export default DraggableCard;