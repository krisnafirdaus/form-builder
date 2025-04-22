import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import NumberInput from './NumberInput';
import { NumberField } from '../../types';

const findInputByLabelText = (text: string | RegExp) => {
  return screen.getByRole('spinbutton', {
    name: (accessibleName) => {
      const nameToCheck = typeof text === 'string' ? text : text.source;
      return accessibleName.startsWith(nameToCheck);
    }
  });
};

const mockField: NumberField = {
  type: 'number',
  name: 'testNumberInput',
  label: 'Test Number Input',
};

const mockFieldWithLimits: NumberField = {
  ...mockField,
  min: 10,
  max: 100,
  step: 5,
}

describe('NumberInput Component', () => {
  it('renders correctly with label and input type number', () => {
    render(
      <NumberInput
        field={mockField}
        value=""
        onChange={() => {}}
        isFieldRequired={false}
      />
    );

    expect(screen.getByLabelText('Test Number Input')).toBeInTheDocument();
    expect(findInputByLabelText('Test Number Input')).toHaveAttribute('type', 'number');
  });

  it('calls onChange handler when input value changes', async () => {
    let currentValue: string | number = '';
    const handleChange = vi.fn();

    const { rerender } = render(
      <NumberInput
        field={mockField}
        value={currentValue} 
        onChange={handleChange}
        isFieldRequired={false}
      />
    );

    let input = findInputByLabelText('Test Number Input');
    const finalValue = '42';

    await userEvent.clear(input); 
    await userEvent.type(input, finalValue);

    expect(handleChange).toHaveBeenCalled();
    
    currentValue = finalValue;

    rerender(
      <NumberInput
        field={mockField}
        value={currentValue} 
        onChange={handleChange}
        isFieldRequired={false}
      />
    );

    input = findInputByLabelText('Test Number Input');
    expect(input).toHaveValue(Number(finalValue)); 
  });

  it('displays error message when error prop is provided', () => {
    render(
      <NumberInput
        field={mockField}
        value=""
        onChange={() => {}}
        error="Value must be positive"
        isFieldRequired={true} 
      />
    );

    const input = findInputByLabelText('Test Number Input');
    const errorMessage = screen.getByText('Value must be positive');

    expect(errorMessage).toBeInTheDocument();
    expect(errorMessage).toHaveAttribute('role', 'alert');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAttribute('aria-describedby', `${mockField.name}-error`);
  });

  it('does not display error message when error prop is not provided', () => {
    render(
      <NumberInput
        field={mockField}
        value=""
        onChange={() => {}}
        isFieldRequired={false}
      />
    );

    const input = findInputByLabelText('Test Number Input');
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    expect(input).toHaveAttribute('aria-invalid', 'false');
    expect(input).not.toHaveAttribute('aria-describedby');
  });

  it('displays required marker and sets required attribute when isFieldRequired is true', () => {
    render(
      <NumberInput
        field={mockField}
        value=""
        onChange={() => {}}
        isFieldRequired={true}
      />
    );

    const label = screen.getByText('Test Number Input');
    expect(label.querySelector('span[class*="requiredMarker"]')).toHaveTextContent('*');
    expect(findInputByLabelText('Test Number Input')).toBeRequired();
  });

  it('does not display required marker or set required attribute when isFieldRequired is false', () => {
    render(
      <NumberInput
        field={mockField}
        value=""
        onChange={() => {}}
        isFieldRequired={false}
      />
    );

    const label = screen.getByText('Test Number Input');
    expect(label.querySelector('span[class*="requiredMarker"]')).toBeNull();
    expect(findInputByLabelText('Test Number Input')).not.toBeRequired();
  });

  it('applies min, max, and step attributes when provided in the field schema', () => {
    render(
      <NumberInput
        field={mockFieldWithLimits}
        value=""
        onChange={() => {}}
        isFieldRequired={false}
      />
    );

    const input = findInputByLabelText('Test Number Input');
    expect(input).toHaveAttribute('min', '10');
    expect(input).toHaveAttribute('max', '100');
    expect(input).toHaveAttribute('step', '5');
  });

  it('defaults step to "any" if not provided', () => {
    render(
      <NumberInput
        field={mockField} 
        value=""
        onChange={() => {}}
        isFieldRequired={false}
      />
    );

    const input = findInputByLabelText('Test Number Input');
    expect(input).not.toHaveAttribute('min');
    expect(input).not.toHaveAttribute('max');
    expect(input).toHaveAttribute('step', 'any');
  });
});
