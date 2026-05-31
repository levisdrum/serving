import type { EventScale, InviteStatus } from '../types';

export function summarizeInviteStatuses(scales: EventScale[]) {
  const summary: Record<InviteStatus, number> = {
    pendente: 0,
    aceito: 0,
    recusado: 0
  };

  scales.forEach((scale) => {
    scale.assignments.forEach((assignment) => {
      summary[assignment.status] += 1;
    });
  });

  return summary;
}

export function upcomingScales(scales: EventScale[], todayISO: string) {
  return scales
    .filter((scale) => scale.dataISO >= todayISO)
    .sort((a, b) => a.dataISO.localeCompare(b.dataISO));
}
