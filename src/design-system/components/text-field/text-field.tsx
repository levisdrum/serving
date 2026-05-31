import { useState } from 'react';
import { Input, Label, TextField as AriaTextField } from 'react-aria-components';
import type { DSTextFieldProps } from './type';
import './styles.css';

export function TextField({
  label,
  value,
  onChange,
  type = 'text',
  placeholder,
  name,
  readOnly = false,
  showPasswordToggle = true
}: DSTextFieldProps) {
  const isPasswordField = type === 'password';
  const [isPasswordVisible, setPasswordVisible] = useState(false);
  const resolvedType = isPasswordField && isPasswordVisible ? 'text' : type;

  return (
    <AriaTextField className="ds-field" value={value} onChange={onChange} type={resolvedType} isReadOnly={readOnly}>
      <Label className="ds-field__label">{label}</Label>
      <div className="ds-field__input-wrap">
        <Input className="ds-field__input" placeholder={placeholder} name={name} type={resolvedType} />
        {isPasswordField && showPasswordToggle ? (
          <button
            type="button"
            className="ds-field__password-toggle"
            aria-label={isPasswordVisible ? 'Ocultar senha' : 'Mostrar senha'}
            onClick={() => setPasswordVisible((prev) => !prev)}
          >
            <span className="material-symbols-rounded" aria-hidden="true">
              {isPasswordVisible ? 'visibility_off' : 'visibility'}
            </span>
          </button>
        ) : null}
      </div>
    </AriaTextField>
  );
}
