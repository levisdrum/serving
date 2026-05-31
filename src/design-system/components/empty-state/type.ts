import type { ReactNode } from 'react';

export interface EmptyStateProps {
  icon?: string;
  message: string;
  action?: ReactNode;
  className?: string;
}
