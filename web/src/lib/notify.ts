import { toast } from 'sonner';

/** Duracao padrao do toast (DS: 4 s). */
export const TOAST_DURATION_MS = 4000;

type NotifyOptions = {
  description?: string;
  /** Acao opcional (ex.: "Tentar novamente"). */
  action?: { label: string; onClick: () => void };
};

/**
 * Erro que exige acao do usuario nao some sozinho; os demais somem em 4 s.
 */
export const durationFor = (
  type: 'success' | 'info' | 'warning' | 'error',
  options?: NotifyOptions,
) => (type === 'error' && options?.action ? Infinity : TOAST_DURATION_MS);

const show =
  (type: 'success' | 'info' | 'warning' | 'error') =>
  (message: string, options?: NotifyOptions) =>
    toast[type](message, {
      description: options?.description,
      action: options?.action,
      duration: durationFor(type, options),
    });

export const notify = {
  success: show('success'),
  info: show('info'),
  warning: show('warning'),
  error: show('error'),
};
