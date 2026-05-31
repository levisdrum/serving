import { AvatarField } from '../../design-system/components/avatar-field/avatar-field';
import { Button } from '../../design-system/components/button/button';
import { MultiSelectTagGroup } from '../../design-system/components/multi-select-tag-group/multi-select-tag-group';
import { Select } from '../../design-system/components/select/select';
import { TextArea } from '../../design-system/components/text-area/text-area';
import { TextField } from '../../design-system/components/text-field/text-field';
import type { Congregacao, MemberProfile, MinisterioTag } from '../../domain/types';

interface Option { id: string; label: string }

interface ProfilePanelProps {
  currentUser: MemberProfile;
  ministerioOptions: Option[];
  profileNameDraft: string;
  profileEmailDraft: string;
  profileCongregacaoDraft: Congregacao;
  profileFotoUrlDraft: string;
  profileMinisterioPrincipalDraft: MinisterioTag;
  profileMinisteriosSecundariosDraft: MinisterioTag[];
  profileTelefoneDraft: string;
  profileObservacaoDraft: string;
  profileError: string;
  onProfileNameChange: (value: string) => void;
  onProfileEmailChange: (value: string) => void;
  onProfileCongregacaoChange: (value: Congregacao) => void;
  onProfileFotoUrlChange: (value: string) => void;
  onProfileMinisterioPrincipalChange: (value: MinisterioTag) => void;
  onProfileMinisteriosSecundariosChange: (value: MinisterioTag[]) => void;
  onProfileTelefoneChange: (value: string) => void;
  onProfileObservacaoChange: (value: string) => void;
  onSave: () => void;
  onCancel: () => void;
}

export function ProfilePanel(props: ProfilePanelProps) {
  return (
    <article className="card">
      <h2>Editar perfil</h2>
      <AvatarField label="Avatar" value={props.profileFotoUrlDraft} onChange={props.onProfileFotoUrlChange} />
      <TextField label="Nome" value={props.profileNameDraft} onChange={props.onProfileNameChange} />
      <TextField label="E-mail" value={props.profileEmailDraft} onChange={props.onProfileEmailChange} type="email" />
      <Select
        label="Congregação"
        selectedKey={props.profileCongregacaoDraft}
        onSelectionChange={(key) => props.onProfileCongregacaoChange(key as Congregacao)}
        options={[
          { id: 'SP AM', label: 'SP AM' },
          { id: 'SP PM', label: 'SP PM' },
          { id: 'BH', label: 'BH' },
          { id: 'PF', label: 'PF' }
        ]}
      />
      <TextField label="Papel de acesso" value={props.currentUser.role === 'admin' ? 'Admin' : props.currentUser.role === 'master' ? 'Master' : 'Membro'} onChange={() => {}} readOnly />
      <Select
        label="O que você faz (principal)"
        selectedKey={props.profileMinisterioPrincipalDraft}
        onSelectionChange={(key) => props.onProfileMinisterioPrincipalChange(key as MinisterioTag)}
        options={props.ministerioOptions}
      />
      <MultiSelectTagGroup
        label="Também faz (funções alternativas)"
        options={props.ministerioOptions.filter((item) => item.id !== props.profileMinisterioPrincipalDraft)}
        selectedKeys={props.profileMinisteriosSecundariosDraft}
        placeholder="Selecione uma função"
        onChange={(keys) => props.onProfileMinisteriosSecundariosChange(keys as MinisterioTag[])}
      />
      <TextField label="Telefone (opcional)" value={props.profileTelefoneDraft} onChange={props.onProfileTelefoneChange} />
      <TextArea label="Observação (opcional)" value={props.profileObservacaoDraft} onChange={props.onProfileObservacaoChange} />
      {props.profileError ? <p className="profile-form__error">{props.profileError}</p> : null}
      <div className="row">
        <Button onPress={props.onSave}>Salvar perfil</Button>
        <Button tone="neutral" onPress={props.onCancel}>Cancelar</Button>
      </div>
    </article>
  );
}

interface SettingsPanelProps {
  uiDensity: 'comfortable' | 'compact';
  onDensityChange: (next: 'comfortable' | 'compact') => void;
  onClose: () => void;
}

export function SettingsPanel({ uiDensity, onDensityChange, onClose }: SettingsPanelProps) {
  return (
    <article className="card">
      <h2>Configurações</h2>
      <Select
        label="Densidade da interface"
        selectedKey={uiDensity}
        onSelectionChange={(value) => onDensityChange(value as 'comfortable' | 'compact')}
        options={[
          { id: 'comfortable', label: 'Confortável' },
          { id: 'compact', label: 'Compacta' }
        ]}
      />
      <Button tone="neutral" onPress={onClose}>Fechar</Button>
    </article>
  );
}
