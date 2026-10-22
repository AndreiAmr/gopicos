import { EmailMessage, PasswordResetCodeParams } from './types';

export const DEFAULT_CODE_EXPIRATION_MINUTES = 15;

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

export function buildPasswordResetCodeEmail(params: PasswordResetCodeParams): EmailMessage {
  const minutes = params.expiresInMinutes ?? DEFAULT_CODE_EXPIRATION_MINUTES;
  const greeting = params.name ? `Olá, ${params.name}!` : 'Olá!';
  const subject = 'GoPicos: seu código de recuperação de senha';

  const text = [
    greeting,
    '',
    'Recebemos um pedido para redefinir a senha da sua conta no GoPicos.',
    `Seu código de recuperação é: ${params.code}`,
    `Ele é válido por ${minutes} minutos.`,
    '',
    'Se você não fez esse pedido, ignore este e-mail: sua senha continua a mesma.',
    '',
    'Equipe GoPicos',
  ].join('\n');

  const html = `<!doctype html>
<html lang="pt-BR">
  <body style="font-family: Arial, Helvetica, sans-serif; color: #222; line-height: 1.5;">
    <p>${escapeHtml(greeting)}</p>
    <p>Recebemos um pedido para redefinir a senha da sua conta no GoPicos.</p>
    <p>Seu código de recuperação é:</p>
    <p style="font-size: 32px; font-weight: bold; letter-spacing: 6px;">${escapeHtml(params.code)}</p>
    <p>Ele é válido por ${escapeHtml(String(minutes))} minutos.</p>
    <p>Se você não fez esse pedido, ignore este e-mail: sua senha continua a mesma.</p>
    <p>Equipe GoPicos</p>
  </body>
</html>`;

  return { to: params.to, subject, text, html };
}
