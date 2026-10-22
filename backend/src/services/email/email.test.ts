import {
  ConsoleEmailTransport,
  ResendEmailTransport,
  buildPasswordResetCodeEmail,
  createEmailService,
  createEmailTransportFromEnv,
} from './index';
import { EmailMessage, EmailTransport } from './types';

describe('template de recuperação de senha', () => {
  it('gera assunto e corpo em pt-BR com o código e a validade', () => {
    const email = buildPasswordResetCodeEmail({ to: 'a@b.com', name: 'Tony', code: '123456' });
    expect(email.subject).toContain('GoPicos');
    expect(email.text).toContain('Olá, Tony!');
    expect(email.text).toContain('123456');
    expect(email.text).toContain('15 minutos');
    expect(email.html).toContain('123456');
    expect(email.html).toContain('lang="pt-BR"');
  });

  it('escapa HTML no nome', () => {
    const email = buildPasswordResetCodeEmail({ to: 'a@b.com', name: '<b>x</b>', code: '123456' });
    expect(email.html).not.toContain('<b>x</b>');
    expect(email.html).toContain('&lt;b&gt;');
  });
});

describe('EmailService', () => {
  it('envia o e-mail de código pelo transporte injetado', async () => {
    const sent: EmailMessage[] = [];
    const transport: EmailTransport = { name: 'fake', send: async (m) => void sent.push(m) };
    await createEmailService(transport).sendPasswordResetCode({ to: 'a@b.com', code: '654321' });
    expect(sent).toHaveLength(1);
    expect(sent[0].to).toBe('a@b.com');
    expect(sent[0].text).toContain('654321');
  });
});

describe('ResendEmailTransport', () => {
  const message: EmailMessage = { to: 'a@b.com', subject: 's', text: 't', html: '<p>h</p>' };

  it('chama a API do Resend com remetente e autenticação', async () => {
    const fetchImpl = jest.fn().mockResolvedValue({ ok: true, status: 200 });
    await new ResendEmailTransport({ apiKey: 'k', from: 'GoPicos <x@y.com>', fetchImpl }).send(message);
    const [url, init] = fetchImpl.mock.calls[0];
    expect(url).toBe('https://api.resend.com/emails');
    expect(init.headers.Authorization).toBe('Bearer k');
    expect(JSON.parse(init.body)).toMatchObject({ from: 'GoPicos <x@y.com>', to: ['a@b.com'], subject: 's' });
  });

  it('lança erro sem vazar o conteúdo quando o provedor recusa', async () => {
    const fetchImpl = jest.fn().mockResolvedValue({ ok: false, status: 422 });
    const transport = new ResendEmailTransport({ apiKey: 'k', from: 'f', fetchImpl });
    const error = await transport.send({ ...message, text: 'codigo 999999' }).catch((e) => e);
    expect(error).toBeInstanceOf(Error);
    expect(error.message).toContain('HTTP 422');
    expect(error.message).not.toContain('999999');
  });
});

describe('transporte simulado e seleção por ambiente', () => {
  it('sem RESEND_API_KEY usa o transporte simulado', () => {
    expect(createEmailTransportFromEnv({}).name).toBe('console');
    expect(createEmailTransportFromEnv({ RESEND_API_KEY: '  ' }).name).toBe('console');
  });

  it('com RESEND_API_KEY usa o Resend', () => {
    expect(createEmailTransportFromEnv({ RESEND_API_KEY: 'k' }).name).toBe('resend');
  });

  it('registra o envio sem logar o código nem o e-mail completo, e não quebra', async () => {
    const spy = jest.spyOn(console, 'info').mockImplementation(() => {});
    await createEmailService(new ConsoleEmailTransport()).sendPasswordResetCode({
      to: 'skatista@exemplo.com',
      code: '424242',
    });
    expect(spy).toHaveBeenCalledTimes(1);
    const logged = String(spy.mock.calls[0][0]);
    expect(logged).not.toContain('424242');
    expect(logged).not.toContain('skatista@');
    spy.mockRestore();
  });
});
