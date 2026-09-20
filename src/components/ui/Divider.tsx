'use client';

import React from 'react';
import styles from './Divider.module.css';

export interface DividerProps {
  color?: string;
  className?: string;
}

const Divider: React.FC<DividerProps> = ({ color = 'var(--gold, #D9A93B)', className }) => {
  return (
    <div className={[styles.divider, className || ''].filter(Boolean).join(' ')} aria-hidden="true">
      <svg
        width="100%"
        height="20"
        viewBox="0 0 100 20"
        preserveAspectRatio="none"
        style={{ fill: color }}
      >
        <pattern
          id="jaali"
          x="0"
          y="0"
          width="20"
          height="20"
          patternUnits="userSpaceOnUse"
        >
          <path d="M10,0 L20,10 L10,20 L0,10 Z M10,4 L16,10 L10,16 L4,10 Z" />
        </pattern>
        <rect x="0" y="0" width="100%" height="20" fill="url(#jaali)" />
      </svg>
    </div>
  );
};

export default Divider;
