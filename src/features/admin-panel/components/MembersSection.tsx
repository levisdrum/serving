import {
  Cell,
  Column,
  Row,
  Table,
  TableBody,
  TableHeader,
} from "react-aria-components";
import { Button } from "../../../design-system/components/button/button";
import { Select } from "../../../design-system/components/select/select";
import { TextField } from "../../../design-system/components/text-field/text-field";
import type { Congregacao, MemberProfile, MinisterioTag, Team, UserRole } from "../../../domain/types";

type MembersSectionProps = {
  filteredMembers: MemberProfile[];
  memberSearch: string;
  setMemberSearch: (value: string) => void;
  memberFilterTeamId: string;
  setMemberFilterTeamId: (value: string) => void;
  teams: Team[];
  currentUser: MemberProfile;
  memberPasswordDrafts: Record<string, string>;
  setMemberPasswordDrafts: Dispatch<SetStateAction<Record<string, string>>>;
  updateUser: (
    userId: string,
    patch: {
      nome?: string;
      email?: string;
      congregacao?: Congregacao;
      role?: UserRole;
      ministerioPrincipal?: MinisterioTag;
      password?: string;
    },
    actorId?: string
  ) => void;
  removeUser: (userId: string, actorId?: string) => boolean;
  ministerioLabelMap: Record<MinisterioTag, string>;
  isMaster: boolean;
  showToast: (msg: string) => void;
};

export function MembersSection(props: MembersSectionProps) {
  return (
    <article className="card">
      <h3>Membros cadastrados</h3>
      <TextField
        label="Buscar por nome/email"
        value={props.memberSearch}
        onChange={props.setMemberSearch}
      />
      <Select
        label="Filtrar por equipe"
        selectedKey={props.memberFilterTeamId}
        onSelectionChange={props.setMemberFilterTeamId}
        options={[
          { id: "", label: "Todas" },
          ...props.teams.map((team) => ({ id: team.id, label: team.nome })),
        ]}
      />
      <div className="admin-members-table-wrap">
        <Table aria-label="Tabela de membros" className="admin-members-table">
          <TableHeader>
            <Column isRowHeader>Nome</Column>
            <Column>E-mail</Column>
            <Column>Congregação</Column>
            <Column>Papel</Column>
            <Column>Ministério principal</Column>
            <Column>Senha</Column>
            <Column>Ações</Column>
          </TableHeader>
          <TableBody items={props.filteredMembers}>
            {(user) => (
              <Row id={user.id}>
                <Cell>
                  <TextField
                    label="Nome"
                    value={user.nome}
                    onChange={(value) => props.updateUser(user.id, { nome: value })}
                    placeholder="Nome do membro"
                  />
                </Cell>
                <Cell>
                  <TextField
                    label="E-mail"
                    value={user.email}
                    onChange={(value) =>
                      props.updateUser(user.id, { email: value })
                    }
                    placeholder="email@337"
                  />
                </Cell>
                <Cell>
                  <Select
                    label="Congregação"
                    selectedKey={user.congregacao}
                    onSelectionChange={(value) =>
                      props.updateUser(user.id, {
                        congregacao: value as Congregacao,
                      })
                    }
                    options={[
                      { id: "SP AM", label: "SP AM" },
                      { id: "SP PM", label: "SP PM" },
                      { id: "BH", label: "BH" },
                      { id: "PF", label: "PF" },
                    ]}
                  />
                </Cell>
                <Cell>
                  {user.id === "u-master" ? (
                    <TextField label="Papel" value="Master" onChange={() => {}} readOnly />
                  ) : (
                    <Select
                      label="Papel"
                      selectedKey={user.role}
                      onSelectionChange={(value) =>
                        props.updateUser(user.id, { role: value as UserRole }, props.currentUser.id)
                      }
                      isDisabled={!props.isMaster || user.id === props.currentUser.id}
                      options={[
                        { id: "admin", label: "Admin" },
                        { id: "membro", label: "Membro" },
                      ]}
                    />
                  )}
                </Cell>
                <Cell>
                  <Select
                    label="Ministério principal"
                    selectedKey={user.ministerioPrincipal}
                    onSelectionChange={(value) =>
                      props.updateUser(user.id, { ministerioPrincipal: value as MinisterioTag })
                    }
                    options={Object.entries(props.ministerioLabelMap).map(([id, label]) => ({ id, label }))}
                  />
                </Cell>
                <Cell>
                  <TextField
                    label="Senha"
                    value={props.memberPasswordDrafts[user.id] ?? ""}
                    onChange={(value) =>
                      props.setMemberPasswordDrafts((prev) => ({
                        ...prev,
                        [user.id]: value,
                      }))
                    }
                    type="password"
                    placeholder="Definir nova senha"
                  />
                </Cell>
                <Cell>
                  <div className="admin-members-row-actions">
                    <Button
                      tone="neutral"
                      onPress={() => {
                        const raw = (props.memberPasswordDrafts[user.id] ?? "").trim();
                        if (!raw) {
                          props.showToast("Digite uma nova senha para salvar.");
                          return;
                        }
                        if (raw.length < 3) {
                          props.showToast("Senha deve ter no mínimo 3 caracteres.");
                          return;
                        }
                        props.updateUser(user.id, { password: raw }, props.currentUser.id);
                        props.setMemberPasswordDrafts((prev) => ({ ...prev, [user.id]: "" }));
                        props.showToast("Senha atualizada.");
                      }}
                    >
                      Salvar senha
                    </Button>
                  </div>
                  {(props.currentUser.role === "master" && user.role !== "master" && user.id !== props.currentUser.id) ||
                  (props.currentUser.role === "admin" && user.role === "membro") ? (
                    <Button tone="danger" onPress={() => {
                      const removed = props.removeUser(user.id, props.currentUser.id);
                      props.showToast(removed ? "Usuário excluído." : "Sem permissão para excluir este usuário.");
                    }}>
                      Excluir
                    </Button>
                  ) : (
                    <span>Protegido</span>
                  )}
                </Cell>
              </Row>
            )}
          </TableBody>
        </Table>
      </div>
      {props.filteredMembers.length === 0 ? (
        <p>Nenhum membro encontrado.</p>
      ) : null}
      <div className="admin-members-actions">
        <Button onPress={() => props.showToast("Alterações dos membros salvas.")}>
          Salvar alterações
        </Button>
      </div>
    </article>
  );
}
import type { Dispatch, SetStateAction } from "react";
