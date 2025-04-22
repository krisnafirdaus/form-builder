import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import FormRenderer from './FormRenderer';



describe('FormRenderer fallback/default rendering', () => {
  it('renders text field only', () => {
    const schema = [
      { type: 'text', name: 'firstName', label: 'First Name', required: true }
    ];
    const { container } = render(<FormRenderer schema={schema} onSubmit={vi.fn()} />);
    expect(container.querySelector('input')).toBeInTheDocument();
    expect(container.textContent).toContain('First Name');
  });

  it('renders date range field only', () => {
    const schema = [
      {
        type: 'date_range',
        name: 'vacationDates',
        label: 'Vacation Dates',
        required: true,
        startLabel: 'Start Date',
        endLabel: 'End Date'
      }
    ];
    const { container } = render(<FormRenderer schema={schema} onSubmit={vi.fn()} />);
    expect(container.textContent).toContain('Vacation Dates');
    expect(container.textContent).toContain('Start Date');
    expect(container.textContent).toContain('End Date');
  });
});
