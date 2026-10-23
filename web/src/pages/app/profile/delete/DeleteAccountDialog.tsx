import { CheckCircle2Icon, InfoIcon } from 'lucide-react';

import { AlertBanner } from '@/atomic/molecules/alertBanner';
import { Button } from '@/atomic/atoms/button';
import { PasswordInput } from '@/atomic/atoms/passwordInput';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import { DELETE_STRINGS } from '../profileLogic';
import { useDeleteAccount } from './useDeleteAccount';

type DeleteAccountDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

/**
 * P4 na web: `alertdialog` com o aviso do que acontece e do que não acontece
 * (D4), a senha e os botões Cancelar | Excluir conta.
 */
export const DeleteAccountDialog = ({ open, onOpenChange }: DeleteAccountDialogProps) => {
  const s = useDeleteAccount(open);

  const items = [
    { key: 'hidden', text: DELETE_STRINGS.hiddenProfile, Icon: InfoIcon },
    { key: 'keeps', text: s.keepsActivity, Icon: CheckCircle2Icon },
    { key: 'averages', text: DELETE_STRINGS.averages, Icon: CheckCircle2Icon },
    { key: 'reactivate', text: DELETE_STRINGS.reactivate, Icon: CheckCircle2Icon },
  ].filter((item) => item.text);

  return (
    <Dialog open={open} onOpenChange={(next) => !s.isLoading && onOpenChange(next)}>
      <DialogContent
        role="alertdialog"
        className="sm:max-w-[480px]"
        onEscapeKeyDown={(e) => s.isLoading && e.preventDefault()}
        onPointerDownOutside={(e) => s.isLoading && e.preventDefault()}
        onOpenAutoFocus={(e) => {
          // Foco inicial no título: a pessoa lê o aviso antes de digitar a senha.
          e.preventDefault();
          s.titleRef.current?.focus();
        }}
      >
        <DialogHeader>
          <DialogTitle ref={s.titleRef} tabIndex={-1}>
            {DELETE_STRINGS.title}
          </DialogTitle>
          <DialogDescription className="font-semibold text-gp-text">
            {DELETE_STRINGS.headline}
          </DialogDescription>
        </DialogHeader>

        <ul className="flex flex-col gap-3">
          {items.map(({ key, text, Icon }) => (
            <li key={key} className="flex items-start gap-3 text-body text-gp-text" data-testid={`delete-item-${key}`}>
              <Icon className="mt-0.5 size-5 shrink-0 text-gp-text-muted" aria-hidden="true" />
              <span>{text}</span>
            </li>
          ))}
        </ul>

        <form id="delete-account-form" onSubmit={s.handleSubmit} noValidate>
          <PasswordInput
            ref={s.passwordRef}
            label={DELETE_STRINGS.password}
            hint={DELETE_STRINGS.passwordHint}
            name="password"
            autoComplete="current-password"
            value={s.password}
            readOnly={s.isLoading}
            error={s.passwordError}
            onChange={(e) => s.changePassword(e.target.value)}
          />
        </form>

        {s.banner && (
          <AlertBanner variant="error" action={{ label: 'Tentar novamente', onClick: s.retry }}>
            {s.banner}
          </AlertBanner>
        )}

        <DialogFooter>
          <Button
            type="button"
            variant="secondary"
            disabled={s.isLoading}
            onClick={() => onOpenChange(false)}
          >
            {DELETE_STRINGS.cancel}
          </Button>
          <Button type="submit" form="delete-account-form" variant="destructive" loading={s.isLoading}>
            {DELETE_STRINGS.submit}
          </Button>
        </DialogFooter>
        <span className="sr-only" role="status">
          {s.isLoading ? 'Excluindo conta' : ''}
        </span>
      </DialogContent>
    </Dialog>
  );
};
