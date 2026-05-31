import { Button as AriaButton } from 'react-aria-components';
import type { DSButtonProps } from './type';
import './styles.css';

export function Button({ tone = 'primary', className, ...props }: DSButtonProps) {
  return (
    <AriaButton
      {...props}
      className={`ds-btn ds-btn--${tone}${className ? ` ${className}` : ''}`}
    />
  );
}
