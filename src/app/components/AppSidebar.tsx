import { Button } from '../../design-system/components/button/button';
import type { AdminPageId } from '../../domain/types';
import { ADMIN_PAGE_PATHS, MEMBER_PAGE_PATHS } from '../app-config';

interface AdminPageItem {
  id: AdminPageId;
  label: string;
  icon: string;
}

interface NavSection {
  label: string | null;
  ids: AdminPageId[];
}

interface AppSidebarProps {
  churchLogo: string;
  view: 'admin' | 'membro';
  sidebarOpen: boolean;
  currentPath: string;
  adminPages: AdminPageItem[];
  navSections: NavSection[];
  onNavigate: (path: string) => void;
  onLogout: () => void;
  onCloseSidebar: () => void;
}

export function AppSidebar({
  churchLogo,
  view,
  sidebarOpen,
  currentPath,
  adminPages,
  navSections,
  onNavigate,
  onLogout,
  onCloseSidebar
}: AppSidebarProps) {
  return (
    <aside className={`saas-sidebar ${sidebarOpen ? 'is-open' : ''}`}>
      <div className="saas-brand">
        <img className="saas-brand__logo" src={churchLogo} alt="Logo da Estação 337" />
        <div>
          <p className="saas-brand__title">Servin</p>
          <p className="saas-brand__subtitle">Estação 337</p>
        </div>
      </div>

      <nav className="saas-nav" aria-label="Navegação principal">
        {view === 'admin' ? (
          <div className="saas-nav__group">
            {navSections.map(({ label, ids }) => (
              <div key={label ?? '_root'} className={`saas-nav__section${label ? '' : ' saas-nav__section--no-border'}`}>
                {label && <span className="saas-nav__section-label" aria-hidden="true">{label}</span>}
                {ids.map((id) => {
                  const page = adminPages.find((p) => p.id === id)!;
                  return (
                    <Button
                      key={page.id}
                      className={`saas-nav__subitem ${currentPath === ADMIN_PAGE_PATHS[page.id] ? 'is-active' : ''}`}
                      tone="neutral"
                      aria-current={currentPath === ADMIN_PAGE_PATHS[page.id] ? 'page' : undefined}
                      onPress={() => {
                        onNavigate(ADMIN_PAGE_PATHS[page.id]);
                        onCloseSidebar();
                      }}
                    >
                      <span className="material-symbols-rounded saas-nav__icon" aria-hidden="true">{page.icon}</span>
                      <span>{page.label}</span>
                    </Button>
                  );
                })}
              </div>
            ))}
            <div className="saas-nav__section">
              <Button className="saas-nav__subitem" tone="neutral" onPress={() => { onLogout(); onCloseSidebar(); }}>
                <span className="material-symbols-rounded saas-nav__icon" aria-hidden="true">logout</span>
                <span>Sair</span>
              </Button>
            </div>
          </div>
        ) : (
          <div className="saas-nav__group">
            <div className="saas-nav__section saas-nav__section--no-border">
              <Button
                className={`saas-nav__subitem ${currentPath === MEMBER_PAGE_PATHS.dashboard ? 'is-active' : ''}`}
                tone="neutral"
                onPress={() => {
                  onNavigate(MEMBER_PAGE_PATHS.dashboard);
                  onCloseSidebar();
                }}
              >
                <span className="material-symbols-rounded saas-nav__icon" aria-hidden="true">assignment</span>
                <span>Minha escala</span>
              </Button>
            </div>
            <div className="saas-nav__section">
              <Button className="saas-nav__subitem" tone="neutral" onPress={() => { onLogout(); onCloseSidebar(); }}>
                <span className="material-symbols-rounded saas-nav__icon" aria-hidden="true">logout</span>
                <span>Sair</span>
              </Button>
            </div>
          </div>
        )}
      </nav>
    </aside>
  );
}
