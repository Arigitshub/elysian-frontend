'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment, ContactShadows } from '@react-three/drei';
import { Suspense } from 'react';

import { useFrame } from '@react-three/fiber';
import { useRef, useMemo } from 'react';
import * as THREE from 'three';

function Character() {
  const group = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Mesh>(null);
  
  // Procedural idle state
  const state = useMemo(() => ({
    blink: 0,
    blinkTimer: 0,
    breathing: 0,
  }), []);

  useFrame((state_r3f) => {
    const t = state_r3f.clock.getElapsedTime();

    // Breathing (6bpm = 0.1Hz)
    const breathingScale = 1 + Math.sin(t * 0.6) * 0.01;
    if (group.current) {
      group.current.scale.set(breathingScale, breathingScale, breathingScale);
    }

    // Blink logic
    state.blinkTimer -= 0.01;
    if (state.blinkTimer <= 0) {
      state.blink = 1;
      if (state.blinkTimer <= -0.1) {
        state.blink = 0;
        state.blinkTimer = Math.random() * 5 + 2;
      }
    }

    // Subtle head movement tracking mouse
    if (headRef.current) {
      const targetRotationX = (state_r3f.mouse.y * 0.1);
      const targetRotationY = (state_r3f.mouse.x * 0.2);
      headRef.current.rotation.x = THREE.MathUtils.lerp(headRef.current.rotation.x, targetRotationX, 0.05);
      headRef.current.rotation.y = THREE.MathUtils.lerp(headRef.current.rotation.y, targetRotationY, 0.05);
    }
  });

  return (
    <group ref={group} position={[0, -1, 0]}>
      {/* Body */}
      <mesh castShadow receiveShadow>
        <capsuleGeometry args={[0.4, 1.5, 4, 16]} />
        <meshStandardMaterial color="#1a1a20" roughness={0.8} />
      </mesh>
      
      {/* Head */}
      <group ref={headRef} position={[0, 1.1, 0]}>
        <mesh castShadow>
          <sphereGeometry args={[0.25, 32, 32]} />
          <meshStandardMaterial color="#d4b483" roughness={0.4} />
        </mesh>
        
        {/* Eyes (Simple indicators for now) */}
        <group position={[0, 0, 0.2]}>
          <mesh position={[-0.08, 0.05, 0]}>
            <sphereGeometry args={[0.02, 16, 16]} />
            <meshStandardMaterial color="#000" />
          </mesh>
          <mesh position={[0.08, 0.05, 0]}>
            <sphereGeometry args={[0.02, 16, 16]} />
            <meshStandardMaterial color="#000" />
          </mesh>
        </group>
      </group>
    </group>
  );
}

export default function TherapistCanvas() {
  return (
    <div className="w-full h-full bg-[#020205]">
      <Canvas shadows camera={{ position: [0, 0.5, 3], fov: 40 }}>
        <Suspense fallback={null}>
          <OrbitControls 
            enablePan={false} 
            enableZoom={false} 
            minPolarAngle={Math.PI / 2.5} 
            maxPolarAngle={Math.PI / 2} 
          />
          
          <ambientLight intensity={0.2} />
          <spotLight position={[5, 5, 5]} angle={0.3} penumbra={1} intensity={2} castShadow color="#fff" />
          <pointLight position={[-5, 2, -5]} intensity={1} color="#4c1d95" />
          <pointLight position={[0, 5, 0]} intensity={0.5} color="#efd36d" />
          
          <Character />
          
          <ContactShadows 
            position={[0, -1.01, 0]} 
            opacity={0.6} 
            scale={10} 
            blur={3} 
            far={1.5} 
          />
          <Environment preset="night" />
        </Suspense>
      </Canvas>
    </div>
  );
}
