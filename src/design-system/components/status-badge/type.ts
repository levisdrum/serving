export type StatusTone = 'pendente' | 'aceito' | 'recusado';

export interface StatusBadgeProps {
  tone: StatusTone;
  label: string;
  className?: string;
}
