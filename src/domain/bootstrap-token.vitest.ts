import { describe, expect, it } from 'vitest';
import { decodeBootstrapToken } from './bootstrap-token';

function toToken(input: unknown) {
  const json = JSON.stringify(input);
  const binary = String.fromCharCode(...new TextEncoder().encode(json));
  return `serving-bootstrap:${btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '')}`;
}

describe('bootstrap token', () => {
  it('decodifica token minificado de usuarios iniciais', () => {
    const token = toToken({
      users: [
        {
          nome: 'Pessoa Admin',
          email: 'ADMIN@EXAMPLE.COM',
          password: 'senha-segura',
          congregacao: 'SP PM',
          role: 'master',
          ministerioPrincipal: 'ministro-louvor'
        }
      ]
    });

    expect(decodeBootstrapToken(token)).toEqual({
      users: [
        {
          nome: 'Pessoa Admin',
          email: 'admin@example.com',
          password: 'senha-segura',
          congregacao: 'SP PM',
          role: 'master',
          funcao: undefined,
          ministerioPrincipal: 'ministro-louvor',
          ministeriosSecundarios: [],
          fotoUrl: undefined,
          telefone: undefined,
          observacao: undefined
        }
      ]
    });
  });

  it('rejeita token invalido', () => {
    expect(decodeBootstrapToken('abc')).toBeNull();
  });
});
