import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/config/http', () => ({ default: { post: vi.fn() } }));
vi.mock('@/utils/session', () => ({ getToken: () => 'tok' }));

import http from '@/config/http';
import {
  buildCreateSpotBody,
  createSpotRequest,
} from './useCreateSpotMutation';

const post = http.post as unknown as ReturnType<typeof vi.fn>;
const photo = new File(['x'], 'a.jpg', { type: 'image/jpeg' });

describe('createSpotRequest', () => {
  beforeEach(() => post.mockReset());

  it('monta o multipart com um arquivo por foto', () => {
    const body = buildCreateSpotBody({ name: 'P' }, [photo, photo]);
    expect(JSON.parse(body.get('map') as string)).toEqual({
      '0': ['variables.input.images.0'],
      '1': ['variables.input.images.1'],
    });
    expect(
      JSON.parse(body.get('operations') as string).variables.input.images,
    ).toEqual([null, null]);
    expect(body.get('1')).toBeInstanceOf(File);
  });

  it('devolve o id e envia o token', async () => {
    post.mockResolvedValue({ data: { data: { createSpot: { id: '9' } } } });
    expect(await createSpotRequest({}, [photo])).toBe('9');
    expect(post.mock.calls[0][2].headers.Authorization).toBe('Bearer tok');
  });

  it('propaga tipo e campo do erro do servidor', async () => {
    post.mockResolvedValue({
      data: {
        errors: [
          {
            message: 'Nome inválido',
            extensions: { type: 'VALIDATION_ERROR', field: 'name' },
          },
        ],
      },
    });
    await expect(createSpotRequest({}, [photo])).rejects.toMatchObject({
      type: 'VALIDATION_ERROR',
      field: 'name',
      message: 'Nome inválido',
    });
  });

  it('trata resposta sem id como falha de rede', async () => {
    post.mockResolvedValue({ data: {} });
    await expect(createSpotRequest({}, [photo])).rejects.toMatchObject({
      name: 'CreateSpotError',
      isNetwork: true,
    });
  });
});
