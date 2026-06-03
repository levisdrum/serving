import { useMemo, useState } from 'react';
import { Button } from '../../design-system/components/button/button';
import { EmptyState } from '../../design-system/components/empty-state/empty-state';
import { Select } from '../../design-system/components/select/select';
import { StatusBadge } from '../../design-system/components/status-badge/status-badge';
import type { EventScale, ScaleAssignment } from '../../domain/types';
import type { MemberPanelProps } from './types';
import './styles.css';

const STATUS_LABEL: Record<string, string> = {
  pendente: 'Pendente',
  aceito: 'Aceito',
  recusado: 'Recusado',
};

const MINISTERIO_LABEL: Record<string, string> = {
  'ministro-louvor': 'Ministro de louvor',
  vocalista: 'Vocalista',
  violao: 'Violão',
  guitarra: 'Guitarra',
  baixo: 'Baixo',
  bateria: 'Bateria',
  teclado: 'Teclado',
  'mesa-som': 'Mesa de som',
  projecao: 'Projeção',
  transmissao: 'Transmissão',
  recepcao: 'Recepção',
  apoio: 'Apoio',
  intercessao: 'Intercessão',
  danca: 'Dança',
  outro: 'Outro',
  'nao-informado': 'Não informado',
};

function formatDate(isoDate: string) {
  return new Date(isoDate + 'T12:00:00').toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}

function toSpotifyEmbedUrl(url: string) {
  if (!url.includes('spotify.com')) return null;
  const match = url.match(/spotify\.com\/(track|album|playlist|artist)\/([a-zA-Z0-9]+)/);
  if (!match) return null;
  return `https://open.spotify.com/embed/${match[1]}/${match[2]}?utm_source=generator`;
}

