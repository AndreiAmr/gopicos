/**
 * Medidas do pin sticker desenhado como imagem do mapa (spec home.md 6.6).
 * Larguras aproximadas da Inter Bold: dígitos ~0,6 em, vírgula ~0,3 em,
 * estrela ~0,8 em. Assim "★ 4,6" fica centralizado e com o espaço visível.
 */
const DIGIT_EM = 0.6;
const COMMA_EM = 0.3;
const STAR_EM = 0.8;
const GAP_EM = 0.3;
const PADDING_X = 9;

const charWidth = (char: string, fontSize: number) => {
  if (char === ',' || char === '.') return COMMA_EM * fontSize;
  if (/[0-9]/.test(char)) return DIGIT_EM * fontSize;
  // Letras de "Novo".
  return (char === 'N' ? 0.72 : 0.6) * fontSize;
};

export type PinLayout = {
  width: number;
  height: number;
  fontSize: number;
  star: { x: number } | null;
  text: { x: number; value: string };
};

export const pinLayout = (label: string, selected = false): PinLayout => {
  const fontSize = selected ? 13 : 12;
  const height = selected ? 30 : 26;
  const rated = label.startsWith('★');
  const value = rated ? label.slice(1).trim() : label;
  const textWidth = [...value].reduce((sum, c) => sum + charWidth(c, fontSize), 0);
  const starWidth = rated ? STAR_EM * fontSize + GAP_EM * fontSize : 0;
  const content = starWidth + textWidth;
  const width = Math.ceil(content + PADDING_X * 2);
  const start = (width - content) / 2;
  return {
    width,
    height,
    fontSize,
    star: rated ? { x: start } : null,
    text: { x: start + starWidth, value },
  };
};
