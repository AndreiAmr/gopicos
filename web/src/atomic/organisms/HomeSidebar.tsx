'use client';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarTrigger,
} from '@/components/ui/sidebar';

import { LogoHeader } from '../molecules/sidebar/LogoHeader';

import { SidebarItem } from '../atoms/SidebarItem';
import { ProfileSidebar } from '../atoms/ProfileMenu';

export const HomeSidebar = () => {
  return (
    <Sidebar
      variant="inset"
      collapsible="icon"
      className="bg-sidebar-background border border-r-1"
    >
      <SidebarHeader className="relative bg-sidebar-background">
        <LogoHeader />
        <div className="absolute right-[-20px]">
          <SidebarTrigger />
        </div>
      </SidebarHeader>
      <SidebarContent className="bg-sidebar-background">
        <SidebarItem />
      </SidebarContent>
      <SidebarFooter className="bg-sidebar-background">
        <ProfileSidebar imgSrc={''} name={''} />
      </SidebarFooter>
    </Sidebar>
  );
};
