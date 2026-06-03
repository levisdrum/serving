import type { Congregacao, MinisterioTag, RoleTag, UserRole } from './types';

const TOKEN_PREFIX = 'serving-bootstrap:';

const CONGREGACOES = new Set<Congregacao>(['SP AM', 'SP PM', 'BH', 'PF']);
const MINISTERIOS = new Set<MinisterioTag>([
  'ministro-louvor',
  'vocalista',
  'violao',
  'guitarra',
  'baixo',
  'bateria',
  'teclado',
  'mesa-som',
  'projecao',
  'transmissao',
  'recepcao',
  'apoio',
  'intercessao',
  'danca',
  'outro',
  'nao-informado'
]);

const ROLES = new Set<UserRole>(['master', 'admin', 'membro']);

export type BootstrapUserInput = {
  nome: string;
  email: string;
  password: string;
  congregacao: Congregacao;
  role?: UserRole;
  funcao?: RoleTag;
  ministerioPrincipal?: MinisterioTag;
  ministeriosSecundarios?: MinisterioTag[];
  fotoUrl?: string;
  telefone?: string;
  observacao?: string;
};

export type BootstrapTokenPayload = {
  users: BootstrapUserInput[];
};

function decodeBase64Url(value: string) {
  const normalized = value.replace(/-/g, '+').replace(/_/g, '/');
  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '=');
  const binary = globalThis.atob(padded);
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function normalizeMinisterios(value: unknown): MinisterioTag[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is MinisterioTag => typeof item === 'string' && MINISTERIOS.has(item as MinisterioTag));
}

export function decodeBootstrapToken(token: string): BootstrapTokenPayload | null {
  const trimmed = token.trim();
  if (!trimmed) return null;

  try {
    const raw = trimmed.startsWith('{')
      ? trimmed
      : decodeBase64Url(trimmed.replace(TOKEN_PREFIX, ''));
    const parsed: unknown = JSON.parse(raw);

    if (!isRecord(parsed) || !Array.isArray(parsed.users)) return null;

    const users = parsed.users.reduce<BootstrapUserInput[]>((acc, item) => {
      if (!isRecord(item)) return acc;

      const nome = typeof item.nome === 'string' ? item.nome.trim() : '';
      const email = typeof item.email === 'string' ? item.email.trim().toLowerCase() : '';
      const password = typeof item.password === 'string' ? item.password.trim() : '';
      const congregacao = item.congregacao;
      const role = item.role;
      const ministerioPrincipal = item.ministerioPrincipal;

      if (!nome || !email || password.length < 3 || typeof congregacao !== 'string' || !CONGREGACOES.has(congregacao as Congregacao)) {
        return acc;
      }

      acc.push({
        nome,
        email,
        password,
        congregacao: congregacao as Congregacao,
        role: typeof role === 'string' && ROLES.has(role as UserRole) ? role as UserRole : undefined,
        funcao: typeof item.funcao === 'string' ? item.funcao as RoleTag : undefined,
        ministerioPrincipal: typeof ministerioPrincipal === 'string' && MINISTERIOS.has(ministerioPrincipal as MinisterioTag)
          ? ministerioPrincipal as MinisterioTag
          : 'nao-informado',
        ministeriosSecundarios: normalizeMinisterios(item.ministeriosSecundarios),
        fotoUrl: typeof item.fotoUrl === 'string' ? item.fotoUrl : undefined,
        telefone: typeof item.telefone === 'string' ? item.telefone : undefined,
        observacao: typeof item.observacao === 'string' ? item.observacao : undefined
      });

      return acc;
    }, []);

    return users.length > 0 ? { users } : null;
  } catch {
    return null;
  }
}
