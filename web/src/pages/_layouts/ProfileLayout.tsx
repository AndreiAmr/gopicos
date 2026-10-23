import { useEffect, useState } from 'react';
import { Link, Navigate, NavLink, Outlet, useLocation } from 'react-router';
import {
  ArrowLeftIcon,
  LockIcon,
  LogOutIcon,
  MapPinIcon,
  StarIcon,
  UserIcon,
  type LucideIcon,
} from 'lucide-react';

import { Button } from '@/atomic/atoms/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { NavigationSetter } from '@/NavigationSetter';
import { PROFILE_STRINGS } from '@/pages/app/profile/profileLogic';
import { URL } from '@/routes/url';
import { logout } from '@/utils/logout';
import { getToken } from '@/utils/session';

type MenuItem = { to: string; label: string; icon: LucideIcon; end?: boolean };

const MENU: MenuItem[] = [
  { to: URL.PROFILE, label: PROFILE_STRINGS.myData, icon: UserIcon, end: true },
  { to: URL.PROFILE_PASSWORD, label: 'Alterar senha', icon: LockIcon },
  { to: URL.PROFILE_SPOTS, label: 'Meus picos', icon: MapPinIcon },
  { to: URL.PROFILE_REVIEWS, label: 'Minhas avaliações', icon: StarIcon },
];

const itemClass = 'flex min-h-12 items-center gap-3 rounded-md px-3 text-body-strong outline-none focus-visible:ring-2 focus-visible:ring-gp-focus';

/**
 * Layout das páginas de perfil (spec de perfil, 4.2): menu lateral em `md+`
 * (em coluna única abaixo disso), conteúdo à direita e "Sair" com confirmação (P7).
 */
export const ProfileLayout = () => {
  const [confirmingLogout, setConfirmingLogout] = useState(false);
  const location = useLocation();

  // Troca de rota: o título da aba e o foco da área de conteúdo.
  useEffect(() => {
    document.title = PROFILE_STRINGS.pageTitle;
  }, [location.pathname]);

  // Sem sessão: vai ao Login guardando a rota pretendida (o guard geral é a GP-028).
  if (!getToken()) {
    return <Navigate to={URL.LOGIN} replace state={{ from: location.pathname }} />;
  }

  return (
    <div className="min-h-full w-full bg-gp-bg">
      <NavigationSetter />
      <header className="border-b border-gp-divider bg-gp-surface">
        <div className="mx-auto flex max-w-[1120px] items-center px-4 py-2">
          <Link
            to={URL.HOME}
            className="flex min-h-12 items-center gap-2 rounded-md text-body-strong text-gp-primary-text outline-none focus-visible:ring-2 focus-visible:ring-gp-focus"
          >
            <ArrowLeftIcon className="size-5" aria-hidden="true" />
            Voltar ao mapa
          </Link>
        </div>
      </header>

      <div className="mx-auto flex max-w-[1120px] flex-col gap-6 px-4 py-6 md:flex-row md:gap-10">
        <nav aria-label="Perfil" className="flex flex-col gap-1 md:w-60 md:shrink-0">
          {MENU.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                cn(
                  itemClass,
                  'border-l-[3px] border-transparent text-gp-text hover:bg-gp-sunken',
                  isActive &&
                    'border-gp-primary bg-gp-primary-soft text-gp-primary-text',
                )
              }
            >
              <Icon className="size-5" aria-hidden="true" />
              {label}
            </NavLink>
          ))}

          <div className="my-2 border-t border-gp-divider" role="separator" />

          <button
            type="button"
            onClick={() => setConfirmingLogout(true)}
            className={cn(itemClass, 'text-gp-text hover:bg-gp-sunken')}
          >
            <LogOutIcon className="size-5" aria-hidden="true" />
            {PROFILE_STRINGS.logout}
          </button>
        </nav>

        <main className="w-full max-w-[640px] flex-1">
          <Outlet />
        </main>
      </div>

      <Dialog open={confirmingLogout} onOpenChange={setConfirmingLogout}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{PROFILE_STRINGS.logoutTitle}</DialogTitle>
            <DialogDescription>{PROFILE_STRINGS.logoutText}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="secondary"
              autoFocus
              onClick={() => setConfirmingLogout(false)}
            >
              {PROFILE_STRINGS.cancel}
            </Button>
            <Button
              onClick={() => {
                setConfirmingLogout(false);
                void logout();
              }}
            >
              {PROFILE_STRINGS.logout}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
