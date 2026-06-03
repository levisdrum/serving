import type { AppState, AdminPageId, Congregacao, MemberProfile, MinisterioTag, RoleTag, UserRole } from '../../domain/types';

export interface AdminPanelProps {
  state: AppState;
  currentUser: MemberProfile;
  adminPage: AdminPageId;
  addUser: (input: {
    nome: string;
    email: string;
    password: string;
    funcao: RoleTag;
    ministerioPrincipal: MinisterioTag;
    ministeriosSecundarios: MinisterioTag[];
    fotoUrl?: string;
    telefone?: string;
    observacao?: string;
    congregacao: Congregacao;
    role: UserRole;
  }) => void;
  updateUser: (
    userId: string,
    patch: {
      nome?: string;
      email?: string;
      congregacao?: Congregacao;
      fotoUrl?: string;
      role?: UserRole;
      ministerioPrincipal?: MinisterioTag;
      ministeriosSecundarios?: MinisterioTag[];
      telefone?: string;
      observacao?: string;
      password?: string;
    },
    actorId?: string
  ) => void;
  removeUser: (userId: string, actorId?: string) => boolean;
  addTeam: (name: string) => void;
  updateTeam: (teamId: string, nome: string) => void;
  removeTeam: (teamId: string) => void;
  addMemberToTeam: (teamId: string, userId: string) => void;
  addTeamRole: (teamId: string, nome: string) => void;
  updateTeamRole: (teamId: string, roleId: string, nome: string) => void;
  removeTeamRole: (teamId: string, roleId: string) => void;
  assignMemberToTeamRole: (teamId: string, roleId: string, memberId: string) => void;
  removeTeamRoleAssignment: (teamId: string, assignmentId: string) => void;
  createScale: (input: {
    titulo: string;
    dataISO: string;
    congregacao: Congregacao;
    ownerAdminId: string;
    memberAssignments: Array<{ memberId: string; ministerio?: MinisterioTag }>;
    notes?: string;
    playlistLink?: string;
  }) => void;
  updateScale: (scaleId: string, patch: { titulo?: string; dataISO?: string; notes?: string; playlistLink?: string }) => void;
  updateScaleAssignment: (scaleId: string, assignmentId: string, ministerio: MinisterioTag) => void;
  onNavigate: (page: AdminPageId) => void;
}
