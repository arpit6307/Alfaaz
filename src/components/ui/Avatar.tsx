'use client';

import React from 'react';
import styles from './Avatar.module.css';

export interface AvatarProps {
  src?: string;
  alt?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  fallback?: string;
}

const Avatar: React.FC<AvatarProps> = ({ src, alt = 'Avatar', size = 'md', className, fallback }) => {
  const classNames = [
    styles.avatar,
    styles[size],
    className || ''
  ].filter(Boolean).join(' ');

  if (src) {
    return (
      <img src={src} alt={alt} className={classNames} />
    );
  }

  return (
    <div className={[classNames, styles.fallbackContainer].filter(Boolean).join(' ')}>
      {fallback ? fallback.slice(0, 2).toUpperCase() : '?'}
    </div>
  );
};

export default Avatar;
