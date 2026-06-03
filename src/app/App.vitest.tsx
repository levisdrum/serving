import { fireEvent, render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { App } from './App';

function loginAsAdmin(container: HTMLElement) {
  const scope = within(container);
  const email = 'admin.test@example.com';
  const password = 'test-password';

  fireEvent.click(scope.getByRole('button', { name: 'Novo cadastro' }));
  fireEvent.change(scope.getByLabelText('Nome'), { target: { value: 'Admin Local' } });
  fireEvent.change(scope.getByLabelText('Email'), { target: { value: email } });
  fireEvent.change(scope.getByLabelText('Senha'), { target: { value: password } });
  fireEvent.click(scope.getByRole('button', { name: 'Criar usuário' }));
  fireEvent.change(scope.getByLabelText('Email'), { target: { value: email } });
  fireEvent.change(scope.getByLabelText('Senha'), { target: { value: password } });
  fireEvent.click(scope.getByRole('button', { name: 'Login' }));
}

describe('App', () => {
  it('permite editar perfil do usuário logado', () => {
    localStorage.clear();
    const view = render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );
    const scope = within(view.container);

    loginAsAdmin(view.container);

    fireEvent.click(scope.getByRole('button', { name: 'Menu do perfil' }));
    fireEvent.click(screen.getByRole('menuitem', { name: 'Editar perfil', hidden: true }));

    fireEvent.change(scope.getByLabelText('Nome'), { target: { value: 'Admin Atualizado' } });
    fireEvent.click(scope.getByRole('button', { name: 'Salvar perfil' }));

    expect(scope.getByText('Admin Atualizado')).toBeInTheDocument();
  });

  it('abre o menu de perfil sem configurações', () => {
    localStorage.clear();
    const view = render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );
    const scope = within(view.container);

    loginAsAdmin(view.container);

    fireEvent.click(scope.getByRole('button', { name: 'Menu do perfil' }));
    expect(screen.getByRole('menuitem', { name: 'Editar perfil', hidden: true })).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: 'Sair', hidden: true })).toBeInTheDocument();
    expect(screen.queryByRole('menuitem', { name: 'Configurações', hidden: true })).not.toBeInTheDocument();
  });
});
