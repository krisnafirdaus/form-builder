import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FormRenderer from './FormRenderer';
import { FormSchema } from '../types';

const mockSchema: FormSchema = [
  {
    type: 'text',
    name: 'firstName',
    label: 'First Name',
    required: true,
  },
  {
    type: 'number',
    name: 'age',
    label: 'Age',
    required: false,
    min: 18,
  },
  {
    type: 'select',
    name: 'country',
    label: 'Country',
    required: true,
    options: [
      { value: 'us', label: 'United States' },
      { value: 'ca', label: 'Canada' },
    ],
  },
  {
    type: 'date_range',
    name: 'vacationDates',
    label: 'Vacation Dates',
    required: true,
  },
  {
    type: 'text',
    name: 'reason',
    label: 'Reason for Travel',
    required: (formData) => formData.country === 'us',
    conditional: (formData) => !!formData.country,
  },
];

describe('FormRenderer Component', () => {
  let onSubmitMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    onSubmitMock = vi.fn();
  });

  it('renders form fields based on schema', async () => {
    render(<FormRenderer schema={mockSchema} onSubmit={onSubmitMock} />);

    await waitFor(() => {
      expect(screen.getByLabelText(/First Name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Age/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Country/i)).toBeInTheDocument();
      expect(screen.getByText('Vacation Dates')).toBeInTheDocument();
      expect(screen.getByLabelText('Start Date')).toBeInTheDocument();
      expect(screen.getByLabelText('End Date')).toBeInTheDocument();

      expect(screen.queryByLabelText(/Reason for Travel/i)).not.toBeInTheDocument();
    });
  });

  it('handles text input change', async () => {
    render(<FormRenderer schema={mockSchema} onSubmit={onSubmitMock} />);
    const firstNameInput = screen.getByLabelText(/First Name/i);
    await userEvent.type(firstNameInput, 'John');
    expect(firstNameInput).toHaveValue('John');
  });

  it('handles number input change', async () => {
    render(<FormRenderer schema={mockSchema} onSubmit={onSubmitMock} />);
    const ageInput = screen.getByLabelText(/Age/i);
    await userEvent.clear(ageInput);
    await userEvent.type(ageInput, '30');
    expect(ageInput).toHaveValue(30);
  });

  it('handles select input change', async () => {
    render(<FormRenderer schema={mockSchema} onSubmit={onSubmitMock} />);
    const countrySelect = screen.getByLabelText(/Country/i);
    await userEvent.selectOptions(countrySelect, 'us');
    expect(countrySelect).toHaveValue('us');
  });

  it('handles date range input change', async () => {
    render(<FormRenderer schema={mockSchema} onSubmit={onSubmitMock} />);
    const startDateInput = screen.getByLabelText('Start Date');
    const endDateInput = screen.getByLabelText('End Date');

    await userEvent.type(startDateInput, '2024-08-01');
    await userEvent.type(endDateInput, '2024-08-10');

    expect(startDateInput).toHaveValue('2024-08-01');
    expect(endDateInput).toHaveValue('2024-08-10');
  });

  it('calls onSubmit with form data when form is valid and submitted', async () => {
    render(<FormRenderer schema={mockSchema} onSubmit={onSubmitMock} />);

    await userEvent.type(screen.getByLabelText(/First Name/i), 'Jane');
    await userEvent.selectOptions(screen.getByLabelText(/Country/i), 'ca');
    await userEvent.type(screen.getByLabelText('Start Date'), '2024-09-01');
    await userEvent.type(screen.getByLabelText('End Date'), '2024-09-05');
    await userEvent.type(screen.getByLabelText(/Age/i), '25');

    fireEvent.submit(screen.getByRole('button', { name: /Submit/i }));

    await waitFor(() => {
      expect(onSubmitMock).toHaveBeenCalledTimes(1);
      expect(onSubmitMock).toHaveBeenCalledWith({
        firstName: 'Jane',
        age: 25,
        country: 'ca',
        vacationDates: { startDate: '2024-09-01', endDate: '2024-09-05' },
        reason: '',
      });
    });
  });

  it('does not call onSubmit and shows errors when required fields are missing', async () => {
    render(<FormRenderer schema={mockSchema} onSubmit={onSubmitMock} />);

    fireEvent.submit(screen.getByRole('button', { name: /Submit/i }));

    await waitFor(() => {
      expect(onSubmitMock).not.toHaveBeenCalled();
      expect(screen.getByText('First Name is required.')).toBeInTheDocument();
      expect(screen.getByText('Country is required.')).toBeInTheDocument();
      expect(screen.getByText('Vacation Dates requires both start and end dates.')).toBeInTheDocument();
    });

    expect(screen.getByLabelText(/First Name/i)).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByLabelText(/Country/i)).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByLabelText('Start Date')).toHaveAttribute('aria-describedby', 'vacationDates-error');
    expect(screen.getByLabelText('End Date')).toHaveAttribute('aria-describedby', 'vacationDates-error');
  });

  it('shows error if age is above max value', async () => {
    const schemaWithMax = mockSchema.map(field =>
      field.name === 'age' ? { ...field, max: 30 } : field
    );
    render(<FormRenderer schema={schemaWithMax} onSubmit={onSubmitMock} />);
    await userEvent.type(screen.getByLabelText(/First Name/i), 'Test');
    await userEvent.selectOptions(screen.getByLabelText(/Country/i), 'us');
    await userEvent.type(screen.getByLabelText('Start Date'), '2024-09-01');
    await userEvent.type(screen.getByLabelText('End Date'), '2024-09-05');
    const ageInput = screen.getByLabelText(/Age/i);
    await userEvent.type(ageInput, '35');
    fireEvent.submit(screen.getByRole('button', { name: /Submit/i }));
    await waitFor(() => {
      expect(screen.getByText('Age must be no more than 30.')).toBeInTheDocument();
    });
  });

  it('removes only the specific error when multiple errors exist', async () => {
    const schemaWithMax = mockSchema.map(field =>
      field.name === 'age' ? { ...field, max: 30, min: 18, required: true } : field
    );
    render(<FormRenderer schema={schemaWithMax} onSubmit={onSubmitMock} />);
    await userEvent.type(screen.getByLabelText(/Age/i), '10');
    fireEvent.submit(screen.getByRole('button', { name: /Submit/i }));
    await waitFor(() => {
      expect(screen.getByText('First Name is required.')).toBeInTheDocument();
      expect(screen.getByText('Age must be at least 18.')).toBeInTheDocument();
      expect(screen.getByText('Country is required.')).toBeInTheDocument();
      expect(screen.getByText('Vacation Dates requires both start and end dates.')).toBeInTheDocument();
    });
    await userEvent.type(screen.getByLabelText(/First Name/i), 'A');
    await waitFor(() => {
      expect(screen.queryByText('First Name is required.')).not.toBeInTheDocument();
      expect(screen.getByText('Age must be at least 18.')).toBeInTheDocument();
      expect(screen.getByText('Country is required.')).toBeInTheDocument();
      expect(screen.getByText('Vacation Dates requires both start and end dates.')).toBeInTheDocument();
    });
  });

  it('removes number error when user corrects input', async () => {
    const schemaWithMax = mockSchema.map(field =>
      field.name === 'age' ? { ...field, max: 30 } : field
    );
    render(<FormRenderer schema={schemaWithMax} onSubmit={onSubmitMock} />);
    await userEvent.type(screen.getByLabelText(/First Name/i), 'Test');
    await userEvent.selectOptions(screen.getByLabelText(/Country/i), 'us');
    await userEvent.type(screen.getByLabelText('Start Date'), '2024-09-01');
    await userEvent.type(screen.getByLabelText('End Date'), '2024-09-05');
    const ageInput = screen.getByLabelText(/Age/i);
    await userEvent.type(ageInput, '35');
    fireEvent.submit(screen.getByRole('button', { name: /Submit/i }));
    await waitFor(() => {
      expect(screen.getByText('Age must be no more than 30.')).toBeInTheDocument();
    });
    await userEvent.clear(ageInput);
    await userEvent.type(ageInput, '25');
    await waitFor(() => {
      expect(screen.queryByText('Age must be no more than 30.')).not.toBeInTheDocument();
    });
    expect(ageInput).toHaveValue(25);
  });

  it('shows error if end date is before start date', async () => {
    render(<FormRenderer schema={mockSchema} onSubmit={onSubmitMock} />);

    await userEvent.type(screen.getByLabelText(/First Name/i), 'Test');
    await userEvent.selectOptions(screen.getByLabelText(/Country/i), 'ca');
    await userEvent.type(screen.getByLabelText('Start Date'), '2024-09-10');
    await userEvent.type(screen.getByLabelText('End Date'), '2024-09-05');

    fireEvent.submit(screen.getByRole('button', { name: /Submit/i }));

    await waitFor(() => {
      expect(onSubmitMock).not.toHaveBeenCalled();
      expect(screen.getByText('End date cannot be before start date.')).toBeInTheDocument();
    });
  });

  it('shows error if number is below min value', async () => {
    render(<FormRenderer schema={mockSchema} onSubmit={onSubmitMock} />);
    const ageInput = screen.getByLabelText(/Age/i);
    await userEvent.type(ageInput, '17'); 

    fireEvent.submit(screen.getByRole('button', { name: /Submit/i }));

    await waitFor(() => {
      fireEvent.blur(ageInput);
    });

    await waitFor(() => {
      expect(screen.getByText('Age must be at least 18.')).toBeInTheDocument();
    });
  });

  it('clears error when user interacts with the field', async () => {
    render(<FormRenderer schema={mockSchema} onSubmit={onSubmitMock} />);

    fireEvent.submit(screen.getByRole('button', { name: /Submit/i }));

    await waitFor(() => {
      expect(screen.getByText('First Name is required.')).toBeInTheDocument();
    });

    await userEvent.type(screen.getByLabelText(/First Name/i), 'J');

    await waitFor(() => {
      expect(screen.queryByText('First Name is required.')).not.toBeInTheDocument();
    });
    expect(screen.getByLabelText(/First Name/i)).toHaveAttribute('aria-invalid', 'false');
  });

  it('conditionally renders fields based on form data', async () => {
    render(<FormRenderer schema={mockSchema} onSubmit={onSubmitMock} />);

    expect(screen.queryByLabelText(/Reason for Travel/i)).not.toBeInTheDocument();

    await userEvent.selectOptions(screen.getByLabelText(/Country/i), 'us');

    await waitFor(() => {
      expect(screen.getByLabelText(/Reason for Travel/i)).toBeInTheDocument();
    });

    await userEvent.selectOptions(screen.getByLabelText(/Country/i), 'ca');

    await waitFor(() => {
      expect(screen.getByLabelText(/Reason for Travel/i)).toBeInTheDocument();
    });
  });

  it('handles dynamically required fields', async () => {
    render(<FormRenderer schema={mockSchema} onSubmit={onSubmitMock} />);

    await userEvent.selectOptions(screen.getByLabelText(/Country/i), 'us');

    const reasonInput = await screen.findByLabelText(/Reason for Travel/i);
    expect(reasonInput).toBeInTheDocument();
    expect(reasonInput).toBeRequired();
    expect(screen.getByText(/Reason for Travel/).querySelector('span[class*="requiredMarker"]')).toHaveTextContent('*');

    await userEvent.type(screen.getByLabelText(/First Name/i), 'Test');
    await userEvent.type(screen.getByLabelText('Start Date'), '2024-09-01');
    await userEvent.type(screen.getByLabelText('End Date'), '2024-09-05');
    fireEvent.submit(screen.getByRole('button', { name: /Submit/i }));

    await waitFor(() => {
      expect(onSubmitMock).not.toHaveBeenCalled();
      expect(screen.getByText('Reason for Travel is required.')).toBeInTheDocument();
    });

    await userEvent.selectOptions(screen.getByLabelText(/Country/i), 'ca');

    await waitFor(() => {
      expect(reasonInput).not.toBeRequired();
      const allReasonLabels = screen.getAllByText(/Reason for Travel/);
      const label = allReasonLabels.find(el => el.tagName.toLowerCase() === 'label');
      expect(label && label.querySelector('span[class*="requiredMarker"]')).toBeNull();
    });

    fireEvent.submit(screen.getByRole('button', { name: /Submit/i }));

    await waitFor(() => {
      expect(onSubmitMock).toHaveBeenCalledTimes(1);
      expect(onSubmitMock).toHaveBeenCalledWith(expect.objectContaining({ country: 'ca', reason: '' }));
    });
  });
});
