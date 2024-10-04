import React, { useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

export const Card = ({ card, position, rotation }) => {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);

  const textureUrl = card.image;
  const texture = useMemo(() => new THREE.TextureLoader().load(textureUrl), [textureUrl]);
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;

  const isHolographic = card.rarity === 'mythic' || card.rarity === 'legendary';

  const material = useMemo(() => {
    if (isHolographic) {
      const holographicTexture = new THREE.TextureLoader().load('/textures/holo_specular.png');
      return new THREE.ShaderMaterial({
        uniforms: {
          map: { value: texture },
          holoMap: { value: holographicTexture },
          time: { value: 0 },
          rotation: { value: new THREE.Vector3() }
        },
        vertexShader: `
          varying vec2 vUv;
          varying vec3 vNormal;
          varying vec3 vViewPosition;
          void main() {
            vUv = uv;
            vNormal = normalize(normalMatrix * normal);
            vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
            vViewPosition = -mvPosition.xyz;
            gl_Position = projectionMatrix * mvPosition;
          }
        `,
        fragmentShader: `
          uniform sampler2D map;
          uniform sampler2D holoMap;
          uniform float time;
          uniform vec3 rotation;
          varying vec2 vUv;
          varying vec3 vNormal;
          varying vec3 vViewPosition;
          
          void main() {
            vec4 color = texture2D(map, vUv);
            
            // Calculate fresnel effect
            vec3 viewDirectionW = normalize(vViewPosition);
            float fresnelTerm = dot(viewDirectionW, vNormal);
            fresnelTerm = clamp(1.0 - fresnelTerm, 0., 1.);
            
            // Holographic effect based on rotation and fresnel
            vec2 holoUv = vUv + vec2(
              sin(time * 2.0 + vUv.y * 10.0 + rotation.x) * 0.02,
              cos(time * 2.0 + vUv.x * 10.0 + rotation.y) * 0.02
            );
            vec4 holo = texture2D(holoMap, holoUv);
            
            // Enhance holo colors
            holo.rgb *= 5.0;
            
            // Mix color and holographic effect
            vec4 finalColor = color + holo * fresnelTerm * .9;
            finalColor.a = color.a;
            gl_FragColor = finalColor;
          }
        `
      });
    } else {
      return new THREE.MeshBasicMaterial({ map: texture });
    }
  }, [texture, isHolographic]);

  // Create rounded rectangle shape
  const shape = useMemo(() => {
    const shape = new THREE.Shape();
    const width = 2.5;
    const height = 3.5;
    const radius = 0.1;

    shape.moveTo(-width / 2 + radius, -height / 2);
    shape.lineTo(width / 2 - radius, -height / 2);
    shape.quadraticCurveTo(width / 2, -height / 2, width / 2, -height / 2 + radius);
    shape.lineTo(width / 2, height / 2 - radius);
    shape.quadraticCurveTo(width / 2, height / 2, width / 2 - radius, height / 2);
    shape.lineTo(-width / 2 + radius, height / 2);
    shape.quadraticCurveTo(-width / 2, height / 2, -width / 2, height / 2 - radius);
    shape.lineTo(-width / 2, -height / 2 + radius);
    shape.quadraticCurveTo(-width / 2, -height / 2, -width / 2 + radius, -height / 2);

    return shape;
  }, []);

  // Create extruded geometry with custom UV mapping
  const geometry = useMemo(() => {
    const extrudeSettings = {
      steps: 1,
      depth: 0.05,
      bevelEnabled: false,
    };
    const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    
    // Custom UV mapping to ensure the texture fills the card
    const positionAttribute = geometry.attributes.position;
    const uvAttribute = geometry.attributes.uv;
    for (let i = 0; i < positionAttribute.count; i++) {
      const x = positionAttribute.getX(i);
      const y = positionAttribute.getY(i);
      uvAttribute.setXY(i, (x + 1.25) / 2.5, (y + 1.75) / 3.5);
    }
    
    return geometry;
  }, [shape]);

  useFrame((state) => {
    if (hovered) {
      meshRef.current.rotation.y = Math.sin(state.clock.getElapsedTime() * 2) * 0.1;
    } else {
      meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, 0, 0.1);
    }

    if (isHolographic && material.uniforms) {
      material.uniforms.time.value = state.clock.getElapsedTime();
      material.uniforms.rotation.value.set(
        meshRef.current.rotation.x,
        meshRef.current.rotation.y,
        meshRef.current.rotation.z
      );
    }
  });

  return (
    <group position={position} rotation={rotation}>
      <mesh
        ref={meshRef}
        geometry={geometry}
        material={material}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      />
      <Text
        position={[0, -1.6, 0.06]}
        fontSize={0.2}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {card.name}
      </Text>
    </group>
  );
};

export default Card;