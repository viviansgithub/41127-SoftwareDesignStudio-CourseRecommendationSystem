'use client';
import React from 'react';
import styles from './InputField.module.scss';
import { BaseInputField } from '../AdminComponents/Interfaces';

interface InputFieldProps extends BaseInputField {}

export function InputField({
  type = 'text',
  label,
  state,
  required = true,
  setState,
  componentType = 'input',
  regex = /.*/,
  options = [],
}: InputFieldProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setState(e.target.value);
  };

  return (
    <div className={styles.inputContainer}>
      {componentType === 'input' ? (
        <>
          <input type={type} pattern={regex.source} value={state} required={required} onChange={handleChange} />
          <label className={state ? styles.filled : ''} htmlFor={type}>
            {label}
          </label>
        </>
      ) : (
        <>
          <select value={state} required={required} onChange={handleChange}>
            <option value="" disabled></option>
            {options.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
          <label className={state ? styles.filled : ''} htmlFor={type}>
            {' '}
            {label}
          </label>
        </>
      )}
    </div>
  );
}
