import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { TextField } from './text-field';

describe('TextField', () => {
  it('renderiza label e input', () => {
    render(<TextField label="E-mail" value="" onChange={vi.fn()} />);
    expect(screen.getByLabelText('E-mail')).toBeInTheDocument();
  });
});
