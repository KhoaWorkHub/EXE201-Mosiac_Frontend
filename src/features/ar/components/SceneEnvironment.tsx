import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Environment, AccumulativeShadows, RandomizedLight, ContactShadows, useHelper } from '@react-three/drei';
import { PointLightHelper, DirectionalLightHelper, Color, PointLight, DirectionalLight, Object3D } from 'three';

interface SceneEnvironmentProps {
  environmentPreset?: 'sunset' | 'dawn' | 'night' | 'warehouse' | 'forest' | 'apartment' | 'studio' | 'city' | 'park' | 'lobby';
  intensity?: number;
  ambientIntensity?: number;
  debug?: boolean;
}

/**
 * Enhanced scene environment with realistic lighting and effects
 */
const SceneEnvironment: React.FC<SceneEnvironmentProps> = ({
  environmentPreset = 'sunset',
  intensity = 1,
  ambientIntensity = 0.5,
  debug = false,
}) => {
  // Light refs for debugging helpers
  const pointLightRef = useRef<PointLight>(null);
  const directionalLightRef = useRef<DirectionalLight>(null);
  
  // Always call hooks, but conditionally apply them based on debug mode
  useHelper(debug ? (pointLightRef as React.RefObject<Object3D>) : null, PointLightHelper, 0.5, new Color('#ff0000'));
  useHelper(debug ? (directionalLightRef as React.RefObject<Object3D>) : null, DirectionalLightHelper, 0.5, new Color('#ffffff'));
  
  // Animate the point light for dynamic lighting
  useFrame(({ clock }) => {
    if (pointLightRef.current) {
      const time = clock.getElapsedTime();
      pointLightRef.current.position.x = Math.sin(time * 0.6) * 2;
      pointLightRef.current.position.z = Math.cos(time * 0.6) * 2;
      pointLightRef.current.intensity = 0.5 + Math.sin(time) * 0.3;
    }
  });
  
  return (
    <>
      {/* HDRI Environment for realistic reflections */}
      <Environment 
        preset={environmentPreset} 
        background={false}
        blur={0.8}
      />
      
      {/* Ambient light for base illumination */}
      <ambientLight intensity={ambientIntensity} />
      
      {/* Main directional light (like sun) */}
      <directionalLight
        ref={directionalLightRef}
        position={[5, 5, 5]}
        intensity={intensity * 0.8}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-far={50}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />
      
      {/* Moving point light for dynamic highlights */}
      <pointLight 
        ref={pointLightRef}
        position={[0, 2, 0]} 
        intensity={intensity * 0.6}
        color="#ffeecc"
        castShadow
        shadow-mapSize-width={512}
        shadow-mapSize-height={512}
      />
      
      {/* Back light for rim highlighting */}
      <pointLight
        position={[-5, 3, -5]}
        intensity={intensity * 0.4}
        color="#ccf0ff"
      />
      
      {/* Accumulative shadows for model */}
      <AccumulativeShadows
        temporal
        frames={30}
        color="#000000"
        colorBlend={0.5}
        opacity={0.6}
        scale={10}
        position={[0, -0.01, 0]}
      >
        <RandomizedLight
          amount={4}
          radius={9}
          intensity={0.8}
          ambient={0.3}
          position={[5, 5, -10]}
        />
      </AccumulativeShadows>
      
      {/* Contact shadows for realism */}
      <ContactShadows
        position={[0, -1, 0]}
        opacity={0.5}
        scale={10}
        blur={1}
        far={10}
        resolution={256}
        color="#000000"
      />
    </>
  );
};

export default SceneEnvironment;