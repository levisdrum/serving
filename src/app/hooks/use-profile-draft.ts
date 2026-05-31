import { useState } from 'react';
import type { Congregacao, MemberProfile, MinisterioTag } from '../../domain/types';

export function useProfileDraft() {
  const [profileNameDraft, setProfileNameDraft] = useState('');
  const [profileEmailDraft, setProfileEmailDraft] = useState('');
  const [profileCongregacaoDraft, setProfileCongregacaoDraft] = useState<Congregacao>('SP PM');
  const [profileFotoUrlDraft, setProfileFotoUrlDraft] = useState('');
  const [profileMinisterioPrincipalDraft, setProfileMinisterioPrincipalDraft] = useState<MinisterioTag>('nao-informado');
  const [profileMinisteriosSecundariosDraft, setProfileMinisteriosSecundariosDraft] = useState<MinisterioTag[]>([]);
  const [profileTelefoneDraft, setProfileTelefoneDraft] = useState('');
  const [profileObservacaoDraft, setProfileObservacaoDraft] = useState('');
  const [profileError, setProfileError] = useState('');

  const loadFromUser = (user: MemberProfile) => {
    setProfileNameDraft(user.nome);
    setProfileEmailDraft(user.email);
    setProfileCongregacaoDraft(user.congregacao);
    setProfileFotoUrlDraft(user.fotoUrl ?? '');
    setProfileMinisterioPrincipalDraft(user.ministerioPrincipal);
    setProfileMinisteriosSecundariosDraft(user.ministeriosSecundarios);
    setProfileTelefoneDraft(user.telefone ?? '');
    setProfileObservacaoDraft(user.observacao ?? '');
    setProfileError('');
  };

  return {
    profileNameDraft,
    profileEmailDraft,
    profileCongregacaoDraft,
    profileFotoUrlDraft,
    profileMinisterioPrincipalDraft,
    profileMinisteriosSecundariosDraft,
    profileTelefoneDraft,
    profileObservacaoDraft,
    profileError,
    setProfileNameDraft,
    setProfileEmailDraft,
    setProfileCongregacaoDraft,
    setProfileFotoUrlDraft,
    setProfileMinisterioPrincipalDraft,
    setProfileMinisteriosSecundariosDraft,
    setProfileTelefoneDraft,
    setProfileObservacaoDraft,
    setProfileError,
    loadFromUser,
  };
}
