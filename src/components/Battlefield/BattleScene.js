import React, { Suspense, useRef, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { PerspectiveCamera, Environment, useTexture, Text } from '@react-three/drei';
import BattleBoard from './BattleBoard';
import { Vector3 } from 'three';

const CameraController = () => {
  const { camera } = useThree();
  const targetPosition = new Vector3(0, 12, 10); 
  const targetLookAt = new Vector3(0, 0, -4); 

  useFrame(() => {
    camera.position.lerp(targetPosition, 0.05);
    camera.lookAt(targetLookAt);
  });

  return null;
};

const PlayerUI = ({ position, name, avatar }) => {
  const texture = useTexture(avatar);
  return (
    <group position={position}>
      <mesh>
        <planeGeometry args={[1.5, 1.5]} />
        <meshBasicMaterial map={texture} transparent />
      </mesh>
      <mesh position={[0, -1, 0]}>
        <planeGeometry args={[2, 0.5]} />
        <meshBasicMaterial color="#333333" opacity={0.7} transparent />
      </mesh>
      <Text
        position={[0, -1, 0.01]}
        fontSize={0.2}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {name}
      </Text>
    </group>
  );
};

const BattleScene = ({ onClose }) => {
  const canvasRef = useRef();

  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        canvasRef.current.style.width = '100%';
        canvasRef.current.style.height = '100%';
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden' }}>
      <Canvas ref={canvasRef} shadows>
        <Suspense fallback={null}>
          <PerspectiveCamera makeDefault fov={65} /> {/* FOV */}
          <CameraController />
          <Environment preset="sunset" background blur={0.5} />
          <BattleBoard />
          <PlayerUI position={[8, 5, 5]} name="You" avatar="/avatars/player.png" />
          <PlayerUI position={[-9.5, 8, -7]}  name="Opponent" avatar="/avatars/opponent.png" />
        </Suspense>
      </Canvas>
      <div style={{
        position: 'absolute',
        bottom: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '80%',
        height: '100px', 
        background: 'rgba(0, 0, 0, 0.5)',
        borderRadius: '10px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        <p style={{ color: 'white', fontSize: '18px' }}>Player Hand Area Placeholder</p>
      </div>
      <button
        style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          padding: '10px 20px',
          fontSize: '16px',
          cursor: 'pointer',
          backgroundColor: '#4CAF50',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
        }}
        onClick={onClose}
      >
        Exit Battle
      </button>
    </div>
  );
};

export default BattleScene;