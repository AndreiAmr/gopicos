import {
  clampRating,
  formatAverage,
  getStarFills,
  roundToHalf,
  starLabel,
  stepRating,
} from './logic';

describe('StarRating logic', () => {
  describe('clampRating', () => {
    it('limita ao intervalo 0-5', () => {
      expect(clampRating(-2)).toBe(0);
      expect(clampRating(7)).toBe(5);
      expect(clampRating(3.2)).toBe(3.2);
    });

    it('trata valores inválidos como 0', () => {
      expect(clampRating(NaN)).toBe(0);
      expect(clampRating(Infinity)).toBe(0);
    });
  });

  describe('roundToHalf', () => {
    it('arredonda para o meio ponto mais próximo', () => {
      expect(roundToHalf(4.2)).toBe(4);
      expect(roundToHalf(4.3)).toBe(4.5);
      expect(roundToHalf(4.8)).toBe(5);
    });
  });

  describe('getStarFills', () => {
    it('nota inteira preenche as primeiras estrelas', () => {
      expect(getStarFills(3)).toEqual([
        'full',
        'full',
        'full',
        'empty',
        'empty',
      ]);
    });

    it('média fracionada usa meia estrela', () => {
      expect(getStarFills(3.6)).toEqual([
        'full',
        'full',
        'full',
        'half',
        'empty',
      ]);
    });

    it('zero e acima do máximo', () => {
      expect(getStarFills(0)).toEqual(Array(5).fill('empty'));
      expect(getStarFills(9)).toEqual(Array(5).fill('full'));
    });
  });

  describe('formatAverage', () => {
    it('formata em pt-BR com 1 casa e contagem', () => {
      expect(formatAverage(4.25, 12)).toBe('4,3 (12)');
      expect(formatAverage(5, 1)).toBe('5,0 (1)');
    });

    it('sem avaliações devolve o fallback', () => {
      expect(formatAverage(0, 0, 'Sem avaliações')).toBe('Sem avaliações');
      expect(formatAverage(4, 0)).toBe('');
    });
  });

  describe('starLabel', () => {
    it('gera o rótulo de acessibilidade', () => {
      expect(starLabel(3)).toBe('3 de 5 estrelas');
      expect(starLabel(1)).toBe('1 de 5 estrelas');
      expect(starLabel(4.5)).toBe('4,5 de 5 estrelas');
    });
  });

  describe('stepRating', () => {
    it('incrementa e decrementa dentro de 1-5', () => {
      expect(stepRating(3, 1)).toBe(4);
      expect(stepRating(3, -1)).toBe(2);
      expect(stepRating(5, 1)).toBe(5);
      expect(stepRating(1, -1)).toBe(1);
    });

    it('sem nota ainda, o primeiro passo escolhe 1', () => {
      expect(stepRating(0, 1)).toBe(1);
      expect(stepRating(0, -1)).toBe(1);
    });
  });
});
