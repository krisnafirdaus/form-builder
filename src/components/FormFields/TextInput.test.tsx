import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TextInput from './TextInput';
import { TextField } from '../../types';

const findInputByLabelText = (text: string | RegExp) => {
  return screen.getByRole('textbox', {
    name: (accessibleName) => {
      const nameToCheck = typeof text === 'string' ? text : text.source;
      return accessibleName.startsWith(nameToCheck);
    }
  });
};

const mockField: TextField = {
  type: 'text',
  name: 'testInput',
  label: 'Test Input',
};

describe('TextInput Component', () => {
  it('renders correctly with label and input', () => {
    render(
      <TextInput
        field={mockField}
        value=""
        onChange={() => {}}
        isFieldRequired={false}
      />
    );

    expect(screen.getByLabelText('Test Input')).toBeInTheDocument();
    expect(findInputByLabelText('Test Input')).toBeInTheDocument();
  });

  it('calls onChange handler when input value changes', async () => {
    let currentValue = '';
    const handleChange = vi.fn();

    const { rerender } = render(
      <TextInput
        field={mockField}
        value={currentValue}
        onChange={handleChange}
        isFieldRequired={false}
      />
    );

    let input = findInputByLabelText('Test Input');
    const finalValue = 'new value';

    await userEvent.clear(input);
    await userEvent.type(input, finalValue);

    expect(handleChange).toHaveBeenCalled();

    currentValue = finalValue;

    rerender(
      <TextInput
        field={mockField}
        value={currentValue}
        onChange={handleChange}
        isFieldRequired={false}
      />
    );

    input = findInputByLabelText('Test Input'); 
    expect(input).toHaveValue(finalValue);

  });

  it('displays error message when error prop is provided', () => {
    render(
      <TextInput
        field={mockField}
        value=""
        onChange={() => {}}
        error="This field is required"
        isFieldRequired={true}
      />
    );

    const input = findInputByLabelText('Test Input');
    const errorMessage = screen.getByText('This field is required');

    expect(errorMessage).toBeInTheDocument();
    expect(errorMessage).toHaveAttribute('role', 'alert');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAttribute('aria-describedby', `${mockField.name}-error`);
  });

  it('does not display error message when error prop is not provided', () => {
    render(
      <TextInput
        field={mockField}
        value=""
        onChange={() => {}}
        isFieldRequired={false}
      />
    );

    const input = findInputByLabelText('Test Input');
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    expect(input).toHaveAttribute('aria-invalid', 'false');
    expect(input).not.toHaveAttribute('aria-describedby');
  });

  it('displays required marker when isFieldRequired is true', () => {
    render(
      <TextInput
        field={mockField}
        value=""
        onChange={() => {}}
        isFieldRequired={true}
      />
    );

    const label = screen.getByText('Test Input');
    expect(label.querySelector('span[class*="requiredMarker"]')).toHaveTextContent('*');
    expect(findInputByLabelText('Test Input')).toBeRequired();
  });

  it('does not display required marker when isFieldRequired is false', () => {
    render(
      <TextInput
        field={mockField}
        value=""
        onChange={() => {}}
        isFieldRequired={false}
      />
    );

    const label = screen.getByText('Test Input');
    expect(label.querySelector('span[class*="requiredMarker"]')).toBeNull();
    expect(findInputByLabelText('Test Input')).not.toBeRequired();
  });
});
