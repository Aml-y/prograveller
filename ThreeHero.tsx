import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Stars, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';

const FloatingGrid = () => {
  const gridRef = useRef<THREE.Group>(null);
  
  useFrame((state, delta) => {
    if (gridRef.current) {
      // Endless scroll effect
      gridRef.current.position.z = (state.clock.elapsedTime * 2) % 10;
    }
  });

  return (
    <group rotation={[Math.PI / 2, 0, 0]} position={[0, -5, 0]}>
      <group ref={gridRef}>
        <gridHelper args={[60, 60, 0xff00ff, 0x2e0249]} position={[0, 0, 0]} />
        <gridHelper args={[60, 60, 0xff00ff, 0x2e0249]} position={[0, -10, 0]} />
      </group>
    </group>
  );
};

const GeometricShape = ({ position, color, type }: { position: [number, number, number], color: string, type: 'box' | 'oct' }) => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.2;
      meshRef.current.rotation.y += delta * 0.3;
    }
  });

  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={1}>
      <mesh ref={meshRef} position={position}>
        {type === 'box' ? <boxGeometry args={[1, 1, 1]} /> : <octahedronGeometry args={[1, 0]} />}
        <meshStandardMaterial 
          color={color} 
          emissive={color}
          emissiveIntensity={1.5}
          wireframe
        />
      </mesh>
    </Float>
  );
};

const ThreeHero: React.FC = () => {
  return (
    <div className="absolute inset-0 z-0 bg-[#050011]">
      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 1, 10]} />
        <fog attach="fog" args={['#050011', 5, 30]} />
        
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#00f3ff" />
        <pointLight position={[-10, -10, -10]} intensity={1} color="#ff00ff" />

        <Stars radius={100} depth={50} count={3000} factor={4} saturation={1} fade speed={1} />
        
        <FloatingGrid />
        
        <GeometricShape position={[-6, 2, -2]} color="#00f3ff" type="oct" />
        <GeometricShape position={[6, -1, -3]} color="#ff00ff" type="box" />
        <GeometricShape position={[0, 4, -8]} color="#ffffff" type="oct" />
        <GeometricShape position={[-3, -3, -5]} color="#ff00ff" type="box" />
        <GeometricShape position={[4, 3, -6]} color="#00f3ff" type="oct" />

      </Canvas>
      
      {/* Overlay Gradient for smooth blending with content */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#050011] via-transparent to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 pointer-events-none mix-blend-overlay"></div>
    </div>
  );
};

export default ThreeHero;