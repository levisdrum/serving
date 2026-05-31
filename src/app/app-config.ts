import type { AdminPageId, MinisterioTag, RoleTag } from '../domain/types';

export const CHURCH_LOGO = 'https://static.wixstatic.com/media/285ce0_9a28dae8590749b797223164589f3eaa~mv2.png/v1/fill/w_202,h_174,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/285ce0_9a28dae8590749b797223164589f3eaa~mv2.png';
export const SESSION_KEY = 'serving-session';

export const ADMIN_PAGES: Array<{ id: AdminPageId; label: string; icon: string }> = [
  { id: 'summary', label: 'Painel', icon: 'dashboard' },
  { id: 'add-member', label: 'Adicionar membro', icon: 'person_add' },
  { id: 'members', label: 'Membros cadastrados', icon: 'groups' },
  { id: 'teams', label: 'Equipes', icon: 'hub' },
  { id: 'assign-member-team', label: 'Associar membro à equipe', icon: 'group_add' },
  { id: 'team-roles', label: 'Funções da equipe', icon: 'badge' },
  { id: 'assign-role-member', label: 'Vincular função e membro', icon: 'link' },
  { id: 'create-scale', label: 'Criar escala', icon: 'event' },
  { id: 'scale-detail', label: 'Detalhe da escala', icon: 'library_music' }
];

export const ADMIN_PAGE_PATHS: Record<AdminPageId, string> = {
  summary: '/admin/painel',
  'add-member': '/admin/membros/novo',
  members: '/admin/membros',
  teams: '/admin/equipes',
  'assign-member-team': '/admin/equipes/associar-membro',
  'team-roles': '/admin/funcoes',
  'assign-role-member': '/admin/funcoes/vincular',
  'create-scale': '/admin/escalas/nova',
  'scale-detail': '/admin/escalas/detalhe'
};

export const MEMBER_PAGE_PATHS = {
  dashboard: '/membro/minha-escala',
  profile: '/perfil/editar'
} as const;

export const NAV_SECTIONS: Array<{ label: string | null; ids: AdminPageId[] }> = [
  { label: null, ids: ['summary'] },
  { label: 'Membros', ids: ['add-member', 'members'] },
  { label: 'Equipes', ids: ['teams', 'assign-member-team', 'team-roles', 'assign-role-member'] },
  { label: 'Escalas', ids: ['create-scale', 'scale-detail'] }
];

export const MINISTERIO_OPTIONS: Array<{ id: MinisterioTag; label: string }> = [
  { id: 'ministro-louvor', label: 'Ministro de louvor' },
  { id: 'vocalista', label: 'Vocalista' },
  { id: 'violao', label: 'Violão' },
  { id: 'guitarra', label: 'Guitarra' },
  { id: 'baixo', label: 'Baixo' },
  { id: 'bateria', label: 'Bateria' },
  { id: 'teclado', label: 'Teclado' },
  { id: 'mesa-som', label: 'Mesa de som' },
  { id: 'projecao', label: 'Projeção' },
  { id: 'transmissao', label: 'Transmissão' },
  { id: 'recepcao', label: 'Recepção' },
  { id: 'apoio', label: 'Apoio' },
  { id: 'intercessao', label: 'Intercessão' },
  { id: 'danca', label: 'Dança' },
  { id: 'outro', label: 'Outro' },
  { id: 'nao-informado', label: 'Não informado' }
];

export function mapMinisterioToRoleTag(ministerio: MinisterioTag): RoleTag {
  if (ministerio === 'nao-informado') return 'outro';
  return ministerio;
}

export function getAdminPageFromPath(pathname: string): AdminPageId {
  const normalizedPath = pathname.endsWith('/') && pathname.length > 1 ? pathname.slice(0, -1) : pathname;
  const match = Object.entries(ADMIN_PAGE_PATHS).find(([, path]) => path === normalizedPath);
  return (match?.[0] as AdminPageId | undefined) ?? 'summary';
}
