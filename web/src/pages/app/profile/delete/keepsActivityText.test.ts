import { describe, expect, it } from 'vitest';

import { keepsActivityText } from '../profileLogic';

describe('keepsActivityText', () => {
  it('sem contagens usa o texto genérico', () => {
    expect(keepsActivityText(undefined, undefined)).toBe(
      'Seus picos e avaliações continuam no GoPicos, com o autor mostrado como "Usuário Desativado".',
    );
  });

  it('com contagens cita picos e avaliações', () => {
    expect(keepsActivityText(3, 2)).toBe(
      'Seus 3 picos e 2 avaliações continuam no GoPicos, com o autor mostrado como "Usuário Desativado".',
    );
  });

  it('singular e só um dos dois', () => {
    expect(keepsActivityText(1, 0)).toMatch(/^Seu 1 pico continua no GoPicos/);
    expect(keepsActivityText(0, 1)).toMatch(/^Sua 1 avaliação continua no GoPicos/);
    expect(keepsActivityText(0, 4)).toMatch(/^Seus 4 avaliações continuam/);
  });

  it('ambas zero omite o item', () => {
    expect(keepsActivityText(0, 0)).toBeNull();
  });
});
