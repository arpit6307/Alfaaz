'use client';

import React, { useRef, useState, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import WaxSeal from './WaxSeal';
import QuillNib from './QuillNib';
import Petals from './Petals';
import GoldDust from './GoldDust';

interface HeroSceneProps {
  mouse: { x: number; y: number };
  scrollY: number;
  isMobile: boolean;
  reducedMotion: boolean;
}

export default function HeroScene({ mouse, scrollY, isMobile, reducedMotion }: HeroSceneProps) {
  const { camera } = useThree();
  const pointLightRef = useRef<THREE.PointLight>(null);

  // Responsive camera positioning
  useEffect(() => {
    camera.position.set(0, 0, isMobile ? 6.2 : 5.2);
  }, [camera, isMobile]);

  useFrame((state, delta) => {
    if (reducedMotion) return;

    // Candle-lit gentle flicker on the key point light
    if (pointLightRef.current) {
      const flicker = Math.sin(state.clock.elapsedTime * 6.5) * 0.08 + Math.cos(state.clock.elapsedTime * 11.2) * 0.05;
      pointLightRef.current.intensity = 2.4 + flicker;
    }

    // Subtle camera parallax tilt
    const targetCamX = mouse.x * (isMobile ? 0.2 : 0.45);
    const targetCamY = mouse.y * (isMobile ? 0.15 : 0.35);
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, targetCamX, delta * 2.5);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetCamY, delta * 2.5);
    camera.lookAt(0, 0, 0);
  });

  return (
    <>
      {/* 1. CINEMATIC LIGHTING */}
      {/* Soft warm ambient light */}
      <ambientLight color="#FFF3DC" intensity={0.85} />

      {/* Primary Key light — warm royal candlelight */}
      <pointLight
        ref={pointLightRef}
        position={[2.5, 3.5, 4]}
        color="#FFDA89"
        intensity={2.4}
        distance={20}
        decay={2}
      />

      {/* Directional sunlight for clean rim highlights on the seal */}
      <directionalLight position={[-4, 4, 3]} color="#FFF8E7" intensity={1.2} />

      {/* Romantic Rose rim light from below-left */}
      <pointLight position={[-3, -2.5, 2]} color="#E8386D" intensity={1.8} distance={15} />

      {/* Royal Purple backlight for deep contrast */}
      <pointLight position={[0, -1, -3]} color="#3A1C71" intensity={2.2} distance={18} />

      {/* 2. 3D ELEMENTS */}
      {/* Central Rotating Wax Seal */}
      <WaxSeal mouse={mouse} scrollY={scrollY} />

      {/* Floating Calligraphy Quill Nib */}
      <QuillNib mouse={mouse} />

      {/* Instanced Rose Petals */}
      <Petals isMobile={isMobile} />

      {/* Sparkling Gold Dust */}
      <GoldDust isMobile={isMobile} />
    </>
  );
}
