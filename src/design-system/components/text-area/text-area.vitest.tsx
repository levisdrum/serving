import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { TextArea } from './text-area';

describe('TextArea', () => {
  it('renderiza o campo com label', () => {
    render(<TextArea label="Observações" value="teste" onChange={vi.fn()} />);
    expect(screen.getByLabelText('Observações')).toBeInTheDocument();
  });
});
