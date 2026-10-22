import { buildPasswordResetCodeEmail } from './templates';
import { ConsoleEmailTransport, ResendEmailTransport } from './transports';
import { EmailService, EmailTransport } from './types';

export * from './types';
export { buildPasswordResetCodeEmail } from './templates';
export { ConsoleEmailTransport, ResendEmailTransport } from './transports';

const DEFAULT_FROM = 'GoPicos <no-reply@gopicos.com>';

/** Escolhe o transporte pelas variáveis de ambiente. Sem RESEND_API_KEY, o envio é simulado. */
export function createEmailTransportFromEnv(env: NodeJS.ProcessEnv = process.env): EmailTransport {
  const apiKey = env.RESEND_API_KEY?.trim();
  if (!apiKey) return new ConsoleEmailTransport();
  return new ResendEmailTransport({
    apiKey,
    from: env.EMAIL_FROM?.trim() || DEFAULT_FROM,
  });
}

export function createEmailService(transport: EmailTransport): EmailService {
  return {
    async sendPasswordResetCode(params) {
      await transport.send(buildPasswordResetCodeEmail(params));
    },
  };
}

let instance: EmailService | undefined;

/** Instância compartilhada configurada pelo ambiente. */
export function getEmailService(): EmailService {
  if (!instance) instance = createEmailService(createEmailTransportFromEnv());
  return instance;
}
