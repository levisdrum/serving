import { useState } from 'react';
import type { Congregacao, EventSong, MinisterioTag, RoleTag } from '../../../domain/types';
import type { AdminPanelProps } from '../types';

export function useAdminPanelState(state: AdminPanelProps['state']) {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('Membro337!');
  const [fotoUrl, setFotoUrl] = useState('');
  const [funcao, setFuncao] = useState<RoleTag>('canta');
  const [ministerioPrincipal, setMinisterioPrincipal] = useState<MinisterioTag>('nao-informado');
  const [congregacao, setCongregacao] = useState<Congregacao>('SP PM');
  const [teamName, setTeamName] = useState('');
  const [selectedTeamId, setSelectedTeamId] = useState(() => state.teams[0]?.id ?? '');
  const [selectedMemberId, setSelectedMemberId] = useState(() => state.users[0]?.id ?? '');
  const [roleName, setRoleName] = useState('');
  const [selectedRoleId, setSelectedRoleId] = useState('');
  const [scaleTitle, setScaleTitle] = useState('Culto de Domingo');
  const [scaleDate, setScaleDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [scaleMemberIds, setScaleMemberIds] = useState<string[]>([]);
  const [scaleMemberMinisterios, setScaleMemberMinisterios] = useState<Record<string, MinisterioTag>>({});
  const [scaleNotes, setScaleNotes] = useState('');
  const [scalePlaylistLink, setScalePlaylistLink] = useState('');
  const [memberSearch, setMemberSearch] = useState('');
  const [memberFilterTeamId, setMemberFilterTeamId] = useState('');
  const [selectedScaleId, setSelectedScaleId] = useState(() => state.scales[0]?.id ?? '');
  const [songDraft, setSongDraft] = useState<Omit<EventSong, 'id'>>({ titulo: '', tom: '', bpm: '', link: '', observacao: '' });
  const [copyFeedback, setCopyFeedback] = useState('');
  const [toast, setToast] = useState('');

  return {
    nome, setNome,
    email, setEmail,
    senha, setSenha,
    fotoUrl, setFotoUrl,
    funcao, setFuncao,
    ministerioPrincipal, setMinisterioPrincipal,
    congregacao, setCongregacao,
    teamName, setTeamName,
    selectedTeamId, setSelectedTeamId,
    selectedMemberId, setSelectedMemberId,
    roleName, setRoleName,
    selectedRoleId, setSelectedRoleId,
    scaleTitle, setScaleTitle,
    scaleDate, setScaleDate,
    scaleMemberIds, setScaleMemberIds,
    scaleMemberMinisterios, setScaleMemberMinisterios,
    scaleNotes, setScaleNotes,
    scalePlaylistLink, setScalePlaylistLink,
    memberSearch, setMemberSearch,
    memberFilterTeamId, setMemberFilterTeamId,
    selectedScaleId, setSelectedScaleId,
    songDraft, setSongDraft,
    copyFeedback, setCopyFeedback,
    toast, setToast,
  };
}
