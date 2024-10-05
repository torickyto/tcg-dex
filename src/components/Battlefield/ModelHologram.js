import React, { useRef, useEffect, useState } from 'react';
import { useLoader, useThree, useFrame } from '@react-three/fiber';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

const ModelHologram = ({ modelName, position, playerIndex, color }) => {
  const modelRef = useRef();
  const { scene } = useThree();
  const [isLoaded, setIsLoaded] = useState(false);
  const [animationProgress, setAnimationProgress] = useState(0);

  const fbx = useLoader(FBXLoader, `/models/${modelName}.fbx`);

  useEffect(() => {
    if (fbx) {
      const model = fbx.clone();
      
      // model scale
      model.scale.set(0.012, 0.012, 0.012);
      
      // init position
      model.position.set(position[0] - 0.1, position[1], position[2] + 5.5);
      
      //model rotation
      const rotationY = playerIndex === 0 ? Math.PI : 3;
      model.rotation.set(0, rotationY, 0);

      // hologram material
      const hologramMaterial = new THREE.ShaderMaterial({
        uniforms: {
          time: { value: 0 },
          hologramColor: { value: new THREE.Color(0.2, 0.8, 1.0) },
          opacity: { value: 0 }
        },
        vertexShader: `
          varying vec2 vUv;
          varying vec3 vPosition;
          void main() {
            vUv = uv;
            vPosition = position;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          uniform float time;
          uniform vec3 hologramColor;
          uniform float opacity;
          varying vec2 vUv;
          varying vec3 vPosition;
          void main() {
            float scanline = sin(vPosition.y * 50.0 + time * 5.0) * 0.1 + 0.9;
            float edge = (1.0 - vUv.y) * 0.2;
            vec3 color = hologramColor * (scanline + edge);
            float alpha = opacity * (0.8 + 0.2 * sin(time * 3.0 + vPosition.y * 20.0));
            gl_FragColor = vec4(color, alpha);
          }
        `,
        transparent: true,
        side: THREE.DoubleSide,
      });

      model.traverse((child) => {
        if (child.isMesh) {
          child.material = hologramMaterial;
        }
      });

      scene.add(model);
      modelRef.current = model;
      setIsLoaded(true);

      return () => {
        scene.remove(model);
        model.traverse((child) => {
          if (child.isMesh) {
            child.geometry.dispose();
            child.material.dispose();
          }
        });
      };
    }
  }, [fbx, position, scene, playerIndex, color]);

  useFrame((state, delta) => {
    if (modelRef.current) {
      const model = modelRef.current;
      const material = model.children[0].material;

      material.uniforms.time.value += delta;

      // hologram anim
      if (animationProgress < 1) {
        setAnimationProgress(Math.min(animationProgress + delta * 0.5, 1));
        const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);
        const easedProgress = easeOutCubic(animationProgress);

        model.position.y = position[1] + easedProgress * 4.2;

        material.uniforms.opacity.value = easedProgress;

        // pop up
        const scale = 0.012 * (1 + Math.sin(easedProgress * Math.PI) * 0.1);
        model.scale.set(scale, scale, scale);
      }
    }
  });

  return (
    <group position={[position[0], position[1] + 0.1, position[2]]}>
      {!isLoaded && (
        <Text
          position={[0, 1, 0]}
          color="white"
          anchorX="center"
          anchorY="middle"
          fontSize={0.5}
        >
          Loading {modelName}...
        </Text>
      )}
    </group>
  );
};

export default ModelHologram;