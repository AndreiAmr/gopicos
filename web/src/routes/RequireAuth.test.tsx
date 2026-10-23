import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router';

import { RequireAuth } from './RequireAuth';

const mockGetToken = vi.fn();
vi.mock('@/utils/session', () => ({ getToken: () => mockGetToken() }));

const LoginProbe = () => {
  const location = useLocation();
  return <p>login from={(location.state as { from?: string } | null)?.from}</p>;
};

const renderAt = (path: string) =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/" element={<LoginProbe />} />
        <Route
          path="/spot/:id"
          element={
            <RequireAuth>
              <p>detalhe protegido</p>
            </RequireAuth>
          }
        />
      </Routes>
    </MemoryRouter>,
  );

beforeEach(() => mockGetToken.mockReset());
afterEach(cleanup);

describe('RequireAuth', () => {
  it('sem sessão vai ao Login guardando a rota pretendida', () => {
    mockGetToken.mockReturnValue(null);
    renderAt('/spot/42?tab=fotos');
    expect(screen.getByText('login from=/spot/42?tab=fotos')).toBeTruthy();
    expect(screen.queryByText('detalhe protegido')).toBeNull();
  });

  it('com sessão mostra a página', () => {
    mockGetToken.mockReturnValue('token');
    renderAt('/spot/42');
    expect(screen.getByText('detalhe protegido')).toBeTruthy();
  });
});
