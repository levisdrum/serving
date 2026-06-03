import { useState } from 'react';
import type { Congregacao, MinisterioTag } from '../../domain/types';

export function useAuthForms() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [bootstrapToken, setBootstrapToken] = useState('');
  const [bootstrapError, setBootstrapError] = useState('');

  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupCongregacao, setSignupCongregacao] = useState<Congregacao>('SP PM');
  const [signupFotoUrl, setSignupFotoUrl] = useState('');
  const [signupMinisterioPrincipal, setSignupMinisterioPrincipal] = useState<MinisterioTag>('nao-informado');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupError, setSignupError] = useState('');

  const resetSignup = () => {
    setSignupError('');
    setSignupName('');
    setSignupEmail('');
    setSignupFotoUrl('');
    setSignupMinisterioPrincipal('nao-informado');
    setSignupPassword('');
  };

  return {
    identifier,
    password,
    loginError,
    bootstrapToken,
    bootstrapError,
    signupName,
    signupEmail,
    signupCongregacao,
    signupFotoUrl,
    signupMinisterioPrincipal,
    signupPassword,
    signupError,
    setIdentifier,
    setPassword,
    setLoginError,
    setBootstrapToken,
    setBootstrapError,
    setSignupName,
    setSignupEmail,
    setSignupCongregacao,
    setSignupFotoUrl,
    setSignupMinisterioPrincipal,
    setSignupPassword,
    setSignupError,
    resetSignup,
  };
}
