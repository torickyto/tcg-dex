import React, { useRef, useState, useEffect } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { useDrag } from '@use-gesture/react';
import { Card } from './Card';
import * as THREE from 'three';

const DraggableCard = ({ card, initialPosition, monsterSlots, onPlaceCard }) => {
  const { size, viewport } = useThree();
  const aspect = size.width / viewport.width;
  
  const ref = useRef();
  const [position, setPosition] = useState(initialPosition);
  const [isDragging, setIsDragging] = useState(false);
  const [velocity, setVelocity] = useState([0, 0, 0]);
  
  const bind = useDrag(({ active, movement: [x, y], timeStamp, event }) => {
    if (event.ray) {
      const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
      const point = new THREE.Vector3();
      event.ray.intersectPlane(plane, point);
      
      if (active) {
        setPosition([point.x, point.y, point.z]);
        setIsDragging(true);
      } else {
        setIsDragging(false);
        const nearestSlot = findNearestSlot(point);
        if (nearestSlot) {
          setPosition(nearestSlot.position);
          onPlaceCard(card, nearestSlot.index);
        }
      }
      
      if (timeStamp) {
        const dt = Math.min(1 / 60, (timeStamp - (bind.current?.timeStamp || 0)) / 1000);
        setVelocity([(point.x - position[0]) / dt, (point.y - position[1]) / dt, 0]);
        bind.current = { timeStamp };
      }
    }
  });

  const findNearestSlot = (point) => {
    let nearest = null;
    let minDistance = Infinity;
    monsterSlots.forEach((slot, index) => {
      const distance = Math.sqrt(
        Math.pow(slot.position[0] - point.x, 2) +
        Math.pow(slot.position[1] - point.y, 2)
      );
      if (distance < minDistance && distance < 1) { // snap distance
        minDistance = distance;
        nearest = { position: slot.position, index };
      }
    });
    return nearest;
  };

  useFrame(() => {
    if (!isDragging) {
      setPosition((pos) => [
        pos[0] + velocity[0] * 0.02,
        pos[1] + velocity[1] * 0.02,
        pos[2]
      ]);
      setVelocity((vel) => [vel[0] * 0.95, vel[1] * 0.95, 0]);
    }
  });

  return (
    <group ref={ref} position={position} {...bind()}>
      <Card card={card} />
    </group>
  );
};

export default DraggableCard;