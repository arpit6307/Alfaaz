'use client';

import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface PetalsProps {
  count?: number;
  isMobile?: boolean;
}

export default function Petals({ count, isMobile = false }: PetalsProps) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const actualCount = count ?? (isMobile ? 45 : 140);

  // Curved rose petal geometry
  const petalGeometry = useMemo(() => {
    // Generate an organic curved petal using parametric or lathe/plane with curve
    const geom = new THREE.PlaneGeometry(0.32, 0.45, 4, 4);
    const pos = geom.attributes.position;
    // Curve the vertices slightly along Z for cup/spoon shape
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      const distFromCenter = Math.sqrt(x * x + y * y);
      pos.setZ(i, Math.sin(distFromCenter * 5) * 0.06);
    }
    geom.computeVertexNormals();
    return geom;
  }, []);

  // Per-instance physics data
  const particles = useMemo(() => {
    const data = [];
    for (let i = 0; i < actualCount; i++) {
      data.push({
        x: (Math.random() - 0.5) * 16,
        y: Math.random() * 14 - 7,
        z: (Math.random() - 0.5) * 10 - 1,
        speedY: 0.8 + Math.random() * 0.9,
        driftSpeedX: (Math.random() - 0.5) * 0.5,
        driftPhase: Math.random() * Math.PI * 2,
        rotSpeedX: (Math.random() - 0.5) * 1.8,
        rotSpeedY: (Math.random() - 0.5) * 2.2,
        rotSpeedZ: (Math.random() - 0.5) * 1.5,
        rotX: Math.random() * Math.PI * 2,
        rotY: Math.random() * Math.PI * 2,
        rotZ: Math.random() * Math.PI * 2,
        scale: 0.75 + Math.random() * 0.65,
      });
    }
    return data;
  }, [actualCount]);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  // Set initial colors across rose and deep velvet red tints
  useEffect(() => {
    if (!meshRef.current) return;
    const color = new THREE.Color();
    const colors = ['#E8386D', '#F43F5E', '#C026D3', '#DB2777', '#9D174D', '#FDA4AF'];

    for (let i = 0; i < actualCount; i++) {
      const c = colors[i % colors.length];
      color.set(c);
      meshRef.current.setColorAt(i, color);
    }
    meshRef.current.instanceColor!.needsUpdate = true;
  }, [actualCount]);

  useFrame((state, delta) => {
    if (!meshRef.current) return;
    const time = state.clock.elapsedTime;

    for (let i = 0; i < actualCount; i++) {
      const p = particles[i];

      // Fall downwards
      p.y -= p.speedY * delta;

      // Gentle swaying lateral drift
      p.x += Math.sin(time * 1.2 + p.driftPhase) * 0.012 + p.driftSpeedX * delta * 0.4;

      // Continuous tumbling
      p.rotX += p.rotSpeedX * delta;
      p.rotY += p.rotSpeedY * delta;
      p.rotZ += p.rotSpeedZ * delta;

      // Wrap around when falling below viewport
      if (p.y < -7) {
        p.y = 7 + Math.random() * 2;
        p.x = (Math.random() - 0.5) * 16;
        p.z = (Math.random() - 0.5) * 10 - 1;
      }

      dummy.position.set(p.x, p.y, p.z);
      dummy.rotation.set(p.rotX, p.rotY, p.rotZ);
      dummy.scale.set(p.scale, p.scale, p.scale);
      dummy.updateMatrix();

      meshRef.current.setMatrixAt(i, dummy.matrix);
    }

    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh
      ref={meshRef}
      args={[petalGeometry, undefined, actualCount]}
      frustumCulled={false}
    >
      <meshStandardMaterial
        color="#E8386D"
        roughness={0.65}
        metalness={0.1}
        side={THREE.DoubleSide}
        transparent={true}
        opacity={0.82}
      />
    </instancedMesh>
  );
}
