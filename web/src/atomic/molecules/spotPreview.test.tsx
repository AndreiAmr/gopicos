import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';

import { SpotPreview } from './spotPreview';
import type { SpotSummary } from '@/domain/spot/spot';

afterEach(cleanup);

const spot: SpotSummary = {
  id: 'abc',
  name: 'Praça da Sé',
  modality: 'street',
  coordinates: null,
  images: [],
  ratingAverage: 4.6,
  reviewsCount: 23,
};

const renderPreview = (overrides: Partial<SpotSummary> = {}, distance?: string) =>
  render(
    <MemoryRouter>
      <SpotPreview spot={{ ...spot, ...overrides }} distanceLabel={distance} />
    </MemoryRouter>,
  );

describe('SpotPreview', () => {
  it('mostra nome, modalidade, nota com contagem e link para o detalhe', () => {
    renderPreview({}, 'A 1,2 km de você');

    expect(screen.getByText('Praça da Sé')).toBeTruthy();
    expect(screen.getByText('Street')).toBeTruthy();
    expect(screen.getByText('4,6 (23)')).toBeTruthy();
    expect(screen.getByText('A 1,2 km de você')).toBeTruthy();
    expect(
      screen.getByRole('link', { name: 'Ver detalhes' }).getAttribute('href'),
    ).toBe('/spot/abc');
  });

  it('mostra "Sem avaliações" quando não há nota e omite a distância sem localização', () => {
    renderPreview({ ratingAverage: null, reviewsCount: 0 });

    expect(screen.getByText('Sem avaliações')).toBeTruthy();
    expect(screen.queryByText(/de você/)).toBeNull();
  });

  it('descreve o card para leitores de tela', () => {
    renderPreview();

    expect(
      screen.getByLabelText('Praça da Sé, Street, nota 4,6 de 5, 23 avaliações'),
    ).toBeTruthy();
  });
});
