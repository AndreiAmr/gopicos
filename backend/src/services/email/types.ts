export interface EmailMessage {
  to: string;
  subject: string;
  text: string;
  html: string;
}

/**
 * Transporte de e-mail. Implementações são trocáveis (Resend, simulado, ...).
 * Deve lançar erro se o provedor recusar o envio.
 */
export interface EmailTransport {
  readonly name: string;
  send(message: EmailMessage): Promise<void>;
}

export interface PasswordResetCodeParams {
  to: string;
  name?: string;
  code: string;
  expiresInMinutes?: number;
}

export interface EmailService {
  sendPasswordResetCode(params: PasswordResetCodeParams): Promise<void>;
}
