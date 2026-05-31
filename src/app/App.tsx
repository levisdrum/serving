import { Suspense, lazy, useCallback, useMemo, useState } from 'react';
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { hashPassword } from '../domain/security';
import { useAppStore } from '../domain/store';
import type { AdminPageId } from '../domain/types';
import { LoginScreen } from '../features/login-screen/login-screen';
import type { AuthView } from '../features/login-screen/types';
import {
  ADMIN_PAGES,
  ADMIN_PAGE_PATHS,
  CHURCH_LOGO,
  MEMBER_PAGE_PATHS,
  MINISTERIO_OPTIONS,
  NAV_SECTIONS,
  SESSION_KEY,
  getAdminPageFromPath,
  mapMinisterioToRoleTag
} from './app-config';
import { AppSidebar } from './components/AppSidebar';
import { AppTopbar } from './components/AppTopbar';
import { ProfilePanel } from './components/ProfilePanels';
import { useAuthForms } from './hooks/use-auth-forms';
import { useProfileDraft } from './hooks/use-profile-draft';

const AdminPanel = lazy(() => import('../features/admin-panel/admin-panel').then((module) => ({ default: module.AdminPanel })));
const MemberPanel = lazy(() => import('../features/member-panel/member-panel').then((module) => ({ default: module.MemberPanel })));

