import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { AvatarField } from './avatar-field';

describe('AvatarField', () => {
  it('exibe remover somente quando existe avatar', () => {
    const onChange = vi.fn();
    const { rerender } = render(<AvatarField label="Avatar" value="" onChange={onChange} />);

    expect(screen.getByText('Escolher arquivo')).toBeInTheDocument();
    expect(screen.queryByText('Remover')).not.toBeInTheDocument();

    rerender(<AvatarField label="Avatar" value="data:image/png;base64,abc" onChange={onChange} />);

    expect(screen.getByText('Remover')).toBeInTheDocument();
  });
});
