import { describe, expect, it } from 'vitest';
import { canRemoveUser } from './store';
import type { MemberProfile } from './types';

function makeUser(id: string, role: MemberProfile['role']): MemberProfile {
  return {
    id,
    nome: `${role}-${id}`,
    email: `${role}-${id}@337`,
    passwordHash: 'hash',
    funcao: 'canta',
    ministerioPrincipal: 'vocalista',
    ministeriosSecundarios: [],
    congregacao: 'SP PM',
    role
  };
}

describe('canRemoveUser', () => {
  it('permite master excluir admin e membro', () => {
    const master = makeUser('u-master', 'master');
    const admin = makeUser('u-admin', 'admin');
    const membro = makeUser('u-membro', 'membro');
    expect(canRemoveUser(master, admin)).toBe(true);
    expect(canRemoveUser(master, membro)).toBe(true);
  });

  it('não permite admin excluir admin ou master', () => {
    const adminA = makeUser('u-admin-a', 'admin');
    const adminB = makeUser('u-admin-b', 'admin');
    const master = makeUser('u-master', 'master');
    expect(canRemoveUser(adminA, adminB)).toBe(false);
    expect(canRemoveUser(adminA, master)).toBe(false);
  });

  it('permite admin excluir membro', () => {
    const admin = makeUser('u-admin', 'admin');
    const membro = makeUser('u-membro', 'membro');
    expect(canRemoveUser(admin, membro)).toBe(true);
  });

  it('não permite excluir a si mesmo', () => {
    const admin = makeUser('u-admin', 'admin');
    expect(canRemoveUser(admin, admin)).toBe(false);
  });

  it('não permite membro excluir ninguém', () => {
    const membro = makeUser('u-membro', 'membro');
    const outro = makeUser('u-outro', 'membro');
    expect(canRemoveUser(membro, outro)).toBe(false);
  });
});
