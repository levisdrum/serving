import { useMemo, useState } from 'react';
import { decryptState, encryptState, hashPassword } from './security';
import type {
  AppState,
  Congregacao,
  EventScale,
  EventSong,
  MinisterioTag,
  MemberProfile,
  RoleTag,
  ScaleAssignment,
  SongSuggestion,
  Team,
  TeamRole,
  TeamRoleAssignment,
  UserRole
} from './types';

type LegacyScale = {
  id: string;
  teamId?: string;
  congregacao?: Congregacao;
  titulo: string;
  dataISO: string;
  inviteStatuses?: Record<string, unknown>;
  assignments?: ScaleAssignment[];
  songs?: EventSong[];
  notes?: string;
};

const STORAGE_KEY = 'louvor-local-app-state-v3';
const DEFAULT_MEMBER_PASSWORD = 'Membro337!';
const DEFAULT_LEADER_PASSWORD = 'Lider337!';
const DEFAULT_MASTER_PASSWORD = 'Master337!';
const REMOVED_LEGACY_SEED_EMAILS = new Set(['ana@337', 'bruno@337']);

const seedUsers: MemberProfile[] = [
  {
    id: 'u-master',
    nome: 'Master Servin',
    email: 'master@337',
    passwordHash: hashPassword(DEFAULT_MASTER_PASSWORD),
    senhaApoio: DEFAULT_MASTER_PASSWORD,
    funcao: 'pastor',
    ministerioPrincipal: 'ministro-louvor',
    ministeriosSecundarios: [],
    congregacao: 'SP PM',
    role: 'master'
  },
  {
    id: 'u-admin-sp-pm',
    nome: 'Líder SP PM',
    email: 'adminsppm@337',
    passwordHash: hashPassword(DEFAULT_LEADER_PASSWORD),
    senhaApoio: DEFAULT_LEADER_PASSWORD,
    funcao: 'pastor',
    ministerioPrincipal: 'ministro-louvor',
    ministeriosSecundarios: ['apoio'],
    congregacao: 'SP PM',
    role: 'admin'
  },
  {
    id: 'u-admin-sp-am',
    nome: 'Líder SP AM',
    email: 'adminspam@337',
    passwordHash: hashPassword(DEFAULT_LEADER_PASSWORD),
    senhaApoio: DEFAULT_LEADER_PASSWORD,
    funcao: 'pastor',
    ministerioPrincipal: 'ministro-louvor',
    ministeriosSecundarios: ['apoio'],
    congregacao: 'SP AM',
    role: 'admin'
  },
  {
    id: 'u-admin-bh',
    nome: 'Líder BH',
    email: 'adminbh@337',
    passwordHash: hashPassword(DEFAULT_LEADER_PASSWORD),
    senhaApoio: DEFAULT_LEADER_PASSWORD,
    funcao: 'pastor',
    ministerioPrincipal: 'ministro-louvor',
    ministeriosSecundarios: ['apoio'],
    congregacao: 'BH',
    role: 'admin'
  },
  {
    id: 'u-admin-pf',
    nome: 'Líder PF',
    email: 'adminpf@337',
    passwordHash: hashPassword(DEFAULT_LEADER_PASSWORD),
    senhaApoio: DEFAULT_LEADER_PASSWORD,
    funcao: 'pastor',
    ministerioPrincipal: 'ministro-louvor',
    ministeriosSecundarios: ['apoio'],
    congregacao: 'PF',
    role: 'admin'
  }
];

const seedTeamRoles: TeamRole[] = [
  { id: 'r-vocal', nome: 'Vocal' },
  { id: 'r-violao', nome: 'Violão' }
];

const seedRoleAssignments: TeamRoleAssignment[] = [];

const seedState: AppState = {
  users: seedUsers,
  teams: [
    {
      id: 't-1',
      nome: 'Louvor Domingo',
      memberIds: seedUsers.map((m) => m.id),
      roles: seedTeamRoles,
      roleAssignments: seedRoleAssignments
    }
  ],
  scales: [],
  songs: []
};

const randomId = () => Math.random().toString(36).slice(2, 9);

const LOGIN_EMAIL_MIGRATION: Record<string, string> = {
  'master@local': 'master@337',
  'lider.sppm@local': 'adminsppm@337',
  'lider.spam@local': 'adminspam@337',
  'lider.bh@local': 'adminbh@337',
  'lider.pf@local': 'adminpf@337'
};

function migrateLoginEmail(email: string) {
  const normalized = email.trim().toLowerCase();
  return LOGIN_EMAIL_MIGRATION[normalized] ?? normalized;
}

