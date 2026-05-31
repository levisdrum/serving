import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { LoginScreen } from './login-screen';

describe('LoginScreen', () => {
  it('renderiza home com botões login e novo login', () => {
    render(
      <LoginScreen
        churchLogo="https://example.com/logo.png"
        authView="home"
        identifier=""
        password=""
        loginError=""
        signupName=""
        signupEmail=""
        signupCongregacao="SP PM"
        signupFotoUrl=""
        signupMinisterioPrincipal="nao-informado"
        signupPassword=""
        signupError=""
        onIdentifierChange={vi.fn()}
        onPasswordChange={vi.fn()}
        onLogin={vi.fn()}
        onShowHome={vi.fn()}
        onShowLogin={vi.fn()}
        onShowSignup={vi.fn()}
        onSignupNameChange={vi.fn()}
        onSignupEmailChange={vi.fn()}
        onSignupCongregacaoChange={vi.fn()}
        onSignupFotoUrlChange={vi.fn()}
        onSignupMinisterioPrincipalChange={vi.fn()}
        onSignupPasswordChange={vi.fn()}
        onSignup={vi.fn()}
      />
    );

    expect(screen.getByRole('button', { name: 'Login' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Novo cadastro' })).toBeInTheDocument();
  });
});
