import React from 'react';
import { NumberField } from '../../types';
import sharedStyles from '../FormRenderer.module.css';

interface NumberInputProps {
  field: NumberField;
  value: number | string | undefined;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: () => void;
  error?: string;
  isFieldRequired: boolean;
}

const NumberInput: React.FC<NumberInputProps> = ({ field, value, onChange, error, onBlur, isFieldRequired }) => {
  const inputId = field.name;
  const errorId = `${field.name}-error`;

  return (
    <>
      <label htmlFor={inputId} className={sharedStyles.formLabel}>
        {field.label}
        {isFieldRequired && <span className={sharedStyles.requiredMarker}>*</span>}
      </label>
      <input
        type="number"
        id={inputId}
        name={field.name}
        value={value === undefined || value === null ? '' : value}
        onChange={onChange}
        onBlur={onBlur}
        min={field.min}
        max={field.max}
        step={field.step || 'any'}
        required={isFieldRequired}
        aria-required={isFieldRequired}
        aria-invalid={!!error}
        aria-describedby={error ? errorId : undefined}
        className={`${sharedStyles.formInput} ${error ? sharedStyles.inputError : ''}`}
      />
      {error && <span id={errorId} className={sharedStyles.errorMessage} role="alert">{error}</span>}
    </>
  );
};

export default NumberInput;
