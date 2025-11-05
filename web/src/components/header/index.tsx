import { Button } from '@/atomic/atoms/button';
import { Bell, Logs, UserRound } from 'lucide-react';
import { SidebarTrigger } from '../ui/sidebar';

import { PlaceSearch } from './PlaceSearch';
import { useHeader } from './useHeader';

export const Header = () => {
  const { showPlaceSearch } = useHeader();

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

        <Button variant="ghost">
          <UserRound />
        </Button>
      </div>
    </div>
  );
};
