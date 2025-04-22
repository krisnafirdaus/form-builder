export interface SelectOption {
  value: string | number;
  label: string;
}

export type FieldType = 'text' | 'number' | 'select' | 'date_range';

export interface FormFieldBase {
  label: string;
  name: string;
  type: FieldType;
  required?: boolean | ((formData: FormData) => boolean);
  conditional?: (formData: Record<string, unknown>) => boolean;
}

export interface TextField extends FormFieldBase {
  type: 'text';
}

export interface NumberField extends FormFieldBase {
  type: 'number';
  min?: number;
  max?: number;
  step?: number;
}

export interface SelectField extends FormFieldBase {
  type: 'select';
  options: SelectOption[];
}

export interface DateRangeField extends FormFieldBase {
  type: 'date_range';
}

export type FormField = TextField | NumberField | SelectField | DateRangeField;

export type FormSchema = FormField[];

export type FormData = Record<string, unknown>;

export type FormErrors = Record<string, string>;
