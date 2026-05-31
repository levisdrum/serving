import type { StatusBadgeProps } from './type';
import './styles.css';

export function StatusBadge({ tone, label, className = '' }: StatusBadgeProps) {
  return <span className={`ds-status-badge ds-status-badge--${tone} ${className}`.trim()}>{label}</span>;
}
