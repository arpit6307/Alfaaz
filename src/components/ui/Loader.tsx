'use client';

import React from 'react';
import styles from './Loader.module.css';

export interface LoaderProps {
  size?: 'sm' | 'md' | 'lg';
}

const Loader: React.FC<LoaderProps> = ({ size = 'md' }) => {
  return (
    <div className={[styles.loaderWrapper, styles[size]].filter(Boolean).join(' ')}>
      <div className={styles.spinner} />
    </div>
  );
};

export default Loader;