export function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const [view, setView] = useState<'admin' | 'membro'>(() => (localStorage.getItem(`${SESSION_KEY}:view`) as 'admin' | 'membro' | null) ?? 'admin');
  const currentPath = location.pathname || '/';
  const [loggedUserId, setLoggedUserId] = useState<string>(() => localStorage.getItem(`${SESSION_KEY}:user-id`) ?? '');

  const authView = useMemo<AuthView>(() => {
    if (currentPath === '/login') return 'login';
    if (currentPath === '/cadastro') return 'signup';
    return 'home';
  }, [currentPath]);
  const auth = useAuthForms();
  const profile = useProfileDraft();

  const [uiDensity] = useState<'comfortable' | 'compact'>(() => (localStorage.getItem('serving-ui-density') as 'comfortable' | 'compact' | null) ?? 'comfortable');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { state, actions } = useAppStore();
  const adminPage = useMemo<AdminPageId>(() => getAdminPageFromPath(currentPath), [currentPath]);
  const activeProfilePanel = useMemo<'none' | 'profile'>(() => {
    if (currentPath === MEMBER_PAGE_PATHS.profile) return 'profile';
    return 'none';
  }, [currentPath]);

  const currentUser = useMemo(() => state.users.find((u) => u.id === loggedUserId), [state.users, loggedUserId]);

  const adminScopedState = useMemo(() => {
    if (!currentUser || currentUser.role === 'master' || currentUser.role !== 'admin') return state;

    const users = state.users.filter((user) => user.congregacao === currentUser.congregacao);
    const userIds = new Set(users.map((user) => user.id));

    return {
      users,
      teams: state.teams.map((team) => ({
        ...team,
        memberIds: team.memberIds.filter((id) => userIds.has(id)),
        roleAssignments: team.roleAssignments.filter((assignment) => userIds.has(assignment.memberId))
      })),
      scales: state.scales.reduce<typeof state.scales>((acc, scale) => {
        if (scale.congregacao !== currentUser.congregacao) return acc;
        acc.push({
          ...scale,
          assignments: scale.assignments.filter((assignment) => userIds.has(assignment.memberId))
        });
        return acc;
      }, []),
      songs: state.songs.filter((song) => userIds.has(song.sugeridoPor))
    };
  }, [state, currentUser]);

  const navigateTo = useCallback((path: string) => {
    navigate(path);
    setSidebarOpen(false);
  }, [navigate]);

  const setSessionView = (nextView: 'admin' | 'membro') => {
    setView(nextView);
    localStorage.setItem(`${SESSION_KEY}:view`, nextView);
    if (nextView === 'admin') {
      navigateTo(ADMIN_PAGE_PATHS.summary);
      return;
    }
    navigateTo(MEMBER_PAGE_PATHS.dashboard);
  };

  const handleLogout = () => {
    setLoggedUserId('');
    localStorage.removeItem(`${SESSION_KEY}:user-id`);
    navigateTo('/');
  };

  const handleLogin = () => {
    const user = state.users.find((u) => u.email.toLowerCase() === auth.identifier.trim().toLowerCase());
    const passwordHash = hashPassword(auth.password.trim());

    if (!user || auth.password.trim().length < 3 || user.passwordHash !== passwordHash) {
      auth.setLoginError('Credenciais inválidas. Use e-mail cadastrado e senha com 3+ caracteres.');
      return;
    }

    setLoggedUserId(user.id);
    const nextView = user.role === 'membro' ? 'membro' : 'admin';
    setSessionView(nextView);
    localStorage.setItem(`${SESSION_KEY}:user-id`, user.id);
    auth.setLoginError('');
  };

  const handleSignup = () => {
    const name = auth.signupName.trim();
    const email = auth.signupEmail.trim().toLowerCase();

    if (!name || !email || auth.signupPassword.trim().length < 3) {
      auth.setSignupError('Preencha nome, email e senha (mínimo 3 caracteres).');
      return;
    }

    if (state.users.some((user) => user.email.toLowerCase() === email)) {
      auth.setSignupError('Este e-mail já está cadastrado.');
      return;
    }

    actions.addUser({
      nome: name,
      email,
      funcao: mapMinisterioToRoleTag(auth.signupMinisterioPrincipal),
      ministerioPrincipal: auth.signupMinisterioPrincipal,
      ministeriosSecundarios: [],
      fotoUrl: auth.signupFotoUrl.trim(),
      password: auth.signupPassword.trim(),
      congregacao: auth.signupCongregacao,
      role: 'membro'
    });

    auth.resetSignup();
    navigateTo('/login');
  };

  const openEditProfile = () => {
    if (!currentUser) return;
    profile.loadFromUser(currentUser);
    navigateTo(MEMBER_PAGE_PATHS.profile);
  };

  const saveProfile = () => {
    if (!currentUser) return;
    const nome = profile.profileNameDraft.trim();
    const email = profile.profileEmailDraft.trim().toLowerCase();

    if (!nome || !email) {
      profile.setProfileError('Preencha nome e e-mail.');
      return;
    }

    const duplicate = state.users.some((item) => item.id !== currentUser.id && item.email.toLowerCase() === email);
    if (duplicate) {
      profile.setProfileError('Este e-mail já está em uso.');
      return;
    }

    actions.updateUser(currentUser.id, {
      nome,
      email,
      congregacao: profile.profileCongregacaoDraft,
      fotoUrl: profile.profileFotoUrlDraft.trim(),
      ministerioPrincipal: profile.profileMinisterioPrincipalDraft,
      ministeriosSecundarios: profile.profileMinisteriosSecundariosDraft,
      telefone: profile.profileTelefoneDraft.trim(),
      observacao: profile.profileObservacaoDraft.trim()
    });

    profile.setProfileError('');
    navigateTo(view === 'admin' ? ADMIN_PAGE_PATHS.summary : MEMBER_PAGE_PATHS.dashboard);
  };

  if (!currentUser) {
    return (
      <LoginScreen
        churchLogo={CHURCH_LOGO}
        authView={authView}
        identifier={auth.identifier}
        password={auth.password}
        loginError={auth.loginError}
        signupName={auth.signupName}
        signupEmail={auth.signupEmail}
        signupCongregacao={auth.signupCongregacao}
        signupFotoUrl={auth.signupFotoUrl}
        signupMinisterioPrincipal={auth.signupMinisterioPrincipal}
        signupPassword={auth.signupPassword}
        signupError={auth.signupError}
        onIdentifierChange={auth.setIdentifier}
        onPasswordChange={auth.setPassword}
        onLogin={handleLogin}
        onShowHome={() => {
          auth.setLoginError('');
          auth.setSignupError('');
          navigateTo('/');
        }}
        onShowLogin={() => {
          auth.setLoginError('');
          navigateTo('/login');
        }}
        onShowSignup={() => {
          auth.setSignupError('');
          navigateTo('/cadastro');
        }}
        onSignupNameChange={auth.setSignupName}
        onSignupEmailChange={auth.setSignupEmail}
        onSignupCongregacaoChange={auth.setSignupCongregacao}
        onSignupFotoUrlChange={auth.setSignupFotoUrl}
        onSignupMinisterioPrincipalChange={auth.setSignupMinisterioPrincipal}
        onSignupPasswordChange={auth.setSignupPassword}
        onSignup={handleSignup}
      />
    );
  }

  if (currentPath === '/' || currentPath === '/login' || currentPath === '/cadastro') {
    return <Navigate to={view === 'admin' ? ADMIN_PAGE_PATHS.summary : MEMBER_PAGE_PATHS.dashboard} replace />;
  }

  return (
    <main className={`saas-shell ${uiDensity === 'compact' ? 'is-compact' : ''}`}>
      {sidebarOpen ? <div className="saas-sidebar-backdrop" aria-hidden="true" onClick={() => setSidebarOpen(false)} /> : null}

      <AppSidebar
        churchLogo={CHURCH_LOGO}
        view={view}
        sidebarOpen={sidebarOpen}
        currentPath={currentPath}
        adminPages={ADMIN_PAGES}
        navSections={NAV_SECTIONS}
        onNavigate={navigateTo}
        onLogout={handleLogout}
        onCloseSidebar={() => setSidebarOpen(false)}
      />

      <section className="saas-main">
        <AppTopbar
          sidebarOpen={sidebarOpen}
          activeProfilePanel={activeProfilePanel}
          view={view}
          adminPage={adminPage}
          adminPages={ADMIN_PAGES}
          currentUser={currentUser}
          onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
          onOpenProfile={openEditProfile}
          onLogout={handleLogout}
        />

        <section className="saas-content" aria-label={view === 'admin' ? 'Conteúdo administrativo' : 'Conteúdo do membro'}>
          <Routes>
            <Route
              path={MEMBER_PAGE_PATHS.profile}
              element={
                currentUser ? (
            <ProfilePanel
              currentUser={currentUser}
              ministerioOptions={MINISTERIO_OPTIONS}
              profileNameDraft={profile.profileNameDraft}
              profileEmailDraft={profile.profileEmailDraft}
              profileCongregacaoDraft={profile.profileCongregacaoDraft}
              profileFotoUrlDraft={profile.profileFotoUrlDraft}
              profileMinisterioPrincipalDraft={profile.profileMinisterioPrincipalDraft}
              profileMinisteriosSecundariosDraft={profile.profileMinisteriosSecundariosDraft}
              profileTelefoneDraft={profile.profileTelefoneDraft}
              profileObservacaoDraft={profile.profileObservacaoDraft}
              profileError={profile.profileError}
              onProfileNameChange={profile.setProfileNameDraft}
              onProfileEmailChange={profile.setProfileEmailDraft}
              onProfileCongregacaoChange={profile.setProfileCongregacaoDraft}
              onProfileFotoUrlChange={profile.setProfileFotoUrlDraft}
              onProfileMinisterioPrincipalChange={profile.setProfileMinisterioPrincipalDraft}
              onProfileMinisteriosSecundariosChange={profile.setProfileMinisteriosSecundariosDraft}
              onProfileTelefoneChange={profile.setProfileTelefoneDraft}
              onProfileObservacaoChange={profile.setProfileObservacaoDraft}
              onSave={saveProfile}
              onCancel={() => navigateTo(view === 'admin' ? ADMIN_PAGE_PATHS.summary : MEMBER_PAGE_PATHS.dashboard)}
            />
                ) : null
              }
            />
            <Route
              path="*"
              element={
            <Suspense fallback={<article className="card"><p>Carregando...</p></article>}>
              {view === 'admin' ? (
                <AdminPanel
                  state={adminScopedState}
                  currentUser={currentUser}
                  adminPage={adminPage}
                  addUser={actions.addUser}
                  updateUser={actions.updateUser}
                  removeUser={actions.removeUser}
                  addTeam={actions.addTeam}
                  updateTeam={actions.updateTeam}
                  removeTeam={actions.removeTeam}
                  addMemberToTeam={actions.addMemberToTeam}
                  addTeamRole={actions.addTeamRole}
                  updateTeamRole={actions.updateTeamRole}
                  removeTeamRole={actions.removeTeamRole}
                  assignMemberToTeamRole={actions.assignMemberToTeamRole}
                  removeTeamRoleAssignment={actions.removeTeamRoleAssignment}
                  createScale={actions.createScale}
                  updateScale={actions.updateScale}
                  updateScaleAssignment={actions.updateScaleAssignment}
                  addScaleSong={actions.addScaleSong}
                  updateScaleSong={actions.updateScaleSong}
                  removeScaleSong={actions.removeScaleSong}
                  onNavigate={(page) => {
                    navigateTo(ADMIN_PAGE_PATHS[page]);
                  }}
                />
              ) : (
                <MemberPanel state={state} currentUser={currentUser} respondInvite={actions.respondInvite} />
              )}
            </Suspense>
              }
            />
          </Routes>
        </section>
      </section>
    </main>
  );
}
