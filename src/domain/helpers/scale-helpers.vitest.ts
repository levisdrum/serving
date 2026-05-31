import { describe, expect, it } from 'vitest';
import { summarizeInviteStatuses, upcomingScales } from './scale-helpers';
import type { EventScale } from '../types';

const scales: EventScale[] = [
  {
    id: 's1',
    ownerAdminId: 'u-admin',
    congregacao: 'SP PM',
    titulo: 'Culto A',
    dataISO: '2026-06-01',
    assignments: [
      { id: 'a1', memberId: 'u1', status: 'pendente' },
      { id: 'a2', memberId: 'u2', status: 'aceito' }
    ],
    songs: [],
    notes: ''
  },
  {
    id: 's2',
    ownerAdminId: 'u-admin',
    congregacao: 'SP PM',
    titulo: 'Culto B',
    dataISO: '2026-05-01',
    assignments: [{ id: 'a3', memberId: 'u3', status: 'recusado' }],
    songs: [],
    notes: ''
  }
];

describe('scale helpers', () => {
  it('resume status dos convites', () => {
    expect(summarizeInviteStatuses(scales)).toEqual({ pendente: 1, aceito: 1, recusado: 1 });
  });

  it('retorna próximas escalas ordenadas', () => {
    const next = upcomingScales(scales, '2026-05-20');
    expect(next.map((item) => item.id)).toEqual(['s1']);
  });
});
