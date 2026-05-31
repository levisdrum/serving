import type { InputHTMLAttributes } from 'react';

export interface DSTextFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: InputHTMLAttributes<HTMLInputElement>['type'];
  placeholder?: string;
  name?: string;
  readOnly?: boolean;
}
