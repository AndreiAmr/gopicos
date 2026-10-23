import {
  executeAnonymous,
  executeAuthenticated,
} from '../../../../test/graphql';
import { createUser, tokenFor } from '../../../../test/factories';
import { prisma, useTestDatabase } from '../../../../test/db';

const UPDATE = `mutation ($props: UpdateProfileInput!) {
  updateProfile(props: $props) { id name firstName lastName email }
}`;

describe('mutation updateProfile (integração)', () => {
  useTestDatabase();

  it('atualiza nome e sobrenome e devolve o novo perfil', async () => {
    const user = await createUser({ email: 'a@test.com' });

    const { data, errors } = await executeAuthenticated(tokenFor(user), UPDATE, {
      props: { firstName: '  Rodney ', lastName: 'Mullen  ' },
    });

    expect(errors).toBeUndefined();
    expect(data.updateProfile).toEqual({
      id: user.id,
      name: 'Rodney Mullen',
      firstName: 'Rodney',
      lastName: 'Mullen',
      email: 'a@test.com',
    });
    const saved = await prisma.user.findUnique({ where: { id: user.id } });
    expect(saved?.firstName).toBe('Rodney');
  });

  it('aceita exatamente 40 caracteres e rejeita 41', async () => {
    const user = await createUser();

    const ok = await executeAuthenticated(tokenFor(user), UPDATE, {
      props: { firstName: 'a'.repeat(40), lastName: 'b'.repeat(40) },
    });
    expect(ok.errors).toBeUndefined();

    const { errors } = await executeAuthenticated(tokenFor(user), UPDATE, {
      props: { firstName: 'a'.repeat(41), lastName: 'Silva' },
    });
    expect(errors?.[0].extensions?.type).toBe('VALIDATION_ERROR');
    expect(errors?.[0].extensions?.field).toBe('firstName');
  });

  it.each([
    [{ firstName: '   ', lastName: 'Silva' }, 'firstName'],
    [{ firstName: 'Ana', lastName: '' }, 'lastName'],
    [{ firstName: 'A', lastName: 'Silva' }, 'firstName'],
  ])('rejeita nome inválido %j', async (props, field) => {
    const user = await createUser();

    const { errors } = await executeAuthenticated(tokenFor(user), UPDATE, {
      props,
    });

    expect(errors?.[0].extensions?.type).toBe('VALIDATION_ERROR');
    expect(errors?.[0].extensions?.field).toBe(field);
  });

  it('não aceita id no input: só altera o dono do token', async () => {
    const user = await createUser();
    const other = await createUser({ firstName: 'Outro' });

    const { errors } = await executeAuthenticated(tokenFor(user), UPDATE, {
      props: { id: other.id, firstName: 'Novo', lastName: 'Nome' },
    });
    expect(errors?.[0].message).toMatch(/id/);

    const unchanged = await prisma.user.findUnique({ where: { id: other.id } });
    expect(unchanged?.firstName).toBe('Outro');
  });

  it('retorna UNAUTHENTICATED sem token', async () => {
    const { errors } = await executeAnonymous(UPDATE, {
      props: { firstName: 'Ana', lastName: 'Silva' },
    });
    expect(errors?.[0].extensions?.type).toBe('UNAUTHENTICATED');
  });
});
