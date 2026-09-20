'use client';

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface QuillNibProps {
  mouse: { x: number; y: number };
}

export default function QuillNib({ mouse }: QuillNibProps) {
  const nibRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (!nibRef.current) return;

    // Gentle orbital float alongside the wax seal
    const t = state.clock.elapsedTime;
    const baseAngle = t * 0.4;
    
    // Position offset in an elliptical orbit around the seal
    const targetX = 2.4 + Math.sin(baseAngle) * 0.35 + mouse.x * 0.3;
    const targetY = 0.5 + Math.cos(t * 1.8) * 0.18 + mouse.y * 0.25;
    const targetZ = 0.4 + Math.cos(baseAngle) * 0.35;

    nibRef.current.position.x = THREE.MathUtils.lerp(nibRef.current.position.x, targetX, delta * 3);
    nibRef.current.position.y = THREE.MathUtils.lerp(nibRef.current.position.y, targetY, delta * 3);
    nibRef.current.position.z = THREE.MathUtils.lerp(nibRef.current.position.z, targetZ, delta * 3);

    // Calligraphic writing tilt
    nibRef.current.rotation.z = -0.65 + Math.sin(t * 1.2) * 0.08;
    nibRef.current.rotation.x = 0.25 + Math.cos(t * 1.5) * 0.06;
    nibRef.current.rotation.y = t * 0.35;
  });

  return (
    <group ref={nibRef} position={[2.4, 0.5, 0.4]} scale={[0.85, 0.85, 0.85]}>
      {/* Upper gold barrel of the nib */}
      <mesh position={[0, 0.8, 0]}>
        <cylinderGeometry args={[0.22, 0.28, 0.9, 16]} />
        <meshStandardMaterial
          color="#D9A93B"
          metalness={0.92}
          roughness={0.22}
        />
      </mesh>

      {/* Decorative Ink Ring */}
      <mesh position={[0, 0.36, 0]}>
        <cylinderGeometry args={[0.29, 0.29, 0.08, 16]} />
        <meshStandardMaterial
          color="#140F14"
          metalness={0.4}
          roughness={0.3}
        />
      </mesh>

      {/* Tapered triangular nib body */}
      <mesh position={[0, -0.2, 0]} rotation={[0, 0, 0]}>
        <coneGeometry args={[0.3, 1.1, 4]} />
        <meshStandardMaterial
          color="#F2D06B"
          metalness={0.95}
          roughness={0.18}
        />
      </mesh>

      {/* Breather hole (small sphere cut-out look) */}
      <mesh position={[0, 0.05, 0.12]}>
        <sphereGeometry args={[0.055, 12, 12]} />
        <meshBasicMaterial color="#140F14" />
      </mesh>

      {/* Ink slit down the center of the nib */}
      <mesh position={[0, -0.3, 0.13]}>
        <boxGeometry args={[0.015, 0.65, 0.02]} />
        <meshBasicMaterial color="#140F14" />
      </mesh>
    </group>
  );
}
