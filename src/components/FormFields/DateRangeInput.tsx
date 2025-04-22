import React from 'react';
import { DateRangeField } from '../../types';
import styles from './DateRangeInput.module.css'; 
import sharedStyles from '../FormRenderer.module.css';

interface DateRangeInputProps {
  field: DateRangeField;
  value: { startDate?: string; endDate?: string } | undefined; 
  onChange: (name: string, value: { startDate?: string; endDate?: string }) => void;
  onBlur?: () => void;
  error?: string;
  isFieldRequired: boolean; 
}

const DateRangeInput: React.FC<DateRangeInputProps> = ({ field, value, onChange, onBlur, error, isFieldRequired }) => {
  const startInputId = `${field.name}-start`;
  const endInputId = `${field.name}-end`;
  const errorId = `${field.name}-error`;

  const isRequired = isFieldRequired;

  const handleDateChange = (subFieldName: 'startDate' | 'endDate', dateValue: string) => {
    const currentStartDate = value?.startDate || '';
    const currentEndDate = value?.endDate || '';
    const newValue = {
        startDate: subFieldName === 'startDate' ? dateValue : currentStartDate,
        endDate: subFieldName === 'endDate' ? dateValue : currentEndDate,
    };
    onChange(field.name, newValue);
  };

  const startDateValue = value?.startDate || '';
  const endDateValue = value?.endDate || '';

  return (
    <>
      <label className={styles.dateRangeLabel}> 
        {field.label}
        {isRequired && <span className={sharedStyles.requiredMarker}>*</span>} 
      </label>
      <div className={styles.dateRangeInputs}> 
        <div className={styles.dateInputGroup}>
          <label htmlFor={startInputId}>Start Date</label>
          <input
            type="date"
            id={startInputId}
            name={startInputId} 
            value={startDateValue}
            onChange={(e) => handleDateChange('startDate', e.target.value)}
            onBlur={onBlur} 
            required={isRequired} 
            aria-required={isRequired}
            aria-describedby={error ? errorId : undefined}
            className={`${styles.dateInput} ${error ? styles.inputError : ''}`}
          />
        </div>

        {/* End Date Input Group */} 
        <div className={styles.dateInputGroup}>
          <label htmlFor={endInputId}>End Date</label>
          <input
            type="date"
            id={endInputId}
            name={endInputId} 
            value={endDateValue}
            onChange={(e) => handleDateChange('endDate', e.target.value)}
            onBlur={onBlur}
            required={isRequired}
            aria-required={isRequired}
            aria-describedby={error ? errorId : undefined}
            className={`${styles.dateInput} ${error ? styles.inputError : ''}`} 
            min={startDateValue || undefined} 
          />
        </div>
      </div>
      {error && <span id={errorId} className={styles.errorMessage} role="alert">{error}</span>} 
    </>
  );
};

export default DateRangeInput;
