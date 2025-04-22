import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SelectInput from './SelectInput';
import { SelectField } from '../../types';

const findSelectByLabelText = (text: string | RegExp) => {
  return screen.getByRole('combobox', {
    name: (accessibleName) => {
      const nameToCheck = typeof text === 'string' ? text : text.source;
      return accessibleName.startsWith(nameToCheck);
    }
  });
};

const mockOptions = [
  { value: 'opt1', label: 'Option 1' },
  { value: 'opt2', label: 'Option 2' },
  { value: 'opt3', label: 'Option 3' },
];

const mockField: SelectField = {
  type: 'select',
  name: 'testSelect',
  label: 'Test Select',
  options: mockOptions,
};

const getPlaceholderText = (label: string) => `Select ${label}...`;

describe('SelectInput Component', () => {
  it('renders correctly with label, select, and options', () => {
    render(
      <SelectInput
        field={mockField}
        value=""
        onChange={() => {}}
        isFieldRequired={false}
      />
    );

    expect(screen.getByLabelText('Test Select')).toBeInTheDocument();
    const select = findSelectByLabelText('Test Select');
    expect(select).toBeInTheDocument();

    expect(screen.getByText(new RegExp(getPlaceholderText(mockField.label), 'i'))).toBeInTheDocument();
    expect(screen.getByText(new RegExp(getPlaceholderText(mockField.label), 'i'))).toBeDisabled(); 

    mockOptions.forEach(option => {
      expect(screen.getByRole('option', { name: option.label })).toBeInTheDocument();
    });
  });

  it('calls onChange handler when an option is selected', async () => {
    let currentValue = ''; 
    const handleChange = vi.fn((e: React.ChangeEvent<HTMLSelectElement>) => {
      currentValue = e.target.value; 
    });

    const { rerender } = render(
      <SelectInput
        field={mockField}
        value={currentValue} 
        onChange={handleChange}
        isFieldRequired={false}
      />
    );

    const select = findSelectByLabelText('Test Select');
    await userEvent.selectOptions(select, 'opt2');

    expect(handleChange).toHaveBeenCalled();
    expect(currentValue).toBe('opt2');

    rerender(
      <SelectInput
        field={mockField}
        value={currentValue} 
        onChange={handleChange}
        isFieldRequired={false}
      />
    );

    expect(select).toHaveValue('opt2');
    rerender(
      <SelectInput
        field={mockField}
        value={currentValue}
        onChange={handleChange}
        isFieldRequired={false}
      />
    );

    expect(select).toHaveValue('opt2');
  });

  it('displays error message when error prop is provided', () => {
    render(
      <SelectInput
        field={mockField}
        value=""
        onChange={() => {}}
        error="Please select an option"
        isFieldRequired={true} 
      />
    );

    const select = findSelectByLabelText('Test Select');
    const errorMessage = screen.getByText('Please select an option');

    expect(errorMessage).toBeInTheDocument();
    expect(errorMessage).toHaveAttribute('role', 'alert');
    expect(select).toHaveAttribute('aria-invalid', 'true');
    expect(select).toHaveAttribute('aria-describedby', `${mockField.name}-error`);
  });

  it('does not display error message when error prop is not provided', () => {
    render(
      <SelectInput
        field={mockField}
        value=""
        onChange={() => {}}
        isFieldRequired={false}
      />
    );

    const select = findSelectByLabelText('Test Select');
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    expect(select).toHaveAttribute('aria-invalid', 'false');
    expect(select).not.toHaveAttribute('aria-describedby');
  });

  it('displays required marker and sets required attribute when isFieldRequired is true', () => {
    render(
      <SelectInput
        field={mockField}
        value=""
        onChange={() => {}}
        isFieldRequired={true}
      />
    );

    const label = screen.getByText('Test Select');
    expect(label.querySelector('span[class*="requiredMarker"]')).toHaveTextContent('*');
    expect(findSelectByLabelText('Test Select')).toBeRequired();
  });

  it('does not display required marker or set required attribute when isFieldRequired is false', () => {
    render(
      <SelectInput
        field={mockField}
        value=""
        onChange={() => {}}
        isFieldRequired={false}
      />
    );

    const label = screen.getByText('Test Select');
    expect(label.querySelector('span[class*="requiredMarker"]')).toBeNull();
    expect(findSelectByLabelText('Test Select')).not.toBeRequired();
  });

  it('does not render placeholder option if field is required and has a value', () => {
    render(
      <SelectInput
        field={mockField}
        value="opt1" 
        onChange={() => {}}
        isFieldRequired={true} 
      />
    );
    expect(screen.queryByText(new RegExp(getPlaceholderText(mockField.label), 'i'))).not.toBeInTheDocument();
  });

  it('renders placeholder option if field is not required, even if it has a value initially', () => {
    render(
      <SelectInput
        field={mockField}
        value="opt1" 
        onChange={() => {}}
        isFieldRequired={false}
      />
    );
    expect(screen.getByText(new RegExp(getPlaceholderText(mockField.label), 'i'))).toBeInTheDocument();
  });

});
