import { EmailMessage, EmailTransport } from './types';

type FetchLike = (
  url: string,
  init: { method: string; headers: Record<string, string>; body: string; signal?: AbortSignal },
) => Promise<{ ok: boolean; status: number }>;

const UNIFORM_ERROR = 'Falha ao enviar e-mail pelo Resend';

export function maskEmail(email: string): string {
  const [local = '', domain = ''] = email.split('@');
  return `${local.slice(0, 1)}***@${domain}`;
}

/** Transporte simulado: usado quando não há provedor configurado (local/teste). */
export class ConsoleEmailTransport implements EmailTransport {
  readonly name = 'console';

  async send(message: EmailMessage): Promise<void> {
    // Nunca loga o conteúdo (contém o código) nem o endereço completo.
    console.info(
      `[email] envio simulado (sem provedor configurado): assunto="${message.subject}" destinatário=${maskEmail(message.to)}`,
    );
  }
}

/** Transporte Resend via API HTTPS (https://resend.com/docs/api-reference/emails/send-email). */
export class ResendEmailTransport implements EmailTransport {
  readonly name = 'resend';

  constructor(
    private readonly options: {
      apiKey: string;
      from: string;
      fetchImpl?: FetchLike;
      timeoutMs?: number;
    },
  ) {}

  async send(message: EmailMessage): Promise<void> {
    const doFetch: FetchLike = this.options.fetchImpl ?? (fetch as unknown as FetchLike);
    const timeoutMs = this.options.timeoutMs ?? 10_000;
    let response: { ok: boolean; status: number };
    try {
      response = await doFetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.options.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: this.options.from,
          to: [message.to],
          subject: message.subject,
          text: message.text,
          html: message.html,
        }),
        signal: AbortSignal.timeout(timeoutMs),
      });
    } catch {
      // Erro de rede/timeout: mensagem uniforme, sem detalhes do erro original.
      throw new Error(UNIFORM_ERROR);
    }

    if (!response.ok) {
      // Só o status do provedor; nunca o conteúdo da mensagem.
      throw new Error(`${UNIFORM_ERROR} (HTTP ${response.status})`);
    }
  }
}
