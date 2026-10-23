import { describe, expect, it } from 'vitest';
import {
  type Review,
  appendPage,
  authorInitial,
  authorName,
  canSubmitReview,
  commentCounter,
  hasDraft,
  fullDate,
  loadedAnnouncement,
  relativeDate,
  ratingLabel,
  reviewA11yLabel,
} from './reviews';

const review = (over: Partial<Review> = {}): Review => ({
  id: 'r1',
  rating: 4,
  description: 'Muito bom',
  createdAt: '2026-10-12T15:00:00.000Z',
  author: { id: 'u1', displayName: 'Marina S.' },
  isMine: false,
  ...over,
});

describe('domain/spot/reviews', () => {
  it('rotula a nota', () => {
    expect(ratingLabel(0)).toBe('');
    expect(ratingLabel(1)).toBe('Ruim');
    expect(ratingLabel(3)).toBe('Bom');
    expect(ratingLabel(5)).toBe('Excelente');
  });

  it('só permite enviar com 1 a 5 estrelas e comentário até 500', () => {
    expect(canSubmitReview(0, '')).toBe(false);
    expect(canSubmitReview(3, '')).toBe(true);
    expect(canSubmitReview(3, 'a'.repeat(500))).toBe(true);
    expect(canSubmitReview(3, 'a'.repeat(501))).toBe(false);
    expect(commentCounter('abc')).toBe('3/500');
  });

  it('detecta rascunho a descartar', () => {
    expect(hasDraft(0, '')).toBe(false);
    expect(hasDraft(2, '')).toBe(true);
    expect(hasDraft(0, '  ')).toBe(false);
    expect(hasDraft(4, 'x', { rating: 4, description: 'x' })).toBe(false);
    expect(hasDraft(5, 'x', { rating: 4, description: 'x' })).toBe(true);
  });

  it('mostra autor desativado de forma neutra', () => {
    expect(authorName(review())).toBe('Marina S.');
    expect(authorInitial(review())).toBe('M');
    expect(authorName(review({ author: null }))).toBe('Usuário Desativado');
    expect(authorInitial(review({ author: null }))).toBe('?');
  });

  it('compõe o rótulo de acessibilidade', () => {
    expect(reviewA11yLabel(review(), 'há 2 dias')).toBe(
      'Marina S., nota 4 de 5, há 2 dias. Muito bom',
    );
    expect(reviewA11yLabel(review({ description: null }), 'há 2 dias')).toBe(
      'Marina S., nota 4 de 5, há 2 dias.',
    );
  });

  it('junta páginas sem duplicar', () => {
    const merged = appendPage(
      [review({ id: 'a' })],
      [review({ id: 'a' }), review({ id: 'b' })],
    );
    expect(merged.map(item => item.id)).toEqual(['a', 'b']);
  });

  it('formata datas e anúncios', () => {
    const now = new Date('2026-10-22T12:00:00.000Z').getTime();
    expect(relativeDate('2026-10-22T11:59:00.000Z', now)).toBe('agora há pouco');
    expect(relativeDate('2026-10-20T12:00:00.000Z', now)).toBe('há 2 dias');
    expect(relativeDate('2026-10-01T12:00:00.000Z', now)).toBe('há 3 semanas');
    expect(fullDate('2026-10-12T15:00:00.000Z')).toBe('12/10/2026');
    expect(loadedAnnouncement(1)).toBe('1 avaliação carregada');
    expect(loadedAnnouncement(10)).toBe('10 avaliações carregadas');
  });
});
