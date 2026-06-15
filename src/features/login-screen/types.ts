import type { Congregacao, MinisterioTag } from '../../domain/types';

export type AuthView = 'home' | 'login' | 'signup' | 'forgot';

export interface LoginScreenProps {
  churchLogo: string;
  authView: AuthView;
  identifier: string;
  password: string;
  loginError: string;
  resetEmail: string;
  resetPassword: string;
  resetFeedback: string;
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
  onResetEmailChange: (value: string) => void;
  onResetPasswordChange: (value: string) => void;
  onResetPassword: () => void;
  onBootstrapTokenChange: (value: string) => void;
  onImportBootstrap: () => void;
  onShowHome: () => void;
  onShowLogin: () => void;
  onShowSignup: () => void;
  onShowForgotPassword: () => void;
  onSignupNameChange: (value: string) => void;
  onSignupEmailChange: (value: string) => void;
  onSignupCongregacaoChange: (value: Congregacao) => void;
  onSignupFotoUrlChange: (value: string) => void;
  onSignupMinisterioPrincipalChange: (value: MinisterioTag) => void;
  onSignupPasswordChange: (value: string) => void;
  onSignup: () => void;
}