function normalizeState(raw: unknown): AppState {
  const maybe = raw as Partial<AppState> & {
    users?: Array<Partial<MemberProfile> & Pick<MemberProfile, 'id' | 'nome' | 'email' | 'role'>>;
    teams?: Array<Team & { roles?: TeamRole[]; roleAssignments?: TeamRoleAssignment[] }>;
    scales?: Array<EventScale | LegacyScale>;
  };

  const roleTagToMinisterio = (funcao?: RoleTag): MinisterioTag => {
    if (funcao === 'ministro-louvor') return 'ministro-louvor';
    if (funcao === 'vocalista') return 'vocalista';
    if (funcao === 'violao') return 'violao';
    if (funcao === 'guitarra') return 'guitarra';
    if (funcao === 'baixo') return 'baixo';
    if (funcao === 'bateria') return 'bateria';
    if (funcao === 'teclado') return 'teclado';
    if (funcao === 'mesa-som') return 'mesa-som';
    if (funcao === 'transmissao') return 'transmissao';
    if (funcao === 'recepcao') return 'recepcao';
    if (funcao === 'apoio') return 'apoio';
    if (funcao === 'intercessao') return 'intercessao';
    if (funcao === 'danca') return 'danca';
    if (funcao === 'outro') return 'outro';
    if (funcao === 'canta') return 'vocalista';
    if (funcao === 'toca') return 'violao';
    if (funcao === 'som') return 'mesa-som';
    if (funcao === 'projecao') return 'projecao';
    if (funcao === 'pastor') return 'ministro-louvor';
    return 'nao-informado';
  };

  const users: MemberProfile[] = (maybe.users ?? seedState.users).map((user) => {
    // Guardrail: only canonical seed user can be master.
    const normalizedRole: UserRole = user.id === 'u-master'
      ? 'master'
      : user.role === 'master'
        ? 'admin'
        : user.role;

    return {
      id: user.id,
      nome: user.nome,
      email: migrateLoginEmail(user.email),
      passwordHash: user.passwordHash ?? hashPassword(DEFAULT_MEMBER_PASSWORD),
      senhaApoio:
        user.senhaApoio ??
        (normalizedRole === 'master'
          ? DEFAULT_MASTER_PASSWORD
          : normalizedRole === 'admin'
            ? DEFAULT_LEADER_PASSWORD
            : DEFAULT_MEMBER_PASSWORD),
      role: normalizedRole,
      funcao: (user.funcao as RoleTag) ?? 'canta',
      ministerioPrincipal: (user.ministerioPrincipal as MinisterioTag) ?? roleTagToMinisterio(user.funcao as RoleTag),
      ministeriosSecundarios: user.ministeriosSecundarios ?? [],
      fotoUrl: user.fotoUrl ?? '',
      telefone: user.telefone ?? '',
      observacao: user.observacao ?? '',
      congregacao: (user.congregacao as Congregacao) ?? 'SP PM'
    };
  }).filter((user) => !REMOVED_LEGACY_SEED_EMAILS.has(user.email.toLowerCase()));

  const teams = (maybe.teams ?? seedState.teams).map((team) => ({
    ...team,
    roles: team.roles ?? [],
    roleAssignments: team.roleAssignments ?? []
  }));

  const scales = (maybe.scales ?? []).map((scale): EventScale => {
    if ('assignments' in scale) {
      return {
        ...(scale as EventScale),
        ownerAdminId: (scale as EventScale).ownerAdminId ?? '',
        songs: (scale as EventScale).songs ?? [],
        notes: (scale as EventScale).notes ?? '',
        playlistLink: (scale as EventScale).playlistLink ?? '',
        congregacao: (scale as EventScale).congregacao ?? 'SP PM'
      };
    }

    const legacy = scale as LegacyScale;
    const fallbackAssignments: ScaleAssignment[] = Object.entries(legacy.inviteStatuses ?? {}).map(([memberId, status]) => {
      const normalizedStatus = status === 'aceito' || status === 'recusado' ? status : 'pendente';
      return {
        id: randomId(),
        memberId,
        status: normalizedStatus
      };
    });


    return {
      id: legacy.id,
      congregacao: legacy.congregacao ?? 'SP PM',
      ownerAdminId: '',
      titulo: legacy.titulo,
      dataISO: legacy.dataISO,
      assignments: legacy.assignments ?? fallbackAssignments,
      songs: legacy.songs ?? [],
      notes: legacy.notes ?? '',
      playlistLink: ''
    };
  });

  return {
    users,
    teams,
    scales,
    songs: maybe.songs ?? []
  };
}

function readInitialState(): AppState {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return seedState;

  try {
    const maybeJson = raw.startsWith('{') ? raw : decryptState(raw);
    return normalizeState(JSON.parse(maybeJson));
  } catch {
    return seedState;
  }
}

