import { describe, expect, it } from 'vitest';

import {
  fullName,
  hasProfileChanges,
  initialsOf,
  memberSince,
  validateProfileForm,
} from './profileLogic';

describe('memberSince', () => {
  it('formata mês e ano por extenso', () => {
    expect(memberSince('2026-10-22T12:00:00.000Z')).toBe(
      'Membro desde outubro de 2026',
    );
  });

  it('data inválida ou ausente devolve vazio', () => {
    expect(memberSince('x')).toBe('');
    expect(memberSince(undefined)).toBe('');
  });
});

describe('initialsOf / fullName', () => {
  it('usa a primeira letra de nome e sobrenome em maiúsculas', () => {
    expect(initialsOf('marina', ' souza')).toBe('MS');
    expect(initialsOf('Ana', '')).toBe('A');
  });

  it('fullName não deixa espaço sobrando', () => {
    expect(fullName('Ana', '')).toBe('Ana');
    expect(fullName('Ana', 'Lima')).toBe('Ana Lima');
  });
});

describe('validateProfileForm', () => {
  it('aceita nomes válidos (inclusive 40 caracteres)', () => {
    expect(
      validateProfileForm({ firstName: 'Ana', lastName: 'x'.repeat(40) }),
    ).toEqual({});
  });

  it('exige nome e sobrenome com as mensagens do cadastro', () => {
    expect(validateProfileForm({ firstName: '  ', lastName: '' })).toEqual({
      firstName: 'Informe seu nome.',
      lastName: 'Informe seu sobrenome.',
    });
  });

  it('exige mínimo de 2 e máximo de 40 caracteres', () => {
    expect(validateProfileForm({ firstName: 'A', lastName: 'x'.repeat(41) })).toEqual({
      firstName: 'O nome precisa ter ao menos 2 caracteres.',
      lastName: 'O sobrenome pode ter no máximo 40 caracteres.',
    });
  });
});

describe('hasProfileChanges', () => {
  const saved = { firstName: 'Ana', lastName: 'Lima' };

  it('ignora espaços nas pontas', () => {
    expect(hasProfileChanges(saved, { firstName: ' Ana ', lastName: 'Lima' })).toBe(false);
  });

  it('detecta mudança em qualquer campo', () => {
    expect(hasProfileChanges(saved, { firstName: 'Anna', lastName: 'Lima' })).toBe(true);
    expect(hasProfileChanges(saved, { firstName: 'Ana', lastName: 'Lim' })).toBe(true);
  });
});
