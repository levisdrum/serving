import { Label, TextArea as AriaTextArea, TextField as AriaTextField } from 'react-aria-components';
import type { DSTextAreaProps } from './type';
import './styles.css';

export function TextArea({ label, value, onChange, placeholder, name }: DSTextAreaProps) {
  return (
    <AriaTextField className="ds-field ds-field--textarea" value={value} onChange={onChange}>
      <Label className="ds-field__label">{label}</Label>
      <AriaTextArea className="ds-field__textarea" placeholder={placeholder} name={name} />
    </AriaTextField>
  );
}
