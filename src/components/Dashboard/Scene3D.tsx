import { Canvas } from '@react-three/fiber';
import { OrbitControls, Sphere, MeshDistortMaterial, Float } from '@react-three/drei';
import { useRef } from 'react';
import * as THREE from 'three';

const AnimatedSphere = ({ position, color, speed }: { position: [number, number, number], color: string, speed: number }) => {
  return (
    <Float speed={speed} rotationIntensity={1} floatIntensity={2}>
      <Sphere args={[1, 64, 64]} position={position}>
        <MeshDistortMaterial
          color={color}
          attach="material"
          distort={0.4}
          speed={2}
          roughness={0.2}
          metalness={0.8}
        />
      </Sphere>
    </Float>
  );
};

export const Scene3D = () => {
  return (
    <div className="fixed inset-0 -z-10 opacity-30 pointer-events-none">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/80 to-background"></div>
      <Canvas camera={{ position: [0, 0, 12], fov: 70 }}>
        <ambientLight intensity={0.4} />
        <directionalLight position={[10, 10, 5]} intensity={0.6} />
        <pointLight position={[-10, -10, -5]} intensity={0.4} color="#ffc0e0" />
        <pointLight position={[10, 10, 5]} intensity={0.4} color="#ffe0f0" />
        
        <AnimatedSphere position={[-6, 3, -8]} color="#f8c8ff" speed={1.2} />
        <AnimatedSphere position={[6, -3, -9]} color="#ffe6f5" speed={1.6} />
        <AnimatedSphere position={[0, 4, -10]} color="#e0d1ff" speed={1.4} />
        <AnimatedSphere position={[-5, -4, -11]} color="#ffddea" speed={1.1} />
        <AnimatedSphere position={[5, 2, -9]} color="#f3e0ff" speed={1.5} />
        
        <OrbitControls 
          enableZoom={false} 
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.3}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 2}
        />
      </Canvas>
    </div>
  );
};
