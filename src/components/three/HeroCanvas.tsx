'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import HeroScene from './HeroScene';
import HeroFallback from './HeroFallback';
import styles from './HeroCanvas.module.css';

export default function HeroCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [scrollY, setScrollY] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [useFallback, setUseFallback] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // 1. Check prefers-reduced-motion
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(motionQuery.matches);
    const motionHandler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    motionQuery.addEventListener('change', motionHandler);

    // 2. Check mobile screen width
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile, { passive: true });

    // 3. Check WebGL Capability & Low-end Device Guard
    try {
      const testCanvas = document.createElement('canvas');
      const gl = testCanvas.getContext('webgl2') || testCanvas.getContext('webgl');
      if (!gl) {
        setUseFallback(true);
        return;
      }

      // Check device memory / CPU concurrency if available
      const nav = navigator as any;
      const memory = nav.deviceMemory;
      const cores = nav.hardwareConcurrency;
      if ((memory && memory <= 2) || (cores && cores <= 2)) {
        // Low-end device fallback for buttery smooth UX
        setUseFallback(true);
        return;
      }
    } catch {
      setUseFallback(true);
      return;
    }

    // 4. Mouse movement tracking for parallax
    const handleMouseMove = (e: MouseEvent) => {
      const normalizedX = (e.clientX / window.innerWidth) * 2 - 1;
      const normalizedY = -(e.clientY / window.innerHeight) * 2 + 1;
      setMouse({ x: normalizedX, y: normalizedY });
    };

    // 5. Scroll tracking for scroll-linked seal animation
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });

    // 6. IntersectionObserver to pause WebGL rendering when hero is out of view
    let observer: IntersectionObserver | null = null;
    if (containerRef.current) {
      observer = new IntersectionObserver(
        ([entry]) => {
          setIsVisible(entry.isIntersecting);
        },
        { threshold: 0.05 }
      );
      observer.observe(containerRef.current);
    }

    return () => {
      motionQuery.removeEventListener('change', motionHandler);
      window.removeEventListener('resize', checkMobile);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      if (observer) observer.disconnect();
    };
  }, []);

  if (!mounted) {
    return <HeroFallback />;
  }

  if (useFallback) {
    return <HeroFallback />;
  }

  return (
    <div ref={containerRef} className={styles.canvasContainer} aria-hidden="true">
      {isVisible && (
        <Canvas
          camera={{ position: [0, 0, isMobile ? 6.2 : 5.2], fov: 45 }}
          dpr={[1, 2]}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: 'high-performance',
          }}
          className={styles.webglCanvas}
        >
          <Suspense fallback={null}>
            <HeroScene
              mouse={mouse}
              scrollY={scrollY}
              isMobile={isMobile}
              reducedMotion={reducedMotion}
            />
          </Suspense>
        </Canvas>
      )}
    </div>
  );
}
