import type { EmptyStateProps } from './type';
import './styles.css';

export function EmptyState({ icon = 'inbox', message, action, className = '' }: EmptyStateProps) {
  return (
    <div className={`ds-empty-state ${className}`.trim()}>
      <span className="material-symbols-rounded" aria-hidden="true">{icon}</span>
      <p>{message}</p>
      {action ?? null}
    </div>
  );
}
