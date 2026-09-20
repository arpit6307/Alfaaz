'use client';

import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface GoldDustProps {
  count?: number;
  isMobile?: boolean;
}

export default function GoldDust({ count, isMobile = false }: GoldDustProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const actualCount = count ?? (isMobile ? 100 : 380);

  // Generate random 3D particle positions & velocities
  const [positions, velocities, phases] = useMemo(() => {
    const pos = new Float32Array(actualCount * 3);
    const vel = new Float32Array(actualCount * 3);
    const ph = new Float32Array(actualCount);

    for (let i = 0; i < actualCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 18;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 14;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 12;

      vel[i * 3] = (Math.random() - 0.5) * 0.15;
      vel[i * 3 + 1] = 0.08 + Math.random() * 0.22; // gentle upward/slow floating drift
      vel[i * 3 + 2] = (Math.random() - 0.5) * 0.15;

      ph[i] = Math.random() * Math.PI * 2;
    }

    return [pos, vel, ph];
  }, [actualCount]);

  useFrame((state, delta) => {
    if (!pointsRef.current) return;
    const posAttr = pointsRef.current.geometry.attributes.position as THREE.BufferAttribute;
    const array = posAttr.array as Float32Array;
    const time = state.clock.elapsedTime;

    for (let i = 0; i < actualCount; i++) {
      const idx = i * 3;
      
      // Floating motion
      array[idx] += velocities[idx] * delta + Math.sin(time * 0.8 + phases[i]) * 0.003;
      array[idx + 1] += velocities[idx + 1] * delta;
      array[idx + 2] += velocities[idx + 2] * delta;

      // Wrap around vertically
      if (array[idx + 1] > 7) {
        array[idx + 1] = -7;
        array[idx] = (Math.random() - 0.5) * 18;
      }
    }

    posAttr.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#D9A93B"
        size={isMobile ? 0.06 : 0.08}
        transparent={true}
        opacity={0.78}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}
