import { describe, expect, it } from 'vitest';
import {
  fullDate,
  reviewA11yLabel,
  reviewsCountLabel,
  spotsCountLabel,
} from './activityLogic';

describe('activityLogic', () => {
  it('usa o singular correto nas contagens', () => {
    expect(spotsCountLabel(1)).toBe('1 pico');
    expect(spotsCountLabel(3)).toBe('3 picos');
    expect(reviewsCountLabel(1)).toBe('1 avaliação');
    expect(reviewsCountLabel(0)).toBe('0 avaliações');
  });

  it('formata a data completa', () => {
    expect(fullDate('2026-10-12T15:00:00.000Z')).toBe('12/10/2026');
    expect(fullDate('lixo')).toBe('');
  });

  it('compõe o rótulo de acessibilidade da avaliação', () => {
    const base = {
      rating: 4,
      createdAt: '2026-10-12T15:00:00.000Z',
      spot: { name: 'Praça' },
    };
    expect(reviewA11yLabel({ ...base, description: 'Muito bom' })).toBe(
      'Praça, sua nota 4 de 5, 12/10/2026. Muito bom. Abrir pico.',
    );
    expect(reviewA11yLabel({ ...base, description: null })).toBe(
      'Praça, sua nota 4 de 5, 12/10/2026. Abrir pico.',
    );
  });
});
