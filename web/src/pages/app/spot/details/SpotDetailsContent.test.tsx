import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router';

import type { SpotDetails } from '@/domain/spot/details';
import { SpotDetailsContent } from './SpotDetailsContent';
import { SpotNotFound } from './SpotDetailsStates';

vi.mock('./MiniMap', () => ({ MiniMap: () => <div data-testid="mini-map" /> }));

afterEach(cleanup);

const spot: SpotDetails = {
  id: 'abc',
  name: 'Praça da Sé',
  description: 'Chão liso.',
  modality: 'street',
  isPaid: true,
  entryAmount: 'R$ 20',
  alwaysOpen: false,
  openingHours: 'Seg a sex, 8h às 22h',
  hasCoverage: true,
  equipmentRequired: false,
  images: ['a.jpg', 'b.jpg'],
  coordinates: null,
  ratingAverage: 4.6,
  reviewsCount: 23,
  isOwner: false,
  author: { id: 'u1', displayName: 'Marina S.' },
};

const renderContent = (overrides: Partial<SpotDetails> = {}, handlers = {}) =>
  render(
    <MemoryRouter>
      <SpotDetailsContent
        spot={{ ...spot, ...overrides }}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
        {...handlers}
      />
    </MemoryRouter>,
  );

describe('SpotDetailsContent', () => {
  it('mostra título, chips, nota, informações e autor', () => {
    renderContent();

    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe('Praça da Sé');
    expect(screen.getByText('Street')).toBeTruthy();
    expect(screen.getByText('Coberto', { selector: 'li' })).toBeTruthy();
    expect(screen.getByText('4,6 (23)')).toBeTruthy();
    expect(screen.getByText('Seg a sex, 8h às 22h')).toBeTruthy();
    expect(screen.getByText('Criado por Marina S.')).toBeTruthy();
    expect(screen.getByText('Chão liso.')).toBeTruthy();
    expect(screen.getByRole('link', { name: 'Voltar ao mapa' }).getAttribute('href')).toBe('/home');
  });

  it('mostra "Sem avaliações ainda" e esconde o link de avaliações', () => {
    renderContent({ ratingAverage: null, reviewsCount: 0 });

    expect(screen.getByText('Sem avaliações ainda')).toBeTruthy();
    expect(screen.queryByText('Ver avaliações')).toBeNull();
  });

  it('esconde as ações do autor para quem não é o autor', () => {
    renderContent();
    expect(screen.queryByTestId('owner-actions')).toBeNull();
  });

  it('mostra Editar e Excluir para o autor', () => {
    const onEdit = vi.fn();
    const onDelete = vi.fn();
    renderContent({ isOwner: true }, { onEdit, onDelete });

    fireEvent.click(screen.getByRole('button', { name: 'Editar' }));
    fireEvent.click(screen.getByRole('button', { name: 'Excluir' }));
    expect(onEdit).toHaveBeenCalled();
    expect(onDelete).toHaveBeenCalled();
  });

  it('abre o lightbox ao clicar na foto e fecha com Esc', () => {
    renderContent();

    fireEvent.click(screen.getByRole('button', { name: 'Ampliar foto 1 de 2' }));
    const dialog = within(screen.getByRole('dialog'));
    expect(dialog.getByText('1 / 2')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Próxima foto' }));
    expect(dialog.getByText('2 / 2')).toBeTruthy();
    fireEvent.keyDown(screen.getByRole('dialog'), { key: 'Escape' });
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('mostra o tile de "Sem fotos"', () => {
    renderContent({ images: [] });
    expect(screen.getByTestId('gallery-empty')).toBeTruthy();
  });
});

describe('SpotNotFound', () => {
  it('mostra a mensagem e o retorno ao mapa', () => {
    render(
      <MemoryRouter>
        <SpotNotFound />
      </MemoryRouter>,
    );
    expect(screen.getByText('Pico não encontrado')).toBeTruthy();
    expect(screen.getByRole('link', { name: 'Voltar ao mapa' })).toBeTruthy();
  });
});
