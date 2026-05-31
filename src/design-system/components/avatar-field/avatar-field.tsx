import { Button, FileTrigger, Label } from 'react-aria-components';
import type { AvatarFieldProps } from './type';
import './styles.css';

async function toBase64(file: File): Promise<string> {
  return await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? ''));
    reader.onerror = () => reject(new Error('Falha ao ler arquivo'));
    reader.readAsDataURL(file);
  });
}

export function AvatarField({ label, value, onChange }: AvatarFieldProps) {
  const hasImage = Boolean(value && value.trim().length > 0);
  const initials = 'SV';

  return (
    <div className="ds-avatar-field">
      <Label className="ds-field__label">{label}</Label>
      <div className="ds-avatar-field__row">
        {hasImage ? (
          <img className="ds-avatar-field__preview" src={value} alt="Preview do avatar" />
        ) : (
          <span className="ds-avatar-field__placeholder" aria-hidden="true">{initials}</span>
        )}
        <div className="ds-avatar-field__actions">
          <FileTrigger
            acceptedFileTypes={["image/*"]}
            onSelect={async (files) => {
              const file = files?.item(0);
              if (!file) return;
              const encoded = await toBase64(file);
              onChange(encoded);
            }}
          >
            <Button className="ds-btn ds-btn--neutral" type="button">Escolher arquivo</Button>
          </FileTrigger>
          <Button className="ds-btn ds-btn--neutral" type="button" onPress={() => onChange('')}>
            Remover
          </Button>
        </div>
      </div>
    </div>
  );
}
