import type { Congregacao, MinisterioTag } from '../../domain/types';

export type AuthView = 'home' | 'login' | 'signup';

export interface LoginScreenProps {
  churchLogo: string;
  authView: AuthView;
  identifier: string;
  password: string;
  loginError: string;
  bootstrapToken: string;
  bootstrapError: string;
  canImportBootstrap: boolean;
  signupName: string;
  signupEmail: string;
  signupCongregacao: Congregacao;
  signupFotoUrl: string;
  signupMinisterioPrincipal: MinisterioTag;
  signupPassword: string;
  signupError: string;
  onIdentifierChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onLogin: () => void;
  onBootstrapTokenChange: (value: string) => void;
  onImportBootstrap: () => void;
  onShowHome: () => void;
  onShowLogin: () => void;
  onShowSignup: () => void;
  onSignupNameChange: (value: string) => void;
  onSignupEmailChange: (value: string) => void;
  onSignupCongregacaoChange: (value: Congregacao) => void;
  onSignupFotoUrlChange: (value: string) => void;
  onSignupMinisterioPrincipalChange: (value: MinisterioTag) => void;
  onSignupPasswordChange: (value: string) => void;
  onSignup: () => void;
}
