import { useEffect, useMemo } from "react";
import { Button } from "../../design-system/components/button/button";
import { AvatarField } from "../../design-system/components/avatar-field/avatar-field";
import { DatePickerField } from "../../design-system/components/date-picker/date-picker";
import { EmptyState } from "../../design-system/components/empty-state/empty-state";
import { MultiSelectTagGroup } from "../../design-system/components/multi-select-tag-group/multi-select-tag-group";
import { Select } from "../../design-system/components/select/select";
import { StatusBadge } from "../../design-system/components/status-badge/status-badge";
import { TextArea } from "../../design-system/components/text-area/text-area";
import { TextField } from "../../design-system/components/text-field/text-field";
import {
  summarizeInviteStatuses,
  upcomingScales,
} from "../../domain/helpers/scale-helpers";
import type {
  Congregacao,
  MinisterioTag,
  RoleTag,
} from "../../domain/types";
import type { AdminPanelProps } from "./types";
import { useAdminPanelState } from "./hooks/use-admin-panel-state";
import { MembersSection } from "./components/MembersSection";
import "./styles.css";

const STATUS_LABEL: Record<string, string> = {
  pendente: "Pendente",
  aceito: "Aceito",
  recusado: "Recusado",
};

const MINISTERIO_LABEL_MAP: Record<MinisterioTag, string> = {
  "ministro-louvor": "Ministro de louvor",
  vocalista: "Vocalista",
  violao: "Violão",
  guitarra: "Guitarra",
  baixo: "Baixo",
  bateria: "Bateria",
  teclado: "Teclado",
  "mesa-som": "Mesa de som",
  projecao: "Projeção",
  transmissao: "Transmissão",
  recepcao: "Recepção",
  apoio: "Apoio",
  intercessao: "Intercessão",
  danca: "Dança",
  outro: "Outro",
  "nao-informado": "Não informado",
};

