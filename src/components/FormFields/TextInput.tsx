import React from 'react';
import { TextField } from '../../types'; 
import sharedStyles from '../FormRenderer.module.css'; 

interface TextInputProps {
  field: TextField;
  value: string | undefined; 
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: () => void;
  error?: string;
  isFieldRequired: boolean;
}

const TextInput: React.FC<TextInputProps> = ({ field, value, onChange, error, onBlur, isFieldRequired }) => {
  const inputId = field.name;
  const errorId = `${field.name}-error`;

  return (
    <>
      <label htmlFor={inputId} className={sharedStyles.formLabel}>
        {field.label}
        {isFieldRequired && <span className={sharedStyles.requiredMarker}>*</span>}
      </label>
      <input
        type="text" 
        id={inputId}
        name={field.name}
        value={value || ''}
        onChange={onChange} 
        onBlur={onBlur} 
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

export default TextInput;
