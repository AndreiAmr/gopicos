import { useState } from 'react';
import { Link } from 'react-router';
import { Button } from '@/atomic/atoms/button';
import { Bell, LogOut, Logs, UserRound } from 'lucide-react';
import { LogoutDialog } from '@/components/LogoutDialog';
import { PROFILE_STRINGS } from '@/pages/app/profile/profileLogic';
import { URL } from '@/routes/url';
import { SidebarTrigger } from '../ui/sidebar';

import { PlaceSearch } from './PlaceSearch';
import { useHeader } from './useHeader';

export const Header = () => {
  const { showPlaceSearch } = useHeader();
  const [confirmingLogout, setConfirmingLogout] = useState(false);

  return (
    <div className="w-full min-h-20 bg-sidebar z-10 border-b border-accent flex items-center px-5 gap-2 justify-between">
      <div className="flex items-center gap-3">
        <SidebarTrigger>
          <Button variant="ghost">
            <Logs />
          </Button>
        </SidebarTrigger>
      </div>

      {showPlaceSearch && (
        <div className="flex self-center">
          <PlaceSearch />
        </div>
      )}

      <div className="flex items-center gap-3">
        <Button variant="ghost">
          <Bell />
        </Button>

        <Button variant="ghost" asChild>
          <Link to={URL.PROFILE} aria-label="Meu perfil">
            <UserRound />
          </Link>
        </Button>

        <Button
          variant="ghost"
          aria-label={PROFILE_STRINGS.logout}
          onClick={() => setConfirmingLogout(true)}
        >
          <LogOut />
        </Button>
      </div>

      <LogoutDialog open={confirmingLogout} onOpenChange={setConfirmingLogout} />
    </div>
  );
};
