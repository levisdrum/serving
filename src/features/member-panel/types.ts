import type { AppState, MemberProfile } from '../../domain/types';

export interface MemberPanelProps {
  state: AppState;
  currentUser: MemberProfile;
  respondInvite: (scaleId: string, assignmentId: string, status: 'aceito' | 'recusado') => void;
}
