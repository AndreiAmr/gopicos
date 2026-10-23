import { AlertBanner } from '@/atomic/molecules/alertBanner';
import { Button } from '@/atomic/atoms/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { spotDetailsStrings } from '@/domain/spot/details';

type DeleteSpotDialogProps = {
  open: boolean;
  deleting: boolean;
  /** Erro mostrado dentro da confirmação, que continua aberta. */
  error: string | null;
  onConfirm: () => void;
  onClose: () => void;
};

/**
 * Confirmação de exclusão (picos.md 8 / picos-fechamento.md 6): dialog 420,
 * `alertdialog`, foco inicial em Cancelar, Cancelar à esquerda e Excluir à
 * direita. Enquanto exclui, não fecha.
 */
export const DeleteSpotDialog = ({
  open,
  deleting,
  error,
  onConfirm,
  onClose,
}: DeleteSpotDialogProps) => (
  <Dialog open={open} onOpenChange={(next) => !next && !deleting && onClose()}>
    <DialogContent
      role="alertdialog"
      className="sm:max-w-[420px]"
      showCloseButton={!deleting}
      onEscapeKeyDown={(e) => deleting && e.preventDefault()}
      onPointerDownOutside={(e) => deleting && e.preventDefault()}
    >
      <DialogHeader>
        <DialogTitle>{spotDetailsStrings.deleteTitle}</DialogTitle>
        <DialogDescription>{spotDetailsStrings.deleteDescription}</DialogDescription>
      </DialogHeader>

      {error ? <AlertBanner variant="error">{error}</AlertBanner> : null}

      <DialogFooter>
        <Button
          variant="secondary"
          autoFocus
          disabled={deleting}
          onClick={onClose}
        >
          {spotDetailsStrings.deleteCancel}
        </Button>
        <Button variant="destructive" loading={deleting} onClick={onConfirm}>
          {spotDetailsStrings.deleteConfirm}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);