export function canRemoveUser(actor: MemberProfile | undefined, target: MemberProfile | undefined) {
  if (!actor || !target) return false;
  if (target.role === 'master') return false;
  if (actor.id === target.id) return false;
  if (actor.role === 'master') return true;
  return actor.role === 'admin' && target.role === 'membro';
}

export function useAppStore() {
  const [state, setState] = useState<AppState>(() => readInitialState());

  const persist = (next: AppState) => {
    setState(next);
    localStorage.setItem(STORAGE_KEY, encryptState(JSON.stringify(next)));
  };
  const commit = (updater: (prev: AppState) => AppState) => {
    setState((prev) => {
      const next = updater(prev);
      localStorage.setItem(STORAGE_KEY, encryptState(JSON.stringify(next)));
      return next;
    });
  };

  const actions = useMemo(
    () => ({
      addUser(input: {
        nome: string;
        email: string;
        password?: string;
        funcao: RoleTag;
        ministerioPrincipal: MinisterioTag;
        ministeriosSecundarios: MinisterioTag[];
        fotoUrl?: string;
        telefone?: string;
        observacao?: string;
        congregacao: Congregacao;
        role: UserRole;
      }) {
        const { password, ...rest } = input;
        const safePassword = password ?? DEFAULT_MEMBER_PASSWORD;
        const createdUser: MemberProfile = {
          id: randomId(),
          fotoUrl: '',
          telefone: '',
          observacao: '',
          ...rest,
          role: 'membro',
          passwordHash: hashPassword(safePassword),
          senhaApoio: safePassword
        };
        const next: AppState = {
          ...state,
          users: [
            ...state.users,
            createdUser
          ]
        };
        persist(next);
      },
      updateUser(
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
          senhaApoio?: string;
        },
        actorId?: string
      ) {
        commit((prev) => {
          const nextUsers = prev.users.map((user) => {
            if (user.id !== userId) return user;
            const safePatch = { ...patch };
            if (safePatch.role) {
              const actor = actorId ? prev.users.find((item) => item.id === actorId) : undefined;
              const canManageRoles = actor?.role === 'master';
              if (!canManageRoles) {
                delete safePatch.role;
              } else if (user.id === 'u-master') {
                safePatch.role = 'master';
              } else if (safePatch.role === 'master') {
                safePatch.role = 'admin';
              }
            }

            const nextUser: MemberProfile = { ...user, ...safePatch };
            if (typeof patch.senhaApoio === 'string' && patch.senhaApoio.trim()) {
              nextUser.senhaApoio = patch.senhaApoio.trim();
              nextUser.passwordHash = hashPassword(patch.senhaApoio.trim());
            }
            return nextUser;
          });
          return {
            ...prev,
            users: nextUsers
          };
        });
      },
      removeUser(userId: string, actorId?: string) {
        let removed = false;
        commit((prev) => {
          if (actorId) {
            const actor = prev.users.find((user) => user.id === actorId);
            const target = prev.users.find((user) => user.id === userId);
            if (!canRemoveUser(actor, target)) return prev;
          }

          const next: AppState = {
            ...prev,
            users: prev.users.filter((u) => u.id !== userId),
            teams: prev.teams.map((team) => ({
              ...team,
              memberIds: team.memberIds.filter((id) => id !== userId),
              roleAssignments: team.roleAssignments.filter((assignment) => assignment.memberId !== userId)
            })),
            scales: prev.scales.map((scale) => ({
              ...scale,
              assignments: scale.assignments.filter((assignment) => assignment.memberId !== userId)
            }))
          };
          removed = next.users.length !== prev.users.length;
          return next;
        });
        return removed;
      },
      addTeam(nome: string) {
        const team: Team = { id: randomId(), nome, memberIds: [], roles: [], roleAssignments: [] };
        persist({ ...state, teams: [...state.teams, team] });
      },
      updateTeam(teamId: string, nome: string) {
        persist({
          ...state,
          teams: state.teams.map((team) => (team.id === teamId ? { ...team, nome } : team))
        });
      },
      removeTeam(teamId: string) {
        persist({
          ...state,
          teams: state.teams.filter((t) => t.id !== teamId),
          songs: state.songs.filter((s) => s.teamId !== teamId)
        });
      },
      addMemberToTeam(teamId: string, userId: string) {
        persist({
          ...state,
          teams: state.teams.map((team) =>
            team.id !== teamId || team.memberIds.includes(userId)
              ? team
              : { ...team, memberIds: [...team.memberIds, userId] }
          )
        });
      },
      addTeamRole(teamId: string, nome: string) {
        if (!nome.trim()) return;

        persist({
          ...state,
          teams: state.teams.map((team) =>
            team.id !== teamId
              ? team
              : { ...team, roles: [...team.roles, { id: randomId(), nome: nome.trim() }] }
          )
        });
      },
      updateTeamRole(teamId: string, roleId: string, nome: string) {
        persist({
          ...state,
          teams: state.teams.map((team) =>
            team.id !== teamId
              ? team
              : {
                  ...team,
                  roles: team.roles.map((role) => (role.id === roleId ? { ...role, nome } : role))
                }
          )
        });
      },
      removeTeamRole(teamId: string, roleId: string) {
        persist({
          ...state,
          teams: state.teams.map((team) =>
            team.id !== teamId
              ? team
              : {
                  ...team,
                  roles: team.roles.filter((role) => role.id !== roleId),
                  roleAssignments: team.roleAssignments.filter((item) => item.teamRoleId !== roleId)
                }
          ),
          scales: state.scales
        });
      },
      assignMemberToTeamRole(teamId: string, roleId: string, memberId: string) {
        persist({
          ...state,
          teams: state.teams.map((team) => {
            if (team.id !== teamId) return team;

            const exists = team.roleAssignments.some(
              (item) => item.teamRoleId === roleId && item.memberId === memberId
            );

            if (exists) return team;

            return {
              ...team,
              roleAssignments: [...team.roleAssignments, { id: randomId(), teamRoleId: roleId, memberId }]
            };
          })
        });
      },
      removeTeamRoleAssignment(teamId: string, assignmentId: string) {
        persist({
          ...state,
          teams: state.teams.map((team) =>
            team.id !== teamId
              ? team
              : {
                  ...team,
                  roleAssignments: team.roleAssignments.filter((item) => item.id !== assignmentId)
                }
          )
        });
      },
      createScale(input: {
        titulo: string;
        dataISO: string;
        congregacao: Congregacao;
        ownerAdminId: string;
        memberAssignments: Array<{ memberId: string; ministerio?: MinisterioTag }>;
        notes?: string;
        playlistLink?: string;
      }) {
        if (input.memberAssignments.length === 0) return;

        const assignments: ScaleAssignment[] = input.memberAssignments.map(({ memberId, ministerio }) => ({
          id: randomId(),
          memberId,
          ministerio,
          status: 'pendente'
        }));

        const scale: EventScale = {
          id: randomId(),
          congregacao: input.congregacao,
          ownerAdminId: input.ownerAdminId,
          titulo: input.titulo,
          dataISO: input.dataISO,
          assignments,
          songs: [],
          notes: input.notes ?? '',
          playlistLink: input.playlistLink ?? ''
        };

        persist({ ...state, scales: [...state.scales, scale] });
      },
      updateScaleAssignment(scaleId: string, assignmentId: string, ministerio: MinisterioTag) {
        persist({
          ...state,
          scales: state.scales.map((scale) =>
            scale.id !== scaleId
              ? scale
              : {
                  ...scale,
                  assignments: scale.assignments.map((a) =>
                    a.id !== assignmentId ? a : { ...a, ministerio }
                  )
                }
          )
        });
      },
      updateScale(scaleId: string, patch: { titulo?: string; dataISO?: string; notes?: string; playlistLink?: string }) {
        persist({
          ...state,
          scales: state.scales.map((scale) => (scale.id === scaleId ? { ...scale, ...patch } : scale))
        });
      },
      addScaleSong(scaleId: string, input: Omit<EventSong, 'id'>) {
        persist({
          ...state,
          scales: state.scales.map((scale) =>
            scale.id !== scaleId
              ? scale
              : { ...scale, songs: [...scale.songs, { id: randomId(), ...input }] }
          )
        });
      },
      updateScaleSong(scaleId: string, songId: string, patch: Partial<Omit<EventSong, 'id'>>) {
        persist({
          ...state,
          scales: state.scales.map((scale) =>
            scale.id !== scaleId
              ? scale
              : {
                  ...scale,
                  songs: scale.songs.map((song) => (song.id === songId ? { ...song, ...patch } : song))
                }
          )
        });
      },
      removeScaleSong(scaleId: string, songId: string) {
        persist({
          ...state,
          scales: state.scales.map((scale) =>
            scale.id !== scaleId ? scale : { ...scale, songs: scale.songs.filter((song) => song.id !== songId) }
          )
        });
      },
      respondInvite(scaleId: string, assignmentId: string, status: 'aceito' | 'recusado') {
        persist({
          ...state,
          scales: state.scales.map((scale) =>
            scale.id !== scaleId
              ? scale
              : {
                  ...scale,
                  assignments: scale.assignments.map((assignment) =>
                    assignment.id !== assignmentId ? assignment : { ...assignment, status }
                  )
                }
          )
        });
      },
      suggestSong(input: { teamId: string; titulo: string; sugeridoPor: string }) {
        const song: SongSuggestion = { id: randomId(), ...input };
        persist({ ...state, songs: [...state.songs, song] });
      }
    }),
    [state]
  );

  return { state, actions };
}
