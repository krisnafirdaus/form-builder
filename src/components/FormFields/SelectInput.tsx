import React from 'react';
import { SelectField, SelectOption } from '../../types';
import sharedStyles from '../FormRenderer.module.css';

interface SelectInputProps {
  field: SelectField;
  value: string | number | undefined;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onBlur?: () => void;
  error?: string;
  isFieldRequired: boolean;
}

const SelectInput: React.FC<SelectInputProps> = ({ field, value, onChange, onBlur, error, isFieldRequired }) => {
  const inputId = field.name;
  const errorId = `${field.name}-error`;

  return (
    <>
      <label htmlFor={inputId} className={sharedStyles.formLabel}>
        {field.label}
        {isFieldRequired && <span className={sharedStyles.requiredMarker}>*</span>}
      </label>
      <select
        id={inputId}
        name={field.name}
        value={value || ''}
        onChange={onChange}
        onBlur={onBlur}
        required={isFieldRequired}
        aria-required={isFieldRequired}
        aria-invalid={!!error}
        aria-describedby={error ? errorId : undefined}
        className={`${sharedStyles.formSelect} ${error ? sharedStyles.inputError : ''}`}
      >
        {(!isFieldRequired || value === undefined || value === '') && (
          <option value="" disabled hidden>Select {field.label}...</option>
        )}
        {field.options.map((option: SelectOption) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <span id={errorId} className={sharedStyles.errorMessage} role="alert">{error}</span>}
    </>
  );
};

export default SelectInput;