export function MemberPanel({ state, currentUser, respondInvite }: MemberPanelProps) {
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedScaleId, setSelectedScaleId] = useState<string | null>(null);

  const myTeams = useMemo(
    () => state.teams.filter((t) => t.memberIds.includes(currentUser.id)),
    [state.teams, currentUser.id]
  );

  const myScales = useMemo(
    () => {
      const next = state.scales.reduce<Array<EventScale & { myAssignments: ScaleAssignment[] }>>((acc, scale) => {
        const myAssignments = scale.assignments.filter((a) => a.memberId === currentUser.id);
        if (myAssignments.length === 0) return acc;
        if (statusFilter && !myAssignments.some((a) => a.status === statusFilter)) return acc;
        acc.push({ ...scale, myAssignments });
        return acc;
      }, []);
      return next.sort((a, b) => a.dataISO.localeCompare(b.dataISO));
    },
    [state.scales, currentUser.id, statusFilter]
  );

  // --- Detalhe de escala ---
  if (selectedScaleId) {
    const scale = state.scales.find((s) => s.id === selectedScaleId);
    if (!scale) {
      setSelectedScaleId(null);
      return null;
    }

    const myAssignment = scale.assignments.find((a) => a.memberId === currentUser.id);

    // Membros escalados com seus times e funções
    const escalatedMembers = scale.assignments.map((a) => {
      const member = state.users.find((u) => u.id === a.memberId);
      const teamForMember = state.teams.find((t) => t.memberIds.includes(a.memberId));
      const roleAssignment = teamForMember?.roleAssignments.find((ra) => ra.memberId === a.memberId);
      const role = roleAssignment ? teamForMember?.roles.find((r) => r.id === roleAssignment.teamRoleId) : null;
      return { member, assignment: a, team: teamForMember, role };
    });

    return (
      <section className="member-panel">
        <div className="member-panel__detail-header">
          <div className="member-panel__detail-nav">
            <Button onPress={() => setSelectedScaleId(null)}>
              <span className="material-symbols-rounded" aria-hidden="true">arrow_back</span>
              Voltar
            </Button>
            {myAssignment && (
              <StatusBadge tone={myAssignment.status as 'pendente' | 'aceito' | 'recusado'} label={STATUS_LABEL[myAssignment.status] ?? myAssignment.status} />
            )}
          </div>
          <div>
            <h2>{scale.titulo}</h2>
            <p className="member-panel__scale-sub">{formatDate(scale.dataISO)} · {scale.congregacao}</p>
          </div>
        </div>

        {myAssignment?.status === 'pendente' && (
          <article className="card member-panel__invite-card">
            <p>Você foi convidado para esta escala. Confirme sua participação:</p>
            <div className="row">
              <Button onPress={() => { respondInvite(scale.id, myAssignment.id, 'aceito'); setSelectedScaleId(null); }}>
                Aceitar
              </Button>
              <Button tone="danger" onPress={() => { respondInvite(scale.id, myAssignment.id, 'recusado'); setSelectedScaleId(null); }}>
                Recusar
              </Button>
            </div>
          </article>
        )}

        <article className="card">
          <h3>
            <span className="material-symbols-rounded" aria-hidden="true">groups</span>
            Time escalado
          </h3>
          {escalatedMembers.length === 0 ? (
            <EmptyState message="Nenhum membro escalado." icon="group_off" />
          ) : (
            <ul className="member-panel__escalated">
              {escalatedMembers.map(({ member, assignment, role }) => {
                const funcao = assignment.ministerio
                  ? MINISTERIO_LABEL[assignment.ministerio]
                  : role?.nome ?? (member ? MINISTERIO_LABEL[member.ministerioPrincipal] : null);
                const isMe = member?.id === currentUser.id;
                return (
                  <li
                    key={assignment.id}
                    className={`member-panel__escalated-item${isMe ? ' member-panel__escalated-item--me' : ''}`}
                  >
                    <div className="member-panel__escalated-avatar" aria-hidden="true">
                      {member?.fotoUrl
                        ? <img src={member.fotoUrl} alt="" className="member-panel__escalated-avatar-img" />
                        : <span className="material-symbols-rounded">person</span>
                      }
                    </div>
                    <div className="member-panel__escalated-info">
                      <div className="member-panel__escalated-name">
                        <span>{member?.nome ?? 'Membro'}</span>
                        {isMe && <span className="member-panel__team-you">Você</span>}
                      </div>
                      <div className="member-panel__escalated-meta">
                        {funcao && <span className="member-panel__escalated-role">{funcao}</span>}
                        <StatusBadge tone={assignment.status as 'pendente' | 'aceito' | 'recusado'} label={STATUS_LABEL[assignment.status] ?? assignment.status} />
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </article>

        <article className="card">
          <h3>Playlist</h3>
          {scale.playlistLink ? (
            (() => {
              const embedUrl = toSpotifyEmbedUrl(scale.playlistLink);
              if (embedUrl) {
                return (
                  <div className="member-panel__spotify-frame">
                    <iframe
                      title="Playlist no Spotify"
                      src={embedUrl}
                      loading="lazy"
                      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                    />
                  </div>
                );
              }
              return (
                <a className="member-panel__playlist-link" href={scale.playlistLink} target="_blank" rel="noreferrer">
                  <span className="material-symbols-rounded" aria-hidden="true">playlist_play</span>
                  Abrir playlist completa
                </a>
              );
            })()
          ) : null}
        </article>

        {scale.notes && (
          <article className="card">
            <h3>
              <span className="material-symbols-rounded" aria-hidden="true">notes</span>
              Observações
            </h3>
            <p className="member-panel__notes">{scale.notes}</p>
          </article>
        )}
      </section>
    );
  }

  // --- Lista de escalas ---
  const pendingCount = myScales.reduce((acc, s) => acc + s.myAssignments.filter((a) => a.status === 'pendente').length, 0);

  return (
    <section className="member-panel">
      {pendingCount > 0 && (
        <output className="member-panel__pending-banner" aria-live="polite">
          <span className="material-symbols-rounded" aria-hidden="true">notifications_active</span>
          <span>{pendingCount === 1 ? 'Você tem 1 convite pendente' : `Você tem ${pendingCount} convites pendentes`}: responda abaixo.</span>
        </output>
      )}

      <article className="card">
        <h3>Minhas Escalas</h3>
        <div className="row">
          <Select
            label="Filtrar por status"
            selectedKey={statusFilter}
            onSelectionChange={setStatusFilter}
            options={[
              { id: '', label: 'Todas' },
              { id: 'pendente', label: 'Pendente' },
              { id: 'aceito', label: 'Aceito' },
              { id: 'recusado', label: 'Recusado' },
            ]}
          />
        </div>

        {myScales.length === 0 ? (
          <EmptyState message="Nenhuma escala encontrada." icon="event_busy" />
        ) : (
          <ul className="member-panel__scales">
            {myScales.map((scale) => {
              const dominant = scale.myAssignments.some((a) => a.status === 'pendente')
                ? 'pendente'
                : scale.myAssignments.some((a) => a.status === 'aceito')
                  ? 'aceito'
                  : 'recusado';
              return (
              <li key={scale.id} className={`member-panel__scale-item member-panel__scale-item--${dominant}`}>
                <div className="member-panel__scale-header">
                  <strong>{scale.titulo}</strong>
                  <span className="member-panel__scale-date">
                    {new Date(scale.dataISO + 'T12:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </span>
                </div>
                <p className="member-panel__scale-sub">{scale.congregacao}</p>

                {scale.myAssignments.map((assignment) => (
                  <div key={assignment.id} className="member-panel__assignment">
                    <StatusBadge tone={assignment.status as 'pendente' | 'aceito' | 'recusado'} label={STATUS_LABEL[assignment.status] ?? assignment.status} />
                    {assignment.status === 'pendente' && (
                      <div className="row">
                        <Button onPress={() => respondInvite(scale.id, assignment.id, 'aceito')}>Aceitar</Button>
                        <Button tone="danger" onPress={() => respondInvite(scale.id, assignment.id, 'recusado')}>Recusar</Button>
                      </div>
                    )}
                  </div>
                ))}

                <div className="member-panel__scale-footer">
                  <button type="button" className="member-panel__ver-mais" onClick={() => setSelectedScaleId(scale.id)}>
                    Ver detalhes
                    <span className="material-symbols-rounded" aria-hidden="true">chevron_right</span>
                  </button>
                </div>
              </li>
              );
            })}
          </ul>
        )}
      </article>

      <article className="card">
        <h3>Minhas Equipes</h3>
        {myTeams.length === 0 ? (
          <EmptyState message="Você ainda não foi adicionado a nenhuma equipe." icon="group_off" />
        ) : (
          <ul className="member-panel__teams">
            {myTeams.map((team) => (
              <li key={team.id} className="member-panel__team-item">
                <strong>{team.nome}</strong>
                <ul className="member-panel__team-members">
                  {team.memberIds.map((memberId) => {
                    const member = state.users.find((u) => u.id === memberId);
                    if (!member) return null;
                    const roleAssignment = team.roleAssignments.find((ra) => ra.memberId === memberId);
                    const role = roleAssignment ? team.roles.find((r) => r.id === roleAssignment.teamRoleId) : null;
                    return (
                      <li key={memberId} className={`member-panel__team-member${memberId === currentUser.id ? ' member-panel__team-member--me' : ''}`}>
                        <span className="material-symbols-rounded" aria-hidden="true">person</span>
                        <span>{member.nome}</span>
                        {role && <span className="member-panel__team-role">{role.nome}</span>}
                        {memberId === currentUser.id && <span className="member-panel__team-you">Você</span>}
                      </li>
                    );
                  })}
                </ul>
              </li>
            ))}
          </ul>
        )}
      </article>
    </section>
  );
}
