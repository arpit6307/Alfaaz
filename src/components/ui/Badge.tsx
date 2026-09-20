'use client';

import React from 'react';
import styles from './Badge.module.css';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'gold' | 'maroon' | 'rose' | 'royal' | 'blush';
  className?: string;
}

const Badge: React.FC<BadgeProps> = ({ children, variant = 'gold', className }) => {
  const classNames = [
    styles.badge,
    styles[variant],
    className || ''
  ].filter(Boolean).join(' ');

  return <span className={classNames}>{children}</span>;
};

export default Badge;
