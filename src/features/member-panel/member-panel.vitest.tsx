import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { MemberPanel } from './member-panel';
import type { AppState } from '../../domain/types';

const state: AppState = {
  users: [
    { id: 'u-admin', nome: 'Admin', email: 'admin@337', passwordHash: 'x', funcao: 'pastor', ministerioPrincipal: 'ministro-louvor', ministeriosSecundarios: [], congregacao: 'SP PM', role: 'admin' },
    { id: 'u-1', nome: 'Ana', email: 'ana@337', passwordHash: 'x', funcao: 'canta', ministerioPrincipal: 'vocalista', ministeriosSecundarios: [], congregacao: 'SP AM', role: 'membro' }
  ],
  teams: [{ id: 't-1', nome: 'Equipe 1', memberIds: ['u-admin', 'u-1'], roles: [{ id: 'r-1', nome: 'Vocal' }], roleAssignments: [] }],
  scales: [{ id: 's-1', ownerAdminId: 'u-admin', congregacao: 'SP AM', titulo: 'Culto', dataISO: '2026-06-01', assignments: [{ id: 'a-1', memberId: 'u-1', status: 'pendente' }], songs: [], notes: '', playlistLink: '' }],
  songs: []
};

describe('MemberPanel', () => {
  it('renderiza a área do membro', () => {
    const currentUser = state.users.find((u) => u.id === 'u-1')!;
    render(<MemberPanel state={state} currentUser={currentUser} respondInvite={vi.fn()} />);
    expect(screen.getByText('Minhas Escalas')).toBeInTheDocument();
  });
});
