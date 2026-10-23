import React from 'react';
import { act, renderHook, waitFor } from '@testing-library/react-native';
import { MockedProvider } from '@apollo/client/testing/react';
import { Place } from '../../../domain/place/place';
import { placeSearchQuery } from './placeSearchQuery';
import { usePlaceSearch } from './usePlaceSearch';

type Mocks = React.ComponentProps<typeof MockedProvider>['mocks'];

const place = (n: number): Place => ({
  name: `Lugar ${n}`,
  lat: -23 - n / 100,
  lng: -46,
  road: `Rua ${n}`,
  district: null,
  suburb: 'Centro',
  city: 'São Paulo',
  state: 'SP',
  boundingBox: null,
});

const render = async (mocks: Mocks) =>
  await renderHook(() => usePlaceSearch(), {
    wrapper: ({ children }) => (
      <MockedProvider mocks={mocks}>{children}</MockedProvider>
    ),
  });

const request = (search: string) => ({
  query: placeSearchQuery,
  variables: { search },
});

describe('usePlaceSearch', () => {
  it('com 1 a 2 letras mostra a dica e não consulta', async () => {
    const { result } = await render([]);

    await act(async () => result.current.onChangeText('sa'));

    expect(result.current.status).toBe('hint');
    expect(result.current.results).toEqual([]);
  });

  it('a partir de 3 letras busca e devolve no máximo 5 resultados', async () => {
    const { result } = await render([
      {
        request: request('Paulista'),
        result: {
          data: {
            getFowardGeocoding: Array.from({ length: 7 }, (_, i) => place(i)),
          },
        },
      },
    ]);

    await act(async () => result.current.onChangeText('Paulista'));
    expect(result.current.status).toBe('loading');

    await waitFor(() => expect(result.current.status).toBe('ready'));
    expect(result.current.results).toHaveLength(5);
  });

  it('sem resultados vira "empty"', async () => {
    const { result } = await render([
      { request: request('xyzxyz'), result: { data: { getFowardGeocoding: [] } } },
    ]);

    await act(async () => result.current.onChangeText('xyzxyz'));
    await waitFor(() => expect(result.current.status).toBe('empty'));
  });

  it('erro permite tentar novamente', async () => {
    const { result } = await render([
      { request: request('Paulista'), error: new Error('rede') },
      {
        request: request('Paulista'),
        result: { data: { getFowardGeocoding: [place(1)] } },
      },
    ]);

    await act(async () => result.current.onChangeText('Paulista'));
    await waitFor(() => expect(result.current.status).toBe('error'));

    await act(async () => result.current.retry());
    await waitFor(() => expect(result.current.status).toBe('ready'));
  });

  it('escolher mantém o nome no campo e para a busca; restaurar volta o texto', async () => {
    const { result } = await render([]);

    await act(async () => result.current.commit(place(1)));
    expect(result.current.text).toBe('Lugar 1');
    expect(result.current.status).toBe('idle');

    await act(async () => result.current.restore('antes'));
    expect(result.current.text).toBe('antes');

    await act(async () => result.current.clear());
    expect(result.current.text).toBe('');
  });
});
