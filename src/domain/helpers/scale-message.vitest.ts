import { describe, expect, it } from 'vitest';
import { formatScaleMessage } from './scale-message';
import type { AppState, EventScale } from '../types';

const state: AppState = {
  users: [{ id: 'u1', nome: 'Ana', email: 'ana@337', passwordHash: 'x', funcao: 'canta', ministerioPrincipal: 'vocalista', ministeriosSecundarios: [], congregacao: 'SP PM', role: 'membro' }],
  teams: [{ id: 't1', nome: 'Louvor', memberIds: ['u1'], roles: [{ id: 'r1', nome: 'Vocal' }], roleAssignments: [] }],
  scales: [],
  songs: []
};

const scale: EventScale = {
  id: 's1',
  ownerAdminId: 'u-admin',
  congregacao: 'SP PM',
  titulo: 'Culto Domingo',
  dataISO: '2026-06-01',
  assignments: [{ id: 'a1', memberId: 'u1', status: 'aceito' }],
  songs: [{ id: 'sg1', titulo: 'Digno', tom: 'G' }],
  notes: 'Ensaio 15h45',
  playlistLink: 'https://playlist.local'
};

describe('scale message', () => {
  it('formata mensagem amigável', () => {
    const message = formatScaleMessage(scale, state);
    expect(message).toContain('Escala - Culto Domingo');
    expect(message).toContain('Ana (aceito)');
    expect(message).toContain('Playlist: https://playlist.local');
    expect(message).toContain('Músicas:');
  });
});
