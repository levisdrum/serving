import type { ButtonProps } from 'react-aria-components';

export type ButtonTone = 'primary' | 'neutral' | 'danger';

export interface DSButtonProps extends ButtonProps {
  tone?: ButtonTone;
}
