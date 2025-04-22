import React, { useState, useCallback, FormEvent } from 'react';
import { FormSchema, FormData, FormErrors, FormField, DateRangeField, SelectField, TextField, NumberField } from '../types';

import TextInput from './FormFields/TextInput';
import NumberInput from './FormFields/NumberInput';
import SelectInput from './FormFields/SelectInput';
import DateRangeInput from './FormFields/DateRangeInput';
import styles from './FormRenderer.module.css';

interface FormRendererProps {
  schema: FormSchema;
  onSubmit: (data: FormData) => void;
  initialData?: FormData;
}

const FormRenderer: React.FC<FormRendererProps> = ({ schema, onSubmit, initialData = {} }) => {
  const [formData, setFormData] = useState<FormData>(() => {
    const initialFormState: FormData = {};
    schema.forEach(field => {
      initialFormState[field.name] = initialData[field.name] ??
        (field.type === 'date_range'
          ? { startDate: undefined, endDate: undefined }
          : undefined);
    });
    return initialFormState;
  });
  const [errors, setErrors] = useState<FormErrors>({});

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const finalValue = type === 'number' ? (value === '' ? undefined : parseFloat(value)) : value;

    setFormData(prevData => ({
      ...prevData,
      [name]: finalValue,
    }));

    if (errors[name]) {
      setErrors(prevErrors => {
        const newErrors = { ...prevErrors };
        delete newErrors[name];
        return newErrors;
      });
    }
  }, [errors]);

  const handleDateRangeChange = useCallback((name: string, value: { startDate?: string; endDate?: string }) => {
    setFormData(prevData => ({
        ...prevData,
        [name]: value,
    }));
    if (errors[name]) {
        setErrors(prevErrors => {
            const newErrors = { ...prevErrors };
            delete newErrors[name];
            return newErrors;
        });
    }
  }, [errors]);


  const validateForm = useCallback((): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;

    schema.forEach(field => {
      const isFieldVisible = field.conditional ? field.conditional(formData) : true;
      if (!isFieldVisible) return;

      const value = formData[field.name];
      const isActuallyRequired = typeof field.required === 'function'
        ? field.required(formData)
        : !!field.required;


      if (isActuallyRequired) {
        if (field.type === 'date_range') {
          const rangeValue = value as { startDate?: string; endDate?: string } | undefined;
          if (!rangeValue?.startDate || !rangeValue?.endDate) {
            newErrors[field.name] = `${field.label} requires both start and end dates.`;
            isValid = false;
          }
        } else {
          if (value === undefined || value === null || value === '') {
            newErrors[field.name] = `${field.label} is required.`;
            isValid = false;
          }
        }
      }


      if (value !== undefined && value !== null && value !== '') {
        switch (field.type) {
            case 'number': {
                const numValue = typeof value === 'string' ? parseFloat(value) : value as number;
                const numField = field as NumberField;
                if (numField.min !== undefined && numValue < numField.min) {
                    newErrors[field.name] = `${field.label} must be at least ${numField.min}.`;
                    isValid = false;
                }
                if (numField.max !== undefined && numValue > numField.max) {
                    newErrors[field.name] = `${field.label} must be no more than ${numField.max}.`;
                    isValid = false;
                }
                break;
            }
            case 'date_range': {
                const rangeValue = value as { startDate?: string; endDate?: string };
                if (rangeValue.startDate && rangeValue.endDate && rangeValue.endDate < rangeValue.startDate) {
                    newErrors[field.name] = 'End date cannot be before start date.';
                    isValid = false;
                }
                break;
            }
            default:
                break;
        }
      }

    });

    setErrors(newErrors);
    return isValid;
  }, [schema, formData]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      const normalizedData: FormData = { ...formData };
      schema.forEach(field => {
        if (field.type === 'text') {
          if (normalizedData[field.name] === undefined) {
            normalizedData[field.name] = '';
          }
        }
      });
      console.log('Form Submitted Successfully:', normalizedData);
      onSubmit(normalizedData);
    } else {
      console.log('Form Validation Failed:', errors);
    }
  };

  const renderFieldComponent = (field: FormField) => {
    const isFieldVisible = field.conditional ? field.conditional(formData) : true;
    if (!isFieldVisible) {
        return null;
    }

    const isFieldRequired = typeof field.required === 'function'
        ? field.required(formData)
        : !!field.required;
    const error = errors[field.name];
    const value = formData[field.name];

    return (
      <div key={field.name} className={styles.formField}>
        {(() => {
          switch (field.type) {
            case 'text':
              return (
                <TextInput
                  key={field.name}
                  field={field as TextField}
                  value={value as string | undefined}
                  onChange={handleChange}
                  error={error}
                  isFieldRequired={isFieldRequired}
                />
              );
            case 'number':
              return (
                <NumberInput
                  key={field.name}
                  field={field as NumberField}
                  value={value as number | string | undefined}
                  onChange={handleChange}
                  error={error}
                  isFieldRequired={isFieldRequired}
                />
              );
            case 'select':
              return (
                <SelectInput
                  key={field.name}
                  field={field as SelectField}
                  value={value as string | number | undefined}
                  onChange={handleChange}
                  error={error}
                  isFieldRequired={isFieldRequired}
                />
              );
            case 'date_range':
              return (
                <DateRangeInput
                  key={field.name}
                  field={field as DateRangeField}
                  value={value as { startDate?: string; endDate?: string } | undefined}
                  onChange={handleDateRangeChange} 
                  error={error}
                  isFieldRequired={isFieldRequired}
                />
              );
            default:
  
              return null;
          }
        })()}
      </div>
    );
  };

  return (
    <form
      className={styles.formContainer}
      onSubmit={handleSubmit}
      noValidate
    >
      {schema.map(field => renderFieldComponent(field))}
      <button
        type="submit"
        className={styles.submitButton} 
      >
        Submit
      </button>
    </form>
  );
};

export default FormRenderer;
