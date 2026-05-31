import { Input, Label, TextField as AriaTextField } from 'react-aria-components';
import type { DSTextFieldProps } from './type';
import './styles.css';

export function TextField({ label, value, onChange, type = 'text', placeholder, name, readOnly = false }: DSTextFieldProps) {
  return (
    <AriaTextField className="ds-field" value={value} onChange={onChange} type={type} isReadOnly={readOnly}>
      <Label className="ds-field__label">{label}</Label>
      <Input className="ds-field__input" placeholder={placeholder} name={name} />
    </AriaTextField>
  );
}
