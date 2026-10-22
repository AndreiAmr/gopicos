import { displayName } from './displayName';

describe('displayName (D36)', () => {
  it('nome + inicial do sobrenome', () => {
    expect(displayName({ firstName: 'Marina', lastName: 'silva' })).toBe(
      'Marina S.',
    );
  });

  it('usa só o primeiro nome quando há nome composto', () => {
    expect(displayName({ firstName: 'Ana Maria', lastName: 'Souza' })).toBe(
      'Ana S.',
    );
  });

  it('sem sobrenome mostra só o nome', () => {
    expect(displayName({ firstName: 'Tony', lastName: '' })).toBe('Tony');
    expect(displayName({ firstName: 'Tony', lastName: null })).toBe('Tony');
  });

  it('conta desativada vira "Usuário Desativado"', () => {
    expect(
      displayName({
        firstName: 'Tony',
        lastName: 'Hawk',
        deactivatedAt: new Date(),
      }),
    ).toBe('Usuário Desativado');
  });
});
