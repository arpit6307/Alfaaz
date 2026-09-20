'use client';

import React from 'react';
import styles from './Card.module.css';

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
  padding?: 'sm' | 'md' | 'lg' | 'none';
}

const Card: React.FC<CardProps> = ({ children, className, hoverable = false, padding = 'md' }) => {
  const classNames = [
    styles.card,
    styles[`padding-${padding}`],
    hoverable ? styles.hoverable : '',
    className || ''
  ].filter(Boolean).join(' ');

  return <div className={classNames}>{children}</div>;
};

export default Card;
