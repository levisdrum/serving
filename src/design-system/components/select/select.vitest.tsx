import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Select } from './select';

describe('Select', () => {
  it('renderiza label', () => {
    render(
      <Select
        label="Função"
        selectedKey="canta"
        onSelectionChange={vi.fn()}
        options={[{ id: 'canta', label: 'Canta' }]}
      />
    );

    expect(screen.getByText('Função')).toBeInTheDocument();
  });

  it('mostra item selecionado no trigger', () => {
    render(
      <Select
        label="Equipe"
        selectedKey="t-1"
        onSelectionChange={vi.fn()}
        options={[
          { id: 't-1', label: 'Louvor' },
          { id: 't-2', label: 'Áudio' }
        ]}
      />
    );

    expect(screen.getByRole('button', { name: /Equipe/i })).toHaveTextContent('Louvor');
  });
});
