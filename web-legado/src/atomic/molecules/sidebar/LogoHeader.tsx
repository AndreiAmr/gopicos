import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { ChevronRight } from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

export const LogoHeader = () => {
  return (
    <SidebarMenu>
      <SidebarMenuItem className="p-0">
        <SidebarMenuButton tooltip="THIS IS TOOLTIP" size="lg">
          <Avatar className="h-8 w-8 rounded-lg">
            <AvatarImage src={'/skater.svg'} className="object-contain" />
            <AvatarFallback>Skateboarder</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <h2 className="font-title font-bold">GoPicos</h2>
            <p className="font-title ">Skageboard</p>
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
};
