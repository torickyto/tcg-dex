import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const PulsingSlotEffect = ({ position }) => {
  const groupRef = useRef();
  const glowRef = useRef();
  const tendrilsRef = useRef();
  const particlesRef = useRef();

  // glow
  const glowMaterial = useMemo(() => new THREE.MeshBasicMaterial({
    color: new THREE.Color(0.1, 0.3, 1.0),
    transparent: true,
    opacity: 0.6,
    side: THREE.DoubleSide
  }), []);

  // tendrils
  const tendrilCount = 8;
  const tendrilSegments = 20;
  const tendrilRadius = 1;
  const tendrilHeight = 2;

  const tendrilGeometry = useMemo(() => {
    const points = [];
    for (let i = 0; i <= tendrilSegments; i++) {
      const t = i / tendrilSegments;
      points.push(new THREE.Vector3(
        tendrilRadius * (1 - t) * Math.sin(t * Math.PI * 2),
        t * tendrilHeight,
        tendrilRadius * (1 - t) * Math.cos(t * Math.PI * 2)
      ));
    }
    return new THREE.BufferGeometry().setFromPoints(points);
  }, []);

  const tendrilMaterial = useMemo(() => new THREE.ShaderMaterial({
    uniforms: {
      time: { value: 0 },
      color: { value: new THREE.Color(0.2, 0.5, 1.0) }
    },
    vertexShader: `
      uniform float time;
      varying float vOpacity;
      void main() {
        vec3 pos = position;
        float wave = sin(time * 2.0 + position.y * 2.0) * 0.1;
        pos.x += wave;
        pos.z += wave;
        vOpacity = smoothstep(${tendrilHeight}.0, 0.0, pos.y);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      }
    `,
    fragmentShader: `
      uniform vec3 color;
      varying float vOpacity;
      void main() {
        gl_FragColor = vec4(color, vOpacity * 0.5);
      }
    `,
    transparent: true,
    blending: THREE.AdditiveBlending,
  }), []);

  // particles
  const particleCount = 100;
  const particlePositions = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 3;
      positions[i + 1] = Math.random() * 3;
      positions[i + 2] = (Math.random() - 0.5) * 3;
    }
    return positions;
  }, []);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    
    // glow
    if (glowRef.current) {
      glowRef.current.material.opacity = 0.6 + Math.sin(time * 2) * 0.2;
    }
    
    // tendrils
    if (tendrilsRef.current) {
      tendrilsRef.current.children.forEach((tendril, index) => {
        tendril.rotation.y = time * 0.5 + index * Math.PI / 4;
        tendril.material.uniforms.time.value = time;
      });
    }
    
    // particles
    if (particlesRef.current) {
      const positions = particlesRef.current.geometry.attributes.position.array;
      for (let i = 1; i < positions.length; i += 3) {
        positions[i] = Math.sin(time + i) * 1.5;
      }
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <group ref={groupRef} position={position}>
      {/* glow */}
      <mesh ref={glowRef} position={[0, 0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[3, 4]} />
        <primitive object={glowMaterial} />
      </mesh>

      {/* tendrils */}
      <group ref={tendrilsRef}>
        {Array(tendrilCount).fill().map((_, index) => (
          <line key={index} rotation={[0, (index / tendrilCount) * Math.PI * 2, 0]}>
            <primitive object={tendrilGeometry} />
            <primitive object={tendrilMaterial.clone()} />
          </line>
        ))}
      </group>

      {/* particles */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={particleCount}
            array={particlePositions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.05}
          color={new THREE.Color(0.9, 0.6, 0.2)}
          transparent
          opacity={0.6}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
};

export default PulsingSlotEffect;