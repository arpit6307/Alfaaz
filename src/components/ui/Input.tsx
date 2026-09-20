'use client';

import React from 'react';
import styles from './Input.module.css';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  icon,
  className,
  ...props
}, ref) => {
  const wrapperClass = [styles.wrapper, className || ''].filter(Boolean).join(' ');
  const inputClass = [styles.input, error ? styles.inputError : '', icon ? styles.withIcon : ''].filter(Boolean).join(' ');

  return (
    <div className={wrapperClass}>
      {label && <label className={styles.label}>{label} {props.required && <span className={styles.required}>*</span>}</label>}
      <div className={styles.inputContainer}>
        {icon && <span className={styles.icon}>{icon}</span>}
        <input ref={ref} className={inputClass} {...props} />
      </div>
      {error && <span className={styles.errorMessage}>{error}</span>}
    </div>
  );
});

Input.displayName = 'Input';
export default Input;
