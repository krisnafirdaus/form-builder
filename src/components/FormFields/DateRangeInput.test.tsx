import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import DateRangeInput from './DateRangeInput';
import { DateRangeField } from '../../types';

// Mock minimal field schema
const mockField: DateRangeField = {
  type: 'date_range',
  name: 'testDateRange',
  label: 'Test Date Range',
};

describe('DateRangeInput Component', () => {
  it('renders correctly with main label and two date inputs', () => {
    render(
      <DateRangeInput
        field={mockField}
        value={undefined}
        onChange={() => {}}
        isFieldRequired={false}
      />
    );

    // Check main label
    expect(screen.getByText('Test Date Range')).toBeInTheDocument();

    // Check start date input (accessible by its label)
    expect(screen.getByLabelText('Start Date')).toBeInTheDocument();
    expect(screen.getByLabelText('Start Date')).toHaveAttribute('type', 'date');

    // Check end date input (accessible by its label)
    expect(screen.getByLabelText('End Date')).toBeInTheDocument();
    expect(screen.getByLabelText('End Date')).toHaveAttribute('type', 'date');
  });

  it('calls onChange handler with updated startDate when start date changes', () => {
    const handleChange = vi.fn();
    render(
      <DateRangeInput
        field={mockField}
        value={{ startDate: '', endDate: '2024-12-31' }}
        onChange={handleChange}
        isFieldRequired={false}
      />
    );

    const startDateInput = screen.getByLabelText('Start Date');
    fireEvent.change(startDateInput, { target: { value: '2024-01-01' } });

    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(handleChange).toHaveBeenCalledWith('testDateRange', {
      startDate: '2024-01-01',
      endDate: '2024-12-31', // Existing end date should be preserved
    });
  });

  it('calls onChange handler with updated endDate when end date changes', () => {
    const handleChange = vi.fn();
    render(
      <DateRangeInput
        field={mockField}
        value={{ startDate: '2024-01-01', endDate: '' }}
        onChange={handleChange}
        isFieldRequired={false}
      />
    );

    const endDateInput = screen.getByLabelText('End Date');
    fireEvent.change(endDateInput, { target: { value: '2024-12-31' } });

    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(handleChange).toHaveBeenCalledWith('testDateRange', {
      startDate: '2024-01-01', // Existing start date should be preserved
      endDate: '2024-12-31',
    });
  });

  it('displays error message when error prop is provided', () => {
    render(
      <DateRangeInput
        field={mockField}
        value={undefined}
        onChange={() => {}}
        error="End date must be after start date"
        isFieldRequired={true}
      />
    );

    const errorMessage = screen.getByText('End date must be after start date');
    const startDateInput = screen.getByLabelText('Start Date');
    const endDateInput = screen.getByLabelText('End Date');

    expect(errorMessage).toBeInTheDocument();
    expect(errorMessage).toHaveAttribute('role', 'alert');
    // Errors typically apply to the whole component, check aria-describedby
    expect(startDateInput).toHaveAttribute('aria-describedby', `${mockField.name}-error`);
    expect(endDateInput).toHaveAttribute('aria-describedby', `${mockField.name}-error`);
  });

  it('does not display error message when error prop is not provided', () => {
    render(
      <DateRangeInput
        field={mockField}
        value={undefined}
        onChange={() => {}}
        isFieldRequired={false}
      />
    );

    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    const startDateInput = screen.getByLabelText('Start Date');
    const endDateInput = screen.getByLabelText('End Date');
    expect(startDateInput).not.toHaveAttribute('aria-describedby');
    expect(endDateInput).not.toHaveAttribute('aria-describedby');
  });

  it('displays required marker on main label and sets required on inputs when isFieldRequired is true', () => {
    render(
      <DateRangeInput
        field={mockField}
        value={undefined}
        onChange={() => {}}
        isFieldRequired={true}
      />
    );

    const label = screen.getByText((_, element) => {
      // Find the label element itself, ignoring the content of the potential span inside
      return element?.tagName.toLowerCase() === 'label' && element.textContent?.startsWith('Test Date Range') === true;
    });
    expect(label.querySelector('span[class*="requiredMarker"]')).toHaveTextContent('*');
    expect(screen.getByLabelText('Start Date')).toBeRequired();
    expect(screen.getByLabelText('End Date')).toBeRequired();
  });

  it('does not display required marker or set required attributes when isFieldRequired is false', () => {
    render(
      <DateRangeInput
        field={mockField}
        value={undefined}
        onChange={() => {}}
        isFieldRequired={false}
      />
    );
    const label = screen.getByText((_, element) => {
      return element?.tagName.toLowerCase() === 'label' && element.textContent?.startsWith('Test Date Range') === true;
    });
    expect(label.querySelector('span[class*="requiredMarker"]')).toBeNull();
    expect(screen.getByLabelText('Start Date')).not.toBeRequired();
    expect(screen.getByLabelText('End Date')).not.toBeRequired();
  });

  it('sets min attribute on end date input based on start date value', () => {
    const startDate = '2024-05-15';
    render(
      <DateRangeInput
        field={mockField}
        value={{ startDate: startDate, endDate: '' }}
        onChange={() => {}}
        isFieldRequired={false}
      />
    );

    const endDateInput = screen.getByLabelText('End Date');
    expect(endDateInput).toHaveAttribute('min', startDate);
  });

  it('does not set min attribute on end date input if start date is empty', () => {
    render(
      <DateRangeInput
        field={mockField}
        value={{ startDate: '', endDate: '' }}
        onChange={() => {}}
        isFieldRequired={false}
      />
    );

    const endDateInput = screen.getByLabelText('End Date');
    expect(endDateInput).not.toHaveAttribute('min');
  });
});
