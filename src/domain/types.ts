export type RoleTag =
  | 'toca'
  | 'canta'
  | 'som'
  | 'projecao'
  | 'pastor'
  | 'ministro-louvor'
  | 'vocalista'
  | 'violao'
  | 'guitarra'
  | 'baixo'
  | 'bateria'
  | 'teclado'
  | 'mesa-som'
  | 'transmissao'
  | 'recepcao'
  | 'apoio'
  | 'intercessao'
  | 'danca'
  | 'outro';
export type MinisterioTag =
  | 'ministro-louvor'
  | 'vocalista'
  | 'violao'
  | 'guitarra'
  | 'baixo'
  | 'bateria'
  | 'teclado'
  | 'mesa-som'
  | 'projecao'
  | 'transmissao'
  | 'recepcao'
  | 'apoio'
  | 'intercessao'
  | 'danca'
  | 'outro'
  | 'nao-informado';

export type UserRole = 'master' | 'admin' | 'membro';

export type InviteStatus = 'pendente' | 'aceito' | 'recusado';

export type Congregacao = 'SP AM' | 'SP PM' | 'BH' | 'PF';

export type AdminPageId =
  | 'summary'
  | 'add-member'
  | 'teams'
  | 'assign-member-team'
  | 'team-roles'
  | 'assign-role-member'
  | 'create-scale'
  | 'scale-detail'
  | 'members';

export interface MemberProfile {
  id: string;
  nome: string;
  email: string;
  passwordHash: string;
  senhaApoio?: string;
  fotoUrl?: string;
  funcao: RoleTag;
  ministerioPrincipal: MinisterioTag;
  ministeriosSecundarios: MinisterioTag[];
  telefone?: string;
  observacao?: string;
  congregacao: Congregacao;
  role: UserRole;
}

export interface TeamRole {
  id: string;
  nome: string;
}

export interface TeamRoleAssignment {
  id: string;
  teamRoleId: string;
  memberId: string;
}

export interface Team {
  id: string;
  nome: string;
  memberIds: string[];
  roles: TeamRole[];
  roleAssignments: TeamRoleAssignment[];
}

export interface ScaleAssignment {
  id: string;
  memberId: string;
  ministerio?: MinisterioTag;
  status: InviteStatus;
}

export interface EventSong {
  id: string;
  titulo: string;
  tom: string;
  bpm?: string;
  link?: string;
  observacao?: string;
}

export interface EventScale {
  id: string;
  congregacao: Congregacao;
  ownerAdminId: string;
  titulo: string;
  dataISO: string;
  assignments: ScaleAssignment[];
  songs: EventSong[];
  notes: string;
  playlistLink?: string;
}

export interface SongSuggestion {
  id: string;
  teamId: string;
  titulo: string;
  sugeridoPor: string;
}

export interface AppState {
  users: MemberProfile[];
  teams: Team[];
  scales: EventScale[];
  songs: SongSuggestion[];
}
