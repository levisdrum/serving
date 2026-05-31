import type { AppState, EventScale } from '../types';

export function formatScaleMessage(scale: EventScale, state: AppState) {
  const lines: string[] = [];

  lines.push(`Escala - ${scale.titulo}`);
  lines.push(`Data: ${scale.dataISO}`);
  lines.push(`Congregação: ${scale.congregacao}`);
  lines.push(`Playlist: ${scale.playlistLink || 'Sem link'}`);
  lines.push('');

  scale.assignments.forEach((assignment) => {
    const member = state.users.find((item) => item.id === assignment.memberId);
    lines.push(`- ${member?.nome ?? 'Membro'} (${assignment.status})`);
  });

  lines.push('');
  lines.push('Músicas:');
  if (scale.songs.length === 0) {
    lines.push('- Sem músicas cadastradas');
  } else {
    scale.songs.forEach((song) => {
      lines.push(`- ${song.titulo} — Tom ${song.tom}`);
    });
  }

  lines.push('');
  lines.push('Observações:');
  lines.push(scale.notes || 'Sem observações');

  return lines.join('\n');
}