function formatDate(isoDate: string) {
  return new Date(isoDate + "T12:00:00").toLocaleDateString("pt-BR", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function buildMinisterioOptions(
  principal: MinisterioTag,
  secundarios: MinisterioTag[],
  labels: Record<MinisterioTag, string>,
) {
  const options: Array<{ id: MinisterioTag; label: string }> = [
    { id: principal, label: labels[principal] },
  ];
  for (const ministerio of secundarios) {
    if (ministerio === principal) continue;
    options.push({ id: ministerio, label: labels[ministerio] });
  }
  return options;
}

export function AdminPanel({
  state,
  currentUser,
  adminPage,
  addUser,
  updateUser,
  removeUser,
  addTeam,
  updateTeam,
  removeTeam,
  addMemberToTeam,
  addTeamRole,
  updateTeamRole,
  removeTeamRole,
  assignMemberToTeamRole,
  removeTeamRoleAssignment,
  createScale,
  updateScale,
  updateScaleAssignment,
  onNavigate,
}: AdminPanelProps) {
  const ministerioLabelMap = MINISTERIO_LABEL_MAP;
  const {
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
    memberPasswordDrafts, setMemberPasswordDrafts,
    selectedScaleId, setSelectedScaleId,
    toast, setToast,
  } = useAdminPanelState(state);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  const selectedTeam = useMemo(
    () => state.teams.find((item) => item.id === selectedTeamId),
    [state.teams, selectedTeamId],
  );

  const isMaster = currentUser.role === "master";
  const visibleUsers = useMemo(
    () =>
      isMaster
        ? state.users
        : state.users.filter(
            (user) => user.congregacao === currentUser.congregacao,
          ),
    [state.users, isMaster, currentUser.congregacao],
  );

  const teamMembers = useMemo(
    () =>
      state.users.filter((user) => selectedTeam?.memberIds.includes(user.id)),
    [state.users, selectedTeam],
  );

  const roleOptions = useMemo(
    () => selectedTeam?.roles.map((role) => ({ id: role.id, label: role.nome })) ?? [],
    [selectedTeam],
  );
  const memberOptions = useMemo(
    () =>
      teamMembers.map((user) => ({
        id: user.id,
        label: `${user.nome} (${ministerioLabelMap[user.ministerioPrincipal]})`,
      })),
    [teamMembers, ministerioLabelMap],
  );

  useEffect(() => {
    if (!selectedTeamId) return;
    if (!roleOptions.length) {
      setSelectedRoleId("");
      return;
    }
    const exists = roleOptions.some((option) => option.id === selectedRoleId);
    if (!exists) {
      setSelectedRoleId(roleOptions[0].id);
    }
  }, [selectedTeamId, roleOptions, selectedRoleId, setSelectedRoleId]);

  useEffect(() => {
    if (!selectedTeamId) return;
    if (!memberOptions.length) {
      setSelectedMemberId("");
      return;
    }
    const exists = memberOptions.some((option) => option.id === selectedMemberId);
    if (!exists) {
      setSelectedMemberId(memberOptions[0].id);
    }
  }, [selectedTeamId, memberOptions, selectedMemberId, setSelectedMemberId]);

  const summary = summarizeInviteStatuses(state.scales);
  const upcoming = upcomingScales(
    state.scales,
    new Date().toISOString().slice(0, 10),
  );

  const filteredMembers = visibleUsers.filter((user) => {
    const matchesSearch = `${user.nome} ${user.email}`
      .toLowerCase()
      .includes(memberSearch.toLowerCase());
    const matchesTeam =
      !memberFilterTeamId ||
      state.teams
        .find((team) => team.id === memberFilterTeamId)
        ?.memberIds.includes(user.id);
    return matchesSearch && matchesTeam;
  });

  const selectedScale = state.scales.find(
    (scale) => scale.id === selectedScaleId,
  );
  const scaleMemberOptions = visibleUsers.reduce<Array<{ id: string; label: string }>>((acc, user) => {
    if (user.role === "master") return acc;
    acc.push({
      id: user.id,
      label: `${user.nome} · ${ministerioLabelMap[user.ministerioPrincipal]}`,
    });
    return acc;
  }, []);

  return (
    <section className="admin-panel">
      {toast ? (
        <output className="admin-toast" aria-live="polite">
          <span className="material-symbols-rounded" aria-hidden="true">
            check_circle
          </span>
          {toast}
        </output>
      ) : null}

      {adminPage === "summary" ? (
        <article className="card">
          <h3>Resumo</h3>
          <div className="admin-summary-grid">
            <div className="admin-kpi">
              <span
                className="material-symbols-rounded admin-kpi__icon"
                aria-hidden="true"
              >
                group
              </span>
              <strong>{state.users.length}</strong>
              <span>Total de membros</span>
            </div>
            <div className="admin-kpi">
              <span
                className="material-symbols-rounded admin-kpi__icon"
                aria-hidden="true"
              >
                hub
              </span>
              <strong>{state.teams.length}</strong>
              <span>Total de equipes</span>
            </div>
            <div className="admin-kpi">
              <span
                className="material-symbols-rounded admin-kpi__icon"
                aria-hidden="true"
              >
                event
              </span>
              <strong>{state.scales.length}</strong>
              <span>Total de escalas</span>
            </div>
            <div className="admin-kpi admin-kpi--warning">
              <span
                className="material-symbols-rounded admin-kpi__icon"
                aria-hidden="true"
              >
                pending_actions
              </span>
              <strong>{summary.pendente}</strong>
              <span>Convites pendentes</span>
            </div>
            <div className="admin-kpi admin-kpi--success">
              <span
                className="material-symbols-rounded admin-kpi__icon"
                aria-hidden="true"
              >
                check_circle
              </span>
              <strong>{summary.aceito}</strong>
              <span>Convites aceitos</span>
            </div>
            <div className="admin-kpi admin-kpi--danger">
              <span
                className="material-symbols-rounded admin-kpi__icon"
                aria-hidden="true"
              >
                cancel
              </span>
              <strong>{summary.recusado}</strong>
              <span>Convites recusados</span>
            </div>
          </div>
          <h4>Próximas escalas</h4>
          {upcoming.length === 0 ? (
            <EmptyState
              icon="event_busy"
              message="Nenhuma escala futura cadastrada."
              className="admin-empty-state"
              action={
              <Button tone="primary" className="admin-empty-state__action" onPress={() => onNavigate("create-scale")}>
                <span className="material-symbols-rounded" aria-hidden="true">add</span>
                Criar primeira escala
              </Button>
              }
            />
          ) : (
            <ul className="admin-upcoming-list">
              {upcoming.slice(0, 5).map((scale) => (
                <li key={scale.id} className="admin-upcoming-item">
                  <div className="admin-upcoming-info">
                    <strong>{scale.titulo}</strong>
                    <span className="admin-upcoming-date">
                      {formatDate(scale.dataISO)}
                    </span>
                    <span className="admin-upcoming-congregacao">
                      {scale.congregacao}
                    </span>
                  </div>
                  <Button
                    tone="neutral"
                    onPress={() => {
                      setSelectedScaleId(scale.id);
                      onNavigate("scale-detail");
                    }}
                  >
                    Ver detalhes
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </article>
      ) : null}

      {adminPage === "add-member" ? (
        <article className="card">
          <h3>Adicionar Membro</h3>
          <TextField label="Nome" value={nome} onChange={setNome} placeholder="Nome completo" />
          <TextField label="E-mail" value={email} onChange={setEmail} placeholder="nome@exemplo.com" />
          <TextField label="Senha" value={senha} onChange={setSenha} type="password" placeholder="Digite a senha inicial" />
          <AvatarField
            label="Foto do usuário (opcional)"
            value={fotoUrl}
            onChange={setFotoUrl}
          />
          <Select
            label="Função"
            selectedKey={funcao}
            onSelectionChange={(key) => setFuncao(key as RoleTag)}
            options={[
              { id: "toca", label: "Toca" },
              { id: "canta", label: "Canta" },
              { id: "som", label: "Som" },
              { id: "projecao", label: "Projeção" },
              { id: "pastor", label: "Pastor" },
              { id: "ministro-louvor", label: "Ministro de louvor" },
              { id: "vocalista", label: "Vocalista" },
              { id: "violao", label: "Violão" },
              { id: "guitarra", label: "Guitarra" },
              { id: "baixo", label: "Baixo" },
              { id: "bateria", label: "Bateria" },
              { id: "teclado", label: "Teclado" },
              { id: "mesa-som", label: "Mesa de som" },
              { id: "transmissao", label: "Transmissão" },
              { id: "recepcao", label: "Recepção" },
              { id: "apoio", label: "Apoio" },
              { id: "intercessao", label: "Intercessão" },
              { id: "danca", label: "Dança" },
              { id: "outro", label: "Outro" },
            ]}
          />
          <Select
            label="Congregação"
            selectedKey={congregacao}
            onSelectionChange={(key) => setCongregacao(key as Congregacao)}
            isDisabled={!isMaster}
            options={[
              { id: "SP AM", label: "SP AM" },
              { id: "SP PM", label: "SP PM" },
              { id: "BH", label: "BH" },
              { id: "PF", label: "PF" },
            ]}
          />
          <Select
            label="Ministério principal"
            selectedKey={ministerioPrincipal}
            onSelectionChange={(key) =>
              setMinisterioPrincipal(key as MinisterioTag)
            }
            options={[
              { id: "ministro-louvor", label: "Ministro de louvor" },
              { id: "vocalista", label: "Vocalista" },
              { id: "violao", label: "Violão" },
              { id: "guitarra", label: "Guitarra" },
              { id: "baixo", label: "Baixo" },
              { id: "bateria", label: "Bateria" },
              { id: "teclado", label: "Teclado" },
              { id: "mesa-som", label: "Mesa de som" },
              { id: "projecao", label: "Projeção" },
              { id: "transmissao", label: "Transmissão" },
              { id: "recepcao", label: "Recepção" },
              { id: "apoio", label: "Apoio" },
              { id: "intercessao", label: "Intercessão" },
              { id: "danca", label: "Dança" },
              { id: "outro", label: "Outro" },
              { id: "nao-informado", label: "Não informado" },
            ]}
          />
          <Button
            onPress={() => {
              if (!nome || !email) return;
              if (senha.trim().length < 3) {
                showToast("Defina uma senha inicial com no mínimo 3 caracteres.");
                return;
              }
              addUser({
                nome,
                email,
                fotoUrl: fotoUrl.trim() || undefined,
                funcao,
                ministerioPrincipal,
                ministeriosSecundarios: [],
                password: senha.trim(),
                congregacao: isMaster ? congregacao : currentUser.congregacao,
                role: "membro",
              });
              setNome("");
              setEmail("");
              setSenha("");
              setFotoUrl("");
              showToast("Membro adicionado com sucesso!");
            }}
          >
            Adicionar
          </Button>
        </article>
      ) : null}

      {adminPage === "teams" ? (
        <article className="card">
          <h3>Equipes</h3>
          <TextField
            label="Nova equipe"
            value={teamName}
            onChange={setTeamName}
            placeholder="Ex: Louvor Domingo"
          />
          <Button
            onPress={() => {
              if (!teamName) return;
              addTeam(teamName);
              setTeamName("");
              showToast("Equipe criada!");
            }}
          >
            Criar Equipe
          </Button>
          <ul className="admin-list">
            {state.teams.map((team) => (
              <li key={team.id} className="admin-list-item">
                <TextField
                  label="Nome"
                  value={team.nome}
                  onChange={(value) => updateTeam(team.id, value)}
                  placeholder="Nome da equipe"
                />
                <Button tone="danger" onPress={() => removeTeam(team.id)}>
                  Remover
                </Button>
              </li>
            ))}
          </ul>
        </article>
      ) : null}

      {adminPage === "assign-member-team" ? (
        <article className="card">
          <h3>Associar Membro à Equipe</h3>
          <Select
            label="Equipe"
            selectedKey={selectedTeamId}
            onSelectionChange={setSelectedTeamId}
            options={state.teams.map((team) => ({
              id: team.id,
              label: team.nome,
            }))}
          />
          <Select
            label="Membro"
            selectedKey={selectedMemberId}
            onSelectionChange={setSelectedMemberId}
            options={state.users.map((user) => ({
              id: user.id,
              label: `${user.nome} (${user.ministerioPrincipal})`,
            }))}
          />
          <Button
            onPress={() => {
              addMemberToTeam(selectedTeamId, selectedMemberId);
              showToast("Membro vinculado!");
            }}
          >
            Vincular
          </Button>
        </article>
      ) : null}

      {adminPage === "team-roles" ? (
        <article className="card">
          <h3>Funções da equipe</h3>
          <Select
            label="Equipe"
            selectedKey={selectedTeamId}
            onSelectionChange={setSelectedTeamId}
            options={state.teams.map((team) => ({
              id: team.id,
              label: team.nome,
            }))}
          />
          <TextField
            label="Nova função"
            value={roleName}
            onChange={setRoleName}
            placeholder="Ex: Vocal"
          />
          <Button
            onPress={() => {
              if (!selectedTeamId || !roleName) return;
              addTeamRole(selectedTeamId, roleName);
              setRoleName("");
              showToast("Função adicionada!");
            }}
          >
            Adicionar função
          </Button>
          <ul className="admin-list">
            {(selectedTeam?.roles ?? []).map((role) => (
              <li key={role.id} className="admin-list-item">
                <TextField
                  label="Função"
                  value={role.nome}
                  onChange={(value) =>
                    updateTeamRole(selectedTeamId, role.id, value)
                  }
                />
                <Button
                  tone="danger"
                  onPress={() => removeTeamRole(selectedTeamId, role.id)}
                >
                  Remover
                </Button>
              </li>
            ))}
          </ul>
        </article>
      ) : null}

      {adminPage === "assign-role-member" ? (
        <article className="card">
          <h3>Vincular função e membro</h3>
          <Select
            label="Equipe"
            selectedKey={selectedTeamId}
            onSelectionChange={setSelectedTeamId}
            options={state.teams.map((team) => ({
              id: team.id,
              label: team.nome,
            }))}
          />
          <Select
            label="Função"
            selectedKey={selectedRoleId}
            onSelectionChange={setSelectedRoleId}
            options={roleOptions}
          />
          {selectedTeamId && roleOptions.length === 0 ? (
            <p className="admin-warning">
              Esta equipe ainda não tem funções. Cadastre em "Funções da equipe".
            </p>
          ) : null}
          <Select
            label="Membro da equipe"
            selectedKey={selectedMemberId}
            onSelectionChange={setSelectedMemberId}
            options={memberOptions}
          />
          <Button
            onPress={() => {
              if (!selectedRoleId || !selectedMemberId || !selectedTeamId)
                return;
              assignMemberToTeamRole(
                selectedTeamId,
                selectedRoleId,
                selectedMemberId,
              );
              showToast("Papel vinculado!");
            }}
          >
            Vincular papel
          </Button>
          <ul className="admin-list">
            {(selectedTeam?.roleAssignments ?? []).map((assignment) => {
              const role = selectedTeam?.roles.find(
                (item) => item.id === assignment.teamRoleId,
              );
              const member = state.users.find(
                (item) => item.id === assignment.memberId,
              );
              return (
                <li key={assignment.id} className="admin-list-item">
                  <span className="admin-list-item__label">
                    {role?.nome ?? "Função"}:{" "}
                    <strong>{member?.nome ?? "Membro"}</strong>
                  </span>
                  <Button
                    tone="danger"
                    onPress={() =>
                      removeTeamRoleAssignment(selectedTeamId, assignment.id)
                    }
                  >
                    Remover
                  </Button>
                </li>
              );
            })}
          </ul>
        </article>
      ) : null}

      {adminPage === "create-scale" ? (
        <article className="card">
          <h3>Criar Escala</h3>
          <TextField
            label="Título"
            value={scaleTitle}
            onChange={setScaleTitle}
            placeholder="Ex: Culto de Domingo PM"
          />
          <DatePickerField
            label="Data"
            value={scaleDate}
            onChange={setScaleDate}
          />
          <MultiSelectTagGroup
            label="Membros escalados"
            options={scaleMemberOptions}
            selectedKeys={scaleMemberIds}
            placeholder="Adicionar membro"
            onChange={(ids) => {
              setScaleMemberIds(ids);
              // remove ministerios de membros que foram desmarcados
              setScaleMemberMinisterios((prev) => {
                const next = { ...prev };
                Object.keys(next).forEach((id) => {
                  if (!ids.includes(id)) delete next[id];
                });
                return next;
              });
            }}
          />

          {scaleMemberIds.length > 0 && (
            <table className="admin-member-roles-table">
              <caption>O que cada um vai fazer nesta escala</caption>
              <thead>
                <tr>
                  <th scope="col">Membro</th>
                  <th scope="col">Função</th>
                </tr>
              </thead>
              <tbody>
                {scaleMemberIds.map((memberId) => {
                  const member = state.users.find((u) => u.id === memberId);
                  if (!member) return null;
                  const memberOptions = buildMinisterioOptions(
                    member.ministerioPrincipal,
                    member.ministeriosSecundarios,
                    ministerioLabelMap,
                  );
                  return (
                    <tr key={memberId}>
                      <td>{member.nome}</td>
                      <td>
                        <Select
                          label={`Função de ${member.nome}`}
                          hideLabel
                          selectedKey={
                            scaleMemberMinisterios[memberId] ??
                            member.ministerioPrincipal
                          }
                          onSelectionChange={(key) =>
                            setScaleMemberMinisterios((prev) => ({
                              ...prev,
                              [memberId]: key as MinisterioTag,
                            }))
                          }
                          options={memberOptions}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
          <TextField
            label="Link da playlist"
            value={scalePlaylistLink}
            onChange={setScalePlaylistLink}
            placeholder="https://..."
          />
          <TextArea
            label="Observações adicionais"
            value={scaleNotes}
            onChange={setScaleNotes}
            placeholder="Escreva instruções extras..."
          />

          <Button
            onPress={() => {
              if (scaleMemberIds.length === 0) return;
              createScale({
                congregacao: isMaster ? congregacao : currentUser.congregacao,
                ownerAdminId: currentUser.id,
                titulo: scaleTitle,
                dataISO: scaleDate,
                memberAssignments: scaleMemberIds.map((memberId) => ({
                  memberId,
                  ministerio:
                    scaleMemberMinisterios[memberId] ??
                    state.users.find((u) => u.id === memberId)
                      ?.ministerioPrincipal,
                })),
                notes: scaleNotes,
                playlistLink: scalePlaylistLink,
              });
              setScaleMemberIds([]);
              setScaleMemberMinisterios({});
              setScaleNotes("");
              setScalePlaylistLink("");
              showToast("Escala criada com sucesso!");
            }}
          >
            Criar Escala
          </Button>
        </article>
      ) : null}

      {adminPage === "scale-detail" ? (
        <article className="card">
          <h3>Detalhe da Escala</h3>
          <Select
            label="Escala"
            selectedKey={selectedScaleId}
            onSelectionChange={setSelectedScaleId}
            options={state.scales.map((scale) => ({
              id: scale.id,
              label: `${scale.titulo} · ${formatDate(scale.dataISO)}`,
            }))}
          />

          {selectedScale ? (
            <>
              {currentUser.role !== "master" && selectedScale.ownerAdminId !== currentUser.id ? (
                <p className="admin-warning">Somente o admin que criou esta escala pode editar.</p>
              ) : null}
              <TextField
                label="Nome do evento"
                value={selectedScale.titulo}
                readOnly={currentUser.role !== "master" && selectedScale.ownerAdminId !== currentUser.id}
                onChange={(value) =>
                  updateScale(selectedScale.id, { titulo: value })
                }
                placeholder="Nome do evento"
              />
              <TextField
                label="Data"
                type="date"
                value={selectedScale.dataISO}
                readOnly={currentUser.role !== "master" && selectedScale.ownerAdminId !== currentUser.id}
                onChange={(value) =>
                  updateScale(selectedScale.id, { dataISO: value })
                }
              />

              <h4>Escalados</h4>
              <ul className="admin-list">
                {selectedScale.assignments.map((assignment) => {
                  const member = state.users.find(
                    (item) => item.id === assignment.memberId,
                  );
                  if (!member) return null;
                  const memberOptions = buildMinisterioOptions(
                    member.ministerioPrincipal,
                    member.ministeriosSecundarios,
                    ministerioLabelMap,
                  );
                  return (
                    <li key={assignment.id} className="admin-assignment-row">
                      <span className="admin-assignment-name">
                        {member.nome}
                      </span>
                      <Select
                        label={`Função de ${member.nome}`}
                        hideLabel
                        isDisabled={currentUser.role !== "master" && selectedScale.ownerAdminId !== currentUser.id}
                        selectedKey={
                          assignment.ministerio ?? member.ministerioPrincipal
                        }
                        onSelectionChange={(key) =>
                          updateScaleAssignment(
                            selectedScale.id,
                            assignment.id,
                            key as MinisterioTag,
                          )
                        }
                        options={memberOptions}
                      />
                      <StatusBadge
                        tone={assignment.status as "pendente" | "aceito" | "recusado"}
                        label={STATUS_LABEL[assignment.status] ?? assignment.status}
                        className="admin-assignment-status"
                      />
                    </li>
                  );
                })}
              </ul>

              <TextField
                label="Link da playlist"
                value={selectedScale.playlistLink ?? ""}
                readOnly={currentUser.role !== "master" && selectedScale.ownerAdminId !== currentUser.id}
                onChange={(value) =>
                  updateScale(selectedScale.id, { playlistLink: value })
                }
                placeholder="https://open.spotify.com/playlist/..."
              />
              <h4>Observações</h4>
              <TextArea
                label="Observações do evento"
                value={selectedScale.notes}
                onChange={(value) =>
                  (currentUser.role === "master" || selectedScale.ownerAdminId === currentUser.id)
                    ? updateScale(selectedScale.id, { notes: value })
                    : undefined
                }
                placeholder="Ex: Ensaio às 15h45."
              />
              {(currentUser.role === "master" || selectedScale.ownerAdminId === currentUser.id) ? (
                <Button onPress={() => showToast("Alterações salvas.")}>
                  Salvar alterações da escala
                </Button>
              ) : null}
            </>
          ) : (
            <p>Selecione uma escala para ver detalhes.</p>
          )}
        </article>
      ) : null}

      {adminPage === "members" ? (
        <MembersSection
          filteredMembers={filteredMembers}
          memberSearch={memberSearch}
          setMemberSearch={setMemberSearch}
          memberFilterTeamId={memberFilterTeamId}
          setMemberFilterTeamId={setMemberFilterTeamId}
          teams={state.teams}
          currentUser={currentUser}
          memberPasswordDrafts={memberPasswordDrafts}
          setMemberPasswordDrafts={setMemberPasswordDrafts}
          updateUser={updateUser}
          removeUser={removeUser}
          ministerioLabelMap={ministerioLabelMap}
          isMaster={isMaster}
          showToast={showToast}
        />
      ) : null}
    </section>
  );
}
