import { Button } from '@/atomic/atoms/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { PROFILE_STRINGS } from '@/pages/app/profile/profileLogic';
import { logout } from '@/utils/logout';

type LogoutDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

/**
 * P7 - Sair (perfil.md 10): confirmação com foco inicial em "Cancelar". Ao
 * confirmar, apaga a sessão e o cache e vai ao Login com `replace`.
 */
export const LogoutDialog = ({ open, onOpenChange }: LogoutDialogProps) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent role="alertdialog" className="sm:max-w-[400px]">
      <DialogHeader>
        <DialogTitle>{PROFILE_STRINGS.logoutTitle}</DialogTitle>
        <DialogDescription>{PROFILE_STRINGS.logoutText}</DialogDescription>
      </DialogHeader>
      <DialogFooter>
        <Button variant="secondary" autoFocus onClick={() => onOpenChange(false)}>
          {PROFILE_STRINGS.cancel}
        </Button>
        <Button
          onClick={() => {
            onOpenChange(false);
            void logout();
          }}
        >
          {PROFILE_STRINGS.logout}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);
