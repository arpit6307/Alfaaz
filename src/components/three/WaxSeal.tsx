'use client';

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface WaxSealProps {
  mouse: { x: number; y: number };
  scrollY: number;
}

export default function WaxSeal({ mouse, scrollY }: WaxSealProps) {
  const groupRef = useRef<THREE.Group>(null);
  const sealMeshRef = useRef<THREE.Mesh>(null);

  // Generate a procedural canvas texture for the embossed seal monogram
  const sealTexture = useMemo(() => {
    if (typeof window === 'undefined') return null;

    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    // 1. Base Maroon fill
    ctx.fillStyle = '#5A0F2E';
    ctx.fillRect(0, 0, 1024, 1024);

    // 2. Concentric ornate circular rings
    ctx.strokeStyle = '#D9A93B';
    ctx.lineWidth = 14;
    ctx.beginPath();
    ctx.arc(512, 512, 450, 0, Math.PI * 2);
    ctx.stroke();

    ctx.lineWidth = 6;
    ctx.setLineDash([20, 14]);
    ctx.beginPath();
    ctx.arc(512, 512, 415, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);

    // 3. Inner royal circle
    ctx.fillStyle = '#420820';
    ctx.beginPath();
    ctx.arc(512, 512, 380, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#B38018';
    ctx.lineWidth = 8;
    ctx.stroke();

    // 4. Star ornaments at 8 angles around the rim
    for (let i = 0; i < 8; i++) {
      const angle = (i * Math.PI) / 4;
      const x = 512 + Math.cos(angle) * 415;
      const y = 512 + Math.sin(angle) * 415;
      ctx.fillStyle = '#D9A93B';
      ctx.beginPath();
      ctx.arc(x, y, 9, 0, Math.PI * 2);
      ctx.fill();
    }

    // 5. Stylized Devanagari Monogram 'अ' (Alfaaz) in rich Gold
    ctx.fillStyle = '#D9A93B';
    ctx.shadowColor = '#140F14';
    ctx.shadowBlur = 12;
    ctx.shadowOffsetX = 6;
    ctx.shadowOffsetY = 8;

    // Top Shirorekha
    ctx.fillRect(360, 310, 310, 42);

    // Vertical spine
    ctx.fillRect(570, 310, 48, 410);

    // Connecting arm
    ctx.fillRect(430, 500, 150, 42);

    // Upper curve of 'अ'
    ctx.lineWidth = 42;
    ctx.strokeStyle = '#D9A93B';
    ctx.beginPath();
    ctx.arc(430, 415, 90, Math.PI * 0.75, Math.PI * 1.85, false);
    ctx.stroke();

    // Lower sweeping curve of 'अ'
    ctx.beginPath();
    ctx.arc(430, 580, 110, Math.PI * 1.15, Math.PI * 0.35, true);
    ctx.stroke();

    // Outer subtle calligraphic flourish
    ctx.fillStyle = '#E8386D';
    ctx.beginPath();
    ctx.arc(670, 330, 12, 0, Math.PI * 2);
    ctx.fill();

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.generateMipmaps = true;
    texture.minFilter = THREE.LinearMipmapLinearFilter;
    return texture;
  }, []);

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    // Smooth idle rotation on Y axis
    groupRef.current.rotation.y += delta * 0.45;

    // Mouse parallax tilt (smooth lerp)
    const targetRotX = mouse.y * 0.25 - scrollY * 0.0008;
    const targetRotZ = -mouse.x * 0.25;

    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetRotX, delta * 3.5);
    groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, targetRotZ, delta * 3.5);

    // Gentle floating bob
    groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 1.5) * 0.12;

    // Scroll linked scale reduction as user scrolls down
    const scaleFactor = Math.max(0.75, 1 - scrollY * 0.0006);
    groupRef.current.scale.set(scaleFactor, scaleFactor, scaleFactor);
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Outer scalloped organic wax rim */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[1.75, 1.8, 0.2, 64]} />
        <meshPhysicalMaterial
          color="#5A0F2E"
          emissive="#240410"
          roughness={0.25}
          metalness={0.4}
          clearcoat={0.65}
          clearcoatRoughness={0.15}
        />
      </mesh>

      {/* Decorative Gold Rim Ring */}
      <mesh position={[0, 0.11, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.65, 0.09, 20, 64]} />
        <meshStandardMaterial
          color="#D9A93B"
          roughness={0.28}
          metalness={0.88}
        />
      </mesh>

      {/* Inner Gold Beaded Ring */}
      <mesh position={[0, 0.11, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.42, 0.045, 16, 48]} />
        <meshStandardMaterial
          color="#B38018"
          roughness={0.35}
          metalness={0.8}
        />
      </mesh>

      {/* Central Embossed Face with Alfaaz Monogram */}
      {sealTexture && (
        <mesh ref={sealMeshRef} position={[0, 0.11, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[1.4, 64]} />
          <meshPhysicalMaterial
            map={sealTexture}
            roughness={0.22}
            metalness={0.5}
            clearcoat={0.8}
            clearcoatRoughness={0.12}
          />
        </mesh>
      )}

      {/* Backside seal wax face */}
      <mesh position={[0, -0.11, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <circleGeometry args={[1.75, 48]} />
        <meshStandardMaterial
          color="#420620"
          roughness={0.5}
          metalness={0.2}
        />
      </mesh>
    </group>
  );
}
