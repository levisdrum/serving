import { Menu, MenuItem, MenuTrigger, Popover, Separator } from 'react-aria-components';
import { Button } from '../../design-system/components/button/button';
import type { AdminPageId, MemberProfile } from '../../domain/types';

interface AdminPageItem {
  id: AdminPageId;
  label: string;
  icon: string;
}

interface AppTopbarProps {
  sidebarOpen: boolean;
  activeProfilePanel: 'none' | 'profile';
  view: 'admin' | 'membro';
  adminPage: AdminPageId;
  adminPages: AdminPageItem[];
  currentUser: MemberProfile;
  onToggleSidebar: () => void;
  onOpenProfile: () => void;
  onLogout: () => void;
}

export function AppTopbar({
  sidebarOpen,
  activeProfilePanel,
  view,
  adminPage,
  adminPages,
  currentUser,
  onToggleSidebar,
  onOpenProfile,
  onLogout
}: AppTopbarProps) {
  const heading =
    activeProfilePanel === 'profile'
      ? 'Editar perfil'
      : view === 'admin'
          ? (adminPages.find((p) => p.id === adminPage)?.label ?? 'Admin')
          : 'Minha área';

  return (
    <header className="saas-topbar">
      <div className="saas-topbar__start">
        <button
          type="button"
          className="saas-hamburger"
          aria-label={sidebarOpen ? 'Fechar menu' : 'Abrir menu'}
          aria-expanded={sidebarOpen}
          onClick={onToggleSidebar}
        >
          <span className="material-symbols-rounded" aria-hidden="true">{sidebarOpen ? 'close' : 'menu'}</span>
        </button>
        <div>
          <p className="app-eyebrow">Gestão de escalas da Estação 337</p>
          <h1>{heading}</h1>
        </div>
      </div>

      <div className="profile-menu">
        <MenuTrigger>
          <Button tone="neutral" className="profile-menu__trigger" aria-label="Menu do perfil">
            {currentUser.fotoUrl ? (
              <img className="profile-menu__avatar-image" src={currentUser.fotoUrl} alt={`Avatar de ${currentUser.nome}`} />
            ) : (
              <span className="profile-menu__avatar">{currentUser.nome.charAt(0).toUpperCase()}</span>
            )}
            <span className="profile-menu__identity">
              <span className="profile-menu__name">{currentUser.nome}</span>
              <span className="profile-menu__mode">
                {currentUser.role === 'master' ? 'Master' : view === 'admin' ? 'Administrador' : 'Membro'}
              </span>
            </span>
          </Button>
          <Popover className="profile-menu__dropdown" placement="bottom end">
            <Menu className="profile-menu__list" aria-label="Menu de perfil">
              <MenuItem className="profile-menu__item" onAction={onOpenProfile}>Editar perfil</MenuItem>
              <Separator className="profile-menu__divider" />
              <MenuItem className="profile-menu__item" onAction={onLogout}>Sair</MenuItem>
            </Menu>
          </Popover>
        </MenuTrigger>
      </div>
    </header>
  );
}
