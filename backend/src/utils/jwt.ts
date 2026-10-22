import jwt, { SignOptions } from 'jsonwebtoken';
// JWT de 7 dias, sem refresh token (decisão D8)
export const TOKEN_EXPIRES_IN = '7d';

const getSecret = () => process.env.JWT_SECRET || '';

export const generateToken = (
  payload: object,
  expiresIn: SignOptions['expiresIn'] = TOKEN_EXPIRES_IN,
) => {
  const JWT_SECRET = getSecret();
  if (!JWT_SECRET) throw new Error('JWT_SECRET must be string');
  const expiresInSeconds =
    typeof expiresIn === 'string' ? msToSeconds(expiresIn) : expiresIn;

  const createdAt = Math.floor(Date.now() / 1000);
  const exp = createdAt + expiresInSeconds;

  const token = jwt.sign(payload, JWT_SECRET, { expiresIn });

  return {
    token,
    exp,
    createdAt,
  };
};

export const getTokenData = (token: string) => {
  try {
    const secret = getSecret();
    if (!secret) return null;
    return jwt.verify(token, secret);
  } catch {
    return null;
  }
};

export function msToSeconds(time: string): number {
  const match = /^(\d+)([smhd])$/.exec(time);
  if (!match) throw new Error('Formato inválido de expiresIn');

  const value = parseInt(match[1], 10);
  const unit = match[2];

  switch (unit) {
    case 's':
      return value;
    case 'm':
      return value * 60;
    case 'h':
      return value * 60 * 60;
    case 'd':
      return value * 60 * 60 * 24;
    default:
      throw new Error('Unidade inválida');
  }
}
