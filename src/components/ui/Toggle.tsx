'use client';

import React from 'react';
import styles from './Toggle.module.css';

export interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  className?: string;
}

const Toggle: React.FC<ToggleProps> = ({ checked, onChange, label, disabled = false, className }) => {
  return (
    <label className={[styles.wrapper, disabled ? styles.disabled : '', className || ''].filter(Boolean).join(' ')}>
      <div className={styles.toggleContainer}>
        <input
          type="checkbox"
          className={styles.input}
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          disabled={disabled}
        />
        <div className={[styles.track, checked ? styles.checkedTrack : ''].filter(Boolean).join(' ')}>
          <div className={[styles.thumb, checked ? styles.checkedThumb : ''].filter(Boolean).join(' ')} />
        </div>
      </div>
      {label && <span className={styles.label}>{label}</span>}
    </label>
  );
};

export default Toggle;
