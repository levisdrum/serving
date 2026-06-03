import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { AdminPanel } from './admin-panel';
import type { AppState } from '../../domain/types';

const state: AppState = {
  users: [
    { id: 'u-admin', nome: 'Admin', email: 'admin@example.com', passwordHash: 'x', funcao: 'pastor', ministerioPrincipal: 'ministro-louvor', ministeriosSecundarios: [], congregacao: 'SP PM', role: 'admin' },
    { id: 'u-1', nome: 'Ana', email: 'ana@example.com', passwordHash: 'x', funcao: 'canta', ministerioPrincipal: 'vocalista', ministeriosSecundarios: [], congregacao: 'SP AM', role: 'membro' }
  ],
  teams: [{ id: 't-1', nome: 'Equipe 1', memberIds: ['u-admin', 'u-1'], roles: [], roleAssignments: [] }],
  scales: [],
  songs: []
};

describe('AdminPanel', () => {
  it('renderiza o título do painel', () => {
    render(
      <AdminPanel
        state={state}
        currentUser={state.users[0]}
        adminPage="summary"
        addUser={vi.fn()}
        updateUser={vi.fn()}
        removeUser={vi.fn()}
        addTeam={vi.fn()}
        updateTeam={vi.fn()}
        removeTeam={vi.fn()}
        addMemberToTeam={vi.fn()}
        addTeamRole={vi.fn()}
        updateTeamRole={vi.fn()}
        removeTeamRole={vi.fn()}
        assignMemberToTeamRole={vi.fn()}
        removeTeamRoleAssignment={vi.fn()}
        createScale={vi.fn()}
        updateScale={vi.fn()}
        updateScaleAssignment={vi.fn()}
        onNavigate={vi.fn()}
      />
    );

    expect(screen.getByText('Resumo')).toBeInTheDocument();
  });
});
