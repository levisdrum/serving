import { useMemo, useState } from 'react';
import { decodeBootstrapToken } from './bootstrap-token';
import { decryptState, encryptState, hashPassword } from './security';
import type {
  AppState,
  Congregacao,
  EventScale,
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
  notes?: string;
};

const STORAGE_KEY = 'louvor-local-app-state-v3';
const seedTeamRoles: TeamRole[] = [
  { id: 'r-vocal', nome: 'Vocal' },
  { id: 'r-violao', nome: 'Violão' }
];

const seedRoleAssignments: TeamRoleAssignment[] = [];

const seedState: AppState = {
  users: [],
  teams: [
    {
      id: 't-1',
      nome: 'Louvor Domingo',
      memberIds: [],
      roles: seedTeamRoles,
      roleAssignments: seedRoleAssignments
    }
  ],
  scales: [],
  songs: []
};

const randomId = () => Math.random().toString(36).slice(2, 9);

function migrateLoginEmail(email: string) {
  return email.trim().toLowerCase();
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

  let masterSeen = false;
  const users: MemberProfile[] = (maybe.users ?? seedState.users).map((user) => {
    const normalizedRole: UserRole = user.role === 'master' && !masterSeen ? 'master' : user.role === 'master' ? 'admin' : user.role;
    if (normalizedRole === 'master') masterSeen = true;

    return {
      id: user.id,
      nome: user.nome,
      email: migrateLoginEmail(user.email),
      passwordHash: user.passwordHash ?? '',
      role: normalizedRole,
      funcao: (user.funcao as RoleTag) ?? 'canta',
      ministerioPrincipal: (user.ministerioPrincipal as MinisterioTag) ?? roleTagToMinisterio(user.funcao as RoleTag),
      ministeriosSecundarios: user.ministeriosSecundarios ?? [],
      fotoUrl: user.fotoUrl ?? '',
      telefone: user.telefone ?? '',
      observacao: user.observacao ?? '',
      congregacao: (user.congregacao as Congregacao) ?? 'SP PM'
    };
  });

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
        password: string;
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
        const safePassword = password.trim();
        if (safePassword.length < 3) return;
        const isFirstUser = state.users.length === 0;
        const createdUser: MemberProfile = {
          id: randomId(),
          fotoUrl: '',
          telefone: '',
          observacao: '',
          ...rest,
          role: isFirstUser ? 'master' : 'membro',
          passwordHash: hashPassword(safePassword)
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
      importBootstrapToken(token: string) {
        const payload = decodeBootstrapToken(token);
        if (!payload) return false;

        let masterSeen = state.users.some((user) => user.role === 'master');
        const existingEmails = new Set(state.users.map((user) => user.email.toLowerCase()));
        const users = payload.users.reduce<MemberProfile[]>((acc, user, index) => {
          if (existingEmails.has(user.email)) return acc;

          const requestedRole = user.role ?? (state.users.length === 0 && index === 0 ? 'master' : 'membro');
          const role: UserRole = requestedRole === 'master'
            ? masterSeen
              ? 'admin'
              : 'master'
            : requestedRole;

          if (role === 'master') masterSeen = true;
          existingEmails.add(user.email);

          acc.push({
            id: randomId(),
            nome: user.nome,
            email: user.email,
            passwordHash: hashPassword(user.password),
            fotoUrl: user.fotoUrl ?? '',
            funcao: user.funcao ?? 'outro',
            ministerioPrincipal: user.ministerioPrincipal ?? 'nao-informado',
            ministeriosSecundarios: user.ministeriosSecundarios ?? [],
            telefone: user.telefone ?? '',
            observacao: user.observacao ?? '',
            congregacao: user.congregacao,
            role
          });

          return acc;
        }, []);

        if (users.length === 0) return false;

        const next: AppState = {
          ...state,
          users: [...state.users, ...users]
        };
        persist(next);
        return true;
      },
      resetLocalPassword(email: string, password: string) {
        const normalizedEmail = email.trim().toLowerCase();
        const safePassword = password.trim();
        if (!normalizedEmail || safePassword.length < 3) return false;

        let updated = false;
        commit((prev) => {
          const users = prev.users.map((user) => {
            if (user.email.toLowerCase() !== normalizedEmail) return user;
            updated = true;
            return {
              ...user,
              passwordHash: hashPassword(safePassword)
            };
          });

          return { ...prev, users };
        });

        return updated;
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
          password?: string;
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
              } else if (user.role === 'master') {
                safePatch.role = 'master';
              } else if (safePatch.role === 'master') {
                safePatch.role = 'admin';
              }
            }

            const nextUser: MemberProfile = { ...user, ...safePatch };
            if (typeof patch.password === 'string' && patch.password.trim()) {
              nextUser.passwordHash = hashPassword(patch.password.trim());
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
