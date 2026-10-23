import { initialsOf } from '../../../atomic/ds/atoms/Avatar';
import {
  editProfileSchema,
  fullName,
  hasProfileChanges,
  mapProfileError,
  memberSince,
} from './logic';

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

  it('fullName junta sem espaço sobrando', () => {
    expect(fullName('Ana', '')).toBe('Ana');
    expect(fullName('Ana', 'Lima')).toBe('Ana Lima');
  });
});

describe('editProfileSchema', () => {
  it('aceita nomes válidos e remove espaços das pontas', async () => {
    const value = await editProfileSchema.validate({
      firstName: ' Ana ',
      lastName: 'Lima ',
    });
    expect(value).toEqual({ firstName: 'Ana', lastName: 'Lima' });
  });

  it.each([
    [{ firstName: '  ', lastName: 'Lima' }, 'Informe seu nome.'],
    [{ firstName: 'A', lastName: 'Lima' }, 'O nome precisa ter ao menos 2 caracteres.'],
    [{ firstName: 'Ana', lastName: '' }, 'Informe seu sobrenome.'],
    [
      { firstName: 'Ana', lastName: 'x'.repeat(41) },
      'O sobrenome pode ter no máximo 40 caracteres.',
    ],
  ])('rejeita %j', async (input, message) => {
    await expect(editProfileSchema.validate(input)).rejects.toThrow(message);
  });
});

describe('hasProfileChanges', () => {
  const saved = { firstName: 'Ana', lastName: 'Lima' };

  it('sem mudança (ignorando espaços nas pontas) é falso', () => {
    expect(hasProfileChanges(saved, { firstName: ' Ana', lastName: 'Lima ' })).toBe(false);
  });

  it('mudança em qualquer campo é verdadeira', () => {
    expect(hasProfileChanges(saved, { firstName: 'Anna', lastName: 'Lima' })).toBe(true);
    expect(hasProfileChanges(saved, { firstName: 'Ana', lastName: '' })).toBe(true);
  });
});

describe('mapProfileError', () => {
  it('erro sem ApiError é rede ou servidor', () => {
    expect(mapProfileError({ networkError: {} })).toEqual(
      expect.objectContaining({ kind: 'banner', message: expect.stringContaining('conexão') }),
    );
    expect(mapProfileError(new Error('boom'))).toEqual(
      expect.objectContaining({ kind: 'banner', message: expect.stringContaining('do nosso lado') }),
    );
  });

  it('UNAUTHENTICATED vira sessão expirada', () => {
    expect(
      mapProfileError({ errors: [{ type: 'UNAUTHENTICATED', message: 'x' }] }),
    ).toEqual({ kind: 'sessionExpired' });
  });

  it('VALIDATION_ERROR com field vai para o campo', () => {
    expect(
      mapProfileError({
        errors: [
          {
            message: 'Informe seu nome.',
            extensions: { type: 'VALIDATION_ERROR', field: 'firstName' },
          },
        ],
      }),
    ).toEqual({ kind: 'field', field: 'firstName', message: 'Informe seu nome.' });
  });

  it('VALIDATION_ERROR sem field vai para o banner', () => {
    expect(
      mapProfileError({
        errors: [{ message: 'Algo', extensions: { type: 'VALIDATION_ERROR' } }],
      }),
    ).toEqual({ kind: 'banner', message: 'Algo' });
  });
});
